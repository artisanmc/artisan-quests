import { describe, expect, it } from "vitest";
import {
  changeLabel,
  formatDuration,
  groupFunnel,
  isOrdered,
  progressRows,
  questLines,
  stuckRows,
  total,
} from "./stats";

const row = (value: string, count: number) => ({ value, count, sum: count, min: 1, max: 1 });

describe("quest statistics", () => {
  it("reads the server's rows, whatever is missing", () => {
    expect(progressRows([{ quest: "a", started: 4, in_progress: 1, completed: 2, median_seconds: 90 }, {}])).toEqual([
      { quest: "a", started: 4, inProgress: 1, completed: 2, medianSeconds: 90 },
      { quest: "", started: 0, inProgress: 0, completed: 0, medianSeconds: null },
    ]);
    expect(stuckRows([{ quest: "a", stage: "s", players: 3, median_seconds: 60, longest_seconds: 600 }])).toEqual([
      { quest: "a", stage: "s", players: 3, medianSeconds: 60, longestSeconds: 600 },
    ]);
  });

  it("gives a line per quest in the group's order, then the quests only the events name", () => {
    const lines = questLines(
      [{ key: "mine" }, { key: "fish" }],
      {
        started: [row("mine", 10), row("old", 2)],
        completed: [row("mine", 4)],
        abandoned: [row("mine", 1)],
      },
      [{ quest: "mine", started: 50, inProgress: 5, completed: 30, medianSeconds: 120 }],
    );
    expect(lines.map((l) => l.key)).toEqual(["mine", "fish", "old"]);
    expect(lines[0]).toEqual({
      key: "mine",
      started: 10,
      completed: 4,
      abandoned: 1,
      expired: 0,
      unfinished: 0.6,
      inProgress: 5,
      medianSeconds: 120,
    });
    expect(lines[1]?.unfinished).toBeNull();
    expect(lines[2]?.unfinished).toBe(1);
    expect(total([row("a", 2), row("b", 3)])).toBe(5);
    expect(total(undefined)).toBe(0);
  });

  it("reads an ordered group as a funnel from the first start to each completion", () => {
    expect(isOrdered({ distribution: { strategy: "sequential" } })).toBe(true);
    expect(isOrdered({ distribution: { strategy: "random" } })).toBe(false);
    const progress = [
      { quest: "one", started: 100, inProgress: 10, completed: 80, medianSeconds: null },
      { quest: "two", started: 70, inProgress: 20, completed: 40, medianSeconds: null },
    ];
    expect(groupFunnel([{ key: "one" }, { key: "two" }, { key: "three" }], progress)).toEqual([
      { key: "one", kind: "started", value: 100 },
      { key: "one", kind: "completed", value: 80 },
      { key: "two", kind: "completed", value: 40 },
      { key: "three", kind: "completed", value: 0 },
    ]);
    expect(groupFunnel([{ key: "one" }], [])).toEqual([]);
    expect(groupFunnel([], progress)).toEqual([]);
  });

  it("writes durations and changes short", () => {
    expect(formatDuration(45)).toBe("45 s");
    expect(formatDuration(12 * 60)).toBe("12 min");
    expect(formatDuration(3 * 3600 + 20 * 60)).toBe("3 h 20");
    expect(formatDuration(2 * 3600)).toBe("2 h");
    expect(formatDuration(2 * 86400 + 4 * 3600)).toBe("2 d 4 h");
    expect(formatDuration(3 * 86400, "j")).toBe("3 j");
    expect(changeLabel(112, 100, "en")).toBe("▲ 12%");
    expect(changeLabel(50, 100, "en")).toBe("▼ 50%");
    expect(changeLabel(5, 0, "en")).toBeNull();
    expect(changeLabel(5, undefined, "en")).toBeNull();
  });
});
