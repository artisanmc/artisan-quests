package com.github.ibanetchep.msquests.bukkit.importing;

import org.jetbrains.annotations.Nullable;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

/**
 * BeautyQuests quests ({@code plugins/BeautyQuests/quests/*.yml}, 1.0 and 2.x write the same
 * format) as {@code quest_group/v1} Documents, and the map from each BeautyQuests quest, stage and
 * counted object to the quest, stage and objective it became, which the progress import reads.
 *
 * <p>Two groups: {@code beautyquests} holds the quests a player does once (no reset, so
 * {@code max_per_period} the number of quests reads as "each once"), {@code beautyquests_repeatable}
 * the repeatable ones. Both are started by their giver NPC or a command, never handed out.
 *
 * <p>A quest is imported only when each of its stages becomes an objective ArtisanQuests runs
 * the same way; otherwise it is rejected with the stage's reason, and so is its players'
 * progress. What a quest carries besides (rewards, requirements, options) is converted when an
 * Artisan action or condition does the same, and listed as a note otherwise: the admin reviews
 * the group in the editor before players see it. Deterministic: the same files give the same
 * Documents, uids included.
 */
public final class BeautyQuestsContent {

    public static final String GROUP = "beautyquests";
    public static final String REPEATABLE_GROUP = "beautyquests_repeatable";

    /** Reads a stack as Bukkit serialized it ({@code ItemStack#serialize}, the {@code ==} map). */
    public interface Items {
        /** The item spec an objective matches ({@code api.getItems().describe}); throws when unreadable. */
        Map<String, Object> spec(Map<String, Object> serialized);

        /** The stack's amount. */
        int amount(Map<String, Object> serialized);
    }

    /** What this server knows: the names a Document must hold, else the whole group would not load. */
    public interface Names {
        boolean material(String name);

        boolean entity(String name);
    }

    /** How a player's progress on a stage is stored by BeautyQuests. */
    public enum Progress {
        /** {@code remaining: {<object uuid>: n}}: one objective per counted object. */
        REMAINING,
        /** {@code amount: n} left: a single objective. */
        AMOUNT,
        /** Nothing counted: done or not (talk, deliver, command). */
        NONE
    }

    /** @param source the counted object's uuid ({@link Progress#REMAINING}), else null */
    public record Objective(String key, String type, int amount, @Nullable String source) {
    }

    /** @param index the BeautyQuests stage number, {@code -2} for the ending stage */
    public record Stage(String key, int index, Progress progress, List<Objective> objectives) {
    }

    public record Quest(int id, String group, String groupUid, String key, String uid, String title, List<Stage> stages) {
        /** The stage BeautyQuests stores at {@code stage} ({@code -2}: the ending one), else null. */
        public @Nullable Stage stageAt(int stage) {
            for (Stage s : stages) {
                if (s.index() == stage) return s;
            }
            return null;
        }
    }

    public record Rejection(String sourceId, String code, String message) {
    }

    /** @param documents group key → Document, only the groups holding a quest */
    /** @param citizens the Citizens NPCs the quests name: ArtisanNpcs id → Citizens number */
    public record Result(Map<String, Map<String, Object>> documents, Map<Integer, Quest> quests,
                         List<Rejection> rejected, List<String> notes, Map<String, String> citizens) {
    }

    /** A quest file: its path for messages, its YAML. */
    public record Source(String file, Map<String, Object> yaml) {
    }

    private final String lang;
    private final Items items;
    private final Names names;

    public BeautyQuestsContent(String lang, Items items, Names names) {
        this.lang = lang;
        this.items = items;
        this.names = names;
    }

    public Result convert(List<Source> sources) {
        List<Rejection> rejected = new ArrayList<>();
        List<String> notes = new ArrayList<>();
        Map<String, String> citizens = new TreeMap<>();
        Map<Integer, Quest> quests = new TreeMap<>();
        Map<String, List<Map<String, Object>>> byGroup = new LinkedHashMap<>();
        byGroup.put(GROUP, new ArrayList<>());
        byGroup.put(REPEATABLE_GROUP, new ArrayList<>());

        List<Source> sorted = new ArrayList<>(sources);
        sorted.sort(Comparator.comparingInt(s -> Yaml.integer(s.yaml().get("id"), Integer.MAX_VALUE)));
        for (Source source : sorted) {
            Object rawId = source.yaml().get("id");
            Integer id = rawId instanceof Number n ? Integer.valueOf(n.intValue()) : null;
            if (id == null) {
                rejected.add(new Rejection(source.file(), "no_id", "the file has no quest id"));
                continue;
            }
            if (quests.containsKey(id)) {
                rejected.add(new Rejection("quest:" + id, "duplicate_id", "two files hold quest " + id + ": " + source.file()));
                continue;
            }
            QuestNotes questNotes = new QuestNotes(id, Yaml.string(source.yaml().get("name")));
            try {
                boolean repeatable = Boolean.TRUE.equals(source.yaml().get("repeatable"));
                String group = repeatable ? REPEATABLE_GROUP : GROUP;
                Converted converted = quest(id, group, source.yaml(), questNotes);
                byGroup.get(group).add(converted.document());
                quests.put(id, converted.quest());
                notes.addAll(questNotes.lines);
                citizens.putAll(questNotes.citizens);
            } catch (Refused e) {
                rejected.add(new Rejection("quest:" + id, e.code, questNotes.label() + ": " + e.getMessage()));
            }
        }

        Map<String, Map<String, Object>> documents = new LinkedHashMap<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : byGroup.entrySet()) {
            if (entry.getValue().isEmpty()) continue;
            documents.put(entry.getKey(), group(entry.getKey(), entry.getValue()));
        }
        return new Result(documents, quests, rejected, notes, citizens);
    }

    // ------------------------------------------------------------------ groups

    private Map<String, Object> group(String key, List<Map<String, Object>> quests) {
        boolean repeatable = key.equals(REPEATABLE_GROUP);
        Map<String, Object> doc = new LinkedHashMap<>();
        doc.put("schema", "quest_group/v1");
        doc.put("uid", uid("group:" + key));
        doc.put("title", ltext(repeatable ? "BeautyQuests (repeatable)" : "BeautyQuests"));
        doc.put("description", ltext(repeatable
                ? "Imported from BeautyQuests: quests a player may do again."
                : "Imported from BeautyQuests: each quest once per player."));
        doc.put("actor_type", "player");
        Map<String, Object> limits = new LinkedHashMap<>();
        limits.put("max_active", quests.size());
        // No reset: the period is forever, so this reads "each quest once".
        if (!repeatable) limits.put("max_per_period", quests.size());
        doc.put("limits", limits);
        doc.put("distribution", Map.of("strategy", "none"));
        doc.put("quests", quests);
        return doc;
    }

    // ------------------------------------------------------------------ quests

    private record Converted(Quest quest, Map<String, Object> document) {
    }

    private Converted quest(int id, String group, Map<String, Object> yaml, QuestNotes notes) {
        String key = "quest_" + id;
        String uid = uid("quest:" + id);
        String name = Yaml.string(yaml.get("name"));
        String title = name != null ? name : "Quest " + id;

        List<Map<String, Object>> rawStages = mainBranch(Yaml.map(yaml.get("manager")));
        List<Stage> stages = new ArrayList<>();
        List<Map<String, Object>> stageDocs = new ArrayList<>();
        List<Object> objectiveRewards = new ArrayList<>();
        Counter keys = new Counter();
        for (Map<String, Object> raw : rawStages) {
            int index = Yaml.integer(raw.get("__index"), 0);
            String stageKey = "stage_" + (stages.size() + 1);
            ConvertedStage converted = stage(raw, keys, notes, stages.size() + 1);
            Stage stage = new Stage(stageKey, index, converted.progress(), converted.objectives());
            stages.add(stage);

            Map<String, Object> stageDoc = new LinkedHashMap<>();
            stageDoc.put("key", stageKey);
            String custom = Yaml.string(raw.get("customText"));
            if (custom != null && !custom.isBlank()) stageDoc.put("title", ltext(LegacyText.toMiniMessage(custom)));
            List<Map<String, Object>> objectiveDocs = new ArrayList<>(converted.documents());
            stageDoc.put("objectives", objectiveDocs);
            stageDocs.add(stageDoc);

            // A stage's own rewards run when its objective completes; with several, nothing says
            // when the stage ends, so they are left out and listed.
            List<Object> stageSteps = new ArrayList<>();
            String startText = Yaml.string(raw.get("text"));
            if (startText != null && !startText.isBlank() && stages.size() > 1) {
                notes.add("stage " + stages.size() + ": its start message is not carried (no stage-start hook)");
            }
            stageSteps.addAll(rewards(Yaml.list(raw.get("rewards")), notes, "stage " + stages.size()));
            if (!Yaml.list(raw.get("requirements")).isEmpty()) {
                notes.add("stage " + stages.size() + ": its requirements are not carried");
            }
            if (!stageSteps.isEmpty()) {
                if (converted.objectives().size() == 1) {
                    Map<String, Object> when = new LinkedHashMap<>();
                    when.put("if", List.of(Map.of("expression", "objective == '" + converted.objectives().get(0).key() + "'")));
                    when.put("do", stageSteps);
                    objectiveRewards.add(when);
                } else {
                    notes.add("stage " + stages.size() + ": its rewards are not carried (several objectives, no stage-end hook)");
                }
            }
        }
        if (stages.isEmpty()) throw new Refused("no_stage", "the quest has no stage");

        Map<String, Object> doc = new LinkedHashMap<>();
        doc.put("key", key);
        doc.put("uid", uid);
        doc.put("title", ltext(LegacyText.toMiniMessage(title)));
        String description = Yaml.string(yaml.get("description"));
        if (description != null && !description.isBlank()) doc.put("description", ltext(LegacyText.toMiniMessage(description)));

        Object starter = yaml.get("starterNPC");
        if (starter != null) {
            Map<String, Object> giver = new LinkedHashMap<>();
            giver.put("npc", npc(starter, notes));
            String line = dialog(Yaml.map(yaml.get("startDialog")), notes, "start dialog");
            if (line != null) giver.put("line", ltext(line));
            doc.put("giver", giver);
        } else if (yaml.containsKey("startDialog")) {
            notes.add("its start dialog is not carried (no starter NPC)");
        }

        List<Object> requirements = requirements(Yaml.list(yaml.get("requirements")), notes);
        if (!requirements.isEmpty()) doc.put("requirements", requirements);

        doc.put("stages", stageDocs);

        Map<String, Object> actions = new LinkedHashMap<>();
        List<Object> start = new ArrayList<>();
        String startMessage = Yaml.string(yaml.get("startMessage"));
        if (startMessage != null && !startMessage.isBlank()) start.add(message(startMessage));
        start.addAll(rewards(Yaml.list(yaml.get("startRewards")), notes, "start rewards"));
        if (!start.isEmpty()) actions.put("start", start);
        if (!objectiveRewards.isEmpty()) actions.put("objective_complete", objectiveRewards);
        List<Object> complete = new ArrayList<>();
        String endMessage = Yaml.string(yaml.get("endMsg"));
        if (endMessage == null) endMessage = Yaml.string(yaml.get("endMessage"));
        if (endMessage != null && !endMessage.isBlank()) complete.add(message(endMessage));
        complete.addAll(rewards(Yaml.list(yaml.get("endRewards")), notes, "end rewards"));
        if (!complete.isEmpty()) actions.put("complete", complete);
        if (!actions.isEmpty()) doc.put("actions", actions);

        options(yaml, notes);
        return new Converted(new Quest(id, group, uid("group:" + group), key, uid, title, List.copyOf(stages)), doc);
    }

    /** Branch 0's regular stages, then its ending stage when there is exactly one, leading nowhere. */
    private static List<Map<String, Object>> mainBranch(Map<String, Object> manager) {
        Map<String, Object> branches = Yaml.map(manager.get("branches"));
        if (branches.isEmpty()) throw new Refused("no_stage", "the quest has no branch");
        if (branches.size() > 1) {
            throw new Refused("branches", "the quest has " + branches.size() + " branches; ArtisanQuests quests are one path");
        }
        Map<String, Object> branch = Yaml.map(branches.values().iterator().next());
        List<Map<String, Object>> out = new ArrayList<>();
        for (Map.Entry<Integer, Map<String, Object>> stage : Yaml.indexed(branch.get("stages")).entrySet()) {
            Map<String, Object> copy = new LinkedHashMap<>(stage.getValue());
            copy.put("__index", stage.getKey());
            out.add(copy);
        }
        Map<Integer, Map<String, Object>> endings = Yaml.indexed(branch.get("endingStages"));
        if (endings.size() > 1) {
            throw new Refused("branches", "the quest ends on a choice of " + endings.size() + " stages; ArtisanQuests quests are one path");
        }
        if (endings.size() == 1) {
            Map<String, Object> copy = new LinkedHashMap<>(endings.values().iterator().next());
            if (copy.containsKey("branchLinked")) {
                throw new Refused("branches", "its ending stage leads to another branch");
            }
            copy.put("__index", -2);
            out.add(copy);
        }
        return out;
    }

    // ------------------------------------------------------------------ stages

    private record ConvertedStage(Progress progress, List<Objective> objectives, List<Map<String, Object>> documents) {
    }

    private ConvertedStage stage(Map<String, Object> raw, Counter keys, QuestNotes notes, int number) {
        String type = String.valueOf(raw.get("stageType"));
        List<Objective> objectives = new ArrayList<>();
        List<Map<String, Object>> docs = new ArrayList<>();
        String where = "stage " + number + " (" + type + ")";
        switch (type) {
            case "MOBS" -> {
                for (Map.Entry<String, Map<String, Object>> object : objects(raw, where).entrySet()) {
                    Map<String, Object> mob = Yaml.map(object.getValue().get("object"));
                    String factory = Yaml.string(mob.get("factoryName"));
                    String entity = Yaml.string(mob.get("value"));
                    if (!"bukkitEntity".equals(factory) || entity == null) {
                        throw new Refused("unsupported_mob", where + ": mobs of " + factory + " are not vanilla entities");
                    }
                    entity = entity.toUpperCase(Locale.ROOT);
                    if (!names.entity(entity)) throw new Refused("unknown_entity", where + ": unknown entity " + entity);
                    if (mob.get("name") != null) notes.add(where + ": the mob's name " + mob.get("name") + " is not checked any more");
                    if (mob.get("minLevel") != null) notes.add(where + ": the mob's minimum level is not checked any more");
                    int amount = amount(object.getValue().get("amount"), where);
                    Objective o = new Objective(keys.next("kill"), "kill_entity", amount, object.getKey());
                    objectives.add(o);
                    docs.add(doc(o, "entity_type", entity));
                }
                if (Boolean.TRUE.equals(raw.get("shoot"))) notes.add(where + ": \"killed with a bow\" is not checked any more");
                return new ConvertedStage(Progress.REMAINING, objectives, docs);
            }
            case "MINE" -> {
                for (Map.Entry<String, Map<String, Object>> object : objects(raw, where).entrySet()) {
                    String material = block(Yaml.string(object.getValue().get("object")), where, notes);
                    int amount = amount(object.getValue().get("amount"), where);
                    Objective o = new Objective(keys.next("mine"), "block_break", amount, object.getKey());
                    objectives.add(o);
                    docs.add(doc(o, "material", material));
                }
                return new ConvertedStage(Progress.REMAINING, objectives, docs);
            }
            case "FISH" -> {
                for (Map.Entry<String, Map<String, Object>> object : objects(raw, where).entrySet()) {
                    Map<String, Object> spec = item(Yaml.map(object.getValue().get("object")), where);
                    int amount = amount(object.getValue().get("amount"), where);
                    Objective o = new Objective(keys.next("fish"), "fishing", amount, object.getKey());
                    objectives.add(o);
                    docs.add(doc(o, "item", spec));
                }
                return new ConvertedStage(Progress.REMAINING, objectives, docs);
            }
            case "BREED" -> {
                String entity = Yaml.string(raw.get("entityType"));
                int amount = amount(raw.get("amount"), where);
                Objective o = new Objective(keys.next("breed"), "breed_animal", amount, null);
                objectives.add(o);
                if (entity == null || entity.equalsIgnoreCase("any")) {
                    docs.add(doc(o));
                } else {
                    entity = entity.toUpperCase(Locale.ROOT);
                    if (!names.entity(entity)) throw new Refused("unknown_entity", where + ": unknown entity " + entity);
                    docs.add(doc(o, "entity_type", entity));
                }
                return new ConvertedStage(Progress.AMOUNT, objectives, docs);
            }
            case "CRAFT" -> {
                Map<String, Object> result = Yaml.map(raw.get("result"));
                Map<String, Object> spec = item(result, where);
                int amount = Math.max(1, items.amount(result));
                Objective o = new Objective(keys.next("craft"), "craft_item", amount, null);
                objectives.add(o);
                docs.add(doc(o, "item", spec));
                return new ConvertedStage(Progress.AMOUNT, objectives, docs);
            }
            case "NPC" -> {
                String npc = npc(raw.get("npcID"), notes);
                Objective o = new Objective(keys.next("talk"), "talk_npc", 1, null);
                objectives.add(o);
                Map<String, Object> d = doc(o, "npc", npc);
                d.remove("amount");
                String line = dialog(Yaml.map(raw.get("msg")), notes, where);
                if (line != null) d.put("line", ltext(line));
                docs.add(d);
                return new ConvertedStage(Progress.NONE, objectives, docs);
            }
            case "ITEMS" -> {
                String npc = npc(raw.get("npcID"), notes);
                String line = dialog(Yaml.map(raw.get("msg")), notes, where);
                List<Object> stacks = Yaml.list(raw.get("items"));
                if (stacks.isEmpty()) throw new Refused("empty_stage", where + ": no item to bring");
                for (Object stack : stacks) {
                    Map<String, Object> serialized = Yaml.map(stack);
                    Map<String, Object> spec = item(serialized, where);
                    Objective o = new Objective(keys.next("deliver"), "deliver_item", Math.max(1, items.amount(serialized)), null);
                    objectives.add(o);
                    Map<String, Object> d = doc(o, "item", spec);
                    d.put("npc", npc);
                    if (line != null && objectives.size() == 1) d.put("line", ltext(line));
                    docs.add(d);
                }
                if (raw.get("customMessage") != null) notes.add(where + ": its custom message is not carried");
                return new ConvertedStage(Progress.NONE, objectives, docs);
            }
            case "CHAT" -> {
                String text = Yaml.string(raw.get("writeText"));
                if (text == null || !text.startsWith("/") || text.length() < 2) {
                    throw new Refused("unsupported_stage", where + ": writing \"" + text + "\" in the chat has no objective here, only a command does");
                }
                Objective o = new Objective(keys.next("command"), "execute_command", 1, null);
                objectives.add(o);
                Map<String, Object> d = doc(o, "command", text.substring(1));
                d.remove("amount");
                docs.add(d);
                return new ConvertedStage(Progress.NONE, objectives, docs);
            }
            default -> throw new Refused("unsupported_stage", where + ": ArtisanQuests has no objective of this kind");
        }
    }

    private static Map<String, Map<String, Object>> objects(Map<String, Object> raw, String where) {
        Map<String, Object> section = Yaml.map(raw.get("objects"));
        if (section.isEmpty()) throw new Refused("empty_stage", where + ": nothing to count");
        Map<String, Map<String, Object>> out = new LinkedHashMap<>();
        section.forEach((k, v) -> out.put(k, Yaml.map(v)));
        return out;
    }

    private static int amount(@Nullable Object raw, String where) {
        int amount = Yaml.integer(raw, 0);
        if (amount < 1) throw new Refused("bad_amount", where + ": amount " + raw);
        return amount;
    }

    /** {@code STONE}, {@code blockdata:minecraft:wheat[age=7]}, {@code tag:…} (refused); {@code |customname:} dropped. */
    private String block(@Nullable String raw, String where, QuestNotes notes) {
        if (raw == null) throw new Refused("unknown_block", where + ": no block");
        String value = raw;
        int name = value.lastIndexOf("|customname:");
        if (name >= 0) value = value.substring(0, name);
        String material;
        if (value.startsWith("tag:")) {
            throw new Refused("block_tag", where + ": a block tag (" + value.substring(4) + ") is not one material");
        } else if (value.startsWith("blockdata:")) {
            String data = value.substring("blockdata:".length());
            int state = data.indexOf('[');
            material = state >= 0 ? data.substring(0, state) : data;
            if (state >= 0) notes.add(where + ": the block state " + data.substring(state) + " is not checked any more");
        } else {
            material = value;
        }
        int ns = material.indexOf(':');
        if (ns >= 0) material = material.substring(ns + 1);
        material = material.toUpperCase(Locale.ROOT);
        if (!names.material(material)) throw new Refused("unknown_block", where + ": unknown block " + material);
        return material;
    }

    private Map<String, Object> item(Map<String, Object> serialized, String where) {
        if (serialized.isEmpty()) throw new Refused("unreadable_item", where + ": no item");
        try {
            Map<String, Object> spec = items.spec(serialized);
            if (spec == null || spec.isEmpty()) throw new IllegalArgumentException("empty");
            Map<String, Object> copy = new LinkedHashMap<>(spec);
            copy.remove("count");
            return copy;
        } catch (RuntimeException e) {
            throw new Refused("unreadable_item", where + ": an item cannot be read (" + e.getMessage() + ")");
        }
    }

    private static Map<String, Object> doc(Objective o, Object... params) {
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("key", o.key());
        d.put("type", o.type());
        for (int i = 0; i + 1 < params.length; i += 2) d.put((String) params[i], params[i + 1]);
        d.put("amount", o.amount());
        return d;
    }

    /**
     * BeautyQuests names an NPC {@code <plugin>#<id>} (an old file: the bare Citizens number).
     * Citizens NPC 12 becomes {@code citizens_12}, which ArtisanNpcs links to an NPC file holding
     * {@code citizens: 12}; a ZNPCsPlus NPC keeps its id.
     */
    static String npc(@Nullable Object raw, QuestNotes notes) {
        if (raw == null) throw new Refused("no_npc", "a stage names no NPC");
        String id = raw.toString().trim();
        int sep = id.indexOf('#');
        String plugin = sep < 0 ? "citizens" : id.substring(0, sep).toLowerCase(Locale.ROOT);
        String local = sep < 0 ? id : id.substring(sep + 1);
        String out = switch (plugin) {
            case "citizens" -> "citizens_" + local;
            case "znpcsplus", "znpcs" -> local.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9_-]", "_");
            default -> {
                notes.add("NPC " + id + ": ArtisanNpcs does not read " + plugin + " NPCs");
                yield (plugin + "_" + local).toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9_-]", "_");
            }
        };
        notes.npc(out, plugin.equals("citizens") ? local : null);
        return out;
    }

    /** A dialog's messages as one line said by the NPC; null without one. */
    private static @Nullable String dialog(Map<String, Object> section, QuestNotes notes, String where) {
        List<Object> messages = Yaml.list(section.get("msgs"));
        if (messages.isEmpty()) return null;
        List<String> lines = new ArrayList<>();
        boolean player = false;
        for (Object entry : messages) {
            Map<String, Object> message = Yaml.map(Yaml.map(entry).get("message"));
            String text = Yaml.string(message.get("text"));
            if (text == null || text.isBlank()) continue;
            if ("PLAYER".equals(message.get("sender"))) player = true;
            lines.add(LegacyText.toMiniMessage(text));
        }
        if (player) notes.add(where + ": the player's lines of the dialog are said by the NPC; a conversation can split them");
        return lines.isEmpty() ? null : String.join("\n", lines);
    }

    // --------------------------------------------------------------- rewards and requirements

    private Map<String, Object> message(String text) {
        return Map.of("send_message", Map.of("text", ltext(LegacyText.toMiniMessage(text))));
    }

    private List<Object> rewards(List<Object> raw, QuestNotes notes, String where) {
        List<Object> steps = new ArrayList<>();
        for (Object entry : raw) {
            Map<String, Object> reward = Yaml.map(entry);
            String id = Yaml.string(reward.get("id"));
            if (id == null) id = Yaml.string(reward.get("class"));
            switch (String.valueOf(id)) {
                case "commandReward" -> {
                    for (Object c : Yaml.list(reward.get("commands"))) {
                        Map<String, Object> command = Yaml.map(c);
                        String label = Yaml.string(command.get("label"));
                        if (label == null || label.isBlank()) continue;
                        if (label.startsWith("/")) label = label.substring(1);
                        Map<String, Object> args = new LinkedHashMap<>();
                        args.put("command", placeholders(label));
                        args.put("as", Boolean.TRUE.equals(command.get("console")) ? "console" : "player");
                        steps.add(Map.of("run_command", args));
                        if (Yaml.integer(command.get("delay"), 0) > 0) notes.add(where + ": the delay of /" + label + " is not carried");
                    }
                }
                case "itemReward" -> {
                    for (Object s : Yaml.list(reward.get("items"))) {
                        Map<String, Object> serialized = Yaml.map(s);
                        try {
                            Map<String, Object> spec = items.spec(serialized);
                            Map<String, Object> give = new LinkedHashMap<>();
                            give.put("material", spec.get("material"));
                            give.put("count", Math.max(1, items.amount(serialized)));
                            if (spec.get("title") != null) give.put("name", spec.get("title"));
                            if (spec.get("lore") != null) give.put("lore", spec.get("lore"));
                            if (Boolean.TRUE.equals(spec.get("enchanted"))) {
                                notes.add(where + ": the enchantments of a reward item " + spec.get("material") + " are not carried");
                            }
                            steps.add(Map.of("give_item", give));
                        } catch (RuntimeException e) {
                            notes.add(where + ": a reward item cannot be read (" + e.getMessage() + ")");
                        }
                    }
                }
                case "textReward" -> {
                    String text = Yaml.string(reward.get("text"));
                    if (text != null && !text.isBlank()) steps.add(message(text));
                }
                case "expReward" -> steps.add(Map.of("give_xp", Map.of("amount", Yaml.integer(reward.get("xp"), 0))));
                case "moneyReward" -> steps.add(Map.of("give_money", Map.of("amount", Yaml.number(reward.get("money")))));
                case "titleReward" -> {
                    Map<String, Object> title = Yaml.map(reward.get("title"));
                    Map<String, Object> args = new LinkedHashMap<>();
                    String main = Yaml.string(title.get("title"));
                    args.put("title", ltext(LegacyText.toMiniMessage(main != null ? main : "")));
                    String sub = Yaml.string(title.get("subtitle"));
                    if (sub != null) args.put("subtitle", ltext(LegacyText.toMiniMessage(sub)));
                    steps.add(Map.of("show_title", args));
                }
                case "permReward" -> {
                    for (Object p : Yaml.list(reward.get("perms"))) {
                        Map<String, Object> perm = Yaml.map(p);
                        String node = Yaml.string(perm.get("perm"));
                        if (node == null) continue;
                        boolean take = Boolean.TRUE.equals(perm.get("take"));
                        Map<String, Object> args = new LinkedHashMap<>();
                        args.put("command", "lp user {player} permission " + (take ? "unset " : "set ") + node);
                        args.put("as", "console");
                        steps.add(Map.of("run_command", args));
                        notes.add(where + ": the permission " + node + " is given by a LuckPerms command; check it");
                    }
                }
                default -> notes.add(where + ": the reward " + id + " is not carried");
            }
        }
        return steps;
    }

    private List<Object> requirements(List<Object> raw, QuestNotes notes) {
        List<Object> out = new ArrayList<>();
        for (Object entry : raw) {
            Map<String, Object> req = Yaml.map(entry);
            String id = String.valueOf(req.get("id"));
            switch (id) {
                case "permissionRequired" -> {
                    for (Object p : Yaml.list(req.get("permissions"))) {
                        String perm = String.valueOf(p);
                        if (perm.startsWith("-")) {
                            out.add(Map.of("not", Map.of("has_permission", perm.substring(1))));
                        } else {
                            out.add(Map.of("has_permission", perm));
                        }
                    }
                }
                case "levelRequired" -> {
                    String comparison = String.valueOf(req.getOrDefault("comparison", "GREATER_OR_EQUAL"));
                    if (comparison.equals("GREATER_OR_EQUAL")) {
                        out.add(Map.of("has_level", Yaml.integer(req.get("target"), 0)));
                    } else {
                        notes.add("the level requirement (" + comparison + " " + req.get("target") + ") is not carried");
                    }
                }
                case "moneyRequired" -> out.add(Map.of("has_money", Yaml.number(req.get("money"))));
                case "placeholderRequired" -> {
                    String placeholder = Yaml.string(req.get("placeholder"));
                    String value = Yaml.string(req.get("value"));
                    if (placeholder != null && value != null && "EQUALS".equals(String.valueOf(req.getOrDefault("comparison", "EQUALS")))) {
                        String ph = placeholder.startsWith("%") ? placeholder : "%" + placeholder + "%";
                        out.add(Map.of("placeholder_equals", Map.of("placeholder", ph, "value", value)));
                    } else {
                        notes.add("the placeholder requirement " + placeholder + " is not carried");
                    }
                }
                case "questRequired" -> {
                    int quest = Yaml.integer(req.get("questID"), -1);
                    out.add(Map.of("placeholder_equals", Map.of(
                            "placeholder", "%quests_completed_" + GROUP + ":quest_" + quest + "%", "value", "true")));
                    notes.add("its requirement \"quest " + quest + " done\" reads the group " + GROUP + "; check it if that quest is repeatable");
                }
                default -> notes.add("the requirement " + id + " is not carried");
            }
        }
        return out;
    }

    private static void options(Map<String, Object> yaml, QuestNotes notes) {
        if (yaml.containsKey("timer")) notes.add("its cooldown (" + yaml.get("timer") + " min) is not carried");
        if (Boolean.TRUE.equals(yaml.get("auto"))) notes.add("it started on its own; give it with a Trigger");
        if (Boolean.TRUE.equals(yaml.get("failOnDeath"))) notes.add("\"fails on death\" is not carried");
        if (yaml.containsKey("pool")) notes.add("its quest pool is not carried");
        if (yaml.containsKey("cancelActions")) notes.add("its cancel rewards are not carried");
    }

    /** BeautyQuests' player placeholder in a command, as Artisan writes it. */
    private static String placeholders(String text) {
        return text.replace("{PLAYER}", "{player}").replace("{player_name}", "{player}");
    }

    private Map<String, Object> ltext(String text) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put(lang, text);
        return out;
    }

    // ------------------------------------------------------------------ helpers

    /**
     * A ULID-shaped id derived from {@code seed}: the same BeautyQuests quest always gets the same
     * uid, so a second run finds what the first wrote.
     */
    static String uid(String seed) {
        final char[] alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ".toCharArray();
        byte[] hash;
        try {
            hash = MessageDigest.getInstance("SHA-256").digest(("beautyquests:" + seed).getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
        char[] out = new char[26];
        // First char ≤ 7, as a ULID's time part.
        out[0] = alphabet[hash[0] & 7];
        for (int i = 1; i < 26; i++) out[i] = alphabet[hash[i] & 31];
        return new String(out);
    }

    private static final class Counter {
        private final Map<String, Integer> next = new LinkedHashMap<>();

        String next(String prefix) {
            int n = next.merge(prefix, 1, Integer::sum);
            return prefix + "_" + n;
        }
    }

    /** What a quest leaves out, prefixed with the quest; and the Citizens NPCs it names. */
    static final class QuestNotes {
        final List<String> lines = new ArrayList<>();
        final Map<String, String> citizens = new LinkedHashMap<>();
        private final int id;
        private final @Nullable String name;

        QuestNotes(int id, @Nullable String name) {
            this.id = id;
            this.name = name;
        }

        String label() {
            return "quest " + id + (name != null ? " (" + name.replaceAll("[§&][0-9a-fk-orA-FK-OR]", "") + ")" : "");
        }

        void add(String note) {
            lines.add(label() + ": " + note);
        }

        void npc(String id, @Nullable String citizensNumber) {
            if (citizensNumber != null) citizens.put(id, citizensNumber);
        }
    }

    static final class Refused extends RuntimeException {
        final String code;

        Refused(String code, String message) {
            super(message);
            this.code = code;
        }
    }
}
