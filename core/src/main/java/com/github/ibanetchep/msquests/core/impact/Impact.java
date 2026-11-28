package com.github.ibanetchep.msquests.core.impact;

import java.util.Map;

/**
 * One thing a change of content does to the quests already started.
 *
 * @param loss whether actors lose something they had; false: they are affected without losing anything
 * @param code what happens ({@code quest.removed}), the key of its sentence in {@link ImpactMessages}
 * @param args what the sentence names: keys, and {@code n}, how many quests in progress it touches
 */
public record Impact(boolean loss, String code, Map<String, Object> args) {

    static Impact loss(String code, Object... args) {
        return new Impact(true, code, map(args));
    }

    static Impact notice(String code, Object... args) {
        return new Impact(false, code, map(args));
    }

    private static Map<String, Object> map(Object... args) {
        Map<String, Object> out = new java.util.LinkedHashMap<>();
        for (int i = 0; i + 1 < args.length; i += 2) {
            out.put((String) args[i], args[i + 1]);
        }
        return out;
    }
}
