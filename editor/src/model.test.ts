import { type EditorHost, installEditorHost } from "@artisan/editor-sdk";
import { beforeEach, describe, expect, it } from "vitest";
import {
  type QuestGroup,
  freeKey,
  joinChain,
  chooseKeyChange,
  keepOldKey,
  undecidedKey,
  legacyLabel,
  newObjectiveKey,
  newUid,
  oldKeysOf,
  parseQuestGroup,
  questGroupTextSites,
  rewardSteps,
  serializeQuestGroup,
  slugKey,
  splitChain,
  typedKey,
  readDistribution,
} from "./model";
import {
  itemValue,
  missingParams,
  objectiveSpec,
  objectiveSubject,
  objectiveTarget,
  writeItemParam,
} from "./objectives";

/** The host's text store, reduced to what the codec reads. */
let n = 0;
let texts: Record<string, Record<string, string>> = {};
const project = { defaultLang: "fr" };

beforeEach(() => {
  n = 0;
  texts = {};
  installEditorHost({
    newTextKey: () => `k${++n}`,
    fieldText: (_p: unknown, key: string) => {
      const entry = texts[key] ?? {};
      const langs = Object.keys(entry);
      if (langs.length === 0 || (langs.length === 1 && langs[0] === "fr")) return entry.fr ?? "";
      return { ...entry };
    },
  } as unknown as EditorHost);
});

const daily = {
  id: "daily",
  schema: "quest_group/v1",
  uid: "01JQ8AAAAAAAAAAAAAAAAAAAAA",
  title: { fr: "Quêtes journalières", en: "Daily quests" },
  actor_type: "player",
  window: { start: "2024-01-01T00:00:00Z" },
  reset: { cron: "0 4 * * *", timezone: "Europe/Paris" },
  limits: { max_active: 6, max_per_period: 6 },
  rotation: { enabled: true, max_per_period: 2 },
  distribution: {
    strategy: "random",
    amount: 6,
    triggers: ["actor_load", "period_reset"],
    tiers: { easy: 3 },
  },
  tiers: { easy: { title: { fr: "<green>Facile" } } },
  actions: { quest_complete: [{ type: "command", command: "say done" }] },
  quests: [
    {
      key: "mine_stone_64",
      uid: "01JQ9AAAAAAAAAAAAAAAAAAAAA",
      tier: "easy",
      title: { fr: "Apprenti carrier", en: "Apprentice quarrier" },
      description: "Mine 64 blocs de pierre",
      duration: "24h",
      stages: [
        {
          key: "mining",
          title: { fr: "Minage" },
          flow: "parallel",
          objectives: [{ key: "stone", type: "block_break", material: "STONE", amount: 64 }],
        },
      ],
      actions: { complete: [{ type: "command", command: "levels addxp {player} 150" }] },
      requirements: [{ type: "permission", permission: "quests.vip" }],
    },
  ],
};

function roundTrip(src: Record<string, unknown>) {
  const r = parseQuestGroup(src, { projectId: "p", lang: "fr" });
  Object.assign(texts, r.i18nKeys);
  return { r, out: serializeQuestGroup(r.doc as QuestGroup, project) };
}

describe("quest_group codec", () => {
  it("round-trips a production group without losing a field", () => {
    const { r, out } = roundTrip(daily);
    expect(r.unsupported).toEqual([]);
    // A text in the default language alone is written as a bare string (ADR `field-local-translations`).
    const quest = daily.quests[0]!;
    expect(out).toEqual({
      ...daily,
      tiers: { easy: { title: "<green>Facile" } },
      quests: [{ ...quest, stages: [{ ...quest.stages[0], title: "Minage" }] }],
    });
  });

  it("writes the canonical key order the server's files use", () => {
    const { out } = roundTrip(daily);
    expect(Object.keys(out)).toEqual([
      "id",
      "schema",
      "uid",
      "title",
      "actor_type",
      "window",
      "reset",
      "limits",
      "rotation",
      "distribution",
      "tiers",
      "actions",
      "quests",
    ]);
  });

  it("turns each text into a node and keeps its languages", () => {
    const { r } = roundTrip(daily);
    const group = r.doc as QuestGroup;
    expect(texts[group.title.key]).toEqual({ fr: "Quêtes journalières", en: "Daily quests" });
    expect(texts[group.quests[0]!.description.key]).toEqual({ fr: "Mine 64 blocs de pierre" });
  });

  it("resolves an `{i18n:key}` ref against the project's translations", () => {
    const r = parseQuestGroup(
      { ...daily, title: "{i18n:common.daily}" },
      { projectId: "p", lang: "fr", translations: { "common.daily": { fr: "Jour" } } },
    );
    expect((r.doc as QuestGroup).title.key).toBe("common.daily");
    expect(r.i18nKeys["common.daily"]).toEqual({ fr: "Jour" });
  });

  it("drops what was cleared and keeps an empty group's quest list", () => {
    const { r } = roundTrip({
      id: "empty",
      schema: "quest_group/v1",
      uid: "U",
      title: "Vide",
      actor_type: "player",
    });
    const group = r.doc as QuestGroup;
    group.limits.max_active = undefined;
    expect(serializeQuestGroup(group, project)).toEqual({
      id: "empty",
      schema: "quest_group/v1",
      uid: "U",
      title: "Vide",
      actor_type: "player",
      quests: [],
    });
  });

  it("reports a foreign schema", () => {
    const r = parseQuestGroup(
      { id: "x", schema: "quest_group/v9", quests: [{ key: "a" }] },
      { projectId: "p", lang: "fr" },
    );
    expect(r.unsupported).toEqual(["schema: quest_group/v9"]);
  });
});

describe("identity", () => {
  const handWritten = {
    id: "daily",
    schema: "quest_group/v1",
    title: "Daily",
    actor_type: "player",
    quests: [
      { key: "mine", title: "Mine", stages: [] },
      { key: "fish", title: "Fish", stages: [] },
    ],
  };
  const parse = (src: Record<string, unknown>) =>
    parseQuestGroup(src, { projectId: "p", lang: "fr" }).doc as QuestGroup;
  const written = (group: QuestGroup) =>
    serializeQuestGroup(group, project).quests as Record<string, unknown>[];

  it("writes no uid into a file that has none", () => {
    const group = parse(handWritten);
    const out = serializeQuestGroup(group, project);
    expect("uid" in out).toBe(false);
    for (const quest of written(group)) {
      expect("uid" in quest).toBe(false);
      expect("old_key" in quest).toBe(false);
    }
  });

  it("tells quests apart by their key, the same from one read to the next", () => {
    expect(parse(handWritten).quests.map((q) => q.uid)).toEqual(["mine", "fish"]);
    const twice = parse({ ...handWritten, quests: [handWritten.quests[0], handWritten.quests[0]] });
    expect(new Set(twice.quests.map((q) => q.uid)).size).toBe(2);
  });

  it("keeps the uid of an older file where it was, and gives none to a new quest", () => {
    const group = parse(daily);
    expect(group.quests[0]!.uid).toBe("01JQ9AAAAAAAAAAAAAAAAAAAAA");
    group.quests.push({ ...structuredClone(group.quests[0]!), key: "new", uid: "session", savedUid: undefined, savedKey: undefined, oldKeys: [] });
    const out = written(group);
    expect(out[0]!.uid).toBe("01JQ9AAAAAAAAAAAAAAAAAAAAA");
    expect("uid" in out[1]!).toBe(false);
    expect("old_key" in out[1]!).toBe(false);
  });

  it("writes old_key after key when the key of a quest of the file changes", () => {
    const group = parse(handWritten);
    group.quests[0]!.key = "dig";
    const out = written(group);
    expect(Object.keys(out[0]!).slice(0, 2)).toEqual(["key", "old_key"]);
    expect(out[0]!.old_key).toBe("mine");
    // Read again, changed again: both former keys stay, in order.
    const again = parse(serializeQuestGroup(group, project));
    again.quests[0]!.key = "excavate";
    expect(written(again)[0]!.old_key).toEqual(["mine", "dig"]);
  });

  it("names no former key while the key is only being typed, nor for a quest added since", () => {
    const group = parse(handWritten);
    group.quests[0]!.key = "mi";
    expect(written(group)[0]!.old_key).toBe("mine");
    group.quests[0]!.key = "mine";
    expect("old_key" in written(group)[0]!).toBe(false);

    const added = { ...structuredClone(group.quests[0]!), key: "quest", uid: "s", savedKey: undefined };
    keepOldKey(added, "quest_before");
    expect(added.oldKeys).toEqual([]);
  });

  it("remembers a key left while open, so going back to it keeps what was published in between", () => {
    const group = parse(handWritten);
    const quest = group.quests[0]!;
    quest.key = "dig";
    keepOldKey(quest, "mine");
    quest.key = "mine";
    keepOldKey(quest, "dig");
    expect(written(group)[0]!.old_key).toBe("dig");
  });

  it("asks what becomes of the progress when the key of a saved quest changes, and writes the answer", () => {
    const group = parse(handWritten);
    const quest = group.quests[0]!;
    expect(undecidedKey(quest)).toBeNull();

    quest.key = "dig";
    expect(undecidedKey(quest)).toBe("mine");
    expect(written(group)[0]!.old_key).toBe("mine"); // unanswered: nothing is lost by omission

    chooseKeyChange(quest, "keep");
    expect(undecidedKey(quest)).toBeNull();
    expect(written(group)[0]!.old_key).toBe("mine");

    chooseKeyChange(quest, "reset");
    expect(undecidedKey(quest)).toBeNull();
    expect("old_key" in written(group)[0]!).toBe(false);
    quest.key = "excavate";
    expect(undecidedKey(quest)).toBeNull(); // a new quest now: no progress to ask about
    expect("old_key" in written(group)[0]!).toBe(false);
  });

  it("does not ask again about a key the file already names in old_key", () => {
    const group = parse({ ...handWritten, quests: [{ key: "dig", old_key: "mine", title: "Dig" }] });
    expect(undecidedKey(group.quests[0]!)).toBeNull();
  });

  it("writes old_key on an objective of the file whose key changes, and keeps the ones written by hand", () => {
    const withStages = {
      ...handWritten,
      quests: [
        {
          key: "mine",
          title: "Mine",
          stages: [
            {
              key: "dig",
              objectives: [
                { key: "stone", old_key: "rock", type: "block_break", material: "STONE", amount: 64 },
                { key: "coal", type: "block_break", material: "COAL_ORE", amount: 8 },
              ],
            },
          ],
        },
      ],
    };
    const objectivesOf = (group: QuestGroup) =>
      (written(group)[0]!.stages as { objectives: Record<string, unknown>[] }[])[0]!.objectives;

    const group = parse(withStages);
    expect(objectivesOf(group)).toEqual(withStages.quests[0]!.stages[0]!.objectives);

    const [stone, coal] = group.quests[0]!.stages[0]!.objectives;
    stone!.key = "cobble";
    coal!.key = "charcoal";
    group.quests[0]!.stages[0]!.objectives.push({ key: "iron", type: "block_break", params: { amount: 1 } });
    const out = objectivesOf(group);
    expect(Object.keys(out[0]!).slice(0, 2)).toEqual(["key", "old_key"]);
    expect(out[0]!.old_key).toEqual(["rock", "stone"]);
    expect(out[1]!.old_key).toBe("coal");
    expect("old_key" in out[2]!).toBe(false);

    // A key taken over by another objective is no longer a former key of the first.
    group.quests[0]!.stages[0]!.objectives[2]!.key = "stone";
    expect(objectivesOf(group)[0]!.old_key).toBe("rock");
  });

  it("keeps a quest's former place in another group as it was written", () => {
    const moved = { group: "story", key: "dig" };
    const group = parse({
      ...handWritten,
      quests: [{ key: "mine", old_key: [moved, "pick"], title: "Mine", stages: [] }],
    });
    expect(written(group)[0]!.old_key).toEqual(["pick", moved]);
  });

  it("drops a former key another quest of the group now holds: the server would refuse the file", () => {
    const group = parse({
      ...handWritten,
      quests: [{ key: "dig", old_key: ["mine", "pick"], title: "Dig", stages: [] }, handWritten.quests[1]],
    });
    expect(written(group)[0]!.old_key).toEqual(["mine", "pick"]);
    group.quests[1]!.key = "mine";
    expect(oldKeysOf(group.quests[0]!, new Set(["dig", "mine"]))).toEqual(["pick"]);
    expect(written(group)[0]!.old_key).toBe("pick");
    expect(written(group)[1]!.old_key).toBe("fish");
  });
});

describe("text sites", () => {
  it("addresses quests and stages by key, so a reorder moves no text", () => {
    const { r } = roundTrip(daily);
    const keys = [...questGroupTextSites(r.doc as QuestGroup)].map((s) => s.key);
    expect(keys).toEqual([
      "quest_groups.daily.title",
      "quest_groups.daily.description",
      "quest_groups.daily.tiers.easy.title",
      "quest_groups.daily.quests.mine_stone_64.title",
      "quest_groups.daily.quests.mine_stone_64.description",
      "quest_groups.daily.quests.mine_stone_64.stages.mining.title",
    ]);
  });

  it("never gives two sites the same key, even from a hand-edited file", () => {
    const quest = daily.quests[0]!;
    const { r } = roundTrip({ ...daily, quests: [quest, quest] });
    const keys = [...questGroupTextSites(r.doc as QuestGroup)].map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("keys and ids", () => {
  it("mints time-ordered ULIDs", () => {
    expect(newUid(0) < newUid(1_000_000)).toBe(true);
    expect(newUid()).toHaveLength(26);
  });

  it("makes typed keys safe and unique", () => {
    expect(slugKey("Mine la Pierre ! ")).toBe("mine_la_pierre");
    expect(slugKey("éé")).toBe("ee");
    expect(slugKey("!!")).toBe("quest");
    expect(typedKey("Mine ")).toBe("mine_");
    expect(freeKey("quest", ["quest", "quest_2"])).toBe("quest_3");
  });
});

describe("quest actions at completion", () => {
  it("reads the former `on` keys as `actions`", () => {
    const steps = [{ send_message: "gg" }];
    const { out } = roundTrip({
      ...daily,
      actions: undefined,
      on: { quest_complete: steps },
      quests: [{ ...daily.quests[0], actions: undefined, on: { complete: steps } }],
    });
    expect(out.actions).toEqual({ quest_complete: steps });
    expect(out).not.toHaveProperty("on");
    const quest = (out.quests as Record<string, unknown>[])[0]!;
    expect(quest.actions).toEqual({ complete: steps });
    expect(quest).not.toHaveProperty("on");
  });

  it("treats a null `actions` as absent, like the server", () => {
    const steps = [{ send_message: "gg" }];
    const { out } = roundTrip({
      ...daily,
      actions: null,
      on: { quest_complete: steps },
      quests: [{ ...daily.quests[0], actions: { complete: null }, rewards: steps }],
    });
    expect(out.actions).toEqual({ quest_complete: steps });
    expect((out.quests as Record<string, unknown>[])[0]!.actions).toEqual({ complete: steps });
  });

  it("reads the former `rewards` as actions.complete and drops reward_display", () => {
    const steps = [{ run_command: { command: "levels addxp {actor_name} 150" } }];
    const { out } = roundTrip({
      ...daily,
      quests: [{ ...daily.quests[0], actions: undefined, rewards: steps, reward_display: ["+150 XP"] }],
    });
    const quest = (out.quests as Record<string, unknown>[])[0]!;
    expect(quest.actions).toEqual({ complete: steps });
    expect(quest).not.toHaveProperty("rewards");
    expect(quest).not.toHaveProperty("reward_display");
  });
});

describe("rewards (Artisan chain steps)", () => {
  it("hands the keyed steps to the chain editor and keeps legacy ones apart", () => {
    const legacy = { type: "command", command: "say hi" };
    const { chain, legacy: kept } = splitChain([{ give_item: "DIAMOND" }, legacy, "close"]);
    expect(chain).toEqual([{ give_item: "DIAMOND" }, "close"]);
    expect(kept).toEqual([legacy]);
    expect(joinChain([{ send_message: "gg" }], kept)).toEqual([{ send_message: "gg" }, legacy]);
    expect(legacyLabel(legacy)).toBe("command · say hi");
  });
  it("reads one step alone and writes nothing for an empty chain", () => {
    expect(splitChain({ give_item: "DIAMOND" }).chain).toEqual([{ give_item: "DIAMOND" }]);
    expect(splitChain(undefined)).toEqual({ chain: [], legacy: [] });
    expect(joinChain([], [])).toBeUndefined();
    expect(rewardSteps({ give_item: "DIAMOND" })).toEqual([{ give_item: "DIAMOND" }]);
  });
});

describe("objectives", () => {
  it("keys a new objective by its type and a random suffix, never a taken key", () => {
    const key = newObjectiveKey("block_break", ["block_break"]);
    expect(key).toMatch(/^block_break_[0-9a-z]{4}$/);
    expect(newObjectiveKey("block_break", [key])).not.toBe(key);
  });

  it("says what an objective asks and what it lacks", () => {
    expect(objectiveSubject("deliver_item", { material: "COPPER_BLOCK", amount: 6912 })).toBe(
      "COPPER_BLOCK",
    );
    expect(objectiveTarget({ distance: 500 })).toBe(500);
    expect(missingParams("harvest_crop", { amount: 1 })).toEqual(["crop"]);
    expect(missingParams("block_break", { amount: 1 })).toEqual([]);
    expect(objectiveSubject("custom", { zone: "spawn", amount: 2 })).toBe("spawn");
  });

  it("reads an objective's item, the legacy bare material included", () => {
    const spec = objectiveSpec("fishing")!.params[0]!;
    expect(itemValue({ fish_type: "COD" }, spec)).toEqual({ material: "COD" });
    expect(itemValue({ item: { material: "item:rod" }, fish_type: "COD" }, spec)).toEqual({
      material: "item:rod",
    });
    expect(itemValue({ amount: 1 }, spec)).toEqual({});
    expect(
      objectiveSubject("craft_item", { item: { material: "DIAMOND_SWORD", title: "<red>Excalibur" } }),
    ).toBe("Excalibur");
    expect(objectiveSubject("fishing", { item: { material: "nexo:ruby_fish" } })).toBe("nexo:ruby_fish");
  });

  it("writes an item over the legacy material, and clears it to any item", () => {
    const spec = objectiveSpec("fishing")!.params[0]!;
    const params: Record<string, unknown> = { fish_type: "COD", amount: 2 };
    writeItemParam(params, spec, { material: "COD", enchants: { lure: 3 } }, ["material", "enchants"]);
    expect(params).toEqual({
      amount: 2,
      item: { material: "COD", enchants: { lure: 3 } },
      match: ["material", "enchants"],
    });
    writeItemParam(params, spec, params.item as Record<string, unknown>, undefined);
    expect(params.match).toBeUndefined();
    writeItemParam(params, spec, {}, ["material"]);
    expect(params).toEqual({ amount: 2 });
  });
});

describe("the group's board node", () => {
  const host = (texts: Record<string, string>) =>
    installEditorHost({
      text: (_p: unknown, key: string) => texts[key] ?? "",
    } as unknown as EditorHost);
  const quest = (uid: string, key: string, tier: string, stages: unknown[] = []) => ({
    uid,
    key,
    tier,
    title: { key: `${uid}.title` },
    description: { key: `${uid}.desc` },
    stages,
  });

  it("lists one row per quest, titled, keyed by its uid, the objectives in its tooltip", async () => {
    const { questGroupKind } = await import("./questGroupKind");
    host({ "U1.title": "<gold>Miner", "U1.desc": "Dig a little" });
    const doc = {
      distribution: {},
      quests: [
        quest("U1", "mine", "easy", [
          {
            title: { key: "s1" },
            objectives: [{ key: "o1", type: "break_block", params: { amount: 64 } }],
          },
        ]),
        quest("U2", "fish", ""),
      ],
    };
    const rows = questGroupKind.board?.items?.(doc, { project: {}, lang: "en" });
    expect(rows?.map((r) => [r.id, r.label, r.detail, r.marker])).toEqual([
      ["U1", "Miner", "easy", undefined],
      ["U2", "fish", undefined, undefined],
    ]);
    expect(rows?.[0]?.hover?.title).toBe("<gold>Miner");
    expect(rows?.[0]?.hover?.text).toBe("Dig a little");
    expect(rows?.[0]?.hover?.lines).toHaveLength(1);
    expect(rows?.[0]?.hover?.lines?.[0]).toContain("0/64");
  });

  it("shows a quest's first objective under its title, with how many follow", async () => {
    const { questGroupKind } = await import("./questGroupKind");
    host({});
    const objective = (key: string, amount: number) => ({
      key,
      type: "break_block",
      params: { amount },
    });
    const doc = {
      distribution: {},
      quests: [
        quest("U1", "one", "", [{ title: { key: "s1" }, objectives: [objective("o1", 64)] }]),
        quest("U2", "three", "", [
          { title: { key: "s1" }, objectives: [objective("o1", 8), objective("o2", 2)] },
          { title: { key: "s2" }, objectives: [objective("o3", 1)] },
        ]),
        quest("U3", "none", ""),
      ],
    };
    const captions = questGroupKind.board
      ?.items?.(doc, { project: {}, lang: "en" })
      .map((r) => r.caption);
    expect(captions?.[0]).toMatch(/0\/64$/);
    expect(captions?.[1]).toMatch(/0\/8 \+2$/);
    expect(captions?.[2]).toBeUndefined();
  });

  it("numbers the quests when the group hands them out in list order", async () => {
    const { questGroupKind } = await import("./questGroupKind");
    host({});
    const doc = {
      distribution: { strategy: "SEQUENTIAL" },
      quests: [quest("U1", "a", ""), quest("U2", "b", "")],
    };
    const rows = questGroupKind.board?.items?.(doc, { project: {}, lang: "fr" });
    expect(rows?.map((r) => r.marker)).toEqual(["1", "2"]);
    expect(questGroupKind.board?.summary?.(doc, { project: {}, lang: "fr" })).toBe(
      "2 quêtes · dans l'ordre",
    );
  });
});

describe("the former ladder strategy", () => {
  it("is read as sequential, whatever its case, and other strategies are left alone", () => {
    expect(readDistribution({ strategy: "ladder", amount: 1 })).toEqual({ strategy: "sequential", amount: 1 });
    expect(readDistribution({ strategy: "LADDER" })).toEqual({ strategy: "sequential" });
    expect(readDistribution({ strategy: "RANDOM" })).toEqual({ strategy: "RANDOM" });
    expect(readDistribution(undefined)).toEqual({});
  });
});
