---
title: Import from BeautyQuests
description: Convert BeautyQuests' quests into quest groups and carry players' progress, with a dry run and a rollback.
sidebar:
  order: 4
---

Artisan's `/artisan import` reads BeautyQuests (1.0 and 2.x) and writes Artisan Quests content and progress.
It needs Artisan 1.7.0 or later and `content_source: artisan`.

1. Leave BeautyQuests' folder in `plugins/BeautyQuests` (the plugin itself can be removed). If its
   `config.yml` has `database.enabled: true`, its database must be reachable: progress is read there.
2. `/artisan import msquests:beautyquests`: a dry run. Nothing is written but
   `plugins/ArtisanQuests/imports/beautyquests-<date>-dry.txt`, which lists what is converted, what is
   set aside and why, and what to check in the editor.
3. `/artisan import msquests:beautyquests confirm`: writes the quests and the progress of the players
   who are offline (an online player's quests are set aside: run it again once they left). The command
   prints a batch id.
4. Open the `quests` module in the editor and check the groups `beautyquests` and
   `beautyquests_repeatable`.

Running it again only writes what is new. `/artisan import rollback <batch> confirm` removes what the
batch wrote and nobody touched since: a file edited in the editor and a quest a player moved are kept.

## What is converted

- Non-repeatable quests go to the group `beautyquests`, repeatable ones to `beautyquests_repeatable`.
  A quest's key is `quest_<BeautyQuests id>`.
- Stages: mobs (`kill_entity`), mine (`block_break`), fish (`fishing`), breed (`breed_animal`), craft
  (`craft_item`), talk to an NPC (`talk_npc`), bring items (`deliver_item`), and a chat stage that is a
  command (`execute_command`).
- The starter NPC is the quest's giver. A Citizens NPC `12` becomes the ArtisanNpcs file
  `npcs/citizens_12.yml`, unless an NPC with that id exists already.
- Rewards: commands, items, money, experience, messages, titles, permissions (as an `lp` command). A
  stage's rewards run when its objective completes.
- Requirements: permission, level, money, placeholder, and a quest done before.
- Progress: a quest in progress keeps its stage and its counters; a finished quest is one completed
  quest.

## What is set aside

- A quest with several branches, or a stage kind Artisan Quests has no objective for (location,
  interact, bucket, eat/drink, …): the whole quest, and its players' progress.
- A player stored by an AccountsHook account rather than a player UUID.
- Options with no equivalent (cooldown, timer, pool, reward waits, enchantments of a reward item…) are
  listed as notes in the report.
