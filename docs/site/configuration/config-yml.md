---
title: config.yml
description: Where quests are read from, the database, the messages per actor type, tracking and placeholders.
sidebar:
  order: 1
---

`plugins/ArtisanQuests/config.yml`. Restart after a change of `content_source` or `database`;
`/artisanquests reload` re-reads the rest.

```yaml
config_version: 3
language: en_EN

# legacy  — quests/*.yml and the msquests_* tables.
# artisan — the quest_group Documents of every Artisan project and the artisan_quests_* tables.
content_source: legacy

database:
  type: h2 # mysql or h2
  host: mariadb
  port: 3306
  name: database
  user: username
  password: password

actor_type:
  player:
    start_actions:
      - type: message
        message_key: player_quest.started.message.body
        objective_key: player_quest.started.message.objective
      - type: title
        title_key: player_quest.started.title.title
        subtitle_key: player_quest.started.title.subtitle
      - type: action_bar
        message_key: player_quest.started.action_bar
    progress_actions:
      - type: action_bar
        message_key: player_quest.progress.action_bar
    complete_actions:
      - type: message
        message_key: player_quest.complete.message.body
      - type: title
        title_key: player_quest.complete.title.title
        subtitle_key: player_quest.complete.title.subtitle
  global:
    # same keys, with global_quest.* messages

tracking:
  bossbar:
    enabled: false
    message: '%objective_name% - %objective_progress%'
    color: WHITE
    style: PROGRESS
    show_progress: true

placeholders:
  cycle_duration_seconds: 5

deliver_item:
  include_shulker_boxes: true
```

| Key | Type | Default | Effect |
|---|---|---|---|
| `language` | `en_EN`, `fr_FR` | `en_EN` | The messages' language. |
| `content_source` | `legacy`, `artisan` | `legacy` | `legacy`: `quests/*.yml` and the `msquests_*` tables. `artisan`: [quest groups](../quest-groups/) written in the editor and the `artisan_quests_*` tables. Read at start only. |
| `database.type` | `mysql`, `h2` | `h2` | The quests' own database. |
| `database.host`, `port`, `name`, `user`, `password` | | | Its connection, for `mysql`. |
| `actor_type.<type>.start_actions`, `progress_actions`, `complete_actions` | list | messages, titles, action bars | What the actor sees when a quest starts, progresses or completes. `type`: `message`, `title`, `action_bar`; texts are keys of the language file. |
| `tracking.bossbar.enabled` | boolean | `false` | Show the tracked quest in a boss bar. |
| `tracking.bossbar.message`, `color`, `style`, `show_progress` | | | Its text, colour, style and whether it fills with progress. |
| `placeholders.cycle_duration_seconds` | integer | `5` | How long `%msquests_group_<group>_active_*%` shows each active quest before the next. |
| `deliver_item.include_shulker_boxes` | boolean | `true` | A `deliver_item` objective also takes items from shulker boxes in the inventory, once the inventory itself is empty. |
