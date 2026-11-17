package com.github.ibanetchep.msquests.core.stats;

import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

/**
 * The figures of the quests' statistics tab that events cannot give: they describe where the
 * actors stand now, read from the quest rows. Pure: the rows come from
 * {@link QuestFiguresSource}, the stage order from the loaded configuration.
 */
public final class QuestFigures {

    private QuestFigures() {
    }

    /** One quest row. Times in epoch milliseconds. */
    public record QuestRow(String questUid, String status, long createdAt, @Nullable Long completedAt) {
    }

    /** One stage of one quest in progress: how many of its objectives remain, when the last one ended. */
    public record StageRow(String questId, String questUid, long createdAt, String stageKey, int remaining,
                           @Nullable Long lastCompletedAt) {
    }

    /** The middle value of {@code values}, the mean of the two middle ones for an even count; null when empty. */
    public static @Nullable Double median(List<Long> values) {
        if (values.isEmpty()) return null;
        List<Long> sorted = new ArrayList<>(values);
        Collections.sort(sorted);
        int mid = sorted.size() / 2;
        return sorted.size() % 2 == 1 ? (double) sorted.get(mid) : (sorted.get(mid - 1) + sorted.get(mid)) / 2.0;
    }

    /**
     * Per quest: how many were started, are in progress, completed, expired or abandoned, and the
     * median time from start to completion. A quest nobody started gets no row.
     *
     * @param keyOf the key a quest's uid has in the loaded configuration; null leaves the quest out
     */
    public static List<Map<String, Object>> progress(Collection<QuestRow> rows, Function<String, @Nullable String> keyOf) {
        Map<String, int[]> counts = new LinkedHashMap<>();
        Map<String, List<Long>> durations = new LinkedHashMap<>();
        for (QuestRow row : rows) {
            String key = keyOf.apply(row.questUid());
            if (key == null) continue;
            int[] count = counts.computeIfAbsent(key, k -> new int[5]);
            count[0]++;
            switch (row.status()) {
                case "IN_PROGRESS" -> count[1]++;
                case "COMPLETED" -> {
                    count[2]++;
                    if (row.completedAt() != null && row.completedAt() >= row.createdAt()) {
                        durations.computeIfAbsent(key, k -> new ArrayList<>())
                                .add((row.completedAt() - row.createdAt()) / 1000);
                    }
                }
                case "EXPIRED" -> count[3]++;
                case "FAILED" -> count[4]++;
                default -> {
                }
            }
        }
        List<Map<String, Object>> out = new ArrayList<>();
        counts.forEach((key, count) -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("quest", key);
            row.put("started", count[0]);
            row.put("in_progress", count[1]);
            row.put("completed", count[2]);
            row.put("expired", count[3]);
            row.put("abandoned", count[4]);
            row.put("median_seconds", median(durations.getOrDefault(key, List.of())));
            out.add(row);
        });
        return out;
    }

    /**
     * Per quest and stage: how many quests in progress stand on that stage, and for how long
     * (median and longest, in seconds). A quest stands on the first stage, in the configured
     * order, that still has an objective to complete; it entered it when the last objective of
     * the stages before ended, or when it started.
     *
     * @param keyOf the key a quest's uid has in the loaded configuration; null leaves the quest out
     * @param stagesOf the stage keys of a quest's uid, in order
     * @param now epoch milliseconds
     */
    public static List<Map<String, Object>> stuck(
            Collection<StageRow> rows,
            Function<String, @Nullable String> keyOf,
            Function<String, List<String>> stagesOf,
            long now
    ) {
        Map<String, List<StageRow>> byQuest = new LinkedHashMap<>();
        for (StageRow row : rows) byQuest.computeIfAbsent(row.questId(), k -> new ArrayList<>()).add(row);

        Map<String, Map<String, List<Long>>> waits = new LinkedHashMap<>();
        for (List<StageRow> stages : byQuest.values()) {
            StageRow first = stages.get(0);
            String key = keyOf.apply(first.questUid());
            if (key == null) continue;
            long entered = first.createdAt();
            for (String stageKey : stagesOf.apply(first.questUid())) {
                StageRow stage = stages.stream().filter(s -> s.stageKey().equals(stageKey)).findFirst().orElse(null);
                if (stage == null) continue;
                if (stage.remaining() > 0) {
                    waits.computeIfAbsent(key, k -> new LinkedHashMap<>())
                            .computeIfAbsent(stageKey, k -> new ArrayList<>())
                            .add(Math.max(0, (now - entered) / 1000));
                    break;
                }
                if (stage.lastCompletedAt() != null) entered = Math.max(entered, stage.lastCompletedAt());
            }
        }

        List<Map<String, Object>> out = new ArrayList<>();
        waits.forEach((quest, stages) -> stages.forEach((stage, seconds) -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("quest", quest);
            row.put("stage", stage);
            row.put("players", seconds.size());
            row.put("median_seconds", median(seconds));
            row.put("longest_seconds", Collections.max(seconds));
            out.add(row);
        }));
        return out;
    }
}
