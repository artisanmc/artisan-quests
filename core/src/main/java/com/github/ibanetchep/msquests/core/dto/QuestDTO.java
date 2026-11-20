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
        String questUid,
        // Key of the stage the quest stood on at its last save; null on a row never saved since the
        // column exists, or when no stage was left. The stages before it stay behind the actor
        // whatever the content becomes (see QuestFactory#buildQuest).
        String reachedStage
) {
    public QuestDTO(UUID id, String questKey, String groupKey, UUID actorId, QuestStatus status, Long completedAt,
                    Long createdAt, Long updatedAt, Map<String, QuestObjectiveDTO> objectives, String questUid) {
        this(id, questKey, groupKey, actorId, status, completedAt, createdAt, updatedAt, objectives, questUid, null);
    }

    public QuestDTO(UUID id, String questKey, String groupKey, UUID actorId, QuestStatus status, Long completedAt,
                    Long createdAt, Long updatedAt, Map<String, QuestObjectiveDTO> objectives) {
        this(id, questKey, groupKey, actorId, status, completedAt, createdAt, updatedAt, objectives, null, null);
    }

    public QuestDTO {
        objectives = objectives == null ? new HashMap<>() : objectives;
    }
}