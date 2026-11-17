import type { StatsBreakdownRow } from "@artisan/editor-sdk";
import type { Quest, QuestGroup } from "./model";

/** The Stat events ArtisanQuests records (`QuestStats` on the server). */
export const EVENTS = {
  started: "quests:started",
  completed: "quests:completed",
  abandoned: "quests:abandoned",
  expired: "quests:expired",
} as const;
export type EventKind = keyof typeof EVENTS;
export const EVENT_KINDS = Object.keys(EVENTS) as EventKind[];

/** The figures the server computes from its quest tables (`QuestFigures`). */
export const PROGRESS_QUERY = "quests:progress";
export const STUCK_QUERY = "quests:stuck";

/** A row of `quests:progress`: where a quest stands, all time. */
export interface ProgressRow {
  quest: string;
  started: number;
  inProgress: number;
  completed: number;
  medianSeconds: number | null;
}

/** A row of `quests:stuck`: the quests in progress standing on a stage. */
export interface StuckRow {
  quest: string;
  stage: string;
  players: number;
  medianSeconds: number;
  longestSeconds: number;
}

const num = (value: unknown): number => (typeof value === "number" && Number.isFinite(value) ? value : 0);

export function progressRows(rows: readonly Record<string, unknown>[]): ProgressRow[] {
  return rows.map((r) => ({
    quest: String(r.quest ?? ""),
    started: num(r.started),
    inProgress: num(r.in_progress),
    completed: num(r.completed),
    medianSeconds: typeof r.median_seconds === "number" ? r.median_seconds : null,
  }));
}

export function stuckRows(rows: readonly Record<string, unknown>[]): StuckRow[] {
  return rows.map((r) => ({
    quest: String(r.quest ?? ""),
    stage: String(r.stage ?? ""),
    players: num(r.players),
    medianSeconds: num(r.median_seconds),
    longestSeconds: num(r.longest_seconds),
  }));
}

/** What the period's events say of one quest, with where it stands now. */
export interface QuestLine {
  key: string;
  started: number;
  completed: number;
  abandoned: number;
  expired: number;
  /** Share of the quests started in the period that were not completed in it; null when none started. */
  unfinished: number | null;
  inProgress: number;
  medianSeconds: number | null;
}

/**
 * One line per quest of the group, in the group's order, then the quests the events still
 * name but the group no longer holds (renamed or removed), so no count disappears.
 */
export function questLines(
  quests: readonly Pick<Quest, "key">[],
  counts: Partial<Record<EventKind, readonly StatsBreakdownRow[]>>,
  progress: readonly ProgressRow[],
): QuestLine[] {
  const count = (kind: EventKind, key: string) =>
    counts[kind]?.find((r) => r.value === key)?.count ?? 0;
  const keys = quests.map((q) => q.key);
  for (const kind of EVENT_KINDS)
    for (const row of counts[kind] ?? []) if (!keys.includes(row.value)) keys.push(row.value);
  return keys.map((key) => {
    const started = count("started", key);
    const completed = count("completed", key);
    const now = progress.find((p) => p.quest === key);
    return {
      key,
      started,
      completed,
      abandoned: count("abandoned", key),
      expired: count("expired", key),
      unfinished: started > 0 ? Math.max(0, 1 - completed / started) : null,
      inProgress: now?.inProgress ?? 0,
      medianSeconds: now?.medianSeconds ?? null,
    };
  });
}

export const total = (rows: readonly StatsBreakdownRow[] | undefined): number =>
  (rows ?? []).reduce((sum, r) => sum + r.count, 0);

/** Whether the group hands its quests out in list order: its quests then read as a funnel. */
export function isOrdered(group: Pick<QuestGroup, "distribution">): boolean {
  return group.distribution.strategy === "sequential";
}

/**
 * The funnel of an ordered group, all time: how many started the first quest, then how many
 * completed each quest in order. Empty when nobody started.
 */
export function groupFunnel(
  quests: readonly Pick<Quest, "key">[],
  progress: readonly ProgressRow[],
): { key: string; kind: "started" | "completed"; value: number }[] {
  const first = quests[0];
  if (!first) return [];
  const of = (key: string) => progress.find((p) => p.quest === key);
  const started = of(first.key)?.started ?? 0;
  if (started === 0) return [];
  return [
    { key: first.key, kind: "started", value: started },
    ...quests.map((q) => ({ key: q.key, kind: "completed" as const, value: of(q.key)?.completed ?? 0 })),
  ];
}

/** `45 s`, `12 min`, `3 h 20`, `2 d 4 h`: a duration read at a glance (`day`: the unit of a day, `j` in French). */
export function formatDuration(seconds: number, day = "d"): string {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s} s`;
  const minutes = Math.round(s / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return minutes % 60 === 0 ? `${hours} h` : `${hours} h ${String(minutes % 60).padStart(2, "0")}`;
  const days = Math.floor(hours / 24);
  return hours % 24 === 0 ? `${days} ${day}` : `${days} ${day} ${hours % 24} h`;
}

/** The move of a count against the previous period: `▲ 12 %`; null when there is nothing to compare with. */
export function changeLabel(current: number, previous: number | undefined, lang: string): string | null {
  if (previous === undefined || previous === 0) return null;
  const ratio = (current - previous) / previous;
  const percent = new Intl.NumberFormat(lang, { style: "percent", maximumFractionDigits: 0 }).format(Math.abs(ratio));
  return `${ratio >= 0 ? "▲" : "▼"} ${percent}`;
}
