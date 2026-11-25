package com.github.ibanetchep.msquests.core.service;

import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;
import com.github.ibanetchep.msquests.core.quest.config.group.DistributionTrigger;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.core.registry.QuestActorRegistry;
import com.github.ibanetchep.msquests.core.registry.QuestConfigRegistry;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;
import java.util.logging.Logger;

/**
 * Watches the reset of every group with a reset cron. At each reset, the group's quests still in
 * progress from before it expire: in memory for the loaded actors, in storage for all the others
 * (players who left would otherwise keep them IN_PROGRESS until they come back). Then, for a
 * group distributed on {@link DistributionTrigger#PERIOD_RESET}, the online actors get new quests.
 *
 * <p>The first tick only records the last reset as the baseline, and catches up: it expires in
 * storage what the resets missed while the server was off.
 */
public class CronDistributionService {

    private static final Logger logger = Logger.getLogger(CronDistributionService.class.getName());

    private final QuestConfigRegistry questConfigRegistry;
    private final QuestActorRegistry questActorRegistry;
    private final QuestLifecycleService questLifecycleService;
    private final QuestService questService;
    private final Supplier<Instant> clock;
    private final Map<String, Instant> lastResetTimes = new ConcurrentHashMap<>();

    public CronDistributionService(
            QuestConfigRegistry questConfigRegistry,
            QuestActorRegistry questActorRegistry,
            QuestLifecycleService questLifecycleService,
            QuestService questService
    ) {
        this(questConfigRegistry, questActorRegistry, questLifecycleService, questService, Instant::now);
    }

    public CronDistributionService(
            QuestConfigRegistry questConfigRegistry,
            QuestActorRegistry questActorRegistry,
            QuestLifecycleService questLifecycleService,
            QuestService questService,
            Supplier<Instant> clock
    ) {
        this.questConfigRegistry = questConfigRegistry;
        this.questActorRegistry = questActorRegistry;
        this.questLifecycleService = questLifecycleService;
        this.questService = questService;
        this.clock = clock;
    }

    public void tick() {
        Instant now = clock.get();

        for (QuestGroupConfig groupConfig : questConfigRegistry.getQuestGroupConfigs().values()) {
            if (!groupConfig.isActive()) continue;
            if (groupConfig.getResetCron() == null) continue;

            Instant previousReset = groupConfig.getPreviousResetBefore(now);
            if (previousReset == null) continue;

            Instant lastKnown = lastResetTimes.get(groupConfig.getKey());
            if (lastKnown != null && !previousReset.isAfter(lastKnown)) continue;

            // Record the new baseline
            lastResetTimes.put(groupConfig.getKey(), previousReset);

            if (lastKnown == null) {
                // Baseline: no distribution, only what the resets missed while the server was off.
                expireStored(groupConfig, previousReset);
                continue;
            }

            logger.info("Period reset detected for group " + groupConfig.getKey() + ", expiring its quests.");

            boolean distribute = groupConfig.hasDistributionTrigger(DistributionTrigger.PERIOD_RESET);
            for (QuestActor actor : new ArrayList<>(questActorRegistry.getActors().values())) {
                if (!groupConfig.getActorType().equalsIgnoreCase(actor.getActorType())) continue;
                questLifecycleService.expireQuests(actor);
                if (distribute && !actor.getProfiles().isEmpty()) {
                    questLifecycleService.triggerDistribution(actor, groupConfig);
                }
            }
            expireStored(groupConfig, previousReset);
        }
    }

    private void expireStored(QuestGroupConfig groupConfig, Instant reset) {
        questService.expireInProgress(groupConfig, reset).thenAccept(count -> {
            if (count > 0) {
                logger.info("Expired " + count + " quest(s) of group " + groupConfig.getKey()
                        + " left in progress from before " + reset + ".");
            }
        });
    }
}
