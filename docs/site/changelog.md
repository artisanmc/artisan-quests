---
title: Changelog
description: The versions of Artisan Quests, newest first.
sidebar:
  order: 6
---

## Unreleased

- Renamed from MSQuests to Artisan Quests: plugin `ArtisanQuests`, `/artisanquests`, `artisanquests.*`
  permissions. The former names keep working.
- Requires Artisan API 1.0.0 (Artisan 1.0.0). Runs on Paper, Folia and Spigot.
- `content_source: artisan`: quest groups as Documents of Artisan projects, edited in the editor, progress
  in `artisan_quests_*`; `/artisanquests migrate` converts `quests/*.yml`.
- Rewards, hooks and requirements are Artisan action chains and conditions; `quests:*` actions.
- Placeholders in Artisan's registry (`%quests_*%`), `%msquests_*%` kept in PlaceholderAPI.
