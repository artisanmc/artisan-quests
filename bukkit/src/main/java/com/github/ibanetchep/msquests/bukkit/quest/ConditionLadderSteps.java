package com.github.ibanetchep.msquests.bukkit.quest;

import com.github.ibanetchep.msquests.core.lang.Translator;
import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import com.github.ibanetchep.msquests.core.quest.config.group.LadderSteps;
import net.artisanmc.modules.api.condition.ConditionsApi;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.jetbrains.annotations.Nullable;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Reads a ladder step's {@code completed_when} with Artisan's conditions. The actor's own values
 * ({@code guild_level}, {@code actor_name}…) are bound for {@code expression} conditions, numbers
 * as numbers.
 *
 * <p>Artisan reads conditions for an online player. Conditions that only compare bound values
 * ask nothing of that player, so anyone online will do: the viewer, a member, any player.
 * The others ({@code has_permission}, a {@code %placeholder%}) are about the player: they are
 * read for a member of the actor only, and unknown without one online.
 */
public final class ConditionLadderSteps implements LadderSteps {

    private final ConditionsApi conditions;
    private final Supplier<Translator> translator;

    public ConditionLadderSteps(ConditionsApi conditions, Supplier<Translator> translator) {
        this.conditions = conditions;
        this.translator = translator;
    }

    @Override
    public Optional<Boolean> done(QuestActor actor, QuestConfig step, @Nullable UUID viewer) {
        List<Object> list = step.getCompletedWhen().conditions();
        Player context = context(actor, viewer, needsThePlayer(list));
        if (context == null) return Optional.empty();
        try {
            return Optional.of(conditions.test(context, list, bindings(actor.getPlaceholders(translator.get()))));
        } catch (IllegalStateException offThePlayersThread) {
            return Optional.empty();
        }
    }

    private static @Nullable Player context(QuestActor actor, @Nullable UUID viewer, boolean member) {
        Player seen = viewer != null ? Bukkit.getPlayer(viewer) : null;
        if (seen != null && (!member || actor.isMember(seen.getUniqueId()))) return seen;
        Player any = null;
        for (Player player : Bukkit.getOnlinePlayers()) {
            if (actor.isMember(player.getUniqueId())) return player;
            any = player;
        }
        return member ? null : any;
    }

    /** False when every condition is an {@code expression} over bound values, without placeholder. */
    static boolean needsThePlayer(@Nullable Object node) {
        if (node instanceof List<?> list) return list.stream().anyMatch(ConditionLadderSteps::needsThePlayer);
        if (node instanceof Map<?, ?> map) {
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                String name = String.valueOf(entry.getKey());
                if (name.equals("expression")) {
                    if (String.valueOf(entry.getValue()).contains("%")) return true;
                } else if (List.of("and", "or", "not").contains(name)) {
                    if (needsThePlayer(entry.getValue())) return true;
                } else {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    /** The actor's placeholders as bindings: {@code "3"} becomes 3, so {@code guild_level >= 2} compares numbers. */
    static Map<String, Object> bindings(Map<String, String> placeholders) {
        Map<String, Object> bindings = new LinkedHashMap<>();
        placeholders.forEach((key, value) -> {
            Object bound = value;
            try {
                bound = Long.parseLong(value.trim());
            } catch (NumberFormatException notWhole) {
                try {
                    bound = Double.parseDouble(value.trim());
                } catch (NumberFormatException text) {
                    // kept as text
                }
            }
            bindings.put(key, bound);
        });
        return bindings;
    }
}
