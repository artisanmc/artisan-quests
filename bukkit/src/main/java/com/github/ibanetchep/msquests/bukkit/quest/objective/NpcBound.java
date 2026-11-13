package com.github.ibanetchep.msquests.bukkit.quest.objective;

import org.jetbrains.annotations.Nullable;

/**
 * An objective config that may name the NPC it is done at: the quest declares the link, the NPC
 * is not configured. Read by the {@code quests:npc} data source, which tells an NPC module what a
 * click on that NPC is worth to a player.
 */
public interface NpcBound {

    /** The NPC's id, null for an objective no NPC serves. */
    @Nullable String getNpc();

    /** The conversation played when the objective can be validated there, null for none. */
    @Nullable String getConversation();

    /** The conversation played when it cannot be validated yet (items missing), null for none. */
    default @Nullable String getMissingConversation() {
        return null;
    }

    static @Nullable String text(@Nullable Object value) {
        if (value == null) return null;
        String text = value.toString().trim();
        return text.isEmpty() ? null : text;
    }
}
