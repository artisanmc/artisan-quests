---
title: Troubleshooting
description: What a message means and how to fix it.
sidebar:
  order: 5
---

| Symptom | Cause | Fix |
|---|---|---|
| The plugin does not start next to MSQuests | Both jars are in `plugins/`. | Remove the MSQuests jar. |
| Players cannot use `/quest` | `artisanquests.player` is op-only by default. | Grant it to your players' group. |
| No quest after switching to `artisan` | No `quest_group` Document exists yet. | Run the [migration](../recipes/migrate-to-editor/), or create a group in the editor. |
| `Pick one: --dry-run or --confirm.` | Both switches were given. | Use one. |
| A menu referencing `msquests:*` shows nothing | The module's data sources need a player, or the group key is wrong. | Check the group key in `/artisanquests stats` and the menu's source parameters. |
| Two groups of one key | Two projects define it. | Group keys must be unique on the server: rename one. |
