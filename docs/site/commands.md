---
title: Commands and permissions
description: /quest for players, /artisanquests for admins, the permissions and the quests:* actions.
sidebar:
  order: 3
---

## Players

| Command | Permission | Effect | Example |
|---|---|---|---|
| `/quest track <group> <quest>` | `artisanquests.player` | Tracks a quest (boss bar, placeholders). | `/quest track daily miner` |
| `/quest untrack` | `artisanquests.player` | Stops tracking. | `/quest untrack` |
| `/quest toggletrack <group> <quest>` | `artisanquests.player` | Tracks it, or stops if it is tracked. | `/quest toggletrack daily miner` |
| `/quest rotate <group> <quest>` | `artisanquests.rotate` | Swaps a quest for another of the group. | `/quest rotate daily hunter` |

## Admins

`/artisanquests` has the alias `/msquests`. Every sub-command needs `artisanquests.admin`.

| Command | Effect | Example |
|---|---|---|
| `/artisanquests reload` | Reloads the config and the quests. | |
| `/artisanquests stats` | Loaded groups, quests and progress; compare before and after a migration. | |
| `/artisanquests migrate [--dry-run\|--confirm]` | Converts `quests/*.yml` to `quest_group` Documents; a dry run writes only a report. See [the recipe](../recipes/migrate-to-editor/). | `/artisanquests migrate --confirm` |
| `/artisanquests actor <type> <actor> list <group>` | An actor's quests in a group. | `/artisanquests actor player Steve list daily` |
| `/artisanquests actor <type> <actor> start <group> <quest>` | Starts a quest. | `… start daily miner` |
| `/artisanquests actor <type> <actor> startRandom <group> <amount>` | Starts random quests of the group. | `… startRandom daily 3` |
| `/artisanquests actor <type> <actor> startNext <group> <amount>` | Starts the next quests, in order. | `… startNext story 1` |
| `/artisanquests actor <type> <actor> rotate <group> <quest>` | Swaps a quest. | |
| `/artisanquests actor <type> <actor> complete <group> <quest>` | Completes a quest, rewards included. | |

## Permissions

| Permission | Default | Allows |
|---|---|---|
| `artisanquests.player` | op | `/quest` |
| `artisanquests.rotate` | op | `/quest rotate` |
| `artisanquests.admin` | op | `/artisanquests` |
| `msquests.player`, `msquests.rotate`, `msquests.admin`, `msquests.*` | op | Former names; each grants its `artisanquests.*` node |

Grant `artisanquests.player` to your players: it is op-only by default.

## Actions

Usable in any Artisan action chain:

| Action | Arguments | Effect |
|---|---|---|
| `quests:start` | `group`, `quest` | Starts the quest, with the group's rules. |
| `quests:abandon` | `group`, `quest` | Abandons it; it counts as failed in the period. |
| `quests:track` | `group`, `quest` | Tracks or untracks it. |
| `quests:rotate` | `group`, `quest` | Swaps it for another of the group. |
| `quests:complete` | `group`, `quest` | Completes it, rewards included. |
| `quests:distribute` | `group`, `amount` | Hands out quests, or applies the group's distribution. |
| `quests:action_bar` | `text` | Shows a text in the action bar. |
| `quests:boss_bar` | `text`, `color`, `style`, `show_progress`, `duration` | A per-player boss bar. |

Menus read the data sources `msquests:groups`, `msquests:quests` and `msquests:active`.
