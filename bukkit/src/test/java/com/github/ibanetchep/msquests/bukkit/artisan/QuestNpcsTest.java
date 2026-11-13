package com.github.ibanetchep.msquests.bukkit.artisan;

import com.github.ibanetchep.msquests.bukkit.BukkitQuestsPlugin;
import com.github.ibanetchep.msquests.bukkit.artisan.ArtisanFixtures.TestActor;
import com.github.ibanetchep.msquests.bukkit.lang.BukkitTranslator;
import com.github.ibanetchep.msquests.bukkit.quest.objective.talknpc.TalkNpcObjective;
import com.github.ibanetchep.msquests.bukkit.quest.objective.talknpc.TalkNpcObjectiveConfig;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveConfigDTO;
import com.github.ibanetchep.msquests.core.quest.actor.Quest;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStage;
import com.github.ibanetchep.msquests.core.quest.actor.QuestStatus;
import com.github.ibanetchep.msquests.core.quest.config.QuestConfig;
import com.github.ibanetchep.msquests.core.quest.config.QuestGiver;
import com.github.ibanetchep.msquests.core.quest.config.QuestStageConfig;
import com.github.ibanetchep.msquests.core.quest.config.group.QuestGroupConfig;
import com.github.ibanetchep.msquests.core.quest.objective.Flow;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjective;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjectiveStatus;
import com.github.ibanetchep.msquests.core.quest.result.QuestStartResult;
import com.github.ibanetchep.msquests.core.registry.PlayerProfileRegistry;
import com.github.ibanetchep.msquests.core.registry.QuestActorRegistry;
import com.github.ibanetchep.msquests.core.registry.QuestConfigRegistry;
import com.github.ibanetchep.msquests.core.service.QuestDistributionService;
import com.github.ibanetchep.msquests.core.service.QuestProgressService;
import org.bukkit.entity.Player;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class QuestNpcsTest {

    private final UUID playerId = UUID.randomUUID();

    private QuestGroupConfig story;
    private TestActor actor;
    private QuestDistributionService distribution;
    private QuestProgressService progress;
    private QuestNpcs npcs;
    private Player player;

    @BeforeEach
    void setUp() {
        story = ArtisanFixtures.group("story", "player");
        QuestConfigRegistry configs = new QuestConfigRegistry();
        configs.registerQuestGroupConfig(story);
        actor = new TestActor(playerId, "Steve", "player");
        QuestActorRegistry actors = new QuestActorRegistry();
        actors.registerActor(actor);
        distribution = mock(QuestDistributionService.class);
        when(distribution.canStartQuest(any(), any(), any(), any())).thenReturn(QuestStartResult.SUCCESS);
        progress = mock(QuestProgressService.class);

        BukkitQuestsPlugin plugin = mock(BukkitQuestsPlugin.class);
        when(plugin.getQuestConfigRegistry()).thenReturn(configs);
        when(plugin.getQuestActorRegistry()).thenReturn(actors);
        when(plugin.getPlayerProfileRegistry()).thenReturn(new PlayerProfileRegistry());
        when(plugin.getQuestDistributionService()).thenReturn(distribution);
        when(plugin.getQuestProgressService()).thenReturn(progress);
        when(plugin.getTranslator()).thenReturn(mock(BukkitTranslator.class));
        npcs = new QuestNpcs(plugin);

        player = mock(Player.class);
        when(player.getUniqueId()).thenReturn(playerId);
    }

    /** A quest of the group whose only objective is to talk to {@code npc}. */
    private QuestConfig talkQuest(String key, String npc, String conversation) {
        QuestConfig config = new QuestConfig(key, "Quest " + key, "", 0L);
        config.setGroup(story);
        QuestStageConfig stage = new QuestStageConfig("stage_1", "Stage 1", Flow.PARALLEL);
        stage.addObjective(new TalkNpcObjectiveConfig(new QuestObjectiveConfigDTO("talk", "talk_npc",
                conversation == null ? Map.of("npc", npc) : Map.of("npc", npc, "conversation", conversation))));
        config.addStage(stage);
        story.addQuest(config);
        return config;
    }

    private Quest start(QuestConfig config) {
        Date now = new Date();
        Quest quest = new Quest(UUID.randomUUID(), config, actor, QuestStatus.IN_PROGRESS, null, now, now);
        QuestStageConfig stageConfig = config.getStages().get("stage_1");
        QuestStage stage = new QuestStage(quest, stageConfig);
        stage.addObjective(new TalkNpcObjective(stage, (TalkNpcObjectiveConfig) stageConfig.getObjectives().get("talk"),
                0, QuestObjectiveStatus.IN_PROGRESS));
        quest.addStage(stage);
        actor.addQuest(quest);
        return quest;
    }

    @Test
    void anObjectiveInProgressNamesItsNpcAndConversation() {
        start(talkQuest("apples", "bruno", "bruno_asks"));

        List<Map<String, Object>> rows = npcs.rows(playerId, player, "bruno");

        assertEquals(1, rows.size());
        Map<String, Object> row = rows.get(0);
        assertEquals("objective", row.get("kind"));
        assertEquals("story:apples:talk", row.get("id"));
        assertEquals("bruno", row.get("npc"));
        assertEquals("apples", row.get("quest"));
        assertEquals("talk", row.get("objective"));
        assertEquals("talk_npc", row.get("objective_type"));
        assertEquals(true, row.get("ready"));
        assertEquals("bruno_asks", row.get("conversation"));
        assertFalse(row.containsValue(null));
    }

    @Test
    void theNpcFilterIsOptional() {
        start(talkQuest("apples", "bruno", null));
        start(talkQuest("letters", "anna", null));

        assertEquals(2, npcs.rows(playerId, player, null).size());
        assertEquals(1, npcs.rows(playerId, player, "anna").size());
        assertTrue(npcs.rows(playerId, player, "nobody").isEmpty());
    }

    @Test
    void aGiverOffersItsQuestOnlyWhileItMayStart() {
        QuestConfig config = talkQuest("apples", "anna", null);
        config.setGiver(new QuestGiver("bruno", "bruno_offer"));

        Map<String, Object> row = npcs.rows(playerId, player, "bruno").get(0);
        assertEquals("offer", row.get("kind"));
        assertEquals("story:apples", row.get("id"));
        assertEquals("bruno_offer", row.get("conversation"));
        assertEquals("", row.get("objective"));
        assertFalse(row.containsValue(null));

        when(distribution.canStartQuest(any(), eq(config), any(), any())).thenReturn(QuestStartResult.ALREADY_ACTIVE);
        assertTrue(npcs.rows(playerId, player, "bruno").isEmpty());
    }

    @Test
    void objectivesComeBeforeOffers() {
        talkQuest("a_offer", "anna", null).setGiver(new QuestGiver("bruno", null));
        start(talkQuest("z_running", "bruno", null));

        List<Map<String, Object>> rows = npcs.rows(playerId, player, "bruno");

        assertEquals(List.of("objective", "offer"), rows.stream().map(row -> row.get("kind")).toList());
    }

    @Test
    void advanceCompletesATalkObjective() {
        Quest quest = start(talkQuest("apples", "bruno", null));
        QuestObjective objective = quest.getActiveObjectives().get(0);

        assertTrue(npcs.advance(player, quest, "talk"));

        verify(progress).progressObjective(objective, 1, null);
    }

    @Test
    void advanceIgnoresAnUnknownObjective() {
        Quest quest = start(talkQuest("apples", "bruno", null));

        assertFalse(npcs.advance(player, quest, "nope"));

        verifyNoInteractions(progress);
    }
}
