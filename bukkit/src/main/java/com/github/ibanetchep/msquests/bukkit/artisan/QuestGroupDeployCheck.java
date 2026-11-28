package com.github.ibanetchep.msquests.bukkit.artisan;

import com.github.ibanetchep.msquests.bukkit.document.QuestGroupChangeCheck;
import net.artisanmc.modules.api.document.DocumentChangeCheck;
import net.artisanmc.modules.api.document.DocumentKindDeclaration;

import java.util.ArrayList;
import java.util.List;

/**
 * Hands {@link QuestGroupChangeCheck} to Artisan's Deploy review ({@code DocumentChangeCheck},
 * Artisan API 1.9.0). A class of its own: it names types an older Artisan does not have, so the
 * module only touches it once {@code isCompatibleWith("1.9.0")} said yes.
 */
final class QuestGroupDeployCheck {

    private QuestGroupDeployCheck() {
    }

    /** {@code kind}, whose changed files say what they do to the quests in progress. */
    static DocumentKindDeclaration on(DocumentKindDeclaration kind, QuestGroupChangeCheck check) {
        return kind.withChangeCheck(change -> findings(check, change));
    }

    static List<DocumentChangeCheck.Finding> findings(QuestGroupChangeCheck check, DocumentChangeCheck.Change change) {
        List<DocumentChangeCheck.Finding> out = new ArrayList<>();
        for (QuestGroupChangeCheck.Finding finding : check.check(
                change.id(), change.before(), change.after(), change.others(), change.lang())) {
            out.add(new DocumentChangeCheck.Finding(switch (finding.level()) {
                case PROBLEM -> DocumentChangeCheck.Level.PROBLEM;
                case LOSS -> DocumentChangeCheck.Level.LOSS;
                case NOTICE -> DocumentChangeCheck.Level.NOTICE;
            }, finding.message()));
        }
        return out;
    }
}
