import type { DocumentKindContribution } from "@artisan/editor-sdk";
import { QuestHudEditor } from "./QuestHudEditor";
import { HUD_COLLECTION_LABELS, HUD_LABELS } from "./i18n";
import { QuestIcon } from "./icon";
import { QUESTS_FOLDER } from "./model";
import {
  HUD_DIR,
  HUD_KIND,
  HUD_SCHEMA,
  HUD_START,
  type QuestHud,
  hudPackImages,
  parseHud,
  serializeHud,
} from "./hud";

/**
 * The `quest_hud` kind: one file per HUD of the tracked quest, in the module's folder. Its images
 * go into the server's pack at the heights the layout draws them (`pack.images`, SDK 1.13).
 */
export const questHudKind: DocumentKindContribution & { wide?: boolean } = {
  kind: HUD_KIND,
  dir: HUD_DIR,
  schemaVersion: HUD_SCHEMA,
  projects: [QUESTS_FOLDER],
  collection: { labels: HUD_COLLECTION_LABELS },
  label: HUD_LABELS.en,
  labels: HUD_LABELS,
  icon: QuestIcon,
  component: QuestHudEditor,
  // The composer lays its layers, the screen and the panel side by side.
  wide: true,
  create: ({ id, projectId }) =>
    ({ id, projectId, layout: structuredClone(HUD_START), texts: {}, rest: {} }) satisfies QuestHud,
  parse: (src, ctx) => parseHud(src, ctx),
  serialize: (doc) => serializeHud(doc as QuestHud),
  pack: { images: hudPackImages },
};
