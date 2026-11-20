package com.github.ibanetchep.msquests.core.service;

import com.github.ibanetchep.msquests.core.dto.QuestDTO;
import com.github.ibanetchep.msquests.core.dto.QuestGroupConfigDTO;
import com.github.ibanetchep.msquests.core.factory.QuestFactory;
import com.github.ibanetchep.msquests.core.factory.QuestObjectiveFactory;
import com.github.ibanetchep.msquests.core.mapper.QuestGroupMapper;
import com.github.ibanetchep.msquests.core.mapper.QuestMapper;
import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import com.github.ibanetchep.msquests.core.quest.config.condition.ConditionChecker;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.core.registry.QuestConfigRegistry;
import com.github.ibanetchep.msquests.core.registry.QuestRegistry;
import com.github.ibanetchep.msquests.core.repository.QuestConfigLoad;
import com.github.ibanetchep.msquests.core.repository.QuestConfigRepository;
import com.github.ibanetchep.msquests.core.repository.QuestRepository;
import com.github.ibanetchep.msquests.core.repository.RotationRepository;
import com.github.ibanetchep.msquests.core.repository.KeyChange;
import com.github.ibanetchep.msquests.core.repository.KeyChangeRepository;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * A quest is identified by its keys. The rows of a group or quest whose key changed are moved onto the
 * new keys before the groups are published, and a move that fails never lets such a group
 * start over next to the progress it can no longer find.
 */
class QuestKeyChangeTest {

    private static final Logger LOGGER = Logger.getAnonymousLogger();

    private final QuestConfigRegistry registry = new QuestConfigRegistry();
    private final QuestGroupMapper mapper = mock(QuestGroupMapper.class);

    @Test
    void theRowsAreMovedBeforeTheGroupsArePublished() {
        List<String> order = new ArrayList<>();
        KeyChange change = new KeyChange.Quest("daily", "mine", "dig");
        KeyChangeRepository changes = applied -> {
            assertEquals(List.of(change), applied);
            order.add(registry.getQuestGroupConfigs().isEmpty() ? "moved before publish" : "moved after publish");
            return CompletableFuture.completedFuture(3);
        };

        service(load(List.of("daily"), List.of(change)), changes).reloadQuestGroups().join();

        assertEquals(List.of("moved before publish"), order);
        assertTrue(registry.getQuestGroupConfigs().containsKey("daily"));
    }

    @Test
    void aGroupThatFailedToMapMovesNothing() {
        List<KeyChange> applied = new ArrayList<>();
        KeyChangeRepository changes = list -> {
            applied.addAll(list);
            return CompletableFuture.completedFuture(0);
        };
        KeyChange kept = new KeyChange.Quest("daily", "mine", "dig");
        QuestConfigLoad load = load(List.of("daily", "broken"),
                List.of(kept, new KeyChange.Group("old_broken", "broken")));
        when(mapper.toEntity(load.groups().get("broken"))).thenThrow(new IllegalArgumentException("bad cron"));

        service(load, changes).loadQuestGroups().join();

        assertEquals(List.of(kept), applied);
        assertEquals(java.util.Set.of("daily"), registry.getQuestGroupConfigs().keySet());
    }

    @Test
    void atStartupAGroupWithAFormerKeyIsSkippedWhenItsRowsCouldNotBeMoved() {
        KeyChangeRepository failing = list -> CompletableFuture.failedFuture(new IllegalStateException("database down"));
        QuestConfigLoad load = load(List.of("daily", "weekly"), List.of(new KeyChange.Quest("daily", "mine", "dig")));

        service(load, failing).loadQuestGroups().join();

        assertEquals(java.util.Set.of("weekly"), registry.getQuestGroupConfigs().keySet());
    }

    @Test
    void aReloadIsRefusedWhenTheRowsCouldNotBeMoved() {
        registry.registerQuestGroupConfig(group("before"));
        KeyChangeRepository failing = list -> CompletableFuture.failedFuture(new IllegalStateException("database down"));
        QuestConfigLoad load = load(List.of("daily"), List.of(new KeyChange.Group("old", "daily")));

        CompletionException error = assertThrows(CompletionException.class,
                () -> service(load, failing).reloadQuestGroups().join());

        assertInstanceOf(QuestConfigService.QuestConfigReloadException.class, error.getCause());
        assertEquals(java.util.Set.of("before"), registry.getQuestGroupConfigs().keySet());
    }

    @Test
    void aStoredQuestIsResolvedByItsKeysWhateverUidItsRowCarries() {
        QuestGroupConfig group = group("daily");
        QuestConfig quest = new QuestConfig("mine", "Mine", "", 0);
        group.addQuest(quest);
        registry.registerQuestGroupConfig(group);

        UUID stored = UUID.randomUUID();
        UUID orphan = UUID.randomUUID();
        QuestRepository repository = mock(QuestRepository.class);
        when(repository.getAllByActor(any())).thenReturn(CompletableFuture.completedFuture(Map.of(
                stored, new QuestDTO(stored, "mine", "daily", UUID.randomUUID(), QuestStatus.IN_PROGRESS,
                        null, 1L, 1L, Map.of(), "01HANOLDUID"),
                orphan, new QuestDTO(orphan, "gone", "daily", UUID.randomUUID(), QuestStatus.IN_PROGRESS,
                        null, null, null, Map.of(), ""))));
        QuestService service = new QuestService(LOGGER, registry, repository, mock(RotationRepository.class),
                new QuestFactory(new QuestObjectiveFactory()), new QuestRegistry(), new QuestMapper());
        QuestActor actor = new QuestActor(UUID.randomUUID(), "Steve") {
            @Override
            public String getActorType() {
                return "player";
            }

            @Override
            public boolean isMember(UUID playerId) {
                return id.equals(playerId);
            }
        };

        service.loadQuests(actor).join();

        assertEquals(java.util.Set.of(stored), actor.getQuests().keySet());
        assertEquals(quest, actor.getQuests().get(stored).getQuestConfig());
    }

    // ----------------------------------------------------------------- helpers

    private QuestConfigService service(QuestConfigLoad load, KeyChangeRepository changes) {
        QuestConfigRepository repository = () -> CompletableFuture.completedFuture(load);
        return new QuestConfigService(LOGGER, registry, repository, mapper, ConditionChecker.ALWAYS, changes);
    }

    /** A load of these groups, each mapped to an empty group of the same key. */
    private QuestConfigLoad load(List<String> keys, List<KeyChange> changes) {
        Map<String, QuestGroupConfigDTO> groups = new java.util.LinkedHashMap<>();
        for (String key : keys) {
            QuestGroupConfigDTO dto = mock(QuestGroupConfigDTO.class);
            when(dto.key()).thenReturn(key);
            when(mapper.toEntity(dto)).thenReturn(group(key));
            groups.put(key, dto);
        }
        return new QuestConfigLoad(groups, List.of(), changes);
    }

    private static QuestGroupConfig group(String key) {
        return new QuestGroupConfig.Builder(key, key, "", "player").build();
    }
}
