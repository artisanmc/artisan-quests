package com.github.ibanetchep.msquests.bukkit.quest.objective.talknpc;

import com.github.ibanetchep.msquests.core.quest.actor.QuestStage;
import com.github.ibanetchep.msquests.core.quest.objective.AbstractQuestObjective;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjectiveStatus;

public class TalkNpcObjective extends AbstractQuestObjective<TalkNpcObjectiveConfig> {

    public TalkNpcObjective(QuestStage questStage, TalkNpcObjectiveConfig objectiveConfig, int progress, QuestObjectiveStatus status) {
        super(questStage, objectiveConfig, progress, status);
    }
}
