---
title: Install
description: Put the jar next to Artisan, start the server, and get the first daily quests.
sidebar:
  order: 1
---

1. Install [Artisan](../../artisan/getting-started/install-admin/) 1.0.0 or newer.
2. Drop `artisanquests-<version>.jar` into `plugins/`.
3. Start the server. `plugins/ArtisanQuests/config.yml` is written; the example group `example_daily`
   is offered in the editor's module templates.
4. Join and check `/artisanquests stats`: it counts the loaded groups, quests and progress.

## Coming from MSQuests

Replace the MSQuests jar with the ArtisanQuests jar; never keep both (`provides: [MSQuests]` would clash).
What keeps working:

| Before | Now |
|---|---|
| `plugins/MSQuests/` | Copied to `plugins/ArtisanQuests/` on the first start; the original is kept for a rollback |
| `/msquests` | `/artisanquests`, with `/msquests` as alias |
| `msquests.player`, `.rotate`, `.admin`, `msquests.*` | `artisanquests.*`; the old nodes grant the new ones |
| `%msquests_…%` | Unchanged in PlaceholderAPI |
| `depend: [MSQuests]` in other plugins | Still resolves |
| Module `msquests`, data sources `msquests:*`, zMenu button `MSQUESTS_QUEST_GROUP`, tables `msquests_*` | Unchanged |

Your quests stay in `quests/*.yml` (`content_source: legacy`) until you [move them to the
editor](../recipes/migrate-to-editor/).
