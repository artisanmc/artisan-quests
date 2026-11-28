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
