package com.github.ibanetchep.msquests.core.service;

import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.core.registry.QuestActorRegistry;
import com.github.ibanetchep.msquests.core.registry.QuestConfigRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicReference;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CronDistributionServiceTest {

    private static final ZoneId ZONE = ZoneId.of("Europe/Paris");

    private final QuestService questService = mock(QuestService.class);
    private final QuestLifecycleService lifecycle = mock(QuestLifecycleService.class);
    private final AtomicReference<Instant> now = new AtomicReference<>();
    private QuestGroupConfig daily;
    private CronDistributionService cron;

    private static Instant at(int day, int hour) {
        return ZonedDateTime.of(2026, 11, day, hour, 0, 0, 0, ZONE).toInstant();
    }

    @BeforeEach
    void setUp() {
        // No PERIOD_RESET distribution: its quests must expire at the reset all the same.
        daily = new QuestGroupConfig.Builder("daily", "Daily", "", "player")
                .resetCron("0 0 * * *")
                .resetZone(ZONE)
                .build();
        QuestConfigRegistry configs = new QuestConfigRegistry();
        configs.registerQuestGroupConfig(daily);
        when(questService.expireInProgress(any(), any())).thenReturn(CompletableFuture.completedFuture(0));
        cron = new CronDistributionService(configs, new QuestActorRegistry(), lifecycle, questService, now::get);
    }

    @Test
    void theFirstTickCatchesUpOnTheLastResetAndEachNewResetExpiresAgain() {
        now.set(at(25, 7));
        cron.tick();
        verify(questService).expireInProgress(daily, at(25, 0));

        now.set(at(25, 12));
        cron.tick();
        verify(questService, times(1)).expireInProgress(eq(daily), any());

        now.set(at(26, 0).plusSeconds(30));
        cron.tick();
        verify(questService).expireInProgress(daily, at(26, 0));
        verify(lifecycle, never()).triggerDistribution(any(), any());
    }
}
