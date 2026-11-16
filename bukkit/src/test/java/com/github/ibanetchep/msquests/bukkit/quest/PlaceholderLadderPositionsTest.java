package com.github.ibanetchep.msquests.bukkit.quest;

import org.junit.jupiter.api.Test;

import java.util.Map;
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
    void theActorsOwnPlaceholdersNeedNobodyOnline() {
        assertEquals("3", PlaceholderLadderPositions.withActorPlaceholders(
                Map.of("guild_level", "3", "guild_name", "Smiths"), "%guild_level%"));
        assertEquals("%msguilds_level%", PlaceholderLadderPositions.withActorPlaceholders(
                Map.of("guild_level", "3"), "%msguilds_level%"), "left for PlaceholderAPI");
    }

    @Test
    void anythingElseIsUnknown() {
        assertEquals(OptionalInt.empty(), PlaceholderLadderPositions.parse("%msguilds_level%"));
        assertEquals(OptionalInt.empty(), PlaceholderLadderPositions.parse("2.5"));
        assertEquals(OptionalInt.empty(), PlaceholderLadderPositions.parse(""));
        assertEquals(OptionalInt.empty(), PlaceholderLadderPositions.parse(null));
    }
}
