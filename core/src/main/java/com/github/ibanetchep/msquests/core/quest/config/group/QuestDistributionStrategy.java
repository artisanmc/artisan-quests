package com.github.ibanetchep.msquests.core.quest.config.group;

public enum QuestDistributionStrategy {

    NONE,
    /**
     * In list order, one quest at a time: the current quest is the first one not done (see
     * {@link LadderSteps}). {@code ladder} in a file reads as this strategy.
     */
    SEQUENTIAL,
    RANDOM,;

    /** The strategy of a file's {@code strategy} value, whatever its case; {@code ladder} is {@link #SEQUENTIAL}. */
    public static QuestDistributionStrategy parse(String value) {
        String name = value.trim().toUpperCase(java.util.Locale.ROOT);
        return name.equals("LADDER") ? SEQUENTIAL : valueOf(name);
    }

}
