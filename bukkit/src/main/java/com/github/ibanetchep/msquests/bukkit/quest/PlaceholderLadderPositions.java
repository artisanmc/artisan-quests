package com.github.ibanetchep.msquests.bukkit.quest;

import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;
import com.github.ibanetchep.msquests.core.quest.config.group.LadderPositions;
import me.clip.placeholderapi.PlaceholderAPI;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.jetbrains.annotations.Nullable;

import java.util.OptionalInt;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

/**
 * Reads a ladder's {@code position} with PlaceholderAPI, for an online member of the actor: the
 * player for a player actor, any member online for a guild. Without one, the position is unknown
 * and the ladder waits for the next check.
 */
public final class PlaceholderLadderPositions implements LadderPositions {

    private final Logger logger;
    private final Set<String> warned = ConcurrentHashMap.newKeySet();

    public PlaceholderLadderPositions(Logger logger) {
        this.logger = logger;
    }

    @Override
    public OptionalInt position(QuestActor actor, String expression) {
        Player member = null;
        for (Player player : Bukkit.getOnlinePlayers()) {
            if (actor.isMember(player.getUniqueId())) {
                member = player;
                break;
            }
        }
        return member != null ? position(member, expression) : OptionalInt.empty();
    }

    /** The position as {@code viewer} reads it: what a menu shows. */
    public OptionalInt position(Player viewer, String expression) {
        String resolved = Bukkit.getPluginManager().getPlugin("PlaceholderAPI") != null
                ? PlaceholderAPI.setPlaceholders(viewer, expression)
                : expression;
        OptionalInt position = parse(resolved);
        if (position.isEmpty() && warned.add(expression)) {
            logger.warning("Ladder position '" + expression + "' reads '" + resolved
                    + "', not a whole number: the ladder waits until it does.");
        }
        return position;
    }

    /** {@code "3"}, {@code " 3 "}, {@code "3.0"} → 3; anything else is unknown. */
    public static OptionalInt parse(@Nullable String resolved) {
        if (resolved == null) return OptionalInt.empty();
        String value = resolved.trim();
        try {
            return OptionalInt.of(Integer.parseInt(value));
        } catch (NumberFormatException e) {
            try {
                double number = Double.parseDouble(value);
                return number == Math.rint(number) && !Double.isInfinite(number)
                        ? OptionalInt.of((int) number)
                        : OptionalInt.empty();
            } catch (NumberFormatException notANumber) {
                return OptionalInt.empty();
            }
        }
    }
}
