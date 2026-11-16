package com.github.ibanetchep.msquests.core.quest.config.group;

public enum QuestDistributionStrategy {

    NONE,
    SEQUENTIAL,
    RANDOM,
    /** The current quest is the one at the group's {@code position}: see {@link LadderPositions}. */
    LADDER,

}
