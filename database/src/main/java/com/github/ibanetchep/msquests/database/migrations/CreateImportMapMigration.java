package com.github.ibanetchep.msquests.database.migrations;

import com.github.ibanetchep.msquests.database.Migration;
import org.jdbi.v3.core.Jdbi;

/**
 * The import ledger (Artisan ADR {@code data-imports} §3): one row per record an import wrote,
 * written in the transaction that writes the record. A record already in it is skipped; a batch
 * is what a rollback undoes.
 */
public class CreateImportMapMigration extends Migration {

    public CreateImportMapMigration(Jdbi jdbi) {
        super(jdbi, 4);
    }

    @Override
    public void migrate() {
        jdbi.useHandle(handle -> {
            handle.execute("""
                CREATE TABLE IF NOT EXISTS artisan_quests_import_map (
                    source VARCHAR(64) NOT NULL,
                    source_id VARCHAR(255) NOT NULL,
                    target VARCHAR(255) NOT NULL,
                    batch VARCHAR(64) NOT NULL,
                    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (source, source_id)
                )
                """);
            handle.execute("CREATE INDEX import_map_batch ON artisan_quests_import_map (batch)");
        });
    }
}
