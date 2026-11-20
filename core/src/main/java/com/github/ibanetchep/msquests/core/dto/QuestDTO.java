package com.github.ibanetchep.msquests.core.dto;

import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public record QuestDTO(
        UUID id,
        String questKey,
        String groupKey,
        UUID actorId,
        QuestStatus status,
        Long completedAt,
        Long createdAt,
        Long updatedAt,
        Map<String, QuestObjectiveDTO> objectives,
        // The uid an older quest_group Document still carries, recorded on the row for the previous
        // jar; null otherwise. Rows are resolved by (groupKey, questKey).
        String questUid
) {
    public QuestDTO(UUID id, String questKey, String groupKey, UUID actorId, QuestStatus status, Long completedAt,
                    Long createdAt, Long updatedAt, Map<String, QuestObjectiveDTO> objectives) {
        this(id, questKey, groupKey, actorId, status, completedAt, createdAt, updatedAt, objectives, null);
    }

    public QuestDTO {
        objectives = objectives == null ? new HashMap<>() : objectives;
    }
}