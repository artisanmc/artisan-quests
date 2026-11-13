package com.github.ibanetchep.msquests.bukkit.quest.objective.deliveritem;

import com.github.ibanetchep.msquests.bukkit.quest.objective.ItemTarget;
import com.github.ibanetchep.msquests.bukkit.quest.objective.NpcBound;
import com.github.ibanetchep.msquests.bukkit.quest.objective.ObjectiveTypes;
import org.jetbrains.annotations.Nullable;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveConfigDTO;
import com.github.ibanetchep.msquests.core.lang.Translator;
import com.github.ibanetchep.msquests.core.quest.config.QuestObjectiveConfig;
import com.github.ibanetchep.msquests.core.quest.config.annotation.AtLeastOneOfFields;
import com.github.ibanetchep.msquests.core.quest.config.annotation.ConfigField;
import com.github.ibanetchep.msquests.core.quest.config.annotation.ObjectiveType;

import java.util.LinkedHashMap;
import java.util.Map;

@ObjectiveType(ObjectiveTypes.DELIVER_ITEM)
@AtLeastOneOfFields({"item", "material", "itemKey"})
public class DeliverItemObjectiveConfig extends QuestObjectiveConfig implements NpcBound {

    /** {@code item} + {@code match}, or the legacy {@code material}. */
    @ConfigField(name = "item")
    private final ItemTarget item;

    @ConfigField(name = "itemKey")
    private String itemKey;

    @ConfigField(name = "amount")
    private int amount = 1;

    /** The NPC the items are brought to; none: delivered from a menu ({@code msquests:contribute}). */
    @ConfigField(name = "npc")
    private final @Nullable String npc;

    @ConfigField(name = "conversation")
    private final @Nullable String conversation;

    /** Played by the NPC while the player does not carry the whole amount. */
    @ConfigField(name = "missing")
    private final @Nullable String missing;

    public DeliverItemObjectiveConfig(QuestObjectiveConfigDTO dto) {
        super(dto);
        item = ItemTarget.read(dto.params(), "material");
        npc = NpcBound.text(dto.params().get("npc"));
        conversation = NpcBound.text(dto.params().get("conversation"));
        missing = NpcBound.text(dto.params().get("missing"));

        if(dto.params().containsKey("amount")) {
            amount = (int) dto.params().get("amount");
        }

        if(dto.params().containsKey("itemKey")) {
            itemKey = dto.params().get("itemKey").toString();
        }
    }

    @Override
    public QuestObjectiveConfigDTO toDTO() {
        Map<String, Object> params = new LinkedHashMap<>();
        item.write(params);
        params.put("amount", amount);
        if (itemKey != null) params.put("itemKey", itemKey);
        if (npc != null) params.put("npc", npc);
        if (conversation != null) params.put("conversation", conversation);
        if (missing != null) params.put("missing", missing);
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
    public @Nullable String getMissingConversation() {
        return missing;
    }

    public int getAmount() {
        return amount;
    }

    public ItemTarget getItem() {
        return item;
    }

    public String getItemKey() {
        return itemKey;
    }

    @Override
    public Map<String, String> getPlaceholders(Translator translator) {
        return Map.of(
                "item_key", itemKey != null ? itemKey : "",
                "material", item.placeholder(),
                "amount", String.valueOf(amount)
        );
    }
    @Override
    public int getTarget() {
        return amount;
    }
}
