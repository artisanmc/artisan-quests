package com.github.ibanetchep.msquests.core.service;

import com.github.ibanetchep.msquests.core.dto.QuestDTO;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveConfigDTO;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveDTO;
import com.github.ibanetchep.msquests.core.event.CoreEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestCompletedEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestObjectiveCompletedEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestStageCompletedEvent;
import com.github.ibanetchep.msquests.core.factory.QuestFactory;
import com.github.ibanetchep.msquests.core.factory.QuestObjectiveFactory;
import com.github.ibanetchep.msquests.core.lang.Translator;
import com.github.ibanetchep.msquests.core.mapper.QuestMapper;
import com.github.ibanetchep.msquests.core.platform.MSQuestsPlatform;
import com.github.ibanetchep.msquests.core.quest.actor.ActorQuestGroup;
import com.github.ibanetchep.msquests.core.quest.actor.Quest;
import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStage;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import com.github.ibanetchep.msquests.core.quest.config.QuestObjectiveConfig;
import com.github.ibanetchep.msquests.core.quest.config.QuestStageConfig;
import com.github.ibanetchep.msquests.core.quest.config.action.ActionChain;
import com.github.ibanetchep.msquests.core.quest.config.condition.Conditions;
import com.github.ibanetchep.msquests.core.quest.config.group.DistributionConfig;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestDistributionStrategy;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.core.quest.objective.AbstractQuestObjective;
import com.github.ibanetchep.msquests.core.quest.objective.Flow;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjective;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjectiveStatus;
import com.github.ibanetchep.msquests.core.quest.result.QuestStartResult;
import com.github.ibanetchep.msquests.core.registry.QuestConfigRegistry;
import com.github.ibanetchep.msquests.core.registry.QuestRegistry;
import com.github.ibanetchep.msquests.core.repository.QuestRepository;
import com.github.ibanetchep.msquests.core.repository.RotationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * What a quest in progress becomes when its content changes under it: one test per kind of change,
 * each asserting what the server does today.
 *
 * <p>A test named {@code safe…} states a behaviour to keep: what the actor has done or passed stays
 * theirs, whatever the content becomes. A test named {@code harmful…} pins a loss or a false state
 * that still exists: it is meant to be turned around by its fix, never to be kept green as it is.
 *
 * <p>The quest rows are an in-memory stand-in that follows {@code ArtisanQuestSqlRepository}: a
 * save writes the objectives the quest holds, by objective key, and never deletes a row the quest
 * no longer holds.
 */
class QuestContentChangeTest {

    private static final Logger LOGGER = Logger.getLogger(QuestContentChangeTest.class.getName());
    private static final ActionChain OBJECTIVE_REWARD = new ActionChain(List.of("give objective reward"));
    private static final ActionChain QUEST_REWARD = new ActionChain(List.of("give quest reward"));

    private final Rows rows = new Rows();
    private final List<CoreEvent> events = new ArrayList<>();
    private final List<ActionChain> chainsRun = new ArrayList<>();
    private final TestActor actor = new TestActor();

    private QuestConfigRegistry configs;
    private QuestRegistry registry;
    private QuestService questService;
    private QuestDistributionService distribution;
    private QuestLifecycleService lifecycle;
    private QuestProgressService progress;

    @BeforeEach
    void setUp() {
        configs = new QuestConfigRegistry();
        registry = new QuestRegistry();

        QuestObjectiveFactory objectives = mock(QuestObjectiveFactory.class);
        when(objectives.createObjective(any(), any(), any(Integer.class), any())).thenAnswer(call ->
                new TestObjective(call.getArgument(0), call.getArgument(1), call.getArgument(2), call.getArgument(3)));
        QuestFactory factory = new QuestFactory(objectives);

        RotationRepository rotations = mock(RotationRepository.class);
        when(rotations.countInPeriod(any(), any(), any(), any())).thenReturn(CompletableFuture.completedFuture(0));
        questService = new QuestService(LOGGER, configs, rows, rotations, factory, registry, new QuestMapper());

        MSQuestsPlatform platform = mock(MSQuestsPlatform.class);
        doAnswer(call -> {
            call.<Runnable>getArgument(0).run();
            return null;
        }).when(platform).runSync(any());

        distribution = new QuestDistributionService();
        lifecycle = new QuestLifecycleService(
                events::add, questService, factory, registry, configs,
                (questId, action) -> {
                    Quest quest = registry.getQuest(questId);
                    action.accept(quest);
                    return CompletableFuture.completedFuture(quest);
                },
                distribution, rotations, platform, (chain, context) -> chainsRun.add(chain));
        progress = new QuestProgressService(lifecycle, questService, events::add, registry,
                (chain, context) -> chainsRun.add(chain));
    }

    // ------------------------------------------------------------------ objectives

    @Nested
    class Objectives {

        @Test
        void harmfulAChangedObjectiveKeyWithoutOldKeyStartsItAgainFromZero() {
            publish(story(quest("mine", stage("dig", objective("stone", 100)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 60));

            publish(story(quest("mine", stage("dig", objective("cobble", 100)))));
            Quest quest = reload(id);

            assertEquals(0, objective(quest, "cobble").getProgress(), "the 60 already mined are not carried over");
        }

        @Test
        void harmfulTheRowOfADroppedObjectiveKeyStaysAndComesBackWithTheKey() {
            publish(story(quest("mine", stage("dig", objective("stone", 100)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 60));

            publish(story(quest("mine", stage("dig", objective("cobble", 100)))));
            progress.contributeNow(objective(reload(id), "cobble"), () -> 5, null);
            assertEquals(Set.of("stone", "cobble"), rows.objectiveKeys(id), "the save left the old row in place");

            // The key is used again later, for an objective that has nothing to do with the first.
            publish(story(quest("mine", stage("dig", objective("cobble", 100), objective("stone", 80)))));
            assertEquals(60, objective(reload(id), "stone").getProgress(), "a new objective starts at an old progress");
        }

        @Test
        void safeAChangedTypeUnderTheSameKeyStartsFromZero() {
            publish(story(quest("mine", stage("dig", objective("task", "block_break", 100)))));
            UUID id = rows.inProgress("story", "mine", Map.of());
            rows.setObjective(id, "task", "block_break", 60, QuestObjectiveStatus.IN_PROGRESS);

            change(story(quest("mine", stage("dig", objective("task", "kill_entity", 100)))));

            assertEquals(0, objective(reload(id), "task").getProgress(), "60 blocks broken are not 60 kills");
        }

        @Test
        void safeAChangedObjectiveKeyKeepsItsProgressThroughOldKey() {
            publish(story(quest("mine", stage("dig", objective("stone", 100)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 60));

            change(story(quest("mine", stage("dig", objective("cobble", "test", 100, "stone")))));
            Quest quest = reload(id);
            assertEquals(60, objective(quest, "cobble").getProgress());

            // Once saved under the new key, that row is the one read, whatever the old one holds.
            progress.contributeNow(objective(quest, "cobble"), () -> 5, null);
            assertEquals(65, objective(reload(id), "cobble").getProgress());
        }

        @Test
        void safeAnObjectiveMovedToAnotherStageKeepsItsProgress() {
            publish(story(quest("mine", stage("dig", objective("stone", 100)), stage("smelt", objective("iron", 10)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 60));

            publish(story(quest("mine", stage("dig", objective("coal", 5)), stage("smelt", objective("iron", 10), objective("stone", 100)))));

            assertEquals(60, objective(reload(id), "stone").getProgress());
        }

        @Test
        void safeANewObjectiveInTheCurrentStageStartsAtZeroAndTheOthersKeepTheirs() {
            publish(story(quest("mine", stage("dig", objective("stone", 100)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 60));

            publish(story(quest("mine", stage("dig", objective("stone", 100), objective("coal", 5)))));
            Quest quest = reload(id);

            assertEquals(60, objective(quest, "stone").getProgress());
            assertEquals(0, objective(quest, "coal").getProgress());
        }
    }

    // --------------------------------------------------------------------- targets

    @Nested
    class Targets {

        @Test
        void safeATargetLoweredUnderTheProgressCompletesTheObjectiveWithItsActionsWhenItLoads() {
            publish(story(quest("mine",
                    stage("dig", objective("stone", 100), objective("coal", 40)), stage("smelt", objective("iron", 10)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 60, "coal", 30));

            change(story(rewarding(quest("mine",
                    stage("dig", objective("stone", 50), objective("coal", 20)), stage("smelt", objective("iron", 10))))));
            Quest quest = reload(id);
            lifecycle.settleLoadedQuests(actor);

            assertEquals("smelt", quest.getCurrentStage().getKey(), "the player is on the next stage");
            assertEquals(2, count(CoreQuestObjectiveCompletedEvent.class));
            assertEquals(2, chainsRun.stream().filter(OBJECTIVE_REWARD::equals).count(), "the objective_complete actions ran for both");
            assertEquals(1, count(CoreQuestStageCompletedEvent.class), "the stage is recorded as completed, once");

            reload(id);
            lifecycle.settleLoadedQuests(actor);
            assertEquals(2, chainsRun.stream().filter(OBJECTIVE_REWARD::equals).count(), "the next load runs nothing more");
        }

        @Test
        void safeAQuestWhoseLastObjectiveIsReachedByALoweredTargetCompletesWhenItLoads() {
            publish(story(quest("mine", stage("dig", objective("stone", 100)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 60));

            change(story(rewarding(quest("mine", stage("dig", objective("stone", 50))))));
            Quest quest = reload(id);
            lifecycle.settleLoadedQuests(actor);

            assertEquals(QuestStatus.COMPLETED, quest.getStatus());
            assertEquals(QuestStatus.COMPLETED, rows.status(id), "and saved so");
            assertEquals(1, count(CoreQuestCompletedEvent.class));
            assertEquals(1, chainsRun.stream().filter(QUEST_REWARD::equals).count(), "the rewards are given, once");
            assertEquals(0, actor.getActorQuestGroup(configs.getQuestGroupConfigs().get("story")).getInProgressCount(),
                    "its active slot is free again");

            lifecycle.settleLoadedQuests(actor);
            assertEquals(1, chainsRun.stream().filter(QUEST_REWARD::equals).count(), "a second pass pays nothing more");
        }

        @Test
        void safeATargetRaisedAboveACompletedObjectiveLeavesItCompleted() {
            publish(story(rewarding(quest("mine", stage("dig", objective("stone", 50)), stage("smelt", objective("iron", 10))))));
            UUID id = rows.inProgress("story", "mine", Map.of("iron", 4));
            rows.setObjective(id, "stone", 50, QuestObjectiveStatus.COMPLETED);

            change(story(rewarding(quest("mine", stage("dig", objective("stone", 80)), stage("smelt", objective("iron", 10))))));
            Quest quest = reload(id);

            assertEquals("smelt", quest.getCurrentStage().getKey(), "completed once is completed for good");
            assertTrue(objective(quest, "stone").isCompleted());
            assertEquals(QuestObjectiveStatus.COMPLETED, objective(quest, "stone").getStatus());
            assertEquals(1.0, quest.getStages().get("dig").getProgressRatio(), "shown full, not 50/80");
            assertFalse(quest.getActiveObjectives().contains(objective(quest, "stone")), "it cannot be completed, and paid, again");
        }

        @Test
        void safeATargetRaisedOnAnObjectiveInProgressKeepsTheProgress() {
            publish(story(quest("mine", stage("dig", objective("stone", 100)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 60));

            publish(story(quest("mine", stage("dig", objective("stone", 200)))));

            assertEquals(60, objective(reload(id), "stone").getProgress());
        }

        @Test
        void safeAQuestAlreadyCompletedStaysCompletedWhateverItsContentBecomes() {
            publish(story(rewarding(quest("mine", stage("dig", objective("stone", 50))))));
            UUID id = rows.add("story", "mine", QuestStatus.COMPLETED, Instant.now());
            rows.setObjective(id, "stone", 50, QuestObjectiveStatus.COMPLETED);

            publish(story(rewarding(quest("mine", stage("dig", objective("stone", 80)), stage("smelt", objective("iron", 10))))));
            Quest quest = reload(id);
            lifecycle.refreshActor(actor);

            assertEquals(QuestStatus.COMPLETED, quest.getStatus());
            assertTrue(actor.getActiveObjectivesByType("test").isEmpty(), "nothing of it can progress again");
            assertFalse(chainsRun.contains(QUEST_REWARD));
        }
    }

    // ---------------------------------------------------------------------- stages

    @Nested
    class Stages {

        @Test
        void safeAStageAddedBeforeTheCurrentOneIsBehindThePlayer() {
            publish(story(quest("mine", stage("dig", objective("stone", 50)), stage("smelt", objective("iron", 10)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 50, "iron", 4));

            change(story(quest("mine",
                    stage("dig", objective("stone", 50)), stage("gather", objective("wood", 20)), stage("smelt", objective("iron", 10)))));
            Quest quest = reload(id);

            assertEquals("smelt", quest.getCurrentStage().getKey());
            assertTrue(quest.getStages().get("gather").isPassed(), "the new stage is not asked of a player already further");
            assertEquals(QuestObjectiveStatus.COMPLETED, objective(quest, "wood").getStatus());
            assertEquals(4, objective(quest, "iron").getProgress());

            progress.contributeNow(objective(quest, "iron"), () -> 6, null);
            assertEquals(QuestStatus.COMPLETED, quest.getStatus(), "and the quest ends without it");
        }

        @Test
        void safeAPlayerNotYetAtAnAddedStageDoesIt() {
            publish(story(quest("mine", stage("dig", objective("stone", 50)), stage("smelt", objective("iron", 10)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 20));

            change(story(quest("mine",
                    stage("dig", objective("stone", 50)), stage("gather", objective("wood", 20)), stage("smelt", objective("iron", 10)))));
            Quest quest = reload(id);
            progress.contributeNow(objective(quest, "stone"), () -> 30, null);

            assertEquals("gather", quest.getCurrentStage().getKey());
        }

        @Test
        void safeAnObjectiveAddedToAFinishedStageDoesNotReopenIt() {
            publish(story(quest("mine", stage("dig", objective("stone", 50)), stage("smelt", objective("iron", 10)))));
            UUID id = rows.inProgress("story", "mine", Map.of("iron", 4));
            rows.setObjective(id, "stone", 50, QuestObjectiveStatus.COMPLETED);

            change(story(quest("mine", stage("dig", objective("stone", 50), objective("coal", 5)), stage("smelt", objective("iron", 10)))));
            Quest quest = reload(id);

            assertEquals("smelt", quest.getCurrentStage().getKey());
            assertFalse(quest.getActiveObjectives().contains(objective(quest, "coal")));
            assertEquals(0, count(CoreQuestStageCompletedEvent.class), "'dig' is not recorded as completed a second time");
        }

        @Test
        void safeRemovingTheStageThePlayerIsOnCompletesTheQuestWhenItLoads() {
            publish(story(quest("mine", stage("dig", objective("stone", 50)), stage("smelt", objective("iron", 10)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 50, "iron", 4));

            change(story(rewarding(quest("mine", stage("dig", objective("stone", 50))))));
            Quest quest = reload(id);
            lifecycle.settleLoadedQuests(actor);

            assertEquals(QuestStatus.COMPLETED, quest.getStatus());
            assertEquals(1, chainsRun.stream().filter(QUEST_REWARD::equals).count());
        }

        @Test
        void safeReorderedStagesLeaveThePlayerOnTheStageTheyHadReached() {
            publish(story(quest("mine",
                    stage("dig", objective("stone", 50)), stage("smelt", objective("iron", 10)), stage("craft", objective("pick", 1)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 50, "iron", 4));

            change(story(quest("mine",
                    stage("craft", objective("pick", 1)), stage("dig", objective("stone", 50)), stage("smelt", objective("iron", 10)))));
            Quest quest = reload(id);

            assertEquals("smelt", quest.getCurrentStage().getKey());
            assertTrue(quest.getStages().get("craft").isPassed(), "what now comes before it is behind the player");
        }

        /** A row saved before the stage reached was recorded: the first load writes it. */
        @Test
        void safeARowWithoutItsReachedStageGetsItOnTheFirstLoad() {
            publish(story(quest("mine", stage("dig", objective("stone", 50)), stage("smelt", objective("iron", 10)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 50, "iron", 4));
            assertNull(rows.reachedStage(id));

            reload(id);

            assertEquals("smelt", rows.reachedStage(id));
        }

        @Test
        void safeAChangedStageKeyLosesNothing() {
            publish(story(quest("mine", stage("dig", objective("stone", 50)), stage("smelt", objective("iron", 10)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 50, "iron", 4));

            publish(story(quest("mine", stage("excavate", objective("stone", 50)), stage("furnace", objective("iron", 10)))));
            Quest quest = reload(id);

            assertEquals("furnace", quest.getCurrentStage().getKey());
            assertEquals(4, objective(quest, "iron").getProgress());
        }

        @Test
        void safeAStageAddedAfterTheCurrentOneChangesNothingForThePlayer() {
            publish(story(quest("mine", stage("dig", objective("stone", 50)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 20));

            publish(story(quest("mine", stage("dig", objective("stone", 50)), stage("smelt", objective("iron", 10)))));
            Quest quest = reload(id);

            assertEquals("dig", quest.getCurrentStage().getKey());
            assertEquals(20, objective(quest, "stone").getProgress());
        }
    }

    // ---------------------------------------------------------------------- quests

    @Nested
    class Quests {

        @Test
        void safeAQuestTakenOutOfItsGroupKeepsItsSlotUntilItIsBack() {
            publish(group("daily", 1, quest("mine", stage("dig", objective("stone", 50))), quest("fish", stage("catch", objective("cod", 5)))));
            UUID id = rows.inProgress("daily", "mine", Map.of("stone", 20));
            reload(id);

            // The quest is removed, by mistake or for a fix.
            QuestConfig fishAlone = quest("fish", stage("catch", objective("cod", 5)));
            publish(group("daily", 1, fishAlone));
            questService.loadQuests(actor).join();

            assertTrue(actor.getQuests().isEmpty(), "the stored quest is ignored, its row kept");
            assertEquals(QuestStartResult.MAX_ACTIVE_REACHED,
                    lifecycle.startQuest(actor, fishAlone, QuestDistributionStrategy.RANDOM, null), "but its slot is not given away");

            // The quest is put back.
            publish(group("daily", 1, quest("mine", stage("dig", objective("stone", 50))), quest("fish", stage("catch", objective("cod", 5)))));
            Quest back = reload(id);

            assertEquals(20, objective(back, "stone").getProgress());
            assertEquals(1, actor.getActorQuestGroup(configs.getQuestGroupConfigs().get("daily")).getInProgressCount());
        }

        @Test
        void harmfulAQuestMovedToAnotherGroupWithoutOldKeyLeavesItsProgressBehind() {
            publish(story(quest("mine", stage("dig", objective("stone", 50)))));
            UUID id = rows.inProgress("story", "mine", Map.of("stone", 20));
            reload(id);

            publish(story(), group("side", 1, quest("mine", stage("dig", objective("stone", 50)))));
            questService.loadQuests(actor).join();

            assertTrue(actor.getQuests().isEmpty(), "the row still names group 'story': nothing moves it");
            assertEquals(QuestStartResult.SUCCESS, distribution.canStartQuest(actor,
                    configs.getQuestGroupConfigs().get("side").getQuestConfigs().get("mine"), QuestDistributionStrategy.NONE, null),
                    "the quest is offered again from zero");
        }

        @Test
        void harmfulAResetAddedToAGroupWithoutOneForgetsWhatWasCompletedBeforeTheLastReset() {
            publish(story(quest("mine", stage("dig", objective("stone", 50)))));
            UUID id = rows.add("story", "mine", QuestStatus.COMPLETED, Instant.now().minus(Duration.ofDays(3)));
            assertEquals(QuestStatus.COMPLETED, reload(id).getStatus());

            QuestGroupConfig daily = new QuestGroupConfig.Builder("story", "Story", "", "player")
                    .maxActive(1).resetCron("0 0 * * *").build();
            daily.addQuest(quest("mine", stage("dig", objective("stone", 50))));
            publish(daily);
            questService.loadQuests(actor).join();

            assertTrue(actor.getQuests().isEmpty(), "a quest created before the period is not loaded at all");
            assertEquals(QuestStartResult.SUCCESS, distribution.canStartQuest(actor,
                    daily.getQuestConfigs().get("mine"), QuestDistributionStrategy.NONE, null),
                    "a quest completed once can be done, and rewarded, again");
        }

        @Test
        void safeAGroupLimitLoweredUnderWhatIsInProgressTakesNothingAway() {
            publish(group("daily", 2, quest("mine", stage("dig", objective("stone", 50))), quest("fish", stage("catch", objective("cod", 5))),
                    quest("farm", stage("grow", objective("wheat", 5)))));
            UUID mine = rows.inProgress("daily", "mine", Map.of("stone", 20));
            rows.inProgress("daily", "fish", Map.of("cod", 1));

            QuestConfig farm = quest("farm", stage("grow", objective("wheat", 5)));
            publish(group("daily", 1, quest("mine", stage("dig", objective("stone", 50))), quest("fish", stage("catch", objective("cod", 5))), farm));
            Quest quest = reload(mine);

            assertEquals(2, actor.getQuests().size());
            assertEquals(20, objective(quest, "stone").getProgress());
            assertEquals(QuestStartResult.MAX_ACTIVE_REACHED, distribution.canStartQuest(actor, farm, QuestDistributionStrategy.NONE, null));
        }
    }

    // --------------------------------------------------------------------- ladders

    @Nested
    class Ladders {

        @Test
        void safeAStepInsertedBeforeTheCurrentOneIsBehindTheActor() {
            publish(ladder(quest("first", stage("s", objective("a", 10))), quest("second", stage("s", objective("b", 10)))));
            rows.add("ladder", "first", QuestStatus.COMPLETED, Instant.now());
            UUID second = rows.inProgress("ladder", "second", Map.of("b", 7));
            reload(second);

            QuestGroupConfig changed = ladder(quest("first", stage("s", objective("a", 10))),
                    quest("between", stage("s", objective("x", 10))), quest("second", stage("s", objective("b", 10))));
            publish(changed);
            Quest quest = reload(second);
            lifecycle.syncLadder(actor, changed);

            ActorQuestGroup steps = actor.getActorQuestGroup(changed);
            assertTrue(rows.exists(second), "the quest in progress is not deleted");
            assertEquals(7, objective(quest, "b").getProgress());
            assertTrue(steps.hasActive("second"));
            assertFalse(steps.hasStarted("between"), "the step added behind the actor is not asked of them");
        }

        @Test
        void safeAStepInsertedAheadOfTheActorIsDoneInItsTurn() {
            publish(ladder(quest("first", stage("s", objective("a", 10))), quest("third", stage("s", objective("c", 10)))));
            UUID first = rows.inProgress("ladder", "first", Map.of("a", 7));
            reload(first);

            QuestGroupConfig changed = ladder(quest("first", stage("s", objective("a", 10))),
                    quest("second", stage("s", objective("b", 10))), quest("third", stage("s", objective("c", 10))));
            publish(changed);
            Quest quest = reload(first);
            progress.contributeNow(objective(quest, "a"), () -> 3, null);
            lifecycle.syncLadder(actor, changed);

            assertTrue(actor.getActorQuestGroup(changed).hasActive("second"));
        }

        @Test
        void safeAStepAddedAfterTheCurrentOneLeavesItAlone() {
            publish(ladder(quest("first", stage("s", objective("a", 10)))));
            UUID first = rows.inProgress("ladder", "first", Map.of("a", 7));
            reload(first);

            QuestGroupConfig changed = ladder(quest("first", stage("s", objective("a", 10))), quest("second", stage("s", objective("b", 10))));
            publish(changed);
            Quest quest = reload(first);
            lifecycle.syncLadder(actor, changed);

            assertTrue(rows.exists(first));
            assertEquals(7, objective(quest, "a").getProgress());
            assertFalse(actor.getActorQuestGroup(changed).hasStarted("second"));
        }
    }

    // --------------------------------------------------------------------- helpers

    private void publish(QuestGroupConfig... groups) {
        configs.replaceQuestGroupConfigs(List.of(groups));
    }

    /**
     * New content goes live for an actor who played with the previous one: their quests were
     * loaded and saved with it before it changed.
     */
    private void change(QuestGroupConfig... groups) {
        questService.loadQuests(actor).join();
        publish(groups);
    }

    /** What {@code /quest admin reload} does for a loaded actor, then the quest as it stands. */
    private Quest reload(UUID questId) {
        questService.loadQuests(actor).join();
        Quest quest = actor.getQuests().get(questId);
        assertNotNull(quest, "the stored quest is loaded");
        return quest;
    }

    private static QuestObjective objective(Quest quest, String key) {
        return quest.getObjectives().stream()
                .filter(o -> o.getObjectiveConfig().getKey().equals(key)).findFirst().orElseThrow();
    }

    private long count(Class<? extends CoreEvent> type) {
        return events.stream().filter(type::isInstance).count();
    }

    private static QuestGroupConfig story(QuestConfig... quests) {
        return group("story", 1, quests);
    }

    private static QuestGroupConfig group(String key, int maxActive, QuestConfig... quests) {
        QuestGroupConfig group = new QuestGroupConfig.Builder(key, key, "", "player")
                .maxActive(maxActive).maxPerPeriod(null).build();
        for (QuestConfig quest : quests) group.addQuest(quest);
        return group;
    }

    private static QuestGroupConfig ladder(QuestConfig... quests) {
        QuestGroupConfig group = new QuestGroupConfig.Builder("ladder", "Ladder", "", "player")
                .maxActive(1).maxPerPeriod(null)
                .distributionConfig(new DistributionConfig(QuestDistributionStrategy.SEQUENTIAL, 1, Set.of()))
                .build();
        for (QuestConfig quest : quests) {
            quest.setCompletedWhen(Conditions.NONE);
            group.addQuest(quest);
        }
        return group;
    }

    private static QuestConfig quest(String key, QuestStageConfig... stages) {
        QuestConfig quest = new QuestConfig(key, key, "", 0L);
        for (QuestStageConfig stage : stages) quest.addStage(stage);
        return quest;
    }

    private static QuestConfig rewarding(QuestConfig quest) {
        quest.setObjectiveCompleteActions(OBJECTIVE_REWARD);
        quest.setRewards(QUEST_REWARD);
        return quest;
    }

    private static QuestStageConfig stage(String key, QuestObjectiveConfig... objectives) {
        QuestStageConfig stage = new QuestStageConfig(key, key, Flow.PARALLEL);
        for (QuestObjectiveConfig objective : objectives) stage.addObjective(objective);
        return stage;
    }

    private static QuestObjectiveConfig objective(String key, int target) {
        return objective(key, "test", target);
    }

    private static QuestObjectiveConfig objective(String key, String type, int target) {
        return new TestObjectiveConfig(key, type, target, null);
    }

    private static QuestObjectiveConfig objective(String key, String type, int target, String oldKey) {
        return new TestObjectiveConfig(key, type, target, oldKey);
    }

    static final class TestObjectiveConfig extends QuestObjectiveConfig {
        private final int target;

        TestObjectiveConfig(String key, String type, int target, String oldKey) {
            super(new QuestObjectiveConfigDTO(key, type, oldKey != null ? Map.of("old_key", oldKey) : Map.of()));
            this.target = target;
        }

        @Override
        public int getTarget() {
            return target;
        }

        @Override
        public QuestObjectiveConfigDTO toDTO() {
            return new QuestObjectiveConfigDTO(key, type, Map.of());
        }

        @Override
        public Map<String, String> getPlaceholders(Translator translator) {
            return Map.of();
        }
    }

    static final class TestObjective extends AbstractQuestObjective<QuestObjectiveConfig> {
        TestObjective(QuestStage stage, QuestObjectiveConfig config, int progress, QuestObjectiveStatus status) {
            super(stage, config, progress, status);
        }
    }

    static final class TestActor extends QuestActor {
        TestActor() {
            super(UUID.randomUUID(), "Steve");
        }

        @Override
        public String getActorType() {
            return "player";
        }

        @Override
        public boolean isMember(UUID playerId) {
            return id.equals(playerId);
        }
    }

    /** The quest and objective rows, written the way {@code ArtisanQuestSqlRepository} writes them. */
    private final class Rows implements QuestRepository {
        private final Map<UUID, QuestDTO> quests = new LinkedHashMap<>();

        UUID inProgress(String group, String quest, Map<String, Integer> progressByObjective) {
            UUID id = add(group, quest, QuestStatus.IN_PROGRESS, Instant.now());
            progressByObjective.forEach((key, value) -> setObjective(id, key, value, QuestObjectiveStatus.IN_PROGRESS));
            return id;
        }

        UUID add(String group, String quest, QuestStatus status, Instant createdAt) {
            UUID id = UUID.randomUUID();
            long created = createdAt.toEpochMilli();
            quests.put(id, new QuestDTO(id, quest, group, actor.getId(), status,
                    status == QuestStatus.COMPLETED ? created : null, created, created, new HashMap<>()));
            return id;
        }

        void setObjective(UUID questId, String key, int value, QuestObjectiveStatus status) {
            setObjective(questId, key, "test", value, status);
        }

        void setObjective(UUID questId, String key, String type, int value, QuestObjectiveStatus status) {
            quests.get(questId).objectives().put(key, new QuestObjectiveDTO(questId, key, type, status, value, null));
        }

        QuestStatus status(UUID questId) {
            return quests.get(questId).status();
        }

        String reachedStage(UUID questId) {
            return quests.get(questId).reachedStage();
        }

        boolean exists(UUID questId) {
            return quests.containsKey(questId);
        }

        Set<String> objectiveKeys(UUID questId) {
            return Set.copyOf(quests.get(questId).objectives().keySet());
        }

        @Override
        public CompletableFuture<Map<UUID, QuestDTO>> getAllByActor(UUID actorUniqueId) {
            Map<UUID, QuestDTO> copy = new LinkedHashMap<>();
            quests.forEach((id, row) -> copy.put(id, new QuestDTO(row.id(), row.questKey(), row.groupKey(), row.actorId(),
                    row.status(), row.completedAt(), row.createdAt(), row.updatedAt(), new HashMap<>(row.objectives()),
                    row.questUid(), row.reachedStage())));
            return CompletableFuture.completedFuture(copy);
        }

        @Override
        public CompletableFuture<Void> save(QuestDTO quest) {
            Map<String, QuestObjectiveDTO> objectives = new HashMap<>();
            QuestDTO stored = quests.get(quest.id());
            if (stored != null) objectives.putAll(stored.objectives()); // rows of other keys are never deleted
            objectives.putAll(quest.objectives());
            quests.put(quest.id(), new QuestDTO(quest.id(), quest.questKey(), quest.groupKey(), quest.actorId(),
                    quest.status(), quest.completedAt(), quest.createdAt(), quest.updatedAt(), objectives,
                    quest.questUid(), quest.reachedStage()));
            return CompletableFuture.completedFuture(null);
        }

        @Override
        public CompletableFuture<Void> delete(UUID questId) {
            quests.remove(questId);
            return CompletableFuture.completedFuture(null);
        }
    }
}
