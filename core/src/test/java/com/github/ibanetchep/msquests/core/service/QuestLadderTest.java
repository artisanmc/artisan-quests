package com.github.ibanetchep.msquests.core.service;

import com.github.ibanetchep.msquests.core.event.EventDispatcher;
import com.github.ibanetchep.msquests.core.factory.QuestFactory;
import com.github.ibanetchep.msquests.core.platform.MSQuestsPlatform;
import com.github.ibanetchep.msquests.core.quest.actor.ActorQuestGroup;
import com.github.ibanetchep.msquests.core.quest.actor.Quest;
import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import com.github.ibanetchep.msquests.core.quest.config.action.ChainRunner;
import com.github.ibanetchep.msquests.core.quest.config.group.DistributionConfig;
import com.github.ibanetchep.msquests.core.quest.config.group.LadderPositions;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestDistributionStrategy;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.core.quest.executor.AtomicQuestExecutor;
import com.github.ibanetchep.msquests.core.registry.QuestConfigRegistry;
import com.github.ibanetchep.msquests.core.registry.QuestRegistry;
import com.github.ibanetchep.msquests.core.repository.RotationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;
import java.util.List;
import java.util.OptionalInt;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/** A ladder's current quest follows an outside value, not the completions it stored. */
class QuestLadderTest {

    static class TestActor extends QuestActor {
        TestActor() { super(UUID.randomUUID(), "Smiths"); }
        @Override public String getActorType() { return "guild"; }
        @Override public boolean isMember(UUID playerId) { return false; }
    }

    private final AtomicInteger level = new AtomicInteger();
    private QuestGroupConfig group;
    private TestActor actor;
    private QuestService persistence;
    private QuestLifecycleService service;

    @BeforeEach
    void setUp() {
        group = new QuestGroupConfig.Builder("guild_levels", "Levels", "", "guild")
                .maxActive(1)
                .distributionConfig(new DistributionConfig(
                        QuestDistributionStrategy.LADDER, 1, Set.of(), "%msguilds_level%"))
                .build();
        for (String key : List.of("level_01", "level_02", "level_03")) {
            group.addQuest(new QuestConfig(key, key, "", 0L));
        }
        actor = new TestActor();

        persistence = mock(QuestService.class);
        when(persistence.deleteQuest(any())).thenReturn(CompletableFuture.completedFuture(null));
        when(persistence.saveQuest(any())).thenReturn(CompletableFuture.completedFuture(null));
        QuestFactory factory = mock(QuestFactory.class);
        when(factory.createQuest(any(), any())).thenAnswer(invocation -> {
            QuestConfig config = invocation.getArgument(0);
            Quest started = new Quest(UUID.randomUUID(), config, actor, QuestStatus.IN_PROGRESS, null, new Date(), new Date());
            actor.addQuest(started);
            return started;
        });

        service = new QuestLifecycleService(
                mock(EventDispatcher.class), persistence, factory, mock(QuestRegistry.class), mock(QuestConfigRegistry.class),
                mock(AtomicQuestExecutor.class), new QuestDistributionService(), mock(RotationRepository.class),
                mock(MSQuestsPlatform.class), mock(ChainRunner.class));
        service.setLadderPositions((a, expression) -> {
            assertEquals("%msguilds_level%", expression);
            return OptionalInt.of(level.get());
        });
    }

    private ActorQuestGroup ladder() {
        return actor.getActorQuestGroup(group);
    }

    private Quest give(String key, QuestStatus status) {
        Quest quest = new Quest(UUID.randomUUID(), group.getQuestConfigs().get(key), actor, status, null, new Date(), new Date());
        actor.addQuest(quest);
        return quest;
    }

    @Test
    void theQuestAtThePositionStarts() {
        level.set(1);
        service.syncLadder(actor, group);
        assertTrue(ladder().hasActive("level_02"));
        assertEquals(1, ladder().getInProgressCount());
    }

    @Test
    void aRaisedLevelSwapsTheActiveQuestWithoutCountingAFailure() {
        Quest first = give("level_01", QuestStatus.IN_PROGRESS);
        level.set(2);

        service.syncLadder(actor, group);

        assertFalse(actor.getQuests().containsKey(first.getId()), "the stale step left memory");
        verify(persistence).deleteQuest(first);
        assertTrue(ladder().hasActive("level_03"));
    }

    @Test
    void aLoweredLevelOffersAnAlreadyCompletedStepAgain() {
        give("level_01", QuestStatus.COMPLETED);
        give("level_02", QuestStatus.COMPLETED);
        give("level_03", QuestStatus.IN_PROGRESS);
        level.set(0);

        service.syncLadder(actor, group);

        assertTrue(ladder().hasActive("level_01"));
        assertEquals(1, ladder().getInProgressCount());
    }

    @Test
    void theTopOfTheLadderLeavesNoQuestActive() {
        give("level_03", QuestStatus.IN_PROGRESS);
        level.set(3);

        service.syncLadder(actor, group);

        assertEquals(0, ladder().getInProgressCount());
    }

    @Test
    void theRightQuestAlreadyActiveIsKept() {
        Quest current = give("level_02", QuestStatus.IN_PROGRESS);
        level.set(1);

        service.syncLadder(actor, group);

        assertTrue(actor.getQuests().containsKey(current.getId()));
        verify(persistence, never()).deleteQuest(any());
    }

    @Test
    void anUnknownPositionChangesNothing() {
        Quest current = give("level_01", QuestStatus.IN_PROGRESS);
        service.setLadderPositions((a, expression) -> OptionalInt.empty());

        service.syncLadder(actor, group);

        assertTrue(actor.getQuests().containsKey(current.getId()));
        assertEquals(1, ladder().getInProgressCount());
    }

    @Test
    void theStateOfEachStepFollowsThePosition() {
        assertEquals(List.of(LadderPositions.State.REACHED, LadderPositions.State.CURRENT, LadderPositions.State.LOCKED),
                List.of(LadderPositions.state(0, 1), LadderPositions.state(1, 1), LadderPositions.state(2, 1)));
    }
}
