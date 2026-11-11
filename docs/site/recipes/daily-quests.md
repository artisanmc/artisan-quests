---
title: Three daily quests
description: Three random quests a day, renewed at 4 am, with a reward each.
sidebar:
  order: 1
---

Every player gets three random quests of the group at join and at each reset, at 4 am Paris time.

```yaml
# <project>/quest_groups/daily.yaml
schema: quest_group/v1
title: { en: "Daily quests" }
actor_type: player
reset: { cron: "0 4 * * *", timezone: Europe/Paris }
limits: { max_active: 3 }
distribution: { strategy: random, amount: 3, triggers: [actor_load, period_reset] }
quests:
  - key: hunter
    title: { en: "Hunter" }
    stages:
      - key: hunt
        objectives:
          - { key: zombies, type: kill_entity, entity_type: ZOMBIE, amount: 10 }
    actions:
      complete:
        - give_money: 200
```

Start from the module template "example_daily" in the editor, which writes the `uid`s for you. Show the
countdown on a scoreboard with `%msquests_group_daily_countdown%`.
