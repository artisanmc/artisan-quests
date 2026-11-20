---
title: Changelog
description: The versions of Artisan Quests, newest first.
sidebar:
  order: 6
---

## Unreleased

- A quest group file no longer needs a `uid`: a group is identified by its file name and a quest by
  its `key`, so a file can be written by hand. To rename one without losing progress, write `old_key`
  (the former name) on the group or the quest: the server moves the saved progress when the file loads.
  The editor writes it when a quest's key changes, and no longer writes uids. Files that carry uids
  keep working: progress stored under them moves to the keys at the first load, with nothing to run.
- Import from BeautyQuests (1.0 and 2.x, files or database) with Artisan's `/artisan import
  msquests:beautyquests`: quests into two quest groups, Citizens starter NPCs into ArtisanNpcs files,
  players' progress into `artisan_quests_*`, with a dry run, a report and a rollback. Needs Artisan API
  1.7.0 (the plugin still starts on 1.5.0, without the import).
- An objective whose `item` is a whole item (written by the editor) no longer fails the quest reload.
- Jackson is relocated in the jar: on Paper 1.21.8, the server's Jackson made the quest Documents fail to
  read.
- An NPC's line written in the quest: `line` on a giver, a `talk_npc` or a `deliver_item` (and `missing_line`),
  a text or one per language. `quests:npc` rows carry it; ArtisanNpcs has it said by the NPC's speaker, so a
  single sentence needs no conversation file. The editor has the field.
- Requires Artisan API 1.4.0. The editor's "Who plays" lists the actor types registered on the server
  (`guild` with MSGuilds), reported as the option list `quests:actor_types`.
- A stage without a name reads `Stage 2` (its place in the quest) wherever its name shows: `%stage_name%`,
  the `quests:*` rows. The text is `placeholder.stage_default_name` in the language files.
- Renamed from MSQuests to Artisan Quests: plugin `ArtisanQuests`, `/artisanquests`, `artisanquests.*`
  permissions. The former names keep working.
- Requires Artisan API 1.0.0 (Artisan 1.0.0). Runs on Paper, Folia and Spigot.
- `content_source: artisan`: quest groups as Documents of Artisan projects, edited in the editor, progress
  in `artisan_quests_*`; `/artisanquests migrate` converts `quests/*.yml`.
- Rewards, hooks and requirements are Artisan action chains and conditions; `quests:*` actions.
- `strategy: sequential` hands one quest at a time, the first not done, without `amount` nor
  `triggers`. A quest's `completed_when` makes it follow a state (a rankup); `status_key` in
  `quests:quests` follows the current quest.
- Editor: a quest group opens on its quests, full width, with its rules folded in one card (reset
  presets, one "In order" choice); a quest shows its stages as cards beside what the player sees, a
  new objective picks its type first, and a quest can be duplicated.
- Placeholders in Artisan's registry (`%quests_*%`), `%msquests_*%` kept in PlaceholderAPI.
