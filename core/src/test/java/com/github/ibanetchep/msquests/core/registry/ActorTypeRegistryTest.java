package com.github.ibanetchep.msquests.core.registry;

import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ActorTypeRegistryTest {

    @Test
    void listsTheBuiltInTypesFirstThenTheOthersByName() {
        ActorTypeRegistry registry = new ActorTypeRegistry();
        registry.registerType("guild", QuestActor.class);
        registry.registerType("global", QuestActor.class);
        registry.registerType("faction", QuestActor.class);
        registry.registerType("player", QuestActor.class);

        assertEquals(List.of("player", "global", "faction", "guild"), registry.orderedKeys());
    }

    @Test
    void tellsItsListenerOfEachRegistration() {
        ActorTypeRegistry registry = new ActorTypeRegistry();
        AtomicInteger changes = new AtomicInteger();
        registry.onChange(changes::incrementAndGet);
        registry.registerType("guild", QuestActor.class);
        assertEquals(1, changes.get());

        registry.onChange(null);
        registry.registerType("faction", QuestActor.class);
        assertEquals(1, changes.get());
    }
}
