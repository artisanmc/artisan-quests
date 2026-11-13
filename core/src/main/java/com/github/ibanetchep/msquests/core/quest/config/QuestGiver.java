package com.github.ibanetchep.msquests.core.quest.config;

import org.jetbrains.annotations.Nullable;

/**
 * The NPC that hands a quest out. The quest names it, the NPC is not configured: a click on that
 * NPC offers the quest to a player who may start it ({@code canStartQuest}).
 *
 * @param npc the NPC's id, as the NPC module knows it
 * @param conversation the conversation that offers the quest, played before it starts; null to
 *        start it on the click
 */
public record QuestGiver(String npc, @Nullable String conversation) {
    public QuestGiver {
        if (npc == null || npc.isBlank()) throw new IllegalArgumentException("giver.npc cannot be empty");
        if (conversation != null && conversation.isBlank()) conversation = null;
    }
}
