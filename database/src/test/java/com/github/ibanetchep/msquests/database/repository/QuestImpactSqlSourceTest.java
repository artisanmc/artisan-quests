package com.github.ibanetchep.msquests.database.repository;

import com.github.ibanetchep.msquests.core.dto.QuestDTO;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveDTO;
import com.github.ibanetchep.msquests.core.impact.ImpactSource.ObjectiveCount;
import com.github.ibanetchep.msquests.core.impact.ImpactSource.QuestCount;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjectiveStatus;
import com.github.ibanetchep.msquests.database.DbAccess;
import com.github.ibanetchep.msquests.database.DbCredentials;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.File;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

/** On H2 only, so it runs without Docker. */
class QuestImpactSqlSourceTest {

    @TempDir
    File tempDir;

    private DbAccess db;
    private ArtisanQuestSqlRepository quests;
    private QuestImpactSqlSource source;

    @BeforeEach
    void setUp() {
        db = new DbAccess();
        db.initPool(new DbCredentials("h2", null, null, null, null, 0, tempDir));
        quests = new ArtisanQuestSqlRepository(db);
        source = new QuestImpactSqlSource(db);
    }

    @AfterEach
    void tearDown() {
        db.closePool();
    }

    private void row(String group, String quest, QuestStatus status, String reachedStage, int progress, QuestObjectiveStatus objectiveStatus) {
        UUID actor = UUID.randomUUID();
        db.getJdbi().useHandle(h -> h.execute(
                "INSERT INTO artisan_quests_actor (id, actor_type) VALUES (?, 'player')", actor.toString()));
        UUID id = UUID.randomUUID();
        Map<String, QuestObjectiveDTO> objectives = new HashMap<>();
        objectives.put("stone", new QuestObjectiveDTO(id, "stone", "block_break", objectiveStatus, progress, "dig"));
        quests.save(new QuestDTO(id, quest, group, actor, status, null, 1_000L, 1_000L, objectives, null, reachedStage)).join();
    }

    @Test
    void theRowsOfAGroupAreCountedByQuestStageAndObjective() {
        row("story", "mine", QuestStatus.IN_PROGRESS, "dig", 60, QuestObjectiveStatus.IN_PROGRESS);
        row("story", "mine", QuestStatus.IN_PROGRESS, "dig", 0, QuestObjectiveStatus.IN_PROGRESS);
        row("story", "mine", QuestStatus.IN_PROGRESS, "smelt", 100, QuestObjectiveStatus.COMPLETED);
        row("story", "mine", QuestStatus.COMPLETED, "smelt", 100, QuestObjectiveStatus.COMPLETED);
        row("story", "fish", QuestStatus.IN_PROGRESS, null, 10, QuestObjectiveStatus.IN_PROGRESS);
        row("daily", "mine", QuestStatus.IN_PROGRESS, "dig", 99, QuestObjectiveStatus.IN_PROGRESS);

        assertEquals(Set.of(
                new QuestCount("mine", "dig", 2, 0),
                new QuestCount("mine", "smelt", 1, 0),
                new QuestCount("mine", null, 0, 1),
                new QuestCount("fish", null, 1, 0)), new HashSet<>(source.quests("story")));
        assertEquals(Set.of(
                new ObjectiveCount("mine", "stone", "block_break", 1, 1),
                new ObjectiveCount("fish", "stone", "block_break", 1, 0)), new HashSet<>(source.objectives("story")),
                "of the quests in progress only");
        assertEquals(1, source.reaching("story", "mine", "stone", 50), "60 of the two not completed");
        assertEquals(0, source.reaching("story", "mine", "stone", 61));
    }
}
