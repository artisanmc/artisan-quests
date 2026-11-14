---
title: Placeholders
description: The tracked quest, a group's active quests, its reset countdown and a quest's status.
sidebar:
  order: 4
---

In Artisan texts the placeholders are `%quests_<key>%`; in PlaceholderAPI, `%msquests_<key>%`.

| Key | Example value | Value |
|---|---|---|
| `tracked_name` | `Miner` | The tracked quest's name |
| `tracked` | `Miner (1/1)` | The tracked quest, in the language file's format |
| `tracked_stage` | `Mine` | Its current stage, formatted |
| `tracked_stage_count` | `3` | Its number of stages |
| `tracked_stage_index` | `0` | The current stage's index, from 0 |
| `tracked_stage_objective_count` | `2` | Objectives in the current stage |
| `tracked_objective_firstactive` | `Stone 12/64` | The first unfinished objective, formatted |
| `tracked_objective_firstactive_index` | `1` | Its index |
| `tracked_quest_objective_<n>` | `Stone 12/64` | Objective `n` of the stage |
| `group_<group>_period_end` | `2026-11-12 04:00` | When the group resets |
| `group_<group>_countdown` | `6h 12m` | Time left before the reset |
| `group_<group>_active_count` | `3` | The player's active quests in the group |
| `group_<group>_active_quest`, `_quest_name`, `_quest_description`, `_quest_progress`, `_quest_objective`, `_quest_objective_progress`, `_quest_index` | `Miner`, `19%`, `1/3` | One active quest, cycling every `placeholders.cycle_duration_seconds` |
| `status_<group>:<quest>` | `IN_PROGRESS` | The quest's status, `NOT_STARTED` when never started |
| `completed_<group>:<quest>` | `true` | Whether it is completed |

The tracked placeholders are empty when the player tracks no quest.
