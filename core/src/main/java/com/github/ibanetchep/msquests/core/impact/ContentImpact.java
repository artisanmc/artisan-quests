package com.github.ibanetchep.msquests.core.impact;

import com.github.ibanetchep.msquests.core.dto.QuestConfigDTO;
import com.github.ibanetchep.msquests.core.dto.QuestGroupConfigDTO;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveConfigDTO;
import com.github.ibanetchep.msquests.core.dto.QuestStageConfigDTO;
import com.github.ibanetchep.msquests.core.repository.KeyChange;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * What publishing a new version of a quest group does to the quests already started, said before
 * it is published: the rules of <em>Content changed under a quest in progress</em>
 * ({@code ARCHITECTURE.md}) read ahead, with how many quests in progress each one touches.
 *
 * <p>Every change has one of four outcomes for an actor: nothing changes (no impact listed), they
 * move on, content added behind them is not asked of them, or they lose progress
 * ({@link Impact#loss()}). The server applies the change the same way whether or not this was read.
 */
public final class ContentImpact {

    private ContentImpact() {
    }

    /**
     * @param before  the group as the server loaded it; null: a new file
     * @param after   the group once published; null: its file is deleted
     * @param changes the former keys {@code after} declares ({@code old_key})
     * @param claimed the places other groups of the project claim once published: a group key, or
     *                {@code group/quest} ({@code old_key} of another file)
     * @return the impacts, losses first
     */
    public static List<Impact> of(@Nullable QuestGroupConfigDTO before, @Nullable QuestGroupConfigDTO after,
                                  List<KeyChange> changes, Set<String> claimed, ImpactSource source) {
        List<Impact> out = new ArrayList<>();
        if (before == null && after == null) {
            return out;
        }
        if (after == null) {
            if (!claimed.contains(before.key())) {
                int n = inProgress(source.quests(before.key()));
                if (n > 0) out.add(Impact.loss("group.removed", "group", before.key(), "n", n));
            }
            return out;
        }

        // What follows from elsewhere: the group's former file name, quests that were in another group.
        for (KeyChange change : changes) {
            if (change instanceof KeyChange.Group group) {
                int n = inProgress(source.quests(group.from()));
                if (n > 0) out.add(Impact.notice("group.renamed", "from", group.from(), "group", group.to(), "n", n));
            } else if (change instanceof KeyChange.QuestMoved moved) {
                int n = inProgress(source.quests(moved.fromGroup()), moved.from());
                if (n > 0) {
                    out.add(Impact.notice("quest.moved", "from", moved.fromGroup() + "/" + moved.from(), "quest", moved.to(), "n", n));
                }
            }
        }
        if (before == null) {
            return sorted(out);
        }

        String group = before.key();
        List<ImpactSource.QuestCount> questCounts = source.quests(group);
        List<ImpactSource.ObjectiveCount> objectiveCounts = source.objectives(group);

        Map<String, String> formerOf = new HashMap<>();
        for (KeyChange change : changes) {
            if (change instanceof KeyChange.Quest quest) formerOf.put(quest.from(), quest.to());
        }
        Map<String, QuestConfigDTO> afterQuests = byKey(after.quests());
        Map<String, QuestConfigDTO> beforeQuests = byKey(before.quests());
        List<String> added = new ArrayList<>();
        for (String key : afterQuests.keySet()) {
            boolean known = beforeQuests.containsKey(key)
                    || formerOf.entrySet().stream().anyMatch(e -> e.getValue().equals(key) && beforeQuests.containsKey(e.getKey()));
            boolean cameFromElsewhere = changes.stream().anyMatch(c -> c instanceof KeyChange.QuestMoved m && m.to().equals(key));
            if (!known && !cameFromElsewhere) added.add(key);
        }
        List<String> removed = new ArrayList<>();
        for (QuestConfigDTO quest : before.quests() == null ? List.<QuestConfigDTO>of() : before.quests()) {
            String key = quest.key();
            QuestConfigDTO now = afterQuests.get(key);
            if (now == null && formerOf.containsKey(key)) {
                now = afterQuests.get(formerOf.get(key));
                int n = inProgress(questCounts, key);
                if (now != null && n > 0) {
                    out.add(Impact.notice("quest.renamed", "from", key, "quest", now.key(), "n", n));
                }
            }
            if (now == null) {
                if (!claimed.contains(group + "/" + key)) removed.add(key);
                continue;
            }
            questChanged(quest, now, questCounts, objectiveCounts, source, group, out);
        }
        for (String key : removed) {
            int n = inProgress(questCounts, key);
            int finished = finished(questCounts, key);
            if (n == 0 && finished == 0) continue;
            // One quest gone and one new: most likely the same quest whose key was changed by hand.
            if (removed.size() == 1 && added.size() == 1) {
                out.add(new Impact(n > 0, "quest.replaced", args("quest", key, "new", added.get(0), "n", n, "finished", finished)));
            } else {
                out.add(new Impact(n > 0, "quest.removed", args("quest", key, "n", n, "finished", finished)));
            }
        }

        if (blank(before.resetCron()) && !blank(after.resetCron()) && finished(questCounts) > 0) {
            out.add(Impact.notice("group.reset_added", "group", group, "n", finished(questCounts)));
        }
        return sorted(out);
    }

    private static void questChanged(QuestConfigDTO before, QuestConfigDTO after,
                                     List<ImpactSource.QuestCount> questCounts,
                                     List<ImpactSource.ObjectiveCount> objectiveCounts,
                                     ImpactSource source, String group, List<Impact> out) {
        String quest = before.key();
        int active = inProgress(questCounts, quest);
        if (active == 0) {
            return;
        }
        List<QuestStageConfigDTO> beforeStages = stages(before);
        List<QuestStageConfigDTO> afterStages = stages(after);
        Map<String, QuestObjectiveConfigDTO> beforeObjectives = objectives(beforeStages);
        Map<String, QuestObjectiveConfigDTO> afterObjectives = objectives(afterStages);
        Map<String, String> stageOfBefore = stageOf(beforeStages);
        Map<String, String> stageOfAfter = stageOf(afterStages);

        // An objective of the new version, and the one it was.
        Map<String, String> wasOf = new LinkedHashMap<>();
        for (QuestObjectiveConfigDTO objective : afterObjectives.values()) {
            if (beforeObjectives.containsKey(objective.key())) {
                wasOf.put(objective.key(), objective.key());
                continue;
            }
            for (String former : formerKeys(objective)) {
                if (beforeObjectives.containsKey(former)) {
                    wasOf.put(objective.key(), former);
                    break;
                }
            }
        }
        List<String> gone = new ArrayList<>(beforeObjectives.keySet());
        gone.removeAll(wasOf.values());
        List<String> fresh = new ArrayList<>(afterObjectives.keySet());
        fresh.removeAll(wasOf.keySet());

        // Gone and new on the same stage with the same type: most likely a key changed by hand.
        for (String key : List.copyOf(gone)) {
            QuestObjectiveConfigDTO was = beforeObjectives.get(key);
            String twin = fresh.stream().filter(candidate -> {
                QuestObjectiveConfigDTO now = afterObjectives.get(candidate);
                return java.util.Objects.equals(now.type(), was.type())
                        && java.util.Objects.equals(stageOfAfter.get(candidate), stageOfBefore.get(key));
            }).findFirst().orElse(null);
            if (twin == null) continue;
            int n = started(objectiveCounts, quest, key, was.type()) + completed(objectiveCounts, quest, key, was.type());
            if (n > 0) {
                out.add(Impact.loss("objective.replaced", "quest", quest, "objective", key, "new", twin, "n", n));
            }
            gone.remove(key);
            fresh.remove(twin);
        }
        for (String key : gone) {
            QuestObjectiveConfigDTO was = beforeObjectives.get(key);
            int n = started(objectiveCounts, quest, key, was.type());
            out.add(Impact.notice("objective.removed", "quest", quest, "objective", key, "n", n, "active", active));
        }
        for (Map.Entry<String, String> entry : wasOf.entrySet()) {
            QuestObjectiveConfigDTO now = afterObjectives.get(entry.getKey());
            QuestObjectiveConfigDTO was = beforeObjectives.get(entry.getValue());
            int started = started(objectiveCounts, quest, was.key(), was.type());
            int completed = completed(objectiveCounts, quest, was.key(), was.type());
            if (!java.util.Objects.equals(now.type(), was.type())) {
                if (started + completed > 0) {
                    out.add(Impact.loss("objective.type_changed", "quest", quest, "objective", now.key(),
                            "from", String.valueOf(was.type()), "to", String.valueOf(now.type()), "n", started + completed));
                }
                continue;
            }
            int from = target(was);
            int to = target(now);
            if (to > from && started + completed > 0) {
                out.add(Impact.notice("objective.target_raised", "quest", quest, "objective", now.key(),
                        "from", from, "to", to, "n", started, "kept", completed));
            } else if (to < from) {
                int n = source.reaching(group, quest, was.key(), to);
                if (n > 0) {
                    out.add(Impact.notice("objective.target_lowered", "quest", quest, "objective", now.key(),
                            "from", from, "to", to, "n", n));
                }
            }
        }

        List<String> beforeStageKeys = beforeStages.stream().map(QuestStageConfigDTO::key).toList();
        List<String> afterStageKeys = afterStages.stream().map(QuestStageConfigDTO::key).toList();
        for (String key : fresh) {
            String stage = stageOfAfter.get(key);
            if (!beforeStageKeys.contains(stage)) continue; // a new stage says it as a whole
            int on = onStage(questCounts, quest, stage, beforeStageKeys);
            int past = past(questCounts, quest, stage, afterStageKeys);
            out.add(Impact.notice("objective.added", "quest", quest, "objective", key, "stage", stage, "n", on, "past", past));
        }
        for (String stage : afterStageKeys) {
            if (beforeStageKeys.contains(stage)) continue;
            out.add(Impact.notice("stage.added", "quest", quest, "stage", stage,
                    "n", past(questCounts, quest, stage, afterStageKeys), "active", active));
        }
        for (String stage : beforeStageKeys) {
            if (afterStageKeys.contains(stage)) continue;
            int on = onStage(questCounts, quest, stage, beforeStageKeys);
            boolean last = afterStageKeys.isEmpty()
                    || beforeStageKeys.subList(beforeStageKeys.indexOf(stage) + 1, beforeStageKeys.size()).stream().noneMatch(afterStageKeys::contains);
            out.add(Impact.notice(last ? "stage.removed_last" : "stage.removed", "quest", quest, "stage", stage, "n", on));
        }
    }

    private static List<Impact> sorted(List<Impact> impacts) {
        impacts.sort(Comparator.comparing(impact -> !impact.loss()));
        return impacts;
    }

    private static Map<String, Object> args(Object... args) {
        return Impact.notice("", args).args();
    }

    private static boolean blank(@Nullable String value) {
        return value == null || value.isBlank();
    }

    private static Map<String, QuestConfigDTO> byKey(@Nullable List<QuestConfigDTO> quests) {
        Map<String, QuestConfigDTO> out = new LinkedHashMap<>();
        if (quests != null) quests.forEach(quest -> out.put(quest.key(), quest));
        return out;
    }

    private static List<QuestStageConfigDTO> stages(QuestConfigDTO quest) {
        return quest.stages() == null ? List.of() : quest.stages();
    }

    private static Map<String, QuestObjectiveConfigDTO> objectives(List<QuestStageConfigDTO> stages) {
        Map<String, QuestObjectiveConfigDTO> out = new LinkedHashMap<>();
        for (QuestStageConfigDTO stage : stages) {
            if (stage.objectives() != null) stage.objectives().forEach(objective -> out.put(objective.key(), objective));
        }
        return out;
    }

    private static Map<String, String> stageOf(List<QuestStageConfigDTO> stages) {
        Map<String, String> out = new HashMap<>();
        for (QuestStageConfigDTO stage : stages) {
            if (stage.objectives() != null) stage.objectives().forEach(objective -> out.put(objective.key(), stage.key()));
        }
        return out;
    }

    private static List<String> formerKeys(QuestObjectiveConfigDTO objective) {
        Object old = objective.params().get("old_key");
        if (old instanceof String key) return List.of(key);
        if (old instanceof List<?> keys) return keys.stream().filter(String.class::isInstance).map(String.class::cast).toList();
        return List.of();
    }

    /** How much completes the objective: its {@code amount}, 1 for one that is done or not. */
    private static int target(QuestObjectiveConfigDTO objective) {
        return objective.params().get("amount") instanceof Number amount ? amount.intValue() : 1;
    }

    private static int inProgress(List<ImpactSource.QuestCount> counts) {
        return counts.stream().mapToInt(ImpactSource.QuestCount::inProgress).sum();
    }

    private static int inProgress(List<ImpactSource.QuestCount> counts, String quest) {
        return counts.stream().filter(count -> count.questKey().equals(quest)).mapToInt(ImpactSource.QuestCount::inProgress).sum();
    }

    private static int finished(List<ImpactSource.QuestCount> counts) {
        return counts.stream().mapToInt(ImpactSource.QuestCount::finished).sum();
    }

    private static int finished(List<ImpactSource.QuestCount> counts, String quest) {
        return counts.stream().filter(count -> count.questKey().equals(quest)).mapToInt(ImpactSource.QuestCount::finished).sum();
    }

    /** In progress on {@code stage}; a row whose stage is not recorded yet counts on the first one. */
    private static int onStage(List<ImpactSource.QuestCount> counts, String quest, String stage, List<String> stages) {
        boolean first = !stages.isEmpty() && stages.get(0).equals(stage);
        return counts.stream()
                .filter(count -> count.questKey().equals(quest))
                .filter(count -> stage.equals(count.reachedStage()) || (first && count.reachedStage() == null))
                .mapToInt(ImpactSource.QuestCount::inProgress).sum();
    }

    /** In progress on a stage that comes after {@code stage} in {@code stages}. */
    private static int past(List<ImpactSource.QuestCount> counts, String quest, String stage, List<String> stages) {
        int at = stages.indexOf(stage);
        return counts.stream()
                .filter(count -> count.questKey().equals(quest) && count.reachedStage() != null)
                .filter(count -> stages.indexOf(count.reachedStage()) > at)
                .mapToInt(ImpactSource.QuestCount::inProgress).sum();
    }

    private static int started(List<ImpactSource.ObjectiveCount> counts, String quest, String objective, String type) {
        return counts.stream().filter(count -> matches(count, quest, objective, type)).mapToInt(ImpactSource.ObjectiveCount::started).sum();
    }

    private static int completed(List<ImpactSource.ObjectiveCount> counts, String quest, String objective, String type) {
        return counts.stream().filter(count -> matches(count, quest, objective, type)).mapToInt(ImpactSource.ObjectiveCount::completed).sum();
    }

    /** A row written for another type is already ignored by the server: it is no progress to lose. */
    private static boolean matches(ImpactSource.ObjectiveCount count, String quest, String objective, String type) {
        return count.questKey().equals(quest) && count.objectiveKey().equals(objective)
                && (count.type() == null || count.type().isBlank() || count.type().equals(type));
    }
}
