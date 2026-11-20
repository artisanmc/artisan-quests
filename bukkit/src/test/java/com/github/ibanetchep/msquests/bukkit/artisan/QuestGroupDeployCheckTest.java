package com.github.ibanetchep.msquests.bukkit.artisan;

import com.github.ibanetchep.msquests.bukkit.document.QuestGroupChangeCheck;
import com.github.ibanetchep.msquests.bukkit.document.QuestGroupDocumentReader;
import com.github.ibanetchep.msquests.core.impact.ImpactSource;
import net.artisanmc.modules.api.document.DocumentChangeCheck;
import net.artisanmc.modules.api.document.DocumentKindDeclaration;
import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class QuestGroupDeployCheckTest {

    private final ImpactSource twelveMining = new ImpactSource() {
        @Override
        public List<QuestCount> quests(String groupKey) {
            return groupKey.equals("daily") ? List.of(new QuestCount("mine", "dig", 12, 0)) : List.of();
        }

        @Override
        public List<ObjectiveCount> objectives(String groupKey) {
            return List.of();
        }

        @Override
        public int reaching(String groupKey, String questKey, String objectiveKey, int target) {
            return 0;
        }
    };

    @Test
    void theKindTellsArtisansDeployReviewWhatAChangedGroupDoes() {
        DocumentKindDeclaration kind = QuestGroupDeployCheck.on(
                new DocumentKindDeclaration("quest_group", "quest_groups", List.of(QuestGroupDocumentReader.SCHEMA), null),
                new QuestGroupChangeCheck(twelveMining));
        DocumentChangeCheck check = kind.getChangeCheck();
        assertNotNull(check);

        List<DocumentChangeCheck.Finding> removed = check.check(new DocumentChangeCheck.Change(
                "quests", "daily", group("mine"), group("dig"), Map.of(), "fr"));
        assertEquals(1, removed.size());
        assertEquals(DocumentChangeCheck.Level.LOSS, removed.get(0).level());
        assertTrue(removed.get(0).message().contains("12 quêtes en cours"), removed.get(0).message());

        Map<String, Object> broken = group("mine");
        broken.remove("actor_type");
        assertEquals(DocumentChangeCheck.Level.PROBLEM, check.check(new DocumentChangeCheck.Change(
                "quests", "daily", null, broken, Map.of(), "en")).get(0).level());

        assertEquals(List.of(), check.check(new DocumentChangeCheck.Change(
                "quests", "daily", group("mine"), group("mine"), Map.of(), "en")));
    }

    private static Map<String, Object> group(String questKey) {
        Map<String, Object> quest = new LinkedHashMap<>();
        quest.put("key", questKey);
        quest.put("title", questKey);
        quest.put("stages", List.of(Map.of("key", "dig", "objectives",
                List.of(Map.of("key", "stone", "type", "block_break", "material", "STONE", "amount", 100)))));
        Map<String, Object> doc = new LinkedHashMap<>();
        doc.put("schema", QuestGroupDocumentReader.SCHEMA);
        doc.put("title", "Daily");
        doc.put("actor_type", "player");
        doc.put("quests", List.of(quest));
        return doc;
    }
}
