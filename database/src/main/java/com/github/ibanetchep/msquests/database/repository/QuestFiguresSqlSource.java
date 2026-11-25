package com.github.ibanetchep.msquests.database.repository;

import com.github.ibanetchep.msquests.core.stats.QuestFigures.QuestRow;
import com.github.ibanetchep.msquests.core.stats.QuestFigures.StageRow;
import com.github.ibanetchep.msquests.core.stats.QuestFiguresSource;
import com.github.ibanetchep.msquests.database.DbAccess;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * The rows of the statistics figures, from {@code artisan_quests_quest} and
 * {@code artisan_quests_objective}. Read on the caller's thread (the one Artisan computes a
 * statistics query on), straight from the pool: these reads never queue behind the saves.
 */
public class QuestFiguresSqlSource implements QuestFiguresSource {

    /** Uids per statement: a group's quests fit in one, a huge group is read in several. */
    private static final int CHUNK = 500;

    private final DbAccess dbAccess;

    public QuestFiguresSqlSource(DbAccess dbAccess) {
        this.dbAccess = dbAccess;
    }

    /**
     * A completed quest's end is its {@code completed_at}, or else the end of its last objective:
     * quests completed before {@code completed_at} was written have the objectives' times only.
     */
    @Override
    public List<QuestRow> quests(Collection<String> questUids) {
        List<QuestRow> out = new ArrayList<>();
        for (List<String> uids : chunks(questUids)) {
            dbAccess.getJdbi().useHandle(handle -> handle.createQuery("""
                            SELECT q.quest_uid AS quest_uid, q.quest_status AS quest_status, q.created_at AS created_at,
                                   CASE WHEN q.quest_status = 'COMPLETED'
                                        THEN COALESCE(q.completed_at,
                                                (SELECT MAX(o.completed_at) FROM artisan_quests_objective o WHERE o.quest_id = q.id))
                                   END AS completed_at
                            FROM artisan_quests_quest q
                            WHERE q.quest_uid IN (<uids>)""")
                    .bindList("uids", uids)
                    .map((rs, ctx) -> new QuestRow(
                            rs.getString("quest_uid"),
                            rs.getString("quest_status"),
                            rs.getTimestamp("created_at").getTime(),
                            millis(rs.getTimestamp("completed_at"))))
                    .forEach(out::add));
        }
        return out;
    }

    @Override
    public List<StageRow> stages(Collection<String> questUids) {
        List<StageRow> out = new ArrayList<>();
        for (List<String> uids : chunks(questUids)) {
            dbAccess.getJdbi().useHandle(handle -> handle.createQuery("""
                            SELECT q.id AS quest_id, q.quest_uid AS quest_uid, q.created_at AS created_at,
                                   o.stage_key AS stage_key,
                                   SUM(CASE WHEN o.objective_status <> 'COMPLETED' THEN 1 ELSE 0 END) AS remaining,
                                   MAX(o.completed_at) AS last_completed_at
                            FROM artisan_quests_quest q
                            JOIN artisan_quests_objective o ON o.quest_id = q.id
                            WHERE q.quest_status = 'IN_PROGRESS' AND q.quest_uid IN (<uids>)
                            GROUP BY q.id, q.quest_uid, q.created_at, o.stage_key""")
                    .bindList("uids", uids)
                    .map((rs, ctx) -> new StageRow(
                            rs.getString("quest_id"),
                            rs.getString("quest_uid"),
                            rs.getTimestamp("created_at").getTime(),
                            rs.getString("stage_key"),
                            rs.getInt("remaining"),
                            millis(rs.getTimestamp("last_completed_at"))))
                    .forEach(out::add));
        }
        return out;
    }

    private static Long millis(Timestamp timestamp) {
        return timestamp != null && timestamp.getTime() > 0 ? timestamp.getTime() : null;
    }

    private static List<List<String>> chunks(Collection<String> uids) {
        List<String> all = List.copyOf(uids);
        List<List<String>> out = new ArrayList<>();
        for (int i = 0; i < all.size(); i += CHUNK) out.add(all.subList(i, Math.min(all.size(), i + CHUNK)));
        return out;
    }
}
