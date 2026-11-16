package com.github.ibanetchep.msquests.core.quest.config.group;

public enum QuestDistributionStrategy {

    NONE,
    SEQUENTIAL,
    RANDOM,
    /** The current quest is the first one not done: see {@link LadderSteps}. */
    LADDER,

}
