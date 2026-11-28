package com.github.ibanetchep.msquests.core.quest.config;

import org.jetbrains.annotations.Nullable;

/**
 * The NPC that hands a quest out. The quest names it, the NPC is not configured: a click on that
 * NPC offers the quest to a player who may start it ({@code canStartQuest}).
 *
 * @param npc the NPC's id, as the NPC module knows it
 * @param conversation the conversation that offers the quest, played before it starts; null to
 *        start it on the click
 * @param line what the NPC says to offer the quest when no conversation is named: a text, or one
 *        per language ({@code {fr: …, en: …}}); null for none
 */
public record QuestGiver(String npc, @Nullable String conversation, @Nullable Object line) {

    public QuestGiver(String npc, @Nullable String conversation) {
        this(npc, conversation, null);
    }

    public QuestGiver {
        if (npc == null || npc.isBlank()) throw new IllegalArgumentException("giver.npc cannot be empty");
        if (conversation != null && conversation.isBlank()) conversation = null;
        if (line instanceof String text && text.isBlank()) line = null;
        if (line instanceof java.util.Map<?, ?> byLang && byLang.isEmpty()) line = null;
    }
}
