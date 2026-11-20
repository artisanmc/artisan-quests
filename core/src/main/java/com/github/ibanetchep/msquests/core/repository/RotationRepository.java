package com.github.ibanetchep.msquests.core.repository;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * Rotations used per actor and group. {@code groupId} is {@link
 * com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig#getStorageId()}, the
 * group key.
 */
public interface RotationRepository {

    CompletableFuture<Void> save(UUID actorId, String groupId);

    CompletableFuture<Integer> countInPeriod(UUID actorId, String groupId, Instant periodStart, Instant periodEnd);
}
