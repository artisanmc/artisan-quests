import { describe, expect, it } from "vitest";
import { translator } from "./i18n";
import type { Quest } from "./model";
import {
  completedWhen,
  conditionsText,
  duplicateQuest,
  objectiveSentence,
  questActionCount,
  questIncomplete,
  actorChoices,
  lineValues,
  withLine,
} from "./questList";

const t = translator("en");

function quest(over: Partial<Quest> = {}): Quest {
  return {
    key: "level_2",
    uid: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
    savedUid: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
    savedKey: "level_2",
    oldKeys: ["level_two"],
    oldPlaces: [],
    tier: "",
    title: { key: "t.title" },
    description: { key: "t.description" },
    duration: "",
    stages: [
      {
        key: "stage_1",
        title: { key: "t.stage" },
        flow: "parallel",
        objectives: [{ key: "break", type: "block_break", params: { material: "STONE", amount: 64 } }],
        rest: {},
      },
    ],
    rest: {},
    ...over,
  };
}

describe("the quest list's rows", () => {
  it("says an objective as its amount and what it is about", () => {
    expect(objectiveSentence(t, quest().stages[0]!.objectives[0]!)).toBe("Break blocks · 64 × STONE");
    expect(objectiveSentence(t, { key: "k", type: "kill_entity", params: { amount: 5 } })).toBe(
      "Kill mobs · 5",
    );
    expect(objectiveSentence(t, { key: "t", type: "talk_npc", params: { npc: "bruno" } })).toBe(
      "Talk to an NPC · bruno",
    );
  });

  it("flags a quest whose objective misses a required field or repeats a key", () => {
    expect(questIncomplete(quest())).toBe(false);
    const missing = quest();
    missing.stages[0]!.objectives.push({ key: "talk", type: "talk_npc", params: {} });
    expect(questIncomplete(missing)).toBe(true);
    const twice = quest();
    twice.stages[0]!.objectives.push({ ...twice.stages[0]!.objectives[0]! });
    expect(questIncomplete(twice)).toBe(true);
  });

  it("counts the steps of every event", () => {
    expect(questActionCount(quest())).toBe(0);
    expect(
      questActionCount(quest({ rest: { actions: { complete: [{ a: 1 }, { b: 2 }], start: [{ c: 3 }] } } })),
    ).toBe(3);
  });

  it("reads completed_when as a list and says expressions in words", () => {
    expect(completedWhen({})).toEqual([]);
    expect(completedWhen({ completed_when: "guild_level >= 2" })).toEqual(["guild_level >= 2"]);
    expect(conditionsText(["guild_level >= 2", "online"])).toBe("guild_level >= 2 · online");
    expect(conditionsText([{ expression: "guild_level >= 10" }])).toBe("guild_level >= 10");
    expect(conditionsText([{ expression: "guild_level >= 10" }, { permission: "a.b" }])).toBeNull();
    expect(conditionsText([{ type: "permission" }])).toBeNull();
  });
});

describe("duplicating a quest", () => {
  it("gives the copy its own uid, key and text nodes, and keeps the rest", () => {
    const original = quest({ rest: { completed_when: ["guild_level >= 2"] } });
    let n = 0;
    const copy = duplicateQuest(original, ["level_2", "level_2_copy"], () => ({ key: `new.${n++}` }));
    expect(copy.uid).not.toBe(original.uid);
    // A quest of its own: nothing of the original's past, or its progress would follow the copy.
    expect(copy.savedUid).toBeUndefined();
    expect(copy.savedKey).toBeUndefined();
    expect(copy.oldKeys).toEqual([]);
    expect(copy.key).toBe("level_2_copy_2");
    expect([copy.title.key, copy.description.key, copy.stages[0]!.title.key]).toEqual([
      "new.0",
      "new.1",
      "new.2",
    ]);
    expect(copy.stages[0]!.objectives).toEqual(original.stages[0]!.objectives);
    expect(copy.rest).toEqual(original.rest);
    expect(original.title.key).toBe("t.title");
  });
});

describe("actorChoices", () => {
  it("offers the server's list, in its order", () => {
    expect(actorChoices(undefined, "guild", ["player", "global", "guild"])).toEqual([
      "player",
      "global",
      "guild",
    ]);
  });

  it("keeps a group's type the server does not know", () => {
    expect(actorChoices(undefined, "faction", ["player", "global"])).toEqual([
      "player",
      "global",
      "faction",
    ]);
  });

  it("without the server's list, offers the types the project's groups use", () => {
    const project = { documents: { quest_group: [{ actorType: "guild" }, { actorType: "player" }] } };
    expect(actorChoices(project, "global")).toEqual(["player", "global", "guild"]);
    expect(actorChoices(project, "global", [])).toEqual(["player", "global", "guild"]);
  });
});

describe("an NPC's line", () => {
  it("reads a bare text in the default language and a text per language as written", () => {
    expect(lineValues("Merci.", "fr")).toEqual({ fr: "Merci." });
    expect(lineValues({ fr: "Merci.", en: "Thanks.", de: "" }, "fr")).toEqual({ fr: "Merci.", en: "Thanks." });
    expect(lineValues(undefined, "fr")).toEqual({});
  });

  it("is saved per language, and leaves the file once empty", () => {
    expect(withLine("Merci.", "fr", "en", "Thanks.")).toEqual({ fr: "Merci.", en: "Thanks." });
    expect(withLine({ fr: "Merci." }, "fr", "fr", "")).toBeUndefined();
  });
});
