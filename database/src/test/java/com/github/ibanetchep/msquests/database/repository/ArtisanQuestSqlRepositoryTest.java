package com.github.ibanetchep.msquests.database.repository;

import com.github.ibanetchep.msquests.core.dto.QuestDTO;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveDTO;
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
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

/** On H2 only, so it runs without Docker. */
class ArtisanQuestSqlRepositoryTest {

    @TempDir
    File tempDir;

    private DbAccess db;
    private ArtisanQuestSqlRepository quests;
    private final UUID actor = UUID.randomUUID();
    private final UUID id = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        db = new DbAccess();
        db.initPool(new DbCredentials("h2", null, null, null, null, 0, tempDir));
        db.getJdbi().useHandle(h -> h.execute(
                "INSERT INTO artisan_quests_actor (id, actor_type) VALUES (?, 'player')", actor.toString()));
        quests = new ArtisanQuestSqlRepository(db);
    }

    @AfterEach
    void tearDown() {
        db.closePool();
    }

    private QuestDTO quest(String reachedStage, Map<String, QuestObjectiveDTO> objectives) {
        return new QuestDTO(id, "mine", "story", actor, QuestStatus.IN_PROGRESS, null, 1_000L, 1_000L,
                new HashMap<>(objectives), null, reachedStage);
    }

    private QuestObjectiveDTO objective(String key, int progress) {
        return new QuestObjectiveDTO(id, key, "block_break", QuestObjectiveStatus.IN_PROGRESS, progress, "dig");
    }

    private QuestDTO stored() {
        return quests.getAllByActor(actor).join().get(id);
    }

    @Test
    void theStageReachedIsStoredAndFollowsTheQuest() {
        quests.save(quest(null, Map.of())).join();
        assertNull(stored().reachedStage(), "a quest without stages has none");

        quests.save(quest("dig", Map.of())).join();
        assertEquals("dig", stored().reachedStage());

        quests.save(quest("smelt", Map.of())).join();
        assertEquals("smelt", stored().reachedStage());
    }

    /** What makes an objective key used again find an old progress: see QuestContentChangeTest. */
    @Test
    void aSaveKeepsTheRowOfAnObjectiveTheQuestNoLongerHolds() {
        quests.save(quest("dig", Map.of("stone", objective("stone", 60)))).join();
        quests.save(quest("dig", Map.of("cobble", objective("cobble", 5)))).join();

        assertEquals(Set.of("stone", "cobble"), stored().objectives().keySet());
        assertEquals(60, stored().objectives().get("stone").progress());
    }
}
