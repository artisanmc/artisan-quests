package com.github.ibanetchep.msquests.core.service;

import com.github.ibanetchep.msquests.core.dto.QuestGroupConfigDTO;
import com.github.ibanetchep.msquests.core.mapper.QuestGroupMapper;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import com.github.ibanetchep.msquests.core.quest.config.QuestObjectiveConfig;
import com.github.ibanetchep.msquests.core.quest.config.QuestStageConfig;
import com.github.ibanetchep.msquests.core.quest.config.condition.ConditionChecker;
import com.github.ibanetchep.msquests.core.quest.config.condition.Conditions;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.core.registry.QuestConfigRegistry;
import com.github.ibanetchep.msquests.core.repository.QuestConfigLoad;
import com.github.ibanetchep.msquests.core.repository.QuestConfigRepository;
import com.github.ibanetchep.msquests.core.repository.KeyChange;
import com.github.ibanetchep.msquests.core.repository.KeyChangeRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class QuestConfigService {

    private final Logger logger;
    private final QuestConfigRegistry questRegistry;
    private final QuestConfigRepository questConfigRepository;
    private final QuestGroupMapper questGroupMapper;
    private final ConditionChecker conditionChecker;
    private final KeyChangeRepository keyChangeRepository;

    public QuestConfigService(
            Logger logger,
            QuestConfigRegistry questRegistry,
            QuestConfigRepository questConfigRepository,
            QuestGroupMapper questGroupMapper
    ) {
        this(logger, questRegistry, questConfigRepository, questGroupMapper, ConditionChecker.ALWAYS);
    }

    public QuestConfigService(
            Logger logger,
            QuestConfigRegistry questRegistry,
            QuestConfigRepository questConfigRepository,
            QuestGroupMapper questGroupMapper,
            ConditionChecker conditionChecker
    ) {
        this(logger, questRegistry, questConfigRepository, questGroupMapper, conditionChecker, KeyChangeRepository.NONE);
    }

    /**
     * @param conditionChecker checks the loaded requirements and objective conditions, to warn about bad ones
     * @param keyChangeRepository moves the stored rows of groups and quests whose key changed onto the new one
     */
    public QuestConfigService(
            Logger logger,
            QuestConfigRegistry questRegistry,
            QuestConfigRepository questConfigRepository,
            QuestGroupMapper questGroupMapper,
            ConditionChecker conditionChecker,
            KeyChangeRepository keyChangeRepository
    ) {
        this.conditionChecker = conditionChecker;
        this.keyChangeRepository = keyChangeRepository;
        this.logger = logger;
        this.questRegistry = questRegistry;
        this.questConfigRepository = questConfigRepository;
        this.questGroupMapper = questGroupMapper;
    }

    /**
     * Startup load: every group that parses is registered, broken files are logged and skipped,
     * so one bad file does not leave the server without quests. The rows of groups and quests whose key
     * changed are moved first; if that fails, the groups that declare a former key are skipped
     * too, rather than started over next to the progress they would no longer find.
     */
    public CompletableFuture<Void> loadQuestGroups() {
        return questConfigRepository.loadAllGroups()
                .thenCompose(load -> {
                    List<String> failures = new ArrayList<>(load.failures());
                    List<QuestGroupConfig> groups = mapGroups(load, failures);
                    List<KeyChange> changes = changesOf(load, groups);
                    return keyChangeRepository.apply(changes)
                            .handle((moved, e) -> {
                                if (e != null) {
                                    logger.log(Level.SEVERE, "Moving the saved progress onto changed keys failed", e);
                                    Set<String> changed = new HashSet<>();
                                    changes.forEach(change -> changed.add(groupOf(change)));
                                    groups.removeIf(group -> changed.contains(group.getKey()));
                                    changed.forEach(key -> failures.add("group '" + key
                                            + "': the saved progress could not be moved onto its changed keys"));
                                } else {
                                    logMoved(moved);
                                }
                                failures.forEach(f -> logger.severe("Quest group skipped: " + f));
                                publish(groups);
                                return (Void) null;
                            });
                })
                .exceptionally(e -> {
                    logger.log(Level.SEVERE, "Failed to load quest groups", e);
                    return null;
                });
    }

    /**
     * Admin reload: the new state replaces the current one only if every file parses and maps,
     * and the rows of groups and quests whose key changed could be moved. Otherwise nothing changes and
     * the returned future fails with the list of problems, so the server keeps running the
     * configs it had instead of losing the broken groups.
     */
    public CompletableFuture<Void> reloadQuestGroups() {
        return questConfigRepository.loadAllGroups().thenCompose(load -> {
            List<String> failures = new ArrayList<>(load.failures());
            List<QuestGroupConfig> groups = mapGroups(load, failures);

            if (!failures.isEmpty()) {
                failures.forEach(f -> logger.severe("Quest reload refused: " + f));
                throw new CompletionException(new QuestConfigReloadException(failures));
            }

            return keyChangeRepository.apply(changesOf(load, groups))
                    .handle((moved, e) -> {
                        if (e != null) {
                            logger.log(Level.SEVERE, "Quest reload refused: moving the saved progress onto changed keys failed", e);
                            throw new CompletionException(new QuestConfigReloadException(List.of(
                                    "the saved progress could not be moved onto the changed keys: " + e.getMessage())));
                        }
                        logMoved(moved);
                        publish(groups);
                        return (Void) null;
                    });
        });
    }

    /** The key changes of the groups that will be published: a group that failed to map moves nothing. */
    private static List<KeyChange> changesOf(QuestConfigLoad load, List<QuestGroupConfig> groups) {
        Set<String> keys = new HashSet<>();
        groups.forEach(group -> keys.add(group.getKey()));
        return load.keyChanges().stream().filter(change -> keys.contains(groupOf(change))).toList();
    }

    private static String groupOf(KeyChange change) {
        if (change instanceof KeyChange.Group group) return group.to();
        if (change instanceof KeyChange.Quest quest) return quest.group();
        if (change instanceof KeyChange.QuestMoved quest) return quest.group();
        if (change instanceof KeyChange.GroupUid group) return group.group();
        return ((KeyChange.QuestUid) change).group();
    }

    private void logMoved(KeyChangeRepository.Applied applied) {
        if (applied == null) return;
        if (applied.moved() > 0) {
            logger.info("Moved " + applied.moved() + " saved row(s) onto the changed keys of groups and quests.");
        }
        for (KeyChangeRepository.Left left : applied.left()) {
            logger.warning(left.rows() + " saved row(s) are still under '" + left.from() + "', which became '" + left.to()
                    + "' earlier: they are ignored. A server that still loads the content from before the change"
                    + " wrote them; publish the same content on every server.");
        }
    }

    private List<QuestGroupConfig> mapGroups(QuestConfigLoad load, List<String> failures) {
        List<QuestGroupConfig> groups = new ArrayList<>();
        for (QuestGroupConfigDTO dto : load.groups().values()) {
            try {
                groups.add(questGroupMapper.toEntity(dto));
            } catch (RuntimeException e) {
                logger.log(Level.WARNING, "Failed to build quest group " + dto.key(), e);
                failures.add("group '" + dto.key() + "': " + e.getMessage());
            }
        }
        return groups;
    }

    private void publish(List<QuestGroupConfig> groups) {
        groups.forEach(this::warnDuplicateObjectiveKeys);
        groups.forEach(this::warnInvalidConditions);
        questRegistry.replaceQuestGroupConfigs(groups);
        for (QuestGroupConfig group : groups) {
            logger.info("Loaded group " + group.getKey() + " with " + group.getQuestConfigs().size() + " quests.");
        }
    }

    /**
     * Progress is stored per (quest, objective key), without the stage: two objectives sharing a
     * key in different stages share one database row, and the later stage inherits the earlier
     * one's progress. Only warned, not refused, so an existing server keeps loading its quests.
     */
    private void warnDuplicateObjectiveKeys(QuestGroupConfig group) {
        for (QuestConfig quest : group.getQuestConfigs().values()) {
            Set<String> seen = new HashSet<>();
            Set<String> duplicates = new LinkedHashSet<>();
            for (QuestStageConfig stage : quest.getStages().values()) {
                for (String objectiveKey : stage.getObjectives().keySet()) {
                    if (!seen.add(objectiveKey)) {
                        duplicates.add(objectiveKey);
                    }
                }
            }
            if (!duplicates.isEmpty()) {
                logger.severe("Quest '" + group.getKey() + "/" + quest.getKey() + "' reuses objective key(s) "
                        + duplicates + " in several stages. Their progress is saved in the same row and will mix up;"
                        + " give every objective of a quest a distinct key.");
            }
        }
    }

    /**
     * A condition the platform would reject always fails (a quest that can never start, an
     * objective that never counts): warned at load rather than refused, like a duplicate key.
     */
    private void warnInvalidConditions(QuestGroupConfig group) {
        for (QuestConfig quest : group.getQuestConfigs().values()) {
            String path = group.getKey() + "/" + quest.getKey();
            warnInvalid(path + " requirements", quest.getRequirements());
            warnInvalid(path + " completed_when", quest.getCompletedWhen());
            for (QuestStageConfig stage : quest.getStages().values()) {
                for (QuestObjectiveConfig objective : stage.getObjectives().values()) {
                    warnInvalid(path + " objective " + objective.getKey() + " conditions", objective.getConditions());
                }
            }
        }
    }

    private void warnInvalid(String where, Conditions conditions) {
        if (conditions.isEmpty()) return;
        for (String problem : conditionChecker.validate(conditions)) {
            logger.warning("Quest " + where + ": " + problem + " (this condition never holds).");
        }
    }

    /** Thrown when a reload is refused; carries one human-readable line per problem. */
    public static class QuestConfigReloadException extends RuntimeException {
        private final List<String> failures;

        public QuestConfigReloadException(List<String> failures) {
            super(failures.size() + " quest config problem(s): " + String.join("; ", failures));
            this.failures = List.copyOf(failures);
        }

        public List<String> getFailures() {
            return failures;
        }
    }

}
