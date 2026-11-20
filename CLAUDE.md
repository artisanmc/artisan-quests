# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
./gradlew build          # Build all modules and run tests
./gradlew clean build    # Clean rebuild
./gradlew shadowJar      # Build deployable plugin JAR (bukkit module)
./gradlew test           # Run all tests
./gradlew :core:test     # Run tests in a specific module
```

The shadow JAR is automatically copied to `docker/plugins/` on build.

## Project Structure

This is a Gradle multi-module project targeting Paper, Folia and Spigot 1.21+ (Minecraft plugin; Adventure and other Paper-only calls stay in `bukkit/platform/PaperOnly`, messages go through Artisan's `TextApi`):

- **`core/`** — Platform-agnostic quest logic: domain model, services, registries, factories, DTOs, mappers, event dispatching abstraction
- **`bukkit/`** — Paper/Bukkit integration: plugin entry point, commands, listeners, Bukkit-specific objective handlers, actions, PlaceholderAPI
- **`database/`** — SQL persistence: JDBI + HikariCP, schema migrations, async repositories (MySQL or H2)
- **`editor/`** — the `quest_group` view of the Artisan editor (TypeScript + React against `@artisan/editor-sdk`, vendored in `editor/vendor/`). `cd editor && npm ci && npm test && npm run build` writes `bukkit/src/main/resources/artisan-editor/ui.js`, which is committed; rebuild it after any change in `editor/src`. `MsQuestsArtisanModule` registers it (`EDITOR_SDK` = the SDK version the build prints). While developing, `npm run watch` rebuilds `ui.js` on each save; with `dev.editor-bundles.msquests: <absolute path to that ui.js>` in Artisan's `environment.yml`, the server serves it without a restart (reload the editor to see a build).

Root package: `com.github.ibanetchep.msquests`

The plugin is published as **ArtisanQuests** (formerly MSQuests). Only the plugin name, data folder, admin command and permissions changed; legacy names stay accepted (`provides: [MSQuests]`, data folder copied on first start, `/msquests` alias, old `msquests.*` nodes declared as parents of `artisanquests.*`). The Artisan module id `msquests`, its `msquests:*` commands, the zMenu button type and table names keep the `msquests` prefix on purpose. The data sources are `quests:*`, each with its former `msquests:*` name as an alias (Artisan API 1.2.0). See ARCHITECTURE.md, section "Plugin name".

## Architecture

### Layered Design

The platform abstraction (`MSQuestsPlatform`) decouples core logic from Bukkit. `BukkitQuestsPlugin` implements this interface and wires everything together at startup.

**Core event flow:** Bukkit listeners call core services → services dispatch core events via `EventDispatcher` → `BukkitEventDispatcher` translates them to Bukkit events.

### Key Patterns

**Registries (in-memory store):** `QuestRegistry`, `QuestConfigRegistry`, `QuestActorRegistry`, `PlayerProfileRegistry`, `ActorTypeRegistry`. `QuestRegistry` has dirty tracking to avoid unnecessary DB writes.

**Factories:** `QuestFactory`, `QuestObjectiveFactory` — create domain objects from config or DTOs.

**Artisan chains:** rewards, group hooks and requirements are Artisan action chains / conditions, carried opaquely by core (`ActionChain`, `Conditions`) and run through the `ChainRunner` / `ConditionChecker` ports (`ArtisanChainRunner`, `ArtisanConditionChecker` in `bukkit/.../artisan/`). Legacy MSQuests actions are converted by `LegacyActions`.

**Statistics:** `QuestStats` (`bukkit/.../artisan/`) records the quests' Stat events through Artisan's `StatsApi` and declares the figures the editor's Quests tab asks for (`quests:progress`, `quests:stuck`), computed by `core/stats/QuestFigures` from rows read by `QuestFiguresSqlSource`. The tab is `editor/src/QuestStatsTab.tsx`. The event names and dimensions are public (Artisan stores them): never rename one. See ARCHITECTURE.md, *Statistics*.

**Services orchestrate everything:**
- `QuestLifecycleService` — start, complete, expire quests
- `QuestProgressService` — advance objective progress, trigger stage transitions
- `QuestDistributionService` — assign quests to actors (player or global)
- `QuestConfigService` — load/reload YAML quest configs
- `QuestActorService`, `PlayerProfileService`, `QuestService` — CRUD via repositories

**Persistence is async:** All repository methods return `CompletableFuture`. Repositories in `database/` use JDBI. `QuestRegistry.markDirty()` flags quests that need to be persisted.

### Quest Lifecycle

`QuestConfig` (YAML template) → `Quest` (runtime instance, owned by a `QuestActor`) → `QuestStage` with `QuestObjective`s → objectives progress → stage completes → next stage activates → final stage completes quest → actions execute.

Two actor types: `QuestPlayerActor` (per-player) and `QuestGlobalActor` (server-wide).

### Adding a New Objective Type

1. Create a class in `core/.../quest/objective/` extending `QuestObjective`
2. Create a handler in `bukkit/.../quest/objective/` extending the Bukkit handler base; register its Bukkit listener
3. Register the type in the `ActorTypeRegistry` or the objective factory as appropriate
4. Add the YAML deserialization mapping in `QuestObjectiveFactory`

### Adding a New Action

There are no MSQuests action types any more. A generic action belongs in Artisan's core; a quest-specific one is a `quests:*` action declared in `bukkit/.../artisan/QuestActions` (tested in `QuestActionsTest`).

## Configuration

- `core/src/main/resources/config.yml` — database settings, language, actor type action hooks
- Quest YAML configs live in `bukkit/src/main/resources/quests/` and are loaded via `QuestConfigYamlRepository`
- With `content_source: artisan`, quests load from the `quest_group` Documents of `<project>/quest_groups/` in every Artisan project (`QuestGroupDocumentRepository`, group keys unique on the server) and progress from the `artisan_quests_*` tables, keyed by `(group key, quest key)`: a hand-written file needs no id, a key is an identifier (the name is the title), a changed key keeps its progress through `old_key`, and the `uid` of older Documents is read as a former key (`KeyChange`, applied before the groups are published); `/msquests migrate` converts (see `ARCHITECTURE.md`, *Content source*)
- Content changed under a quest in progress: what the actor did or passed stays theirs (objective completed once, `reached_stage`, `settleLoadedQuests`, held slots, `old_key` on an objective, `old_key: {group, key}` for a quest moved between groups); one test per kind of change in `QuestContentChangeTest`, mirrored by the editor's preview in `editor/src/sourceRows.ts`; see `ARCHITECTURE.md`, *Content changed under a quest in progress*
- What a change does is said before it is published: `core/impact` (`ContentImpact`, one `Impact` code per kind of change, sentences in `ImpactMessages`, counts by `QuestImpactSqlSource`), wrapped by `QuestGroupChangeCheck` for Artisan's Deploy review (API 1.9.0). A new rule in *Content changed under a quest in progress* gets its code here and its test in `ContentImpactTest`. A change of key is applied once per database (`artisan_quests_key_change`, `KeyChangeSqlRepository`)
- `/artisan import msquests:beautyquests` (Artisan API 1.7.0) converts BeautyQuests' quests and progress, code in `bukkit/.../importing/`, ledger `artisan_quests_import_map` (`ImportLedger`); see `ARCHITECTURE.md`, *Imports from other quest plugins*
- Language files: `core/src/main/resources/lang/`

## Testing

- JUnit 5 with TestContainers (MySQL integration tests) and MockBukkit
- Tests for repositories require Docker (MySQL container spun up automatically)

## Key Dependencies

- **Lamp** — command framework (annotation-driven, see `QuestCommand`, `QuestAdminCommand`)
- **BoostedYAML** — YAML config parsing
- **Jackson** — JSON/YAML for DTOs and serialization
- **JDBI 3** — SQL query mapping
- **FoliaLib** — Folia-compatible scheduler abstraction (use instead of `Bukkit.getScheduler()`)
- **PlaceholderAPI** — optional; placeholders live in Artisan's registry (`quests`, `QuestPlaceholders`), `QuestsPlaceholderExpansion` keeps the `msquests` PAPI alias
