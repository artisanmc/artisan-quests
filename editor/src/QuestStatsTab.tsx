import {
  Funnel,
  type ModuleStatsProps,
  SortableTable,
  StatCard,
  type StatsBreakdownRow,
  StatsPanel,
  injectModuleStyles,
  statsBreakdown,
  statsQuery,
  textValue,
  useServerDocuments,
  useStatsRead,
} from "@artisan/editor-sdk";
import type { ReactElement } from "react";
import { type T, useT } from "./i18n";
import { KIND, type QuestGroup } from "./model";
import {
  EVENTS,
  EVENT_KINDS,
  type EventKind,
  PROGRESS_QUERY,
  type QuestLine,
  STUCK_QUERY,
  type StuckRow,
  changeLabel,
  formatDuration,
  groupFunnel,
  isOrdered,
  progressRows,
  questLines,
  stuckRows,
  total,
} from "./stats";
import { QUESTS_CSS } from "./styles";

type Counts = Record<EventKind, StatsBreakdownRow[]>;

/**
 * The Quests tab of the Statistics space: one quest group at a time (kept in the URL as the
 * tab's focus). What happened over the period comes from the quests' events; where the quests
 * stand now comes from figures the server computes from its tables.
 */
export function QuestStatsTab(props: ModuleStatsProps): ReactElement {
  injectModuleStyles("msquests", QUESTS_CSS);
  const t = useT();
  const groups = useServerDocuments(KIND).map((d) => ({
    group: d.document as QuestGroup,
    project: d.project,
  }));
  const chosen = groups.find((g) => g.group.id === props.focus) ?? groups[0];
  if (!chosen) return <p className="aq-stats-empty">{t("stats.noGroup")}</p>;
  const name = (g: (typeof groups)[number]) =>
    textValue(g.project, g.group.title.key, props.lang) || g.group.id;
  return (
    <div className="aq-stats">
      <label className="aq-stats-pick">
        <span className="aq-h">{t("stats.group")}</span>
        <select
          className="select"
          value={chosen.group.id}
          onChange={(e) => props.onFocus(e.target.value)}
        >
          {groups.map((g) => (
            <option key={g.group.id} value={g.group.id}>
              {name(g)}
            </option>
          ))}
        </select>
      </label>
      <GroupStats key={chosen.group.id} {...props} group={chosen.group} project={chosen.project} />
    </div>
  );
}

function GroupStats({
  serverId,
  period,
  player,
  compare,
  lang,
  group,
  project,
}: ModuleStatsProps & { group: QuestGroup; project: unknown }): ReactElement {
  const t = useT();
  const scope = `${serverId}|${group.id}`;
  const read = (from: number, to: number): Promise<Counts> =>
    Promise.all(
      EVENT_KINDS.map((kind) =>
        statsBreakdown(serverId, { event: EVENTS[kind], from, to, player, dims: { group: group.id } }, "quest"),
      ),
    ).then((all) => Object.fromEntries(EVENT_KINDS.map((kind, i) => [kind, all[i] ?? []])) as Counts);

  const counts = useStatsRead(`${scope}|${period.from}|${period.to}|${player ?? ""}`, () =>
    read(period.from, period.to),
  );
  const before = useStatsRead(
    `${scope}|${period.previous.from}|${period.previous.to}|${player ?? ""}|${compare}`,
    () => (compare ? read(period.previous.from, period.previous.to) : Promise.resolve(undefined)),
  );
  const progress = useStatsRead(`${scope}|progress`, () =>
    statsQuery(serverId, PROGRESS_QUERY, { group: group.id }).then((r) => progressRows(r.rows)),
  );
  const stuck = useStatsRead(`${scope}|stuck`, () =>
    statsQuery(serverId, STUCK_QUERY, { group: group.id }).then((r) => stuckRows(r.rows)),
  );

  const questName = (key: string) => {
    const quest = group.quests.find((q) => q.key === key);
    return (quest && textValue(project, quest.title.key, lang)) || key;
  };
  const stageName = (questKey: string, stageKey: string) => {
    const stage = group.quests.find((q) => q.key === questKey)?.stages.find((s) => s.key === stageKey);
    return (stage && textValue(project, stage.title.key, lang)) || stageKey;
  };
  const integer = (n: number) => new Intl.NumberFormat(lang).format(n);
  const percent = (ratio: number) =>
    new Intl.NumberFormat(lang, { style: "percent", maximumFractionDigits: 0 }).format(ratio);
  const duration = (seconds: number | null) =>
    seconds === null ? "–" : formatDuration(seconds, t("stats.day"));

  if (counts.error) return <p className="aq-stats-empty">{t("stats.unavailable")}</p>;

  const lines = questLines(group.quests, counts.data ?? {}, progress.data ?? []);
  const funnel = isOrdered(group) ? groupFunnel(group.quests, progress.data ?? []) : [];
  const computedNotice = (error: string | undefined) =>
    error === undefined
      ? null
      : t(
          error === "server_offline"
            ? "stats.offline"
            : error === "unknown_query"
              ? "stats.notComputed"
              : "stats.unavailable",
        );
  // Good news when completions rise; bad news when abandons or expirations do.
  const goodWhenUp: Record<EventKind, boolean | undefined> = {
    started: undefined,
    completed: true,
    abandoned: false,
    expired: false,
  };

  return (
    <>
      <div className="aq-stats-cards">
        {EVENT_KINDS.map((kind) => {
          const now = total(counts.data?.[kind]);
          const change = changeLabel(now, before.data ? total(before.data[kind]) : undefined, lang);
          const up = change?.startsWith("▲") ?? false;
          const good = goodWhenUp[kind];
          return (
            <StatCard
              key={kind}
              label={t(`stats.${kind}`)}
              value={counts.data ? integer(now) : "…"}
              sub={t("stats.overPeriod")}
              trend={
                change === null
                  ? undefined
                  : {
                      label: change,
                      tone: good === undefined ? "default" : up === good ? "positive" : "negative",
                    }
              }
            />
          );
        })}
      </div>

      {funnel.length > 0 && (
        <StatsPanel title={t("stats.funnel")} hint={t("stats.allTime")}>
          <Funnel
            steps={funnel.map((step) => ({
              id: `${step.kind}:${step.key}`,
              label: t(step.kind === "started" ? "stats.funnelStarted" : "stats.funnelCompleted", {
                quest: questName(step.key),
              }),
              value: step.value,
            }))}
            formatValue={integer}
            formatShare={percent}
          />
        </StatsPanel>
      )}

      <StatsPanel title={t("stats.quests")} hint={t("stats.questsHint")}>
        {lines.length === 0 ? (
          <p className="aq-stats-empty">{t("stats.noQuestYet")}</p>
        ) : (
          <SortableTable<QuestLine>
            rows={lines}
            rowId={(line) => line.key}
            initialSort="unfinished"
            columns={questColumns(t, questName, integer, percent, duration)}
          />
        )}
        {progress.error && <p className="aq-hint">{computedNotice(progress.error)}</p>}
      </StatsPanel>

      <StatsPanel title={t("stats.stuck")} hint={t("stats.stuckHint")}>
        {stuck.error ? (
          <p className="aq-stats-empty">{computedNotice(stuck.error)}</p>
        ) : stuck.data && stuck.data.length === 0 ? (
          <p className="aq-stats-empty">{t("stats.nobodyStuck")}</p>
        ) : (
          <SortableTable<StuckRow>
            rows={stuck.data ?? []}
            rowId={(row) => `${row.quest}/${row.stage}`}
            initialSort="players"
            columns={[
              { id: "quest", label: t("stats.quest"), value: (r) => questName(r.quest) },
              { id: "stage", label: t("stats.stage"), value: (r) => stageName(r.quest, r.stage) },
              {
                id: "players",
                label: t("stats.waiting"),
                align: "right",
                value: (r) => r.players,
                render: (r) => integer(r.players),
              },
              {
                id: "median",
                label: t("stats.medianWait"),
                align: "right",
                value: (r) => r.medianSeconds,
                render: (r) => duration(r.medianSeconds),
              },
              {
                id: "longest",
                label: t("stats.longestWait"),
                align: "right",
                value: (r) => r.longestSeconds,
                render: (r) => duration(r.longestSeconds),
              },
            ]}
          />
        )}
      </StatsPanel>
    </>
  );
}

function questColumns(
  t: T,
  questName: (key: string) => string,
  integer: (n: number) => string,
  percent: (ratio: number) => string,
  duration: (seconds: number | null) => string,
) {
  const count = (id: "started" | "completed" | "abandoned" | "expired" | "inProgress", label: string) => ({
    id,
    label,
    align: "right" as const,
    value: (line: QuestLine) => line[id],
    render: (line: QuestLine) => integer(line[id]),
  });
  return [
    { id: "quest", label: t("stats.quest"), value: (line: QuestLine) => questName(line.key) },
    count("started", t("stats.started")),
    count("completed", t("stats.completed")),
    {
      id: "unfinished",
      label: t("stats.unfinished"),
      align: "right" as const,
      // A quest nobody started sorts last: it has nothing to say about where players stop.
      value: (line: QuestLine) => line.unfinished ?? -1,
      render: (line: QuestLine) => (line.unfinished === null ? "–" : percent(line.unfinished)),
    },
    count("abandoned", t("stats.abandoned")),
    count("expired", t("stats.expired")),
    count("inProgress", t("stats.inProgress")),
    {
      id: "median",
      label: t("stats.median"),
      align: "right" as const,
      value: (line: QuestLine) => line.medianSeconds ?? -1,
      render: (line: QuestLine) => duration(line.medianSeconds),
    },
  ];
}
