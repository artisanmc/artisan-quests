package com.github.ibanetchep.msquests.core.repository;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/** Moves the stored rows onto the names the loaded quest groups have now. */
public interface StoredRenameRepository {

    /** Storage whose rows never need moving ({@code quests/*.yml}, tests). */
    StoredRenameRepository NONE = renames -> CompletableFuture.completedFuture(0);

    /**
     * Applies every rename in one transaction: groups first, then uids, then quests, so a quest
     * renamed together with its group is found under the group's new key. All or nothing.
     *
     * @return how many rows changed
     */
    CompletableFuture<Integer> apply(List<StoredRename> renames);
}
