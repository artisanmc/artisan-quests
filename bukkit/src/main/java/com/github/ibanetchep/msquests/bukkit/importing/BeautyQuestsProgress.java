package com.github.ibanetchep.msquests.bukkit.importing;

import com.google.gson.Gson;
import org.jetbrains.annotations.Nullable;

import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Stream;

/**
 * What BeautyQuests stored for each player and quest, from its files ({@code players/*.yml}) or
 * its database ({@code database.enabled} in its {@code config.yml}), 1.0 and 2.x layouts alike,
 * reduced to what the import reads: times finished, the stage a player stands on and that stage's
 * counters. Read only.
 */
public final class BeautyQuestsProgress {

    /**
     * @param stage the regular stage number, or {@code -2} on the ending stage; ignored when not in progress
     * @param data  the BeautyQuests data of that stage ({@code remaining}, {@code amount}…), empty when none
     */
    public record Entry(UUID player, int quest, int finished, boolean inProgress, int branch, int stage,
                        Map<String, Object> data) {
        public String sourceId() {
            return "player:" + player + ":quest:" + quest;
        }
    }

    public record Rejection(String sourceId, String code, String message) {
    }

    public record Read(List<Entry> entries, List<Rejection> rejected, String origin) {
    }

    private static final Gson GSON = new Gson();

    private BeautyQuestsProgress() {
    }

    // ------------------------------------------------------------------ files

    /** {@code players/<n>.yml}: 1.0 lists {@code quests}, 2.x keys them by quest id. */
    public static Read files(Path playersDir, Function<String, Map<String, Object>> yaml) throws IOException {
        List<Entry> entries = new ArrayList<>();
        List<Rejection> rejected = new ArrayList<>();
        if (!Files.isDirectory(playersDir)) return new Read(entries, rejected, playersDir.toString());
        List<Path> files;
        try (Stream<Path> list = Files.list(playersDir)) {
            files = list.filter(p -> p.getFileName().toString().endsWith(".yml"))
                    .filter(p -> !p.getFileName().toString().equals("00_index.yml"))
                    .sorted().toList();
        }
        for (Path file : files) {
            Map<String, Object> doc;
            try {
                doc = yaml.apply(Files.readString(file, StandardCharsets.UTF_8));
            } catch (RuntimeException e) {
                rejected.add(new Rejection(file.getFileName().toString(), "unreadable_file", e.getMessage()));
                continue;
            }
            UUID player = player(Yaml.string(doc.get("identifier")));
            if (player == null) {
                rejected.add(new Rejection(file.getFileName().toString(), "unknown_player",
                        "identifier " + doc.get("identifier") + " is not a player UUID (AccountsHook accounts are not imported)"));
                continue;
            }
            Object quests = doc.get("quests");
            if (quests instanceof List<?> list) {
                for (Object q : list) {
                    Map<String, Object> m = Yaml.map(q);
                    entries.add(entry(player, Yaml.integer(m.get("questID"), -1), m));
                }
            } else {
                for (Map.Entry<String, Object> q : Yaml.map(quests).entrySet()) {
                    entries.add(entry(player, Yaml.integer(q.getKey(), -1), Yaml.map(q.getValue())));
                }
            }
        }
        return new Read(entries, rejected, playersDir.toString());
    }

    private static Entry entry(UUID player, int quest, Map<String, Object> m) {
        int finished = m.containsKey("timesFinished") ? Yaml.integer(m.get("timesFinished"), 0)
                : Boolean.TRUE.equals(m.get("finished")) ? 1 : Yaml.integer(m.get("finished"), 0);
        int branch = Yaml.integer(m.get("currentBranch"), -1);
        String state = Yaml.string(m.get("state"));
        int stage = "IN_ENDING_STAGES".equals(state) ? -2 : Yaml.integer(m.get("currentStage"), -1);
        Map<String, Object> data;
        if (m.containsKey("stageData")) {
            data = Yaml.map(Yaml.map(m.get("stageData")).get(String.valueOf(storage(stage))));
        } else {
            data = Yaml.map(Yaml.map(m.get("datas")).get("stage" + storage(stage)));
        }
        return new Entry(player, quest, finished, inProgress(state, branch, stage), branch, stage, data);
    }

    // ------------------------------------------------------------------ database

    /** The database BeautyQuests' {@code config.yml} names, or null when it uses files. */
    public static @Nullable String jdbcUrl(Map<String, Object> config) {
        Map<String, Object> db = Yaml.map(config.get("database"));
        if (!Boolean.TRUE.equals(db.get("enabled"))) return null;
        String custom = Yaml.string(db.get("connectionString"));
        if (custom != null && !custom.isBlank()) return custom;
        String url = "jdbc:mysql://" + db.getOrDefault("host", "localhost") + ":" + db.getOrDefault("port", 3306)
                + "/" + db.getOrDefault("database", "beautyquests");
        return Boolean.TRUE.equals(db.get("ssl")) ? url + "?useSSL=true" : url + "?useSSL=false";
    }

    public static Read database(Map<String, Object> config) throws SQLException {
        Map<String, Object> db = Yaml.map(config.get("database"));
        Map<String, Object> tables = Yaml.map(db.get("tables"));
        String url = jdbcUrl(config);
        if (url != null && url.startsWith("jdbc:mysql:")) {
            // The server ships the driver in a class loader DriverManager did not scan at startup.
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
            } catch (ClassNotFoundException | LinkageError ignored) {
                // DriverManager says so itself if no driver takes the URL
            }
        }
        try (Connection c = DriverManager.getConnection(url, Yaml.string(db.get("username")), Yaml.string(db.get("password")))) {
            c.setReadOnly(true);
            return database(c, tables);
        }
    }

    /** 2.x ({@code questers_quests}) when its table is there, else 1.0 ({@code player_quests} + {@code player_accounts}). */
    static Read database(Connection c, Map<String, Object> tables) throws SQLException {
        String questers = String.valueOf(tables.getOrDefault("questers quests", "questers_quests"));
        if (exists(c, questers)) return v2(c, questers);
        String accounts = String.valueOf(tables.getOrDefault("playerAccounts", "player_accounts"));
        String quests = String.valueOf(tables.getOrDefault("playerQuests", "player_quests"));
        if (!exists(c, quests)) throw new SQLException("neither " + questers + " nor " + quests + " is in BeautyQuests' database");
        return v1(c, accounts, quests);
    }

    private static Read v1(Connection c, String accounts, String quests) throws SQLException {
        List<Entry> entries = new ArrayList<>();
        List<Rejection> rejected = new ArrayList<>();
        String sql = "SELECT a.identifier, q.quest_id, q.finished, q.current_branch, q.current_stage, q.additional_datas"
                + " FROM " + quests + " q JOIN " + accounts + " a ON a.id = q.account_id ORDER BY a.id, q.quest_id";
        try (Statement s = c.createStatement(); ResultSet r = s.executeQuery(sql)) {
            while (r.next()) {
                String identifier = r.getString(1);
                int quest = r.getInt(2);
                UUID player = player(identifier);
                if (player == null) {
                    rejected.add(new Rejection("account:" + identifier + ":quest:" + quest, "unknown_player",
                            "identifier " + identifier + " is not a player UUID (AccountsHook accounts are not imported)"));
                    continue;
                }
                int finished = r.getInt(3);
                int branch = intOr(r, 4, -1);
                int stage = intOr(r, 5, -1);
                Map<String, Object> datas = json(r.getString(6));
                entries.add(new Entry(player, quest, finished, inProgress(null, branch, stage), branch, stage,
                        Yaml.map(datas.get("stage" + storage(stage)))));
            }
        }
        return new Read(entries, rejected, quests);
    }

    private static Read v2(Connection c, String table) throws SQLException {
        List<Entry> entries = new ArrayList<>();
        List<Rejection> rejected = new ArrayList<>();
        String sql = "SELECT quester_provider, quester_identifier, quest_id, finished, current_branch, current_stage,"
                + " stage_data, additional_datas, state FROM " + table + " ORDER BY quester_identifier, quest_id";
        try (Statement s = c.createStatement(); ResultSet r = s.executeQuery(sql)) {
            while (r.next()) {
                String provider = r.getString(1);
                String identifier = r.getString(2);
                int quest = r.getInt(3);
                UUID player = provider != null && provider.endsWith(":players") ? player(identifier) : null;
                if (player == null) {
                    rejected.add(new Rejection(provider + ":" + identifier + ":quest:" + quest, "unknown_player",
                            "quester " + provider + " " + identifier + " is not a player"));
                    continue;
                }
                int finished = r.getInt(4);
                int branch = intOr(r, 5, -1);
                String state = r.getString(9);
                int stage = "IN_ENDING_STAGES".equals(state) ? -2 : intOr(r, 6, -1);
                Map<String, Object> data;
                String stageData = r.getString(7);
                if (stageData != null) {
                    data = Yaml.map(json(stageData).get(String.valueOf(storage(stage))));
                } else {
                    data = Yaml.map(json(r.getString(8)).get("stage" + storage(stage)));
                }
                entries.add(new Entry(player, quest, finished, inProgress(state, branch, stage), branch, stage, data));
            }
        }
        return new Read(entries, rejected, table);
    }

    private static boolean exists(Connection c, String table) throws SQLException {
        DatabaseMetaData meta = c.getMetaData();
        for (String name : List.of(table, table.toUpperCase(Locale.ROOT), table.toLowerCase(Locale.ROOT))) {
            try (ResultSet r = meta.getTables(c.getCatalog(), null, name, null)) {
                if (r.next()) return true;
            }
        }
        return false;
    }

    private static int intOr(ResultSet r, int column, int fallback) throws SQLException {
        int value = r.getInt(column);
        return r.wasNull() ? fallback : value;
    }

    private static Map<String, Object> json(@Nullable String text) {
        if (text == null || text.isBlank()) return Map.of();
        try (Reader reader = new java.io.StringReader(text)) {
            Object parsed = GSON.fromJson(reader, Object.class);
            return Yaml.map(parsed);
        } catch (IOException | RuntimeException e) {
            return Map.of();
        }
    }

    // ------------------------------------------------------------------ shared

    /** The key BeautyQuests stores a stage's data under: its number, {@code 0} for the (single) ending stage. */
    private static int storage(int stage) {
        return stage == -2 ? 0 : stage;
    }

    private static boolean inProgress(@Nullable String state, int branch, int stage) {
        if (state != null) return state.equals("IN_REGULAR_STAGE") || state.equals("IN_ENDING_STAGES");
        return branch >= 0 && (stage >= 0 || stage == -2);
    }

    static @Nullable UUID player(@Nullable String identifier) {
        if (identifier == null) return null;
        try {
            return UUID.fromString(identifier.trim());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
