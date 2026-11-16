package com.github.ibanetchep.msquests.core.quest.config.group;

import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;

import java.util.OptionalInt;

/**
 * Where an actor stands on a {@link QuestDistributionStrategy#LADDER} group: the group's
 * {@code position} expression ({@code %msguilds_level%}) read for the actor. Quest {@code i} of
 * the ladder takes the actor from {@code i} to {@code i + 1}, so the current quest is the one at
 * the position.
 */
@FunctionalInterface
public interface LadderPositions {

    /** Knows no position: ladders stay as they are (tests, a platform without placeholders). */
    LadderPositions NONE = (actor, expression) -> OptionalInt.empty();

    /** The position, or empty when it cannot be read now (no member online, not a number). */
    OptionalInt position(QuestActor actor, String expression);

    enum State { REACHED, CURRENT, LOCKED }

    /** The state of the step at {@code index} for an actor at {@code position}. */
    static State state(int index, int position) {
        if (index < position) return State.REACHED;
        return index == position ? State.CURRENT : State.LOCKED;
    }
}
