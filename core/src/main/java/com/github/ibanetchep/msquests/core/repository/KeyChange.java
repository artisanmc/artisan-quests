package com.github.ibanetchep.msquests.core.repository;

/**
 * A key the stored rows may still carry, to move onto the current one before they are read.
 * A quest's identity in the database is {@code (group key, quest key)}. A key is an identifier
 * (the name players see is the title), so changing one is rare; a group or quest whose key
 * changed says what it was ({@code old_key} in its Document), and a Document written when
 * rows were keyed by {@code uid} still says which one.
 *
 * <p>Applying one twice changes nothing more, so {@code old_key} stays in the file as long as
 * its author likes, and a server that reloads late still moves the rows it wrote meanwhile.
 */
public sealed interface KeyChange {

    /** A group formerly keyed {@code from} (its file name): its quest rows and rotations follow to {@code to}. */
    record Group(String from, String to) implements KeyChange {
    }

    /** A quest of {@code group} formerly keyed {@code from}. */
    record Quest(String group, String from, String to) implements KeyChange {
    }

    /** Rows written for the group's former {@code uid}: its rotations take the group key. */
    record GroupUid(String uid, String group) implements KeyChange {
    }

    /** Rows written for the quest's former {@code uid} take its keys. */
    record QuestUid(String uid, String group, String quest) implements KeyChange {
    }
}
