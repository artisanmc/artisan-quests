package com.github.ibanetchep.msquests.database.repository;

import com.github.ibanetchep.msquests.core.repository.KeyChange;
import com.github.ibanetchep.msquests.core.repository.KeyChangeRepository;
import com.github.ibanetchep.msquests.database.DbAccess;
import org.jdbi.v3.core.Handle;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

/**
 * Moves the rows of {@code artisan_quests_quest} and {@code artisan_quests_rotation} onto the
 * keys their group and quest have now.
 *
 * <p>A change of key ({@code old_key}) is applied once per database and written to
 * {@code artisan_quests_key_change}. Found there, it moves nothing: rows that appear under the
 * former key afterwards come from a server that still loads the content from before the change,
 * and adding them would give an actor the same quest twice. They stay where they are and are
 * reported ({@link KeyChangeRepository.Left}). A place that becomes a key again (the change is
 * undone, or the key is given to a new quest that later changes too) can be left again: taking a
 * key forgets that it was left, and a change towards another destination than the one written
 * is a new one.
 *
 * <p>The rows a {@code uid} points to are not in that table: a server that still resolves rows
 * by uid finds them wherever they are, so they move whenever some are found elsewhere.
 *
 * <p>The keys in use are read first, in one pass over each table, and a statement only runs
 * for a former key some row still carries: a load whose changes are all done costs those
 * reads, however many quests still say what they used to be called.
 */
public class KeyChangeSqlRepository extends SqlRepository implements KeyChangeRepository {

    public KeyChangeSqlRepository(DbAccess dbAccess) {
        super(dbAccess);
    }

    @Override
    public CompletableFuture<Applied> apply(List<KeyChange> changes) {
        if (changes.isEmpty()) {
            return CompletableFuture.completedFuture(Applied.NOTHING);
        }
        return supplyAsync(() -> getJdbi().inTransaction(handle -> {
            int moved = 0;
            List<Left> left = new ArrayList<>();
            Map<Place, Place> batch = destinations(changes);

            // A quest's former key is looked up under its group's current key, and a uid row may
            // still carry the group's former one: groups first, then uids, then quests.
            Set<String> rotationGroups = new HashSet<>(handle
                    .createQuery("SELECT DISTINCT group_uid FROM artisan_quests_rotation")
                    .mapTo(String.class).list());
            Set<Name> names = names(handle);
            Map<Place, Place> ledger = ledger(handle);
            boolean groupMoved = false;
            for (KeyChange change : changes) {
                if (change instanceof KeyChange.Group group) {
                    Place from = Place.group(group.from());
                    Place to = Place.group(group.to());
                    boolean inQuests = names.stream().anyMatch(name -> name.group().equals(group.from()));
                    if (known(ledger, batch, from, to)) {
                        int rows = inQuests ? count(handle, "group_key = :group", group.from(), null) : 0;
                        if (rotationGroups.contains(group.from())) {
                            rows += handle.createQuery("SELECT COUNT(*) FROM artisan_quests_rotation WHERE group_uid = :group")
                                    .bind("group", group.from()).mapTo(Integer.class).one();
                        }
                        if (rows > 0) left.add(new Left(from.toString(), to.toString(), rows));
                        continue;
                    }
                    if (inQuests) {
                        moved += handle.createUpdate("UPDATE artisan_quests_quest SET group_key = :to WHERE group_key = :from")
                                .bind("from", group.from())
                                .bind("to", group.to())
                                .execute();
                        groupMoved = true;
                    }
                    moved += rotations(handle, rotationGroups, group.from(), group.to());
                    // The quests of the group that changed key earlier did it in this group.
                    handle.createUpdate("DELETE FROM artisan_quests_key_change WHERE from_group = :to AND from_key <> ''")
                            .bind("to", group.to()).execute();
                    handle.createUpdate("UPDATE artisan_quests_key_change SET from_group = :to WHERE from_group = :from AND from_key <> ''")
                            .bind("from", group.from()).bind("to", group.to()).execute();
                    handle.createUpdate("UPDATE artisan_quests_key_change SET to_group = :to WHERE to_group = :from AND to_key <> ''")
                            .bind("from", group.from()).bind("to", group.to()).execute();
                    record(handle, from, to);
                    ledger = ledger(handle);
                } else if (change instanceof KeyChange.GroupUid group) {
                    moved += rotations(handle, rotationGroups, group.uid(), group.group());
                }
            }
            if (groupMoved) {
                names = names(handle);
            }

            boolean uidMoved = false;
            for (KeyChange change : changes) {
                if (!(change instanceof KeyChange.QuestUid quest)) continue;
                boolean elsewhere = false;
                for (Name name : names) {
                    if (name.uid().equals(quest.uid())
                            && !(name.group().equals(quest.group()) && name.quest().equals(quest.quest()))) {
                        elsewhere = true;
                    }
                }
                if (!elsewhere) continue;
                moved += handle.createUpdate("""
                                UPDATE artisan_quests_quest
                                SET group_key = :group, quest_key = :quest
                                WHERE quest_uid = :uid AND (group_key <> :group OR quest_key <> :quest)""")
                        .bind("uid", quest.uid())
                        .bind("group", quest.group())
                        .bind("quest", quest.quest())
                        .execute();
                uidMoved = true;
            }
            if (uidMoved) {
                names = names(handle);
            }

            // Quests that came from another group first, then the changes of key inside a group.
            for (boolean movedOnes : new boolean[]{true, false}) {
                for (KeyChange change : changes) {
                    Place from;
                    Place to;
                    if (movedOnes && change instanceof KeyChange.QuestMoved quest) {
                        from = new Place(quest.fromGroup(), quest.from());
                        to = new Place(quest.group(), quest.to());
                    } else if (!movedOnes && change instanceof KeyChange.Quest quest) {
                        from = new Place(quest.group(), quest.from());
                        to = new Place(quest.group(), quest.to());
                    } else {
                        continue;
                    }
                    boolean present = names.stream().anyMatch(name -> name.group().equals(from.group()) && name.quest().equals(from.key()));
                    if (known(ledger, batch, from, to)) {
                        if (!to.equals(ledger.get(from))) {
                            record(handle, from, to);
                            ledger.put(from, to);
                        }
                        if (present) {
                            left.add(new Left(from.toString(), to.toString(),
                                    count(handle, "group_key = :group AND quest_key = :quest", from.group(), from.key())));
                        }
                        continue;
                    }
                    if (present) {
                        moved += handle.createUpdate("""
                                        UPDATE artisan_quests_quest
                                        SET group_key = :group, quest_key = :to
                                        WHERE group_key = :fromGroup AND quest_key = :from""")
                                .bind("fromGroup", from.group())
                                .bind("from", from.key())
                                .bind("group", to.group())
                                .bind("to", to.key())
                                .execute();
                    }
                    record(handle, from, to);
                    ledger.put(from, to);
                    ledger.remove(to);
                }
            }
            return new Applied(moved, left);
        }));
    }

    /**
     * Whether the database already saw {@code from} become {@code to}: the destination written then
     * is this one, or a place this load says became it since ({@code mine} became {@code dig}, and
     * the quest now keyed {@code excavate} lists both).
     */
    private static boolean known(Map<Place, Place> ledger, Map<Place, Place> batch, Place from, Place to) {
        Place written = ledger.get(from);
        if (written == null) {
            return false;
        }
        Set<Place> seen = new HashSet<>();
        while (!written.equals(to) && seen.add(written)) {
            Place next = batch.get(written);
            if (next == null) {
                return false;
            }
            written = next;
        }
        return written.equals(to);
    }

    private static Map<Place, Place> destinations(List<KeyChange> changes) {
        Map<Place, Place> batch = new HashMap<>();
        for (KeyChange change : changes) {
            if (change instanceof KeyChange.Group group) {
                batch.put(Place.group(group.from()), Place.group(group.to()));
            } else if (change instanceof KeyChange.Quest quest) {
                batch.put(new Place(quest.group(), quest.from()), new Place(quest.group(), quest.to()));
            } else if (change instanceof KeyChange.QuestMoved quest) {
                batch.put(new Place(quest.fromGroup(), quest.from()), new Place(quest.group(), quest.to()));
            }
        }
        return batch;
    }

    private static Map<Place, Place> ledger(Handle handle) {
        Map<Place, Place> ledger = new HashMap<>();
        handle.createQuery("SELECT from_group, from_key, to_group, to_key FROM artisan_quests_key_change")
                .map((rs, ctx) -> Map.entry(
                        new Place(rs.getString("from_group"), rs.getString("from_key")),
                        new Place(rs.getString("to_group"), rs.getString("to_key"))))
                .forEach(entry -> ledger.put(entry.getKey(), entry.getValue()));
        return ledger;
    }

    /** Writes that {@code from} became {@code to}; {@code to} is a key again, so it was never left. */
    private static void record(Handle handle, Place from, Place to) {
        handle.createUpdate("DELETE FROM artisan_quests_key_change WHERE from_group = :group AND from_key = :key")
                .bind("group", to.group()).bind("key", to.key()).execute();
        handle.createUpdate("DELETE FROM artisan_quests_key_change WHERE from_group = :group AND from_key = :key")
                .bind("group", from.group()).bind("key", from.key()).execute();
        handle.createUpdate("""
                        INSERT INTO artisan_quests_key_change (from_group, from_key, to_group, to_key)
                        VALUES (:fromGroup, :fromKey, :toGroup, :toKey)""")
                .bind("fromGroup", from.group()).bind("fromKey", from.key())
                .bind("toGroup", to.group()).bind("toKey", to.key())
                .execute();
    }

    private static int count(Handle handle, String where, String group, String quest) {
        var query = handle.createQuery("SELECT COUNT(*) FROM artisan_quests_quest WHERE " + where).bind("group", group);
        if (quest != null) {
            query.bind("quest", quest);
        }
        return query.mapTo(Integer.class).one();
    }

    /** Every {@code (uid, group key, quest key)} some quest row carries. */
    private static Set<Name> names(Handle handle) {
        return new HashSet<>(handle
                .createQuery("SELECT DISTINCT quest_uid, group_key, quest_key FROM artisan_quests_quest")
                .map((rs, ctx) -> new Name(rs.getString("quest_uid"), rs.getString("group_key"), rs.getString("quest_key")))
                .list());
    }

    private static int rotations(Handle handle, Set<String> present, String from, String to) {
        if (!present.remove(from)) {
            return 0;
        }
        present.add(to);
        return handle.createUpdate("UPDATE artisan_quests_rotation SET group_uid = :to WHERE group_uid = :from")
                .bind("from", from)
                .bind("to", to)
                .execute();
    }

    /** A group ({@code key} empty) or a quest of a group. */
    private record Place(String group, String key) {

        static Place group(String key) {
            return new Place(key, "");
        }

        @Override
        public String toString() {
            return key.isEmpty() ? group : group + "/" + key;
        }
    }

    private record Name(String uid, String group, String quest) {
    }
}
