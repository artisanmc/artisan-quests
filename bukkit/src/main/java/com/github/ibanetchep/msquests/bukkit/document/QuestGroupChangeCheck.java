package com.github.ibanetchep.msquests.bukkit.document;

import com.github.ibanetchep.msquests.core.dto.QuestGroupConfigDTO;
import com.github.ibanetchep.msquests.core.impact.ContentImpact;
import com.github.ibanetchep.msquests.core.impact.Impact;
import com.github.ibanetchep.msquests.core.impact.ImpactMessages;
import com.github.ibanetchep.msquests.core.impact.ImpactSource;
import com.github.ibanetchep.msquests.core.repository.KeyChange;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * What deploying a {@code quest_group} Document does, for Artisan's Deploy review: the file the
 * reader would refuse, and what the change does to the quests already started
 * ({@link ContentImpact}), in the author's language. Blocking (it counts rows): never on a game thread.
 *
 * <p>Free of Artisan's types on purpose, so it runs against any API version; the module hands
 * it to {@code DocumentChangeCheck} (Artisan API 1.9.0) when the server has it.
 */
public final class QuestGroupChangeCheck {

    public enum Level { PROBLEM, LOSS, NOTICE }

    public record Finding(Level level, String message) {
    }

    private final ImpactSource source;

    public QuestGroupChangeCheck(ImpactSource source) {
        this.source = source;
    }

    /**
     * @param id     the group key: the file name
     * @param before the Document as the server loaded it; null: a new file
     * @param after  the Document once deployed; null: the file is deleted
     * @param others the project's other quest groups once deployed, by key
     */
    public List<Finding> check(String id, @Nullable Map<String, Object> before, @Nullable Map<String, Object> after,
                               Map<String, Map<String, Object>> others, String lang) {
        QuestGroupConfigDTO now = null;
        List<KeyChange> changes = List.of();
        if (after != null) {
            try {
                now = QuestGroupDocumentReader.read(id, after, lang);
                changes = QuestGroupDocumentReader.keyChanges(id, after);
            } catch (RuntimeException e) {
                return List.of(new Finding(Level.PROBLEM, String.valueOf(e.getMessage())));
            }
        }
        // A file the server could not load had no quests running: everything in it is new.
        QuestGroupConfigDTO was = null;
        if (before != null) {
            try {
                was = QuestGroupDocumentReader.read(id, before, lang);
            } catch (RuntimeException ignored) {
            }
        }

        Set<String> claimed = new HashSet<>();
        for (Map.Entry<String, Map<String, Object>> other : others.entrySet()) {
            try {
                for (KeyChange change : QuestGroupDocumentReader.keyChanges(other.getKey(), other.getValue())) {
                    if (change instanceof KeyChange.Group group) claimed.add(group.from());
                    if (change instanceof KeyChange.QuestMoved moved) claimed.add(moved.fromGroup() + "/" + moved.from());
                }
            } catch (RuntimeException ignored) {
                // that file says its own problem when it is the one checked
            }
        }

        List<Finding> findings = new ArrayList<>();
        for (Impact impact : ContentImpact.of(was, now, changes, claimed, source)) {
            findings.add(new Finding(impact.loss() ? Level.LOSS : Level.NOTICE, ImpactMessages.render(impact, lang)));
        }
        return findings;
    }
}
