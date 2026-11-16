package com.github.ibanetchep.msquests.core.quest.config.group;

import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import org.jetbrains.annotations.Nullable;

import java.util.Optional;
import java.util.UUID;

/**
 * Whether a step of a {@link QuestDistributionStrategy#SEQUENTIAL} group is done for an actor: its
 * {@code completed_when} conditions, the state the quest aims at ({@code guild_level >= 2}). The
 * current quest of a ladder is the first step that is not done.
 */
@FunctionalInterface
public interface LadderSteps {

    /** Reads nothing: ladders stay as they are (tests, a platform without conditions). */
    LadderSteps NONE = (actor, step, viewer) -> Optional.empty();

    /**
     * @param viewer the player looking at the actor's quests, when there is one: conditions need
     *               an online player to be read for
     * @return empty when the conditions cannot be read now (nobody to read them for)
     */
    Optional<Boolean> done(QuestActor actor, QuestConfig step, @Nullable UUID viewer);

    enum State { REACHED, CURRENT, LOCKED }

    /** The state of the step at {@code index} when the current one is at {@code current}. */
    static State state(int index, int current) {
        if (index < current) return State.REACHED;
        return index == current ? State.CURRENT : State.LOCKED;
    }
}
