package com.github.ibanetchep.msquests.bukkit.document;

import com.github.ibanetchep.msquests.bukkit.document.QuestGroupChangeCheck.Finding;
import com.github.ibanetchep.msquests.bukkit.document.QuestGroupChangeCheck.Level;
import com.github.ibanetchep.msquests.core.impact.ImpactSource;
import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class QuestGroupChangeCheckTest {

    /** Twelve players have {@code daily/mine} in progress, on its only stage. */
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
    private final QuestGroupChangeCheck check = new QuestGroupChangeCheck(twelveMining);

    @Test
    void aFileTheReaderRefusesIsAProblem() {
        Map<String, Object> doc = group(quest("dig", "mine"), quest("mine", null));

        Finding finding = only(check.check("daily", group(quest("mine", null)), doc, Map.of(), "en"));

        assertEquals(Level.PROBLEM, finding.level());
        assertTrue(finding.message().contains("old_key"), finding.message());
    }

    @Test
    void aKeyChangedWithoutOldKeyIsALossAndWithItANote() {
        Map<String, Object> before = group(quest("mine", null));

        Finding lost = only(check.check("daily", before, group(quest("dig", null)), Map.of(), "fr"));
        assertEquals(Level.LOSS, lost.level());
        assertTrue(lost.message().startsWith("La quête 'mine' disparaît et 'dig' est nouvelle : 12 quêtes en cours"), lost.message());

        Finding kept = only(check.check("daily", before, group(quest("dig", "mine")), Map.of(), "en"));
        assertEquals(Level.NOTICE, kept.level());
        assertTrue(kept.message().startsWith("Quest 'mine' becomes 'dig' and keeps its progress (12 quests in progress)"), kept.message());
    }

    @Test
    void aDeletedFileIsALossUnlessAnotherGroupOfTheProjectTakesItsPlace() {
        Map<String, Object> before = group(quest("mine", null));

        assertEquals(Level.LOSS, only(check.check("daily", before, null, Map.of(), "en")).level());

        Map<String, Object> everyday = group(quest("mine", null));
        everyday.put("old_key", "daily");
        assertEquals(List.of(), check.check("daily", before, null, Map.of("everyday", everyday), "en"));
        assertEquals(Level.NOTICE, only(check.check("everyday", null, everyday, Map.of(), "en")).level());
    }

    @Test
    void theIdArtisanAddsToTheDocumentIsAccepted() {
        Map<String, Object> doc = group(quest("mine", null));
        doc.put("id", "daily");

        assertEquals(List.of(), check.check("daily", doc, doc, Map.of(), "en"));
    }

    private static Finding only(List<Finding> findings) {
        assertEquals(1, findings.size(), findings.toString());
        return findings.get(0);
    }

    private static Map<String, Object> group(Object... quests) {
        Map<String, Object> doc = new LinkedHashMap<>();
        doc.put("schema", QuestGroupDocumentReader.SCHEMA);
        doc.put("title", "Daily");
        doc.put("actor_type", "player");
        doc.put("quests", List.of(quests));
        return doc;
    }

    private static Map<String, Object> quest(String key, String oldKey) {
        Map<String, Object> quest = new LinkedHashMap<>();
        quest.put("key", key);
        quest.put("title", key);
        if (oldKey != null) quest.put("old_key", oldKey);
        quest.put("stages", List.of(Map.of("key", "dig", "objectives",
                List.of(Map.of("key", "stone", "type", "block_break", "material", "STONE", "amount", 100)))));
        return quest;
    }
}
