package com.github.ibanetchep.msquests.core.repository;

/**
 * A name the stored rows may still carry, to move onto the current key before they are read.
 * A quest's identity in the database is {@code (group key, quest key)}; a renamed group or
 * quest says what it was called ({@code old_key} in its Document), and a Document written when
 * rows were keyed by {@code uid} still says which one.
 *
 * <p>Applying one twice changes nothing more, so a rename stays in the file as long as its
 * author likes, and a server that reloads late still moves the rows it wrote meanwhile.
 */
public sealed interface StoredRename {

    /** A group formerly named {@code from}: its quest rows and rotations follow to {@code to}. */
    record Group(String from, String to) implements StoredRename {
    }

    /** A quest of {@code group} formerly keyed {@code from}. */
    record Quest(String group, String from, String to) implements StoredRename {
    }

    /** Rows written for the group's former {@code uid}: its rotations take the group key. */
    record GroupUid(String uid, String group) implements StoredRename {
    }

    /** Rows written for the quest's former {@code uid} take its keys. */
    record QuestUid(String uid, String group, String quest) implements StoredRename {
    }
}
