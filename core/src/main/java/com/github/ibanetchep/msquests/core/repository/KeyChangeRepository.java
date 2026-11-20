package com.github.ibanetchep.msquests.core.repository;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/** Moves the stored rows onto the keys the loaded quest groups have now. */
public interface KeyChangeRepository {

    /** Storage whose rows never need moving ({@code quests/*.yml}, tests). */
    KeyChangeRepository NONE = changes -> CompletableFuture.completedFuture(0);

    /**
     * Applies every change in one transaction: groups first, then uids, then quests, so a quest
     * whose key changed together with its group's is found under the group's new key. All or nothing.
     *
     * @return how many rows changed
     */
    CompletableFuture<Integer> apply(List<KeyChange> changes);
}
