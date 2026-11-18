package com.github.ibanetchep.msquests.bukkit.importing;

import org.jetbrains.annotations.Nullable;

import java.util.Map;

/**
 * Legacy colour codes ({@code §a}, {@code &l}, {@code §x§r§r§g§g§b§b}, {@code &#rrggbb}) as MiniMessage
 * tags, what Artisan texts are written in. A {@code <} already in the text is escaped, so a text
 * that never was MiniMessage stays the same text.
 */
public final class LegacyText {

    private static final Map<Character, String> CODES = Map.ofEntries(
            Map.entry('0', "black"), Map.entry('1', "dark_blue"), Map.entry('2', "dark_green"),
            Map.entry('3', "dark_aqua"), Map.entry('4', "dark_red"), Map.entry('5', "dark_purple"),
            Map.entry('6', "gold"), Map.entry('7', "gray"), Map.entry('8', "dark_gray"),
            Map.entry('9', "blue"), Map.entry('a', "green"), Map.entry('b', "aqua"),
            Map.entry('c', "red"), Map.entry('d', "light_purple"), Map.entry('e', "yellow"),
            Map.entry('f', "white"), Map.entry('k', "obfuscated"), Map.entry('l', "bold"),
            Map.entry('m', "strikethrough"), Map.entry('n', "underlined"), Map.entry('o', "italic"),
            Map.entry('r', "reset"));

    private LegacyText() {
    }

    public static @Nullable String toMiniMessage(@Nullable String text) {
        if (text == null) return null;
        StringBuilder out = new StringBuilder(text.length() + 16);
        int i = 0;
        while (i < text.length()) {
            char c = text.charAt(i);
            if (c == '<') {
                out.append("\\<");
                i++;
                continue;
            }
            if ((c == '§' || c == '&') && i + 1 < text.length()) {
                char code = Character.toLowerCase(text.charAt(i + 1));
                // §x§r§r§g§g§b§b, the Bungee hex form.
                if (code == 'x' && i + 14 <= text.length()) {
                    String hex = bungeeHex(text, i + 2, c);
                    if (hex != null) {
                        out.append("<#").append(hex).append('>');
                        i += 14;
                        continue;
                    }
                }
                // &#rrggbb
                if (code == '#' && i + 8 <= text.length() && isHex(text.substring(i + 2, i + 8))) {
                    out.append("<#").append(text.substring(i + 2, i + 8).toLowerCase()).append('>');
                    i += 8;
                    continue;
                }
                String tag = CODES.get(code);
                if (tag != null) {
                    out.append('<').append(tag).append('>');
                    i += 2;
                    continue;
                }
            }
            out.append(c);
            i++;
        }
        return out.toString();
    }

    private static @Nullable String bungeeHex(String text, int from, char marker) {
        StringBuilder hex = new StringBuilder(6);
        for (int k = 0; k < 6; k++) {
            int at = from + k * 2;
            if (text.charAt(at) != marker) return null;
            char digit = text.charAt(at + 1);
            if (Character.digit(digit, 16) < 0) return null;
            hex.append(Character.toLowerCase(digit));
        }
        return hex.toString();
    }

    private static boolean isHex(String s) {
        for (int k = 0; k < s.length(); k++) {
            if (Character.digit(s.charAt(k), 16) < 0) return false;
        }
        return true;
    }
}
