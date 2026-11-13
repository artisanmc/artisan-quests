package com.github.ibanetchep.msquests.bukkit.artisan;

import com.github.ibanetchep.msquests.bukkit.BukkitQuestsPlugin;
import com.github.ibanetchep.msquests.bukkit.quest.objective.ContributableObjective;
import com.github.ibanetchep.msquests.bukkit.quest.objective.NpcBound;
import com.github.ibanetchep.msquests.bukkit.quest.objective.deliveritem.DeliverItemObjective;
import com.github.ibanetchep.msquests.bukkit.text.MessageBuilder;
import com.github.ibanetchep.msquests.core.lang.Translator;
import com.github.ibanetchep.msquests.core.quest.actor.Quest;
import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import com.github.ibanetchep.msquests.core.quest.config.QuestGiver;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjective;
import com.github.ibanetchep.msquests.core.quest.player.PlayerProfile;
import com.github.ibanetchep.msquests.core.registry.ActorResolver;
import org.bukkit.entity.Player;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * What the quests expect from NPCs, for one player: the objectives in progress that name an NPC
 * ({@code talk_npc}, a {@code deliver_item} with an {@code npc}) and the quests an NPC gives
 * ({@code giver}) that the player may start now. The quests only say it: an NPC module reads
 * {@code quests:npc}, decides what the click does and validates with {@code quests:advance}.
 *
 * <p>Rows keep one shape and are never null-valued, like {@link QuestRows}. Objectives come
 * first, oldest quest first, then the offers in group and quest order: finishing what was
 * started wins over starting something new.
 */
final class QuestNpcs {

    static final String OBJECTIVE = "objective";
    static final String OFFER = "offer";

    private final BukkitQuestsPlugin plugin;
    private final ActorResolver actors;

    QuestNpcs(BukkitQuestsPlugin plugin) {
        this.plugin = plugin;
        this.actors = new ActorResolver(plugin.getQuestActorRegistry());
    }

    /**
     * @param player the online player the rows describe, null when only their id is known
     *               (a delivery is then never ready: its items cannot be counted)
     * @param npc    one NPC, or null for every NPC
     */
    List<Map<String, Object>> rows(UUID playerId, @Nullable Player player, @Nullable String npc) {
        PlayerProfile profile = plugin.getPlayerProfileRegistry().getPlayerProfile(playerId);
        Translator translator = plugin.getTranslator();
        List<Map<String, Object>> rows = new ArrayList<>();

        List<Quest> quests = plugin.getQuestActorRegistry().getActors().values().stream()
                .filter(actor -> actor.isMember(playerId))
                .flatMap(actor -> actor.getQuests().values().stream())
                .filter(Quest::isActive)
                .sorted(Comparator.comparing(Quest::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(quest -> quest.getId().toString()))
                .toList();
        for (Quest quest : quests) {
            for (QuestObjective objective : quest.getActiveObjectives()) {
                if (objective.isCompleted() || !(objective.getObjectiveConfig() instanceof NpcBound bound)) continue;
                String target = bound.getNpc();
                if (target == null || (npc != null && !npc.equals(target))) continue;
                if (!meetsConditions(objective, profile)) continue;
                rows.add(objectiveRow(objective, bound, ready(objective, player), translator));
            }
        }

        for (QuestGroupConfig group : plugin.getQuestConfigRegistry().getQuestGroupConfigs().values().stream()
                .sorted(Comparator.comparing(QuestGroupConfig::getKey)).toList()) {
            QuestActor actor = null;
            for (QuestConfig config : group.getOrderedQuests()) {
                QuestGiver giver = config.getGiver();
                if (giver == null || (npc != null && !npc.equals(giver.npc()))) continue;
                if (actor == null) actor = actors.resolve(playerId, group.getActorType());
                if (actor == null) break; // no guild, not loaded yet: this group offers nothing
                if (!plugin.getQuestDistributionService()
                        .canStartQuest(actor, config, group.getDistributionStrategy(), profile).isSuccess()) continue;
                rows.add(offerRow(group, config, giver));
            }
        }
        return rows;
    }

    /**
     * Validates one objective bound to an NPC: a {@code talk_npc} completes, a {@code deliver_item}
     * takes the whole missing amount or nothing. False when nothing happened (objective not in
     * progress, conditions not met, items missing, progress refused by another plugin).
     */
    boolean advance(Player player, Quest quest, String objectiveKey) {
        QuestObjective objective = quest.getActiveObjectives().stream()
                .filter(candidate -> objectiveKey.equals(candidate.getObjectiveConfig().getKey()))
                .findFirst().orElse(null);
        if (objective == null || objective.isCompleted()) return false;
        if (!(objective.getObjectiveConfig() instanceof NpcBound bound) || bound.getNpc() == null) return false;

        PlayerProfile profile = plugin.getPlayerProfileRegistry().getPlayerProfile(player.getUniqueId());
        if (!meetsConditions(objective, profile)) return false;

        if (objective instanceof DeliverItemObjective delivery) {
            if (!delivery.canComplete(player)) return false;
            ContributableObjective.Contribution[] taken = new ContributableObjective.Contribution[1];
            boolean allowed = plugin.getQuestProgressService().contributeNow(objective, () -> {
                taken[0] = delivery.contribute(player);
                return taken[0].amount();
            }, profile);
            if (!allowed || taken[0] == null || taken[0].amount() <= 0) return false;
            MessageBuilder message = MessageBuilder.translatable(taken[0].messageKey());
            taken[0].placeholders().forEach(message::placeholder);
            message.send(player);
            return true;
        }

        plugin.getQuestProgressService().progressObjective(objective, objective.getTarget() - objective.getProgress(), profile);
        return true;
    }

    private static boolean ready(QuestObjective objective, @Nullable Player player) {
        if (objective instanceof DeliverItemObjective delivery) {
            return player != null && delivery.canComplete(player);
        }
        return true;
    }

    private boolean meetsConditions(QuestObjective objective, @Nullable PlayerProfile profile) {
        if (objective.getObjectiveConfig().getConditions().isEmpty()) return true;
        if (profile == null) return false;
        return plugin.getConditionChecker().test(objective.getObjectiveConfig().getConditions(), profile, Map.of(
                "quest", objective.getQuest().getQuestConfig().getKey(),
                "objective", objective.getObjectiveConfig().getKey()));
    }

    static Map<String, Object> objectiveRow(QuestObjective objective, NpcBound bound, boolean ready, Translator translator) {
        Quest quest = objective.getQuest();
        QuestGroupConfig group = quest.getQuestGroup();
        String groupKey = group != null ? group.getKey() : "";
        String conversation = ready ? bound.getConversation() : bound.getMissingConversation();

        Map<String, Object> row = base(OBJECTIVE, groupKey, quest.getQuestConfig(), bound.getNpc());
        row.put("id", groupKey + ":" + quest.getQuestConfig().getKey() + ":" + objective.getObjectiveConfig().getKey());
        row.put("objective", objective.getObjectiveConfig().getKey());
        row.put("objective_type", objective.getObjectiveConfig().getType());
        String name = translator.getRaw(objective.getObjectiveConfig());
        row.put("objective_name", name != null ? name : "");
        row.put("ready", ready);
        row.put("conversation", conversation != null ? conversation : "");
        row.put("progress", objective.getProgress());
        row.put("target", objective.getTarget());
        return row;
    }

    static Map<String, Object> offerRow(QuestGroupConfig group, QuestConfig config, QuestGiver giver) {
        Map<String, Object> row = base(OFFER, group.getKey(), config, giver.npc());
        row.put("id", group.getKey() + ":" + config.getKey());
        row.put("objective", "");
        row.put("objective_type", "");
        row.put("objective_name", "");
        row.put("ready", true);
        row.put("conversation", giver.conversation() != null ? giver.conversation() : "");
        row.put("progress", 0);
        row.put("target", 0);
        return row;
    }

    private static Map<String, Object> base(String kind, String group, QuestConfig config, @Nullable String npc) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", "");
        row.put("kind", kind);
        row.put("npc", npc != null ? npc : "");
        row.put("group", group);
        row.put("quest", config.getKey());
        row.put("quest_name", config.getName() != null ? config.getName() : "");
        return row;
    }
}
