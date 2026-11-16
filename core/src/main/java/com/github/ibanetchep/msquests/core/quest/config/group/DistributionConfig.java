package com.github.ibanetchep.msquests.core.quest.config.group;

import org.jetbrains.annotations.Nullable;

import java.util.Collections;
import java.util.Set;

public class DistributionConfig {

    private final QuestDistributionStrategy strategy;
    private final int amount;
    private final Set<DistributionTrigger> triggers;
    private final @Nullable String position;

    public DistributionConfig(QuestDistributionStrategy strategy, int amount, Set<DistributionTrigger> triggers) {
        this(strategy, amount, triggers, null);
    }

    /** @param position a ladder's position expression ({@code %msguilds_level%}), null otherwise */
    public DistributionConfig(QuestDistributionStrategy strategy, int amount, Set<DistributionTrigger> triggers,
                              @Nullable String position) {
        this.strategy = strategy;
        this.amount = amount;
        this.triggers = triggers;
        this.position = position;
    }

    public @Nullable String getPosition() {
        return position;
    }

    public QuestDistributionStrategy getStrategy() {
        return strategy;
    }

    public int getAmount() {
        return amount;
    }

    public Set<DistributionTrigger> getTriggers() {
        return Collections.unmodifiableSet(triggers);
    }

    public boolean hasTrigger(DistributionTrigger trigger) {
        return triggers.contains(trigger);
    }

}
