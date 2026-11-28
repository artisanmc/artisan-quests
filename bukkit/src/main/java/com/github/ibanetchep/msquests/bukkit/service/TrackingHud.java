package com.github.ibanetchep.msquests.bukkit.service;

import com.github.ibanetchep.msquests.core.quest.actor.Quest;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjective;
import org.bukkit.entity.Player;

/**
 * The tracked quest drawn as a HUD instead of the boss bar ({@code tracking.bossbar.hud}): Artisan's
 * boss bar slot, for a player whose client has the pack. {@link TrackingBossBarService} asks it
 * first and shows its own bar when it draws nothing.
 */
public interface TrackingHud {

    /** No HUD: every player gets the boss bar. */
    TrackingHud NONE = new TrackingHud() {
        @Override
        public boolean show(Player player, Quest quest, QuestObjective objective) {
            return false;
        }

        @Override
        public void hide(Player player) {}
    };

    /**
     * Draws {@code objective} of {@code quest} for {@code player}, or replaces what it drew.
     *
     * @return false when it drew nothing (no pack, no such HUD, an image missing from the pack): the
     *     player gets the boss bar, and whatever the HUD showed before is gone.
     */
    boolean show(Player player, Quest quest, QuestObjective objective);

    /** Takes the HUD away for {@code player}; nothing when it shows none. */
    void hide(Player player);
}
