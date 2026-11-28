package com.github.ibanetchep.msquests.core.registry;

import com.github.ibanetchep.msquests.core.quest.actor.QuestActor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ActorTypeRegistry {

    private final Map<String, Class<? extends QuestActor>> actorTypes = new ConcurrentHashMap<>();
    private volatile Runnable onChange = () -> {};

    /** Called after each registration: the editor's list of who may play a group follows. */
    public void onChange(Runnable listener) {
        this.onChange = listener == null ? () -> {} : listener;
    }

    /**
     * The registered keys as a group's settings list them: {@code player} and {@code global}
     * first, then the types other plugins added, by name.
     */
    public java.util.List<String> orderedKeys() {
        java.util.List<String> keys = new java.util.ArrayList<>();
        for (String builtIn : java.util.List.of("player", "global")) {
            if (actorTypes.containsKey(builtIn)) keys.add(builtIn);
        }
        actorTypes.keySet().stream().filter(key -> !keys.contains(key)).sorted().forEach(keys::add);
        return keys;
    }

    /**
     * Registers a new actor type.
     *
     * @param key the key of the actor type.
     * @param actorClass the class type of the actor.
     */
    public void registerType(String key, Class<? extends QuestActor> actorClass) {
        actorTypes.put(key, actorClass);
        onChange.run();
    }

    /**
     * Retrieves an actor type by its key.
     *
     * @param key the key of the actor type.
     * @return the class type of the actor, or null if not found.
     */
    public Class<? extends QuestActor> getActorType(String key) {
        return actorTypes.get(key);
    }

    /**
     * Checks if an actor type is registered.
     *
     * @param key the key of the actor type.
     * @return true if the actor type is registered, false otherwise.
     */
    public boolean isActorTypeRegistered(String key) {
        return actorTypes.containsKey(key);
    }

    /**
     * Retrieves all registered actor types.
     *
     * @return a map of all registered actor types with their class types.
     */
    public Map<String, Class<? extends QuestActor>> getAllActorTypes() {
        return Map.copyOf(actorTypes);
    }
}