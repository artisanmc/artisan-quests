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

    /**
     * What the NPC says when the objective is validated there, written in the quest: a text, or
     * one per language ({@code {fr: …, en: …}}). Said when no conversation is named; null for none.
     */
    default @Nullable Object getLine() {
        return null;
    }

    /** What the NPC says while it cannot be validated yet (items missing); null for none. */
    default @Nullable Object getMissingLine() {
        return null;
    }

    /** A line as a quest writes it: a text or a non-empty {@code {lang: text}}; null otherwise. */
    static @Nullable Object line(@Nullable Object value) {
        if (value instanceof java.util.Map<?, ?> byLang) {
            java.util.Map<String, String> texts = new java.util.LinkedHashMap<>();
            byLang.forEach((lang, text) -> {
                if (text != null && !text.toString().isBlank()) texts.put(String.valueOf(lang), text.toString());
            });
            return texts.isEmpty() ? null : java.util.Collections.unmodifiableMap(texts);
        }
        return text(value);
    }

    static @Nullable String text(@Nullable Object value) {
        if (value == null) return null;
        String text = value.toString().trim();
        return text.isEmpty() ? null : text;
    }
}
