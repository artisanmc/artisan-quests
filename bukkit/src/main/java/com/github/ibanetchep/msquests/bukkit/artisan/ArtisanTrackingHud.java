package com.github.ibanetchep.msquests.bukkit.artisan;

import com.github.ibanetchep.msquests.bukkit.service.TrackingHud;
import com.github.ibanetchep.msquests.bukkit.text.MessageBuilder;
import com.github.ibanetchep.msquests.core.quest.actor.Quest;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjective;
import net.artisanmc.modules.api.text.OverlayApi;
import net.artisanmc.modules.api.text.OverlayContent;
import net.artisanmc.modules.api.text.OverlayLayout;
import org.bukkit.entity.Player;

import java.util.List;
import java.util.function.Consumer;
import java.util.function.Supplier;

/**
 * The tracked quest in Artisan's boss bar slot ({@code OverlayApi.Slot.BOSS_BAR}, API 1.13.0), drawn
 * from the {@code quest_hud} named by {@code tracking.bossbar.hud}. Only for a player whose client
 * has the pack, and only while the pack holds every image of the layout: otherwise it draws nothing
 * and the player gets the boss bar. Built only on an Artisan that has the slot.
 */
final class ArtisanTrackingHud implements TrackingHud {

    /** The layer's name in the slot. */
    static final String LAYER = "quests:tracking";

    private final OverlayApi overlay;
    private final Supplier<QuestHud> hud;
    private final Consumer<List<String>> missingImages;

    /**
     * @param hud the HUD in use, read again on each draw (it changes with a reload); null for none.
     * @param missingImages told which images the pack lacks when a draw falls back to the boss bar.
     */
    ArtisanTrackingHud(OverlayApi overlay, Supplier<QuestHud> hud, Consumer<List<String>> missingImages) {
        this.overlay = overlay;
        this.hud = hud;
        this.missingImages = missingImages;
    }

    @Override
    public boolean show(Player player, Quest quest, QuestObjective objective) {
        QuestHud current = hud.get();
        if (current == null || !overlay.hasPack(player)) {
            hide(player);
            return false;
        }
        OverlayApi.Composed frame = overlay.compose(current.layout(), content(current, quest, objective));
        if (!frame.missingImages().isEmpty()) {
            missingImages.accept(frame.missingImages());
            hide(player);
            return false;
        }
        overlay.show(player, OverlayApi.Slot.BOSS_BAR, LAYER, 0, frame.miniMessage());
        return true;
    }

    @Override
    public void hide(Player player) {
        overlay.hide(player, OverlayApi.Slot.BOSS_BAR, LAYER);
    }

    /** Each named text layer of the layout, its text with the objective's and the quest's placeholders. */
    static OverlayContent content(QuestHud hud, Quest quest, QuestObjective objective) {
        OverlayContent.Builder content = OverlayContent.builder();
        for (OverlayLayout.Layer layer : hud.layout().getLayers()) {
            if (!(layer instanceof OverlayLayout.Text text)) continue;
            String source = hud.text(text.slot());
            if (source == null) continue;
            String filled = MessageBuilder.raw(source)
                    .applyPlaceholderResolver(objective)
                    .applyPlaceholderResolver(quest)
                    .toStringRaw();
            content.text(text.slot(), List.of(filled));
        }
        return content.build();
    }
}
