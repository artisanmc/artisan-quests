package com.github.ibanetchep.msquests.bukkit.quest;

import org.junit.jupiter.api.Test;

import java.util.OptionalInt;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PlaceholderLadderPositionsTest {

    @Test
    void aWholeNumberIsThePosition() {
        assertEquals(OptionalInt.of(3), PlaceholderLadderPositions.parse("3"));
        assertEquals(OptionalInt.of(3), PlaceholderLadderPositions.parse(" 3 "));
        assertEquals(OptionalInt.of(3), PlaceholderLadderPositions.parse("3.0"));
    }

    @Test
    void anythingElseIsUnknown() {
        assertEquals(OptionalInt.empty(), PlaceholderLadderPositions.parse("%msguilds_level%"));
        assertEquals(OptionalInt.empty(), PlaceholderLadderPositions.parse("2.5"));
        assertEquals(OptionalInt.empty(), PlaceholderLadderPositions.parse(""));
        assertEquals(OptionalInt.empty(), PlaceholderLadderPositions.parse(null));
    }
}
