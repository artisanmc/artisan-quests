package com.github.ibanetchep.msquests.bukkit.artisan;

import com.github.ibanetchep.msquests.core.event.CoreEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestAbandonedEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestCompletedEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestExpiredEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestStageCompletedEvent;
import com.github.ibanetchep.msquests.core.event.CoreQuestStartedEvent;
import com.github.ibanetchep.msquests.core.quest.actor.Quest;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import com.github.ibanetchep.msquests.core.quest.config.QuestStageConfig;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.core.quest.player.PlayerProfile;
import com.github.ibanetchep.msquests.core.registry.QuestConfigRegistry;
import com.github.ibanetchep.msquests.core.stats.QuestFigures;
import com.github.ibanetchep.msquests.core.stats.QuestFiguresSource;
import net.artisanmc.modules.api.stats.StatEvent;
import net.artisanmc.modules.api.stats.StatStorage;
import net.artisanmc.modules.api.stats.StatsApi;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.LongSupplier;

/**
 * The quests in Artisan's statistics (Artisan ADR {@code stats-foundation}).
 *
 * <p><b>Events</b>, recorded as they happen, once per member of the quest's actor: a quest
 * started, a stage completed, a quest completed, abandoned or expired, by {@code group} and
 * {@code quest} (and {@code stage}). A completion carries the seconds since the quest started.
 * A quest whose actor names no member (the server's) is not recorded: these events are about
 * a player.
 *
 * <p><b>Figures computed on demand</b> for the editor's Quests tab, from the quest tables
 * ({@link QuestFigures}): {@link #PROGRESS} (where every quest of a group stands) and
 * {@link #STUCK} (the stages the quests in progress stand on, and for how long). Both take the
 * {@code group} key and are only declared with {@code content_source: artisan}.
 */
public final class QuestStats implements Consumer<CoreEvent> {

    public static final String STARTED = "quests:started";
    public static final String STAGE_COMPLETED = "quests:stage_completed";
    public static final String COMPLETED = "quests:completed";
    public static final String ABANDONED = "quests:abandoned";
    public static final String EXPIRED = "quests:expired";

    public static final String PROGRESS = "quests:progress";
    public static final String STUCK = "quests:stuck";

    /** How long an answer is served again: the figures move slowly, the reads scan a group's rows. */
    static final int CACHE_SECONDS = 60;

    private final StatsApi stats;
    private final LongSupplier clock;

    public QuestStats(StatsApi stats, LongSupplier clock) {
        this.stats = stats;
        this.clock = clock;
    }

    public static List<StatEvent> declarations() {
        return List.of(
                StatEvent.builder(STARTED).storage(StatStorage.BOTH).dimensions("group", "quest").build(),
                StatEvent.builder(STAGE_COMPLETED).storage(StatStorage.BOTH)
                        .dimensions("group", "quest", "stage").value("seconds_since_start").build(),
                StatEvent.builder(COMPLETED).storage(StatStorage.BOTH)
                        .dimensions("group", "quest").value("duration_seconds").build(),
                StatEvent.builder(ABANDONED).storage(StatStorage.BOTH).dimensions("group", "quest").build(),
                StatEvent.builder(EXPIRED).storage(StatStorage.BOTH).dimensions("group", "quest").build());
    }

    /** Declares the events; false when Artisan refuses them (statistics stay off for the quests). */
    public boolean declare() {
        try {
            declarations().forEach(stats::declare);
            return true;
        } catch (IllegalArgumentException | IllegalStateException e) {
            return false;
        }
    }

    /** Declares the computed figures, read from {@code source} with the groups of {@code configs}. */
    public void declareQueries(QuestConfigRegistry configs, QuestFiguresSource source) {
        stats.declareQuery(PROGRESS, CACHE_SECONDS, params -> {
            QuestGroupConfig group = configs.getQuestGroupConfigs().get(params.getOrDefault("group", ""));
            if (group == null) return List.of();
            Map<String, String> keys = keysByUid(group);
            return QuestFigures.progress(source.quests(keys.keySet()), keys::get);
        });
        stats.declareQuery(STUCK, CACHE_SECONDS, params -> {
            QuestGroupConfig group = configs.getQuestGroupConfigs().get(params.getOrDefault("group", ""));
            if (group == null) return List.of();
            Map<String, String> keys = keysByUid(group);
            Map<String, List<String>> stages = new LinkedHashMap<>();
            for (QuestConfig quest : group.getOrderedQuests()) {
                if (quest.getUid() == null) continue;
                stages.put(quest.getUid(), quest.getStages().values().stream().map(QuestStageConfig::getKey).toList());
            }
            return QuestFigures.stuck(source.stages(keys.keySet()), keys::get,
                    uid -> stages.getOrDefault(uid, List.of()), clock.getAsLong());
        });
    }

    private static Map<String, String> keysByUid(QuestGroupConfig group) {
        Map<String, String> keys = new LinkedHashMap<>();
        for (QuestConfig quest : group.getOrderedQuests()) {
            if (quest.getUid() != null) keys.put(quest.getUid(), quest.getKey());
        }
        return keys;
    }

    @Override
    public void accept(CoreEvent event) {
        if (event instanceof CoreQuestStartedEvent e) {
            record(STARTED, e.getQuest(), null, 1);
        } else if (event instanceof CoreQuestStageCompletedEvent e) {
            record(STAGE_COMPLETED, e.getStage().getQuest(), e.getStage().getKey(), elapsedSeconds(e.getStage().getQuest()));
        } else if (event instanceof CoreQuestCompletedEvent e) {
            record(COMPLETED, e.getQuest(), null, elapsedSeconds(e.getQuest()));
        } else if (event instanceof CoreQuestAbandonedEvent e) {
            record(ABANDONED, e.getQuest(), null, 1);
        } else if (event instanceof CoreQuestExpiredEvent e) {
            record(EXPIRED, e.getQuest(), null, 1);
        }
    }

    private double elapsedSeconds(Quest quest) {
        return Math.max(0, (clock.getAsLong() - quest.getCreatedAt().getTime()) / 1000.0);
    }

    private void record(String event, Quest quest, @Nullable String stage, double value) {
        Map<String, String> dimensions = new LinkedHashMap<>();
        dimensions.put("group", quest.getQuestGroup().getKey());
        dimensions.put("quest", quest.getQuestConfig().getKey());
        if (stage != null) dimensions.put("stage", stage);
        // Copied: recording must not hold the actor's live collection while members come and go.
        for (PlayerProfile profile : new ArrayList<>(quest.getActor().getProfiles())) {
            stats.record(event, profile.getId(), dimensions, value);
        }
    }
}
