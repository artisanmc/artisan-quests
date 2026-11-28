---
title: Move quests/*.yml to the editor
description: Convert the legacy quest files to quest_group Documents and switch content_source without losing progress.
sidebar:
  order: 3
---

Your quests move from `quests/*.yml` to the editor, and players keep their progress.

1. `/artisanquests stats`: note the counts.
2. `/artisanquests migrate --dry-run`: nothing is written but `migration/report-<date>.txt`. Read it.
3. `/artisanquests migrate --confirm`: writes `plugins/Artisan/projects/quests/quest_groups/*.yaml`
   (never over an existing Document) and `migration/map.yaml`.
4. In `config.yml`, set `content_source: artisan`, then restart. At that start, progress is copied from the
   `msquests_*` tables into `artisan_quests_*`; the old tables stay untouched.
5. `/artisanquests stats` again: the counts match.

To go back, set `content_source: legacy` and restart: the old files and tables were not changed.
