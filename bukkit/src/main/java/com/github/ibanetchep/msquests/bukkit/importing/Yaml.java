package com.github.ibanetchep.msquests.bukkit.importing;

import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/** Lenient reads of a YAML tree as SnakeYAML or Bukkit leave it (keys stringified). */
final class Yaml {

    private Yaml() {
    }

    static Map<String, Object> map(@Nullable Object value) {
        Map<String, Object> out = new LinkedHashMap<>();
        if (value instanceof Map<?, ?> m) m.forEach((k, v) -> out.put(String.valueOf(k), v));
        return out;
    }

    static List<Object> list(@Nullable Object value) {
        return value instanceof List<?> l ? new ArrayList<>(l) : new ArrayList<>();
    }

    static @Nullable String string(@Nullable Object value) {
        return value == null ? null : value.toString();
    }

    static int integer(@Nullable Object value, int fallback) {
        if (value instanceof Number n) return n.intValue();
        if (value != null) {
            try {
                return Integer.parseInt(value.toString().trim());
            } catch (NumberFormatException ignored) {
                // fallback
            }
        }
        return fallback;
    }

    static long longValue(@Nullable Object value, long fallback) {
        if (value instanceof Number n) return n.longValue();
        if (value != null) {
            try {
                return Long.parseLong(value.toString().trim());
            } catch (NumberFormatException ignored) {
                // fallback
            }
        }
        return fallback;
    }

    static double number(@Nullable Object value) {
        if (value instanceof Number n) return n.doubleValue();
        try {
            return value == null ? 0 : Double.parseDouble(value.toString().trim());
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /** A section keyed {@code "0"}, {@code "1"}… (or a list), in numeric order; other keys skipped. */
    static Map<Integer, Map<String, Object>> indexed(@Nullable Object value) {
        Map<Integer, Map<String, Object>> out = new TreeMap<>();
        if (value instanceof List<?> l) {
            for (int i = 0; i < l.size(); i++) out.put(i, map(l.get(i)));
            return out;
        }
        for (Map.Entry<String, Object> e : map(value).entrySet()) {
            try {
                out.put(Integer.parseInt(e.getKey().trim()), map(e.getValue()));
            } catch (NumberFormatException ignored) {
                // not a stage
            }
        }
        return out;
    }
}
