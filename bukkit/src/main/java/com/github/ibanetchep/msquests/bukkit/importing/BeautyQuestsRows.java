package com.github.ibanetchep.msquests.bukkit.importing;

import com.github.ibanetchep.msquests.bukkit.importing.BeautyQuestsContent.Objective;
import com.github.ibanetchep.msquests.bukkit.importing.BeautyQuestsContent.Progress;
import com.github.ibanetchep.msquests.bukkit.importing.BeautyQuestsContent.Quest;
import com.github.ibanetchep.msquests.bukkit.importing.BeautyQuestsContent.Stage;
import com.github.ibanetchep.msquests.core.dto.QuestDTO;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveDTO;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjectiveStatus;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

/**
 * A player's BeautyQuests progress on one quest as the {@code artisan_quests_quest} row it becomes:
 * a quest in progress keeps its stage and its counters (the stages before it done, the ones after
 * it untouched), a quest finished and not restarted becomes one completed row. Pure.
 */
public final class BeautyQuestsRows {

    /** A row to write, or why there is none: {@code code} null and {@code quest} null means nothing to import. */
    public record Planned(BeautyQuestsProgress.Entry entry, QuestDTO quest, String code, String message) {
        static Planned row(BeautyQuestsProgress.Entry entry, QuestDTO quest) {
            return new Planned(entry, quest, null, null);
        }

        static Planned rejected(BeautyQuestsProgress.Entry entry, String code, String message) {
            return new Planned(entry, null, code, message);
        }

        static Planned nothing(BeautyQuestsProgress.Entry entry) {
            return new Planned(entry, null, null, null);
        }

        public boolean isRow() {
            return quest != null;
        }

        public boolean isRejected() {
            return code != null;
        }
    }

    private BeautyQuestsRows() {
    }

    /** @param quest the converted quest, null when its quest was not imported */
    public static Planned plan(BeautyQuestsProgress.Entry entry, Quest quest, long now) {
        if (quest == null) {
            return Planned.rejected(entry, "quest_not_imported", "quest " + entry.quest() + " was not imported");
        }
        UUID id = rowId(entry);
        Map<String, QuestObjectiveDTO> objectives = new LinkedHashMap<>();
        if (entry.inProgress()) {
            Stage current = quest.stageAt(entry.stage());
            if (current == null) {
                return Planned.rejected(entry, "stage_mismatch", "the player stands on stage " + entry.stage()
                        + " of quest " + entry.quest() + ", which the quest file does not have");
            }
            boolean before = true;
            for (Stage stage : quest.stages()) {
                if (stage == current) before = false;
                for (Objective o : stage.objectives()) {
                    int progress;
                    if (before) progress = o.amount();
                    else if (stage == current) progress = progress(current, o, entry.data());
                    else progress = 0;
                    QuestObjectiveStatus status = progress >= o.amount() ? QuestObjectiveStatus.COMPLETED : QuestObjectiveStatus.PENDING;
                    objectives.put(o.key(), new QuestObjectiveDTO(id, o.key(), o.type(), status, progress, stage.key()));
                }
            }
            return Planned.row(entry, new QuestDTO(id, quest.key(), quest.group(), entry.player(),
                    QuestStatus.IN_PROGRESS, null, now, now, objectives, quest.uid()));
        }
        if (entry.finished() > 0) {
            for (Stage stage : quest.stages()) {
                for (Objective o : stage.objectives()) {
                    objectives.put(o.key(), new QuestObjectiveDTO(id, o.key(), o.type(),
                            QuestObjectiveStatus.COMPLETED, o.amount(), stage.key()));
                }
            }
            return Planned.row(entry, new QuestDTO(id, quest.key(), quest.group(), entry.player(),
                    QuestStatus.COMPLETED, now, now, now, objectives, quest.uid()));
        }
        return Planned.nothing(entry);
    }

    /** Done so far on the stage the player stands on, from what BeautyQuests counts down. */
    static int progress(Stage stage, Objective o, Map<String, Object> data) {
        Integer remaining = null;
        if (stage.progress() == Progress.REMAINING && o.source() != null) {
            Object left = Yaml.map(data.get("remaining")).get(o.source());
            if (left != null) remaining = Yaml.integer(left, o.amount());
        } else if (stage.progress() == Progress.AMOUNT && data.get("amount") != null) {
            remaining = Yaml.integer(data.get("amount"), o.amount());
        }
        if (remaining == null) return 0;
        return Math.max(0, Math.min(o.amount(), o.amount() - remaining));
    }

    /** The same player and quest always give the same row id. */
    static UUID rowId(BeautyQuestsProgress.Entry entry) {
        return UUID.nameUUIDFromBytes(("beautyquests:" + entry.sourceId()).getBytes(StandardCharsets.UTF_8));
    }
}
