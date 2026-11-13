package com.github.ibanetchep.msquests.bukkit.quest.objective.talknpc;

import com.github.ibanetchep.msquests.bukkit.BukkitQuestsPlugin;
import com.github.ibanetchep.msquests.bukkit.quest.objective.BukkitQuestObjectiveHandler;
import com.github.ibanetchep.msquests.bukkit.quest.objective.ObjectiveTypes;

/**
 * No game event drives it: the NPC module validates it with the {@code quests:advance} action,
 * once the player clicked the NPC and its conversation, when it names one, confirmed.
 */
public class TalkNpcObjectiveHandler extends BukkitQuestObjectiveHandler<TalkNpcObjective> {

    public TalkNpcObjectiveHandler(BukkitQuestsPlugin plugin) {
        super(plugin);
    }

    @Override
    protected String getObjectiveType() {
        return ObjectiveTypes.TALK_NPC;
    }

    @Override
    public void init() {}

    @Override
    public void destroy() {}
}
