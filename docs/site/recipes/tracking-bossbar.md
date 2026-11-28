---
title: The tracked quest in a boss bar
description: Show the quest a player tracks in a boss bar that fills with progress.
sidebar:
  order: 2
---

```yaml
# plugins/ArtisanQuests/config.yml
tracking:
  bossbar:
    enabled: true
    message: '%objective_name% - %objective_progress%'
    color: GREEN
    style: SEGMENTED_10
    show_progress: true
```

Restart, then `/quest track daily hunter`: the boss bar shows the objective and fills as zombies die.
`/quest untrack` hides it. In a menu, a button with `quests:track` does the same.

## A styled HUD instead of the bar

With Artisan 1.13+, the tracked quest can be drawn as a HUD of your own at the top of the screen:
a background image, an icon, the objective and its count in colour.

1. In the editor, under **Tracked quest HUDs** of the `quests` project, create one (`tracked`).
   It starts as one centred line, the objective followed by its count
   (`<white>%objective_name% <gray>[<yellow>%objective_progress%<gray>/%objective_target%]`).
   Lay it out with the mouse: add your images (a background, an icon), and the **Quest** or
   **Progress** texts if you want them on a line of their own. Keep the count in the
   objective's line when it should follow the name: a text layer has a fixed place, the name
   does not have a fixed width.
2. Deploy: the images go into Artisan's resource pack.
3. Name it in `config.yml` and restart:

```yaml
tracking:
  bossbar:
    enabled: true
    hud: tracked        # or quests:tracked
```

A player without the pack (or on Bedrock) keeps the boss bar above. So does everyone while an
image of the HUD is not in the pack yet (the console says which). Artisan draws the HUD in a
yellow boss bar it makes transparent: another plugin's yellow bar loses its bar for players who
have the pack.

