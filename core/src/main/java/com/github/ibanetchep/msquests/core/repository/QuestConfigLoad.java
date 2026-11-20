package com.github.ibanetchep.msquests.core.repository;

import com.github.ibanetchep.msquests.core.dto.QuestGroupConfigDTO;

import java.util.List;
import java.util.Map;

/**
 * Outcome of reading every quest group file: the groups that parsed, and one message per file
 * that did not. A reload uses the failures to refuse the whole new state instead of silently
 * dropping the broken groups. {@code renames} are the former names of the groups that parsed:
 * the stored rows are moved onto the current keys before the groups are used.
 */
public record QuestConfigLoad(Map<String, QuestGroupConfigDTO> groups, List<String> failures,
                              List<StoredRename> renames) {

    public QuestConfigLoad {
        groups = Map.copyOf(groups);
        failures = List.copyOf(failures);
        renames = List.copyOf(renames);
    }

    public QuestConfigLoad(Map<String, QuestGroupConfigDTO> groups, List<String> failures) {
        this(groups, failures, List.of());
    }

    public boolean hasFailures() {
        return !failures.isEmpty();
    }
}
