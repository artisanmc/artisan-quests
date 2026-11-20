package com.github.ibanetchep.msquests.bukkit.artisan;

import com.github.ibanetchep.msquests.bukkit.artisan.ArtisanFixtures.TestActor;
import com.github.ibanetchep.msquests.core.event.CoreQuestAbandonedEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestCompletedEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestExpiredEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestObjectiveCompletedEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestStageCompletedEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestStartedEvent;
import com.github.ibanetchep.msquests.core.quest.actor.Quest;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.core.quest.player.PlayerProfile;
import com.github.ibanetchep.msquests.core.registry.QuestConfigRegistry;
import com.github.ibanetchep.msquests.core.stats.QuestFigures.QuestRow;
import com.github.ibanetchep.msquests.core.stats.QuestFigures.StageRow;
import com.github.ibanetchep.msquests.core.stats.QuestFiguresSource;
import net.artisanmc.modules.api.stats.StatEvent;
import net.artisanmc.modules.api.stats.StatQuery;
import net.artisanmc.modules.api.stats.StatsApi;
import org.jetbrains.annotations.Nullable;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** The quests' statistics: one record per member of the actor, and the figures of a group. */
class QuestStatsTest {

    record Recorded(String event, UUID player, Map<String, String> dimensions, double value) {
    }

    private static final class FakeStats implements StatsApi {
        final List<StatEvent> declared = new ArrayList<>();
        final List<Recorded> recorded = new ArrayList<>();
        final Map<String, StatQuery> queries = new HashMap<>();
        boolean refuse;

        @Override
        public void declare(StatEvent event) {
            if (refuse) throw new IllegalArgumentException("refused");
            declared.add(event);
        }

        @Override
        public boolean isDeclared(String name) {
            return declared.stream().anyMatch(e -> e.getName().equals(name));
        }

        @Override
        public void record(String event, @Nullable UUID player, Map<String, String> dimensions, double value, Map<String, String> details) {
            recorded.add(new Recorded(event, player, Map.copyOf(dimensions), value));
        }

        @Override
        public void declareQuery(String id, int cacheSeconds, StatQuery query) {
            queries.put(id, query);
        }

        @Override
        public boolean isEnabled() {
            return true;
        }
    }

    private final FakeStats api = new FakeStats();
    private final QuestStats stats = new QuestStats(api, () -> 90_000L);

    private Quest questOf(UUID... members) {
        QuestGroupConfig group = ArtisanFixtures.group("daily", "player");
        QuestConfig config = ArtisanFixtures.quest(group, "miner", "easy");
        TestActor actor = new TestActor(UUID.randomUUID(), "Actor", "player");
        for (UUID id : members) actor.addProfile(new PlayerProfile(id, "p"));
        Quest quest = ArtisanFixtures.instance(actor, config, QuestStatus.IN_PROGRESS, 0);
        quest.setCreatedAt(new Date(30_000L));
        return quest;
    }

    @Test
    void declaresItsFiveEventsOrSaysArtisanRefused() {
        assertTrue(stats.declare());
        assertEquals(List.of(QuestStats.STARTED, QuestStats.STAGE_COMPLETED, QuestStats.COMPLETED,
                QuestStats.ABANDONED, QuestStats.EXPIRED), api.declared.stream().map(StatEvent::getName).toList());
        assertEquals(List.of("group", "quest", "stage"), api.declared.get(1).getDimensions());
        api.refuse = true;
        assertFalse(stats.declare());
    }

    @Test
    void recordsEachEndOfAQuestOncePerMemberWithItsKeys() {
        UUID first = UUID.randomUUID();
        UUID second = UUID.randomUUID();
        Quest quest = questOf(first, second);

        stats.accept(new CoreQuestStartedEvent(quest));
        stats.accept(new CoreQuestCompletedEvent(quest));
        stats.accept(new CoreQuestAbandonedEvent(quest));
        stats.accept(new CoreQuestExpiredEvent(quest));

        assertEquals(8, api.recorded.size());
        assertEquals(new Recorded(QuestStats.STARTED, first, Map.of("group", "daily", "quest", "miner"), 1),
                api.recorded.stream().filter(r -> r.player().equals(first)).findFirst().orElseThrow());
        Recorded completed = api.recorded.stream().filter(r -> r.event().equals(QuestStats.COMPLETED)).findFirst().orElseThrow();
        assertEquals(60.0, completed.value(), "the seconds since the quest started");
        assertEquals(List.of(QuestStats.ABANDONED, QuestStats.ABANDONED, QuestStats.EXPIRED, QuestStats.EXPIRED),
                api.recorded.subList(4, 8).stream().map(Recorded::event).toList());
    }

    @Test
    void aStageNamesItselfAndOtherEventsAreLeftAlone() {
        Quest quest = questOf(UUID.randomUUID());
        var stage = quest.getStages().values().iterator().next();

        stats.accept(new CoreQuestStageCompletedEvent(stage, null));
        stats.accept(new CoreQuestObjectiveCompletedEvent(stage.getObjectiveList().get(0), null));

        assertEquals(1, api.recorded.size());
        assertEquals(Map.of("group", "daily", "quest", "miner", "stage", "stage_1"), api.recorded.get(0).dimensions());
    }

    @Test
    void aQuestWhoseActorNamesNoMemberIsNotRecorded() {
        stats.accept(new CoreQuestStartedEvent(questOf()));
        assertTrue(api.recorded.isEmpty());
    }

    @Test
    void theFiguresOfAGroupReadTheRowsOfItsQuests() throws Exception {
        QuestGroupConfig group = ArtisanFixtures.group("story", "player");
        QuestConfig quest = ArtisanFixtures.multiStageQuest(group, "intro", 2);
        String uid = "intro";
        QuestConfigRegistry configs = new QuestConfigRegistry();
        configs.registerQuestGroupConfig(group);
        List<String> stageKeys = quest.getStages().keySet().stream().toList();
        List<Collection<String>> asked = new ArrayList<>();
        List<String> askedGroups = new ArrayList<>();
        stats.declareQueries(configs, new QuestFiguresSource() {
            @Override
            public List<QuestRow> quests(String groupKey, Collection<String> questKeys) {
                askedGroups.add(groupKey);
                asked.add(questKeys);
                return List.of(new QuestRow(uid, "COMPLETED", 0, 10_000L), new QuestRow(uid, "IN_PROGRESS", 0, null));
            }

            @Override
            public List<StageRow> stages(String groupKey, Collection<String> questKeys) {
                return List.of(
                        new StageRow("a", uid, 0, stageKeys.get(0), 0, 30_000L),
                        new StageRow("a", uid, 0, stageKeys.get(1), 1, null));
            }
        });

        List<Map<String, Object>> progress = api.queries.get(QuestStats.PROGRESS).rows(Map.of("group", "story"));
        assertEquals(List.of("story"), askedGroups);
        assertEquals(List.of(uid), List.copyOf(asked.get(0)));
        assertEquals("intro", progress.get(0).get("quest"));
        assertEquals(1, progress.get(0).get("completed"));
        assertEquals(10.0, progress.get(0).get("median_seconds"));

        List<Map<String, Object>> stuck = api.queries.get(QuestStats.STUCK).rows(Map.of("group", "story"));
        assertEquals(stageKeys.get(1), stuck.get(0).get("stage"));
        assertEquals(60.0, stuck.get(0).get("median_seconds"));

        assertTrue(api.queries.get(QuestStats.PROGRESS).rows(Map.of("group", "none")).isEmpty());
        assertTrue(api.queries.get(QuestStats.STUCK).rows(Map.of()).isEmpty());
    }
}
