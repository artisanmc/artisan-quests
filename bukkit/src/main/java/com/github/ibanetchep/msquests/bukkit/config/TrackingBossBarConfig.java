package com.github.ibanetchep.msquests.bukkit.config;

import com.github.ibanetchep.msquests.bukkit.platform.BarOverlay;
import org.bukkit.boss.BarColor;

public record TrackingBossBarConfig(
        boolean enabled,
        String message,
        BarColor color,
        BarOverlay style,
        boolean showProgress,
        /**
         * The {@code quest_hud} Document drawn instead of the bar for a player who has Artisan's
         * pack ({@code <project>:<id>} or {@code <id>}), blank for none.
         */
        String hud
) {}
