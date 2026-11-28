package com.github.ibanetchep.msquests.bukkit.quest;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ConditionLadderStepsTest {

    @Test
    void comparingBoundValuesAsksNothingOfThePlayer() {
        assertFalse(ConditionLadderSteps.needsThePlayer(List.of(Map.of("expression", "guild_level >= 2"))));
        assertFalse(ConditionLadderSteps.needsThePlayer(List.of(
                Map.of("or", List.of(Map.of("expression", "guild_level >= 2"), Map.of("expression", "guild_members > 9"))))));
    }

    @Test
    void aPermissionOrAPlaceholderIsAboutThePlayer() {
        assertTrue(ConditionLadderSteps.needsThePlayer(List.of(Map.of("has_permission", "group.citoyen"))));
        assertTrue(ConditionLadderSteps.needsThePlayer(List.of(Map.of("expression", "%vault_eco_balance% > 100"))));
        assertTrue(ConditionLadderSteps.needsThePlayer(List.of(
                Map.of("not", List.of(Map.of("has_permission", "group.citoyen"))))));
    }

    @Test
    void numbersAreBoundAsNumbers() {
        Map<String, Object> bindings = ConditionLadderSteps.bindings(
                Map.of("guild_level", "3", "ratio", "0.5", "guild_name", "Smiths"));
        assertEquals(3L, bindings.get("guild_level"));
        assertEquals(0.5, bindings.get("ratio"));
        assertEquals("Smiths", bindings.get("guild_name"));
    }
}
