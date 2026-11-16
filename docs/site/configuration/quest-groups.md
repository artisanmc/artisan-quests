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
| `distribution.strategy` | `none`, `random`, `sequential`, `ladder` | How quests are handed out. |
| `distribution.amount` | integer | How many per distribution. |
| `distribution.triggers` | list | `actor_load` (an actor joins), `period_reset`, `quest_complete`. |

## Ladders (rankup)

With `strategy: ladder`, the current quest follows the state of the actor instead of the quests
completed so far. Each quest says when it is done with `completed_when`, the state it aims at; the
current quest is the first of the list that is not done.

```yaml
actor_type: guild
distribution: { strategy: ladder }
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
  with `start_blocker: LOCKED`, whatever was completed before: a menu is written like for any group.
- The ladder is put in step when the actor loads, after each completion (its rewards run first),
  every minute, and when a menu reads `quests:quests`. A quest that is no longer the current one
  is removed without counting as a failure; one done before is offered again when the state comes
  back to it, with its rewards. `amount`, `triggers` and the period limits do not apply.
- The actor's values are variables of `expression`: `guild_level`, `guild_members`, `guild_name`
  on a guild (ArtisanGuildQuests), `actor_name`. Such conditions are read as soon as any player is
  online. Conditions about the player (`has_permission`, a `%placeholder%`) are read for a member
  of the actor only: with none online, the ladder keeps its last state.
- A quest without `completed_when` is done once the actor completed it.

## Quest keys

| Key | Type | Effect |
|---|---|---|
| `key`, `uid` | | Its key in the group, and its immutable id. |
| `title`, `description` | text | By language. |
| `stages[]` | list | Done in order; each has a `key` and `objectives`. |
| `stages[].objectives[]` | list | `key`, `type`, `amount`, and the type's own keys. |
| `actions.complete` | action chain | The reward: any Artisan action. |
| `completed_when` | conditions | In a ladder group: the state the quest aims at. |

Objective types: `block_break`, `breed_animal`, `craft_item`, `harvest_crop`, `deliver_item`,
`kill_entity`, `execute_command`, `fishing`, `placeholder`, `travel`.
