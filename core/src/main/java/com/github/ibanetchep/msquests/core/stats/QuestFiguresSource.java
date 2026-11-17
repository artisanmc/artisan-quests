package com.github.ibanetchep.msquests.core.stats;

import java.util.Collection;
import java.util.List;

/** Where {@link QuestFigures} reads its rows: the quest tables. Blocking, so never on a game thread. */
public interface QuestFiguresSource {

    /** Every quest row of these quest uids, whatever its status. */
    List<QuestFigures.QuestRow> quests(Collection<String> questUids);

    /** The stages of the quests in progress of these quest uids. */
    List<QuestFigures.StageRow> stages(Collection<String> questUids);
}
