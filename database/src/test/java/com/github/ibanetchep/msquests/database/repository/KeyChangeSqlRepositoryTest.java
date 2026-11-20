package com.github.ibanetchep.msquests.database.repository;

import com.github.ibanetchep.msquests.core.dto.QuestDTO;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.repository.KeyChange;
import com.github.ibanetchep.msquests.database.DbAccess;
import com.github.ibanetchep.msquests.database.DbCredentials;
import com.github.ibanetchep.msquests.database.SqlTables;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

/** On H2 only, so it runs without Docker. */
class KeyChangeSqlRepositoryTest {

    @TempDir
    File tempDir;

    private DbAccess db;
    private ArtisanQuestSqlRepository quests;
    private RotationSqlRepository rotations;
    private KeyChangeSqlRepository changes;
    private final UUID actor = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        db = new DbAccess();
        db.initPool(new DbCredentials("h2", null, null, null, null, 0, tempDir));
        db.getJdbi().useHandle(h -> h.execute(
                "INSERT INTO artisan_quests_actor (id, actor_type) VALUES (?, 'player')", actor.toString()));
        quests = new ArtisanQuestSqlRepository(db);
        rotations = new RotationSqlRepository(db, SqlTables.ARTISAN);
        changes = new KeyChangeSqlRepository(db);
    }

    @AfterEach
    void tearDown() {
        db.closePool();
    }

    private UUID row(String group, String key, String uid) {
        UUID id = UUID.randomUUID();
        quests.save(new QuestDTO(id, key, group, actor, QuestStatus.IN_PROGRESS, null, 1_000L, 1_000L, new HashMap<>(), uid)).join();
        return id;
    }

    private String nameOf(UUID id) {
        return db.getJdbi().withHandle(h -> h.createQuery(
                        "SELECT group_key, quest_key FROM artisan_quests_quest WHERE id = ?")
                .bind(0, id.toString())
                .map((rs, ctx) -> rs.getString("group_key") + "/" + rs.getString("quest_key"))
                .one());
    }

    private int rotationsOf(String group) {
        return rotations.countInPeriod(actor, group, null, null).join();
    }

    @Test
    void aQuestWhoseKeyChangedKeepsItsRowsAndApplyingItAgainChangesNothing() {
        UUID moved = row("daily", "mine", null);
        UUID other = row("daily", "fish", null);
        UUID sameKeyElsewhere = row("weekly", "mine", null);
        List<KeyChange> list = List.of(new KeyChange.Quest("daily", "mine", "dig"));

        assertEquals(1, changes.apply(list).join());

        assertEquals("daily/dig", nameOf(moved));
        assertEquals("daily/fish", nameOf(other));
        assertEquals("weekly/mine", nameOf(sameKeyElsewhere));
        assertEquals(0, changes.apply(list).join());
    }

    @Test
    void aGroupWhoseKeyChangedTakesItsQuestsAndRotationsAndAQuestIsFoundUnderIt() {
        UUID quest = row("daily", "mine", null);
        UUID untouched = row("daily", "fish", null);
        rotations.save(actor, "daily").join();
        // Listed quest first: the order of the list does not matter.
        List<KeyChange> list = List.of(
                new KeyChange.Quest("everyday", "mine", "dig"),
                new KeyChange.Group("daily", "everyday"));

        assertEquals(4, changes.apply(list).join());

        assertEquals("everyday/dig", nameOf(quest));
        assertEquals("everyday/fish", nameOf(untouched));
        assertEquals(1, rotationsOf("everyday"));
        assertEquals(0, rotationsOf("daily"));
        assertEquals(0, changes.apply(list).join());
    }

    @Test
    void rowsWrittenForAUidTakeTheKeysOfTheQuestThatCarriesIt() {
        // The names last saved are stale: the quest and its group had their keys changed in the editor
        // while rows were resolved by uid.
        UUID stale = row("daily", "mine", "01HQUEST");
        UUID current = row("everyday", "dig", "01HQUEST");
        UUID noUid = row("daily", "mine", null);
        rotations.save(actor, "01HGROUP").join();
        List<KeyChange> list = List.of(
                new KeyChange.GroupUid("01HGROUP", "everyday"),
                new KeyChange.QuestUid("01HQUEST", "everyday", "dig"));

        assertEquals(2, changes.apply(list).join());

        assertEquals("everyday/dig", nameOf(stale));
        assertEquals("everyday/dig", nameOf(current));
        assertEquals("daily/mine", nameOf(noUid));
        assertEquals(1, rotationsOf("everyday"));
        assertEquals(0, changes.apply(list).join());
    }

    @Test
    void aSaveNeverMovesARow() {
        UUID id = row("daily", "mine", null);
        changes.apply(List.of(new KeyChange.Quest("daily", "mine", "dig"))).join();

        // The quest still in memory under its former name is saved before the actors are rebuilt.
        quests.save(new QuestDTO(id, "mine", "daily", actor, QuestStatus.COMPLETED, 5_000L, 1_000L, 1_000L, new HashMap<>())).join();

        assertEquals("daily/dig", nameOf(id));
        assertEquals(QuestStatus.COMPLETED, quests.getAllByActor(actor).join().get(id).status());
        assertEquals("dig", quests.getAllByActor(actor).join().get(id).questKey());
    }
}
