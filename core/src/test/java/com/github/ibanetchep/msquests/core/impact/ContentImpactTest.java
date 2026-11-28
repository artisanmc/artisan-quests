package com.github.ibanetchep.msquests.core.impact;

import com.github.ibanetchep.msquests.core.dto.QuestConfigDTO;
import com.github.ibanetchep.msquests.core.dto.QuestGroupConfigDTO;
import com.github.ibanetchep.msquests.core.dto.QuestObjectiveConfigDTO;
import com.github.ibanetchep.msquests.core.dto.QuestStageConfigDTO;
import com.github.ibanetchep.msquests.core.impact.ImpactSource.ObjectiveCount;
import com.github.ibanetchep.msquests.core.impact.ImpactSource.QuestCount;
import com.github.ibanetchep.msquests.core.repository.KeyChange;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** One test per kind of change of {@code QuestContentChangeTest}: what the author is told before publishing. */
class ContentImpactTest {

    private final List<QuestCount> quests = new ArrayList<>();
    private final List<ObjectiveCount> objectives = new ArrayList<>();
    private final Map<String, Integer> reaching = new HashMap<>();
    private final ImpactSource source = new ImpactSource() {
        @Override
        public List<QuestCount> quests(String groupKey) {
            return groupKey.equals("story") ? quests : List.of();
        }

        @Override
        public List<ObjectiveCount> objectives(String groupKey) {
            return groupKey.equals("story") ? objectives : List.of();
        }

        @Override
        public int reaching(String groupKey, String questKey, String objectiveKey, int target) {
            return reaching.getOrDefault(questKey + "/" + objectiveKey + ">=" + target, 0);
        }
    };

    private List<Impact> impacts(QuestGroupConfigDTO before, QuestGroupConfigDTO after, KeyChange... changes) {
        return ContentImpact.of(before, after, List.of(changes), Set.of(), source);
    }

    private static Impact only(List<Impact> impacts) {
        assertEquals(1, impacts.size(), impacts.toString());
        return impacts.get(0);
    }

    @Test
    void nothingIsSaidWhenNothingInProgressIsTouched() {
        QuestGroupConfigDTO before = story(quest("mine", stage("dig", objective("stone", 100))));
        assertEquals(List.of(), impacts(before, story(quest("mine", stage("dig", objective("stone", 50))))));

        quests.add(new QuestCount("mine", "dig", 12, 0));
        assertEquals(List.of(), impacts(before, before), "the same content");
        assertEquals(List.of(), impacts(null, before), "a new group");
    }

    @Test
    void aRemovedQuestIsALossForThoseWhoHaveItInProgress() {
        quests.add(new QuestCount("mine", "dig", 12, 0));
        quests.add(new QuestCount("mine", null, 0, 30));

        Impact impact = only(impacts(story(quest("mine", stage("dig", objective("stone", 100))), quest("fish")), story(quest("fish"))));

        assertTrue(impact.loss());
        assertEquals("quest.removed", impact.code());
        assertEquals(12, impact.args().get("n"));
        assertEquals(30, impact.args().get("finished"));
    }

    @Test
    void aKeyChangedByHandIsNamedAsSuchAndFollowsOnceOldKeyIsWritten() {
        quests.add(new QuestCount("mine", "dig", 12, 0));
        QuestGroupConfigDTO before = story(quest("mine", stage("dig", objective("stone", 100))));
        QuestGroupConfigDTO after = story(quest("excavate", stage("dig", objective("stone", 100))));

        Impact byHand = only(impacts(before, after));
        assertTrue(byHand.loss());
        assertEquals("quest.replaced", byHand.code());
        assertEquals("excavate", byHand.args().get("new"));
        assertTrue(ImpactMessages.render(byHand, "en").contains("old_key: mine"), ImpactMessages.render(byHand, "en"));

        Impact kept = only(impacts(before, after, new KeyChange.Quest("story", "mine", "excavate")));
        assertFalse(kept.loss());
        assertEquals("quest.renamed", kept.code());
        assertEquals(12, kept.args().get("n"));
    }

    @Test
    void aQuestClaimedByAnotherGroupIsNotLost() {
        quests.add(new QuestCount("mine", "dig", 12, 0));
        QuestGroupConfigDTO before = story(quest("mine", stage("dig", objective("stone", 100))), quest("fish"));

        assertEquals(List.of(), ContentImpact.of(before, story(quest("fish")), List.of(), Set.of("story/mine"), source));
    }

    @Test
    void aDeletedGroupIsALossUnlessAnotherFileSaysItWasIt() {
        quests.add(new QuestCount("mine", "dig", 12, 0));
        quests.add(new QuestCount("fish", null, 3, 0));
        QuestGroupConfigDTO before = story(quest("mine"), quest("fish"));

        Impact impact = only(ContentImpact.of(before, null, List.of(), Set.of(), source));
        assertTrue(impact.loss());
        assertEquals(15, impact.args().get("n"));
        assertEquals(List.of(), ContentImpact.of(before, null, List.of(), Set.of("story"), source));

        QuestGroupConfigDTO renamed = new QuestGroupConfigDTO("saga", null, null, before.quests(), null, null, null, null, null, "player", null, null, null, null, null, null);
        Impact follows = only(ContentImpact.of(null, renamed, List.of(new KeyChange.Group("story", "saga")), Set.of(), source));
        assertFalse(follows.loss());
        assertEquals("group.renamed", follows.code());
    }

    @Test
    void anObjectiveWhoseKeyOrTypeChangesStartsFromZeroUnlessItSaysWhatItWas() {
        quests.add(new QuestCount("mine", "dig", 12, 0));
        objectives.add(new ObjectiveCount("mine", "stone", "block_break", 7, 2));
        QuestGroupConfigDTO before = story(quest("mine", stage("dig", objective("stone", "block_break", 100, null))));

        Impact replaced = only(impacts(before, story(quest("mine", stage("dig", objective("cobble", "block_break", 100, null))))));
        assertTrue(replaced.loss());
        assertEquals("objective.replaced", replaced.code());
        assertEquals(9, replaced.args().get("n"));

        assertEquals(List.of(), impacts(before, story(quest("mine", stage("dig", objective("cobble", "block_break", 100, "stone"))))),
                "old_key: the progress follows, nothing to say");

        Impact type = only(impacts(before, story(quest("mine", stage("dig", objective("stone", "kill_entity", 100, null))))));
        assertTrue(type.loss());
        assertEquals("objective.type_changed", type.code());
    }

    @Test
    void aRaisedOrLoweredTargetIsNeverALoss() {
        quests.add(new QuestCount("mine", "dig", 12, 0));
        objectives.add(new ObjectiveCount("mine", "stone", "test", 7, 2));
        reaching.put("mine/stone>=50", 4);
        QuestGroupConfigDTO before = story(quest("mine", stage("dig", objective("stone", 100))));

        Impact raised = only(impacts(before, story(quest("mine", stage("dig", objective("stone", 200))))));
        assertFalse(raised.loss());
        assertEquals("objective.target_raised", raised.code());
        assertEquals(7, raised.args().get("n"));
        assertEquals(2, raised.args().get("kept"));

        Impact lowered = only(impacts(before, story(quest("mine", stage("dig", objective("stone", 50))))));
        assertFalse(lowered.loss());
        assertEquals("objective.target_lowered", lowered.code());
        assertEquals(4, lowered.args().get("n"));
    }

    @Test
    void addedAndRemovedStagesAndObjectivesSayWhoIsConcerned() {
        quests.add(new QuestCount("mine", "dig", 5, 0));
        quests.add(new QuestCount("mine", "smelt", 3, 0));
        objectives.add(new ObjectiveCount("mine", "stone", "test", 4, 3));
        QuestGroupConfigDTO before = story(quest("mine", stage("dig", objective("stone", 100)), stage("smelt", objective("iron", 10))));

        Impact added = only(impacts(before, story(quest("mine",
                stage("dig", objective("stone", 100), objective("coal", 5)), stage("smelt", objective("iron", 10))))));
        assertEquals("objective.added", added.code());
        assertEquals(5, added.args().get("n"));
        assertEquals(3, added.args().get("past"));

        Impact stage = only(impacts(before, story(quest("mine",
                stage("dig", objective("stone", 100)), stage("wash", objective("water", 1)), stage("smelt", objective("iron", 10))))));
        assertEquals("stage.added", stage.code());
        assertEquals(3, stage.args().get("n"), "those on smelt are past the new stage");

        List<Impact> removed = impacts(before, story(quest("mine", stage("dig", objective("stone", 100)))));
        assertEquals(List.of("objective.removed", "stage.removed_last"), removed.stream().map(Impact::code).toList());
        assertEquals(3, removed.get(1).args().get("n"));
        assertTrue(removed.stream().noneMatch(Impact::loss));
    }

    @Test
    void aResetAddedToAGroupWithoutOneIsSaid() {
        quests.add(new QuestCount("mine", null, 0, 40));
        QuestGroupConfigDTO before = story(quest("mine"));
        QuestGroupConfigDTO after = new QuestGroupConfigDTO("story", null, null, before.quests(), null, null, "0 0 * * *", null, null, "player", null, null, null, null, null, null);

        assertEquals("group.reset_added", only(impacts(before, after)).code());
    }

    @Test
    void everyCodeHasItsSentenceInBothLanguagesAndNoPlaceholderIsLeft() {
        assertEquals(ImpactMessages.codes("en"), ImpactMessages.codes("fr"));
        Map<String, Object> args = new HashMap<>();
        for (String name : List.of("group", "from", "to", "quest", "new", "objective", "stage")) args.put(name, name);
        for (String name : List.of("n", "finished", "kept", "past", "active")) args.put(name, 2);
        for (String lang : List.of("en", "fr")) {
            for (String code : ImpactMessages.codes(lang)) {
                String sentence = ImpactMessages.render(new Impact(true, code, args), lang);
                assertFalse(sentence.matches(".*[\\[\\]{}|].*"), code + " (" + lang + "): " + sentence);
            }
        }
        assertEquals("Quest 'mine': stage 'dig' is removed. 1 player on it moves to the next stage at their next load.",
                ImpactMessages.render(Impact.notice("stage.removed", "quest", "mine", "stage", "dig", "n", 1), "en"));
    }

    private static QuestGroupConfigDTO story(QuestConfigDTO... quests) {
        return new QuestGroupConfigDTO("story", null, null, List.of(quests), null, null, null, null, null, "player", null, null, null, null, null, null);
    }

    private static QuestConfigDTO quest(String key, QuestStageConfigDTO... stages) {
        return new QuestConfigDTO(key, key, null, null, null, List.of(), List.of(stages), null);
    }

    private static QuestStageConfigDTO stage(String key, QuestObjectiveConfigDTO... objectives) {
        return new QuestStageConfigDTO(key, key, null, List.of(objectives));
    }

    private static QuestObjectiveConfigDTO objective(String key, int amount) {
        return objective(key, "test", amount, null);
    }

    private static QuestObjectiveConfigDTO objective(String key, String type, int amount, String oldKey) {
        Map<String, Object> params = new HashMap<>();
        params.put("amount", amount);
        if (oldKey != null) params.put("old_key", oldKey);
        return new QuestObjectiveConfigDTO(key, type, params);
    }
}
