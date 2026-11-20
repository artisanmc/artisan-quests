package com.github.ibanetchep.msquests.database.repository;

import com.github.ibanetchep.msquests.core.dto.QuestDTO;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveDTO;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjectiveStatus;
import com.github.ibanetchep.msquests.core.stats.QuestFigures.QuestRow;
import com.github.ibanetchep.msquests.core.stats.QuestFigures.StageRow;
import com.github.ibanetchep.msquests.database.DbAccess;
import com.github.ibanetchep.msquests.database.DbCredentials;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** On H2 only, so it runs without Docker. */
class QuestFiguresSqlSourceTest {

    @TempDir
    File tempDir;

    private DbAccess db;
    private ArtisanQuestSqlRepository quests;
    private QuestFiguresSqlSource source;
    private final UUID actor = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        db = new DbAccess();
        db.initPool(new DbCredentials("h2", null, null, null, null, 0, tempDir));
        db.getJdbi().useHandle(h -> h.execute(
                "INSERT INTO artisan_quests_actor (id, actor_type) VALUES (?, 'player')", actor.toString()));
        quests = new ArtisanQuestSqlRepository(db);
        source = new QuestFiguresSqlSource(db);
    }

    @AfterEach
    void tearDown() {
        db.closePool();
    }

    private QuestDTO quest(UUID id, String key, QuestStatus status, Long completedAt, Map<String, QuestObjectiveDTO> objectives) {
        return quest(id, "group", key, status, completedAt, objectives);
    }

    private QuestDTO quest(UUID id, String group, String key, QuestStatus status, Long completedAt,
                           Map<String, QuestObjectiveDTO> objectives) {
        return new QuestDTO(id, key, group, actor, status, completedAt, 1_000L, 1_000L, objectives);
    }

    private QuestObjectiveDTO objective(UUID quest, String stage, String key, QuestObjectiveStatus status) {
        return new QuestObjectiveDTO(quest, key, "block_break", status, 0, stage);
    }

    @Test
    void readsTheRowsOfTheAskedQuestsOfTheGroupOnly() {
        quests.save(quest(UUID.randomUUID(), "u1", QuestStatus.COMPLETED, 61_000L, new HashMap<>())).join();
        quests.save(quest(UUID.randomUUID(), "u1", QuestStatus.IN_PROGRESS, null, new HashMap<>())).join();
        quests.save(quest(UUID.randomUUID(), "other", QuestStatus.IN_PROGRESS, null, new HashMap<>())).join();
        // The same quest key in another group is another quest.
        quests.save(quest(UUID.randomUUID(), "elsewhere", "u1", QuestStatus.IN_PROGRESS, null, new HashMap<>())).join();

        List<QuestRow> rows = source.quests("group", List.of("u1", "missing"));
        assertEquals(2, rows.size());
        QuestRow done = rows.stream().filter(r -> r.status().equals("COMPLETED")).findFirst().orElseThrow();
        assertEquals(60_000L, done.completedAt() - done.createdAt());
        assertTrue(source.quests("group", List.of()).isEmpty());
    }

    @Test
    void aStageCountsItsRemainingObjectivesAndKeepsWhenItsLastOneEnded() {
        UUID id = UUID.randomUUID();
        Map<String, QuestObjectiveDTO> objectives = new HashMap<>();
        objectives.put("a", objective(id, "one", "a", QuestObjectiveStatus.COMPLETED));
        objectives.put("b", objective(id, "one", "b", QuestObjectiveStatus.IN_PROGRESS));
        objectives.put("c", objective(id, "two", "c", QuestObjectiveStatus.PENDING));
        quests.save(quest(id, "u1", QuestStatus.IN_PROGRESS, null, objectives)).join();

        StageRow one = stage(id, "one");
        assertEquals(1, one.remaining());
        assertNotNull(one.lastCompletedAt());
        long first = one.lastCompletedAt();
        assertEquals(1, stage(id, "two").remaining());
        assertNull(stage(id, "two").lastCompletedAt());

        // The second save completes the stage: "a" keeps the time it was first seen completed.
        objectives.put("b", objective(id, "one", "b", QuestObjectiveStatus.COMPLETED));
        quests.save(quest(id, "u1", QuestStatus.IN_PROGRESS, null, objectives)).join();
        one = stage(id, "one");
        assertEquals(0, one.remaining());
        assertTrue(one.lastCompletedAt() >= first);
        Long aTime = db.getJdbi().withHandle(h -> h.createQuery(
                        "SELECT completed_at FROM artisan_quests_objective WHERE quest_id = ? AND objective_key = 'a'")
                .bind(0, id.toString()).mapTo(java.sql.Timestamp.class).one().getTime());
        assertEquals(first, aTime);

        // A quest that is no longer in progress leaves the stages.
        quests.save(quest(id, "u1", QuestStatus.COMPLETED, 5_000L, objectives)).join();
        assertTrue(source.stages("group", List.of("u1")).isEmpty());
    }

    private StageRow stage(UUID quest, String key) {
        return source.stages("group", List.of("u1")).stream()
                .filter(r -> r.questId().equals(quest.toString()) && r.stageKey().equals(key))
                .findFirst().orElseThrow();
    }
}
