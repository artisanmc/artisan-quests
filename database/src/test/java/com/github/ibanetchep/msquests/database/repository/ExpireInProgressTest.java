package com.github.ibanetchep.msquests.database.repository;

import com.github.ibanetchep.msquests.core.dto.QuestDTO;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.database.DbAccess;
import com.github.ibanetchep.msquests.database.DbCredentials;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.File;
import java.time.Instant;
import java.util.HashMap;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

/** On H2 only, so it runs without Docker. */
class ExpireInProgressTest {

    @TempDir
    File tempDir;

    private DbAccess db;
    private ArtisanQuestSqlRepository quests;
    private final UUID actor = UUID.randomUUID();

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

    private UUID save(String uid, QuestStatus status, long createdAt) {
        UUID id = UUID.randomUUID();
        quests.save(new QuestDTO(id, "key_" + uid, "daily", actor, status, null, createdAt, createdAt, new HashMap<>(), uid)).join();
        return id;
    }

    private String status(UUID id) {
        return db.getJdbi().withHandle(h -> h.createQuery("SELECT quest_status FROM artisan_quests_quest WHERE id = ?")
                .bind(0, id.toString()).mapTo(String.class).one());
    }

    @Test
    void expiresTheGroupsQuestsInProgressFromBeforeTheReset() {
        QuestGroupConfig group = new QuestGroupConfig.Builder("daily", "Daily", "", "player").resetCron("0 0 * * *").build();
        QuestConfig dig = new QuestConfig("dig", "Dig", "", 0L);
        dig.setUid("u_dig");
        dig.setGroup(group);
        group.addQuest(dig);

        UUID stale = save("u_dig", QuestStatus.IN_PROGRESS, 1_000L);
        UUID fresh = save("u_dig", QuestStatus.IN_PROGRESS, 5_000L);
        UUID done = save("u_dig", QuestStatus.COMPLETED, 1_000L);
        UUID otherGroup = save("u_other", QuestStatus.IN_PROGRESS, 1_000L);

        assertEquals(1, quests.expireInProgress(group, Instant.ofEpochMilli(3_000L)).join());

        assertEquals("EXPIRED", status(stale));
        assertEquals("IN_PROGRESS", status(fresh));
        assertEquals("COMPLETED", status(done));
        assertEquals("IN_PROGRESS", status(otherGroup));
    }

    @Test
    void aGroupWithoutQuestsChangesNothing() {
        QuestGroupConfig group = new QuestGroupConfig.Builder("empty", "Empty", "", "player").build();
        assertEquals(0, quests.expireInProgress(group, Instant.now()).join());
    }
}
