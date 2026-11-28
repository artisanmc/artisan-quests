package com.github.ibanetchep.msquests.database.migrations;

import com.github.ibanetchep.msquests.database.Migration;
import org.jdbi.v3.core.Jdbi;

/**
 * Schema v5: {@code artisan_quests_quest.reached_stage}, the key of the stage a quest stood on at
 * its last save. Without it the current stage was recomputed from the content alone, so a stage
 * inserted before it, or an objective added to a finished one, sent the actor back.
 *
 * <p>Null on the rows already there: they keep the recomputed stage until their next save. The
 * previous jar ignores the column.
 */
public class AddReachedStageMigration extends Migration {

    public AddReachedStageMigration(Jdbi jdbi) {
        super(jdbi, 5);
    }

    @Override
    public void migrate() {
        jdbi.useHandle(handle ->
                handle.execute("ALTER TABLE artisan_quests_quest ADD COLUMN reached_stage VARCHAR(255) NULL DEFAULT NULL"));
    }
}
