package com.github.ibanetchep.msquests.core.repository;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/** Moves the stored rows onto the keys the loaded quest groups have now. */
public interface KeyChangeRepository {

    /** Storage whose rows never need moving ({@code quests/*.yml}, tests). */
    KeyChangeRepository NONE = changes -> CompletableFuture.completedFuture(Applied.NOTHING);

    /**
     * Applies every change in one transaction: groups first, then uids, then quests, so a quest
     * whose key changed together with its group's is found under the group's new key. All or nothing.
     *
     * <p>A change of key is applied once per database: the next loads, from this server or another,
     * move nothing more. Rows written under the former key after that (by a server that still
     * loads the content from before the change) stay where they are and are reported in
     * {@link Applied#left()}, rather than added to the progress the actors have under the new key.
     */
    CompletableFuture<Applied> apply(List<KeyChange> changes);

    /**
     * @param moved how many rows changed
     * @param left  rows found under a former key whose change was applied earlier
     */
    record Applied(int moved, List<Left> left) {

        public static final Applied NOTHING = new Applied(0, List.of());

        public static Applied moved(int rows) {
            return new Applied(rows, List.of());
        }
    }

    /** {@code rows} rows under {@code from} (a group key, or {@code group/quest}), which became {@code to}. */
    record Left(String from, String to, int rows) {
    }
}
