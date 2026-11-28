import { type FrontendModule, SDK_VERSION } from "@artisan/editor-sdk";
import { QuestStatsTab } from "./QuestStatsTab";
import { questGroupKind } from "./questGroupKind";
import { questHudKind } from "./questHudKind";
import { questsLocalRows } from "./sourceRows";

/**
 * The editor view of ArtisanQuests (presence id `msquests`): the `quest_group` kind.
 * Built into the editor as a fallback, and built as a bundle (`npm run build:bundle`)
 * that the plugin's jar serves, so the view matches the installed plugin.
 */
const questsModule: FrontendModule = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: SDK_VERSION,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  // The groups, and the HUD of the tracked quest at the top of the screen (SDK 1.24).
  documents: [questGroupKind, questHudKind],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: questsLocalRows,
  // The Quests tab of the server's Statistics space (SDK 1.23).
  stats: { label: { en: "Quests", fr: "Quêtes" }, component: QuestStatsTab },
};

export default questsModule;
