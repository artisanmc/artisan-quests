package com.github.ibanetchep.msquests.core.quest.objective;

import com.github.ibanetchep.msquests.core.lang.PlaceholderProvider;
import com.github.ibanetchep.msquests.core.lang.Translatable;
import com.github.ibanetchep.msquests.core.quest.actor.Quest;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStage;
import com.github.ibanetchep.msquests.core.quest.config.QuestObjectiveConfig;

public interface QuestObjective extends PlaceholderProvider, Translatable {

    QuestStage getStage();
    QuestObjectiveConfig getObjectiveConfig();
    boolean isCompleted();

    /**
     * False for an objective that is completed without its completion ever having been run: its
     * progress reached a target lowered since. Its events and actions are still owed.
     */
    default boolean isCompletionRecorded() {
        return true;
    }
    void complete();
    void incrementProgress(int progress);
    double getProgressRatio();
    double getProgressPercent();
    String getProgressPercentFormatted();

    QuestObjectiveStatus getStatus();

    int getTarget();
    int getProgress();

    default String getType() {
        return getObjectiveConfig().getType();
    }

    default Quest getQuest() {
        return getStage().getQuest();
    }
}
