package com.github.ibanetchep.msquests.core.service;

import com.github.ibanetchep.msquests.core.event.*;
import com.github.ibanetchep.msquests.core.factory.QuestFactory;
import com.github.ibanetchep.msquests.core.quest.actor.ActorQuestGroup;
import com.github.ibanetchep.msquests.core.quest.actor.Quest;
import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import com.github.ibanetchep.msquests.core.quest.config.action.ActionChain;
import com.github.ibanetchep.msquests.core.quest.config.action.ChainContext;
import com.github.ibanetchep.msquests.core.quest.config.action.ChainRunner;
import com.github.ibanetchep.msquests.core.quest.config.group.DistributionConfig;
import com.github.ibanetchep.msquests.core.quest.config.group.DistributionTrigger;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestDistributionStrategy;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.core.quest.executor.AtomicQuestExecutor;
import com.github.ibanetchep.msquests.core.platform.MSQuestsPlatform;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjective;
import com.github.ibanetchep.msquests.core.quest.player.PlayerProfile;
import com.github.ibanetchep.msquests.core.quest.config.group.LadderSteps;
import java.util.Optional;
import java.util.OptionalInt;
import java.util.UUID;
import com.github.ibanetchep.msquests.core.quest.result.QuestRotateResult;
import com.github.ibanetchep.msquests.core.quest.result.QuestStartResult;
import com.github.ibanetchep.msquests.core.registry.QuestConfigRegistry;
import com.github.ibanetchep.msquests.core.registry.QuestRegistry;
import com.github.ibanetchep.msquests.core.repository.RotationRepository;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Level;
import java.util.logging.Logger;

public class QuestLifecycleService {

    private static final Logger logger = Logger.getLogger(QuestLifecycleService.class.getName());

    private final EventDispatcher dispatcher;
    private final AtomicQuestExecutor executor;
    private final QuestService persistenceService;
    private final QuestFactory questFactory;
    private final QuestRegistry questRegistry;
    private final QuestConfigRegistry questConfigRegistry;
    private final QuestDistributionService distributionManager;
    private final RotationRepository rotationRepository;
    private final MSQuestsPlatform platform;
    private final ChainRunner chains;
    private volatile LadderSteps ladderSteps = LadderSteps.NONE;

    public QuestLifecycleService(
            EventDispatcher dispatcher,
            QuestService persistenceService,
            QuestFactory questFactory,
            QuestRegistry questRegistry,
            QuestConfigRegistry questConfigRegistry,
            AtomicQuestExecutor executor,
            QuestDistributionService distributionManager,
            RotationRepository rotationRepository,
            MSQuestsPlatform platform,
            ChainRunner chains
    ) {
        this.dispatcher = dispatcher;
        this.persistenceService = persistenceService;
        this.questFactory = questFactory;
        this.questRegistry = questRegistry;
        this.questConfigRegistry = questConfigRegistry;
        this.executor = executor;
        this.distributionManager = distributionManager;
        this.rotationRepository = rotationRepository;
        this.platform = platform;
        this.chains = chains;
    }

    /**
     * Starts a quest for the given actor.
     * @param actor the actor to start the quest for
     * @param questConfig the quest configuration to use
     * @param strategy the distribution strategy to use
     * @return the result of the quest start attempt
     */
    public QuestStartResult startQuest(QuestActor actor, QuestConfig questConfig, QuestDistributionStrategy strategy, @Nullable PlayerProfile profile) {
        QuestStartResult validationResult = distributionManager.canStartQuest(actor, questConfig, strategy, profile);
        if(validationResult.isFailure()) {
            return validationResult;
        }

        CoreQuestStartEvent event = new CoreQuestStartEvent(actor, questConfig);
        dispatcher.dispatch(event);

        if(event.isCancelled()) {
            return QuestStartResult.CANCELLED_BY_EVENT;
        }

        Quest quest = questFactory.createQuest(questConfig, actor);

        CoreQuestStartedEvent startedEvent = new CoreQuestStartedEvent(quest);
        dispatcher.dispatch(startedEvent);

        chains.run(quest.getQuestGroup().getQuestStartActions(), ChainContext.of(quest));
        chains.run(questConfig.getStartActions(), ChainContext.of(quest));

        questRegistry.add(quest);
        persistenceService.saveQuest(quest);

        return QuestStartResult.SUCCESS;
    }

    public CompletableFuture<Quest> completeObjective(QuestObjective objective, @Nullable PlayerProfile profile) {
        UUID questId = objective.getQuest().getId();

        return executor.execute(questId, quest -> {
            objective.complete();
            var objectiveCompletedEvent = new CoreQuestObjectiveCompletedEvent(objective, profile);
            dispatcher.dispatch(objectiveCompletedEvent);
            if (objective.getStage().isCompleted()) {
                dispatcher.dispatch(new CoreQuestStageCompletedEvent(objective.getStage(), profile));
            }

            chains.run(quest.getQuestGroup().getObjectiveCompleteActions(), ChainContext.of(objective));
            chains.run(quest.getQuestConfig().getObjectiveCompleteActions(), ChainContext.of(objective));

            if (quest.shouldComplete()) {
                finalizeQuestCompletion(quest);
            }

            persistenceService.saveQuest(objective.getQuest()).join();
        });
    }

    /**
     * Force-completes a quest, rewards included. A no-op once the quest is no longer in progress:
     * two requests queued for the same quest (a double click, a chain calling it twice) would
     * otherwise both pass and pay the rewards twice.
     */
    public void completeQuest(Quest quest) {
        executor.execute(quest.getId(), updatedQuest -> {
            if (!updatedQuest.isActive()) return;
            finalizeQuestCompletion(updatedQuest);
            persistenceService.saveQuest(updatedQuest).join();
        });
    }

    /**
     * Abandons a quest: it ends {@link QuestStatus#FAILED}, frees its active slot and stays
     * counted in its period, so abandoning cannot be used to draw quests again. A no-op once the
     * quest is no longer in progress, like {@link #completeQuest}.
     */
    public void abandonQuest(Quest quest) {
        executor.execute(quest.getId(), updatedQuest -> {
            if (!updatedQuest.isActive()) return;
            updatedQuest.setStatus(QuestStatus.FAILED);
            dispatcher.dispatch(new CoreQuestAbandonedEvent(updatedQuest));
            persistenceService.saveQuest(updatedQuest).join();
        });
    }

    /**
     * Brings the actor's quests in progress in line with the content they were just rebuilt from.
     * A quest only reacts when one of its objectives completes in play; a change of content can
     * complete an objective (a target lowered under the progress) or leave the quest with nothing
     * to do (its last stage removed), and nothing would ever follow.
     *
     * <p>Each objective completed that way gets its completion now: event, {@code
     * objective_complete} actions, and the stage's event once when it ends with it. A quest with
     * nothing left is then completed, rewards included. What the actor already passed is left
     * alone: nothing is run twice.
     */
    public void settleLoadedQuests(QuestActor actor) {
        for (Quest quest : List.copyOf(actor.getQuests().values())) {
            if (!quest.isActive() || !(quest.shouldComplete() || hasUnrecordedCompletion(quest))) continue;
            executor.execute(quest.getId(), updatedQuest -> {
                if (!updatedQuest.isActive()) return;
                boolean changed = false;
                for (com.github.ibanetchep.msquests.core.quest.actor.QuestStage stage : updatedQuest.getStagesList()) {
                    boolean ended = false;
                    for (QuestObjective objective : stage.getObjectiveList()) {
                        if (objective.isCompletionRecorded()) continue;
                        objective.complete();
                        dispatcher.dispatch(new CoreQuestObjectiveCompletedEvent(objective, null));
                        chains.run(updatedQuest.getQuestGroup().getObjectiveCompleteActions(), ChainContext.of(objective));
                        chains.run(updatedQuest.getQuestConfig().getObjectiveCompleteActions(), ChainContext.of(objective));
                        ended = true;
                        changed = true;
                    }
                    if (ended && !stage.isPassed() && stage.isCompleted()) {
                        dispatcher.dispatch(new CoreQuestStageCompletedEvent(stage, null));
                    }
                }
                if (updatedQuest.shouldComplete()) {
                    finalizeQuestCompletion(updatedQuest);
                    changed = true;
                }
                if (changed) persistenceService.saveQuest(updatedQuest).join();
            });
        }
    }

    private static boolean hasUnrecordedCompletion(Quest quest) {
        return quest.getObjectives().stream().anyMatch(objective -> !objective.isCompletionRecorded());
    }

    private void finalizeQuestCompletion(Quest quest) {
        var questCompleteEvent = new CoreQuestCompletedEvent(quest);
        dispatcher.dispatch(questCompleteEvent);
        quest.setStatus(QuestStatus.COMPLETED);
        quest.setCompletedAt(new Date());

        QuestGroupConfig groupConfig = quest.getQuestGroup();

        boolean inOrder = groupConfig.getDistributionStrategy() == QuestDistributionStrategy.SEQUENTIAL;
        if (!inOrder && groupConfig.hasDistributionTrigger(DistributionTrigger.QUEST_COMPLETE)) {
            triggerDistribution(quest.getActor(), groupConfig);
        }

        platform.runSync(() -> {
            chains.run(quest.getQuestConfig().getRewards(), ChainContext.of(quest));
            chains.run(groupConfig.getQuestCompleteActions(), ChainContext.of(quest));
            checkAllPeriodQuestsComplete(quest.getActor(), groupConfig);
            // The rewards are what make a step done: read the ladder after them.
            if (inOrder) syncLadder(quest.getActor(), groupConfig);
        });
    }

    /** Takes a quest out of memory and deletes its row in the background: it never counted. */
    private void drop(ActorQuestGroup actorGroup, Quest quest) {
        actorGroup.removeQuest(quest);
        quest.getActor().removeQuest(quest);
        questRegistry.remove(quest);
        persistenceService.deleteQuest(quest).exceptionally(e -> {
            logger.log(Level.WARNING, "Failed to delete quest " + quest.getId(), e);
            return null;
        });
    }

    /** How the platform reads a ladder step's {@code completed_when}; {@link LadderSteps#NONE} until set. */
    public void setLadderSteps(LadderSteps ladderSteps) {
        this.ladderSteps = ladderSteps;
    }

    /**
     * The index of a ladder's current step for the actor: the first one that is not done, the
     * number of steps when all are. A step without {@code completed_when} is done once the actor
     * started it and it ended, or when it was never started and a later step was (a step inserted
     * behind the actor). Empty when the group is not in list order or a step cannot be read now.
     */
    public OptionalInt ladderIndex(QuestActor actor, QuestGroupConfig groupConfig, @Nullable UUID viewer) {
        if (groupConfig.getDistributionStrategy() != QuestDistributionStrategy.SEQUENTIAL) return OptionalInt.empty();
        ActorQuestGroup actorGroup = actor.getActorQuestGroup(groupConfig);
        if (actorGroup == null) return OptionalInt.empty();
        List<QuestConfig> steps = groupConfig.getOrderedQuests();
        int lastStarted = -1;
        for (int i = 0; i < steps.size(); i++) {
            if (actorGroup.hasStarted(steps.get(i).getKey())) lastStarted = i;
        }
        for (int i = 0; i < steps.size(); i++) {
            QuestConfig step = steps.get(i);
            boolean done;
            if (step.getCompletedWhen().isEmpty()) {
                // Started once and no longer running: behind, however it ended. Never started, with
                // a later step started: it was added behind the actor, and is behind them too.
                done = actorGroup.hasStarted(step.getKey())
                        ? !actorGroup.hasActive(step.getKey())
                        : i < lastStarted;
            } else {
                Optional<Boolean> read = ladderSteps.done(actor, step, viewer);
                if (read.isEmpty()) return OptionalInt.empty();
                done = read.get();
            }
            if (!done) return OptionalInt.of(i);
        }
        return OptionalInt.of(steps.size());
    }

    public void syncLadder(QuestActor actor, QuestGroupConfig groupConfig) {
        syncLadder(actor, groupConfig, null);
    }

    /**
     * Puts a {@link QuestDistributionStrategy#SEQUENTIAL} group in step with the actor: its current
     * step ({@link #ladderIndex}) is the only quest active. Another active step is dropped without
     * counting as a failure, and a step completed before is offered again when it becomes the
     * current one. Nothing changes while the steps cannot be read.
     */
    public void syncLadder(QuestActor actor, QuestGroupConfig groupConfig, @Nullable UUID viewer) {
        if (!groupConfig.isActive()) return;
        OptionalInt index = ladderIndex(actor, groupConfig, viewer);
        ActorQuestGroup actorGroup = actor.getActorQuestGroup(groupConfig);
        if (index.isEmpty() || actorGroup == null) return;

        List<QuestConfig> steps = groupConfig.getOrderedQuests();
        QuestConfig current = index.getAsInt() < steps.size() ? steps.get(index.getAsInt()) : null;

        for (QuestConfig step : steps) {
            if (current != null && step.getKey().equals(current.getKey())) continue;
            Quest stale = actorGroup.getActiveQuestByKey(step.getKey());
            if (stale != null) drop(actorGroup, stale);
        }
        if (current != null && !actorGroup.hasActive(current.getKey())
                && startQuest(actor, current, QuestDistributionStrategy.SEQUENTIAL, null).isSuccess()) {
            chains.run(groupConfig.getQuestDistributionActions(), ChainContext.of(actor, groupConfig));
        }
    }

    /**
     * Expires all quests that should expire for the given actor.
     * Sets status synchronously in memory, persists asynchronously.
     * @param actor the actor to expire quests for
     * @return true if any quests were expired
     */
    public boolean expireQuests(QuestActor actor) {
        List<Quest> toExpire = actor.getQuests().values().stream()
                .filter(Quest::shouldExpire)
                .toList();

        toExpire.forEach(quest -> {
            quest.setStatus(QuestStatus.EXPIRED);
            dispatcher.dispatch(new CoreQuestExpiredEvent(quest));
            persistenceService.saveQuest(quest);
        });

        return !toExpire.isEmpty();
    }

    /**
     * Rotates a quest for the given actor, replacing it with a random alternative from the same group.
     * The old quest is deleted and a new one is started.
     * @param actor the actor to rotate the quest for
     * @param quest the quest to rotate
     * @return the result of the rotation attempt
     */
    public QuestRotateResult rotateQuest(QuestActor actor, Quest quest) {
        QuestGroupConfig groupConfig = quest.getQuestGroup();

        if (!groupConfig.isRotatable()) {
            return QuestRotateResult.NOT_ROTATABLE;
        }

        if (!quest.isActive()) {
            return QuestRotateResult.QUEST_NOT_ACTIVE;
        }

        ActorQuestGroup actorGroup = actor.getActorQuestGroup(groupConfig);
        if (actorGroup == null) {
            return QuestRotateResult.GROUP_NOT_FOUND;
        }

        if (!actorGroup.canRotate()) {
            return QuestRotateResult.MAX_ROTATIONS_REACHED;
        }

        String oldQuestKey = quest.getQuestConfig().getKey();

        List<QuestConfig> candidates = new ArrayList<>(actorGroup.getNotInProgress());
        candidates.removeIf(qc -> qc.getKey().equals(oldQuestKey));
        Collections.shuffle(candidates);

        if (candidates.isEmpty()) {
            return QuestRotateResult.NO_ALTERNATIVE_AVAILABLE;
        }

        // Delete old quest. The row goes away in the background: the quest is already out
        // of memory, and a rotation is a click on the player's thread, so it never waits
        // on the connection pool.
        drop(actorGroup, quest);

        // Start new quest
        for (QuestConfig candidate : candidates) {
            QuestStartResult startResult = startQuest(actor, candidate, QuestDistributionStrategy.RANDOM, null);
            if (startResult.isSuccess()) {
                actorGroup.incrementRotations();
                rotationRepository.save(actor.getId(), groupConfig.getStorageId()).exceptionally(e -> {
                    logger.log(Level.WARNING, "Failed to save rotation count", e);
                    return null;
                });
                return QuestRotateResult.SUCCESS;
            }
        }

        return QuestRotateResult.NO_ALTERNATIVE_AVAILABLE;
    }

    /**
     * Expires outdated quests and fires actor_load actions for all matching groups.
     * @param actor the actor to refresh
     */
    public void refreshActor(QuestActor actor) {
        boolean expired = expireQuests(actor);
        if (expired) {
            fireActorLoadActions(actor);
            return;
        }
        syncLadders(actor);
    }

    /** {@link #syncLadder} for every ladder group of the actor's type. */
    public void syncLadders(QuestActor actor) {
        for (QuestGroupConfig groupConfig : questConfigRegistry.getQuestGroupConfigs().values()) {
            if (groupConfig.getActorType().equalsIgnoreCase(actor.getActorType())) syncLadder(actor, groupConfig);
        }
    }

    /**
     * Fires actor_load actions for all matching groups.
     * @param actor the actor to fire actions for
     */
    public void fireActorLoadActions(QuestActor actor) {
        for (QuestGroupConfig groupConfig : questConfigRegistry.getQuestGroupConfigs().values()) {
            if (!groupConfig.getActorType().equalsIgnoreCase(actor.getActorType())) continue;
            if (!groupConfig.isActive()) continue;

            chains.run(groupConfig.getActorLoadActions(), ChainContext.of(actor, groupConfig));

            if (groupConfig.getDistributionStrategy() == QuestDistributionStrategy.SEQUENTIAL) {
                syncLadder(actor, groupConfig); // a ladder follows its steps, whatever its triggers
            } else if (groupConfig.hasDistributionTrigger(DistributionTrigger.ACTOR_LOAD)) {
                triggerDistribution(actor, groupConfig);
            }
        }
    }

    /**
     * Distributes quests to the given actor based on the specified strategy.
     * @param actor the actor to distribute quests to
     * @param groupConfig the group configuration to use
     * @param strategy the distribution strategy to use
     * @param maxToDistribute the maximum number of quests to distribute
     * @return the number of quests distributed
     */
    public int distributeQuests(QuestActor actor, QuestGroupConfig groupConfig, QuestDistributionStrategy strategy, int maxToDistribute) {
        ActorQuestGroup actorQuestGroup = actor.getActorQuestGroup(groupConfig);

        if(actorQuestGroup == null) {
            logger.warning("distributeQuests: actorQuestGroup is null for actor " + actor.getName() + " (type=" + actor.getActorType() + ") group " + groupConfig.getKey() + " (type=" + groupConfig.getActorType() + ")");
            return 0;
        }

        int startedCount = 0;
        List<QuestConfig> candidates = distributionManager.getCandidatesForStrategy(groupConfig, strategy);

        for(QuestConfig candidate : candidates) {
            if(startedCount >= maxToDistribute) {
                break;
            }

            QuestStartResult result = startQuest(actor, candidate, strategy, null);

            if (result.isFailure()) {
                continue;
            }

            startedCount++;
        }

        return startedCount;
    }

    private void checkAllPeriodQuestsComplete(QuestActor actor, QuestGroupConfig groupConfig) {
        ActionChain actions = groupConfig.getAllPeriodQuestsCompleteActions();
        if (actions.isEmpty()) {
            return;
        }

        ActorQuestGroup actorGroup = actor.getActorQuestGroup(groupConfig);
        if (actorGroup == null) {
            return;
        }

        // All quests complete = none still active (in progress) AND at least one completed
        boolean allCompleted = actorGroup.getInProgressCount() == 0
                && actorGroup.getCompletedCount() > 0;

        if (allCompleted) {
            chains.run(actions, ChainContext.of(actor, groupConfig));
        }
    }

    /**
     * Triggers distribution for an actor based on the group's distribution config.
     * Also fires quest_distribution actions if any quests were distributed.
     * @param actor the actor to distribute quests to
     * @param groupConfig the group configuration with distribution settings
     */
    public void triggerDistribution(QuestActor actor, QuestGroupConfig groupConfig) {
        DistributionConfig dc = groupConfig.getDistributionConfig();
        if (dc == null) return;
        if (dc.getStrategy() == QuestDistributionStrategy.SEQUENTIAL) {
            syncLadder(actor, groupConfig);
            return;
        }

        int distributed = distributeQuests(actor, groupConfig, dc.getStrategy(), dc.getAmount());
        if (distributed > 0) {
            chains.run(groupConfig.getQuestDistributionActions(), ChainContext.of(actor, groupConfig));
        }
    }
}
