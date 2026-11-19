package com.github.ibanetchep.msquests.database;

import com.github.ibanetchep.msquests.core.dto.QuestDTO;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveDTO;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjectiveStatus;
import org.jdbi.v3.core.Handle;
import org.jdbi.v3.core.Jdbi;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

/**
 * {@code artisan_quests_import_map}, and the quest rows an import writes and a rollback removes
 * (Artisan ADR {@code data-imports} §3, §6). Each write is one transaction: the quest, its
 * objectives and its ledger row land together or not at all.
 *
 * <p>A quest's ledger {@code target} is {@code <quest row id>|<fingerprint>}: the fingerprint of
 * its status and objectives as imported, which a rollback compares with the row as it is now, so a
 * quest a player has moved since is kept.
 */
public final class ImportLedger {

    public record Row(String sourceId, String target) {
    }

    public enum Undo {
        /** Removed (or would be, on a dry run). */
        UNDONE,
        /** Changed since the import: kept. */
        CHANGED,
        /** Already gone: only its ledger row is removed. */
        GONE
    }

    private final Jdbi jdbi;

    public ImportLedger(Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    /** The source ids of {@code source} already imported, by any batch. */
    public Set<String> imported(String source) {
        return jdbi.withHandle(h -> new HashSet<>(h.createQuery(
                        "SELECT source_id FROM artisan_quests_import_map WHERE source = :source")
                .bind("source", source).mapTo(String.class).list()));
    }

    public List<Row> inBatch(String source, String batch) {
        return jdbi.withHandle(h -> h.createQuery("""
                        SELECT source_id, target FROM artisan_quests_import_map
                        WHERE source = :source AND batch = :batch ORDER BY source_id""")
                .bind("source", source).bind("batch", batch)
                .map((rs, ctx) -> new Row(rs.getString("source_id"), rs.getString("target"))).list());
    }

    /** Records something written outside the database (a Document), after it was written. */
    public void record(String source, String sourceId, String target, String batch) {
        jdbi.useHandle(h -> insert(h, source, sourceId, target, batch));
    }

    public void forget(String source, String sourceId) {
        jdbi.useHandle(h -> h.createUpdate("DELETE FROM artisan_quests_import_map WHERE source = :source AND source_id = :id")
                .bind("source", source).bind("id", sourceId).execute());
    }

    /**
     * Writes {@code quest} for its actor (created as {@code actorType} when missing) with its
     * objectives, and its ledger row. False when the ledger already holds {@code sourceId}: nothing
     * is written.
     */
    public boolean writeQuest(String source, String sourceId, String batch, QuestDTO quest, String actorType) {
        return jdbi.inTransaction(h -> {
            Integer known = h.createQuery("SELECT COUNT(*) FROM artisan_quests_import_map WHERE source = :source AND source_id = :id")
                    .bind("source", source).bind("id", sourceId).mapTo(Integer.class).one();
            if (known > 0) return false;
            String actor = quest.actorId().toString();
            Integer actors = h.createQuery("SELECT COUNT(*) FROM artisan_quests_actor WHERE id = :id")
                    .bind("id", actor).mapTo(Integer.class).one();
            if (actors == 0) {
                h.createUpdate("INSERT INTO artisan_quests_actor (id, actor_type) VALUES (:id, :type)")
                        .bind("id", actor).bind("type", actorType).execute();
            }
            Timestamp created = new Timestamp(quest.createdAt() != null ? quest.createdAt() : System.currentTimeMillis());
            h.createUpdate("""
                            INSERT INTO artisan_quests_quest
                                (id, quest_uid, quest_key, group_key, quest_status, started_at, completed_at, actor_id, created_at, updated_at)
                            VALUES (:id, :uid, :key, :group, :status, :created, :completed, :actor, :created, :created)""")
                    .bind("id", quest.id().toString())
                    .bind("uid", quest.questUid())
                    .bind("key", quest.questKey())
                    .bind("group", quest.groupKey())
                    .bind("status", quest.status().name())
                    .bind("created", created)
                    .bind("completed", quest.completedAt() != null ? new Timestamp(quest.completedAt()) : null)
                    .bind("actor", actor)
                    .execute();
            for (QuestObjectiveDTO o : quest.objectives().values()) {
                h.createUpdate("""
                                INSERT INTO artisan_quests_objective
                                    (quest_id, stage_key, objective_key, objective_status, objective_type, progress, completed_at)
                                VALUES (:quest, :stage, :key, :status, :type, :progress, :completed)""")
                        .bind("quest", quest.id().toString())
                        .bind("stage", o.stageKey())
                        .bind("key", o.objectiveKey())
                        .bind("status", o.objectiveStatus().name())
                        .bind("type", o.objectiveType())
                        .bind("progress", o.progress())
                        .bind("completed", o.objectiveStatus() == QuestObjectiveStatus.COMPLETED ? created : null)
                        .execute();
            }
            insert(h, source, sourceId, quest.id() + "|" + fingerprint(quest.status().name(), objectives(quest)), batch);
            return true;
        });
    }

    /** Undoes one quest of a batch: removed when still as imported, kept when a player moved it. */
    public Undo undoQuest(String source, Row row, boolean dryRun) {
        int bar = row.target().indexOf('|');
        String questId = bar >= 0 ? row.target().substring(0, bar) : row.target();
        String imported = bar >= 0 ? row.target().substring(bar + 1) : "";
        return jdbi.inTransaction(h -> {
            String status = h.createQuery("SELECT quest_status FROM artisan_quests_quest WHERE id = :id")
                    .bind("id", questId).mapTo(String.class).findOne().orElse(null);
            if (status == null) {
                if (!dryRun) deleteLedger(h, source, row.sourceId());
                return Undo.GONE;
            }
            Map<String, String> now = new TreeMap<>();
            h.createQuery("SELECT objective_key, objective_status, progress FROM artisan_quests_objective WHERE quest_id = :id")
                    .bind("id", questId)
                    .map((rs, ctx) -> now.put(rs.getString(1), rs.getString(2) + ":" + rs.getInt(3)))
                    .list();
            if (!fingerprint(status, now).equals(imported)) return Undo.CHANGED;
            if (!dryRun) {
                h.createUpdate("DELETE FROM artisan_quests_objective WHERE quest_id = :id").bind("id", questId).execute();
                h.createUpdate("DELETE FROM artisan_quests_quest WHERE id = :id").bind("id", questId).execute();
                deleteLedger(h, source, row.sourceId());
            }
            return Undo.UNDONE;
        });
    }

    private static Map<String, String> objectives(QuestDTO quest) {
        Map<String, String> out = new TreeMap<>();
        for (QuestObjectiveDTO o : quest.objectives().values()) {
            out.put(o.objectiveKey(), o.objectiveStatus().name() + ":" + o.progress());
        }
        return out;
    }

    static String fingerprint(String status, Map<String, String> objectives) {
        List<String> parts = new ArrayList<>();
        parts.add(status);
        objectives.forEach((k, v) -> parts.add(k + "=" + v));
        return Integer.toHexString(String.join(";", parts).hashCode());
    }

    private static void insert(Handle h, String source, String sourceId, String target, String batch) {
        h.createUpdate("""
                        INSERT INTO artisan_quests_import_map (source, source_id, target, batch, imported_at)
                        VALUES (:source, :id, :target, :batch, :at)""")
                .bind("source", source).bind("id", sourceId).bind("target", target).bind("batch", batch)
                .bind("at", new Timestamp(System.currentTimeMillis()))
                .execute();
    }

    private static void deleteLedger(Handle h, String source, String sourceId) {
        h.createUpdate("DELETE FROM artisan_quests_import_map WHERE source = :source AND source_id = :id")
                .bind("source", source).bind("id", sourceId).execute();
    }
}
