package com.github.ibanetchep.msquests.core.migration;

import org.jetbrains.annotations.Nullable;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * What the conversion of {@code quests/*.yml} to {@code quest_group} Documents decided, written
 * to {@code migration/map.yaml}: the groups and quests converted, and the stage each objective
 * key belongs to. The copy of {@code msquests_*} into {@code artisan_quests_*} reads it to know
 * which rows still have a quest and to give each objective row its {@code stage_key}. A
 * {@code uid} is only there when a conversion made before keys became the identity gave one:
 * it is kept, and recorded on the copied rows, so the Documents that carry it still match.
 */
public record MigrationMap(Map<String, Group> groups) {

    public MigrationMap {
        groups = Map.copyOf(groups);
    }

    public static MigrationMap empty() {
        return new MigrationMap(Map.of());
    }

    /** @param quests by quest key, in group order */
    public record Group(@Nullable String uid, Map<String, Quest> quests) {
        public Group {
            quests = java.util.Collections.unmodifiableMap(new LinkedHashMap<>(quests));
        }
    }

    /** @param objectiveStages objective key → key of the stage holding it */
    public record Quest(@Nullable String uid, Map<String, String> objectiveStages) {
        public Quest {
            objectiveStages = java.util.Collections.unmodifiableMap(new LinkedHashMap<>(objectiveStages));
        }
    }

    public @Nullable Group group(String groupKey) {
        return groups.get(groupKey);
    }

    public @Nullable Quest quest(String groupKey, String questKey) {
        Group group = groups.get(groupKey);
        return group != null ? group.quests().get(questKey) : null;
    }

    public boolean isEmpty() {
        return groups.isEmpty();
    }
}
