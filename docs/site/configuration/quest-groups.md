---
title: Quest groups
description: A group of quests, its reset, its distribution, and the stages, objectives and rewards of each quest.
sidebar:
  order: 2
---

With `content_source: artisan`, quests are `quest_group` Documents: `<project>/quest_groups/<key>.yaml`
in any Artisan project, edited in the editor (group view, then quest view). Group keys must be unique on
the server. A publish reloads the quests that changed.

## The example `example_daily`

```yaml
schema: quest_group/v1
title: { fr: "Quêtes journalières", en: "Daily quests" }
description: { en: "Three quests a day, renewed at 4 am." }
actor_type: player
reset: { cron: "0 4 * * *", timezone: Europe/Paris }
limits: { max_active: 3 }
distribution: { strategy: random, amount: 3, triggers: [actor_load, period_reset] }
quests:
  - key: miner
    title: { fr: "Mineur", en: "Miner" }
    description: { en: "Break 64 stone blocks." }
    stages:
      - key: mine
        objectives:
          - { key: stone, type: block_break, material: STONE, amount: 64 }
    actions:
      complete:
        - give_item: { material: IRON_INGOT, count: 8 }
```

## Group keys

| Key | Type | Effect |
|---|---|---|
| `old_key` | key or list | The file name the group had before. See [Changing a key](#changing-a-key). |
| `title`, `description` | text | By language. |
| `actor_type` | `player`, `global`, `guild` | Who owns the quests. `guild` needs ArtisanGuildQuests. |
| `reset.cron`, `reset.timezone` | cron, zone | When the period ends and quests reset. |
| `limits.max_active` | integer | Active quests at once per actor. |
| `distribution.strategy` | `none`, `random`, `sequential` | How quests are handed out. `sequential`: one at a time, see below. |
| `distribution.amount` | integer | How many per distribution. |
| `distribution.triggers` | list | `actor_load` (an actor joins), `period_reset`, `quest_complete`. |

## In list order, and rankups

With `strategy: sequential`, the group has one quest at a time: the first of the list that is not
done. By default a quest is done once the actor started it and it ended. A quest with
`completed_when` is done when that state holds instead, whatever was completed before: this is how
a rankup follows a guild level or a rank. (`strategy: ladder` in a file reads as `sequential`.)

```yaml
actor_type: guild
distribution: { strategy: sequential }
quests:
  - key: level_01
    completed_when: [{ expression: "guild_level >= 1" }]
    actions:
      complete:
        - run_command: { command: "guild admin setlevel {actor_name} 1", as: console }
  - key: level_02
    completed_when: [{ expression: "guild_level >= 2" }]
```

- `completed_when` is a list of Artisan conditions, like `requirements`. Write the goal, not an
  exact value: `>= 2`, `has_permission: group.citoyen`. Inherited ranks and a level raised by
  several steps then read right. The reward is what makes it true.
- Quests before the current one read `COMPLETED` in `quests:quests`, the ones after `NOT_STARTED`
  with `start_blocker: LOCKED`.
- The group is put in step when the actor loads, after each completion (its rewards run first),
  every minute, and when a menu reads `quests:quests`: `amount` and `triggers` do not apply.
  `limits.max_per_period` still caps how many quests start in a period.
- A quest with `completed_when` that is no longer the current one (level changed by hand, guild
  reset) is removed without counting as a failure; one done before is offered again when the state
  comes back to it, with its rewards.
- The actor's values are variables of `expression`: `guild_level`, `guild_members`, `guild_name`
  on a guild (ArtisanGuildQuests), `actor_name`. Such conditions are read as soon as any player is
  online. Conditions about the player (`has_permission`, a `%placeholder%`) are read for a member
  of the actor only: with none online, the group keeps its last state.

## Quest keys

| Key | Type | Effect |
|---|---|---|
| `key` | | Its key, unique in the group. Progress is stored against the group key and this key. |
| `old_key` | key or list | The keys it had before. See [Changing a key](#changing-a-key). |
| `title`, `description` | text | By language. |
| `stages[]` | list | Done in order; each has a `key` and `objectives`. |
| `stages[].objectives[]` | list | `key`, `type`, `amount`, and the type's own keys; `old_key` for a former key. |
| `actions.complete` | action chain | The reward: any Artisan action. |
| `completed_when` | conditions | In a `sequential` group: the state the quest aims at. |

Objective types: `block_break`, `breed_animal`, `craft_item`, `harvest_crop`, `deliver_item`,
`kill_entity`, `execute_command`, `fishing`, `placeholder`, `travel`.

## Changing a key

A group is identified by its file name and a quest by its `key`: that is what players'
progress is stored against. A key is an identifier, not a name: what players read is the
`title`, which you can change freely. Changing a key is rarely needed; to do it without
losing progress, say what the key was:

```yaml
# quest_groups/everyday.yaml, formerly daily.yaml
old_key: daily
quests:
  - key: dig
    old_key: mine          # or a list: [mine, excavate]
```

When the file loads, the server moves the saved progress from the old key to the new one,
before any player's quests are read. Loading it again moves nothing more, so `old_key` can
stay; remove it once every server of the network has loaded the file. The editor writes it
when you change a quest's key.

A file is refused when an `old_key` is still the key of another quest of the group (or of
another group), or when two quests claim the same one: the progress would go to the wrong quest.

Changing a key without `old_key` starts the quest over for everyone. The statistics already
recorded keep the old key.

## Changing a quest players have started

What a player did or passed stays theirs when you change the quest:

| You change | A player in the quest |
| --- | --- |
| Raise a target | Keeps their progress. An objective they had completed stays completed. |
| Lower a target | An objective already past the new target is completed. A quest with nothing left completes, with its rewards, the next time the player loads. |
| Add a stage or an objective | Does it if it comes after where they stand. One added behind them is not asked of them. |
| Remove a stage or an objective | Goes on with what is left; with nothing left, the quest completes. |
| Reorder stages | Stays on the stage they had reached; what now comes before it is behind them. |
| Add a quest to a `sequential` group | Does it if it comes after their current quest. One added behind them is skipped (a quest with `completed_when` still follows its state). |
| Take a quest out of the group | Its progress is kept and it still holds its active slot; it comes back as it was with the quest. |

| Change an objective's `type` | Starts that objective from zero: progress made for another type does not count. |
| Change an objective's `key` | Keeps their progress when the objective names its former key in `old_key` (the editor writes it). Without it, the objective starts from zero. |
| Move a quest to another group | Keeps their progress when the quest says where it was: `old_key: { group: story, key: mine }`. |

An objective completed by a lowered target runs its `objective_complete` actions when the player
next loads, once.

```yaml
quests:
  - key: mine
    old_key: { group: story, key: mine }   # was in story.yaml
    stages:
      - key: dig
        objectives:
          - { key: cobble, old_key: stone, type: block_break, material: COBBLESTONE, amount: 64 }
```

Still to avoid: adding a `reset` to a group that had none (quests completed before the current
period can be done again), and reusing the key of a removed objective for a new one of the same
type (it starts with the old progress).

Files written by earlier versions carry a `uid` on the group and on each quest. It is still
read: progress stored under it moves to the keys the first time the file loads. New files
do not need one.
