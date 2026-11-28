import { describe, expect, it } from "vitest";
import { DEFAULT_TEXTS, type QuestHud, hudPackImages, hudPreview, parseHud, serializeHud } from "./hud";

const ctx = { projectId: "quests", lang: "en" };

describe("quest_hud", () => {
  it("reads and writes a file back as it was, unknown keys kept", () => {
    const src = {
      id: "tracked",
      schema: "quest_hud/v1",
      layout: [{ image: "fond", x: -100, y: 0 }, { text: "objective", x: -80, y: 4, width: 160 }],
      texts: { objective: "<white>%objective_name%" },
      note: "kept",
    };
    const { doc, unsupported } = parseHud(src, ctx);
    expect(unsupported).toEqual([]);
    expect(serializeHud(doc as QuestHud)).toEqual({
      id: "tracked",
      schema: "quest_hud/v1",
      note: "kept",
      layout: src.layout,
      texts: { objective: "<white>%objective_name%" },
    });
  });

  it("leaves out texts left empty, and an unknown schema is reported", () => {
    const { doc, unsupported } = parseHud({ id: "a", schema: "quest_hud/v9", texts: { quest: 3 } }, ctx);
    expect(unsupported).toEqual(["schema: quest_hud/v9"]);
    expect(serializeHud(doc as QuestHud)).toEqual({ id: "a", schema: "quest_hud/v1", layout: [] });
  });

  it("asks the pack for the layout's images at the height the layout draws them", () => {
    const images = hudPackImages({ layout: [{ image: "fond", x: -100, y: 2 }, { text: "quest", x: 0, y: 4 }] });
    expect(images).toEqual([{ asset: "fond", rise: -2 }]);
    expect(hudPackImages({ layout: "nope" })).toEqual([]);
  });

  it("previews each named layer with the defaults and sample values", () => {
    const { doc } = parseHud({ id: "a", layout: [] }, ctx);
    const preview = hudPreview(doc as QuestHud, { objective_progress: "0", objective_target: "3" });
    expect(preview.text?.progress).toEqual(["<gray>[<yellow>0<gray>/3]"]);
    expect(preview.text?.quest).toEqual([DEFAULT_TEXTS.quest]);
  });
});
