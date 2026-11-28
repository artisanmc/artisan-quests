package com.github.ibanetchep.msquests.bukkit.artisan;

import com.github.ibanetchep.msquests.core.quest.actor.Quest;
import com.github.ibanetchep.msquests.core.quest.objective.QuestObjective;
import net.artisanmc.modules.api.text.OverlayApi;
import net.artisanmc.modules.api.text.OverlayLayout;
import org.bukkit.entity.Player;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class QuestHudTest {

    private static Map<String, Object> file() {
        return Map.of(
                "id", "tracked",
                "layout", List.of(
                        Map.of("image", "fond", "x", -100, "y", 2),
                        Map.of("text", "objective", "x", -80, "y", 6, "width", 160),
                        Map.of("text", "progress", "x", 60, "y", 6, "width", 40)),
                "texts", Map.of("objective", "<white>%objective_name%"));
    }

    @Test
    void readsTheLayoutAndFillsTheTextsTheFileLeavesOut() {
        QuestHud hud = QuestHud.read(file());
        assertEquals("tracked", hud.id());
        assertEquals(3, hud.layout().getLayers().size());
        assertEquals("<white>%objective_name%", hud.text("objective"));
        assertEquals(QuestHud.DEFAULT_TEXTS.get("progress"), hud.text("progress"));
        assertTrue(hud.problems().isEmpty());
    }

    @Test
    void aWrongLayerIsReportedAndLeftOut() {
        QuestHud hud = QuestHud.read(Map.of("id", "a", "layout", List.of(Map.of("nope", 1))));
        assertEquals(0, hud.layout().getLayers().size());
        assertEquals(1, hud.problems().size());
    }

    @Test
    void asksThePackForTheLayoutsImagesWhereItDrawsThem() {
        List<OverlayLayout.PackImage> images = new QuestHudPackImages().images(file(), null);
        assertEquals(1, images.size());
        assertEquals("fond", images.get(0).asset());
        assertEquals(-2, images.get(0).rise());
    }

    /** An overlay that draws images as their name, records what is shown, and has the images of {@code pack}. */
    private static final class FakeOverlay implements OverlayApi {
        boolean pack = true;
        Set<String> images = Set.of("fond");
        final List<String> calls = new ArrayList<>();

        @Override public int width(String miniMessage) { return miniMessage.length(); }
        @Override public String raise(String miniMessage, int rise) { return "[" + miniMessage + "]"; }
        @Override public String move(int px) { return ""; }
        @Override public String image(String asset, int rise) { return images.contains(asset) ? "{" + asset + "}" : null; }
        @Override public int imageHeight(String asset) { return images.contains(asset) ? 16 : -1; }
        @Override public boolean hasPack(Player player) { return pack; }
        @Override public void show(Player player, Slot slot, String layer, int priority, String miniMessage) {
            calls.add("show " + slot + " " + layer + " " + miniMessage);
        }
        @Override public void hide(Player player, Slot slot, String layer) { calls.add("hide " + slot + " " + layer); }
    }

    private static Quest quest() {
        Quest quest = mock(Quest.class);
        when(quest.getPlaceholders(any())).thenReturn(Map.of("quest_name", "Alchemist"));
        return quest;
    }

    private static QuestObjective objective() {
        QuestObjective objective = mock(QuestObjective.class);
        when(objective.getPlaceholders(any())).thenReturn(Map.of(
                "objective_name", "Brew", "objective_progress", "0", "objective_target", "3"));
        return objective;
    }

    @Test
    void drawsTheTrackedQuestInTheBossBarSlot() {
        FakeOverlay overlay = new FakeOverlay();
        ArtisanTrackingHud hud = new ArtisanTrackingHud(overlay, () -> QuestHud.read(file()), missing -> {});
        assertTrue(hud.show(mock(Player.class), quest(), objective()));
        assertEquals(1, overlay.calls.size());
        String shown = overlay.calls.get(0);
        assertTrue(shown.startsWith("show BOSS_BAR quests:tracking "), shown);
        assertTrue(shown.contains("{fond}"), shown);
        assertTrue(shown.contains("[<white>Brew]"), shown);
        assertTrue(shown.contains("[<gray>[<yellow>0<gray>/3]]"), shown);
    }

    @Test
    void withoutThePackOrAnImageThePlayerKeepsTheBossBar() {
        FakeOverlay overlay = new FakeOverlay();
        overlay.pack = false;
        List<String> reported = new ArrayList<>();
        ArtisanTrackingHud hud = new ArtisanTrackingHud(overlay, () -> QuestHud.read(file()), reported::addAll);
        assertFalse(hud.show(mock(Player.class), quest(), objective()));
        assertEquals(List.of("hide BOSS_BAR quests:tracking"), overlay.calls);

        overlay.pack = true;
        overlay.images = Set.of();
        assertFalse(hud.show(mock(Player.class), quest(), objective()));
        assertEquals(List.of("fond"), reported);

        ArtisanTrackingHud none = new ArtisanTrackingHud(new FakeOverlay(), () -> null, missing -> {});
        assertFalse(none.show(mock(Player.class), quest(), objective()));
    }
}
