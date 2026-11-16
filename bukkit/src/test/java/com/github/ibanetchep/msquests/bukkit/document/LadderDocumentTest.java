package com.github.ibanetchep.msquests.bukkit.document;

import com.github.ibanetchep.msquests.core.dto.QuestGroupConfigDTO;
import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class LadderDocumentTest {

    private static Map<String, Object> doc(Map<String, Object> distribution) {
        Map<String, Object> doc = new LinkedHashMap<>();
        doc.put("schema", QuestGroupDocumentReader.SCHEMA);
        doc.put("uid", "01M5440VEJ1YN73PQM8W3Z9CM5");
        doc.put("title", "Levels");
        doc.put("actor_type", "guild");
        doc.put("distribution", distribution);
        doc.put("quests", List.of());
        return doc;
    }

    @Test
    void theLadderPositionSurvivesAReadAndAWrite() {
        QuestGroupConfigDTO read = QuestGroupDocumentReader.read("guild_levels",
                doc(Map.of("strategy", "ladder", "position", "%msguilds_level%")), "fr");
        assertEquals("LADDER", read.distribution().strategy());
        assertEquals("%msguilds_level%", read.distribution().position());

        Map<String, Object> written = QuestGroupDocumentWriter.write(read, "01M5440VEJ1YN73PQM8W3Z9CM5",
                key -> key, quest -> List.of(), "fr", null);
        @SuppressWarnings("unchecked")
        Map<String, Object> distribution = (Map<String, Object>) written.get("distribution");
        assertEquals("ladder", distribution.get("strategy"));
        assertEquals("%msguilds_level%", distribution.get("position"));
    }

    @Test
    void aLadderWithoutPositionIsRefused() {
        DocumentException e = assertThrows(DocumentException.class,
                () -> QuestGroupDocumentReader.read("guild_levels", doc(Map.of("strategy", "ladder")), "fr"));
        assertEquals(true, e.getMessage().contains("distribution.position"));
    }
}
