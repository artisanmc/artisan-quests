package com.github.ibanetchep.msquests.database.migrations;

import com.github.ibanetchep.msquests.database.Migration;
import org.jdbi.v3.core.Jdbi;

/**
 * Schema v6: {@code artisan_quests_key_change}, the changes of key already applied to this
 * database. One row per former place: a group ({@code from_key} empty) or a quest of a group.
 * A change found here is not applied again, so rows a late server writes under the former key
 * are never added to the progress an actor already has under the new one.
 */
public class CreateKeyChangeLedgerMigration extends Migration {

    public CreateKeyChangeLedgerMigration(Jdbi jdbi) {
        super(jdbi, 6);
    }

    @Override
    public void migrate() {
        jdbi.useHandle(handle -> handle.execute("""
                CREATE TABLE IF NOT EXISTS artisan_quests_key_change (
                    from_group VARCHAR(255) NOT NULL,
                    from_key VARCHAR(255) NOT NULL,
                    to_group VARCHAR(255) NOT NULL,
                    to_key VARCHAR(255) NOT NULL,
                    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (from_group, from_key)
                )
                """));
    }
}
