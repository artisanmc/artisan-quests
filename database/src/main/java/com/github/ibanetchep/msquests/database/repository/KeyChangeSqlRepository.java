package com.github.ibanetchep.msquests.database.repository;

import com.github.ibanetchep.msquests.core.repository.KeyChange;
import com.github.ibanetchep.msquests.core.repository.KeyChangeRepository;
import com.github.ibanetchep.msquests.database.DbAccess;
import org.jdbi.v3.core.Handle;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

/**
 * Moves the rows of {@code artisan_quests_quest} and {@code artisan_quests_rotation} onto the
 * keys their group and quest have now. Only rows still under a former key are touched, so
 * applying the same changes again changes nothing.
 *
 * <p>The keys in use are read first, in one pass over each table, and a statement only runs
 * for a former key some row still carries: a load whose changes are all done costs those two
 * reads, however many quests still say what they used to be called.
 */
public class KeyChangeSqlRepository extends SqlRepository implements KeyChangeRepository {

    public KeyChangeSqlRepository(DbAccess dbAccess) {
        super(dbAccess);
    }

    @Override
    public CompletableFuture<Integer> apply(List<KeyChange> changes) {
        if (changes.isEmpty()) {
            return CompletableFuture.completedFuture(0);
        }
        return supplyAsync(() -> getJdbi().inTransaction(handle -> {
            int moved = 0;

            // A quest's former key is looked up under its group's current key, and a uid row may
            // still carry the group's former one: groups first, then uids, then quests.
            Set<String> rotationGroups = new HashSet<>(handle
                    .createQuery("SELECT DISTINCT group_uid FROM artisan_quests_rotation")
                    .mapTo(String.class).list());
            Set<Name> names = names(handle);
            boolean groupMoved = false;
            for (KeyChange change : changes) {
                if (change instanceof KeyChange.Group group) {
                    if (names.stream().anyMatch(name -> name.group().equals(group.from()))) {
                        moved += handle.createUpdate("UPDATE artisan_quests_quest SET group_key = :to WHERE group_key = :from")
                                .bind("from", group.from())
                                .bind("to", group.to())
                                .execute();
                        groupMoved = true;
                    }
                    moved += rotations(handle, rotationGroups, group.from(), group.to());
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

            for (KeyChange change : changes) {
                if (!(change instanceof KeyChange.Quest quest)) continue;
                if (names.stream().noneMatch(name -> name.group().equals(quest.group()) && name.quest().equals(quest.from()))) {
                    continue;
                }
                moved += handle.createUpdate("""
                                UPDATE artisan_quests_quest
                                SET quest_key = :to
                                WHERE group_key = :group AND quest_key = :from""")
                        .bind("group", quest.group())
                        .bind("from", quest.from())
                        .bind("to", quest.to())
                        .execute();
            }
            return moved;
        }));
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

    private record Name(String uid, String group, String quest) {
    }
}
