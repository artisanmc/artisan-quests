package com.github.ibanetchep.msquests.database.repository;

import com.github.ibanetchep.msquests.core.impact.ImpactSource;
import com.github.ibanetchep.msquests.database.DbAccess;

import java.util.List;

/**
 * The counts of {@link com.github.ibanetchep.msquests.core.impact.ContentImpact}, from
 * {@code artisan_quests_quest} and {@code artisan_quests_objective}. Read on the caller's thread
 * (the one Artisan checks a deployment on), straight from the pool, grouped by the database:
 * a group thousands of players are in costs three small result sets.
 */
public class QuestImpactSqlSource implements ImpactSource {

    private final DbAccess dbAccess;

    public QuestImpactSqlSource(DbAccess dbAccess) {
        this.dbAccess = dbAccess;
    }

    @Override
    public List<QuestCount> quests(String groupKey) {
        return dbAccess.getJdbi().withHandle(handle -> handle.createQuery("""
                        SELECT quest_key,
                               CASE WHEN quest_status = 'IN_PROGRESS' THEN reached_stage ELSE NULL END AS stage,
                               SUM(CASE WHEN quest_status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress,
                               SUM(CASE WHEN quest_status = 'IN_PROGRESS' THEN 0 ELSE 1 END) AS finished
                        FROM artisan_quests_quest
                        WHERE group_key = :group
                        GROUP BY quest_key, CASE WHEN quest_status = 'IN_PROGRESS' THEN reached_stage ELSE NULL END""")
                .bind("group", groupKey)
                .map((rs, ctx) -> new QuestCount(rs.getString("quest_key"), rs.getString("stage"),
                        rs.getInt("in_progress"), rs.getInt("finished")))
                .list());
    }

    @Override
    public List<ObjectiveCount> objectives(String groupKey) {
        return dbAccess.getJdbi().withHandle(handle -> handle.createQuery("""
                        SELECT q.quest_key AS quest_key, o.objective_key AS objective_key, o.objective_type AS objective_type,
                               SUM(CASE WHEN o.objective_status <> 'COMPLETED' AND o.progress > 0 THEN 1 ELSE 0 END) AS started,
                               SUM(CASE WHEN o.objective_status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed
                        FROM artisan_quests_quest q
                        JOIN artisan_quests_objective o ON o.quest_id = q.id
                        WHERE q.quest_status = 'IN_PROGRESS' AND q.group_key = :group
                        GROUP BY q.quest_key, o.objective_key, o.objective_type""")
                .bind("group", groupKey)
                .map((rs, ctx) -> new ObjectiveCount(rs.getString("quest_key"), rs.getString("objective_key"),
                        rs.getString("objective_type"), rs.getInt("started"), rs.getInt("completed")))
                .list());
    }

    @Override
    public int reaching(String groupKey, String questKey, String objectiveKey, int target) {
        return dbAccess.getJdbi().withHandle(handle -> handle.createQuery("""
                        SELECT COUNT(*)
                        FROM artisan_quests_quest q
                        JOIN artisan_quests_objective o ON o.quest_id = q.id
                        WHERE q.quest_status = 'IN_PROGRESS' AND q.group_key = :group AND q.quest_key = :quest
                          AND o.objective_key = :objective AND o.objective_status <> 'COMPLETED' AND o.progress >= :target""")
                .bind("group", groupKey)
                .bind("quest", questKey)
                .bind("objective", objectiveKey)
                .bind("target", target)
                .mapTo(Integer.class)
                .one());
    }
}
