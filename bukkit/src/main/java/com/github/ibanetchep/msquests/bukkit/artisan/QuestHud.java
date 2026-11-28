package com.github.ibanetchep.msquests.bukkit.artisan;

import net.artisanmc.modules.api.text.OverlayLayout;
import org.jetbrains.annotations.Nullable;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * A {@code quest_hud} Document ({@code quest_huds/<id>.yaml}): how the tracked quest is drawn in
 * Artisan's boss bar slot. Its {@code layout} is an {@link OverlayLayout} whose {@code text} layers
 * {@link #SLOTS} the plugin fills with {@code texts} (MiniMessage with the objective's and the
 * quest's placeholders), {@link #DEFAULT_TEXTS} for one the file leaves out. Twin of the editor's
 * {@code hud.ts}.
 */
record QuestHud(String id, OverlayLayout layout, Map<String, String> texts, List<OverlayLayout.Problem> problems) {

    static final String KIND = "quest_hud";
    static final String DIR = "quest_huds";
    static final String SCHEMA = "quest_hud/v1";

    /** The named layers the plugin fills. */
    static final List<String> SLOTS = List.of("quest", "objective", "progress");

    /** What a named layer shows when the file sets nothing: same as {@code DEFAULT_TEXTS} of {@code hud.ts}. */
    static final Map<String, String> DEFAULT_TEXTS = Map.of(
            "quest", "<gold>%quest_name%",
            "objective", "<white>%objective_name%",
            "progress", "<gray>[<yellow>%objective_progress%<gray>/%objective_target%]");

    /** The file's YAML as Artisan serves it ({@code api.getProject().documents}), {@code id} included. */
    static QuestHud read(Map<String, Object> document) {
        String id = String.valueOf(document.getOrDefault("id", ""));
        OverlayLayout.Read read = OverlayLayout.read(document.get("layout"));
        Map<String, String> texts = new LinkedHashMap<>();
        Object raw = document.get("texts");
        for (String slot : SLOTS) {
            String value = raw instanceof Map<?, ?> map && map.get(slot) instanceof String s && !s.isEmpty() ? s : null;
            texts.put(slot, value != null ? value : DEFAULT_TEXTS.get(slot));
        }
        return new QuestHud(id, read.layout(), Map.copyOf(texts), read.problems());
    }

    /** The text of a named layer, before its placeholders are filled. */
    @Nullable String text(String slot) {
        return texts.get(slot);
    }
}
