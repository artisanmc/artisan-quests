package com.github.ibanetchep.msquests.bukkit.quest;

import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;
import com.github.ibanetchep.msquests.core.quest.config.group.LadderPositions;
import me.clip.placeholderapi.PlaceholderAPI;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.jetbrains.annotations.Nullable;

import com.github.ibanetchep.msquests.core.lang.Translator;

import java.util.Map;
import java.util.OptionalInt;
import java.util.function.Supplier;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

/**
 * Reads a ladder's {@code position}. The actor's own placeholders come first ({@code %guild_level%}
 * on a guild): they need nobody online. What is left goes through PlaceholderAPI for an online
 * member of the actor (the player, any member of a guild); without one, the position is unknown
 * and the ladder waits for the next check.
 */
public final class PlaceholderLadderPositions implements LadderPositions {

    private final Logger logger;
    private final Supplier<Translator> translator;
    private final Set<String> warned = ConcurrentHashMap.newKeySet();

    public PlaceholderLadderPositions(Logger logger, Supplier<Translator> translator) {
        this.logger = logger;
        this.translator = translator;
    }

    @Override
    public OptionalInt position(QuestActor actor, String expression) {
        String own = withActorPlaceholders(actor.getPlaceholders(translator.get()), expression);
        if (!own.contains("%")) return checked(own, expression);
        Player member = null;
        for (Player player : Bukkit.getOnlinePlayers()) {
            if (actor.isMember(player.getUniqueId())) {
                member = player;
                break;
            }
        }
        if (member == null) return OptionalInt.empty();
        String resolved = Bukkit.getPluginManager().getPlugin("PlaceholderAPI") != null
                ? PlaceholderAPI.setPlaceholders(member, own)
                : own;
        return checked(resolved, expression);
    }

    /** {@code %key%} replaced by the actor's placeholder of that key; other text untouched. */
    public static String withActorPlaceholders(Map<String, String> placeholders, String expression) {
        String result = expression;
        for (Map.Entry<String, String> entry : placeholders.entrySet()) {
            result = result.replace("%" + entry.getKey() + "%", entry.getValue());
        }
        return result;
    }

    private OptionalInt checked(String resolved, String expression) {
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
