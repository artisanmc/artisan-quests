import {
  type DocumentParseContext,
  type DocumentParseResult,
  type OverlayPreviewContent,
  type PackImage,
  type PackImageByBottom,
  overlayPackImages,
  readOverlayLayout,
} from "@artisan/editor-sdk";

/**
 * The `quest_hud` kind: how the quest a player tracks is drawn at the top of the screen (Artisan's
 * boss bar slot, API 1.13.0) for a player who has the pack. One file per HUD in `quest_huds/`;
 * `tracking.bossbar.hud` of the plugin's config.yml names the one in use. Twin of
 * `QuestHudReader` and `QuestHudPackImages` on the plugin's side.
 */
export const HUD_KIND = "quest_hud";
export const HUD_DIR = "quest_huds";
export const HUD_SCHEMA = "quest_hud/v1";

/** The named layers the plugin fills, each a `text` layer of the layout. */
export const HUD_SLOTS = ["quest", "objective", "progress"] as const;
export type HudSlot = (typeof HUD_SLOTS)[number];

/**
 * What each named layer shows when the file says nothing: MiniMessage with the objective's and
 * the quest's variables (`{objective_name}`, `{objective_progress}`, `{objective_target}`,
 * `{quest_name}`…). Same as `QuestHud.DEFAULT_TEXTS`.
 */
export const DEFAULT_TEXTS: Record<HudSlot, string> = {
  quest: "<gold>{quest_name}",
  objective: "<white>{objective_name}",
  progress: "<gray>[<yellow>{objective_progress}<gray>/{objective_target}]",
};

export type Raw = Record<string, unknown>;

export interface QuestHud {
  id: string;
  projectId: string;
  /** The layout as the file holds it: a YAML list of layers (`OverlayLayout`). */
  layout: unknown[];
  /** The text of each named layer the file sets; the others show `DEFAULT_TEXTS`. */
  texts: Partial<Record<HudSlot, string>>;
  /** The file's other keys, written back as they were. */
  rest: Raw;
}

/**
 * A new HUD: one line, centred under the top of the screen, the objective followed by its count.
 * One text rather than two side by side: the objective's name has no fixed width, so a count
 * in a layer of its own overlaps a long name or floats away from a short one. The `progress`
 * layer stays for a layout that wants the count elsewhere (under the line, beside an icon).
 */
export const HUD_START: unknown[] = [{ text: "objective", x: -150, y: 6, width: 300, align: "center" }];

/** The texts of a new HUD: its one line carries the count. */
export const HUD_START_TEXTS: Partial<Record<HudSlot, string>> = {
  objective: "<white>{objective_name} <gray>[<yellow>{objective_progress}<gray>/{objective_target}]",
};

const isMap = (v: unknown): v is Raw => typeof v === "object" && v !== null && !Array.isArray(v);

export function parseHud(src: Raw, ctx: DocumentParseContext): DocumentParseResult {
  const unsupported: string[] = [];
  if (src.schema !== undefined && src.schema !== HUD_SCHEMA) unsupported.push(`schema: ${String(src.schema)}`);
  const texts: Partial<Record<HudSlot, string>> = {};
  const rawTexts = isMap(src.texts) ? src.texts : {};
  for (const slot of HUD_SLOTS) {
    const value = rawTexts[slot];
    if (typeof value === "string") texts[slot] = value;
  }
  const rest: Raw = {};
  for (const [key, value] of Object.entries(src))
    if (!["id", "schema", "layout", "texts"].includes(key)) rest[key] = value;
  const doc: QuestHud = {
    id: typeof src.id === "string" ? src.id : "",
    projectId: ctx.projectId,
    layout: Array.isArray(src.layout) ? src.layout : [],
    texts,
    rest,
  };
  return { doc, i18nKeys: {}, unsupported };
}

export function serializeHud(hud: QuestHud): Raw {
  const texts: Raw = {};
  for (const slot of HUD_SLOTS) {
    const value = hud.texts[slot];
    if (value !== undefined && value !== "") texts[slot] = value;
  }
  return {
    id: hud.id,
    schema: HUD_SCHEMA,
    ...hud.rest,
    layout: hud.layout,
    ...(Object.keys(texts).length ? { texts } : {}),
  };
}

/**
 * What a HUD's file asks of the pack: each image of its layout where the layout draws it
 * (`pack.images`, SDK 1.13). Twin of `QuestHudPackImages.java`: same images, same order.
 */
export function hudPackImages(src: Raw): (PackImage | PackImageByBottom)[] {
  return overlayPackImages(readOverlayLayout(Array.isArray(src.layout) ? src.layout : []).layers);
}

/** The text a named layer shows, the default when the file sets none. */
export function hudText(hud: QuestHud, slot: HudSlot): string {
  const value = hud.texts[slot];
  return value === undefined || value === "" ? DEFAULT_TEXTS[slot] : value;
}

/**
 * Variables filled with a sample, so that the composer shows what a player reads: `{name}`, or the
 * older `%name%`. Same as `QuestHud.fill`.
 */
export function sampleText(source: string, sample: Record<string, string>): string {
  return source.replace(/\{([a-z_]+)\}|%([a-z_]+)%/g, (all, braced?: string, percent?: string) => {
    return sample[(braced ?? percent) as string] ?? all;
  });
}

/** The composer's preview: each named layer's text with sample values. */
export function hudPreview(hud: QuestHud, sample: Record<string, string>): OverlayPreviewContent {
  const text: Record<string, string[]> = {};
  for (const slot of HUD_SLOTS) text[slot] = [sampleText(hudText(hud, slot), sample)];
  return { text };
}
