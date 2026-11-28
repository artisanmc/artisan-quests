package com.github.ibanetchep.msquests.bukkit.artisan;

import net.artisanmc.modules.api.document.PackImagesProvider;
import net.artisanmc.modules.api.text.OverlayLayout;

import java.util.List;
import java.util.Map;

/**
 * What a {@code quest_hud} file asks of the pack: each image of its layout where the layout draws
 * it. Twin of the editor's {@code hudPackImages} ({@code hud.ts}): Artisan's hub builds the pack
 * from this one, the editor from that one, and they must agree image for image.
 */
final class QuestHudPackImages implements PackImagesProvider {

    @Override
    public List<OverlayLayout.PackImage> images(Map<String, Object> document, Context context) {
        return OverlayLayout.read(document.get("layout")).layout().getPackImages();
    }
}
