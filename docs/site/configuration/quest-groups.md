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
uid: 01M56YFAT5FSPXX57QAQ5JR2RN
title: { fr: "Quêtes journalières", en: "Daily quests" }
description: { en: "Three quests a day, renewed at 4 am." }
actor_type: player
reset: { cron: "0 4 * * *", timezone: Europe/Paris }
limits: { max_active: 3 }
distribution: { strategy: random, amount: 3, triggers: [actor_load, period_reset] }
quests:
  - key: miner
    uid: 01M56YFAT6E6VBWJG4B56RXS0P
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
| `uid` | id | Immutable; progress is stored against it, so renaming a key keeps progress. The editor writes it. |
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
| `key`, `uid` | | Its key in the group, and its immutable id. |
| `title`, `description` | text | By language. |
| `stages[]` | list | Done in order; each has a `key` and `objectives`. |
| `stages[].objectives[]` | list | `key`, `type`, `amount`, and the type's own keys. |
| `actions.complete` | action chain | The reward: any Artisan action. |
| `completed_when` | conditions | In a `sequential` group: the state the quest aims at. |

Objective types: `block_break`, `breed_animal`, `craft_item`, `harvest_crop`, `deliver_item`,
`kill_entity`, `execute_command`, `fishing`, `placeholder`, `travel`.
