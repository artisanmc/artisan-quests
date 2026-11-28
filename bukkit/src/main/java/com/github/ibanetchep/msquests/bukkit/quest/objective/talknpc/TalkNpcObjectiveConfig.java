package com.github.ibanetchep.msquests.bukkit.quest.objective.talknpc;

import com.github.ibanetchep.msquests.bukkit.quest.objective.NpcBound;
import com.github.ibanetchep.msquests.bukkit.quest.objective.ObjectiveTypes;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveConfigDTO;
import com.github.ibanetchep.msquests.core.lang.Translator;
import com.github.ibanetchep.msquests.core.quest.config.QuestObjectiveConfig;
import com.github.ibanetchep.msquests.core.quest.config.annotation.AtLeastOneOfFields;
import com.github.ibanetchep.msquests.core.quest.config.annotation.ConfigField;
import com.github.ibanetchep.msquests.core.quest.config.annotation.ObjectiveType;
import org.jetbrains.annotations.Nullable;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Talk to an NPC: {@code npc}, and the {@code conversation} it plays, or the {@code line} it says
 * (neither: the click is enough).
 */
@ObjectiveType(ObjectiveTypes.TALK_NPC)
@AtLeastOneOfFields({"npc"})
public class TalkNpcObjectiveConfig extends QuestObjectiveConfig implements NpcBound {

    @ConfigField(name = "npc")
    private final String npc;

    @ConfigField(name = "conversation")
    private final @Nullable String conversation;

    /** A text or {@code {lang: text}}: no {@code @ConfigField}, whose schema only knows strings. */
    private final @Nullable Object line;

    public TalkNpcObjectiveConfig(QuestObjectiveConfigDTO dto) {
        super(dto);
        npc = NpcBound.text(dto.params().get("npc"));
        conversation = NpcBound.text(dto.params().get("conversation"));
        line = NpcBound.line(dto.params().get("line"));
    }

    @Override
    public QuestObjectiveConfigDTO toDTO() {
        Map<String, Object> params = new LinkedHashMap<>();
        if (npc != null) params.put("npc", npc);
        if (conversation != null) params.put("conversation", conversation);
        if (line != null) params.put("line", line);
        return new QuestObjectiveConfigDTO(getKey(), getType(), params);
    }

    @Override
    public @Nullable String getNpc() {
        return npc;
    }

    @Override
    public @Nullable String getConversation() {
        return conversation;
    }

    @Override
    public @Nullable Object getLine() {
        return line;
    }

    @Override
    public Map<String, String> getPlaceholders(Translator translator) {
        return Map.of("npc", npc != null ? npc : "");
    }

    /** Talking once completes it. */
    @Override
    public int getTarget() {
        return 1;
    }
}
