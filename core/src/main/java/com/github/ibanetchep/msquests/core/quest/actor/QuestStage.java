package com.github.ibanetchep.msquests.core.quest.actor;

import com.github.ibanetchep.msquests.core.lang.PlaceholderProvider;
import com.github.ibanetchep.msquests.core.lang.TranslationKey;
import com.github.ibanetchep.msquests.core.lang.Translator;
import com.github.ibanetchep.msquests.core.quest.config.QuestStageConfig;
import com.github.ibanetchep.msquests.core.quest.objective.Flow;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjective;
import org.jetbrains.annotations.Nullable;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class QuestStage implements PlaceholderProvider {

    private final Quest quest;
    private final QuestStageConfig stageConfig;
    private final Map<String, QuestObjective> objectives;
    private boolean passed;

    public QuestStage(Quest quest, QuestStageConfig stageConfig) {
        this.quest = quest;
        this.stageConfig = stageConfig;
        this.objectives = new LinkedHashMap<>();
    }

    public Quest getQuest() {
        return this.quest;
    }

    public QuestStageConfig getStageConfig() {
        return this.stageConfig;
    }

    public void addObjective(QuestObjective objective) {
        this.objectives.put(objective.getObjectiveConfig().getKey(), objective);
    }

    public QuestObjective getObjective(String key) {
        return this.objectives.get(key);
    }

    public boolean isCompleted() {
        return passed || this.objectives.values().stream().allMatch(QuestObjective::isCompleted);
    }

    /**
     * True for a stage the actor had already left when the quest was last saved. It stays behind
     * them whatever the content becomes: an objective added to it, or the whole stage inserted
     * before the one they stand on, is not asked of an actor who is already further.
     */
    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public List<QuestObjective> getActiveObjectives() {
        Flow flow = stageConfig.getFlow();

        // A stage without `flow` (optional in a quest_group Document) runs its objectives in parallel,
        // as AbstractQuestObjective#getStatus already reports them.
        if (flow == null || flow == Flow.PARALLEL) {
            return objectives.values().stream()
                    .filter(o -> !o.isCompleted())
                    .toList();
        }

        var firstActiveObjective = getFirstActiveObjective();
        if (flow == Flow.SEQUENTIAL && firstActiveObjective != null) {
            return List.of(firstActiveObjective);
        }

        return List.of();
    }

    public @Nullable QuestObjective getFirstActiveObjective() {
        if(quest.getCurrentStage() != this) {
            return null;
        }

        return objectives.values().stream()
                .filter(o -> !o.isCompleted())
                .findFirst().orElse(null);
    }

    public Map<String, QuestObjective> getObjectives() {
        return objectives;
    }

    public List<QuestObjective> getObjectiveList() {
        return objectives.values().stream().toList();
    }

    public @Nullable String getName() {
        return stageConfig.getName();
    }

    /** The stage's name as a player reads it: its own, or "Stage 2" when the quest gives it none. */
    public String getDisplayName(Translator translator) {
        return displayName(stageConfig.getName(), quest.getStagesList().indexOf(this) + 1, translator);
    }

    /** A stage's own name, or the default one of its place in the quest ({@code number} from 1). */
    public static String displayName(@Nullable String name, int number, Translator translator) {
        if (name != null && !name.isBlank()) return name;
        return translator.getRaw(TranslationKey.PLACEHOLDER_STAGE_DEFAULT_NAME)
                .replace("%stage_number%", String.valueOf(number));
    }

    public String getKey() {
        return this.stageConfig.getKey();
    }

    public double getProgressRatio() {
        if (passed) return 1.0;
        return objectives.values().stream()
                .mapToDouble(QuestObjective::getProgressRatio)
                .average()
                .orElse(0.0);
    }

    public boolean isActive() {
        return quest.getCurrentStage() == this;
    }

    @Override
    public Map<String, String> getPlaceholders(Translator translator) {
        return Map.of(
                "stage_name", getDisplayName(translator),
                "stage_key", getKey()
        );
    }
}
