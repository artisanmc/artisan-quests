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

import com.github.ibanetchep.msquests.core.repository.KeyChangeRepository.Left;

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

        assertEquals(1, changes.apply(list).join().moved());

        assertEquals("daily/dig", nameOf(moved));
        assertEquals("daily/fish", nameOf(other));
        assertEquals("weekly/mine", nameOf(sameKeyElsewhere));
        assertEquals(0, changes.apply(list).join().moved());
    }

    @Test
    void aQuestMovedToAnotherGroupKeepsItsRowsAndApplyingItAgainChangesNothing() {
        UUID moved = row("story", "mine", null);
        UUID stays = row("story", "fish", null);
        List<KeyChange> list = List.of(new KeyChange.QuestMoved("story", "mine", "side", "dig"));

        assertEquals(1, changes.apply(list).join().moved());

        assertEquals("side/dig", nameOf(moved));
        assertEquals("story/fish", nameOf(stays));
        assertEquals(0, changes.apply(list).join().moved());
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

        assertEquals(4, changes.apply(list).join().moved());

        assertEquals("everyday/dig", nameOf(quest));
        assertEquals("everyday/fish", nameOf(untouched));
        assertEquals(1, rotationsOf("everyday"));
        assertEquals(0, rotationsOf("daily"));
        assertEquals(0, changes.apply(list).join().moved());
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

        assertEquals(2, changes.apply(list).join().moved());

        assertEquals("everyday/dig", nameOf(stale));
        assertEquals("everyday/dig", nameOf(current));
        assertEquals("daily/mine", nameOf(noUid));
        assertEquals(1, rotationsOf("everyday"));
        assertEquals(0, changes.apply(list).join().moved());
    }

    @Test
    void rowsWrittenUnderTheFormerKeyAfterTheChangeAreLeftThereAndReported() {
        UUID moved = row("daily", "mine", null);
        List<KeyChange> list = List.of(new KeyChange.Quest("daily", "mine", "dig"));
        changes.apply(list).join();

        // Another server still loads the content from before the change: the actor has no "mine"
        // there any more, so it hands them a new one.
        UUID late = row("daily", "mine", null);
        var again = changes.apply(list).join();

        assertEquals(0, again.moved());
        assertEquals(List.of(new Left("daily/mine", "daily/dig", 1)), again.left());
        assertEquals("daily/dig", nameOf(moved));
        assertEquals("daily/mine", nameOf(late), "not a second 'dig' for the same actor");
    }

    @Test
    void aChangeSeenWithNoRowToMoveIsStillDone() {
        List<KeyChange> list = List.of(new KeyChange.Group("daily", "everyday"));
        assertEquals(0, changes.apply(list).join().moved());

        UUID late = row("daily", "mine", null);
        rotations.save(actor, "daily").join();
        var again = changes.apply(list).join();

        assertEquals(List.of(new Left("daily", "everyday", 2)), again.left());
        assertEquals("daily/mine", nameOf(late));
        assertEquals(1, rotationsOf("daily"));
    }

    @Test
    void aChangeUndoneThenMadeAgainMovesTheRowsEachTime() {
        UUID id = row("daily", "mine", null);
        changes.apply(List.of(new KeyChange.Quest("daily", "mine", "dig"))).join();

        assertEquals(1, changes.apply(List.of(new KeyChange.Quest("daily", "dig", "mine"))).join().moved());
        assertEquals("daily/mine", nameOf(id));

        assertEquals(1, changes.apply(List.of(new KeyChange.Quest("daily", "mine", "dig"))).join().moved());
        assertEquals("daily/dig", nameOf(id));
    }

    @Test
    void aFormerKeyGivenToANewQuestFollowsThatQuestWhenItChangesToo() {
        row("daily", "mine", null);
        changes.apply(List.of(new KeyChange.Quest("daily", "mine", "dig"))).join();

        // "mine" is a new quest now, with rows of its own; later its key changes to "ore".
        UUID fresh = row("daily", "mine", null);
        assertEquals(1, changes.apply(List.of(new KeyChange.Quest("daily", "mine", "ore"))).join().moved());

        assertEquals("daily/ore", nameOf(fresh));
    }

    @Test
    void aSecondChangeOfTheSameQuestDoesNotReopenTheFirst() {
        UUID id = row("daily", "mine", null);
        changes.apply(List.of(new KeyChange.Quest("daily", "mine", "dig"))).join();
        UUID late = row("daily", "mine", null);

        // old_key: [mine, dig] on the quest now keyed "excavate".
        List<KeyChange> list = List.of(
                new KeyChange.Quest("daily", "mine", "excavate"),
                new KeyChange.Quest("daily", "dig", "excavate"));
        assertEquals(1, changes.apply(list).join().moved());

        assertEquals("daily/excavate", nameOf(id));
        assertEquals("daily/mine", nameOf(late));
        // "dig" dropped from the list later: "mine" is still known to have become "excavate".
        var later = changes.apply(List.of(new KeyChange.Quest("daily", "mine", "excavate"))).join();
        assertEquals(0, later.moved());
        assertEquals(List.of(new Left("daily/mine", "daily/excavate", 1)), later.left());
    }

    @Test
    void aQuestChangeIsStillKnownAfterItsGroupChangedKey() {
        row("daily", "mine", null);
        changes.apply(List.of(new KeyChange.Quest("daily", "mine", "dig"))).join();
        changes.apply(List.of(
                new KeyChange.Group("daily", "everyday"),
                new KeyChange.Quest("everyday", "mine", "dig"))).join();

        UUID late = row("everyday", "mine", null);
        var again = changes.apply(List.of(
                new KeyChange.Group("daily", "everyday"),
                new KeyChange.Quest("everyday", "mine", "dig"))).join();

        assertEquals(0, again.moved());
        assertEquals("everyday/mine", nameOf(late));
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
