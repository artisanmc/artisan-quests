package com.github.ibanetchep.msquests.core.stats;

import com.github.ibanetchep.msquests.core.stats.QuestFigures.QuestRow;
import com.github.ibanetchep.msquests.core.stats.QuestFigures.StageRow;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class QuestFiguresTest {

    @Test
    void medianTakesTheMiddleOrTheMeanOfTheTwoMiddles() {
        assertNull(QuestFigures.median(List.of()));
        assertEquals(5.0, QuestFigures.median(List.of(9L, 1L, 5L)));
        assertEquals(3.0, QuestFigures.median(List.of(1L, 2L, 4L, 100L)));
    }

    @Test
    void progressCountsEachStatusAndTheMedianTimeToComplete() {
        List<Map<String, Object>> rows = QuestFigures.progress(List.of(
                new QuestRow("u1", "COMPLETED", 0, 60_000L),
                new QuestRow("u1", "COMPLETED", 0, 180_000L),
                new QuestRow("u1", "COMPLETED", 0, null),
                new QuestRow("u1", "IN_PROGRESS", 0, null),
                new QuestRow("u1", "FAILED", 0, null),
                new QuestRow("u2", "EXPIRED", 0, null),
                new QuestRow("gone", "COMPLETED", 0, 1L)
        ), uid -> uid.equals("gone") ? null : "quest_" + uid);

        assertEquals(2, rows.size());
        Map<String, Object> first = rows.get(0);
        assertEquals("quest_u1", first.get("quest"));
        assertEquals(5, first.get("started"));
        assertEquals(1, first.get("in_progress"));
        assertEquals(3, first.get("completed"));
        assertEquals(1, first.get("abandoned"));
        assertEquals(120.0, first.get("median_seconds"));
        assertEquals(1, rows.get(1).get("expired"));
        assertNull(rows.get(1).get("median_seconds"));
    }

    @Test
    void aQuestStandsOnItsFirstUnfinishedStageSinceTheStageBeforeEnded() {
        long now = 1_000_000;
        List<Map<String, Object>> rows = QuestFigures.stuck(List.of(
                // a: first stage done at 400 000, stands on the second for 600 s
                new StageRow("a", "u1", 0, "two", 1, null),
                new StageRow("a", "u1", 0, "one", 0, 400_000L),
                // b: still on the first stage since it started, 900 s ago
                new StageRow("b", "u1", 100_000, "one", 2, null),
                new StageRow("b", "u1", 100_000, "two", 1, null),
                // c: on the second stage for 200 s
                new StageRow("c", "u1", 0, "one", 0, 800_000L),
                new StageRow("c", "u1", 0, "two", 1, null),
                // d: a stage completed before its time was recorded counts from the quest's start
                new StageRow("d", "u2", 500_000, "one", 0, null),
                new StageRow("d", "u2", 500_000, "two", 3, null)
        ), uid -> "quest_" + uid, uid -> List.of("one", "two"), now);

        assertEquals(3, rows.size());
        Map<String, Object> two = rows.stream().filter(r -> r.get("quest").equals("quest_u1") && r.get("stage").equals("two")).findFirst().orElseThrow();
        assertEquals(2, two.get("players"));
        assertEquals(400.0, two.get("median_seconds"));
        assertEquals(600L, two.get("longest_seconds"));
        Map<String, Object> one = rows.stream().filter(r -> r.get("stage").equals("one")).findFirst().orElseThrow();
        assertEquals(1, one.get("players"));
        assertEquals(900.0, one.get("median_seconds"));
        Map<String, Object> other = rows.stream().filter(r -> r.get("quest").equals("quest_u2")).findFirst().orElseThrow();
        assertEquals(500.0, other.get("median_seconds"));
    }
}
