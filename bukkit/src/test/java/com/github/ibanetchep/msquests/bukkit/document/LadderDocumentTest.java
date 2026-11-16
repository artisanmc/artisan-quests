package com.github.ibanetchep.msquests.bukkit.document;

import com.github.ibanetchep.msquests.core.dto.QuestGroupConfigDTO;
import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class LadderDocumentTest {

    @Test
    void aStepsCompletedWhenSurvivesAReadAndAWrite() {
        List<Object> completedWhen = List.of(Map.of("expression", "guild_level >= 1"));
        Map<String, Object> quest = new LinkedHashMap<>();
        quest.put("key", "level_01");
        quest.put("uid", "01M5440VEJWXEXTKMBZ8PT2X7E");
        quest.put("title", "Level 1");
        quest.put("completed_when", completedWhen);
        quest.put("stages", List.of(Map.of("key", "rankup", "objectives",
                List.of(Map.of("key", "stone", "type", "block_break", "material", "STONE", "amount", 1)))));
        Map<String, Object> doc = new LinkedHashMap<>();
        doc.put("schema", QuestGroupDocumentReader.SCHEMA);
        doc.put("uid", "01M5440VEJ1YN73PQM8W3Z9CM5");
        doc.put("title", "Levels");
        doc.put("actor_type", "guild");
        doc.put("distribution", Map.of("strategy", "ladder"));
        doc.put("quests", List.of(quest));

        QuestGroupConfigDTO read = QuestGroupDocumentReader.read("guild_levels", doc, "fr");
        assertEquals("LADDER", read.distribution().strategy());
        assertEquals(completedWhen, read.quests().get(0).completedWhen());

        Map<String, Object> written = QuestGroupDocumentWriter.write(read, "01M5440VEJ1YN73PQM8W3Z9CM5",
                key -> "01M5440VEJWXEXTKMBZ8PT2X7E", q -> q.stages(), "fr", null);
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> quests = (List<Map<String, Object>>) written.get("quests");
        assertEquals(completedWhen, quests.get(0).get("completed_when"));
        assertEquals("ladder", ((Map<?, ?>) written.get("distribution")).get("strategy"));
    }
}
