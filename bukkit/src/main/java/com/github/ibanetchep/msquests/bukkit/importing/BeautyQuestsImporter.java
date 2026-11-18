package com.github.ibanetchep.msquests.bukkit.importing;

import com.github.ibanetchep.msquests.bukkit.BukkitQuestsPlugin;
import com.github.ibanetchep.msquests.bukkit.artisan.EditorProject;
import com.github.ibanetchep.msquests.bukkit.config.ContentSource;
import com.github.ibanetchep.msquests.bukkit.document.DocumentException;
import com.github.ibanetchep.msquests.bukkit.document.DocumentYaml;
import com.github.ibanetchep.msquests.bukkit.document.QuestGroupDocumentReader;
import com.github.ibanetchep.msquests.bukkit.document.QuestGroupDocumentRepository;
import com.github.ibanetchep.msquests.database.DbAccess;
import com.github.ibanetchep.msquests.database.ImportLedger;
import net.artisanmc.modules.api.ArtisanAPI;
import net.artisanmc.modules.api.importing.ImportReport;
import net.artisanmc.modules.api.importing.ImportRequest;
import net.artisanmc.modules.api.importing.Importer;
import net.artisanmc.modules.api.importing.ImporterDeclaration;
import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.configuration.serialization.ConfigurationSerialization;
import org.bukkit.entity.EntityType;
import org.bukkit.inventory.ItemStack;
import org.jetbrains.annotations.Nullable;
import org.yaml.snakeyaml.LoaderOptions;
import org.yaml.snakeyaml.constructor.SafeConstructor;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.stream.Stream;

/**
 * {@code /artisan import msquests:beautyquests} (Artisan ADR {@code data-imports}): BeautyQuests'
 * quests become two {@code quest_group} Documents of the module's folder, the Citizens NPCs they name
 * become {@code npc} files ArtisanNpcs links, and each player's progress becomes
 * {@code artisan_quests_*} rows. A dry run reads everything and writes nothing; {@code confirm}
 * writes what is not in the ledger yet; a rollback removes what a batch wrote and nobody touched
 * since.
 *
 * <p>Needs {@code content_source: artisan} (the Documents and rows are what that mode reads).
 * BeautyQuests is read only, from its folder and, when its {@code config.yml} enables one, its
 * database. A player online during the run is left for a later run: their quests are in memory.
 */
public final class BeautyQuestsImporter implements Importer {

    public static final String SOURCE = "msquests:beautyquests";
    static final String NPC_DIR = "npcs";

    private final BukkitQuestsPlugin plugin;
    private final ArtisanAPI api;

    public BeautyQuestsImporter(BukkitQuestsPlugin plugin, ArtisanAPI api) {
        this.plugin = plugin;
        this.api = api;
    }

    public static ImporterDeclaration declaration(BukkitQuestsPlugin plugin, ArtisanAPI api) {
        return new ImporterDeclaration(SOURCE, "BeautyQuests", List.of("BeautyQuests"), false,
                new BeautyQuestsImporter(plugin, api));
    }

    @Override
    public ImportReport plan(ImportRequest request) {
        return run(request, true);
    }

    @Override
    public ImportReport apply(ImportRequest request) {
        return run(request, false);
    }

    // ------------------------------------------------------------------ import

    private ImportReport run(ImportRequest request, boolean dryRun) {
        boolean fr = request.getLang().toLowerCase(Locale.ROOT).startsWith("fr");
        Path bq = plugin.getDataFolder().toPath().getParent().resolve("BeautyQuests");
        Path project = plugin.getArtisanIntegration().questsProject().toPath();
        DbAccess db = plugin.getDbAccess();

        List<String> blockers = new ArrayList<>();
        if (plugin.getContentSource() != ContentSource.ARTISAN) {
            blockers.add(fr ? "content_source n'est pas « artisan » dans config.yml : passe-le à artisan et redémarre, puis relance l'import."
                    : "content_source is not \"artisan\" in config.yml: set it to artisan and restart, then run the import again.");
        }
        if (db == null) blockers.add(fr ? "La base d'ArtisanQuests n'est pas ouverte." : "ArtisanQuests' database is not open.");
        if (!Files.isDirectory(bq.resolve("quests"))) {
            blockers.add((fr ? "Dossier introuvable : " : "Folder not found: ") + bq.resolve("quests"));
        }
        if (!blockers.isEmpty()) {
            ImportReport.Builder report = ImportReport.builder(true, null);
            blockers.forEach(report::blocker);
            return report.build();
        }
        ImportLedger ledger = new ImportLedger(db.getJdbi());
        Set<String> imported = ledger.imported(SOURCE);
        String lang = projectLang(project);

        // Content.
        List<BeautyQuestsContent.Source> sources;
        try {
            sources = questFiles(bq.resolve("quests"));
        } catch (IOException e) {
            return blocked("Cannot read " + bq.resolve("quests") + ": " + e.getMessage());
        }
        BeautyQuestsContent.Result content = new BeautyQuestsContent(lang, items(), names()).convert(sources);
        for (Map.Entry<String, Map<String, Object>> doc : content.documents().entrySet()) {
            try {
                // As the quest reload does: the group read, then each objective's params checked
                // against its type and built.
                var group = QuestGroupDocumentReader.read(doc.getKey(), doc.getValue(), lang);
                for (var quest : group.quests()) {
                    for (var stage : quest.stages()) {
                        for (var objective : stage.objectives()) plugin.getObjectiveTypeRegistry().createConfig(objective);
                    }
                }
            } catch (RuntimeException e) {
                return blocked("The converted group " + doc.getKey() + " does not load (" + e.getMessage()
                        + "): nothing was written. Send this message and BeautyQuests' quests folder to support.");
            }
            Path dir = project.resolve(QuestGroupDocumentRepository.DIR);
            for (String ext : List.of(".yml", ".yaml")) {
                Path file = dir.resolve(doc.getKey() + ext);
                if (!imported.contains("group:" + doc.getKey()) && Files.exists(file)) {
                    return blocked(file + " already exists and was not written by an import: rename or move it first.");
                }
            }
        }

        // Progress.
        BeautyQuestsProgress.Read progress;
        try {
            progress = readProgress(bq);
        } catch (Exception e) {
            plugin.getLogger().log(Level.WARNING, "Cannot read BeautyQuests' player data", e);
            return blocked((fr ? "Progression de BeautyQuests illisible : " : "Cannot read BeautyQuests' player data: ") + e.getMessage());
        }
        long now = System.currentTimeMillis();
        List<BeautyQuestsRows.Planned> rows = new ArrayList<>();
        List<String[]> rejected = new ArrayList<>();
        content.rejected().forEach(r -> rejected.add(new String[]{r.sourceId(), r.code(), r.message()}));
        progress.rejected().forEach(r -> rejected.add(new String[]{r.sourceId(), r.code(), r.message()}));
        int already = 0;
        for (BeautyQuestsProgress.Entry entry : progress.entries()) {
            BeautyQuestsRows.Planned planned = BeautyQuestsRows.plan(entry, content.quests().get(entry.quest()), now);
            if (planned.isRejected()) {
                rejected.add(new String[]{entry.sourceId(), planned.code(), planned.message()});
            } else if (planned.isRow()) {
                if (imported.contains(entry.sourceId())) {
                    already++;
                } else if (Bukkit.getPlayer(entry.player()) != null) {
                    rejected.add(new String[]{entry.sourceId(), "player_online",
                            "the player is online: run the import again once they left"});
                } else {
                    rows.add(planned);
                }
            }
        }

        // Write.
        int groups = 0;
        int quests = 0;
        int npcs = 0;
        int active = 0;
        int completed = 0;
        List<String> written = new ArrayList<>();
        try {
            if (!dryRun && (hasNewContent(content, imported))) EditorProject.writeIfAbsent(project.toFile(), plugin.getGlobalConfig().language());
            for (Map.Entry<String, Map<String, Object>> doc : content.documents().entrySet()) {
                String id = "group:" + doc.getKey();
                if (imported.contains(id)) {
                    already++;
                    continue;
                }
                groups++;
                quests += ((List<?>) doc.getValue().get("quests")).size();
                if (!dryRun) {
                    String path = QuestGroupDocumentRepository.DIR + "/" + doc.getKey() + ".yml";
                    String hash = write(project.resolve(path), DocumentYaml.write(doc.getValue()));
                    ledger.record(SOURCE, id, path + "#" + hash, request.getBatch());
                    written.add(path);
                }
            }
            Set<String> knownNpcs = knownNpcs();
            for (Map.Entry<String, String> npc : content.citizens().entrySet()) {
                String id = "npc:" + npc.getKey();
                if (imported.contains(id)) {
                    already++;
                    continue;
                }
                if (knownNpcs.contains(npc.getKey())) continue;
                npcs++;
                if (!dryRun) {
                    String path = NPC_DIR + "/" + npc.getKey() + ".yml";
                    String hash = write(project.resolve(path), "schema: npcs/v1\ncitizens: " + npc.getValue() + "\n");
                    ledger.record(SOURCE, id, path + "#" + hash, request.getBatch());
                    written.add(path);
                }
            }
            for (BeautyQuestsRows.Planned row : rows) {
                boolean done = row.quest().status() == com.github.ibanetchep.msquests.core.quest.actor.QuestStatus.COMPLETED;
                if (!dryRun && !ledger.writeQuest(SOURCE, row.entry().sourceId(), request.getBatch(), row.quest(), "player")) {
                    already++;
                    continue;
                }
                if (done) completed++;
                else active++;
            }
        } catch (IOException | RuntimeException e) {
            plugin.getLogger().log(Level.SEVERE, "BeautyQuests import stopped", e);
            throw new IllegalStateException("stopped after writing " + written.size() + " file(s) and "
                    + (active + completed) + " quest row(s): " + e.getMessage()
                    + ". Run it again: what is written is in the ledger and is skipped.", e);
        }
        boolean wrote = !dryRun && (groups + npcs + active + completed) > 0;
        if (!dryRun && (groups + npcs) > 0) reloadContent();

        ImportReport.Builder report = ImportReport.builder(dryRun, wrote ? request.getBatch() : null);
        report.count("groups", fr ? "Groupes de quêtes" : "Quest groups", groups);
        report.count("quests", fr ? "Quêtes" : "Quests", quests);
        report.count("npcs", fr ? "PNJ Citizens (fichiers d'ArtisanNpcs)" : "Citizens NPCs (ArtisanNpcs files)", npcs);
        report.count("active", fr ? "Quêtes en cours de joueurs" : "Players' quests in progress", active);
        report.count("completed", fr ? "Quêtes terminées de joueurs" : "Players' completed quests", completed);
        report.alreadyImported(already);
        for (String[] r : rejected) report.reject(r[0], r[1], r[2]);
        Path details = details(request.getBatch(), dryRun, content, rejected, progress.origin());
        if (details != null) report.note((fr ? "Rapport complet : " : "Full report: ") + details);
        content.notes().forEach(report::note);
        return report.build();
    }

    private static boolean hasNewContent(BeautyQuestsContent.Result content, Set<String> imported) {
        return content.documents().keySet().stream().anyMatch(k -> !imported.contains("group:" + k));
    }

    private ImportReport blocked(String message) {
        return ImportReport.builder(true, null).blocker(message).build();
    }

    // ------------------------------------------------------------------ rollback

    @Override
    public ImportReport rollback(String batch, boolean dryRun) {
        DbAccess db = plugin.getDbAccess();
        if (db == null) return blocked("ArtisanQuests' database is not open.");
        ImportLedger ledger = new ImportLedger(db.getJdbi());
        Path project = plugin.getArtisanIntegration().questsProject().toPath();
        int quests = 0;
        int files = 0;
        List<String[]> kept = new ArrayList<>();
        List<ImportLedger.Row> rows = ledger.inBatch(SOURCE, batch);
        // Players' rows first: the files they point to go last.
        for (ImportLedger.Row row : rows) {
            if (!row.sourceId().startsWith("player:")) continue;
            switch (ledger.undoQuest(SOURCE, row, dryRun)) {
                case UNDONE -> quests++;
                case CHANGED -> kept.add(new String[]{row.sourceId(), "changed_since", "the player moved this quest since the import: kept"});
                case GONE -> { }
            }
        }
        boolean filesRemoved = false;
        for (ImportLedger.Row row : rows) {
            if (row.sourceId().startsWith("player:")) continue;
            int hash = row.target().lastIndexOf('#');
            String path = hash >= 0 ? row.target().substring(0, hash) : row.target();
            Path file = project.resolve(path);
            try {
                if (!Files.exists(file)) {
                    if (!dryRun) ledger.forget(SOURCE, row.sourceId());
                    continue;
                }
                String now = sha256(Files.readAllBytes(file));
                if (hash >= 0 && !now.equals(row.target().substring(hash + 1))) {
                    kept.add(new String[]{row.sourceId(), "changed_since", path + " was edited since the import: kept"});
                    continue;
                }
                files++;
                if (!dryRun) {
                    Files.delete(file);
                    ledger.forget(SOURCE, row.sourceId());
                    filesRemoved = true;
                }
            } catch (IOException e) {
                kept.add(new String[]{row.sourceId(), "failed", path + ": " + e.getMessage()});
            }
        }
        if (filesRemoved) reloadContent();
        ImportReport.Builder report = ImportReport.builder(dryRun, !dryRun && quests + files > 0 ? batch : null);
        report.count("files", "Files (groups, NPCs)", files);
        report.count("quests", "Players' quests", quests);
        kept.forEach(k -> report.reject(k[0], k[1], k[2]));
        return report.build();
    }

    // ------------------------------------------------------------------ reading

    private static List<BeautyQuestsContent.Source> questFiles(Path dir) throws IOException {
        List<BeautyQuestsContent.Source> out = new ArrayList<>();
        try (Stream<Path> walk = Files.walk(dir)) {
            for (Path file : walk.filter(p -> p.toString().endsWith(".yml")).sorted().toList()) {
                out.add(new BeautyQuestsContent.Source(dir.relativize(file).toString(), yaml(Files.readString(file, StandardCharsets.UTF_8))));
            }
        }
        return out;
    }

    private BeautyQuestsProgress.Read readProgress(Path bq) throws Exception {
        Path config = bq.resolve("config.yml");
        if (Files.exists(config)) {
            Map<String, Object> conf = yaml(Files.readString(config, StandardCharsets.UTF_8));
            if (BeautyQuestsProgress.jdbcUrl(conf) != null) return BeautyQuestsProgress.database(conf);
        }
        return BeautyQuestsProgress.files(bq.resolve("players"), BeautyQuestsImporter::yaml);
    }

    static Map<String, Object> yaml(String text) {
        LoaderOptions options = new LoaderOptions();
        options.setCodePointLimit(64 * 1024 * 1024);
        Object tree = new org.yaml.snakeyaml.Yaml(new SafeConstructor(options)).load(text);
        return Yaml.map(tree);
    }

    private String projectLang(Path project) {
        boolean manifest = Files.exists(project.resolve("manifest.yaml")) || Files.exists(project.resolve("artisan-module.yml"));
        return manifest ? new QuestGroupDocumentRepository(project).defaultLang()
                : EditorProject.defaultLang(plugin.getGlobalConfig().language());
    }

    /** NPC ids that already have a file in a project: an import never writes over one. */
    private Set<String> knownNpcs() {
        Set<String> out = new java.util.HashSet<>();
        try {
            for (String projectId : api.getProject().projectIds()) {
                for (String path : api.getProject().list(projectId, NPC_DIR)) {
                    String name = path.substring(path.lastIndexOf('/') + 1);
                    int dot = name.lastIndexOf('.');
                    out.add(dot > 0 ? name.substring(0, dot) : name);
                }
            }
        } catch (RuntimeException e) {
            plugin.getLogger().log(Level.FINE, "Cannot list NPC files", e);
        }
        return out;
    }

    private BeautyQuestsContent.Items items() {
        return new BeautyQuestsContent.Items() {
            @Override
            public Map<String, Object> spec(Map<String, Object> serialized) {
                return api.getItems().describe(stack(serialized));
            }

            @Override
            public int amount(Map<String, Object> serialized) {
                return Yaml.integer(serialized.get("amount"), 1);
            }
        };
    }

    /** A stack as Bukkit serialized it, its nested {@code ==} maps (the meta) deserialized first. */
    @SuppressWarnings("unchecked")
    static ItemStack stack(Map<String, Object> serialized) {
        Map<String, Object> resolved = (Map<String, Object>) resolve(serialized);
        resolved.remove(ConfigurationSerialization.SERIALIZED_TYPE_KEY);
        return ItemStack.deserialize(resolved);
    }

    private static Object resolve(Object value) {
        if (value instanceof Map<?, ?> map) {
            Map<String, Object> out = new LinkedHashMap<>();
            map.forEach((k, v) -> out.put(String.valueOf(k), resolve(v)));
            // A nested serialized object (the item's meta): Bukkit's deserializer, as a YAML load would.
            if (out.containsKey(ConfigurationSerialization.SERIALIZED_TYPE_KEY) && !"org.bukkit.inventory.ItemStack".equals(
                    out.get(ConfigurationSerialization.SERIALIZED_TYPE_KEY))) {
                Object object = ConfigurationSerialization.deserializeObject(out);
                if (object != null) return object;
            }
            return out;
        }
        if (value instanceof List<?> list) return list.stream().map(BeautyQuestsImporter::resolve).toList();
        return value;
    }

    private static BeautyQuestsContent.Names names() {
        return new BeautyQuestsContent.Names() {
            @Override
            public boolean material(String name) {
                return Material.matchMaterial(name) != null;
            }

            @Override
            public boolean entity(String name) {
                try {
                    EntityType.valueOf(name);
                    return true;
                } catch (IllegalArgumentException e) {
                    return false;
                }
            }
        };
    }

    // ------------------------------------------------------------------ writing

    private String write(Path file, String content) throws IOException {
        Files.createDirectories(file.getParent());
        byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
        Path tmp = file.resolveSibling("." + file.getFileName() + ".importing");
        Files.write(tmp, bytes);
        Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
        return sha256(bytes);
    }

    private void reloadContent() {
        try {
            api.getProject().reload();
        } catch (RuntimeException e) {
            plugin.getLogger().log(Level.WARNING, "Artisan could not reload the projects after the import: run /artisan reload", e);
        }
    }

    /** Everything the run found, in a file: the chat shows the first lines only. */
    private @Nullable Path details(String batch, boolean dryRun, BeautyQuestsContent.Result content,
                                   List<String[]> rejected, String origin) {
        try {
            Path dir = plugin.getDataFolder().toPath().resolve("imports");
            Files.createDirectories(dir);
            Path file = dir.resolve("beautyquests-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"))
                    + (dryRun ? "-dry" : "-" + batch) + ".txt");
            StringBuilder out = new StringBuilder();
            out.append("BeautyQuests import ").append(dryRun ? "(dry run)" : "batch " + batch).append('\n');
            out.append("Progress read from ").append(origin).append("\n\n");
            out.append("Quests converted: ").append(content.quests().size()).append('\n');
            content.quests().values().forEach(q -> out.append("  ").append(q.id()).append(" -> ")
                    .append(q.group()).append('/').append(q.key()).append(" (").append(q.stages().size()).append(" stages)\n"));
            out.append("\nSet aside: ").append(rejected.size()).append('\n');
            rejected.forEach(r -> out.append("  [").append(r[1]).append("] ").append(r[0]).append(": ").append(r[2]).append('\n'));
            out.append("\nNot carried, to check in the editor: ").append(content.notes().size()).append('\n');
            content.notes().forEach(n -> out.append("  ").append(n).append('\n'));
            Files.writeString(file, out.toString(), StandardCharsets.UTF_8);
            return file;
        } catch (IOException | RuntimeException e) {
            plugin.getLogger().log(Level.WARNING, "Cannot write the import report", e);
            return null;
        }
    }

    static String sha256(byte[] bytes) {
        try {
            return java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(bytes));
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
