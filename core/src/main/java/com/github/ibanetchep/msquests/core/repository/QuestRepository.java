package com.github.ibanetchep.msquests.core.repository;

import com.github.ibanetchep.msquests.core.dto.QuestDTO;

import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public interface QuestRepository {

    CompletableFuture<Map<UUID, QuestDTO>> getAllByActor(UUID actorUniqueId);

    CompletableFuture<Void> save(QuestDTO quest);

    CompletableFuture<Void> delete(UUID questId);

    /**
     * Marks EXPIRED every quest of {@code group} still IN_PROGRESS that was created before
     * {@code createdBefore}, whoever its actor is, loaded or not.
     *
     * @return how many rows changed
     */
    CompletableFuture<Integer> expireInProgress(QuestGroupConfig group, Instant createdBefore);
}