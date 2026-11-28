package com.github.ibanetchep.msquests.database;

import com.github.ibanetchep.msquests.core.dto.QuestDTO;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveDTO;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjectiveStatus;
import com.github.ibanetchep.msquests.database.repository.ArtisanQuestSqlRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** H2: an import's quest rows, their ledger, and a rollback that keeps what a player moved. */
class ImportLedgerTest {

    private static final String SOURCE = "quests:test";

    @TempDir
    File dataFolder;

    private DbAccess db;
    private ImportLedger ledger;
    private final UUID player = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        db = new DbAccess();
        db.initPool(new DbCredentials("h2", null, null, null, null, 0, dataFolder));
        ledger = new ImportLedger(db.getJdbi());
    }

    @AfterEach
    void tearDown() {
        db.closePool();
    }

    @Test
    void writesOnceThenRollsBack() throws Exception {
        QuestDTO quest = quest(UUID.randomUUID(), 3);
        assertTrue(ledger.writeQuest(SOURCE, "player:a:quest:1", "B1", quest, "player"));
        assertFalse(ledger.writeQuest(SOURCE, "player:a:quest:1", "B2", quest, "player"), "the ledger skips it");
        assertEquals(Set.of("player:a:quest:1"), ledger.imported(SOURCE));

        Map<UUID, QuestDTO> loaded = new ArtisanQuestSqlRepository(db).getAllByActor(player).get();
        assertEquals(3, loaded.get(quest.id()).objectives().get("kill").progress());
        assertEquals("s2", loaded.get(quest.id()).objectives().get("kill").stageKey());

        List<ImportLedger.Row> rows = ledger.inBatch(SOURCE, "B1");
        assertEquals(1, rows.size());
        assertEquals(ImportLedger.Undo.UNDONE, ledger.undoQuest(SOURCE, rows.get(0), true));
        assertEquals(1, new ArtisanQuestSqlRepository(db).getAllByActor(player).get().size(), "a dry run keeps it");
        assertEquals(ImportLedger.Undo.UNDONE, ledger.undoQuest(SOURCE, rows.get(0), false));
        assertTrue(new ArtisanQuestSqlRepository(db).getAllByActor(player).get().isEmpty());
        assertTrue(ledger.imported(SOURCE).isEmpty());
    }

    @Test
    void aQuestMovedSinceIsKept() throws Exception {
        QuestDTO quest = quest(UUID.randomUUID(), 3);
        ledger.writeQuest(SOURCE, "player:a:quest:1", "B1", quest, "player");
        // The player kills one more zombie: the plugin saves the quest.
        new ArtisanQuestSqlRepository(db).save(quest(quest.id(), 4)).get();

        ImportLedger.Row row = ledger.inBatch(SOURCE, "B1").get(0);
        assertEquals(ImportLedger.Undo.CHANGED, ledger.undoQuest(SOURCE, row, false));
        assertEquals(1, new ArtisanQuestSqlRepository(db).getAllByActor(player).get().size());
        assertEquals(Set.of("player:a:quest:1"), ledger.imported(SOURCE));
    }

    @Test
    void filesAreRecordedAndForgotten() {
        ledger.record(SOURCE, "group:g", "quest_groups/g.yaml#abc", "B1");
        assertEquals("quest_groups/g.yaml#abc", ledger.inBatch(SOURCE, "B1").get(0).target());
        ledger.forget(SOURCE, "group:g");
        assertTrue(ledger.inBatch(SOURCE, "B1").isEmpty());
    }

    private QuestDTO quest(UUID id, int kills) {
        Map<String, QuestObjectiveDTO> objectives = new LinkedHashMap<>();
        objectives.put("mine", new QuestObjectiveDTO(id, "mine", "block_break", QuestObjectiveStatus.COMPLETED, 10, "s1"));
        objectives.put("kill", new QuestObjectiveDTO(id, "kill", "kill_entity", QuestObjectiveStatus.PENDING, kills, "s2"));
        return new QuestDTO(id, "q", "g", player, QuestStatus.IN_PROGRESS, null, 1000L, 1000L, objectives, "UID1");
    }
}
