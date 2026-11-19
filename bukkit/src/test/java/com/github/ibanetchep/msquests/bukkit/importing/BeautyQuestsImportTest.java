package com.github.ibanetchep.msquests.bukkit.importing;

import com.github.ibanetchep.msquests.bukkit.document.QuestGroupDocumentReader;
import com.github.ibanetchep.msquests.core.dto.QuestConfigDTO;
import com.github.ibanetchep.msquests.core.dto.QuestDTO;
import com.github.ibanetchep.msquests.core.dto.QuestGroupConfigDTO;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjectiveStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** BeautyQuests files (1.0 and 2.x layouts) → quest_group Documents and quest rows. */
class BeautyQuestsImportTest {

    private static final Set<String> MATERIALS = Set.of("STONE", "IRON_ORE", "DIAMOND", "IRON_INGOT", "COD", "BREAD");
    private static final Set<String> ENTITIES = Set.of("ZOMBIE", "COW");
    private static final UUID P1 = UUID.fromString("11111111-1111-4111-8111-111111111111");
    private static final UUID P2 = UUID.fromString("22222222-2222-4222-8222-222222222222");

    private Path root;
    private BeautyQuestsContent.Result content;

    @BeforeEach
    void convert() throws Exception {
        root = Path.of(getClass().getResource("/beautyquests/quests/1.yml").toURI()).getParent().getParent();
        List<BeautyQuestsContent.Source> sources = new ArrayList<>();
        for (String name : List.of("1.yml", "2.yml", "3.yml", "4.yml")) {
            sources.add(new BeautyQuestsContent.Source(name,
                    BeautyQuestsImporter.yaml(Files.readString(root.resolve("quests").resolve(name), StandardCharsets.UTF_8))));
        }
        content = new BeautyQuestsContent("en", new BeautyQuestsContent.Items() {
            @Override
            public Map<String, Object> spec(Map<String, Object> serialized) {
                return Map.of("material", serialized.get("type"));
            }

            @Override
            public int amount(Map<String, Object> serialized) {
                return Yaml.integer(serialized.get("amount"), 1);
            }
        }, new BeautyQuestsContent.Names() {
            @Override
            public boolean material(String name) {
                return MATERIALS.contains(name);
            }

            @Override
            public boolean entity(String name) {
                return ENTITIES.contains(name);
            }
        }).convert(sources);
    }

    /** What the quest reload checks before building an objective: its params against its type's schema. */
    @Test
    void everyObjectivePassesItsTypeSchema() {
        Map<String, Class<?>> configs = Map.of(
                "block_break", com.github.ibanetchep.msquests.bukkit.quest.objective.blockbreak.BlockBreakObjectiveConfig.class,
                "kill_entity", com.github.ibanetchep.msquests.bukkit.quest.objective.killentity.KillEntityObjectiveConfig.class,
                "deliver_item", com.github.ibanetchep.msquests.bukkit.quest.objective.deliveritem.DeliverItemObjectiveConfig.class,
                "talk_npc", com.github.ibanetchep.msquests.bukkit.quest.objective.talknpc.TalkNpcObjectiveConfig.class,
                "fishing", com.github.ibanetchep.msquests.bukkit.quest.objective.fishing.FishingObjectiveConfig.class,
                "craft_item", com.github.ibanetchep.msquests.bukkit.quest.objective.craftitem.CraftItemObjectiveConfig.class,
                "breed_animal", com.github.ibanetchep.msquests.bukkit.quest.objective.breedanimal.BreedAnimalObjectiveConfig.class,
                "execute_command", com.github.ibanetchep.msquests.bukkit.quest.objective.executecommand.ExecuteCommandObjectiveConfig.class);
        int checked = 0;
        for (String group : content.documents().keySet()) {
            QuestGroupConfigDTO dto = QuestGroupDocumentReader.read(group, content.documents().get(group), "en");
            for (QuestConfigDTO quest : dto.quests()) {
                for (var stage : quest.stages()) {
                    for (var objective : stage.objectives()) {
                        Class<?> config = configs.get(objective.type());
                        assertNotNull(config, objective.type());
                        String schema = com.github.ibanetchep.msquests.core.util.JsonSchemaGenerator.generateSchema(config);
                        org.junit.jupiter.api.Assertions.assertDoesNotThrow(() -> com.github.ibanetchep.msquests.core.util
                                .JsonSchemaValidator.validate(objective.params(), schema), objective.key());
                        checked++;
                    }
                }
            }
        }
        assertTrue(checked >= 8);
    }

    @Test
    void groupsReadBackAsArtisanQuestsReadsThem() {
        assertEquals(Set.of("beautyquests", "beautyquests_repeatable"), content.documents().keySet());
        QuestGroupConfigDTO once = QuestGroupDocumentReader.read("beautyquests", content.documents().get("beautyquests"), "en");
        assertEquals(1, once.quests().size());
        assertEquals(1, once.maxPerPeriod());
        QuestConfigDTO miner = once.questsAsMap().get("quest_1");
        assertEquals("<gold>The miner", miner.name());
        assertEquals(4, miner.stages().size());
        assertEquals("citizens_12", miner.giver().npc());

        QuestGroupConfigDTO repeat = QuestGroupDocumentReader.read("beautyquests_repeatable",
                content.documents().get("beautyquests_repeatable"), "en");
        assertNull(repeat.maxPerPeriod());
        assertEquals(4, repeat.questsAsMap().get("quest_2").stages().size());
    }

    @Test
    void stagesBecomeObjectives() {
        BeautyQuestsContent.Quest miner = content.quests().get(1);
        assertEquals(List.of("mine_1", "mine_2"), miner.stages().get(0).objectives().stream().map(BeautyQuestsContent.Objective::key).toList());
        assertEquals("block_break", miner.stages().get(0).objectives().get(1).type());
        assertEquals("kill_entity", miner.stages().get(1).objectives().get(0).type());
        assertEquals("deliver_item", miner.stages().get(2).objectives().get(0).type());
        assertEquals(-2, miner.stages().get(3).index());
        assertEquals("talk_npc", miner.stages().get(3).objectives().get(0).type());

        List<String> types = content.quests().get(2).stages().stream().map(s -> s.objectives().get(0).type()).toList();
        assertEquals(List.of("fishing", "craft_item", "breed_animal", "execute_command"), types);
        assertEquals(3, content.quests().get(2).stages().get(1).objectives().get(0).amount());
        assertEquals(Map.of("citizens_12", "12"), content.citizens());
    }

    @Test
    void rewardsAndRequirementsAreArtisanChains() {
        Map<String, Object> quest = quest("beautyquests", 0);
        assertEquals(List.of(Map.of("has_permission", "quests.miner"), Map.of("has_level", 5)), quest.get("requirements"));
        @SuppressWarnings("unchecked")
        Map<String, Object> actions = (Map<String, Object>) quest.get("actions");
        @SuppressWarnings("unchecked")
        List<Object> complete = (List<Object>) actions.get("complete");
        assertEquals(Map.of("send_message", Map.of("text", Map.of("en", "<green>Well done!"))), complete.get(0));
        assertEquals(Map.of("run_command", Map.of("command", "eco give {player} 100", "as", "console")), complete.get(1));
        assertEquals(Map.of("give_item", Map.of("material", "DIAMOND", "count", 3)), complete.get(2));
        assertEquals(Map.of("give_xp", Map.of("amount", 50)), complete.get(3));
        assertTrue(actions.containsKey("objective_complete"), "the zombie stage's reward runs when its objective completes");
        assertTrue(content.notes().stream().anyMatch(n -> n.contains("reward wait")));
        assertTrue(content.notes().stream().anyMatch(n -> n.contains("cooldown")));
    }

    @Test
    void questsArtisanQuestsCannotRunAreSetAside() {
        Map<String, String> codes = new java.util.HashMap<>();
        content.rejected().forEach(r -> codes.put(r.sourceId(), r.code()));
        assertEquals(Map.of("quest:3", "unsupported_stage", "quest:4", "branches"), codes);
        assertFalse(content.quests().containsKey(3));
    }

    @Test
    void sameFilesSameUids() throws Exception {
        String first = content.quests().get(1).uid();
        convert();
        assertEquals(first, content.quests().get(1).uid());
        assertEquals(26, first.length());
    }

    @Test
    void playerFilesOfBothVersions() throws Exception {
        BeautyQuestsProgress.Read read = BeautyQuestsProgress.files(root.resolve("players"), BeautyQuestsImporter::yaml);
        assertEquals(1, read.rejected().size(), "the AccountsHook account");
        assertEquals("unknown_player", read.rejected().get(0).code());
        assertEquals(5, read.entries().size());

        BeautyQuestsProgress.Entry mining = entry(read, P1, 1);
        assertTrue(mining.inProgress());
        QuestDTO row = BeautyQuestsRows.plan(mining, content.quests().get(1), 1000L).quest();
        assertEquals(QuestStatus.IN_PROGRESS, row.status());
        assertEquals(32, row.objectives().get("mine_1").progress());
        assertEquals(QuestObjectiveStatus.COMPLETED, row.objectives().get("mine_2").objectiveStatus());
        assertEquals(3, row.objectives().get("kill_1").progress());
        assertEquals(QuestObjectiveStatus.PENDING, row.objectives().get("kill_1").objectiveStatus());
        assertEquals(0, row.objectives().get("deliver_1").progress());
        assertEquals(content.quests().get(1).uid(), row.questUid());
        assertEquals(P1, row.actorId());

        assertEquals(QuestStatus.COMPLETED, BeautyQuestsRows.plan(entry(read, P1, 2), content.quests().get(2), 1000L).quest().status());
        BeautyQuestsRows.Planned notImported = BeautyQuestsRows.plan(entry(read, P1, 3), content.quests().get(3), 1000L);
        assertEquals("quest_not_imported", notImported.code());

        assertEquals(QuestStatus.COMPLETED, BeautyQuestsRows.plan(entry(read, P2, 1), content.quests().get(1), 1000L).quest().status());
        QuestDTO crafting = BeautyQuestsRows.plan(entry(read, P2, 2), content.quests().get(2), 1000L).quest();
        assertEquals(10, crafting.objectives().get("fish_1").progress());
        assertEquals(2, crafting.objectives().get("craft_1").progress());
        assertEquals(crafting.id(), BeautyQuestsRows.plan(entry(read, P2, 2), content.quests().get(2), 5L).quest().id());
    }

    @Test
    void databasesOfBothVersions() throws Exception {
        try (Connection c = DriverManager.getConnection("jdbc:h2:mem:bq" + UUID.randomUUID() + ";MODE=MySQL")) {
            try (Statement s = c.createStatement()) {
                s.execute("CREATE TABLE player_accounts (id INT PRIMARY KEY, identifier TEXT, player_uuid CHAR(36))");
                s.execute("CREATE TABLE player_quests (id INT PRIMARY KEY, account_id INT, quest_id INT, finished INT,"
                        + " timer BIGINT, current_branch SMALLINT, current_stage SMALLINT, additional_datas TEXT, quest_flow VARCHAR(100))");
                s.execute("INSERT INTO player_accounts VALUES (1, '" + P1 + "', '" + P1 + "')");
                s.execute("INSERT INTO player_quests VALUES (1, 1, 1, 0, NULL, 0, 1,"
                        + " '{\"stage1\":{\"remaining\":{\"8d6a3f1e-0000-4000-8000-000000000003\":4}}}', NULL)");
            }
            BeautyQuestsProgress.Read v1 = BeautyQuestsProgress.database(c, Map.of());
            assertEquals(1, v1.entries().size());
            assertEquals(1, BeautyQuestsRows.plan(v1.entries().get(0), content.quests().get(1), 0L).quest().objectives().get("kill_1").progress());

            try (Statement s = c.createStatement()) {
                s.execute("CREATE TABLE questers_quests (quester_provider VARCHAR(255), quester_identifier VARCHAR(255), quest_id INT,"
                        + " finished INT, timer BIGINT, current_branch SMALLINT, current_stage SMALLINT, starting_time BIGINT,"
                        + " stage_data TEXT, additional_datas TEXT, state VARCHAR(60), quest_flow VARCHAR(100))");
                s.execute("INSERT INTO questers_quests VALUES ('beautyquests:players', '" + P2 + "', 2, 0, NULL, 0, 0, NULL,"
                        + " '{\"0\":{\"remaining\":{\"c0de0000-0000-4000-8000-000000000001\":7}}}', NULL, 'IN_REGULAR_STAGE', NULL)");
            }
            BeautyQuestsProgress.Read v2 = BeautyQuestsProgress.database(c, Map.of());
            assertEquals(1, v2.entries().size());
            assertEquals(3, BeautyQuestsRows.plan(v2.entries().get(0), content.quests().get(2), 0L).quest().objectives().get("fish_1").progress());
        }
    }

    @Test
    void legacyColours() {
        assertEquals("<gold><bold>Hi \\<3", LegacyText.toMiniMessage("§6&lHi <3"));
        assertEquals("<#ff0000>x", LegacyText.toMiniMessage("§x§f§f§0§0§0§0x"));
        assertEquals("<#00ff00>y", LegacyText.toMiniMessage("&#00FF00y"));
    }

    private static BeautyQuestsProgress.Entry entry(BeautyQuestsProgress.Read read, UUID player, int quest) {
        return read.entries().stream().filter(e -> e.player().equals(player) && e.quest() == quest).findFirst().orElseThrow();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> quest(String group, int index) {
        return ((List<Map<String, Object>>) content.documents().get(group).get("quests")).get(index);
    }
}
