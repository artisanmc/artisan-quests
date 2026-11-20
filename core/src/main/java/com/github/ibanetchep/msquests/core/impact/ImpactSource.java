package com.github.ibanetchep.msquests.core.impact;

import org.jetbrains.annotations.Nullable;

import java.util.List;

/** Where {@link ContentImpact} counts who a change touches: the quest tables. Blocking, never on a game thread. */
public interface ImpactSource {

    /** No saved progress at all: every count is zero. */
    ImpactSource EMPTY = new ImpactSource() {
        @Override
        public List<QuestCount> quests(String groupKey) {
            return List.of();
        }

        @Override
        public List<ObjectiveCount> objectives(String groupKey) {
            return List.of();
        }

        @Override
        public int reaching(String groupKey, String questKey, String objectiveKey, int target) {
            return 0;
        }
    };

    /** The quest rows stored under the group, counted by quest and, for those in progress, by the stage they stand on. */
    List<QuestCount> quests(String groupKey);

    /** The objective rows of the group's quests in progress, counted by quest, objective key and type. */
    List<ObjectiveCount> objectives(String groupKey);

    /** Quests in progress whose objective is not completed and holds at least {@code target}. */
    int reaching(String groupKey, String questKey, String objectiveKey, int target);

    /**
     * @param reachedStage the stage the rows in progress stand on, null when not recorded yet
     * @param inProgress   rows in progress on that stage
     * @param finished     rows of the quest in any other status (counted once, on the row whose {@code reachedStage} is null)
     */
    record QuestCount(String questKey, @Nullable String reachedStage, int inProgress, int finished) {
    }

    /**
     * @param started   rows with progress, not completed
     * @param completed rows completed
     */
    record ObjectiveCount(String questKey, String objectiveKey, String type, int started, int completed) {
    }
}
