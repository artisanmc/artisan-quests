package com.github.ibanetchep.msquests.core.stats;

import java.util.Collection;
import java.util.List;

/** Where {@link QuestFigures} reads its rows: the quest tables. Blocking, so never on a game thread. */
public interface QuestFiguresSource {

    /** Every row of these quests of the group, whatever its status. */
    List<QuestFigures.QuestRow> quests(String groupKey, Collection<String> questKeys);

    /** The stages of the rows in progress of these quests of the group. */
    List<QuestFigures.StageRow> stages(String groupKey, Collection<String> questKeys);
}
