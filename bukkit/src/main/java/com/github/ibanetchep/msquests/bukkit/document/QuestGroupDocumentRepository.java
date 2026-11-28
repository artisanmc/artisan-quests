package com.github.ibanetchep.msquests.bukkit.document;

import com.github.ibanetchep.msquests.bukkit.artisan.EditorProject;
import com.github.ibanetchep.msquests.core.dto.QuestConfigDTO;
import com.github.ibanetchep.msquests.core.dto.QuestGroupConfigDTO;
import com.github.ibanetchep.msquests.core.repository.QuestConfigLoad;
import com.github.ibanetchep.msquests.core.repository.QuestConfigRepository;
import com.github.ibanetchep.msquests.core.repository.KeyChange;
import org.jetbrains.annotations.Nullable;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Reads the quest groups from the {@code quest_group} Documents of <b>every</b> Artisan project:
 * {@code <project>/quest_groups/<group>.yml} (or {@code .yaml}), the group key being the file name (the Document id).
 * A module loaded on the server is usable in any project, so a group lives wherever its author
 * put it. Texts are loaded in the {@code default_lang} of the group's own project.
 *
 * <p>Reports a failure per file, like the {@code quests/*.yml} reader, plus:
 * <ul>
 *   <li>one per group key held by two projects: commands and placeholders name a group by its
 *       key alone, so it must be unique on the server. Neither copy loads, whatever the order the
 *       projects are listed in;</li>
 *   <li>one per uid used by two groups: the rows stored under a uid move to the quest that
 *       carries it, so a duplicated one would hand a quest's progress to another quest;</li>
 *   <li>one per group whose {@code old_key} is still a group's key, or is claimed by two groups,
 *       for the same reason.</li>
 * </ul>
 *
 * <p>The former names of the groups that load ({@code old_key}, {@code uid}) come back as
 * {@link QuestConfigLoad#keyChanges()}.
 */
public final class QuestGroupDocumentRepository implements QuestConfigRepository {

    public static final String DIR = "quest_groups";

    private final ProjectFiles projects;

    public QuestGroupDocumentRepository(ProjectFiles projects) {
        this.projects = projects;
    }

    /** The module's own project only: the converter's view, and the tests'. */
    public QuestGroupDocumentRepository(Path projectDir) {
        this(ProjectFiles.directory(EditorProject.PROJECT_ID, projectDir));
    }

    @Override
    public CompletableFuture<QuestConfigLoad> loadAllGroups() {
        return CompletableFuture.supplyAsync(this::loadNow);
    }

    QuestConfigLoad loadNow() {
        List<String> failures = new ArrayList<>();
        Map<String, List<GroupFile>> byKey = new LinkedHashMap<>();
        for (String project : projects.projectIds()) {
            for (String name : files(project)) {
                String key = name.substring(0, name.lastIndexOf('.'));
                byKey.computeIfAbsent(key, k -> new ArrayList<>()).add(new GroupFile(project, name));
            }
        }

        Map<String, QuestGroupConfigDTO> groups = new LinkedHashMap<>();
        Map<String, String> uidOwners = new HashMap<>();
        Map<String, String> oldGroupOwners = new HashMap<>();
        Map<String, List<KeyChange>> changesByGroup = new LinkedHashMap<>();
        Map<String, String> langs = new HashMap<>();
        for (Map.Entry<String, List<GroupFile>> entry : byKey.entrySet()) {
            String key = entry.getKey();
            List<GroupFile> files = entry.getValue();
            if (files.size() > 1) {
                failures.add("group '" + key + "' is defined by " + String.join(" and ",
                        files.stream().map(GroupFile::path).toList())
                        + ": a group key must be unique on the server, rename or delete one of them");
                continue;
            }
            GroupFile file = files.get(0);

            QuestGroupConfigDTO group;
            List<KeyChange> groupChanges;
            try {
                String lang = langs.computeIfAbsent(file.project(), this::defaultLang);
                String source = projects.read(file.project(), DIR + "/" + file.name());
                if (source == null) {
                    failures.add(file.path() + ": the file disappeared while reading");
                    continue;
                }
                Map<String, Object> doc = DocumentYaml.parse(source);
                group = QuestGroupDocumentReader.read(key, doc, lang).withSourceProject(file.project());
                groupChanges = QuestGroupDocumentReader.keyChanges(key, doc);
            } catch (IOException | RuntimeException e) {
                failures.add(file.path() + ": " + e.getMessage());
                continue;
            }

            // claimed aside, so a rejected Document reserves none of its uids
            Map<String, String> claimed = new HashMap<>();
            String clash = group.uid() != null ? claim(uidOwners, claimed, group.uid(), key) : null;
            for (QuestConfigDTO quest : group.quests()) {
                if (clash == null && quest.uid() != null) {
                    clash = claim(uidOwners, claimed, quest.uid(), key + "/" + quest.key());
                }
            }
            Map<String, String> claimedOld = new HashMap<>();
            for (KeyChange change : groupChanges) {
                if (clash != null || !(change instanceof KeyChange.Group old)) continue;
                if (byKey.containsKey(old.from())) {
                    clash = "old_key: '" + old.from() + "' is still the key of a group: remove it from old_key,"
                            + " or the progress of '" + old.from() + "' would move to '" + key + "'";
                } else {
                    String other = oldGroupOwners.get(old.from());
                    if (other != null) clash = "old_key: '" + old.from() + "' is already the old_key of group '" + other + "'";
                    claimedOld.put(old.from(), key);
                }
            }
            if (clash != null) {
                failures.add(file.path() + ": " + clash);
                continue;
            }
            uidOwners.putAll(claimed);
            oldGroupOwners.putAll(claimedOld);
            changesByGroup.put(key, groupChanges);
            groups.put(key, group);
        }
        dropMovesFromLiveQuests(groups, changesByGroup, failures);
        List<KeyChange> changes = new ArrayList<>();
        changesByGroup.values().forEach(changes::addAll);
        return new QuestConfigLoad(groups, failures, changes);
    }

    /**
     * A quest that says it came from another group ({@code old_key: {group, key}}) takes the rows
     * stored there. The group that claims a place still held by a quest, or one already claimed,
     * is not loaded: the progress of that quest would go to the wrong one.
     */
    private static void dropMovesFromLiveQuests(Map<String, QuestGroupConfigDTO> groups,
                                                Map<String, List<KeyChange>> changesByGroup, List<String> failures) {
        Map<String, String> owners = new HashMap<>();
        for (String key : List.copyOf(changesByGroup.keySet())) {
            String clash = null;
            Map<String, String> claimed = new HashMap<>();
            for (KeyChange change : changesByGroup.get(key)) {
                if (clash != null || !(change instanceof KeyChange.QuestMoved moved)) continue;
                String place = moved.fromGroup() + "/" + moved.from();
                QuestGroupConfigDTO source = groups.get(moved.fromGroup());
                if (source != null && source.quests().stream().anyMatch(quest -> quest.key().equals(moved.from()))) {
                    clash = "quest '" + moved.to() + "': old_key names '" + place + "', which is still a quest:"
                            + " remove it from old_key, or its progress would move to '" + key + "/" + moved.to() + "'";
                } else {
                    String other = owners.get(place);
                    if (other == null) other = claimed.put(place, key + "/" + moved.to());
                    if (other != null) clash = "quest '" + moved.to() + "': '" + place + "' is already the old_key of '" + other + "'";
                }
            }
            if (clash != null) {
                failures.add("group '" + key + "': " + clash);
                groups.remove(key);
                changesByGroup.remove(key);
            } else {
                owners.putAll(claimed);
            }
        }
    }

    /**
     * Fingerprint of the Documents as they are on disk now, in every project, to tell an Artisan
     * reload that changed them from one that did not (a publish of another file, a menu edit).
     */
    public String fingerprint() {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            for (String project : projects.projectIds()) {
                List<String> files = files(project);
                if (files.isEmpty()) continue;
                digest.update(("\0" + project + "\0").getBytes(StandardCharsets.UTF_8));
                String manifest = moduleFile(project);
                if (manifest != null) digest.update(manifest.getBytes(StandardCharsets.UTF_8));
                for (String name : files) {
                    String content = projects.read(project, DIR + "/" + name);
                    digest.update(name.getBytes(StandardCharsets.UTF_8));
                    if (content != null) digest.update(content.getBytes(StandardCharsets.UTF_8));
                }
            }
            return HexFormat.of().formatHex(digest.digest());
        } catch (RuntimeException e) {
            return "unreadable:" + System.nanoTime(); // differs every time: forces a reload attempt
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    /**
     * File names of {@code <project>/quest_groups/}, the folder's own YAML files only, sorted.
     * Artisan writes {@code .yml} and still reads {@code .yaml}: both are read here, and of a
     * group held twice the {@code .yml} copy is the one kept, as Artisan does.
     */
    private List<String> files(String project) {
        Map<String, String> byKey = new java.util.TreeMap<>();
        for (String name : projects.list(project, DIR)) {
            if (name.contains("/") || name.startsWith(".")) continue;
            boolean yml = name.endsWith(".yml");
            if (!yml && !name.endsWith(".yaml")) continue;
            String key = name.substring(0, name.lastIndexOf('.'));
            if (yml || !byKey.containsKey(key)) byKey.put(key, name);
        }
        return List.copyOf(byKey.values());
    }

    /** What Artisan names a project's own file, the current name first. */
    private static final List<String> MODULE_FILES = List.of("artisan-module.yml", "manifest.yml", "manifest.yaml");

    /** The project's own file, or null when it has none. */
    private @Nullable String moduleFile(String project) {
        for (String name : MODULE_FILES) {
            String content = projects.read(project, name);
            if (content != null) return content;
        }
        return null;
    }

    /** The project's default language, {@code en} when the manifest names none. */
    public String defaultLang(String project) {
        String manifest = moduleFile(project);
        if (manifest == null) return "en";
        Object lang;
        try {
            lang = DocumentYaml.parse(manifest).get("default_lang");
        } catch (IOException e) {
            throw new UncheckedIOException(project + ": its artisan-module.yml: " + e.getMessage(), e);
        }
        return lang != null && !lang.toString().isBlank() ? lang.toString() : "en";
    }

    /** The default language of the module's own project. */
    public String defaultLang() {
        return defaultLang(EditorProject.PROJECT_ID);
    }

    private static @Nullable String claim(Map<String, String> owners, Map<String, String> claimed,
                                          String uid, String owner) {
        String previous = owners.get(uid);
        if (previous == null) previous = claimed.putIfAbsent(uid, owner);
        return previous != null ? "uid " + uid + " of " + owner + " is already used by " + previous : null;
    }

    private record GroupFile(String project, String name) {
        String path() {
            return project + "/" + DIR + "/" + name;
        }
    }
}
