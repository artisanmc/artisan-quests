import { createModuleI18n as Dt, fieldText as It, newTextKey as F, injectModuleStyles as je, useServerDocuments as Pt, textValue as R, useStatsRead as ie, statsQuery as Me, StatCard as Mt, StatsPanel as ye, Funnel as Ht, SortableTable as He, statsBreakdown as Kt, useProject as Ut, useContentLang as Qt, SortableList as Ce, Button as V, ConditionsEditor as Ft, updateDocument as tt, selectDocumentItem as Gt, projectLangs as nt, LocalizedField as at, MiniMessageInput as Se, textValues as st, McText as re, useUiLang as it, useOptionList as zt, ActionChainEditor as Wt, mcWrap as Bt, ItemInput as Vt, MaterialInput as Yt, overlayPackImages as Jt, readOverlayLayout as Zt, OverlayComposer as Xt, SDK_VERSION as en } from "@artisan/editor-sdk";
import { jsx as r, jsxs as f, Fragment as H } from "react/jsx-runtime";
import { useState as I, useEffect as Ae, useRef as rt } from "react";
const G = {
  kindLabel: "Quest groups",
  collection: "Quest groups",
  title: "Title",
  description: "Description",
  actorType: "Who plays",
  "actor.player": "Each player",
  "actor.global": "The whole server",
  "actor.guild": "Each guild",
  actorUnknown: 'This server has no "{{type}}" actor type: its plugin is missing.',
  reset: "Period reset",
  cron: "Schedule (cron)",
  cronInvalid: "A cron has 5 fields: minute hour day month weekday.",
  nextRun: "next: {{when}}",
  noReset: "Never resets",
  distribution: "Distribution",
  strategy: "How quests are handed out",
  "strategy.none": "All at once",
  "strategy.random": "At random",
  completedWhen: "Completed if",
  completedWhenHint: "The quest counts as completed as soon as these conditions hold, played or not, and the next one becomes the active quest. While they do not hold, it stays to be done.",
  completedWhenEmpty: "Only once the quest is completed",
  amount: "Quests handed out",
  triggers: "Hand out when",
  "trigger.actor_load": "the player joins",
  "trigger.period_reset": "the period resets",
  "trigger.quest_complete": "a quest is completed",
  perTier: "Quests per period",
  maxActive: "Active at once",
  questsPerPeriod: "Quests per period",
  rotationsPerPeriod: "Rotations per period",
  noLimit: "No limit",
  rotationEnabled: "Rotate quests",
  tiers: "Tiers",
  tierKey: "Key",
  addTier: "Add a tier",
  noTier: "No tier",
  quests: "Quests",
  questCount: "{{count}} quests",
  questCountOne: "1 quest",
  addQuest: "New quest",
  newQuestTitle: "New quest",
  remove: "Remove",
  key: "Key",
  keyTaken: "Another quest of this group has this key.",
  formerKeys: "Formerly {{keys}}: players keep their progress.",
  forgetFormerKeys: "Start from zero instead",
  keyChanged: "The key changes from {{from}} to {{to}}.",
  keyChangeAsk: "What becomes of the progress players have on this quest?",
  keyChangeKeep: "Keep it",
  keyChangeKeepHint: "The progress saved under {{from}} follows to the new key (old_key is written). Done once per database when the file is published.",
  keyChangeReset: "Start from zero",
  keyChangeResetHint: "The quest counts as new: the progress saved under {{from}} is left where it is and no longer used.",
  keyChangeUnanswered: "Without an answer the progress is kept. The publish screen says how many players are concerned.",
  objectiveKeyTaken: "Another objective of this quest has this key: they would share their progress.",
  tier: "Tier",
  duration: "Time limit",
  durationInvalid: "Write a duration such as 24h, 1h30m or 90s.",
  stages: "Stages",
  stage: "Stage {{n}}",
  addStage: "Add a stage",
  flow: "Order of the objectives",
  "flow.parallel": "In any order",
  "flow.sequential": "One after the other",
  addObjective: "Add an objective",
  type: "Type",
  questEvents: "Quest events",
  "questHook.start": "The quest starts",
  "questHook.objective_progress": "An objective progresses",
  "questHook.objective_complete": "An objective is completed",
  "questHook.complete": "The quest is completed",
  addEvent: "Add an event…",
  removeEvent: "Remove this event and its actions",
  legacySteps: "Old MSQuests format, kept as is: the server converts it on load, /msquests migrate rewrites it.",
  hooks: "Group events",
  "hook.distribution": "Quests are handed out",
  "hook.actor_load": "A player is loaded",
  "hook.quest_start": "A quest starts",
  "hook.objective_progress": "An objective progresses",
  "hook.objective_complete": "An objective is completed",
  "hook.quest_complete": "A quest is completed",
  "hook.period_complete": "Every quest of the period is completed",
  more: "More options",
  objectiveKeyHint: "Progress is stored under this key: changing it resets the progress of the players doing this quest.",
  stageName: "Stage name",
  stageNameDefault: "Name (default: Stage {{n}})",
  questName: "Quest name",
  questDescription: "Quest description",
  objectives: "Objectives",
  missing: "To fill: {{fields}}",
  kept: "Kept as is: {{fields}}",
  preview: "In game",
  noQuests: "No quest yet.",
  "objective.block_break": "Break blocks",
  "objective.craft_item": "Craft items",
  "objective.harvest_crop": "Harvest crops",
  "objective.fishing": "Fish",
  "objective.deliver_item": "Deliver items",
  "objective.talk_npc": "Talk to an NPC",
  "objective.kill_entity": "Kill mobs",
  "objective.breed_animal": "Breed animals",
  "objective.travel": "Travel",
  "objective.execute_command": "Run a command",
  "objective.placeholder": "Reach a placeholder value",
  "param.material": "Material",
  "param.item": "Item",
  "param.crop": "Crop",
  "param.fish_type": "Fish",
  "param.amount": "Amount",
  "param.itemKey": "Custom item key",
  "param.entity_type": "Entity",
  "param.distance": "Distance (blocks)",
  "param.command": "Command",
  "param.placeholder": "Placeholder",
  "param.value": "Value",
  "param.npc": "NPC",
  "param.line": "What the NPC says",
  "param.missing_line": "What the NPC says while items are missing",
  giverLine: "What the NPC says to offer it",
  lineHint: "Said by the NPC's speaker, like a conversation's page. A conversation named beside it is played instead.",
  "param.conversation": "Conversation",
  "param.missing": "Conversation while items are missing",
  giverNpc: "Given by the NPC",
  giverConversation: "Conversation of the offer",
  giverDistributed: "This group also hands its quests out by itself: a player may receive this one before meeting the NPC.",
  any: "any",
  groupSettings: "Group settings",
  questSettings: "Quest settings",
  identity: "Identity",
  "strategy.ordered": "In order",
  "reset.never": "Never",
  "reset.daily": "Every day",
  "reset.weekly": "Every week",
  "reset.monthly": "Every month",
  "reset.custom": "Cron…",
  resetTime: "Time",
  resetDay: "Day",
  resetDayOfMonth: "Day of the month",
  duplicate: "Duplicate",
  cancel: "Cancel",
  removeConfirm: "Remove “{{name}}”?",
  moreActions: "More actions",
  toComplete: "To complete",
  noObjectivesShort: "No objective",
  actionCount: "{{count}} actions",
  actionCountOne: "1 action",
  eventCount: "Events: {{count}}",
  tierCount: "Tiers: {{count}}",
  noTimeLimit: "No time limit",
  conditionCount: "Conditions: {{count}}",
  givenBy: "Given by {{npc}}",
  "stats.group": "Quest group",
  "stats.noGroup": "No quest group on this server yet.",
  "stats.started": "Started",
  "stats.completed": "Completed",
  "stats.abandoned": "Abandoned",
  "stats.expired": "Expired",
  "stats.overPeriod": "over the period",
  "stats.unavailable": "These numbers could not be read.",
  "stats.funnel": "Progress through the group",
  "stats.allTime": "all time, every player",
  "stats.funnelStarted": "Started {{quest}}",
  "stats.funnelCompleted": "Completed {{quest}}",
  "stats.quests": "Quests",
  "stats.questsHint": "sorted by where players do not finish",
  "stats.quest": "Quest",
  "stats.unfinished": "Not finished",
  "stats.inProgress": "In progress now",
  "stats.median": "Median time",
  "stats.stuck": "Where it gets stuck",
  "stats.stuckHint": "the stage each quest in progress stands on, now",
  "stats.stage": "Stage",
  "stats.waiting": "Players on it",
  "stats.medianWait": "Median time on it",
  "stats.longestWait": "Longest",
  "stats.nobodyStuck": "No quest of this group is in progress.",
  "stats.noQuestYet": "Nothing recorded for this group over the period.",
  "stats.offline": "The server must be online to compute these numbers.",
  "stats.notComputed": "These numbers need ArtisanQuests reading its quests from Artisan (content_source: artisan).",
  "stats.day": "d",
  "hud.kindLabel": "Tracked quest HUD",
  "hud.collection": "Tracked quest HUDs",
  "hud.layout": "Layout",
  "hud.layoutHint": "Drawn at the top of the screen for the quest a player tracks, once tracking.bossbar.hud names this file in config.yml. A player without the resource pack keeps the boss bar.",
  "hud.texts": "Texts",
  "hud.textsHint": "MiniMessage with the objective's variables: type { to insert {objective_name}, {objective_progress}, {objective_target}, {quest_name}. Empty: the default shown in grey.",
  "hud.slot.quest": "Quest",
  "hud.slot.objective": "Objective",
  "hud.slot.progress": "Progress",
  "hud.sample.quest": "The alchemist",
  "hud.sample.objective": "Brew 3 potions of Night Vision"
}, Y = {
  kindLabel: "Groupes de quêtes",
  collection: "Groupes de quêtes",
  title: "Titre",
  description: "Description",
  actorType: "Qui joue",
  "actor.player": "Chaque joueur",
  "actor.global": "Tout le serveur",
  "actor.guild": "Chaque guilde",
  actorUnknown: "Ce serveur n'a pas de type d'acteur « {{type}} » : son plugin manque.",
  reset: "Réinitialisation",
  cron: "Planification (cron)",
  cronInvalid: "Un cron a 5 champs : minute heure jour mois jour-de-semaine.",
  nextRun: "prochaine : {{when}}",
  noReset: "Jamais réinitialisé",
  distribution: "Distribution",
  strategy: "Comment les quêtes sont données",
  "strategy.none": "Toutes d'un coup",
  "strategy.random": "Au hasard",
  completedWhen: "Complétée si",
  completedWhenHint: "La quête compte comme terminée dès que ces conditions sont vraies, qu'elle ait été jouée ou non, et la suivante devient la quête active. Tant qu'elles sont fausses, elle reste à faire.",
  completedWhenEmpty: "Seulement une fois la quête terminée",
  amount: "Quêtes données",
  triggers: "Donner quand",
  "trigger.actor_load": "le joueur se connecte",
  "trigger.period_reset": "la période se réinitialise",
  "trigger.quest_complete": "une quête est terminée",
  perTier: "Quêtes par période",
  maxActive: "Actives en même temps",
  questsPerPeriod: "Quêtes par période",
  rotationsPerPeriod: "Rotations par période",
  noLimit: "Sans limite",
  rotationEnabled: "Faire tourner les quêtes",
  tiers: "Paliers",
  tierKey: "Clé",
  addTier: "Ajouter un palier",
  noTier: "Aucun palier",
  quests: "Quêtes",
  questCount: "{{count}} quêtes",
  questCountOne: "1 quête",
  addQuest: "Nouvelle quête",
  newQuestTitle: "Nouvelle quête",
  remove: "Supprimer",
  key: "Clé",
  keyTaken: "Une autre quête du groupe a déjà cette clé.",
  formerKeys: "Anciennement {{keys}} : les joueurs gardent leur progression.",
  forgetFormerKeys: "Repartir de zéro à la place",
  keyChanged: "La clé passe de {{from}} à {{to}}.",
  keyChangeAsk: "Que devient la progression des joueurs sur cette quête ?",
  keyChangeKeep: "La garder",
  keyChangeKeepHint: "La progression enregistrée sous {{from}} suit vers la nouvelle clé (old_key est écrit). Fait une seule fois par base à la publication du fichier.",
  keyChangeReset: "Repartir de zéro",
  keyChangeResetHint: "La quête compte comme nouvelle : la progression enregistrée sous {{from}} reste où elle est et n'est plus utilisée.",
  keyChangeUnanswered: "Sans réponse, la progression est gardée. L'écran de publication indique combien de joueurs sont concernés.",
  objectiveKeyTaken: "Un autre objectif de la quête a déjà cette clé : ils partageraient leur progression.",
  tier: "Palier",
  duration: "Durée limite",
  durationInvalid: "Écrivez une durée comme 24h, 1h30m ou 90s.",
  stages: "Étapes",
  stage: "Étape {{n}}",
  addStage: "Ajouter une étape",
  flow: "Ordre des objectifs",
  "flow.parallel": "Dans n'importe quel ordre",
  "flow.sequential": "L'un après l'autre",
  addObjective: "Ajouter un objectif",
  type: "Type",
  questEvents: "Événements de la quête",
  "questHook.start": "La quête commence",
  "questHook.objective_progress": "Un objectif progresse",
  "questHook.objective_complete": "Un objectif est terminé",
  "questHook.complete": "La quête est terminée",
  addEvent: "Ajouter un événement…",
  removeEvent: "Retirer cet événement et ses actions",
  legacySteps: "Ancien format MSQuests, conservé tel quel : le serveur le convertit au chargement, /msquests migrate le réécrit.",
  hooks: "Événements du groupe",
  "hook.distribution": "Les quêtes sont distribuées",
  "hook.actor_load": "Un joueur est chargé",
  "hook.quest_start": "Une quête commence",
  "hook.objective_progress": "Un objectif progresse",
  "hook.objective_complete": "Un objectif est terminé",
  "hook.quest_complete": "Une quête est terminée",
  "hook.period_complete": "Toutes les quêtes de la période sont terminées",
  more: "Plus d'options",
  objectiveKeyHint: "La progression est stockée sous cette clé : la changer remet à zéro la progression des joueurs qui font cette quête.",
  stageName: "Nom de l'étape",
  stageNameDefault: "Nom (par défaut : Étape {{n}})",
  questName: "Nom de la quête",
  questDescription: "Description de la quête",
  objectives: "Objectifs",
  missing: "À remplir : {{fields}}",
  kept: "Conservé tel quel : {{fields}}",
  preview: "En jeu",
  noQuests: "Aucune quête pour l'instant.",
  "objective.block_break": "Casser des blocs",
  "objective.craft_item": "Fabriquer des objets",
  "objective.harvest_crop": "Récolter des cultures",
  "objective.fishing": "Pêcher",
  "objective.deliver_item": "Livrer des objets",
  "objective.talk_npc": "Parler à un PNJ",
  "objective.kill_entity": "Tuer des créatures",
  "objective.breed_animal": "Faire se reproduire des animaux",
  "objective.travel": "Parcourir une distance",
  "objective.execute_command": "Exécuter une commande",
  "objective.placeholder": "Atteindre une valeur de placeholder",
  "param.material": "Matériau",
  "param.item": "Item",
  "param.crop": "Culture",
  "param.fish_type": "Poisson",
  "param.amount": "Quantité",
  "param.itemKey": "Clé d'objet personnalisé",
  "param.entity_type": "Créature",
  "param.distance": "Distance (blocs)",
  "param.command": "Commande",
  "param.placeholder": "Placeholder",
  "param.value": "Valeur",
  "param.npc": "PNJ",
  "param.line": "Réplique du PNJ",
  "param.missing_line": "Réplique tant qu'il manque des objets",
  giverLine: "Réplique de la proposition",
  lineHint: "Dite par l'orateur du PNJ, comme une page de conversation. Une conversation nommée à côté est jouée à sa place.",
  "param.conversation": "Conversation",
  "param.missing": "Conversation tant qu'il manque des objets",
  giverNpc: "Donnée par le PNJ",
  giverConversation: "Conversation de la proposition",
  giverDistributed: "Ce groupe distribue aussi ses quêtes tout seul : un joueur peut recevoir celle-ci avant d'avoir vu le PNJ.",
  any: "n'importe lequel",
  groupSettings: "Réglages du groupe",
  questSettings: "Réglages de la quête",
  identity: "Identité",
  "strategy.ordered": "Dans l'ordre",
  "reset.never": "Jamais",
  "reset.daily": "Chaque jour",
  "reset.weekly": "Chaque semaine",
  "reset.monthly": "Chaque mois",
  "reset.custom": "Cron…",
  resetTime: "Heure",
  resetDay: "Jour",
  resetDayOfMonth: "Jour du mois",
  duplicate: "Dupliquer",
  cancel: "Annuler",
  removeConfirm: "Supprimer « {{name}} » ?",
  moreActions: "Autres actions",
  toComplete: "À compléter",
  noObjectivesShort: "Aucun objectif",
  actionCount: "{{count}} actions",
  actionCountOne: "1 action",
  eventCount: "Événements : {{count}}",
  tierCount: "Paliers : {{count}}",
  noTimeLimit: "Sans limite de temps",
  conditionCount: "Conditions : {{count}}",
  givenBy: "Donnée par {{npc}}",
  "stats.group": "Groupe de quêtes",
  "stats.noGroup": "Aucun groupe de quêtes sur ce serveur pour l'instant.",
  "stats.started": "Commencées",
  "stats.completed": "Terminées",
  "stats.abandoned": "Abandonnées",
  "stats.expired": "Expirées",
  "stats.overPeriod": "sur la période",
  "stats.unavailable": "Ces chiffres n'ont pas pu être lus.",
  "stats.funnel": "Progression dans le groupe",
  "stats.allTime": "depuis toujours, tous les joueurs",
  "stats.funnelStarted": "{{quest}} commencée",
  "stats.funnelCompleted": "{{quest}} terminée",
  "stats.quests": "Quêtes",
  "stats.questsHint": "triées par là où les joueurs ne finissent pas",
  "stats.quest": "Quête",
  "stats.unfinished": "Non terminées",
  "stats.inProgress": "En cours maintenant",
  "stats.median": "Durée médiane",
  "stats.stuck": "Là où ça coince",
  "stats.stuckHint": "l'étape où se trouve chaque quête en cours, maintenant",
  "stats.stage": "Étape",
  "stats.waiting": "Joueurs dessus",
  "stats.medianWait": "Temps médian dessus",
  "stats.longestWait": "Le plus long",
  "stats.nobodyStuck": "Aucune quête de ce groupe n'est en cours.",
  "stats.noQuestYet": "Rien d'enregistré pour ce groupe sur la période.",
  "stats.offline": "Le serveur doit être en ligne pour calculer ces chiffres.",
  "stats.notComputed": "Ces chiffres demandent qu'ArtisanQuests lise ses quêtes dans Artisan (content_source: artisan).",
  "stats.day": "j",
  "hud.kindLabel": "HUD de la quête suivie",
  "hud.collection": "HUD de la quête suivie",
  "hud.layout": "Disposition",
  "hud.layoutHint": "Dessiné en haut de l'écran pour la quête que le joueur suit, dès que tracking.bossbar.hud nomme ce fichier dans config.yml. Un joueur sans le pack de ressources garde la bossbar.",
  "hud.texts": "Textes",
  "hud.textsHint": "MiniMessage avec les variables de l'objectif : tape { pour insérer {objective_name}, {objective_progress}, {objective_target}, {quest_name}. Vide : le texte par défaut, en gris.",
  "hud.slot.quest": "Quête",
  "hud.slot.objective": "Objectif",
  "hud.slot.progress": "Progression",
  "hud.sample.quest": "L'alchimiste",
  "hud.sample.objective": "Préparer 3 potions de vision nocturne"
}, Ke = { en: G.kindLabel, fr: Y.kindLabel }, tn = { en: G.collection, fr: Y.collection }, Ue = { en: G["hud.kindLabel"], fr: Y["hud.kindLabel"] }, nn = { en: G["hud.collection"], fr: Y["hud.collection"] }, pe = Dt({ en: G, fr: Y });
function ot(e) {
  const t = e === "fr" ? Y : G;
  return (n, a) => {
    const s = t[n] ?? G[n] ?? n;
    return a ? s.replace(/\{\{(\w+)\}\}/g, (i, o) => String(a[o] ?? i)) : s;
  };
}
const se = "quest_group", lt = "quest_groups", ct = "quests", Ee = "quest_group/v1";
function an(e) {
  const t = { ...$(e) };
  return typeof t.strategy == "string" && t.strategy.toLowerCase() === "ladder" && (t.strategy = "sequential"), t;
}
const xe = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function dt(e = Date.now()) {
  let t = "", n = e;
  for (let i = 0; i < 10; i++)
    t = xe[n % 32] + t, n = Math.floor(n / 32);
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  let s = "";
  for (let i = 0; i < 16; i++) s += xe[a[i] % 32];
  return t + s;
}
function te(e, t) {
  const n = new Set(t);
  if (!n.has(e)) return e;
  for (let a = 2; ; a++) if (!n.has(`${e}_${a}`)) return `${e}_${a}`;
}
function sn(e, t) {
  const n = new Set(t), a = new Uint8Array(4);
  for (; ; ) {
    crypto.getRandomValues(a);
    const s = Array.from(a, (o) => xe[o % 32].toLowerCase()).join(""), i = `${me(e)}_${s}`;
    if (!n.has(i)) return i;
  }
}
function ut(e) {
  return e.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
function me(e) {
  return e.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "quest";
}
function $(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? { ...e } : {};
}
function ge(e) {
  return Array.isArray(e) ? e : [];
}
function T(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? String(e) : "";
}
function X(e, ...t) {
  const n = { ...e };
  for (const a of t) delete n[a];
  return n;
}
function rn(e, t) {
  const n = {}, a = [];
  function s(c) {
    if (c && typeof c == "object" && !Array.isArray(c)) {
      const q = F(), h = {};
      for (const [b, y] of Object.entries(c)) h[b] = T(y);
      return n[q] = h, { key: q };
    }
    const u = typeof c == "string" ? /^\{i18n:(.+)\}$/.exec(c) : null;
    if (u) {
      const q = t.translations?.[u[1]];
      return q && (n[u[1]] = { ...q }), { key: u[1] };
    }
    const p = F();
    return n[p] = c == null || c === "" ? {} : { [t.lang]: T(c) }, { key: p };
  }
  const i = Object.entries($(e.tiers)).map(([c, u]) => {
    const p = $(u);
    return { key: c, title: s(p.title), rest: X(p, "title") };
  }), o = /* @__PURE__ */ new Set(), l = ge(e.quests).map((c, u) => {
    const p = $(c), q = ge(p.stages).map((v, k) => {
      const x = $(v), _ = T(x.flow).toLowerCase();
      return {
        key: T(x.key) || `stage_${k + 1}`,
        title: s(x.title),
        flow: _ === "parallel" || _ === "sequential" ? _ : "",
        objectives: ge(x.objectives).map((C, S) => {
          const L = $(C);
          return {
            key: T(L.key) || `objective_${S + 1}`,
            savedKey: T(L.key) || void 0,
            type: T(L.type),
            params: X(L, "key", "type")
          };
        }),
        rest: X(x, "key", "title", "flow", "objectives")
      };
    }), h = T(p.key) || `quest_${u + 1}`, b = T(p.uid) || void 0;
    let y = b ?? h;
    return o.has(y) && (y = `${y}_${u}`), o.add(y), {
      key: h,
      uid: y,
      savedUid: b,
      savedKey: T(p.key) || void 0,
      oldKeys: mt(p.old_key),
      oldPlaces: ln(p.old_key),
      tier: T(p.tier),
      title: s(p.title),
      description: s(p.description),
      duration: T(p.duration),
      stages: q,
      rest: on(p)
    };
  }), d = {
    id: T(e.id),
    projectId: t.projectId,
    uid: T(e.uid) || void 0,
    title: s(e.title),
    description: s(e.description),
    actorType: T(e.actor_type) || "player",
    reset: $(e.reset),
    limits: $(e.limits),
    rotation: $(e.rotation),
    distribution: an(e.distribution),
    tiers: i,
    quests: l,
    rest: pt(X(
      $(e),
      "id",
      "schema",
      "uid",
      "title",
      "description",
      "actor_type",
      "reset",
      "limits",
      "rotation",
      "distribution",
      "tiers",
      "quests"
    ))
  };
  return e.schema !== void 0 && e.schema !== Ee && a.push(`schema: ${String(e.schema)}`), { doc: d, i18nKeys: n, unsupported: a };
}
function pt(e) {
  return e.on !== void 0 && (e.actions == null && (e.actions = e.on), delete e.on), e;
}
function on(e) {
  const t = pt(
    X(e, "key", "uid", "old_key", "tier", "title", "description", "duration", "stages", "reward_display")
  );
  if (t.rewards !== void 0) {
    const n = $(t.actions);
    n.complete == null && (t.actions = { ...n, complete: t.rewards }), delete t.rewards;
  }
  return t;
}
function mt(e) {
  return (Array.isArray(e) ? e : e == null ? [] : [e]).map((n) => T(n)).filter((n) => n !== "");
}
function ln(e) {
  return (Array.isArray(e) ? e : e == null ? [] : [e]).filter((n) => n !== null && typeof n == "object" && !Array.isArray(n));
}
function ht(e, t) {
  e.savedKey === void 0 || t === "" || t === e.key || e.oldKeys.includes(t) || e.oldKeys.push(t);
}
function ft(e, t) {
  const n = [];
  for (const a of [...e.oldKeys, e.savedKey ?? ""])
    a === "" || a === e.key || t.has(a) || n.includes(a) || n.push(a);
  return n;
}
function cn(e) {
  const t = e.savedKey;
  return t === void 0 || t === "" || t === e.key || e.keyChoice !== void 0 || e.oldKeys.includes(t) ? null : t;
}
function ve(e, t) {
  if (t === "keep") {
    e.savedKey !== void 0 && ht(e, e.savedKey), e.keyChoice = "keep";
    return;
  }
  e.oldKeys = [], e.oldPlaces = [], e.savedKey = void 0, e.keyChoice = "reset";
}
function dn(e, t) {
  const n = [...ft(e, t), ...e.oldPlaces];
  return n.length === 0 ? void 0 : n.length === 1 ? n[0] : n;
}
function un(e, t) {
  const { old_key: n, ...a } = e.params, s = [];
  for (const o of [...mt(n), e.savedKey ?? ""])
    o === "" || o === e.key || t.has(o) || s.includes(o) || s.push(o);
  const i = s.length === 0 ? void 0 : s.length === 1 ? s[0] : s;
  return pn({ key: e.key, old_key: i, type: e.type, ...a });
}
function pn(e) {
  return e.old_key === void 0 && delete e.old_key, e;
}
function mn(e) {
  return typeof e == "string" ? e === "" : Object.values(e).every((t) => t === "");
}
function K(e) {
  const t = {};
  for (const [n, a] of Object.entries(e))
    a == null || a === "" || Array.isArray(a) && a.length === 0 || typeof a == "object" && !Array.isArray(a) && Object.keys(a).length === 0 || (t[n] = a);
  return t;
}
const hn = [
  "id",
  "schema",
  "uid",
  "title",
  "description",
  "actor_type",
  "window",
  "reset",
  "limits",
  "rotation",
  "distribution",
  "tiers",
  "actions",
  "quests"
];
function fn(e, t) {
  const n = (u) => It(t, u.key), a = (u) => {
    const p = n(u);
    return mn(p) ? void 0 : p;
  }, s = {};
  for (const u of e.tiers) s[u.key] = { ...u.rest, title: n(u.title) };
  const i = new Set(e.quests.map((u) => u.key)), o = e.quests.map((u) => {
    const p = new Set(u.stages.flatMap((q) => q.objectives.map((h) => h.key)));
    return K({
      key: u.key,
      uid: u.savedUid,
      old_key: dn(u, i),
      tier: u.tier,
      title: n(u.title),
      description: a(u.description),
      duration: u.duration,
      ...u.rest,
      stages: u.stages.map(
        (q) => K({
          key: q.key,
          title: a(q.title),
          flow: q.flow,
          ...q.rest,
          objectives: q.objectives.map((h) => un(h, p))
        })
      )
    });
  }), l = {
    ...e.rest,
    id: e.id,
    schema: Ee,
    uid: e.uid,
    title: n(e.title),
    description: a(e.description),
    actor_type: e.actorType,
    reset: K(e.reset),
    limits: K(e.limits),
    rotation: K(e.rotation),
    distribution: K(e.distribution),
    tiers: s,
    quests: o
  }, d = {};
  for (const u of hn) u in l && (d[u] = l[u]);
  for (const u of Object.keys(l)) u in d || (d[u] = l[u]);
  const c = K(d);
  return c.quests = o, c;
}
function* yn(e) {
  const t = `${lt}.${e.id}`;
  yield { lText: e.title, key: `${t}.title`, path: "title", kind: "quest_group.title" }, yield {
    lText: e.description,
    key: `${t}.description`,
    path: "description",
    kind: "quest_group.description"
  };
  for (const a of e.tiers)
    yield {
      lText: a.title,
      key: `${t}.tiers.${a.key}.title`,
      path: `tiers.${a.key}.title`,
      kind: "quest_group.tier"
    };
  const n = /* @__PURE__ */ new Set();
  for (let a = 0; a < e.quests.length; a++) {
    const s = e.quests[a], i = n.has(s.key) ? `${s.key}_${a}` : s.key;
    n.add(s.key);
    const o = `${t}.quests.${i}`;
    yield {
      lText: s.title,
      key: `${o}.title`,
      path: `quests[${a}].title`,
      kind: "quest.title"
    }, yield {
      lText: s.description,
      key: `${o}.description`,
      path: `quests[${a}].description`,
      kind: "quest.description"
    };
    const l = /* @__PURE__ */ new Set();
    for (let d = 0; d < s.stages.length; d++) {
      const c = s.stages[d], u = l.has(c.key) ? `${c.key}_${d}` : c.key;
      l.add(c.key), yield {
        lText: c.title,
        key: `${o}.stages.${u}.title`,
        path: `quests[${a}].stages[${d}].title`,
        kind: "quest.stage"
      };
    }
  }
}
function Qe(e) {
  return !!e && typeof e == "object" && !Array.isArray(e) && "type" in e;
}
function gn(e) {
  const t = Array.isArray(e) ? e : e == null ? [] : [e];
  return {
    chain: t.filter((n) => !Qe(n)),
    legacy: t.filter(Qe)
  };
}
function Fe(e, t) {
  const n = [...e, ...t];
  return n.length ? n : void 0;
}
function vn(e) {
  const t = String(e.type), n = e.command ?? e.message ?? e.title ?? e.material;
  return typeof n == "string" ? `${t} · ${n}` : t;
}
const bn = [
  "distribution",
  "actor_load",
  "quest_start",
  "objective_progress",
  "objective_complete",
  "quest_complete",
  "period_complete"
], qn = ["start", "objective_progress", "objective_complete", "complete"], yt = {
  started: "quests:started",
  completed: "quests:completed",
  abandoned: "quests:abandoned",
  expired: "quests:expired"
}, oe = Object.keys(yt), kn = "quests:progress", xn = "quests:stuck", W = (e) => typeof e == "number" && Number.isFinite(e) ? e : 0;
function wn(e) {
  return e.map((t) => ({
    quest: String(t.quest ?? ""),
    started: W(t.started),
    inProgress: W(t.in_progress),
    completed: W(t.completed),
    medianSeconds: typeof t.median_seconds == "number" ? t.median_seconds : null
  }));
}
function _n(e) {
  return e.map((t) => ({
    quest: String(t.quest ?? ""),
    stage: String(t.stage ?? ""),
    players: W(t.players),
    medianSeconds: W(t.median_seconds),
    longestSeconds: W(t.longest_seconds)
  }));
}
function Nn(e, t, n) {
  const a = (i, o) => t[i]?.find((l) => l.value === o)?.count ?? 0, s = e.map((i) => i.key);
  for (const i of oe)
    for (const o of t[i] ?? []) s.includes(o.value) || s.push(o.value);
  return s.map((i) => {
    const o = a("started", i), l = a("completed", i), d = n.find((c) => c.quest === i);
    return {
      key: i,
      started: o,
      completed: l,
      abandoned: a("abandoned", i),
      expired: a("expired", i),
      unfinished: o > 0 ? Math.max(0, 1 - l / o) : null,
      inProgress: d?.inProgress ?? 0,
      medianSeconds: d?.medianSeconds ?? null
    };
  });
}
const Ge = (e) => (e ?? []).reduce((t, n) => t + n.count, 0);
function jn(e) {
  return e.distribution.strategy === "sequential";
}
function Cn(e, t) {
  const n = e[0];
  if (!n) return [];
  const a = (i) => t.find((o) => o.quest === i), s = a(n.key)?.started ?? 0;
  return s === 0 ? [] : [
    { key: n.key, kind: "started", value: s },
    ...e.map((i) => ({ key: i.key, kind: "completed", value: a(i.key)?.completed ?? 0 }))
  ];
}
function Sn(e, t = "d") {
  const n = Math.max(0, Math.round(e));
  if (n < 60) return `${n} s`;
  const a = Math.round(n / 60);
  if (a < 60) return `${a} min`;
  const s = Math.floor(a / 60);
  if (s < 24) return a % 60 === 0 ? `${s} h` : `${s} h ${String(a % 60).padStart(2, "0")}`;
  const i = Math.floor(s / 24);
  return s % 24 === 0 ? `${i} ${t}` : `${i} ${t} ${s % 24} h`;
}
function An(e, t, n) {
  if (t === void 0 || t === 0) return null;
  const a = (e - t) / t, s = new Intl.NumberFormat(n, { style: "percent", maximumFractionDigits: 0 }).format(Math.abs(a));
  return `${a >= 0 ? "▲" : "▼"} ${s}`;
}
const Te = `
.aq { display: flex; flex-direction: column; gap: 16px; padding: var(--page-pad, 12px); color: var(--text); font-size: 13px; width: 100%; max-width: 1500px; margin: 0 auto; box-sizing: border-box; }
.aq .input, .aq .select { height: 34px; padding: 5px 10px; font-size: 13px; }
.aq .textarea { padding: 6px 10px; font-size: 13px; min-height: 56px; resize: vertical; }
.aq-card { display: flex; flex-direction: column; border: 1px solid var(--border-soft); border-radius: var(--r-md); background: var(--surface-raised); min-width: 0; }
.aq-pad { padding: 14px 16px; gap: 10px; }
.aq-card-head { display: flex; align-items: center; gap: 10px; padding: 12px 16px; }
.aq-h { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--text); }
.aq-h-row { display: inline-flex; align-items: center; gap: 8px; }
.aq-help { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; border: 1px solid var(--border-soft); color: var(--text-mut); font-family: var(--font-body, inherit); font-size: 11px; font-weight: 600; cursor: help; }
.aq-help:hover, .aq-help:focus-visible { color: var(--text); border-color: var(--text-mut); outline: none; }
.aq-help::after { content: attr(data-tip); position: absolute; left: 0; top: calc(100% + 6px); z-index: 20; width: max-content; max-width: min(360px, 70vw); padding: 8px 10px; border: 1px solid var(--border-soft); border-radius: var(--r-sm, 6px); background: var(--surface-raised-2); color: var(--text); font-size: 12px; font-weight: 400; line-height: 1.4; text-align: left; white-space: normal; box-shadow: 0 6px 18px rgb(0 0 0 / .35); opacity: 0; pointer-events: none; transition: opacity .1s; }
.aq-help:hover::after, .aq-help:focus-visible::after { opacity: 1; }
.aq-count, .aq-mut { color: var(--text-mut); }
.aq-grow { flex: 1; }
.aq-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--text-mut); }
.aq-empty { padding: 14px 16px; border-top: 1px solid var(--border-soft); color: var(--text-mut); }
.aq-mono { font-family: var(--font-mono); font-size: 12px; }

.aq-fold-head { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; min-height: 48px; padding: 8px 16px; background: none; border: 0; color: inherit; font: inherit; text-align: left; cursor: pointer; border-radius: var(--r-md); }
.aq-fold-head.is-inner { min-height: 40px; padding: 6px 0; border-radius: 0; }
.aq-fold-title { font-weight: 600; color: var(--text-mut); }
.aq-fold-head:hover .aq-fold-title, .aq-fold-head:hover .aq-chevron { color: var(--text); }
.aq-fold-body { display: flex; flex-direction: column; gap: 10px; padding-bottom: 6px; }
.aq-chevron { flex: none; color: var(--text-mut); transition: transform .12s; }
.aq-chevron.is-open { transform: rotate(90deg); }

.aq-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
.aq-chip { display: inline-flex; align-items: center; gap: 6px; max-width: 320px; height: 24px; padding: 0 10px; border-radius: var(--r-pill, 999px); background: var(--surface-raised-2); color: var(--text-mut); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.aq-chip.is-ok { background: var(--success-soft); color: var(--success); }
.aq-chip.is-warn { background: var(--warning-soft); color: var(--warning); }

.aq-seg { display: flex; flex-wrap: wrap; gap: 6px; }
.aq-opt { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; border-radius: var(--r-sm); border: 1px solid var(--border-soft); background: transparent; color: var(--text-mut); font: inherit; cursor: pointer; white-space: nowrap; }
.aq-opt:hover { color: var(--text); border-color: var(--border-strong); }
.aq-opt.is-on { background: var(--brand-soft); border-color: var(--brand-line); color: var(--text); font-weight: 600; }

.aq-settings { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1px; background: var(--border-soft); border-top: 1px solid var(--border-soft); border-radius: 0 0 var(--r-md) var(--r-md); overflow: hidden; }
.aq-block { display: flex; flex-direction: column; gap: 12px; padding: 16px; background: var(--surface-raised); min-width: 0; }
.aq-block.is-wide { grid-column: 1 / -1; }
.aq-block-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 32px; }
.aq-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.aq-row { display: flex; gap: 8px; align-items: flex-end; }
.aq-row > * { flex: 1; min-width: 0; }
.aq-row > .aq-icon-btn, .aq-row > .aq-confirm { flex: none; }
.aq-top { align-items: flex-start; }
.aq-tier { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border-soft); }
.aq-tier > * { flex: 1 1 120px; min-width: 0; }
.aq-tier > .aq-field:first-child { flex: 1 1 100%; }
.aq-tier > .aq-icon-btn, .aq-tier > .aq-confirm { flex: none; }
.aq-wrap { flex-wrap: wrap; }
.aq-wrap > * { flex: 1 1 160px; }
.aq-reset > * { flex: 0 1 160px; }
.aq-ok { color: var(--success); font-size: 12px; }
.aq-err { color: var(--danger); font-size: 12px; }
.aq-keychange { display: flex; flex-direction: column; gap: 6px; padding: 8px; border: 1px solid var(--border); border-radius: 6px; }
.aq-forget { padding: 0; border: 0; background: none; color: var(--text); font: inherit; cursor: pointer; text-decoration: underline; }
.aq-warn { color: var(--warning); font-size: 12px; }
.aq-check { display: flex; align-items: center; gap: 8px; min-height: 28px; cursor: pointer; }

.aq-icon-btn { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: var(--r-sm); border: 0; background: none; color: var(--text-faint); font-size: 16px; cursor: pointer; flex: none; }
.aq-icon-btn:hover:not(:disabled), .aq-icon-btn[aria-expanded="true"] { background: var(--surface-hover); color: var(--text); }
.aq-icon-btn:disabled { opacity: .35; cursor: default; }
.aq-confirm { display: inline-flex; align-items: center; gap: 8px; flex: none; color: var(--text-mut); }
.aq-danger { height: 30px; padding: 0 12px; border-radius: var(--r-sm); border: 1px solid var(--danger); background: var(--danger-soft); color: var(--danger); font: inherit; font-weight: 600; cursor: pointer; }
.aq-menu-anchor { position: relative; flex: none; }
.aq-menu { position: absolute; right: 0; top: 36px; z-index: 20; min-width: 180px; display: flex; flex-direction: column; padding: 4px; border: 1px solid var(--border-strong); border-radius: var(--r-sm); background: var(--surface-raised-2); box-shadow: 0 12px 32px rgba(0, 0, 0, .35); }
.aq-menu > button { height: 34px; padding: 0 10px; border: 0; border-radius: var(--r-xs, 6px); background: none; color: var(--text); font: inherit; text-align: left; cursor: pointer; }
.aq-menu > button:hover { background: var(--surface-hover); }
.aq-menu > button.is-danger { color: var(--danger); }

.aq-quests { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.aq-quest { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; min-height: 56px; padding: 4px 10px 4px 6px; border-top: 1px solid var(--border-soft); }
.aq-quest:hover { background: var(--surface-hover); }
.aq-quest:last-child { border-radius: 0 0 var(--r-md) var(--r-md); }
.aq-n { flex: none; width: 24px; height: 24px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; background: var(--surface-raised-2); color: var(--text-mut); font-weight: 700; font-size: 12px; }
.aq-n.is-brand { background: var(--brand); color: var(--brand-fg); }
.aq-quest-main { flex: 1 1 240px; min-width: 0; display: flex; flex-direction: column; gap: 2px; padding: 6px 0; cursor: pointer; background: none; border: 0; color: inherit; text-align: left; font: inherit; }
.aq-quest-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
.aq-quest-sub { color: var(--text-mut); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.aq-quest > .aq-chips { flex: 0 1 auto; justify-content: flex-end; }

.aq-quest-page { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 16px; }
.aq-quest-col { flex: 999 1 520px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.aq-aside { flex: 0 0 auto; min-width: 0; max-width: 100%; position: sticky; top: 16px; }
.aq-quest-head { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px 10px; }
.aq-quest-page .aq-fold-head.is-inner { margin: 0 16px; border-top: 1px solid var(--border-soft); }
.aq-quest-page .aq-card > .aq-fold-body { padding: 0 16px 14px; }

.aq-stages { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
.aq-stage { gap: 8px; padding: 12px 14px; }
.aq-stage-head { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.aq-stage-label { flex: none; color: var(--brand); }
.aq-quest-name { font-weight: 600; }
.aq .aq-stage-title { flex: 1 1 320px; min-width: 0; font-weight: 600; }
.aq-objectives { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.aq-obj { border-radius: var(--r-sm); background: var(--surface-inset); border: 1px solid transparent; }
.aq-obj.is-open { border-color: var(--border-strong); }
.aq-obj.has-problem:not(.is-open) { border-color: var(--warning); }
.aq-obj-line { display: flex; align-items: center; gap: 2px; padding: 0 6px 0 2px; }
.aq-obj-main { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 8px; background: none; border: 0; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.aq-obj-main:hover .aq-obj-text, .aq-obj-main:hover .aq-chevron { color: var(--text); }
.aq-obj-n { flex: none; min-width: 22px; color: var(--text-faint); font-family: var(--font-mono); font-size: 11px; }
.aq-obj-icon { flex: none; width: 20px; text-align: center; }
.aq-obj-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-mut); }
.aq-obj-text strong { color: var(--text); font-weight: 600; }
.aq-obj-form { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-top: 1px solid var(--border-soft); }
.aq-types { display: flex; flex-direction: column; gap: 8px; padding-top: 4px; }
.aq-add { align-self: flex-start; }

.aq-line { border-radius: var(--r-sm); background: var(--surface-inset); border: 1px solid transparent; }
.aq-line.is-open { border-color: var(--border-strong); }
.aq-line-head { display: flex; align-items: center; gap: 4px; padding-right: 6px; }
.aq-line-main { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 0 12px; background: none; border: 0; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.aq-line-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.aq-line-body { padding: 10px 12px; border-top: 1px solid var(--border-soft); }
.aq-chain { display: flex; flex-direction: column; gap: 6px; }
.aq-event-add { width: auto; min-width: 220px; }
.aq-legacy { display: flex; flex-direction: column; gap: 4px; padding: 8px; border: 1px dashed var(--border-strong); border-radius: var(--r-sm); }
.aq-legacy-row { display: flex; align-items: center; gap: 6px; }
.aq-legacy-row code { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--text-mut); }

.aq-preview { display: flex; overflow-x: auto; }
.aq-preview-frame { box-sizing: border-box; flex: none; min-width: 360px; display: flex; flex-direction: column; gap: 4px; padding: 6px 8px; border-radius: 2px; background: var(--mc-tooltip-bg, #100010); border: 2px solid var(--mc-tooltip-border-top, #2a0a66); }
.aq-preview-stage { display: flex; flex-direction: column; gap: 4px; padding-top: 8px; }
.aq-stats { display: flex; flex-direction: column; gap: 16px; color: var(--text); }
.aq-stats-pick { display: flex; align-items: center; gap: 10px; }
.aq-stats-pick .select { height: 32px; padding: 5px 10px; font-size: 13px; min-width: 220px; }
.aq-stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; }
.aq-stats-empty { padding: 24px 0; text-align: center; color: var(--text-mut); font-size: 13px; }
.aq-section { display: flex; flex-direction: column; gap: 8px; }
.aq-hint { color: var(--text-mut); font-size: 12px; }
`;
function En(e) {
  je("msquests", Te);
  const t = pe(), n = Pt(se).map((i) => ({
    group: i.document,
    project: i.project
  })), a = n.find((i) => i.group.id === e.focus) ?? n[0];
  if (!a) return /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: t("stats.noGroup") });
  const s = (i) => R(i.project, i.group.title.key, e.lang) || i.group.id;
  return /* @__PURE__ */ f("div", { className: "aq-stats", children: [
    /* @__PURE__ */ f("label", { className: "aq-stats-pick", children: [
      /* @__PURE__ */ r("span", { className: "aq-h", children: t("stats.group") }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: a.group.id,
          onChange: (i) => e.onFocus(i.target.value),
          children: n.map((i) => /* @__PURE__ */ r("option", { value: i.group.id, children: s(i) }, i.group.id))
        }
      )
    ] }),
    /* @__PURE__ */ r(Tn, { ...e, group: a.group, project: a.project }, a.group.id)
  ] });
}
function Tn({
  serverId: e,
  period: t,
  player: n,
  compare: a,
  lang: s,
  group: i,
  project: o
}) {
  const l = pe(), d = `${e}|${i.id}`, c = (m, N) => Promise.all(
    oe.map(
      (g) => Kt(e, { event: yt[g], from: m, to: N, player: n, dims: { group: i.id } }, "quest")
    )
  ).then((g) => Object.fromEntries(oe.map((w, j) => [w, g[j] ?? []]))), u = ie(
    `${d}|${t.from}|${t.to}|${n ?? ""}`,
    () => c(t.from, t.to)
  ), p = ie(
    `${d}|${t.previous.from}|${t.previous.to}|${n ?? ""}|${a}`,
    () => a ? c(t.previous.from, t.previous.to) : Promise.resolve(void 0)
  ), q = ie(
    `${d}|progress`,
    () => Me(e, kn, { group: i.id }).then((m) => wn(m.rows))
  ), h = ie(
    `${d}|stuck`,
    () => Me(e, xn, { group: i.id }).then((m) => _n(m.rows))
  ), b = (m) => {
    const N = i.quests.find((g) => g.key === m);
    return N && R(o, N.title.key, s) || m;
  }, y = (m, N) => {
    const g = i.quests.find((w) => w.key === m)?.stages.find((w) => w.key === N);
    return g && R(o, g.title.key, s) || N;
  }, v = (m) => new Intl.NumberFormat(s).format(m), k = (m) => new Intl.NumberFormat(s, { style: "percent", maximumFractionDigits: 0 }).format(m), x = (m) => m === null ? "–" : Sn(m, l("stats.day"));
  if (u.error) return /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.unavailable") });
  const _ = Nn(i.quests, u.data ?? {}, q.data ?? []), C = jn(i) ? Cn(i.quests, q.data ?? []) : [], S = (m) => m === void 0 ? null : l(
    m === "server_offline" ? "stats.offline" : m === "unknown_query" ? "stats.notComputed" : "stats.unavailable"
  ), L = {
    started: void 0,
    completed: !0,
    abandoned: !1,
    expired: !1
  };
  return /* @__PURE__ */ f(H, { children: [
    /* @__PURE__ */ r("div", { className: "aq-stats-cards", children: oe.map((m) => {
      const N = Ge(u.data?.[m]), g = An(N, p.data ? Ge(p.data[m]) : void 0, s), w = g?.startsWith("▲") ?? !1, j = L[m];
      return /* @__PURE__ */ r(
        Mt,
        {
          label: l(`stats.${m}`),
          value: u.data ? v(N) : "…",
          sub: l("stats.overPeriod"),
          trend: g === null ? void 0 : {
            label: g,
            tone: j === void 0 ? "default" : w === j ? "positive" : "negative"
          }
        },
        m
      );
    }) }),
    C.length > 0 && /* @__PURE__ */ r(ye, { title: l("stats.funnel"), hint: l("stats.allTime"), children: /* @__PURE__ */ r(
      Ht,
      {
        steps: C.map((m) => ({
          id: `${m.kind}:${m.key}`,
          label: l(m.kind === "started" ? "stats.funnelStarted" : "stats.funnelCompleted", {
            quest: b(m.key)
          }),
          value: m.value
        })),
        formatValue: v,
        formatShare: k
      }
    ) }),
    /* @__PURE__ */ f(ye, { title: l("stats.quests"), hint: l("stats.questsHint"), children: [
      _.length === 0 ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.noQuestYet") }) : /* @__PURE__ */ r(
        He,
        {
          rows: _,
          rowId: (m) => m.key,
          initialSort: "unfinished",
          columns: $n(l, b, v, k, x)
        }
      ),
      q.error && /* @__PURE__ */ r("p", { className: "aq-hint", children: S(q.error) })
    ] }),
    /* @__PURE__ */ r(ye, { title: l("stats.stuck"), hint: l("stats.stuckHint"), children: h.error ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: S(h.error) }) : h.data && h.data.length === 0 ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.nobodyStuck") }) : /* @__PURE__ */ r(
      He,
      {
        rows: h.data ?? [],
        rowId: (m) => `${m.quest}/${m.stage}`,
        initialSort: "players",
        columns: [
          { id: "quest", label: l("stats.quest"), value: (m) => b(m.quest) },
          { id: "stage", label: l("stats.stage"), value: (m) => y(m.quest, m.stage) },
          {
            id: "players",
            label: l("stats.waiting"),
            align: "right",
            value: (m) => m.players,
            render: (m) => v(m.players)
          },
          {
            id: "median",
            label: l("stats.medianWait"),
            align: "right",
            value: (m) => m.medianSeconds,
            render: (m) => x(m.medianSeconds)
          },
          {
            id: "longest",
            label: l("stats.longestWait"),
            align: "right",
            value: (m) => m.longestSeconds,
            render: (m) => x(m.longestSeconds)
          }
        ]
      }
    ) })
  ] });
}
function $n(e, t, n, a, s) {
  const i = (o, l) => ({
    id: o,
    label: l,
    align: "right",
    value: (d) => d[o],
    render: (d) => n(d[o])
  });
  return [
    { id: "quest", label: e("stats.quest"), value: (o) => t(o.key) },
    i("started", e("stats.started")),
    i("completed", e("stats.completed")),
    {
      id: "unfinished",
      label: e("stats.unfinished"),
      align: "right",
      // A quest nobody started sorts last: it has nothing to say about where players stop.
      value: (o) => o.unfinished ?? -1,
      render: (o) => o.unfinished === null ? "–" : a(o.unfinished)
    },
    i("abandoned", e("stats.abandoned")),
    i("expired", e("stats.expired")),
    i("inProgress", e("stats.inProgress")),
    {
      id: "median",
      label: e("stats.median"),
      align: "right",
      value: (o) => o.medianSeconds ?? -1,
      render: (o) => s(o.medianSeconds)
    }
  ];
}
const gt = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
}, Ln = /^\d+$/;
function be(e, t, n) {
  const a = String(n).padStart(2, "0");
  return e === "fr" ? n === 0 ? `${t} h` : `${t} h ${a}` : `${String(t).padStart(2, "0")}:${a}`;
}
function D(e, t, n) {
  return Ln.test(e) && Number(e) >= t && Number(e) <= n;
}
function qe(e) {
  return e.trim().split(/\s+/).length === 5;
}
function On(e, t) {
  const n = t === "fr", a = e.trim().split(/\s+/);
  if (a.length !== 5) return null;
  const [s, i, o, l, d] = a;
  if (l !== "*") return null;
  const c = /^\*\/(\d+)$/;
  if (o === "*" && d === "*") {
    if (D(s, 0, 59) && D(i, 0, 23))
      return n ? `tous les jours à ${be(t, +i, +s)}` : `every day at ${be(t, +i, +s)}`;
    const p = c.exec(i);
    if (D(s, 0, 59) && p)
      return n ? `toutes les ${p[1]} h, à la minute ${s}` : `every ${p[1]} hours, at minute ${s}`;
    if (D(s, 0, 59) && i === "*")
      return n ? `toutes les heures, à la minute ${s}` : `every hour, at minute ${s}`;
    const q = c.exec(s);
    return q && i === "*" ? n ? `toutes les ${q[1]} minutes` : `every ${q[1]} minutes` : null;
  }
  if (!D(s, 0, 59) || !D(i, 0, 23)) return null;
  const u = be(t, +i, +s);
  if (o === "*" && D(d, 0, 7)) {
    const p = gt[n ? "fr" : "en"][Number(d) % 7];
    return n ? `chaque ${p} à ${u}` : `every ${p} at ${u}`;
  }
  return d === "*" && D(o, 1, 31) ? n ? `le ${o === "1" ? "1er" : o} de chaque mois à ${u}` : `on day ${o} of each month at ${u}` : null;
}
function Z(e, t, n) {
  const a = /* @__PURE__ */ new Set();
  for (const s of e.split(",")) {
    const i = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(s);
    if (!i) return null;
    const o = i[4] ? Number(i[4]) : 1, l = i[1] === "*" ? t : Number(i[2]), d = i[1] === "*" ? n : i[3] ? Number(i[3]) : i[4] ? n : l;
    if (o < 1 || l < t || d > n || l > d) return null;
    for (let c = l; c <= d; c += o) a.add(c);
  }
  return a;
}
function Rn(e, t) {
  const n = e.trim().split(/\s+/);
  if (n.length !== 5) return null;
  const a = Z(n[0], 0, 59), s = Z(n[1], 0, 23), i = Z(n[2], 1, 31), o = Z(n[3], 1, 12), l = Z(n[4], 0, 7);
  if (!a || !s || !i || !o || !l) return null;
  l.has(7) && l.add(0);
  const d = n[2] === "*", c = n[4] === "*", u = (h) => d && c ? !0 : d ? l.has(h.getDay()) : c ? i.has(h.getDate()) : i.has(h.getDate()) || l.has(h.getDay()), p = new Date(t.getTime());
  p.setSeconds(0, 0), p.setMinutes(p.getMinutes() + 1);
  const q = t.getTime() + 366 * 24 * 3600 * 1e3;
  for (; p.getTime() <= q; ) {
    if (!o.has(p.getMonth() + 1) || !u(p)) {
      p.setDate(p.getDate() + 1), p.setHours(0, 0, 0, 0);
      continue;
    }
    if (!s.has(p.getHours())) {
      p.setHours(p.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (a.has(p.getMinutes())) return p;
    p.setMinutes(p.getMinutes() + 1);
  }
  return null;
}
function Dn(e) {
  const t = e.trim().split(/\s+/);
  if (e.trim() === "") return { kind: "never" };
  if (t.length !== 5) return { kind: "custom" };
  const [n, a, s, i, o] = t;
  if (i !== "*" || !D(n, 0, 59) || !D(a, 0, 23)) return { kind: "custom" };
  const l = `${a.padStart(2, "0")}:${n.padStart(2, "0")}`;
  return s === "*" && o === "*" ? { kind: "daily", time: l } : s === "*" && D(o, 0, 7) ? { kind: "weekly", time: l, day: Number(o) % 7 } : o === "*" && D(s, 1, 31) ? { kind: "monthly", time: l, day: Number(s) } : { kind: "custom" };
}
function In(e) {
  if (e.kind === "never") return "";
  if (e.kind === "custom") return null;
  const t = /^(\d{1,2}):(\d{2})$/.exec(e.time), n = t ? Math.min(23, Number(t[1])) : 4, a = t ? Math.min(59, Number(t[2])) : 0;
  return e.kind === "daily" ? `${a} ${n} * * *` : e.kind === "weekly" ? `${a} ${n} * * ${e.day}` : `${a} ${n} ${Math.min(31, Math.max(1, e.day))} * *`;
}
function Pn(e) {
  return gt[e === "fr" ? "fr" : "en"];
}
const U = { name: "amount", kind: "int", required: !0 }, $e = [
  { type: "block_break", icon: "⛏", params: [{ name: "material", kind: "material" }, U] },
  {
    type: "craft_item",
    icon: "⚒",
    params: [{ name: "item", kind: "item", legacy: "material" }, U]
  },
  {
    type: "harvest_crop",
    icon: "🌾",
    params: [{ name: "crop", kind: "material", required: !0 }, U]
  },
  {
    type: "fishing",
    icon: "🎣",
    params: [{ name: "item", kind: "item", legacy: "fish_type" }, U]
  },
  {
    type: "deliver_item",
    icon: "📦",
    params: [
      { name: "item", kind: "item", legacy: "material" },
      U,
      { name: "itemKey", kind: "text", advanced: !0 },
      { name: "npc", kind: "text", advanced: !0 },
      { name: "line", kind: "line", advanced: !0 },
      { name: "missing_line", kind: "line", advanced: !0 },
      { name: "conversation", kind: "text", advanced: !0 },
      { name: "missing", kind: "text", advanced: !0 }
    ]
  },
  {
    type: "talk_npc",
    icon: "💬",
    params: [
      { name: "npc", kind: "text", required: !0 },
      { name: "line", kind: "line" },
      { name: "conversation", kind: "text", advanced: !0 }
    ]
  },
  { type: "kill_entity", icon: "⚔", params: [{ name: "entity_type", kind: "entity" }, U] },
  { type: "breed_animal", icon: "♥", params: [{ name: "entity_type", kind: "entity" }, U] },
  { type: "travel", icon: "➜", params: [{ name: "distance", kind: "int", required: !0 }] },
  {
    type: "execute_command",
    icon: "/",
    params: [{ name: "command", kind: "text", required: !0 }]
  },
  {
    type: "placeholder",
    icon: "%",
    params: [
      { name: "placeholder", kind: "text", required: !0 },
      { name: "value", kind: "text", required: !0 }
    ]
  }
];
function J(e) {
  return $e.find((t) => t.type === e);
}
function vt(e) {
  const t = {};
  for (const n of J(e)?.params ?? [])
    n.kind === "int" && (t[n.name] = 1);
  return t;
}
function he(e) {
  return e.amount ?? e.distance;
}
function Le(e, t) {
  const n = e[t.name];
  if (n && typeof n == "object" && !Array.isArray(n)) return n;
  const a = t.legacy ? e[t.legacy] : void 0;
  return typeof a == "string" && a !== "" ? { material: a } : {};
}
function Mn(e, t, n, a) {
  t.legacy && delete e[t.legacy];
  const s = !n || Object.keys(n).length === 0;
  s ? delete e[t.name] : e[t.name] = n, s || a === void 0 ? delete e.match : e.match = a;
}
function bt(e) {
  const t = e.title;
  if (typeof t == "string" && t.trim() !== "") return t.replace(/<[^>]*>/g, "");
  const n = e.material ?? e.item;
  return typeof n == "string" ? n : "";
}
function Oe(e, t) {
  const n = J(e);
  return n ? n.params.filter((a) => a.kind !== "int" && a.kind !== "line").map((a) => a.kind === "item" ? bt(Le(t, a)) : t[a.name]).filter((a) => typeof a == "string" && a !== "").join(" = ") : Object.keys(t).map((a) => t[a]).filter((a) => typeof a == "string" && a !== "").join(" = ");
}
function qt(e, t) {
  return (J(e)?.params ?? []).filter((n) => n.required && (t[n.name] === void 0 || t[n.name] === "")).map((n) => n.name);
}
const Hn = [
  "ALLAY",
  "ARMADILLO",
  "AXOLOTL",
  "BAT",
  "BEE",
  "BLAZE",
  "BOGGED",
  "BREEZE",
  "CAMEL",
  "CAT",
  "CAVE_SPIDER",
  "CHICKEN",
  "COD",
  "COW",
  "CREAKING",
  "CREEPER",
  "DOLPHIN",
  "DONKEY",
  "DROWNED",
  "ELDER_GUARDIAN",
  "ENDER_DRAGON",
  "ENDERMAN",
  "ENDERMITE",
  "EVOKER",
  "FOX",
  "FROG",
  "GHAST",
  "GLOW_SQUID",
  "GOAT",
  "GUARDIAN",
  "HOGLIN",
  "HORSE",
  "HUSK",
  "ILLUSIONER",
  "IRON_GOLEM",
  "LLAMA",
  "MAGMA_CUBE",
  "MOOSHROOM",
  "MULE",
  "OCELOT",
  "PANDA",
  "PARROT",
  "PHANTOM",
  "PIG",
  "PIGLIN",
  "PIGLIN_BRUTE",
  "PILLAGER",
  "PLAYER",
  "POLAR_BEAR",
  "PUFFERFISH",
  "RABBIT",
  "RAVAGER",
  "SALMON",
  "SHEEP",
  "SHULKER",
  "SILVERFISH",
  "SKELETON",
  "SKELETON_HORSE",
  "SLIME",
  "SNIFFER",
  "SNOW_GOLEM",
  "SPIDER",
  "SQUID",
  "STRAY",
  "STRIDER",
  "TADPOLE",
  "TRADER_LLAMA",
  "TROPICAL_FISH",
  "TURTLE",
  "VEX",
  "VILLAGER",
  "VINDICATOR",
  "WANDERING_TRADER",
  "WARDEN",
  "WITCH",
  "WITHER",
  "WITHER_SKELETON",
  "WOLF",
  "ZOGLIN",
  "ZOMBIE",
  "ZOMBIE_HORSE",
  "ZOMBIE_VILLAGER",
  "ZOMBIFIED_PIGLIN"
], Kn = "#f59e0b";
function ce(e, t) {
  return J(t) ? e(`objective.${t}`) : t;
}
function de(e, t) {
  const n = Oe(t.type, t.params), a = he(t.params);
  return `${ce(e, t.type)}${n ? ` · ${n}` : ""}${a !== void 0 ? ` · 0/${String(a)}` : ""}`;
}
function z(e) {
  return e.replace(/<[^<>]*>/g, "").trim();
}
function Re(e) {
  const t = e.distribution?.strategy;
  return typeof t == "string" && ["sequential", "ladder"].includes(t.toLowerCase());
}
function Un(e, t, n) {
  const a = ot(n), s = Re(e);
  return e.quests.map((i, o) => {
    const l = R(t, i.title.key, n);
    return {
      id: i.uid,
      label: z(l) || i.key,
      detail: i.tier || void 0,
      caption: Qn(a, i),
      marker: s ? String(o + 1) : void 0,
      hover: {
        title: l || i.key,
        text: R(t, i.description.key, n) || void 0,
        lines: Fn(a, i, t, n)
      }
    };
  });
}
function Qn(e, t) {
  const n = t.stages.flatMap((i) => i.objectives), a = n[0];
  if (!a) return;
  const s = n.length - 1;
  return s > 0 ? `${de(e, a)} +${String(s)}` : de(e, a);
}
function Fn(e, t, n, a) {
  const s = t.stages.length > 1;
  return t.stages.flatMap(
    (i, o) => i.objectives.map((l) => {
      const d = de(e, l);
      return s ? `<gray>${z(R(n, i.title.key, a)) || e("stage", { n: o + 1 })} ·</gray> ${d}` : d;
    })
  );
}
function Gn(e, t) {
  const n = ot(t), a = typeof e.distribution?.strategy == "string" ? e.distribution.strategy.toLowerCase() : "", s = e.quests.length, i = s === 1 ? n("questCountOne") : n("questCount", { count: s }), o = a === "sequential" || a === "ladder" ? "ordered" : a;
  return ["none", "ordered", "random"].includes(o) ? `${i} · ${n(`strategy.${o}`).toLowerCase()}` : i;
}
function zn(e, t) {
  const n = he(t.params), a = Oe(t.type, t.params), s = n !== void 0 ? String(n) : "", i = s && a ? `${s} × ${a}` : s || a;
  return i ? `${ce(e, t.type)} · ${i}` : ce(e, t.type);
}
function kt(e) {
  return e.stages.flatMap((t) => t.objectives);
}
function Wn(e) {
  const t = kt(e), n = t.map((a) => a.key);
  return t.some(
    (a) => qt(a.type, a.params).length > 0 || n.indexOf(a.key) !== n.lastIndexOf(a.key)
  );
}
function Bn(e) {
  return Object.values($(e.rest.actions)).reduce(
    (t, n) => t + (Array.isArray(n) ? n.length : n == null ? 0 : 1),
    0
  );
}
function xt(e) {
  const t = e.completed_when;
  return Array.isArray(t) ? t : t ? [t] : [];
}
function ze(e) {
  const t = e.map((n) => {
    if (typeof n == "string") return n;
    const a = n && typeof n == "object" ? n.expression : void 0;
    return typeof a == "string" ? a : null;
  });
  return t.every((n) => n !== null) ? t.join(" · ") : null;
}
function Vn(e, t, n) {
  const a = structuredClone(e);
  a.uid = dt(), a.savedUid = void 0, a.savedKey = void 0, a.oldKeys = [], a.oldPlaces = [];
  for (const s of a.stages)
    for (const i of s.objectives)
      i.savedKey = void 0, delete i.params.old_key;
  a.key = te(`${e.key}_copy`, t), a.title = n(e.title), a.description = n(e.description);
  for (const [s, i] of a.stages.entries()) i.title = n(e.stages[s].title);
  return a;
}
const We = ["player", "global"], ke = /* @__PURE__ */ new Set();
function Yn(e, t, n) {
  if (n && n.length > 0)
    return t && !n.includes(t) ? [...n, t] : [...n];
  const a = e?.documents?.[se];
  for (const s of Array.isArray(a) ? a : []) {
    const i = s.actorType;
    typeof i == "string" && i && ke.add(i);
  }
  return t && ke.add(t), [...We, ...[...ke].filter((s) => !We.includes(s)).sort()];
}
function wt(e, t) {
  if (typeof e == "string") return e === "" ? {} : { [t]: e };
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const n = {};
  for (const [a, s] of Object.entries(e))
    typeof s == "string" && s !== "" && (n[a] = s);
  return n;
}
function Jn(e, t, n, a) {
  const s = wt(e, t);
  return a === "" ? delete s[n] : s[n] = a, Object.keys(s).length > 0 ? s : void 0;
}
const Zn = /^(\d+|(\d+[dhms])+)$/, Xn = ["actor_load", "period_reset", "quest_complete"], ea = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
function ta(e, t) {
  const n = Rn(e, /* @__PURE__ */ new Date());
  if (!n) return null;
  try {
    return new Intl.DateTimeFormat(t, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(n);
  } catch {
    return n.toLocaleString();
  }
}
function na({ projectId: e, documentId: t, document: n, item: a }) {
  je("msquests", Te);
  const s = n, i = Ut(e), o = Qt(), l = pe(), [d, c] = I(a ?? null);
  Ae(() => {
    c(a ?? null);
  }, [a]);
  const u = (b) => {
    c(b), Gt({ documentId: t, item: b });
  }, q = { projectId: e, project: i, lang: o, t: l, edit: (b, y) => {
    const v = structuredClone(s);
    b(v), tt({ projectId: e, kind: se, id: t, doc: v, texts: y });
  } }, h = d ? s.quests.findIndex((b) => b.uid === d) : -1;
  return /* @__PURE__ */ r("div", { className: "aq", children: h >= 0 ? /* @__PURE__ */ r(ma, { ctx: q, group: s, index: h, onLeave: () => u(null) }, d) : /* @__PURE__ */ r(oa, { ctx: q, group: s, onOpen: u }) });
}
function ne({ open: e }) {
  return /* @__PURE__ */ r(
    "svg",
    {
      "aria-hidden": "true",
      className: `aq-chevron${e ? " is-open" : ""}`,
      width: "14",
      height: "14",
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ r("path", { d: "M6 3l5 5-5 5" })
    }
  );
}
function aa() {
  return /* @__PURE__ */ f("svg", { "aria-hidden": "true", width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: [
    /* @__PURE__ */ r("circle", { cx: "3", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "8", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "13", cy: "8", r: "1.5" })
  ] });
}
function E({ tone: e, title: t, children: n }) {
  return /* @__PURE__ */ r("span", { className: `aq-chip${e ? ` is-${e}` : ""}`, title: t, children: n });
}
function ue({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  return /* @__PURE__ */ r("div", { className: "aq-seg", role: "radiogroup", "aria-label": e, children: n.map((s) => /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      role: "radio",
      "aria-checked": t === s.value,
      className: `aq-opt${t === s.value ? " is-on" : ""}`,
      onClick: () => a(s.value),
      children: s.label
    },
    s.value
  )) });
}
function O({
  label: e,
  children: t,
  hint: n,
  title: a
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the control is the child
    /* @__PURE__ */ f("label", { className: "aq-field", title: a, children: [
      /* @__PURE__ */ r("span", { className: "field-label", children: e }),
      t,
      n
    ] })
  );
}
function B({
  ctx: e,
  label: t,
  node: n,
  multiline: a,
  rows: s,
  bare: i,
  placeholder: o
}) {
  const l = nt(e.project);
  return /* @__PURE__ */ r(
    at,
    {
      className: "aq-field",
      label: t,
      langs: l,
      activeLang: e.lang,
      defaultLang: l[0] ?? e.lang,
      values: st(e.project, n.key),
      onChange: (d, c) => e.edit(() => {
      }, [{ key: n.key, lang: d, value: c }]),
      inline: i,
      renderEditor: (d) => /* @__PURE__ */ r(
        Se,
        {
          value: d.value,
          onChange: d.onChange,
          placeholder: d.fallback ?? o,
          multiline: a,
          rows: a ? s : void 0,
          "aria-label": d.label
        }
      )
    }
  );
}
function _t({
  ctx: e,
  label: t,
  value: n,
  onChange: a
}) {
  const s = nt(e.project), i = s[0] ?? e.lang;
  return /* @__PURE__ */ r("span", { title: e.t("lineHint"), className: "aq-grow", children: /* @__PURE__ */ r(
    at,
    {
      className: "aq-field",
      label: t,
      langs: s,
      activeLang: e.lang,
      defaultLang: i,
      values: wt(n, i),
      onChange: (o, l) => a(Jn(n, i, o, l)),
      renderEditor: (o) => /* @__PURE__ */ r(
        Se,
        {
          value: o.value,
          onChange: o.onChange,
          placeholder: o.fallback,
          "aria-label": o.label
        }
      )
    }
  ) });
}
function sa(e) {
  return typeof e == "number" ? String(e) : typeof e == "string" ? e : "";
}
function Q({
  label: e,
  value: t,
  onChange: n,
  placeholder: a
}) {
  return /* @__PURE__ */ r(O, { label: e, children: /* @__PURE__ */ r(
    "input",
    {
      className: "input",
      type: "number",
      min: 0,
      step: 1,
      value: sa(t),
      placeholder: a,
      onChange: (s) => {
        const i = s.target.value.trim();
        n(i === "" ? void 0 : Math.max(0, Math.trunc(Number(i))));
      }
    }
  ) });
}
function ia(e) {
  const t = Nt(e);
  return t !== "" && t !== "none";
}
function Nt(e) {
  return typeof e.strategy == "string" ? e.strategy.toLowerCase() : "";
}
function A(e, t, n) {
  n === void 0 || n === "" ? delete e[t] : e[t] = n;
}
function De(e, t, n) {
  if (n < 0 || n >= e.length) return;
  const [a] = e.splice(t, 1);
  e.splice(n, 0, a);
}
function fe({
  label: e,
  onClick: t,
  disabled: n,
  expanded: a,
  children: s
}) {
  return /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      className: "aq-icon-btn",
      title: e,
      "aria-label": e,
      "aria-expanded": a,
      onClick: t,
      disabled: n,
      children: s
    }
  );
}
function Ie({
  t: e,
  label: t,
  sure: n,
  onRemove: a
}) {
  const [s, i] = I(!1);
  return s ? /* @__PURE__ */ f("span", { className: "aq-confirm", children: [
    /* @__PURE__ */ r(V, { size: "sm", variant: "ghost", onClick: () => i(!1), children: e("cancel") }),
    /* @__PURE__ */ r("button", { type: "button", className: "aq-danger", onClick: a, children: e("remove") })
  ] }) : /* @__PURE__ */ r(fe, { label: t, onClick: () => n ? a() : i(!0), children: "×" });
}
function ra({
  label: e,
  children: t
}) {
  const [n, a] = I(!1), s = rt(null);
  return Ae(() => {
    if (!n) return;
    const i = (l) => {
      s.current?.contains(l.target) || a(!1);
    }, o = (l) => {
      l.key === "Escape" && (l.preventDefault(), a(!1));
    };
    return window.addEventListener("mousedown", i), window.addEventListener("keydown", o, !0), () => {
      window.removeEventListener("mousedown", i), window.removeEventListener("keydown", o, !0);
    };
  }, [n]), /* @__PURE__ */ f("div", { className: "aq-menu-anchor", ref: s, children: [
    /* @__PURE__ */ r(fe, { label: e, expanded: n, onClick: () => a(!n), children: /* @__PURE__ */ r(aa, {}) }),
    n && /* @__PURE__ */ r("div", { className: "aq-menu", role: "menu", children: t(() => a(!1)) })
  ] });
}
function jt(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n, a) => {
    const s = t.has(n) ? `${n}#${a}` : n;
    return t.add(n), s;
  });
}
function oa({
  ctx: e,
  group: t,
  onOpen: n
}) {
  const { t: a, edit: s, project: i, lang: o } = e, [l, d] = I(t.quests.length === 0), [c, u] = I(null), p = Re(t), q = Object.keys(t.rest).filter((y) => y !== "actions"), h = () => {
    const y = F(), v = dt();
    s(
      (k) => {
        k.quests.push({
          key: te(
            "quest",
            k.quests.map((x) => x.key)
          ),
          uid: v,
          oldKeys: [],
          oldPlaces: [],
          tier: "",
          title: { key: y },
          description: { key: F() },
          duration: "",
          stages: [At(1)],
          rest: {}
        });
      },
      [{ key: y, lang: o, value: a("newQuestTitle") }]
    ), n(v);
  }, b = (y) => {
    const v = [], k = (x) => {
      const _ = F();
      for (const [C, S] of Object.entries(st(i, x.key)))
        S !== "" && v.push({ key: _, lang: C, value: S });
      return { key: _ };
    };
    s((x) => {
      x.quests.splice(
        y + 1,
        0,
        Vn(
          x.quests[y],
          x.quests.map((_) => _.key),
          k
        )
      );
    }, v);
  };
  return /* @__PURE__ */ f(H, { children: [
    /* @__PURE__ */ f("section", { className: "aq-card", children: [
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "aq-fold-head",
          "aria-expanded": l,
          onClick: () => d(!l),
          children: [
            /* @__PURE__ */ r(ne, { open: l }),
            /* @__PURE__ */ r("span", { className: "aq-h", children: a("groupSettings") }),
            !l && /* @__PURE__ */ r(ca, { ctx: e, group: t })
          ]
        }
      ),
      l && /* @__PURE__ */ r(da, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-card", children: [
      /* @__PURE__ */ f("div", { className: "aq-card-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: a("quests") }),
        /* @__PURE__ */ r("span", { className: "aq-count", children: t.quests.length }),
        /* @__PURE__ */ r("span", { className: "aq-grow" }),
        /* @__PURE__ */ f(V, { size: "sm", variant: "primary", onClick: h, children: [
          "+ ",
          a("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: a("noQuests") }),
      /* @__PURE__ */ r(
        Ce,
        {
          ids: t.quests.map((y) => y.uid),
          onMove: (y, v) => s((k) => De(k.quests, y, v)),
          className: "aq-quests",
          itemClassName: "aq-quest",
          children: (y, v) => {
            const k = t.quests[y], x = z(R(i, k.title.key, o)) || k.key, _ = kt(k), C = xt(k.rest), S = t.tiers.find((m) => m.key === k.tier), L = Bn(k);
            return /* @__PURE__ */ f(H, { children: [
              v,
              p && /* @__PURE__ */ r("span", { className: "aq-n", children: y + 1 }),
              /* @__PURE__ */ f("button", { type: "button", className: "aq-quest-main", onClick: () => n(k.uid), children: [
                /* @__PURE__ */ r("span", { className: "aq-quest-title", children: x }),
                /* @__PURE__ */ r("span", { className: "aq-quest-sub", children: _.length === 0 ? a("noObjectivesShort") : _.map((m) => zn(a, m)).join("  ·  ") })
              ] }),
              c === k.uid ? /* @__PURE__ */ f("span", { className: "aq-confirm", children: [
                /* @__PURE__ */ r("span", { children: a("removeConfirm", { name: x }) }),
                /* @__PURE__ */ r(V, { size: "sm", variant: "ghost", onClick: () => u(null), children: a("cancel") }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "aq-danger",
                    onClick: () => {
                      u(null), s((m) => {
                        m.quests.splice(y, 1);
                      });
                    },
                    children: a("remove")
                  }
                )
              ] }) : /* @__PURE__ */ f(H, { children: [
                /* @__PURE__ */ f("span", { className: "aq-chips", children: [
                  Wn(k) && /* @__PURE__ */ r(E, { tone: "warn", children: a("toComplete") }),
                  p && C.length > 0 && /* @__PURE__ */ f(E, { title: a("completedWhenHint"), children: [
                    a("completedWhen"),
                    " ",
                    ze(C) !== null ? /* @__PURE__ */ r("span", { className: "aq-mono", children: ze(C) }) : a("conditionCount", { count: C.length })
                  ] }),
                  k.tier && /* @__PURE__ */ r(E, { children: S && z(R(i, S.title.key, o)) || k.tier }),
                  k.duration && /* @__PURE__ */ r(E, { children: k.duration }),
                  L > 0 && /* @__PURE__ */ r(E, { children: L === 1 ? a("actionCountOne") : a("actionCount", { count: L }) })
                ] }),
                /* @__PURE__ */ r(ra, { label: a("moreActions"), children: (m) => /* @__PURE__ */ f(H, { children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      onClick: () => {
                        m(), b(y);
                      },
                      children: a("duplicate")
                    }
                  ),
                  /* @__PURE__ */ f(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      className: "is-danger",
                      onClick: () => {
                        m(), u(k.uid);
                      },
                      children: [
                        a("remove"),
                        "…"
                      ]
                    }
                  )
                ] }) })
              ] })
            ] });
          }
        }
      ),
      q.length > 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: a("kept", { fields: q.join(", ") }) })
    ] })
  ] });
}
function Ct(e, t) {
  return t === "player" || t === "global" || t === "guild" ? e(`actor.${t}`) : t;
}
const la = "quests:actor_types";
function we(e) {
  const t = Nt(e);
  return t === "sequential" || t === "ladder" ? "ordered" : t === "none" || t === "random" ? t : "";
}
function ca({ ctx: e, group: t }) {
  const { t: n } = e, a = it(), s = typeof t.reset.cron == "string" ? t.reset.cron : "", i = we(t.distribution), o = Object.keys($(t.rest.actions)).length, l = s ? On(s, a) ?? s : n("noReset");
  return /* @__PURE__ */ f("span", { className: "aq-chips", children: [
    /* @__PURE__ */ r(E, { children: Ct(n, t.actorType) }),
    i && /* @__PURE__ */ r(E, { children: n(`strategy.${i}`) }),
    /* @__PURE__ */ r(E, { children: l.charAt(0).toUpperCase() + l.slice(1) }),
    t.tiers.length > 0 && /* @__PURE__ */ r(E, { children: n("tierCount", { count: t.tiers.length }) }),
    o > 0 && /* @__PURE__ */ r(E, { children: n("eventCount", { count: o }) })
  ] });
}
function da({ ctx: e, group: t }) {
  const { t: n, edit: a, project: s, lang: i } = e, o = we(t.distribution), l = o === "ordered", d = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], c = t.distribution.tiers ?? {}, u = zt(la)?.map((h) => h.value), p = Yn(s, t.actorType, u), q = !!u?.length && !!t.actorType && !u.includes(t.actorType);
  return /* @__PURE__ */ f("div", { className: "aq-settings", children: [
    /* @__PURE__ */ f("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("identity") }),
      /* @__PURE__ */ r(B, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ r(B, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ f("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("actorType") }),
        /* @__PURE__ */ r(
          ue,
          {
            label: n("actorType"),
            value: t.actorType,
            options: p.map((h) => ({ value: h, label: Ct(n, h) })),
            onChange: (h) => a((b) => {
              b.actorType = h;
            })
          }
        ),
        q && /* @__PURE__ */ r("span", { className: "aq-warn", children: n("actorUnknown", { type: t.actorType }) })
      ] })
    ] }),
    /* @__PURE__ */ f("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("distribution") }),
      /* @__PURE__ */ f("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("strategy") }),
        /* @__PURE__ */ r(
          ue,
          {
            label: n("strategy"),
            value: o,
            options: ["none", "ordered", "random"].map((h) => ({
              value: h,
              label: n(`strategy.${h}`)
            })),
            onChange: (h) => a((b) => {
              h === "ordered" && we(b.distribution) === "ordered" || (b.distribution.strategy = h === "ordered" ? "sequential" : h);
            })
          }
        )
      ] }),
      !l && /* @__PURE__ */ f(H, { children: [
        /* @__PURE__ */ f("div", { className: "aq-row", children: [
          /* @__PURE__ */ r(
            Q,
            {
              label: n("amount"),
              value: t.distribution.amount,
              onChange: (h) => a((b) => A(b.distribution, "amount", h))
            }
          ),
          /* @__PURE__ */ r(
            Q,
            {
              label: n("maxActive"),
              value: t.limits.max_active,
              onChange: (h) => a((b) => A(b.limits, "max_active", h))
            }
          )
        ] }),
        /* @__PURE__ */ f("div", { className: "aq-field", children: [
          /* @__PURE__ */ r("span", { className: "field-label", children: n("triggers") }),
          Xn.map((h) => /* @__PURE__ */ f("label", { className: "aq-check", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: d.includes(h),
                onChange: (b) => a((y) => {
                  const v = Array.isArray(y.distribution.triggers) ? y.distribution.triggers : [], k = b.target.checked ? [...v, h] : v.filter((x) => x !== h);
                  A(y.distribution, "triggers", k.length ? k : void 0);
                })
              }
            ),
            n(`trigger.${h}`)
          ] }, h))
        ] })
      ] }),
      /* @__PURE__ */ r(
        Q,
        {
          label: n("questsPerPeriod"),
          placeholder: n("noLimit"),
          value: t.limits.max_per_period,
          onChange: (h) => a((b) => A(b.limits, "max_per_period", h))
        }
      ),
      !l && /* @__PURE__ */ f("div", { className: "aq-row", children: [
        /* @__PURE__ */ f("label", { className: "aq-check", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: t.rotation.enabled === !0,
              onChange: (h) => a((b) => A(b.rotation, "enabled", h.target.checked ? !0 : void 0))
            }
          ),
          n("rotationEnabled")
        ] }),
        t.rotation.enabled === !0 ? /* @__PURE__ */ r(
          Q,
          {
            label: n("rotationsPerPeriod"),
            placeholder: n("noLimit"),
            value: t.rotation.max_per_period,
            onChange: (h) => a((b) => A(b.rotation, "max_per_period", h))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ f("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("reset") }),
      /* @__PURE__ */ r(ua, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ f("div", { className: "aq-block", children: [
      /* @__PURE__ */ f("div", { className: "aq-block-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("tiers") }),
        /* @__PURE__ */ f(
          V,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => a((h) => {
              h.tiers.push({
                key: te(
                  "tier",
                  h.tiers.map((b) => b.key)
                ),
                title: { key: F() },
                rest: {}
              });
            }),
            children: [
              "+ ",
              n("addTier")
            ]
          }
        )
      ] }),
      t.tiers.map((h, b) => /* @__PURE__ */ f("div", { className: "aq-tier", children: [
        /* @__PURE__ */ r(B, { ctx: e, label: n("title"), node: h.title }),
        /* @__PURE__ */ r(O, { label: n("tierKey"), children: /* @__PURE__ */ r(
          "input",
          {
            className: "input aq-mono",
            defaultValue: h.key,
            onBlur: (y) => {
              const v = me(y.target.value);
              v !== h.key && a((k) => {
                const x = te(
                  v,
                  k.tiers.map((C) => C.key)
                );
                k.tiers[b].key = x;
                for (const C of k.quests) C.tier === h.key && (C.tier = x);
                const _ = k.distribution.tiers;
                _ && h.key in _ && (_[x] = _[h.key], delete _[h.key]);
              });
            }
          }
        ) }),
        !l && /* @__PURE__ */ r(
          Q,
          {
            label: n("perTier"),
            value: c[h.key],
            onChange: (y) => a((v) => {
              const k = { ...v.distribution.tiers ?? {} };
              A(k, h.key, y), A(v.distribution, "tiers", Object.keys(k).length ? k : void 0);
            })
          }
        ),
        /* @__PURE__ */ r(
          Ie,
          {
            t: n,
            label: n("remove"),
            sure: !t.quests.some((y) => y.tier === h.key),
            onRemove: () => a((y) => {
              y.tiers.splice(b, 1);
            })
          }
        )
      ] }, h.key)),
      t.tiers.length === 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: n("noTier") })
    ] }),
    /* @__PURE__ */ r("div", { className: "aq-block is-wide", children: /* @__PURE__ */ r(
      St,
      {
        ctx: e,
        title: n("hooks"),
        hooks: bn,
        label: (h) => n(`hook.${h}`),
        value: t.rest.actions,
        onChange: (h, b) => a((y) => {
          const v = { ...$(y.rest.actions) };
          A(v, h, b), A(y.rest, "actions", Object.keys(v).length ? v : void 0);
        })
      },
      t.id
    ) })
  ] });
}
function ua({ ctx: e, group: t }) {
  const { t: n, edit: a } = e, s = it(), i = typeof t.reset.cron == "string" ? t.reset.cron : "", o = Dn(i), [l, d] = I(!1), c = l && i !== "" ? { kind: "custom" } : o, u = typeof t.reset.timezone == "string" ? t.reset.timezone : "", p = i && qe(i) ? ta(i, s) : null, q = (y) => {
    const v = In(y);
    v !== null && a((k) => A(k.reset, "cron", v));
  }, h = "time" in c ? c.time : "04:00", b = (y) => {
    d(y === "custom"), y === "never" ? q({ kind: y }) : y === "daily" ? q({ kind: y, time: h }) : y === "weekly" ? q({ kind: y, time: h, day: 1 }) : y === "monthly" ? q({ kind: y, time: h, day: 1 }) : i === "" && a((v) => A(v.reset, "cron", "0 4 * * *"));
  };
  return /* @__PURE__ */ f(H, { children: [
    /* @__PURE__ */ r(
      ue,
      {
        label: n("reset"),
        value: c.kind,
        options: ["never", "daily", "weekly", "monthly", "custom"].map((y) => ({
          value: y,
          label: n(`reset.${y}`)
        })),
        onChange: b
      }
    ),
    c.kind !== "never" && /* @__PURE__ */ f("div", { className: "aq-row aq-reset", children: [
      c.kind === "weekly" && /* @__PURE__ */ r(O, { label: n("resetDay"), children: /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: c.day,
          onChange: (y) => q({ ...c, day: Number(y.target.value) }),
          children: [1, 2, 3, 4, 5, 6, 0].map((y) => /* @__PURE__ */ r("option", { value: y, children: Pn(s)[y] }, y))
        }
      ) }),
      c.kind === "monthly" && /* @__PURE__ */ r(
        Q,
        {
          label: n("resetDayOfMonth"),
          value: c.day,
          onChange: (y) => q({ ...c, day: y ?? 1 })
        }
      ),
      c.kind === "custom" ? /* @__PURE__ */ r(
        O,
        {
          label: n("cron"),
          hint: qe(i) ? void 0 : /* @__PURE__ */ r("span", { className: "aq-err", children: n("cronInvalid") }),
          children: /* @__PURE__ */ r(
            "input",
            {
              className: "input aq-mono",
              value: i,
              placeholder: "0 4 * * *",
              onChange: (y) => a((v) => A(v.reset, "cron", y.target.value))
            }
          )
        }
      ) : /* @__PURE__ */ r(O, { label: n("resetTime"), children: /* @__PURE__ */ r(
        "input",
        {
          className: "input",
          type: "time",
          value: c.time,
          onChange: (y) => y.target.value && q({ ...c, time: y.target.value })
        }
      ) })
    ] }),
    i && qe(i) && (u || p) && /* @__PURE__ */ r("span", { className: "aq-ok", children: u && u !== ea ? u : p ? n("nextRun", { when: p }) : "" })
  ] });
}
function pa({
  ctx: e,
  value: t,
  onChange: n
}) {
  const { chain: a, legacy: s } = gn(t);
  return /* @__PURE__ */ f("div", { className: "aq-chain", children: [
    /* @__PURE__ */ r(
      Wt,
      {
        projectId: e.projectId,
        value: a,
        onChange: (i) => n(Fe(i, s))
      }
    ),
    s.length > 0 && /* @__PURE__ */ r("div", { className: "aq-legacy", title: e.t("legacySteps"), children: s.map((i, o) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
      /* @__PURE__ */ f("div", { className: "aq-legacy-row", children: [
        /* @__PURE__ */ r("code", { children: vn(i) }),
        /* @__PURE__ */ r(
          fe,
          {
            label: e.t("remove"),
            onClick: () => n(Fe(a, s.filter((l, d) => d !== o))),
            children: "×"
          }
        )
      ] }, o)
    )) })
  ] });
}
function St({
  ctx: e,
  title: t,
  hooks: n,
  label: a,
  value: s,
  onChange: i
}) {
  const { t: o } = e, l = $(s), [d, c] = I([]), [u, p] = I(null), q = n.filter((b) => l[b] != null || d.includes(b)), h = n.filter((b) => !q.includes(b));
  return /* @__PURE__ */ f(H, { children: [
    /* @__PURE__ */ f("div", { className: "aq-block-head", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: t }),
      h.length > 0 && /* @__PURE__ */ f(
        "select",
        {
          className: "select aq-event-add",
          "aria-label": o("addEvent"),
          value: "",
          onChange: (b) => {
            const y = h.find((v) => v === b.target.value);
            y && (c((v) => [...v, y]), p(y));
          },
          children: [
            /* @__PURE__ */ f("option", { value: "", children: [
              "+ ",
              o("addEvent")
            ] }),
            h.map((b) => /* @__PURE__ */ r("option", { value: b, children: a(b) }, b))
          ]
        }
      )
    ] }),
    q.map((b) => {
      const y = u === b, v = Array.isArray(l[b]) ? l[b].length : l[b] ? 1 : 0;
      return /* @__PURE__ */ f("div", { className: `aq-line${y ? " is-open" : ""}`, children: [
        /* @__PURE__ */ f("div", { className: "aq-line-head", children: [
          /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "aq-line-main",
              "aria-expanded": y,
              onClick: () => p(y ? null : b),
              children: [
                /* @__PURE__ */ r(ne, { open: y }),
                /* @__PURE__ */ r("span", { className: "aq-line-text", children: a(b) }),
                v > 0 && /* @__PURE__ */ r(E, { children: v === 1 ? o("actionCountOne") : o("actionCount", { count: v }) })
              ]
            }
          ),
          /* @__PURE__ */ r(
            Ie,
            {
              t: o,
              label: o("removeEvent"),
              sure: v === 0,
              onRemove: () => {
                c((k) => k.filter((x) => x !== b)), i(b, void 0);
              }
            }
          )
        ] }),
        y && /* @__PURE__ */ r("div", { className: "aq-line-body", children: /* @__PURE__ */ r(pa, { ctx: e, value: l[b], onChange: (k) => i(b, k) }) })
      ] }, b);
    })
  ] });
}
function At(e) {
  return {
    key: `stage_${e}`,
    title: { key: F() },
    flow: "parallel",
    objectives: [],
    rest: {}
  };
}
function ma({
  ctx: e,
  group: t,
  index: n,
  onLeave: a
}) {
  const { t: s, edit: i, project: o, lang: l } = e, d = t.quests[n], c = (g, w) => i((j) => g(j.quests[n]), w), u = t.quests.some((g, w) => w !== n && g.key === d.key), p = rt(d.key), q = u ? null : cn(d), h = ft(d, new Set(t.quests.map((g) => g.key))), b = d.duration !== "" && !Zn.test(d.duration.replace(/\s/g, "").toLowerCase()), y = Object.keys(d.rest).filter(
    (g) => g !== "actions" && g !== "giver" && g !== "completed_when"
  ), v = Re(t), k = d.rest.giver && typeof d.rest.giver == "object" ? d.rest.giver : {}, x = (g, w) => c((j) => {
    const M = { ...k };
    A(M, g, w.trim()), typeof M.npc == "string" && M.npc !== "" ? j.rest.giver = M : delete j.rest.giver;
  }), _ = typeof k.npc == "string" ? k.npc : "", C = ia(t.distribution), S = t.tiers.find((g) => g.key === d.tier), [L, m] = I(!1), N = L || u || b;
  return Ae(() => {
    const g = (w) => {
      w.key !== "Escape" || w.defaultPrevented || w.target?.closest("input, textarea, select, [contenteditable='true']") || window.document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]') || (w.preventDefault(), a());
    };
    return window.addEventListener("keydown", g, !0), () => window.removeEventListener("keydown", g, !0);
  }, [a]), /* @__PURE__ */ f("div", { className: "aq-quest-page", children: [
    /* @__PURE__ */ f("div", { className: "aq-quest-col", children: [
      /* @__PURE__ */ f("section", { className: "aq-card", children: [
        /* @__PURE__ */ f("div", { className: "aq-quest-head", children: [
          /* @__PURE__ */ r("div", { className: "aq-quest-name", children: /* @__PURE__ */ r(B, { ctx: e, label: s("questName"), node: d.title }) }),
          /* @__PURE__ */ r(
            B,
            {
              ctx: e,
              multiline: !0,
              rows: 2,
              label: s("questDescription"),
              node: d.description
            }
          )
        ] }),
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: "aq-fold-head is-inner",
            "aria-expanded": N,
            onClick: () => m(!N),
            children: [
              /* @__PURE__ */ r(ne, { open: N }),
              /* @__PURE__ */ r("span", { className: "aq-fold-title", children: s("questSettings") }),
              !N && /* @__PURE__ */ f("span", { className: "aq-chips", children: [
                d.tier && /* @__PURE__ */ r(E, { children: S && z(R(o, S.title.key, l)) || d.tier }),
                /* @__PURE__ */ r(E, { children: d.duration || s("noTimeLimit") }),
                _ && /* @__PURE__ */ r(E, { children: s("givenBy", { npc: _ }) }),
                /* @__PURE__ */ r(E, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: d.key }) })
              ] })
            ]
          }
        ),
        N && /* @__PURE__ */ f("div", { className: "aq-fold-body", children: [
          /* @__PURE__ */ f("div", { className: "aq-row aq-top aq-wrap", children: [
            t.tiers.length > 0 || d.tier ? /* @__PURE__ */ r(O, { label: s("tier"), children: /* @__PURE__ */ f(
              "select",
              {
                className: "select",
                value: d.tier,
                onChange: (g) => c((w) => {
                  w.tier = g.target.value;
                }),
                children: [
                  /* @__PURE__ */ r("option", { value: "", children: s("noTier") }),
                  t.tiers.map((g) => /* @__PURE__ */ r("option", { value: g.key, children: z(R(o, g.title.key, l)) || g.key }, g.key)),
                  d.tier && !S && /* @__PURE__ */ r("option", { value: d.tier, children: d.tier })
                ]
              }
            ) }) : null,
            /* @__PURE__ */ r(
              O,
              {
                label: s("duration"),
                hint: b ? /* @__PURE__ */ r("span", { className: "aq-err", children: s("durationInvalid") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input",
                    value: d.duration,
                    placeholder: "24h",
                    onChange: (g) => c((w) => {
                      w.duration = g.target.value.trim();
                    })
                  }
                )
              }
            ),
            /* @__PURE__ */ r(
              O,
              {
                label: s("key"),
                hint: u ? /* @__PURE__ */ r("span", { className: "aq-err", children: s("keyTaken") }) : q ? /* @__PURE__ */ f("span", { className: "aq-keychange", role: "group", "aria-label": s("keyChangeAsk"), children: [
                  /* @__PURE__ */ f("span", { className: "aq-warn", children: [
                    s("keyChanged", { from: q, to: d.key }),
                    " ",
                    s("keyChangeAsk")
                  ] }),
                  /* @__PURE__ */ f("span", { className: "aq-row aq-wrap", children: [
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        className: "btn btn-sm",
                        title: s("keyChangeKeepHint", { from: q }),
                        onClick: () => c((g) => ve(g, "keep")),
                        children: s("keyChangeKeep")
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        className: "btn btn-sm",
                        title: s("keyChangeResetHint", { from: q }),
                        onClick: () => c((g) => ve(g, "reset")),
                        children: s("keyChangeReset")
                      }
                    )
                  ] }),
                  /* @__PURE__ */ r("span", { children: s("keyChangeUnanswered") })
                ] }) : h.length > 0 ? /* @__PURE__ */ f("span", { children: [
                  s("formerKeys", { keys: h.join(", ") }),
                  " ",
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "aq-forget",
                      title: s("keyChangeResetHint", { from: h.join(", ") }),
                      onClick: () => c((g) => ve(g, "reset")),
                      children: s("forgetFormerKeys")
                    }
                  )
                ] }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input aq-mono",
                    value: d.key,
                    onFocus: () => {
                      p.current = d.key;
                    },
                    onChange: (g) => c((w) => {
                      w.key = ut(g.target.value);
                    }),
                    onBlur: () => {
                      const g = me(d.key), w = p.current;
                      (g !== d.key || w !== g) && c((j) => {
                        j.key = g, w !== j.savedKey && ht(j, w);
                      });
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ f("div", { className: "aq-row aq-top aq-wrap", children: [
            /* @__PURE__ */ r(O, { label: s("giverNpc"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: _,
                onChange: (g) => x("npc", g.target.value)
              }
            ) }),
            _ && /* @__PURE__ */ r(O, { label: s("giverConversation"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: typeof k.conversation == "string" ? k.conversation : "",
                onChange: (g) => x("conversation", g.target.value)
              }
            ) })
          ] }),
          _ && /* @__PURE__ */ r(
            _t,
            {
              ctx: e,
              label: s("giverLine"),
              value: k.line,
              onChange: (g) => c((w) => {
                const j = { ...k };
                A(j, "line", g), w.rest.giver = j;
              })
            }
          ),
          _ && C && /* @__PURE__ */ r("span", { className: "aq-warn", children: s("giverDistributed") })
        ] })
      ] }),
      /* @__PURE__ */ r(
        Ce,
        {
          ids: jt(d.stages.map((g) => g.key)),
          onMove: (g, w) => c((j) => De(j.stages, g, w)),
          className: "aq-stages",
          children: (g, w) => /* @__PURE__ */ r(
            ha,
            {
              ctx: e,
              quest: d,
              stage: d.stages[g],
              si: g,
              handle: w,
              editQuest: c
            }
          )
        }
      ),
      /* @__PURE__ */ f(
        V,
        {
          size: "sm",
          variant: "ghost",
          className: "aq-add",
          onClick: () => c((g) => {
            const w = te(
              `stage_${g.stages.length + 1}`,
              g.stages.map((j) => j.key)
            );
            g.stages.push({ ...At(g.stages.length + 1), key: w });
          }),
          children: [
            "+ ",
            s("addStage")
          ]
        }
      ),
      v && /* @__PURE__ */ f("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ f("span", { className: "aq-h aq-h-row", children: [
          s("completedWhen"),
          /* @__PURE__ */ r("span", { className: "aq-help", tabIndex: 0, role: "note", "aria-label": s("completedWhenHint"), "data-tip": s("completedWhenHint"), children: "?" })
        ] }),
        /* @__PURE__ */ r(
          Ft,
          {
            projectId: e.projectId,
            value: xt(d.rest),
            emptyHint: s("completedWhenEmpty"),
            onChange: (g) => c((w) => A(w.rest, "completed_when", g.length > 0 ? g : void 0))
          },
          d.uid
        )
      ] }),
      /* @__PURE__ */ f("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r(
          St,
          {
            ctx: e,
            title: s("questEvents"),
            hooks: qn,
            label: (g) => s(`questHook.${g}`),
            value: d.rest.actions,
            onChange: (g, w) => c((j) => {
              const M = { ...$(j.rest.actions) };
              A(M, g, w), A(j.rest, "actions", Object.keys(M).length > 0 ? M : void 0);
            })
          },
          d.uid
        ),
        y.length > 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: s("kept", { fields: y.join(", ") }) })
      ] })
    ] }),
    /* @__PURE__ */ f("aside", { className: "aq-card aq-pad aq-aside", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: s("preview") }),
      /* @__PURE__ */ r(ba, { ctx: e, quest: d })
    ] })
  ] });
}
function ha({
  ctx: e,
  quest: t,
  stage: n,
  si: a,
  handle: s,
  editQuest: i
}) {
  const { t: o } = e, [l, d] = I(null), [c, u] = I(!1), p = (v) => i((k) => v(k.stages[a])), q = n.flow || "parallel", h = t.stages.flatMap((v) => v.objectives.map((k) => k.key)), b = c || n.objectives.length === 0, y = (v) => {
    const k = sn(v, h);
    i((x) => {
      x.stages[a].objectives.push({ key: k, type: v, params: vt(v) });
    }), d(k), u(!1);
  };
  return /* @__PURE__ */ f("div", { className: "aq-card aq-stage", children: [
    /* @__PURE__ */ f("div", { className: "aq-stage-head", children: [
      s,
      /* @__PURE__ */ r("span", { className: "aq-eyebrow aq-stage-label", children: o("stage", { n: a + 1 }) }),
      /* @__PURE__ */ r("div", { className: "aq-stage-title", children: /* @__PURE__ */ r(
        B,
        {
          ctx: e,
          bare: !0,
          label: o("stageName"),
          node: n.title,
          placeholder: o("stageNameDefault", { n: a + 1 })
        }
      ) }),
      n.objectives.length > 1 && /* @__PURE__ */ r(
        ue,
        {
          label: o("flow"),
          value: q,
          options: ["parallel", "sequential"].map((v) => ({
            value: v,
            label: o(`flow.${v}`)
          })),
          onChange: (v) => p((k) => {
            k.flow = v;
          })
        }
      ),
      /* @__PURE__ */ r(
        Ie,
        {
          t: o,
          label: o("remove"),
          sure: n.objectives.length === 0,
          onRemove: () => i((v) => {
            v.stages.splice(a, 1);
          })
        }
      )
    ] }),
    /* @__PURE__ */ f("span", { className: "aq-eyebrow", children: [
      o("objectives"),
      " ",
      /* @__PURE__ */ r("span", { className: "aq-count", children: n.objectives.length })
    ] }),
    /* @__PURE__ */ r(
      Ce,
      {
        ids: jt(n.objectives.map((v) => v.key)),
        onMove: (v, k) => p((x) => De(x.objectives, v, k)),
        className: "aq-objectives",
        children: (v, k) => {
          const x = n.objectives[v];
          return /* @__PURE__ */ r(
            fa,
            {
              ctx: e,
              t: o,
              projectId: e.projectId,
              n: q === "sequential" ? `${a + 1}.${v + 1}` : "",
              objective: x,
              open: l === x.key,
              onToggle: () => d(l === x.key ? null : x.key),
              keyTaken: h.filter((_) => _ === x.key).length > 1,
              handle: k,
              onChange: (_) => p((C) => _(C.objectives[v])),
              onRename: (_) => {
                l === x.key && d(_);
              },
              onRemove: () => p((_) => {
                _.objectives.splice(v, 1);
              })
            }
          );
        }
      }
    ),
    b ? /* @__PURE__ */ f("div", { className: "aq-types", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: o("addObjective") }),
      /* @__PURE__ */ r("div", { className: "aq-seg", children: $e.map((v) => /* @__PURE__ */ f("button", { type: "button", className: "aq-opt", onClick: () => y(v.type), children: [
        /* @__PURE__ */ r("span", { "aria-hidden": !0, children: v.icon }),
        " ",
        o(`objective.${v.type}`)
      ] }, v.type)) })
    ] }) : /* @__PURE__ */ f(V, { size: "sm", variant: "ghost", className: "aq-add", onClick: () => u(!0), children: [
      "+ ",
      o("addObjective")
    ] })
  ] });
}
function fa({
  ctx: e,
  t,
  projectId: n,
  n: a,
  objective: s,
  open: i,
  onToggle: o,
  keyTaken: l,
  handle: d,
  onChange: c,
  onRename: u,
  onRemove: p
}) {
  const q = J(s.type), h = q ? q.params : Object.keys(s.params).map((m) => ({ name: m, kind: "text" })), b = he(s.params), y = Oe(s.type, s.params), v = qt(s.type, s.params), k = l || v.length > 0, x = h.filter((m) => m.advanced), [_, C] = I(!1), S = _ || l, L = (m) => m.kind === "item" ? /* @__PURE__ */ r(
    ya,
    {
      t,
      projectId: n,
      spec: m,
      params: s.params,
      onChange: (N) => c((g) => N(g.params))
    },
    m.name
  ) : m.kind === "line" ? /* @__PURE__ */ r(
    _t,
    {
      ctx: e,
      label: t(`param.${m.name}`),
      value: s.params[m.name],
      onChange: (N) => c((g) => A(g.params, m.name, N))
    },
    m.name
  ) : /* @__PURE__ */ r(
    ga,
    {
      t,
      spec: m,
      value: s.params[m.name],
      onChange: (N) => c((g) => A(g.params, m.name, N))
    },
    m.name
  );
  return /* @__PURE__ */ f("div", { className: `aq-obj${i ? " is-open" : ""}${k ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ f("div", { className: "aq-obj-line", children: [
      d,
      /* @__PURE__ */ f("button", { type: "button", className: "aq-obj-main", onClick: o, "aria-expanded": i, children: [
        a && /* @__PURE__ */ r("span", { className: "aq-obj-n", children: a }),
        /* @__PURE__ */ r("span", { className: "aq-obj-icon", "aria-hidden": !0, children: q?.icon ?? "?" }),
        /* @__PURE__ */ f("span", { className: "aq-obj-text", children: [
          ce(t, s.type),
          b !== void 0 && /* @__PURE__ */ f("strong", { children: [
            " · ",
            String(b)
          ] }),
          y ? ` × ${y}` : b !== void 0 && q ? ` × ${t("any")}` : ""
        ] }),
        k && /* @__PURE__ */ r(E, { tone: "warn", children: l ? t("objectiveKeyTaken") : t("missing", {
          fields: v.map((m) => t(`param.${m}`)).join(", ")
        }) }),
        /* @__PURE__ */ r(ne, { open: i })
      ] }),
      /* @__PURE__ */ r(fe, { label: t("remove"), onClick: p, children: "×" })
    ] }),
    i && /* @__PURE__ */ f("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ f("div", { className: "aq-row aq-top aq-wrap", children: [
        /* @__PURE__ */ r(O, { label: t("type"), children: /* @__PURE__ */ f(
          "select",
          {
            className: "select",
            value: s.type,
            onChange: (m) => c((N) => {
              N.type = m.target.value, N.params = vt(N.type);
            }),
            children: [
              $e.map((m) => /* @__PURE__ */ f("option", { value: m.type, children: [
                m.icon,
                " ",
                t(`objective.${m.type}`)
              ] }, m.type)),
              !q && /* @__PURE__ */ r("option", { value: s.type, children: s.type })
            ]
          }
        ) }),
        h.filter((m) => !m.advanced).map(L)
      ] }),
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "aq-fold-head is-inner",
          "aria-expanded": S,
          onClick: () => C(!S),
          children: [
            /* @__PURE__ */ r(ne, { open: S }),
            /* @__PURE__ */ r("span", { className: "aq-fold-title", children: t("more") }),
            !S && /* @__PURE__ */ r(E, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: s.key }) })
          ]
        }
      ),
      S && /* @__PURE__ */ f("div", { className: "aq-row aq-top aq-wrap", children: [
        x.map(L),
        /* @__PURE__ */ r(
          O,
          {
            label: t("key"),
            title: t("objectiveKeyHint"),
            hint: l ? /* @__PURE__ */ r("span", { className: "aq-err", children: t("objectiveKeyTaken") }) : void 0,
            children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: s.key,
                onChange: (m) => {
                  const N = ut(m.target.value);
                  c((g) => {
                    g.key = N;
                  }), u(N);
                },
                onBlur: () => {
                  const m = me(s.key);
                  m !== s.key && (c((N) => {
                    N.key = m;
                  }), u(m));
                }
              }
            )
          }
        )
      ] })
    ] })
  ] });
}
function ya({
  t: e,
  projectId: t,
  spec: n,
  params: a,
  onChange: s
}) {
  const i = Le(a, n), o = Array.isArray(a.match) ? a.match : void 0, l = (d, c) => s((u) => Mn(u, n, d, c));
  return /* @__PURE__ */ r(O, { label: e(`param.${n.name}`), children: /* @__PURE__ */ r(
    Vt,
    {
      projectId: t,
      value: i,
      match: o,
      onChange: (d) => l(d, o),
      onMatchChange: (d) => l(i, d)
    }
  ) });
}
function ga({
  t: e,
  spec: t,
  value: n,
  onChange: a
}) {
  const s = e(`param.${t.name}`), i = typeof n == "string" || typeof n == "number" ? String(n) : "";
  if (t.kind === "int")
    return /* @__PURE__ */ r(Q, { label: s, value: n, onChange: a });
  if (t.kind === "material")
    return /* @__PURE__ */ r(O, { label: s, children: /* @__PURE__ */ r(
      Yt,
      {
        value: i,
        placeholder: e("any"),
        "aria-label": s,
        onChange: (l) => a(l.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const o = t.kind === "entity";
  return /* @__PURE__ */ f(O, { label: s, children: [
    /* @__PURE__ */ r(
      "input",
      {
        className: `input${o ? " aq-mono" : ""}`,
        list: o ? "aq-entities" : void 0,
        value: i,
        placeholder: o ? e("any") : "",
        onChange: (l) => a(o ? l.target.value.toUpperCase().replace(/\s+/g, "_") : l.target.value)
      }
    ),
    o && /* @__PURE__ */ r("datalist", { id: "aq-entities", children: Hn.map((l) => /* @__PURE__ */ r("option", { value: l }, l)) })
  ] });
}
const va = 170, Be = { color: "#aaaaaa", italic: !1 }, Ve = { color: "#ffffff", italic: !1 };
function ba({ ctx: e, quest: t }) {
  const { t: n, project: a, lang: s } = e, i = (c) => c.split(`
`).flatMap((u) => u === "" ? [""] : Bt(u, va)), o = R(a, t.title.key, s) || t.key, l = R(a, t.description.key, s), d = t.stages.length > 1;
  return /* @__PURE__ */ r("div", { className: "aq-preview", children: /* @__PURE__ */ f("div", { className: "aq-preview-frame", children: [
    /* @__PURE__ */ r(re, { source: i(o).join(`
`), defaults: Ve, scale: 2 }),
    l && /* @__PURE__ */ r(re, { source: i(l).join(`
`), defaults: Be, scale: 2 }),
    t.stages.map((c, u) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ f("div", { className: "aq-preview-stage", children: [
        d && /* @__PURE__ */ r(
          re,
          {
            source: i(R(a, c.title.key, s) || n("stage", { n: u + 1 })).join(`
`),
            defaults: Ve,
            scale: 2
          }
        ),
        c.objectives.length > 0 && /* @__PURE__ */ r(
          re,
          {
            source: c.objectives.flatMap((p) => i(`• ${de(n, p)}`)).join(`
`),
            defaults: Be,
            scale: 2
          }
        )
      ] }, u)
    ))
  ] }) });
}
function Et({ className: e }) {
  return /* @__PURE__ */ f(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: e,
      "aria-hidden": !0,
      children: [
        /* @__PURE__ */ r("path", { d: "M15 12h-5" }),
        /* @__PURE__ */ r("path", { d: "M15 8h-5" }),
        /* @__PURE__ */ r("path", { d: "M19 17V5a2 2 0 0 0-2-2H4" }),
        /* @__PURE__ */ r("path", { d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" })
      ]
    }
  );
}
const qa = {
  kind: se,
  dir: lt,
  schemaVersion: Ee,
  // Created in the module's folder only (SDK 1.8); a group already elsewhere still loads.
  projects: [ct],
  // Data with no links: one "Quests" entry and page instead of a node per group (SDK 1.9).
  collection: { labels: tn },
  // A group's id is its key on the server (`quest_group_key`): typed by hand, no prefix.
  label: Ke.en,
  labels: Ke,
  icon: Et,
  component: na,
  // The view is a page of its own: its cards, and the quest beside what the player sees.
  ownHeader: !0,
  wide: !0,
  title: (e, { project: t, lang: n }) => z(R(t, e.title.key, n)),
  // The sidebar reads "Niveaux de guilde", the file's id stays in the group's settings.
  listByTitle: !0,
  create: ({ id: e, projectId: t }) => ({
    id: e,
    projectId: t,
    // Empty keys: the host mints them at their canonical address.
    title: { key: "" },
    description: { key: "" },
    actorType: "player",
    reset: {},
    limits: {},
    rotation: {},
    distribution: {},
    tiers: [],
    quests: [],
    rest: {}
  }),
  parse: (e, t) => rn(e, t),
  serialize: (e, t) => fn(e, t),
  ltextSites: (e) => yn(e),
  board: {
    size: { width: 300, height: 48 },
    accent: Kn,
    // The group's quests, one selectable row each: the Properties panel opens the one clicked.
    items: (e, { project: t, lang: n }) => Un(e, t, n),
    summary: (e, { lang: t }) => Gn(e, t)
  }
}, Tt = "quest_hud", ka = "quest_huds", Pe = "quest_hud/v1", ae = ["quest", "objective", "progress"], xa = {
  quest: "<gold>{quest_name}",
  objective: "<white>{objective_name}",
  progress: "<gray>[<yellow>{objective_progress}<gray>/{objective_target}]"
}, wa = [{ text: "objective", x: -150, y: 6, width: 300, align: "center" }], _a = {
  objective: "<white>{objective_name} <gray>[<yellow>{objective_progress}<gray>/{objective_target}]"
}, Na = (e) => typeof e == "object" && e !== null && !Array.isArray(e);
function ja(e, t) {
  const n = [];
  e.schema !== void 0 && e.schema !== Pe && n.push(`schema: ${String(e.schema)}`);
  const a = {}, s = Na(e.texts) ? e.texts : {};
  for (const l of ae) {
    const d = s[l];
    typeof d == "string" && (a[l] = d);
  }
  const i = {};
  for (const [l, d] of Object.entries(e))
    ["id", "schema", "layout", "texts"].includes(l) || (i[l] = d);
  return { doc: {
    id: typeof e.id == "string" ? e.id : "",
    projectId: t.projectId,
    layout: Array.isArray(e.layout) ? e.layout : [],
    texts: a,
    rest: i
  }, i18nKeys: {}, unsupported: n };
}
function Ca(e) {
  const t = {};
  for (const n of ae) {
    const a = e.texts[n];
    a !== void 0 && a !== "" && (t[n] = a);
  }
  return {
    id: e.id,
    schema: Pe,
    ...e.rest,
    layout: e.layout,
    ...Object.keys(t).length ? { texts: t } : {}
  };
}
function Sa(e) {
  return Jt(Zt(Array.isArray(e.layout) ? e.layout : []).layers);
}
function $t(e, t) {
  const n = e.texts[t];
  return n === void 0 || n === "" ? xa[t] : n;
}
function Aa(e, t) {
  return e.replace(/\{([a-z_]+)\}|%([a-z_]+)%/g, (n, a, s) => t[a ?? s] ?? n);
}
function Ea(e, t) {
  const n = {};
  for (const a of ae) n[a] = [Aa($t(e, a), t)];
  return { text: n };
}
function Ta({ projectId: e, documentId: t, document: n }) {
  je("msquests", Te);
  const a = n, s = pe(), i = (c) => tt({ projectId: e, kind: Tt, id: t, doc: c }), o = {
    quest_name: s("hud.sample.quest"),
    objective_name: s("hud.sample.objective"),
    objective_progress: "0",
    objective_target: "3",
    objective_progress_percent: "0%"
  }, l = Object.entries(o).map(([c, u]) => ({ path: c, sample: u })), d = (c, u) => {
    const p = { ...a.texts };
    u.trim() === "" ? delete p[c] : p[c] = u, i({ ...a, texts: p });
  };
  return /* @__PURE__ */ f("div", { className: "aq", children: [
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ r("span", { className: "aq-h", children: s("hud.layout") }),
      /* @__PURE__ */ r("span", { className: "aq-hint", children: s("hud.layoutHint") }),
      /* @__PURE__ */ r(
        Xt,
        {
          projectId: e,
          slot: "boss_bar",
          value: a.layout,
          onChange: (c) => i({ ...a, layout: c }),
          slots: ae.map((c) => ({ name: c, kind: "text", label: s(`hud.slot.${c}`) })),
          preview: Ea(a, o)
        }
      )
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ r("span", { className: "aq-h", children: s("hud.texts") }),
      /* @__PURE__ */ r("span", { className: "aq-hint", children: s("hud.textsHint") }),
      ae.map((c) => (
        // A div, not a label: a label hands a click in the text to the toolbar's Bold button.
        /* @__PURE__ */ f("div", { className: "aq-field", children: [
          /* @__PURE__ */ r("span", { className: "field-label", children: s(`hud.slot.${c}`) }),
          /* @__PURE__ */ r(
            Se,
            {
              value: a.texts[c] ?? "",
              placeholder: $t({ ...a, texts: {} }, c),
              onChange: (u) => d(c, u),
              variables: l,
              "aria-label": s(`hud.slot.${c}`)
            }
          )
        ] }, c)
      ))
    ] })
  ] });
}
const $a = {
  kind: Tt,
  dir: ka,
  schemaVersion: Pe,
  projects: [ct],
  collection: { labels: nn },
  label: Ue.en,
  labels: Ue,
  icon: Et,
  component: Ta,
  // The composer lays its layers, the screen and the panel side by side.
  wide: !0,
  create: ({ id: e, projectId: t }) => ({
    id: e,
    projectId: t,
    layout: structuredClone(wa),
    texts: { ..._a },
    rest: {}
  }),
  parse: (e, t) => ja(e, t),
  serialize: (e) => Ca(e),
  pack: { images: Sa }
}, Ye = "quests:groups", Je = "quests:quests", La = "quests:active";
function Oa(e) {
  return e.startsWith("msquests:") ? `quests:${e.slice(9)}` : e;
}
const Ze = {
  en: {
    block_break: "Mine %amount% %material%",
    breed_animal: "Breed %amount% %entity_type%",
    craft_item: "Craft %amount% %material%",
    harvest_crop: "Harvest %amount% %crop%",
    deliver_item: "Deliver %amount% %material%",
    talk_npc: "Talk to %npc%",
    kill_entity: "Kill %amount% %entity_type%",
    execute_command: "Run the command %command%",
    fishing: "Catch %amount% %fish_type%",
    placeholder: "Reach %value%",
    travel: "Travel %distance% blocks"
  },
  fr: {
    block_break: "Miner %amount% × %material%",
    breed_animal: "Faire se reproduire %amount% × %entity_type%",
    craft_item: "Fabriquer %amount% × %material%",
    harvest_crop: "Récolter %amount% × %crop%",
    deliver_item: "Livrer %amount% × %material%",
    talk_npc: "Parler à %npc%",
    kill_entity: "Tuer %amount% × %entity_type%",
    execute_command: "Exécuter la commande %command%",
    fishing: "Pêcher %amount% × %fish_type%",
    placeholder: "Atteindre %value%",
    travel: "Parcourir %distance% blocs"
  }
}, Xe = { en: "Available", fr: "Disponible" };
function Ra(e, t, n) {
  const a = Oa(t);
  if (a !== Ye && a !== Je && a !== La) return null;
  const s = e.documents?.[se];
  if (!s || s.length === 0) return null;
  const i = e.defaultLang ?? "en", o = n?.serverRows, l = n?.params?.group || void 0, d = [...s].sort((u, p) => u.id < p.id ? -1 : u.id > p.id ? 1 : 0);
  if (a === Ye) {
    const u = _e(o, "key");
    return d.map((p) => Da(p, u.get(p.id), i));
  }
  if (a === Je) {
    const u = _e(o, "id");
    return d.filter((p) => !l || p.id === l).flatMap((p) => p.quests.map((q) => Lt(p, q, u.get(`${p.id}:${q.key}`), i)));
  }
  if (!o) return null;
  const c = new Map(s.map((u) => [u.id, u]));
  return o.flatMap((u) => {
    const p = c.get(P(u.group));
    if (!p) return [u];
    const q = p.quests.find((h) => h.key === P(u.quest_key));
    return q ? [Ua(q, u, i)] : [];
  });
}
function Da(e, t, n) {
  const a = _e(ee(t?.quests), "key");
  return {
    key: e.id,
    name: e.title,
    description: e.description,
    actor_type: e.actorType,
    max_active: Ne(e.limits.max_active, 1),
    max_per_period: Ne(e.limits.max_per_period, 0),
    rotatable: e.rotation.enabled === !0,
    // The period follows the server's clock and zone: its value stands until a deploy.
    period_end: t?.period_end ?? 0,
    active_count: t?.active_count ?? 0,
    completed_count: t?.completed_count ?? 0,
    can_rotate: t?.can_rotate ?? !1,
    quests: e.quests.map((s) => Lt(e, s, a.get(s.key), n))
  };
}
function Lt(e, t, n, a) {
  const s = e.tiers.find((i) => i.key === t.tier);
  return {
    id: `${e.id}:${t.key}`,
    group: e.id,
    key: t.key,
    name: t.title,
    description: t.description,
    duration: za(t.duration),
    tier: t.tier,
    tier_name: s ? s.title : "",
    assigned: n?.assigned ?? !1,
    status_key: n?.status_key ?? "NOT_STARTED",
    status: n?.status ?? Xe[a.slice(0, 2)] ?? Xe.en,
    can_start: n?.can_start ?? !1,
    start_blocker: n?.start_blocker ?? "",
    start_blocker_label: n?.start_blocker_label ?? "",
    // `reference` in `QuestRows.questRow`: the attempt the server holds for this player.
    ...Ot(t, n?.assigned === !0 ? n : void 0, a)
  };
}
function Ot(e, t, n) {
  const a = t ? Ia(t) : void 0, s = Ma(e, a, t ? Pa(t) : "", n), i = s.find((l) => l.active === !0), o = i ? i.objectives.find((l) => l.done !== !0) : void 0;
  return {
    objective_name: o?.name ?? "",
    objective_progress: o?.progress ?? 0,
    objective_target: o?.target ?? 0,
    progress_ratio: a ? Rt(s.map((l) => l.progress_ratio)) : 0,
    stage_index: s.filter((l) => l.completed === !0).length,
    stage_name: i?.name ?? "",
    stage_flow: i?.flow ?? "",
    stages: s.map((l) => ({ ...l, objectives: l.objectives.map(({ done: d, ...c }) => c) }))
  };
}
function Ia(e) {
  const t = /* @__PURE__ */ new Map(), n = [
    ...ee(e.objectives),
    ...ee(e.stages).flatMap((a) => ee(a.objectives))
  ];
  for (const a of n) {
    const s = P(a.status_key);
    t.set(P(a.key), {
      progress: Ne(a.progress, 0),
      flag: s === "COMPLETED" || s === "FAILED" ? s : "",
      row: a
    });
  }
  return t;
}
function Pa(e) {
  return P(ee(e.stages).find((t) => t.active === !0)?.key);
}
function Ma(e, t, n, a) {
  const s = t && n ? e.stages.findIndex((l) => l.key === n) : -1, i = e.stages.map((l, d) => {
    const c = d < s, u = l.objectives.map((p) => {
      const q = Ka(p, Ha(p, t), a);
      return c && q.status_key !== "FAILED" && (q.status_key = "COMPLETED"), q;
    });
    return {
      key: l.key,
      name: l.title,
      flow: Ga(l),
      index: d,
      // `QuestStage.isCompleted`: passed, or all objectives done, so an empty stage is.
      completed: t !== void 0 && (c || u.every((p) => p.done)),
      active: !1,
      progress_ratio: t ? c ? 1 : Rt(u.map((p) => p.progress_ratio)) : 0,
      objectives: u
    };
  });
  if (!t) return i;
  const o = i.find((l) => l.completed !== !0);
  if (o) {
    o.active = !0;
    const l = o.objectives, d = l.find((c) => c.done !== !0);
    for (const c of l)
      c.status_key === "PENDING" && (o.flow !== "SEQUENTIAL" || c === d) && (c.status_key = "IN_PROGRESS");
  }
  return i;
}
function Ha(e, t) {
  if (!t) return;
  const n = e.params.old_key, a = [...Array.isArray(n) ? n : n == null ? [] : [n], e.savedKey];
  let s = t.get(e.key);
  for (const o of a) {
    if (s) break;
    typeof o == "string" && (s = t.get(o));
  }
  if (!s) return;
  const i = P(s.row.type);
  return i === "" || i === e.type ? s : void 0;
}
function Ka(e, t, n) {
  const a = Fa(e), s = t?.progress ?? 0, i = t?.row, o = i && i.type === e.type && i.target === a, l = t !== void 0 && (t.flag === "COMPLETED" || s >= a);
  return {
    key: e.key,
    name: o && typeof i.name == "string" ? i.name : Qa(e, n),
    type: e.type,
    progress: s,
    target: a,
    // `AbstractQuestObjective`: done once completed, or once the progress reaches the target
    // (a lowered one included); the ratio is clamped, so a lowered target reads 1, not 1.4.
    progress_ratio: t ? a <= 0 || l ? 1 : Math.min(Math.max(s / a, 0), 1) : 0,
    completed: l,
    status_key: t?.flag === "FAILED" ? "FAILED" : l ? "COMPLETED" : "PENDING",
    done: l
  };
}
function Ua(e, t, n) {
  const a = Ot(e, t, n), s = a.stages;
  return {
    ...t,
    name: e.title,
    description: e.description,
    stage_index: a.stage_index,
    stage_count: e.stages.length,
    stage_name: a.stage_name,
    stage_flow: a.stage_flow,
    progress_ratio: a.progress_ratio,
    objective_name: a.objective_name,
    objective_progress: a.objective_progress,
    objective_target: a.objective_target,
    objectives: s.flatMap((i) => i.objectives),
    stages: s
  };
}
function Qa(e, t) {
  const a = (Ze[t.slice(0, 2)] ?? Ze.en)[e.type];
  if (!a) return e.type;
  const s = e.params, i = {
    amount: String(s.amount ?? ""),
    distance: String(s.distance ?? ""),
    command: P(s.command),
    value: P(s.value),
    // Bukkit's translation keys, as the objective configs write them (`<lang:…>`).
    crop: le("block", s.crop),
    entity_type: le("entity", s.entity_type),
    material: e.type === "block_break" ? le("block", s.material) : et(e),
    fish_type: et(e)
  };
  return a.replace(/%([a-z_]+)%/g, (o, l) => i[l] ?? "");
}
function le(e, t) {
  const n = P(t).toLowerCase().replace(/^minecraft:/, "");
  return n === "" ? "" : `<lang:${e}.minecraft.${n}>`;
}
function et(e) {
  const t = J(e.type)?.params.find((i) => i.kind === "item");
  if (!t) return "";
  const n = Le(e.params, t), a = n.title;
  if (typeof a == "string" && a.trim() !== "") return a;
  const s = P(n.material);
  return /^(minecraft:)?[a-z_0-9]+$/i.test(s) && !s.includes(":") ? le("item", s) : s || bt(n);
}
function Fa(e) {
  const t = he(e.params);
  if (t === void 0) return 1;
  const n = Number(t);
  return Number.isFinite(n) ? n : 1;
}
function Ga(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function za(e) {
  const t = e.trim().toLowerCase().replace(/ /g, "");
  if (t === "") return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const n = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!n) return 0;
  const [, a, s, i, o] = n;
  return Number(a ?? 0) * 86400 + Number(s ?? 0) * 3600 + Number(i ?? 0) * 60 + Number(o ?? 0);
}
function _e(e, t) {
  return new Map((e ?? []).map((n) => [P(n[t]), n]));
}
function ee(e) {
  return Array.isArray(e) ? e.filter((t) => t && typeof t == "object") : [];
}
function Rt(e) {
  return e.length === 0 ? 0 : e.reduce((t, n) => t + n, 0) / e.length;
}
function Ne(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function P(e) {
  return typeof e == "string" ? e : "";
}
const Wa = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: en,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  // The groups, and the HUD of the tracked quest at the top of the screen (SDK 1.24).
  documents: [qa, $a],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: Ra,
  // The Quests tab of the server's Statistics space (SDK 1.23).
  stats: { label: { en: "Quests", fr: "Quêtes" }, component: En }
}, Ja = { ...Wa, sdk: "1.25.0" };
export {
  Ja as default
};
