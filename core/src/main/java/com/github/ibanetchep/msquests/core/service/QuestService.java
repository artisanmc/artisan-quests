package com.github.ibanetchep.msquests.core.service;

import com.github.ibanetchep.msquests.core.registry.QuestRegistry;
import com.github.ibanetchep.msquests.core.dto.QuestDTO;
import com.github.ibanetchep.msquests.core.factory.QuestFactory;
import com.github.ibanetchep.msquests.core.mapper.QuestMapper;
import com.github.ibanetchep.msquests.core.quest.actor.ActorQuestGroup;
import com.github.ibanetchep.msquests.core.quest.actor.Quest;
import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.core.registry.QuestConfigRegistry;
import com.github.ibanetchep.msquests.core.repository.QuestRepository;
import com.github.ibanetchep.msquests.core.repository.RotationRepository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

public class QuestService {

    private final Logger logger;
    private final QuestConfigRegistry questConfigRegistry;
    private final QuestRepository questRepository;
    private final RotationRepository rotationRepository;
    private final QuestFactory questFactory;
    private final QuestRegistry questRegistry;
    private final QuestMapper questMapper;

    /**
     * Config keys already reported as missing. A quest dropped from the YAML is orphaned for
     * every actor that ever had it, so without this the same fact is logged once per player,
     * on every load. Rows are deliberately kept — pruning them would turn any config loading
     * glitch into permanent data loss.
     */
    private final Set<String> reportedMissingConfigs = ConcurrentHashMap.newKeySet();

    public QuestService(
            Logger logger,
            QuestConfigRegistry questConfigRegistry,
            QuestRepository questRepository,
            RotationRepository rotationRepository,
            QuestFactory questFactory,
            QuestRegistry questRegistry,
            QuestMapper questMapper
    ) {
        this.logger = logger;
        this.questConfigRegistry = questConfigRegistry;
        this.questRepository = questRepository;
        this.rotationRepository = rotationRepository;
        this.questFactory = questFactory;
        this.questRegistry = questRegistry;
        this.questMapper = questMapper;
    }

    /**
     * Loads, or reloads, every stored quest of the actor. The actor's quests are replaced in one
     * step once everything has been read, so a reload neither empties the actor meanwhile nor
     * leaves the previous instances (and their stale group config) next to the new ones.
     */
    public CompletableFuture<Void> loadQuests(QuestActor actor) {
        Instant loadStartedAt = Instant.now();

        CompletableFuture<Map<QuestGroupConfig, Integer>> rotations = loadRotationCounts(actor);

        return questRepository.getAllByActor(actor.getId())
                .thenCombine(rotations, (questEntryDtos, rotationCounts) -> {
                    List<Quest> loaded = new ArrayList<>();
                    List<Quest> withoutReachedStage = new ArrayList<>();
                    Map<QuestGroupConfig, Integer> heldSlots = new HashMap<>();

                    for (QuestDTO questDTO : questEntryDtos.values()) {
                        QuestConfig questConfig = resolveConfig(questDTO);
                        if (questConfig == null) {
                            holdSlot(questDTO, heldSlots);
                            continue;
                        }
                        QuestGroupConfig questGroupConfig = questConfig.getGroupConfig();

                        if (!isInCurrentPeriod(questGroupConfig, questDTO)) {
                            continue;
                        }

                        Quest quest = questFactory.buildQuest(questConfig, actor, questDTO);
                        loaded.add(quest);
                        if (questDTO.reachedStage() == null && quest.isActive() && quest.getReachedStageKey() != null) {
                            withoutReachedStage.add(quest);
                        }
                    }

                    Collection<Quest> previous = actor.replaceLoadedQuests(loaded, rotationCounts, loadStartedAt);
                    heldSlots.forEach((group, count) -> {
                        ActorQuestGroup actorGroup = actor.getActorQuestGroup(group);
                        if (actorGroup != null) actorGroup.setHeldSlots(count);
                    });

                    // Register the new instances before dropping the old ones: pending progress is
                    // resolved by quest id, and must never find the id missing in between.
                    for (Quest quest : actor.getQuests().values()) {
                        questRegistry.add(quest);
                    }
                    for (Quest old : previous) {
                        if (!actor.getQuests().containsKey(old.getId())) {
                            questRegistry.remove(old);
                        }
                    }

                    // A row from before the stage reached was recorded: write it now, while the
                    // content is the one the quest was last played with, so the next change of
                    // content finds it.
                    for (Quest quest : withoutReachedStage) {
                        if (actor.getQuests().get(quest.getId()) == quest) saveQuest(quest);
                    }
                    return (Void) null;
                })
                .exceptionally(e -> {
                    logger.log(Level.SEVERE, "Failed to load quests", e);
                    return null;
                });
    }


    /**
     * The config a stored quest belongs to, or null (logged once) when it is no longer loaded.
     * A row names its quest by {@code (group key, quest key)}; the rows of a quest whose key changed
     * were moved onto the new one before the configs were published (see {@code KeyChange}).
     */
    private QuestConfig resolveConfig(QuestDTO questDTO) {
        QuestGroupConfig questGroupConfig = questConfigRegistry.getQuestGroupConfigs().get(questDTO.groupKey());
        if (questGroupConfig == null) {
            warnMissingConfigOnce("group:" + questDTO.groupKey(),
                    "Quest group '" + questDTO.groupKey() + "' is no longer defined in the configs"
                            + " (first seen on quest '" + questDTO.questKey() + "').");
            return null;
        }

        QuestConfig questConfig = questGroupConfig.getQuestConfigs().get(questDTO.questKey());
        if (questConfig == null) {
            warnMissingConfigOnce("quest:" + questDTO.groupKey() + "/" + questDTO.questKey(),
                    "Quest '" + questDTO.questKey() + "' is no longer defined in group '"
                            + questDTO.groupKey() + "'.");
        }
        return questConfig;
    }

    /**
     * A quest in progress whose group is still there but whose own config is not (taken out of the
     * group, for a while or by mistake) keeps the active slot it holds: freeing it would hand the
     * actor another quest, and one too many once the quest is back.
     */
    private void holdSlot(QuestDTO questDTO, Map<QuestGroupConfig, Integer> heldSlots) {
        if (questDTO.status() != QuestStatus.IN_PROGRESS) return;
        QuestGroupConfig group = questConfigRegistry.getQuestGroupConfigs().get(questDTO.groupKey());
        if (group == null || !isInCurrentPeriod(group, questDTO)) return;
        heldSlots.merge(group, 1, Integer::sum);
    }

    /**
     * Logs a missing config once per key. The saved rows are left untouched: they are ignored
     * while the config is missing, and pick up again if it comes back.
     */
    private void warnMissingConfigOnce(String key, String message) {
        if (reportedMissingConfigs.add(key)) {
            logger.warning(message + " Its saved data is kept but ignored;"
                    + " further occurrences are not logged until the configs are reloaded.");
        }
    }

    /** Lets the next load report missing configs again, after the YAML files were re-read. */
    public void clearMissingConfigReports() {
        reportedMissingConfigs.clear();
    }

    public CompletableFuture<Void> saveQuest(Quest quest) {
        return questRepository.save(questMapper.toDTO(quest)).exceptionally(e -> {
            logger.log(Level.SEVERE, "Failed to save quest", e);
            return null;
        });
    }

    /** Rotations already used this period, per rotatable group the actor can hold. */
    private CompletableFuture<Map<QuestGroupConfig, Integer>> loadRotationCounts(QuestActor actor) {
        Map<QuestGroupConfig, Integer> counts = new ConcurrentHashMap<>();
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (QuestGroupConfig groupConfig : questConfigRegistry.getQuestGroupConfigs().values()) {
            if (!groupConfig.isRotatable()) continue;
            if (!groupConfig.getActorType().equalsIgnoreCase(actor.getActorType())) continue;

            Instant periodStart = groupConfig.getPeriodStart();
            Instant periodEnd = groupConfig.getPeriodEnd();

            CompletableFuture<Void> future = rotationRepository.countInPeriod(actor.getId(), groupConfig.getStorageId(), periodStart, periodEnd)
                    .thenAccept(count -> counts.put(groupConfig, count))
                    .exceptionally(e -> {
                        // Keep the count already in memory: falling back to 0 would hand out
                        // rotations the actor has already used this period.
                        logger.log(Level.WARNING, "Failed to load rotation count for group " + groupConfig.getKey()
                                + ", keeping the current count", e);
                        ActorQuestGroup current = actor.getActorQuestGroup(groupConfig);
                        counts.put(groupConfig, current != null ? current.getRotationsInPeriod() : 0);
                        return null;
                    });

            futures.add(future);
        }

        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).thenApply(v -> counts);
    }

    private boolean isInCurrentPeriod(QuestGroupConfig groupConfig, QuestDTO questDTO) {
        Instant periodStart = groupConfig.getPeriodStart();
        Instant periodEnd = groupConfig.getPeriodEnd();

        if (periodStart == null && periodEnd == null) {
            return true;
        }

        Instant createdAt = questDTO.createdAt() != null ? Instant.ofEpochMilli(questDTO.createdAt()) : null;
        if (createdAt == null) {
            return true;
        }

        return (periodStart == null || createdAt.isAfter(periodStart))
                && (periodEnd == null || createdAt.isBefore(periodEnd));
    }

    /**
     * Expires in storage every quest of {@code group} still in progress that was created before
     * {@code createdBefore}: those of the actors not loaded, which nothing else would expire
     * until they come back. Loaded actors are expired in memory by the caller.
     */
    public CompletableFuture<Integer> expireInProgress(QuestGroupConfig group, Instant createdBefore) {
        return questRepository.expireInProgress(group, createdBefore).exceptionally(e -> {
            logger.log(Level.SEVERE, "Failed to expire the quests of group " + group.getKey(), e);
            return 0;
        });
    }

    public CompletableFuture<Void> deleteQuest(Quest quest) {
        return questRepository.delete(quest.getId()).exceptionally(e -> {
            logger.log(Level.SEVERE, "Failed to delete quest", e);
            return null;
        });
    }
}
