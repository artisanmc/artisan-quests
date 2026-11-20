import { createModuleI18n as _t, fieldText as jt, newTextKey as F, injectModuleStyles as Be, useServerDocuments as Ct, textValue as L, useStatsRead as ne, statsQuery as Te, StatCard as St, StatsPanel as me, Funnel as Et, SortableTable as Oe, statsBreakdown as At, useProject as $t, useContentLang as Tt, SortableList as xe, Button as B, ConditionsEditor as Ot, updateDocument as Lt, selectDocumentItem as Rt, projectLangs as ze, LocalizedField as Ve, MiniMessageInput as Ye, textValues as Je, McText as ae, useUiLang as Ze, useOptionList as It, ActionChainEditor as Dt, mcWrap as Pt, ItemInput as Mt, MaterialInput as Kt, SDK_VERSION as Ht } from "@artisan/editor-sdk";
import { jsx as r, jsxs as g, Fragment as M } from "react/jsx-runtime";
import { useState as D, useEffect as we, useRef as Xe } from "react";
const Z = {
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
  forgetFormerKeys: "Forget",
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
  "stats.day": "d"
}, ce = {
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
  forgetFormerKeys: "Oublier",
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
  "stats.day": "j"
}, Le = { en: Z.kindLabel, fr: ce.kindLabel }, Qt = { en: Z.collection, fr: ce.collection }, Ne = _t({ en: Z, fr: ce });
function et(e) {
  const t = e === "fr" ? ce : Z;
  return (n, a) => {
    const s = t[n] ?? Z[n] ?? n;
    return a ? s.replace(/\{\{(\w+)\}\}/g, (i, o) => String(a[o] ?? i)) : s;
  };
}
const te = "quest_group", tt = "quest_groups", Ft = "quests", _e = "quest_group/v1";
function Gt(e) {
  const t = { ...$(e) };
  return typeof t.strategy == "string" && t.strategy.toLowerCase() === "ladder" && (t.strategy = "sequential"), t;
}
const ve = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function nt(e = Date.now()) {
  let t = "", n = e;
  for (let i = 0; i < 10; i++)
    t = ve[n % 32] + t, n = Math.floor(n / 32);
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  let s = "";
  for (let i = 0; i < 16; i++) s += ve[a[i] % 32];
  return t + s;
}
function X(e, t) {
  const n = new Set(t);
  if (!n.has(e)) return e;
  for (let a = 2; ; a++) if (!n.has(`${e}_${a}`)) return `${e}_${a}`;
}
function Ut(e, t) {
  const n = new Set(t), a = new Uint8Array(4);
  for (; ; ) {
    crypto.getRandomValues(a);
    const s = Array.from(a, (o) => ve[o % 32].toLowerCase()).join(""), i = `${de(e)}_${s}`;
    if (!n.has(i)) return i;
  }
}
function at(e) {
  return e.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
function de(e) {
  return e.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "quest";
}
function $(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? { ...e } : {};
}
function fe(e) {
  return Array.isArray(e) ? e : [];
}
function A(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? String(e) : "";
}
function Y(e, ...t) {
  const n = { ...e };
  for (const a of t) delete n[a];
  return n;
}
function Wt(e, t) {
  const n = {}, a = [];
  function s(d) {
    if (d && typeof d == "object" && !Array.isArray(d)) {
      const q = F(), f = {};
      for (const [b, h] of Object.entries(d)) f[b] = A(h);
      return n[q] = f, { key: q };
    }
    const u = typeof d == "string" ? /^\{i18n:(.+)\}$/.exec(d) : null;
    if (u) {
      const q = t.translations?.[u[1]];
      return q && (n[u[1]] = { ...q }), { key: u[1] };
    }
    const m = F();
    return n[m] = d == null || d === "" ? {} : { [t.lang]: A(d) }, { key: m };
  }
  const i = Object.entries($(e.tiers)).map(([d, u]) => {
    const m = $(u);
    return { key: d, title: s(m.title), rest: Y(m, "title") };
  }), o = /* @__PURE__ */ new Set(), l = fe(e.quests).map((d, u) => {
    const m = $(d), q = fe(m.stages).map((y, k) => {
      const w = $(y), N = A(w.flow).toLowerCase();
      return {
        key: A(w.key) || `stage_${k + 1}`,
        title: s(w.title),
        flow: N === "parallel" || N === "sequential" ? N : "",
        objectives: fe(w.objectives).map((j, S) => {
          const T = $(j);
          return {
            key: A(T.key) || `objective_${S + 1}`,
            savedKey: A(T.key) || void 0,
            type: A(T.type),
            params: Y(T, "key", "type")
          };
        }),
        rest: Y(w, "key", "title", "flow", "objectives")
      };
    }), f = A(m.key) || `quest_${u + 1}`, b = A(m.uid) || void 0;
    let h = b ?? f;
    return o.has(h) && (h = `${h}_${u}`), o.add(h), {
      key: f,
      uid: h,
      savedUid: b,
      savedKey: A(m.key) || void 0,
      oldKeys: it(m.old_key),
      oldPlaces: zt(m.old_key),
      tier: A(m.tier),
      title: s(m.title),
      description: s(m.description),
      duration: A(m.duration),
      stages: q,
      rest: Bt(m)
    };
  }), c = {
    id: A(e.id),
    projectId: t.projectId,
    uid: A(e.uid) || void 0,
    title: s(e.title),
    description: s(e.description),
    actorType: A(e.actor_type) || "player",
    reset: $(e.reset),
    limits: $(e.limits),
    rotation: $(e.rotation),
    distribution: Gt(e.distribution),
    tiers: i,
    quests: l,
    rest: st(Y(
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
  return e.schema !== void 0 && e.schema !== _e && a.push(`schema: ${String(e.schema)}`), { doc: c, i18nKeys: n, unsupported: a };
}
function st(e) {
  return e.on !== void 0 && (e.actions == null && (e.actions = e.on), delete e.on), e;
}
function Bt(e) {
  const t = st(
    Y(e, "key", "uid", "old_key", "tier", "title", "description", "duration", "stages", "reward_display")
  );
  if (t.rewards !== void 0) {
    const n = $(t.actions);
    n.complete == null && (t.actions = { ...n, complete: t.rewards }), delete t.rewards;
  }
  return t;
}
function it(e) {
  return (Array.isArray(e) ? e : e == null ? [] : [e]).map((n) => A(n)).filter((n) => n !== "");
}
function zt(e) {
  return (Array.isArray(e) ? e : e == null ? [] : [e]).filter((n) => n !== null && typeof n == "object" && !Array.isArray(n));
}
function Vt(e, t) {
  e.savedKey === void 0 || t === "" || t === e.key || e.oldKeys.includes(t) || e.oldKeys.push(t);
}
function rt(e, t) {
  const n = [];
  for (const a of [...e.oldKeys, e.savedKey ?? ""])
    a === "" || a === e.key || t.has(a) || n.includes(a) || n.push(a);
  return n;
}
function Yt(e, t) {
  const n = [...rt(e, t), ...e.oldPlaces];
  return n.length === 0 ? void 0 : n.length === 1 ? n[0] : n;
}
function Jt(e, t) {
  const { old_key: n, ...a } = e.params, s = [];
  for (const o of [...it(n), e.savedKey ?? ""])
    o === "" || o === e.key || t.has(o) || s.includes(o) || s.push(o);
  const i = s.length === 0 ? void 0 : s.length === 1 ? s[0] : s;
  return Zt({ key: e.key, old_key: i, type: e.type, ...a });
}
function Zt(e) {
  return e.old_key === void 0 && delete e.old_key, e;
}
function Xt(e) {
  return typeof e == "string" ? e === "" : Object.values(e).every((t) => t === "");
}
function K(e) {
  const t = {};
  for (const [n, a] of Object.entries(e))
    a == null || a === "" || Array.isArray(a) && a.length === 0 || typeof a == "object" && !Array.isArray(a) && Object.keys(a).length === 0 || (t[n] = a);
  return t;
}
const en = [
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
function tn(e, t) {
  const n = (u) => jt(t, u.key), a = (u) => {
    const m = n(u);
    return Xt(m) ? void 0 : m;
  }, s = {};
  for (const u of e.tiers) s[u.key] = { ...u.rest, title: n(u.title) };
  const i = new Set(e.quests.map((u) => u.key)), o = e.quests.map((u) => {
    const m = new Set(u.stages.flatMap((q) => q.objectives.map((f) => f.key)));
    return K({
      key: u.key,
      uid: u.savedUid,
      old_key: Yt(u, i),
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
          objectives: q.objectives.map((f) => Jt(f, m))
        })
      )
    });
  }), l = {
    ...e.rest,
    id: e.id,
    schema: _e,
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
  }, c = {};
  for (const u of en) u in l && (c[u] = l[u]);
  for (const u of Object.keys(l)) u in c || (c[u] = l[u]);
  const d = K(c);
  return d.quests = o, d;
}
function* nn(e) {
  const t = `${tt}.${e.id}`;
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
    for (let c = 0; c < s.stages.length; c++) {
      const d = s.stages[c], u = l.has(d.key) ? `${d.key}_${c}` : d.key;
      l.add(d.key), yield {
        lText: d.title,
        key: `${o}.stages.${u}.title`,
        path: `quests[${a}].stages[${c}].title`,
        kind: "quest.stage"
      };
    }
  }
}
function Re(e) {
  return !!e && typeof e == "object" && !Array.isArray(e) && "type" in e;
}
function an(e) {
  const t = Array.isArray(e) ? e : e == null ? [] : [e];
  return {
    chain: t.filter((n) => !Re(n)),
    legacy: t.filter(Re)
  };
}
function Ie(e, t) {
  const n = [...e, ...t];
  return n.length ? n : void 0;
}
function sn(e) {
  const t = String(e.type), n = e.command ?? e.message ?? e.title ?? e.material;
  return typeof n == "string" ? `${t} · ${n}` : t;
}
const rn = [
  "distribution",
  "actor_load",
  "quest_start",
  "objective_progress",
  "objective_complete",
  "quest_complete",
  "period_complete"
], on = ["start", "objective_progress", "objective_complete", "complete"], ot = {
  started: "quests:started",
  completed: "quests:completed",
  abandoned: "quests:abandoned",
  expired: "quests:expired"
}, se = Object.keys(ot), ln = "quests:progress", cn = "quests:stuck", U = (e) => typeof e == "number" && Number.isFinite(e) ? e : 0;
function dn(e) {
  return e.map((t) => ({
    quest: String(t.quest ?? ""),
    started: U(t.started),
    inProgress: U(t.in_progress),
    completed: U(t.completed),
    medianSeconds: typeof t.median_seconds == "number" ? t.median_seconds : null
  }));
}
function un(e) {
  return e.map((t) => ({
    quest: String(t.quest ?? ""),
    stage: String(t.stage ?? ""),
    players: U(t.players),
    medianSeconds: U(t.median_seconds),
    longestSeconds: U(t.longest_seconds)
  }));
}
function pn(e, t, n) {
  const a = (i, o) => t[i]?.find((l) => l.value === o)?.count ?? 0, s = e.map((i) => i.key);
  for (const i of se)
    for (const o of t[i] ?? []) s.includes(o.value) || s.push(o.value);
  return s.map((i) => {
    const o = a("started", i), l = a("completed", i), c = n.find((d) => d.quest === i);
    return {
      key: i,
      started: o,
      completed: l,
      abandoned: a("abandoned", i),
      expired: a("expired", i),
      unfinished: o > 0 ? Math.max(0, 1 - l / o) : null,
      inProgress: c?.inProgress ?? 0,
      medianSeconds: c?.medianSeconds ?? null
    };
  });
}
const De = (e) => (e ?? []).reduce((t, n) => t + n.count, 0);
function mn(e) {
  return e.distribution.strategy === "sequential";
}
function fn(e, t) {
  const n = e[0];
  if (!n) return [];
  const a = (i) => t.find((o) => o.quest === i), s = a(n.key)?.started ?? 0;
  return s === 0 ? [] : [
    { key: n.key, kind: "started", value: s },
    ...e.map((i) => ({ key: i.key, kind: "completed", value: a(i.key)?.completed ?? 0 }))
  ];
}
function hn(e, t = "d") {
  const n = Math.max(0, Math.round(e));
  if (n < 60) return `${n} s`;
  const a = Math.round(n / 60);
  if (a < 60) return `${a} min`;
  const s = Math.floor(a / 60);
  if (s < 24) return a % 60 === 0 ? `${s} h` : `${s} h ${String(a % 60).padStart(2, "0")}`;
  const i = Math.floor(s / 24);
  return s % 24 === 0 ? `${i} ${t}` : `${i} ${t} ${s % 24} h`;
}
function yn(e, t, n) {
  if (t === void 0 || t === 0) return null;
  const a = (e - t) / t, s = new Intl.NumberFormat(n, { style: "percent", maximumFractionDigits: 0 }).format(Math.abs(a));
  return `${a >= 0 ? "▲" : "▼"} ${s}`;
}
const lt = `
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
`;
function gn(e) {
  Be("msquests", lt);
  const t = Ne(), n = Ct(te).map((i) => ({
    group: i.document,
    project: i.project
  })), a = n.find((i) => i.group.id === e.focus) ?? n[0];
  if (!a) return /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: t("stats.noGroup") });
  const s = (i) => L(i.project, i.group.title.key, e.lang) || i.group.id;
  return /* @__PURE__ */ g("div", { className: "aq-stats", children: [
    /* @__PURE__ */ g("label", { className: "aq-stats-pick", children: [
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
    /* @__PURE__ */ r(vn, { ...e, group: a.group, project: a.project }, a.group.id)
  ] });
}
function vn({
  serverId: e,
  period: t,
  player: n,
  compare: a,
  lang: s,
  group: i,
  project: o
}) {
  const l = Ne(), c = `${e}|${i.id}`, d = (p, v) => Promise.all(
    se.map(
      (x) => At(e, { event: ot[x], from: p, to: v, player: n, dims: { group: i.id } }, "quest")
    )
  ).then((x) => Object.fromEntries(se.map((_, R) => [_, x[R] ?? []]))), u = ne(
    `${c}|${t.from}|${t.to}|${n ?? ""}`,
    () => d(t.from, t.to)
  ), m = ne(
    `${c}|${t.previous.from}|${t.previous.to}|${n ?? ""}|${a}`,
    () => a ? d(t.previous.from, t.previous.to) : Promise.resolve(void 0)
  ), q = ne(
    `${c}|progress`,
    () => Te(e, ln, { group: i.id }).then((p) => dn(p.rows))
  ), f = ne(
    `${c}|stuck`,
    () => Te(e, cn, { group: i.id }).then((p) => un(p.rows))
  ), b = (p) => {
    const v = i.quests.find((x) => x.key === p);
    return v && L(o, v.title.key, s) || p;
  }, h = (p, v) => {
    const x = i.quests.find((_) => _.key === p)?.stages.find((_) => _.key === v);
    return x && L(o, x.title.key, s) || v;
  }, y = (p) => new Intl.NumberFormat(s).format(p), k = (p) => new Intl.NumberFormat(s, { style: "percent", maximumFractionDigits: 0 }).format(p), w = (p) => p === null ? "–" : hn(p, l("stats.day"));
  if (u.error) return /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.unavailable") });
  const N = pn(i.quests, u.data ?? {}, q.data ?? []), j = mn(i) ? fn(i.quests, q.data ?? []) : [], S = (p) => p === void 0 ? null : l(
    p === "server_offline" ? "stats.offline" : p === "unknown_query" ? "stats.notComputed" : "stats.unavailable"
  ), T = {
    started: void 0,
    completed: !0,
    abandoned: !1,
    expired: !1
  };
  return /* @__PURE__ */ g(M, { children: [
    /* @__PURE__ */ r("div", { className: "aq-stats-cards", children: se.map((p) => {
      const v = De(u.data?.[p]), x = yn(v, m.data ? De(m.data[p]) : void 0, s), _ = x?.startsWith("▲") ?? !1, R = T[p];
      return /* @__PURE__ */ r(
        St,
        {
          label: l(`stats.${p}`),
          value: u.data ? y(v) : "…",
          sub: l("stats.overPeriod"),
          trend: x === null ? void 0 : {
            label: x,
            tone: R === void 0 ? "default" : _ === R ? "positive" : "negative"
          }
        },
        p
      );
    }) }),
    j.length > 0 && /* @__PURE__ */ r(me, { title: l("stats.funnel"), hint: l("stats.allTime"), children: /* @__PURE__ */ r(
      Et,
      {
        steps: j.map((p) => ({
          id: `${p.kind}:${p.key}`,
          label: l(p.kind === "started" ? "stats.funnelStarted" : "stats.funnelCompleted", {
            quest: b(p.key)
          }),
          value: p.value
        })),
        formatValue: y,
        formatShare: k
      }
    ) }),
    /* @__PURE__ */ g(me, { title: l("stats.quests"), hint: l("stats.questsHint"), children: [
      N.length === 0 ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.noQuestYet") }) : /* @__PURE__ */ r(
        Oe,
        {
          rows: N,
          rowId: (p) => p.key,
          initialSort: "unfinished",
          columns: bn(l, b, y, k, w)
        }
      ),
      q.error && /* @__PURE__ */ r("p", { className: "aq-hint", children: S(q.error) })
    ] }),
    /* @__PURE__ */ r(me, { title: l("stats.stuck"), hint: l("stats.stuckHint"), children: f.error ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: S(f.error) }) : f.data && f.data.length === 0 ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.nobodyStuck") }) : /* @__PURE__ */ r(
      Oe,
      {
        rows: f.data ?? [],
        rowId: (p) => `${p.quest}/${p.stage}`,
        initialSort: "players",
        columns: [
          { id: "quest", label: l("stats.quest"), value: (p) => b(p.quest) },
          { id: "stage", label: l("stats.stage"), value: (p) => h(p.quest, p.stage) },
          {
            id: "players",
            label: l("stats.waiting"),
            align: "right",
            value: (p) => p.players,
            render: (p) => y(p.players)
          },
          {
            id: "median",
            label: l("stats.medianWait"),
            align: "right",
            value: (p) => p.medianSeconds,
            render: (p) => w(p.medianSeconds)
          },
          {
            id: "longest",
            label: l("stats.longestWait"),
            align: "right",
            value: (p) => p.longestSeconds,
            render: (p) => w(p.longestSeconds)
          }
        ]
      }
    ) })
  ] });
}
function bn(e, t, n, a, s) {
  const i = (o, l) => ({
    id: o,
    label: l,
    align: "right",
    value: (c) => c[o],
    render: (c) => n(c[o])
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
const ct = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
}, qn = /^\d+$/;
function he(e, t, n) {
  const a = String(n).padStart(2, "0");
  return e === "fr" ? n === 0 ? `${t} h` : `${t} h ${a}` : `${String(t).padStart(2, "0")}:${a}`;
}
function I(e, t, n) {
  return qn.test(e) && Number(e) >= t && Number(e) <= n;
}
function ye(e) {
  return e.trim().split(/\s+/).length === 5;
}
function kn(e, t) {
  const n = t === "fr", a = e.trim().split(/\s+/);
  if (a.length !== 5) return null;
  const [s, i, o, l, c] = a;
  if (l !== "*") return null;
  const d = /^\*\/(\d+)$/;
  if (o === "*" && c === "*") {
    if (I(s, 0, 59) && I(i, 0, 23))
      return n ? `tous les jours à ${he(t, +i, +s)}` : `every day at ${he(t, +i, +s)}`;
    const m = d.exec(i);
    if (I(s, 0, 59) && m)
      return n ? `toutes les ${m[1]} h, à la minute ${s}` : `every ${m[1]} hours, at minute ${s}`;
    if (I(s, 0, 59) && i === "*")
      return n ? `toutes les heures, à la minute ${s}` : `every hour, at minute ${s}`;
    const q = d.exec(s);
    return q && i === "*" ? n ? `toutes les ${q[1]} minutes` : `every ${q[1]} minutes` : null;
  }
  if (!I(s, 0, 59) || !I(i, 0, 23)) return null;
  const u = he(t, +i, +s);
  if (o === "*" && I(c, 0, 7)) {
    const m = ct[n ? "fr" : "en"][Number(c) % 7];
    return n ? `chaque ${m} à ${u}` : `every ${m} at ${u}`;
  }
  return c === "*" && I(o, 1, 31) ? n ? `le ${o === "1" ? "1er" : o} de chaque mois à ${u}` : `on day ${o} of each month at ${u}` : null;
}
function V(e, t, n) {
  const a = /* @__PURE__ */ new Set();
  for (const s of e.split(",")) {
    const i = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(s);
    if (!i) return null;
    const o = i[4] ? Number(i[4]) : 1, l = i[1] === "*" ? t : Number(i[2]), c = i[1] === "*" ? n : i[3] ? Number(i[3]) : i[4] ? n : l;
    if (o < 1 || l < t || c > n || l > c) return null;
    for (let d = l; d <= c; d += o) a.add(d);
  }
  return a;
}
function xn(e, t) {
  const n = e.trim().split(/\s+/);
  if (n.length !== 5) return null;
  const a = V(n[0], 0, 59), s = V(n[1], 0, 23), i = V(n[2], 1, 31), o = V(n[3], 1, 12), l = V(n[4], 0, 7);
  if (!a || !s || !i || !o || !l) return null;
  l.has(7) && l.add(0);
  const c = n[2] === "*", d = n[4] === "*", u = (f) => c && d ? !0 : c ? l.has(f.getDay()) : d ? i.has(f.getDate()) : i.has(f.getDate()) || l.has(f.getDay()), m = new Date(t.getTime());
  m.setSeconds(0, 0), m.setMinutes(m.getMinutes() + 1);
  const q = t.getTime() + 366 * 24 * 3600 * 1e3;
  for (; m.getTime() <= q; ) {
    if (!o.has(m.getMonth() + 1) || !u(m)) {
      m.setDate(m.getDate() + 1), m.setHours(0, 0, 0, 0);
      continue;
    }
    if (!s.has(m.getHours())) {
      m.setHours(m.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (a.has(m.getMinutes())) return m;
    m.setMinutes(m.getMinutes() + 1);
  }
  return null;
}
function wn(e) {
  const t = e.trim().split(/\s+/);
  if (e.trim() === "") return { kind: "never" };
  if (t.length !== 5) return { kind: "custom" };
  const [n, a, s, i, o] = t;
  if (i !== "*" || !I(n, 0, 59) || !I(a, 0, 23)) return { kind: "custom" };
  const l = `${a.padStart(2, "0")}:${n.padStart(2, "0")}`;
  return s === "*" && o === "*" ? { kind: "daily", time: l } : s === "*" && I(o, 0, 7) ? { kind: "weekly", time: l, day: Number(o) % 7 } : o === "*" && I(s, 1, 31) ? { kind: "monthly", time: l, day: Number(s) } : { kind: "custom" };
}
function Nn(e) {
  if (e.kind === "never") return "";
  if (e.kind === "custom") return null;
  const t = /^(\d{1,2}):(\d{2})$/.exec(e.time), n = t ? Math.min(23, Number(t[1])) : 4, a = t ? Math.min(59, Number(t[2])) : 0;
  return e.kind === "daily" ? `${a} ${n} * * *` : e.kind === "weekly" ? `${a} ${n} * * ${e.day}` : `${a} ${n} ${Math.min(31, Math.max(1, e.day))} * *`;
}
function _n(e) {
  return ct[e === "fr" ? "fr" : "en"];
}
const H = { name: "amount", kind: "int", required: !0 }, je = [
  { type: "block_break", icon: "⛏", params: [{ name: "material", kind: "material" }, H] },
  {
    type: "craft_item",
    icon: "⚒",
    params: [{ name: "item", kind: "item", legacy: "material" }, H]
  },
  {
    type: "harvest_crop",
    icon: "🌾",
    params: [{ name: "crop", kind: "material", required: !0 }, H]
  },
  {
    type: "fishing",
    icon: "🎣",
    params: [{ name: "item", kind: "item", legacy: "fish_type" }, H]
  },
  {
    type: "deliver_item",
    icon: "📦",
    params: [
      { name: "item", kind: "item", legacy: "material" },
      H,
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
  { type: "kill_entity", icon: "⚔", params: [{ name: "entity_type", kind: "entity" }, H] },
  { type: "breed_animal", icon: "♥", params: [{ name: "entity_type", kind: "entity" }, H] },
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
function z(e) {
  return je.find((t) => t.type === e);
}
function dt(e) {
  const t = {};
  for (const n of z(e)?.params ?? [])
    n.kind === "int" && (t[n.name] = 1);
  return t;
}
function ue(e) {
  return e.amount ?? e.distance;
}
function Ce(e, t) {
  const n = e[t.name];
  if (n && typeof n == "object" && !Array.isArray(n)) return n;
  const a = t.legacy ? e[t.legacy] : void 0;
  return typeof a == "string" && a !== "" ? { material: a } : {};
}
function jn(e, t, n, a) {
  t.legacy && delete e[t.legacy];
  const s = !n || Object.keys(n).length === 0;
  s ? delete e[t.name] : e[t.name] = n, s || a === void 0 ? delete e.match : e.match = a;
}
function ut(e) {
  const t = e.title;
  if (typeof t == "string" && t.trim() !== "") return t.replace(/<[^>]*>/g, "");
  const n = e.material ?? e.item;
  return typeof n == "string" ? n : "";
}
function Se(e, t) {
  const n = z(e);
  return n ? n.params.filter((a) => a.kind !== "int" && a.kind !== "line").map((a) => a.kind === "item" ? ut(Ce(t, a)) : t[a.name]).filter((a) => typeof a == "string" && a !== "").join(" = ") : Object.keys(t).map((a) => t[a]).filter((a) => typeof a == "string" && a !== "").join(" = ");
}
function pt(e, t) {
  return (z(e)?.params ?? []).filter((n) => n.required && (t[n.name] === void 0 || t[n.name] === "")).map((n) => n.name);
}
const Cn = [
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
], Sn = "#f59e0b";
function re(e, t) {
  return z(t) ? e(`objective.${t}`) : t;
}
function oe(e, t) {
  const n = Se(t.type, t.params), a = ue(t.params);
  return `${re(e, t.type)}${n ? ` · ${n}` : ""}${a !== void 0 ? ` · 0/${String(a)}` : ""}`;
}
function G(e) {
  return e.replace(/<[^<>]*>/g, "").trim();
}
function Ee(e) {
  const t = e.distribution?.strategy;
  return typeof t == "string" && ["sequential", "ladder"].includes(t.toLowerCase());
}
function En(e, t, n) {
  const a = et(n), s = Ee(e);
  return e.quests.map((i, o) => {
    const l = L(t, i.title.key, n);
    return {
      id: i.uid,
      label: G(l) || i.key,
      detail: i.tier || void 0,
      caption: An(a, i),
      marker: s ? String(o + 1) : void 0,
      hover: {
        title: l || i.key,
        text: L(t, i.description.key, n) || void 0,
        lines: $n(a, i, t, n)
      }
    };
  });
}
function An(e, t) {
  const n = t.stages.flatMap((i) => i.objectives), a = n[0];
  if (!a) return;
  const s = n.length - 1;
  return s > 0 ? `${oe(e, a)} +${String(s)}` : oe(e, a);
}
function $n(e, t, n, a) {
  const s = t.stages.length > 1;
  return t.stages.flatMap(
    (i, o) => i.objectives.map((l) => {
      const c = oe(e, l);
      return s ? `<gray>${G(L(n, i.title.key, a)) || e("stage", { n: o + 1 })} ·</gray> ${c}` : c;
    })
  );
}
function Tn(e, t) {
  const n = et(t), a = typeof e.distribution?.strategy == "string" ? e.distribution.strategy.toLowerCase() : "", s = e.quests.length, i = s === 1 ? n("questCountOne") : n("questCount", { count: s }), o = a === "sequential" || a === "ladder" ? "ordered" : a;
  return ["none", "ordered", "random"].includes(o) ? `${i} · ${n(`strategy.${o}`).toLowerCase()}` : i;
}
function On(e, t) {
  const n = ue(t.params), a = Se(t.type, t.params), s = n !== void 0 ? String(n) : "", i = s && a ? `${s} × ${a}` : s || a;
  return i ? `${re(e, t.type)} · ${i}` : re(e, t.type);
}
function mt(e) {
  return e.stages.flatMap((t) => t.objectives);
}
function Ln(e) {
  const t = mt(e), n = t.map((a) => a.key);
  return t.some(
    (a) => pt(a.type, a.params).length > 0 || n.indexOf(a.key) !== n.lastIndexOf(a.key)
  );
}
function Rn(e) {
  return Object.values($(e.rest.actions)).reduce(
    (t, n) => t + (Array.isArray(n) ? n.length : n == null ? 0 : 1),
    0
  );
}
function ft(e) {
  const t = e.completed_when;
  return Array.isArray(t) ? t : t ? [t] : [];
}
function Pe(e) {
  const t = e.map((n) => {
    if (typeof n == "string") return n;
    const a = n && typeof n == "object" ? n.expression : void 0;
    return typeof a == "string" ? a : null;
  });
  return t.every((n) => n !== null) ? t.join(" · ") : null;
}
function In(e, t, n) {
  const a = structuredClone(e);
  a.uid = nt(), a.savedUid = void 0, a.savedKey = void 0, a.oldKeys = [], a.oldPlaces = [];
  for (const s of a.stages)
    for (const i of s.objectives)
      i.savedKey = void 0, delete i.params.old_key;
  a.key = X(`${e.key}_copy`, t), a.title = n(e.title), a.description = n(e.description);
  for (const [s, i] of a.stages.entries()) i.title = n(e.stages[s].title);
  return a;
}
const Me = ["player", "global"], ge = /* @__PURE__ */ new Set();
function Dn(e, t, n) {
  if (n && n.length > 0)
    return t && !n.includes(t) ? [...n, t] : [...n];
  const a = e?.documents?.[te];
  for (const s of Array.isArray(a) ? a : []) {
    const i = s.actorType;
    typeof i == "string" && i && ge.add(i);
  }
  return t && ge.add(t), [...Me, ...[...ge].filter((s) => !Me.includes(s)).sort()];
}
function ht(e, t) {
  if (typeof e == "string") return e === "" ? {} : { [t]: e };
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const n = {};
  for (const [a, s] of Object.entries(e))
    typeof s == "string" && s !== "" && (n[a] = s);
  return n;
}
function Pn(e, t, n, a) {
  const s = ht(e, t);
  return a === "" ? delete s[n] : s[n] = a, Object.keys(s).length > 0 ? s : void 0;
}
const Mn = /^(\d+|(\d+[dhms])+)$/, Kn = ["actor_load", "period_reset", "quest_complete"], Hn = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
function Qn(e, t) {
  const n = xn(e, /* @__PURE__ */ new Date());
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
function Fn({ projectId: e, documentId: t, document: n, item: a }) {
  Be("msquests", lt);
  const s = n, i = $t(e), o = Tt(), l = Ne(), [c, d] = D(a ?? null);
  we(() => {
    d(a ?? null);
  }, [a]);
  const u = (b) => {
    d(b), Rt({ documentId: t, item: b });
  }, q = { projectId: e, project: i, lang: o, t: l, edit: (b, h) => {
    const y = structuredClone(s);
    b(y), Lt({ projectId: e, kind: te, id: t, doc: y, texts: h });
  } }, f = c ? s.quests.findIndex((b) => b.uid === c) : -1;
  return /* @__PURE__ */ r("div", { className: "aq", children: f >= 0 ? /* @__PURE__ */ r(ea, { ctx: q, group: s, index: f, onLeave: () => u(null) }, c) : /* @__PURE__ */ r(zn, { ctx: q, group: s, onOpen: u }) });
}
function ee({ open: e }) {
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
function Gn() {
  return /* @__PURE__ */ g("svg", { "aria-hidden": "true", width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: [
    /* @__PURE__ */ r("circle", { cx: "3", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "8", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "13", cy: "8", r: "1.5" })
  ] });
}
function E({ tone: e, title: t, children: n }) {
  return /* @__PURE__ */ r("span", { className: `aq-chip${e ? ` is-${e}` : ""}`, title: t, children: n });
}
function le({
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
    /* @__PURE__ */ g("label", { className: "aq-field", title: a, children: [
      /* @__PURE__ */ r("span", { className: "field-label", children: e }),
      t,
      n
    ] })
  );
}
function W({
  ctx: e,
  label: t,
  node: n,
  multiline: a,
  rows: s,
  bare: i,
  placeholder: o
}) {
  const l = ze(e.project);
  return /* @__PURE__ */ r(
    Ve,
    {
      className: "aq-field",
      label: t,
      langs: l,
      activeLang: e.lang,
      defaultLang: l[0] ?? e.lang,
      values: Je(e.project, n.key),
      onChange: (c, d) => e.edit(() => {
      }, [{ key: n.key, lang: c, value: d }]),
      inline: i,
      renderEditor: (c) => /* @__PURE__ */ r(
        Ye,
        {
          value: c.value,
          onChange: c.onChange,
          placeholder: c.fallback ?? o,
          multiline: a,
          rows: a ? s : void 0,
          "aria-label": c.label
        }
      )
    }
  );
}
function yt({
  ctx: e,
  label: t,
  value: n,
  onChange: a
}) {
  const s = ze(e.project), i = s[0] ?? e.lang;
  return /* @__PURE__ */ r("span", { title: e.t("lineHint"), className: "aq-grow", children: /* @__PURE__ */ r(
    Ve,
    {
      className: "aq-field",
      label: t,
      langs: s,
      activeLang: e.lang,
      defaultLang: i,
      values: ht(n, i),
      onChange: (o, l) => a(Pn(n, i, o, l)),
      renderEditor: (o) => /* @__PURE__ */ r(
        Ye,
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
function Un(e) {
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
      value: Un(t),
      placeholder: a,
      onChange: (s) => {
        const i = s.target.value.trim();
        n(i === "" ? void 0 : Math.max(0, Math.trunc(Number(i))));
      }
    }
  ) });
}
function Wn(e) {
  const t = gt(e);
  return t !== "" && t !== "none";
}
function gt(e) {
  return typeof e.strategy == "string" ? e.strategy.toLowerCase() : "";
}
function C(e, t, n) {
  n === void 0 || n === "" ? delete e[t] : e[t] = n;
}
function Ae(e, t, n) {
  if (n < 0 || n >= e.length) return;
  const [a] = e.splice(t, 1);
  e.splice(n, 0, a);
}
function pe({
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
function $e({
  t: e,
  label: t,
  sure: n,
  onRemove: a
}) {
  const [s, i] = D(!1);
  return s ? /* @__PURE__ */ g("span", { className: "aq-confirm", children: [
    /* @__PURE__ */ r(B, { size: "sm", variant: "ghost", onClick: () => i(!1), children: e("cancel") }),
    /* @__PURE__ */ r("button", { type: "button", className: "aq-danger", onClick: a, children: e("remove") })
  ] }) : /* @__PURE__ */ r(pe, { label: t, onClick: () => n ? a() : i(!0), children: "×" });
}
function Bn({
  label: e,
  children: t
}) {
  const [n, a] = D(!1), s = Xe(null);
  return we(() => {
    if (!n) return;
    const i = (l) => {
      s.current?.contains(l.target) || a(!1);
    }, o = (l) => {
      l.key === "Escape" && (l.preventDefault(), a(!1));
    };
    return window.addEventListener("mousedown", i), window.addEventListener("keydown", o, !0), () => {
      window.removeEventListener("mousedown", i), window.removeEventListener("keydown", o, !0);
    };
  }, [n]), /* @__PURE__ */ g("div", { className: "aq-menu-anchor", ref: s, children: [
    /* @__PURE__ */ r(pe, { label: e, expanded: n, onClick: () => a(!n), children: /* @__PURE__ */ r(Gn, {}) }),
    n && /* @__PURE__ */ r("div", { className: "aq-menu", role: "menu", children: t(() => a(!1)) })
  ] });
}
function vt(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n, a) => {
    const s = t.has(n) ? `${n}#${a}` : n;
    return t.add(n), s;
  });
}
function zn({
  ctx: e,
  group: t,
  onOpen: n
}) {
  const { t: a, edit: s, project: i, lang: o } = e, [l, c] = D(t.quests.length === 0), [d, u] = D(null), m = Ee(t), q = Object.keys(t.rest).filter((h) => h !== "actions"), f = () => {
    const h = F(), y = nt();
    s(
      (k) => {
        k.quests.push({
          key: X(
            "quest",
            k.quests.map((w) => w.key)
          ),
          uid: y,
          oldKeys: [],
          oldPlaces: [],
          tier: "",
          title: { key: h },
          description: { key: F() },
          duration: "",
          stages: [kt(1)],
          rest: {}
        });
      },
      [{ key: h, lang: o, value: a("newQuestTitle") }]
    ), n(y);
  }, b = (h) => {
    const y = [], k = (w) => {
      const N = F();
      for (const [j, S] of Object.entries(Je(i, w.key)))
        S !== "" && y.push({ key: N, lang: j, value: S });
      return { key: N };
    };
    s((w) => {
      w.quests.splice(
        h + 1,
        0,
        In(
          w.quests[h],
          w.quests.map((N) => N.key),
          k
        )
      );
    }, y);
  };
  return /* @__PURE__ */ g(M, { children: [
    /* @__PURE__ */ g("section", { className: "aq-card", children: [
      /* @__PURE__ */ g(
        "button",
        {
          type: "button",
          className: "aq-fold-head",
          "aria-expanded": l,
          onClick: () => c(!l),
          children: [
            /* @__PURE__ */ r(ee, { open: l }),
            /* @__PURE__ */ r("span", { className: "aq-h", children: a("groupSettings") }),
            !l && /* @__PURE__ */ r(Yn, { ctx: e, group: t })
          ]
        }
      ),
      l && /* @__PURE__ */ r(Jn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ g("section", { className: "aq-card", children: [
      /* @__PURE__ */ g("div", { className: "aq-card-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: a("quests") }),
        /* @__PURE__ */ r("span", { className: "aq-count", children: t.quests.length }),
        /* @__PURE__ */ r("span", { className: "aq-grow" }),
        /* @__PURE__ */ g(B, { size: "sm", variant: "primary", onClick: f, children: [
          "+ ",
          a("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: a("noQuests") }),
      /* @__PURE__ */ r(
        xe,
        {
          ids: t.quests.map((h) => h.uid),
          onMove: (h, y) => s((k) => Ae(k.quests, h, y)),
          className: "aq-quests",
          itemClassName: "aq-quest",
          children: (h, y) => {
            const k = t.quests[h], w = G(L(i, k.title.key, o)) || k.key, N = mt(k), j = ft(k.rest), S = t.tiers.find((p) => p.key === k.tier), T = Rn(k);
            return /* @__PURE__ */ g(M, { children: [
              y,
              m && /* @__PURE__ */ r("span", { className: "aq-n", children: h + 1 }),
              /* @__PURE__ */ g("button", { type: "button", className: "aq-quest-main", onClick: () => n(k.uid), children: [
                /* @__PURE__ */ r("span", { className: "aq-quest-title", children: w }),
                /* @__PURE__ */ r("span", { className: "aq-quest-sub", children: N.length === 0 ? a("noObjectivesShort") : N.map((p) => On(a, p)).join("  ·  ") })
              ] }),
              d === k.uid ? /* @__PURE__ */ g("span", { className: "aq-confirm", children: [
                /* @__PURE__ */ r("span", { children: a("removeConfirm", { name: w }) }),
                /* @__PURE__ */ r(B, { size: "sm", variant: "ghost", onClick: () => u(null), children: a("cancel") }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "aq-danger",
                    onClick: () => {
                      u(null), s((p) => {
                        p.quests.splice(h, 1);
                      });
                    },
                    children: a("remove")
                  }
                )
              ] }) : /* @__PURE__ */ g(M, { children: [
                /* @__PURE__ */ g("span", { className: "aq-chips", children: [
                  Ln(k) && /* @__PURE__ */ r(E, { tone: "warn", children: a("toComplete") }),
                  m && j.length > 0 && /* @__PURE__ */ g(E, { title: a("completedWhenHint"), children: [
                    a("completedWhen"),
                    " ",
                    Pe(j) !== null ? /* @__PURE__ */ r("span", { className: "aq-mono", children: Pe(j) }) : a("conditionCount", { count: j.length })
                  ] }),
                  k.tier && /* @__PURE__ */ r(E, { children: S && G(L(i, S.title.key, o)) || k.tier }),
                  k.duration && /* @__PURE__ */ r(E, { children: k.duration }),
                  T > 0 && /* @__PURE__ */ r(E, { children: T === 1 ? a("actionCountOne") : a("actionCount", { count: T }) })
                ] }),
                /* @__PURE__ */ r(Bn, { label: a("moreActions"), children: (p) => /* @__PURE__ */ g(M, { children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      onClick: () => {
                        p(), b(h);
                      },
                      children: a("duplicate")
                    }
                  ),
                  /* @__PURE__ */ g(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      className: "is-danger",
                      onClick: () => {
                        p(), u(k.uid);
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
function bt(e, t) {
  return t === "player" || t === "global" || t === "guild" ? e(`actor.${t}`) : t;
}
const Vn = "quests:actor_types";
function be(e) {
  const t = gt(e);
  return t === "sequential" || t === "ladder" ? "ordered" : t === "none" || t === "random" ? t : "";
}
function Yn({ ctx: e, group: t }) {
  const { t: n } = e, a = Ze(), s = typeof t.reset.cron == "string" ? t.reset.cron : "", i = be(t.distribution), o = Object.keys($(t.rest.actions)).length, l = s ? kn(s, a) ?? s : n("noReset");
  return /* @__PURE__ */ g("span", { className: "aq-chips", children: [
    /* @__PURE__ */ r(E, { children: bt(n, t.actorType) }),
    i && /* @__PURE__ */ r(E, { children: n(`strategy.${i}`) }),
    /* @__PURE__ */ r(E, { children: l.charAt(0).toUpperCase() + l.slice(1) }),
    t.tiers.length > 0 && /* @__PURE__ */ r(E, { children: n("tierCount", { count: t.tiers.length }) }),
    o > 0 && /* @__PURE__ */ r(E, { children: n("eventCount", { count: o }) })
  ] });
}
function Jn({ ctx: e, group: t }) {
  const { t: n, edit: a, project: s, lang: i } = e, o = be(t.distribution), l = o === "ordered", c = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], d = t.distribution.tiers ?? {}, u = It(Vn)?.map((f) => f.value), m = Dn(s, t.actorType, u), q = !!u?.length && !!t.actorType && !u.includes(t.actorType);
  return /* @__PURE__ */ g("div", { className: "aq-settings", children: [
    /* @__PURE__ */ g("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("identity") }),
      /* @__PURE__ */ r(W, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ r(W, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ g("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("actorType") }),
        /* @__PURE__ */ r(
          le,
          {
            label: n("actorType"),
            value: t.actorType,
            options: m.map((f) => ({ value: f, label: bt(n, f) })),
            onChange: (f) => a((b) => {
              b.actorType = f;
            })
          }
        ),
        q && /* @__PURE__ */ r("span", { className: "aq-warn", children: n("actorUnknown", { type: t.actorType }) })
      ] })
    ] }),
    /* @__PURE__ */ g("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("distribution") }),
      /* @__PURE__ */ g("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("strategy") }),
        /* @__PURE__ */ r(
          le,
          {
            label: n("strategy"),
            value: o,
            options: ["none", "ordered", "random"].map((f) => ({
              value: f,
              label: n(`strategy.${f}`)
            })),
            onChange: (f) => a((b) => {
              f === "ordered" && be(b.distribution) === "ordered" || (b.distribution.strategy = f === "ordered" ? "sequential" : f);
            })
          }
        )
      ] }),
      !l && /* @__PURE__ */ g(M, { children: [
        /* @__PURE__ */ g("div", { className: "aq-row", children: [
          /* @__PURE__ */ r(
            Q,
            {
              label: n("amount"),
              value: t.distribution.amount,
              onChange: (f) => a((b) => C(b.distribution, "amount", f))
            }
          ),
          /* @__PURE__ */ r(
            Q,
            {
              label: n("maxActive"),
              value: t.limits.max_active,
              onChange: (f) => a((b) => C(b.limits, "max_active", f))
            }
          )
        ] }),
        /* @__PURE__ */ g("div", { className: "aq-field", children: [
          /* @__PURE__ */ r("span", { className: "field-label", children: n("triggers") }),
          Kn.map((f) => /* @__PURE__ */ g("label", { className: "aq-check", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: c.includes(f),
                onChange: (b) => a((h) => {
                  const y = Array.isArray(h.distribution.triggers) ? h.distribution.triggers : [], k = b.target.checked ? [...y, f] : y.filter((w) => w !== f);
                  C(h.distribution, "triggers", k.length ? k : void 0);
                })
              }
            ),
            n(`trigger.${f}`)
          ] }, f))
        ] })
      ] }),
      /* @__PURE__ */ r(
        Q,
        {
          label: n("questsPerPeriod"),
          placeholder: n("noLimit"),
          value: t.limits.max_per_period,
          onChange: (f) => a((b) => C(b.limits, "max_per_period", f))
        }
      ),
      !l && /* @__PURE__ */ g("div", { className: "aq-row", children: [
        /* @__PURE__ */ g("label", { className: "aq-check", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: t.rotation.enabled === !0,
              onChange: (f) => a((b) => C(b.rotation, "enabled", f.target.checked ? !0 : void 0))
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
            onChange: (f) => a((b) => C(b.rotation, "max_per_period", f))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ g("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("reset") }),
      /* @__PURE__ */ r(Zn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ g("div", { className: "aq-block", children: [
      /* @__PURE__ */ g("div", { className: "aq-block-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("tiers") }),
        /* @__PURE__ */ g(
          B,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => a((f) => {
              f.tiers.push({
                key: X(
                  "tier",
                  f.tiers.map((b) => b.key)
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
      t.tiers.map((f, b) => /* @__PURE__ */ g("div", { className: "aq-tier", children: [
        /* @__PURE__ */ r(W, { ctx: e, label: n("title"), node: f.title }),
        /* @__PURE__ */ r(O, { label: n("tierKey"), children: /* @__PURE__ */ r(
          "input",
          {
            className: "input aq-mono",
            defaultValue: f.key,
            onBlur: (h) => {
              const y = de(h.target.value);
              y !== f.key && a((k) => {
                const w = X(
                  y,
                  k.tiers.map((j) => j.key)
                );
                k.tiers[b].key = w;
                for (const j of k.quests) j.tier === f.key && (j.tier = w);
                const N = k.distribution.tiers;
                N && f.key in N && (N[w] = N[f.key], delete N[f.key]);
              });
            }
          }
        ) }),
        !l && /* @__PURE__ */ r(
          Q,
          {
            label: n("perTier"),
            value: d[f.key],
            onChange: (h) => a((y) => {
              const k = { ...y.distribution.tiers ?? {} };
              C(k, f.key, h), C(y.distribution, "tiers", Object.keys(k).length ? k : void 0);
            })
          }
        ),
        /* @__PURE__ */ r(
          $e,
          {
            t: n,
            label: n("remove"),
            sure: !t.quests.some((h) => h.tier === f.key),
            onRemove: () => a((h) => {
              h.tiers.splice(b, 1);
            })
          }
        )
      ] }, f.key)),
      t.tiers.length === 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: n("noTier") })
    ] }),
    /* @__PURE__ */ r("div", { className: "aq-block is-wide", children: /* @__PURE__ */ r(
      qt,
      {
        ctx: e,
        title: n("hooks"),
        hooks: rn,
        label: (f) => n(`hook.${f}`),
        value: t.rest.actions,
        onChange: (f, b) => a((h) => {
          const y = { ...$(h.rest.actions) };
          C(y, f, b), C(h.rest, "actions", Object.keys(y).length ? y : void 0);
        })
      },
      t.id
    ) })
  ] });
}
function Zn({ ctx: e, group: t }) {
  const { t: n, edit: a } = e, s = Ze(), i = typeof t.reset.cron == "string" ? t.reset.cron : "", o = wn(i), [l, c] = D(!1), d = l && i !== "" ? { kind: "custom" } : o, u = typeof t.reset.timezone == "string" ? t.reset.timezone : "", m = i && ye(i) ? Qn(i, s) : null, q = (h) => {
    const y = Nn(h);
    y !== null && a((k) => C(k.reset, "cron", y));
  }, f = "time" in d ? d.time : "04:00", b = (h) => {
    c(h === "custom"), h === "never" ? q({ kind: h }) : h === "daily" ? q({ kind: h, time: f }) : h === "weekly" ? q({ kind: h, time: f, day: 1 }) : h === "monthly" ? q({ kind: h, time: f, day: 1 }) : i === "" && a((y) => C(y.reset, "cron", "0 4 * * *"));
  };
  return /* @__PURE__ */ g(M, { children: [
    /* @__PURE__ */ r(
      le,
      {
        label: n("reset"),
        value: d.kind,
        options: ["never", "daily", "weekly", "monthly", "custom"].map((h) => ({
          value: h,
          label: n(`reset.${h}`)
        })),
        onChange: b
      }
    ),
    d.kind !== "never" && /* @__PURE__ */ g("div", { className: "aq-row aq-reset", children: [
      d.kind === "weekly" && /* @__PURE__ */ r(O, { label: n("resetDay"), children: /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: d.day,
          onChange: (h) => q({ ...d, day: Number(h.target.value) }),
          children: [1, 2, 3, 4, 5, 6, 0].map((h) => /* @__PURE__ */ r("option", { value: h, children: _n(s)[h] }, h))
        }
      ) }),
      d.kind === "monthly" && /* @__PURE__ */ r(
        Q,
        {
          label: n("resetDayOfMonth"),
          value: d.day,
          onChange: (h) => q({ ...d, day: h ?? 1 })
        }
      ),
      d.kind === "custom" ? /* @__PURE__ */ r(
        O,
        {
          label: n("cron"),
          hint: ye(i) ? void 0 : /* @__PURE__ */ r("span", { className: "aq-err", children: n("cronInvalid") }),
          children: /* @__PURE__ */ r(
            "input",
            {
              className: "input aq-mono",
              value: i,
              placeholder: "0 4 * * *",
              onChange: (h) => a((y) => C(y.reset, "cron", h.target.value))
            }
          )
        }
      ) : /* @__PURE__ */ r(O, { label: n("resetTime"), children: /* @__PURE__ */ r(
        "input",
        {
          className: "input",
          type: "time",
          value: d.time,
          onChange: (h) => h.target.value && q({ ...d, time: h.target.value })
        }
      ) })
    ] }),
    i && ye(i) && (u || m) && /* @__PURE__ */ r("span", { className: "aq-ok", children: u && u !== Hn ? u : m ? n("nextRun", { when: m }) : "" })
  ] });
}
function Xn({
  ctx: e,
  value: t,
  onChange: n
}) {
  const { chain: a, legacy: s } = an(t);
  return /* @__PURE__ */ g("div", { className: "aq-chain", children: [
    /* @__PURE__ */ r(
      Dt,
      {
        projectId: e.projectId,
        value: a,
        onChange: (i) => n(Ie(i, s))
      }
    ),
    s.length > 0 && /* @__PURE__ */ r("div", { className: "aq-legacy", title: e.t("legacySteps"), children: s.map((i, o) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
      /* @__PURE__ */ g("div", { className: "aq-legacy-row", children: [
        /* @__PURE__ */ r("code", { children: sn(i) }),
        /* @__PURE__ */ r(
          pe,
          {
            label: e.t("remove"),
            onClick: () => n(Ie(a, s.filter((l, c) => c !== o))),
            children: "×"
          }
        )
      ] }, o)
    )) })
  ] });
}
function qt({
  ctx: e,
  title: t,
  hooks: n,
  label: a,
  value: s,
  onChange: i
}) {
  const { t: o } = e, l = $(s), [c, d] = D([]), [u, m] = D(null), q = n.filter((b) => l[b] != null || c.includes(b)), f = n.filter((b) => !q.includes(b));
  return /* @__PURE__ */ g(M, { children: [
    /* @__PURE__ */ g("div", { className: "aq-block-head", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: t }),
      f.length > 0 && /* @__PURE__ */ g(
        "select",
        {
          className: "select aq-event-add",
          "aria-label": o("addEvent"),
          value: "",
          onChange: (b) => {
            const h = f.find((y) => y === b.target.value);
            h && (d((y) => [...y, h]), m(h));
          },
          children: [
            /* @__PURE__ */ g("option", { value: "", children: [
              "+ ",
              o("addEvent")
            ] }),
            f.map((b) => /* @__PURE__ */ r("option", { value: b, children: a(b) }, b))
          ]
        }
      )
    ] }),
    q.map((b) => {
      const h = u === b, y = Array.isArray(l[b]) ? l[b].length : l[b] ? 1 : 0;
      return /* @__PURE__ */ g("div", { className: `aq-line${h ? " is-open" : ""}`, children: [
        /* @__PURE__ */ g("div", { className: "aq-line-head", children: [
          /* @__PURE__ */ g(
            "button",
            {
              type: "button",
              className: "aq-line-main",
              "aria-expanded": h,
              onClick: () => m(h ? null : b),
              children: [
                /* @__PURE__ */ r(ee, { open: h }),
                /* @__PURE__ */ r("span", { className: "aq-line-text", children: a(b) }),
                y > 0 && /* @__PURE__ */ r(E, { children: y === 1 ? o("actionCountOne") : o("actionCount", { count: y }) })
              ]
            }
          ),
          /* @__PURE__ */ r(
            $e,
            {
              t: o,
              label: o("removeEvent"),
              sure: y === 0,
              onRemove: () => {
                d((k) => k.filter((w) => w !== b)), i(b, void 0);
              }
            }
          )
        ] }),
        h && /* @__PURE__ */ r("div", { className: "aq-line-body", children: /* @__PURE__ */ r(Xn, { ctx: e, value: l[b], onChange: (k) => i(b, k) }) })
      ] }, b);
    })
  ] });
}
function kt(e) {
  return {
    key: `stage_${e}`,
    title: { key: F() },
    flow: "parallel",
    objectives: [],
    rest: {}
  };
}
function ea({
  ctx: e,
  group: t,
  index: n,
  onLeave: a
}) {
  const { t: s, edit: i, project: o, lang: l } = e, c = t.quests[n], d = (v, x) => i((_) => v(_.quests[n]), x), u = t.quests.some((v, x) => x !== n && v.key === c.key), m = Xe(c.key), q = rt(c, new Set(t.quests.map((v) => v.key))), f = c.duration !== "" && !Mn.test(c.duration.replace(/\s/g, "").toLowerCase()), b = Object.keys(c.rest).filter(
    (v) => v !== "actions" && v !== "giver" && v !== "completed_when"
  ), h = Ee(t), y = c.rest.giver && typeof c.rest.giver == "object" ? c.rest.giver : {}, k = (v, x) => d((_) => {
    const R = { ...y };
    C(R, v, x.trim()), typeof R.npc == "string" && R.npc !== "" ? _.rest.giver = R : delete _.rest.giver;
  }), w = typeof y.npc == "string" ? y.npc : "", N = Wn(t.distribution), j = t.tiers.find((v) => v.key === c.tier), [S, T] = D(!1), p = S || u || f;
  return we(() => {
    const v = (x) => {
      x.key !== "Escape" || x.defaultPrevented || x.target?.closest("input, textarea, select, [contenteditable='true']") || window.document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]') || (x.preventDefault(), a());
    };
    return window.addEventListener("keydown", v, !0), () => window.removeEventListener("keydown", v, !0);
  }, [a]), /* @__PURE__ */ g("div", { className: "aq-quest-page", children: [
    /* @__PURE__ */ g("div", { className: "aq-quest-col", children: [
      /* @__PURE__ */ g("section", { className: "aq-card", children: [
        /* @__PURE__ */ g("div", { className: "aq-quest-head", children: [
          /* @__PURE__ */ r("div", { className: "aq-quest-name", children: /* @__PURE__ */ r(W, { ctx: e, label: s("questName"), node: c.title }) }),
          /* @__PURE__ */ r(
            W,
            {
              ctx: e,
              multiline: !0,
              rows: 2,
              label: s("questDescription"),
              node: c.description
            }
          )
        ] }),
        /* @__PURE__ */ g(
          "button",
          {
            type: "button",
            className: "aq-fold-head is-inner",
            "aria-expanded": p,
            onClick: () => T(!p),
            children: [
              /* @__PURE__ */ r(ee, { open: p }),
              /* @__PURE__ */ r("span", { className: "aq-fold-title", children: s("questSettings") }),
              !p && /* @__PURE__ */ g("span", { className: "aq-chips", children: [
                c.tier && /* @__PURE__ */ r(E, { children: j && G(L(o, j.title.key, l)) || c.tier }),
                /* @__PURE__ */ r(E, { children: c.duration || s("noTimeLimit") }),
                w && /* @__PURE__ */ r(E, { children: s("givenBy", { npc: w }) }),
                /* @__PURE__ */ r(E, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: c.key }) })
              ] })
            ]
          }
        ),
        p && /* @__PURE__ */ g("div", { className: "aq-fold-body", children: [
          /* @__PURE__ */ g("div", { className: "aq-row aq-top aq-wrap", children: [
            t.tiers.length > 0 || c.tier ? /* @__PURE__ */ r(O, { label: s("tier"), children: /* @__PURE__ */ g(
              "select",
              {
                className: "select",
                value: c.tier,
                onChange: (v) => d((x) => {
                  x.tier = v.target.value;
                }),
                children: [
                  /* @__PURE__ */ r("option", { value: "", children: s("noTier") }),
                  t.tiers.map((v) => /* @__PURE__ */ r("option", { value: v.key, children: G(L(o, v.title.key, l)) || v.key }, v.key)),
                  c.tier && !j && /* @__PURE__ */ r("option", { value: c.tier, children: c.tier })
                ]
              }
            ) }) : null,
            /* @__PURE__ */ r(
              O,
              {
                label: s("duration"),
                hint: f ? /* @__PURE__ */ r("span", { className: "aq-err", children: s("durationInvalid") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input",
                    value: c.duration,
                    placeholder: "24h",
                    onChange: (v) => d((x) => {
                      x.duration = v.target.value.trim();
                    })
                  }
                )
              }
            ),
            /* @__PURE__ */ r(
              O,
              {
                label: s("key"),
                hint: u ? /* @__PURE__ */ r("span", { className: "aq-err", children: s("keyTaken") }) : q.length > 0 ? /* @__PURE__ */ g("span", { children: [
                  s("formerKeys", { keys: q.join(", ") }),
                  " ",
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "aq-forget",
                      onClick: () => d((v) => {
                        v.oldKeys = [], v.savedKey = v.key;
                      }),
                      children: s("forgetFormerKeys")
                    }
                  )
                ] }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input aq-mono",
                    value: c.key,
                    onFocus: () => {
                      m.current = c.key;
                    },
                    onChange: (v) => d((x) => {
                      x.key = at(v.target.value);
                    }),
                    onBlur: () => {
                      const v = de(c.key), x = m.current;
                      (v !== c.key || x !== v) && d((_) => {
                        _.key = v, Vt(_, x);
                      });
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ g("div", { className: "aq-row aq-top aq-wrap", children: [
            /* @__PURE__ */ r(O, { label: s("giverNpc"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: w,
                onChange: (v) => k("npc", v.target.value)
              }
            ) }),
            w && /* @__PURE__ */ r(O, { label: s("giverConversation"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: typeof y.conversation == "string" ? y.conversation : "",
                onChange: (v) => k("conversation", v.target.value)
              }
            ) })
          ] }),
          w && /* @__PURE__ */ r(
            yt,
            {
              ctx: e,
              label: s("giverLine"),
              value: y.line,
              onChange: (v) => d((x) => {
                const _ = { ...y };
                C(_, "line", v), x.rest.giver = _;
              })
            }
          ),
          w && N && /* @__PURE__ */ r("span", { className: "aq-warn", children: s("giverDistributed") })
        ] })
      ] }),
      /* @__PURE__ */ r(
        xe,
        {
          ids: vt(c.stages.map((v) => v.key)),
          onMove: (v, x) => d((_) => Ae(_.stages, v, x)),
          className: "aq-stages",
          children: (v, x) => /* @__PURE__ */ r(
            ta,
            {
              ctx: e,
              quest: c,
              stage: c.stages[v],
              si: v,
              handle: x,
              editQuest: d
            }
          )
        }
      ),
      /* @__PURE__ */ g(
        B,
        {
          size: "sm",
          variant: "ghost",
          className: "aq-add",
          onClick: () => d((v) => {
            const x = X(
              `stage_${v.stages.length + 1}`,
              v.stages.map((_) => _.key)
            );
            v.stages.push({ ...kt(v.stages.length + 1), key: x });
          }),
          children: [
            "+ ",
            s("addStage")
          ]
        }
      ),
      h && /* @__PURE__ */ g("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ g("span", { className: "aq-h aq-h-row", children: [
          s("completedWhen"),
          /* @__PURE__ */ r("span", { className: "aq-help", tabIndex: 0, role: "note", "aria-label": s("completedWhenHint"), "data-tip": s("completedWhenHint"), children: "?" })
        ] }),
        /* @__PURE__ */ r(
          Ot,
          {
            projectId: e.projectId,
            value: ft(c.rest),
            emptyHint: s("completedWhenEmpty"),
            onChange: (v) => d((x) => C(x.rest, "completed_when", v.length > 0 ? v : void 0))
          },
          c.uid
        )
      ] }),
      /* @__PURE__ */ g("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r(
          qt,
          {
            ctx: e,
            title: s("questEvents"),
            hooks: on,
            label: (v) => s(`questHook.${v}`),
            value: c.rest.actions,
            onChange: (v, x) => d((_) => {
              const R = { ...$(_.rest.actions) };
              C(R, v, x), C(_.rest, "actions", Object.keys(R).length > 0 ? R : void 0);
            })
          },
          c.uid
        ),
        b.length > 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: s("kept", { fields: b.join(", ") }) })
      ] })
    ] }),
    /* @__PURE__ */ g("aside", { className: "aq-card aq-pad aq-aside", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: s("preview") }),
      /* @__PURE__ */ r(ra, { ctx: e, quest: c })
    ] })
  ] });
}
function ta({
  ctx: e,
  quest: t,
  stage: n,
  si: a,
  handle: s,
  editQuest: i
}) {
  const { t: o } = e, [l, c] = D(null), [d, u] = D(!1), m = (y) => i((k) => y(k.stages[a])), q = n.flow || "parallel", f = t.stages.flatMap((y) => y.objectives.map((k) => k.key)), b = d || n.objectives.length === 0, h = (y) => {
    const k = Ut(y, f);
    i((w) => {
      w.stages[a].objectives.push({ key: k, type: y, params: dt(y) });
    }), c(k), u(!1);
  };
  return /* @__PURE__ */ g("div", { className: "aq-card aq-stage", children: [
    /* @__PURE__ */ g("div", { className: "aq-stage-head", children: [
      s,
      /* @__PURE__ */ r("span", { className: "aq-eyebrow aq-stage-label", children: o("stage", { n: a + 1 }) }),
      /* @__PURE__ */ r("div", { className: "aq-stage-title", children: /* @__PURE__ */ r(
        W,
        {
          ctx: e,
          bare: !0,
          label: o("stageName"),
          node: n.title,
          placeholder: o("stageNameDefault", { n: a + 1 })
        }
      ) }),
      n.objectives.length > 1 && /* @__PURE__ */ r(
        le,
        {
          label: o("flow"),
          value: q,
          options: ["parallel", "sequential"].map((y) => ({
            value: y,
            label: o(`flow.${y}`)
          })),
          onChange: (y) => m((k) => {
            k.flow = y;
          })
        }
      ),
      /* @__PURE__ */ r(
        $e,
        {
          t: o,
          label: o("remove"),
          sure: n.objectives.length === 0,
          onRemove: () => i((y) => {
            y.stages.splice(a, 1);
          })
        }
      )
    ] }),
    /* @__PURE__ */ g("span", { className: "aq-eyebrow", children: [
      o("objectives"),
      " ",
      /* @__PURE__ */ r("span", { className: "aq-count", children: n.objectives.length })
    ] }),
    /* @__PURE__ */ r(
      xe,
      {
        ids: vt(n.objectives.map((y) => y.key)),
        onMove: (y, k) => m((w) => Ae(w.objectives, y, k)),
        className: "aq-objectives",
        children: (y, k) => {
          const w = n.objectives[y];
          return /* @__PURE__ */ r(
            na,
            {
              ctx: e,
              t: o,
              projectId: e.projectId,
              n: q === "sequential" ? `${a + 1}.${y + 1}` : "",
              objective: w,
              open: l === w.key,
              onToggle: () => c(l === w.key ? null : w.key),
              keyTaken: f.filter((N) => N === w.key).length > 1,
              handle: k,
              onChange: (N) => m((j) => N(j.objectives[y])),
              onRename: (N) => {
                l === w.key && c(N);
              },
              onRemove: () => m((N) => {
                N.objectives.splice(y, 1);
              })
            }
          );
        }
      }
    ),
    b ? /* @__PURE__ */ g("div", { className: "aq-types", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: o("addObjective") }),
      /* @__PURE__ */ r("div", { className: "aq-seg", children: je.map((y) => /* @__PURE__ */ g("button", { type: "button", className: "aq-opt", onClick: () => h(y.type), children: [
        /* @__PURE__ */ r("span", { "aria-hidden": !0, children: y.icon }),
        " ",
        o(`objective.${y.type}`)
      ] }, y.type)) })
    ] }) : /* @__PURE__ */ g(B, { size: "sm", variant: "ghost", className: "aq-add", onClick: () => u(!0), children: [
      "+ ",
      o("addObjective")
    ] })
  ] });
}
function na({
  ctx: e,
  t,
  projectId: n,
  n: a,
  objective: s,
  open: i,
  onToggle: o,
  keyTaken: l,
  handle: c,
  onChange: d,
  onRename: u,
  onRemove: m
}) {
  const q = z(s.type), f = q ? q.params : Object.keys(s.params).map((p) => ({ name: p, kind: "text" })), b = ue(s.params), h = Se(s.type, s.params), y = pt(s.type, s.params), k = l || y.length > 0, w = f.filter((p) => p.advanced), [N, j] = D(!1), S = N || l, T = (p) => p.kind === "item" ? /* @__PURE__ */ r(
    aa,
    {
      t,
      projectId: n,
      spec: p,
      params: s.params,
      onChange: (v) => d((x) => v(x.params))
    },
    p.name
  ) : p.kind === "line" ? /* @__PURE__ */ r(
    yt,
    {
      ctx: e,
      label: t(`param.${p.name}`),
      value: s.params[p.name],
      onChange: (v) => d((x) => C(x.params, p.name, v))
    },
    p.name
  ) : /* @__PURE__ */ r(
    sa,
    {
      t,
      spec: p,
      value: s.params[p.name],
      onChange: (v) => d((x) => C(x.params, p.name, v))
    },
    p.name
  );
  return /* @__PURE__ */ g("div", { className: `aq-obj${i ? " is-open" : ""}${k ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ g("div", { className: "aq-obj-line", children: [
      c,
      /* @__PURE__ */ g("button", { type: "button", className: "aq-obj-main", onClick: o, "aria-expanded": i, children: [
        a && /* @__PURE__ */ r("span", { className: "aq-obj-n", children: a }),
        /* @__PURE__ */ r("span", { className: "aq-obj-icon", "aria-hidden": !0, children: q?.icon ?? "?" }),
        /* @__PURE__ */ g("span", { className: "aq-obj-text", children: [
          re(t, s.type),
          b !== void 0 && /* @__PURE__ */ g("strong", { children: [
            " · ",
            String(b)
          ] }),
          h ? ` × ${h}` : b !== void 0 && q ? ` × ${t("any")}` : ""
        ] }),
        k && /* @__PURE__ */ r(E, { tone: "warn", children: l ? t("objectiveKeyTaken") : t("missing", {
          fields: y.map((p) => t(`param.${p}`)).join(", ")
        }) }),
        /* @__PURE__ */ r(ee, { open: i })
      ] }),
      /* @__PURE__ */ r(pe, { label: t("remove"), onClick: m, children: "×" })
    ] }),
    i && /* @__PURE__ */ g("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ g("div", { className: "aq-row aq-top aq-wrap", children: [
        /* @__PURE__ */ r(O, { label: t("type"), children: /* @__PURE__ */ g(
          "select",
          {
            className: "select",
            value: s.type,
            onChange: (p) => d((v) => {
              v.type = p.target.value, v.params = dt(v.type);
            }),
            children: [
              je.map((p) => /* @__PURE__ */ g("option", { value: p.type, children: [
                p.icon,
                " ",
                t(`objective.${p.type}`)
              ] }, p.type)),
              !q && /* @__PURE__ */ r("option", { value: s.type, children: s.type })
            ]
          }
        ) }),
        f.filter((p) => !p.advanced).map(T)
      ] }),
      /* @__PURE__ */ g(
        "button",
        {
          type: "button",
          className: "aq-fold-head is-inner",
          "aria-expanded": S,
          onClick: () => j(!S),
          children: [
            /* @__PURE__ */ r(ee, { open: S }),
            /* @__PURE__ */ r("span", { className: "aq-fold-title", children: t("more") }),
            !S && /* @__PURE__ */ r(E, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: s.key }) })
          ]
        }
      ),
      S && /* @__PURE__ */ g("div", { className: "aq-row aq-top aq-wrap", children: [
        w.map(T),
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
                onChange: (p) => {
                  const v = at(p.target.value);
                  d((x) => {
                    x.key = v;
                  }), u(v);
                },
                onBlur: () => {
                  const p = de(s.key);
                  p !== s.key && (d((v) => {
                    v.key = p;
                  }), u(p));
                }
              }
            )
          }
        )
      ] })
    ] })
  ] });
}
function aa({
  t: e,
  projectId: t,
  spec: n,
  params: a,
  onChange: s
}) {
  const i = Ce(a, n), o = Array.isArray(a.match) ? a.match : void 0, l = (c, d) => s((u) => jn(u, n, c, d));
  return /* @__PURE__ */ r(O, { label: e(`param.${n.name}`), children: /* @__PURE__ */ r(
    Mt,
    {
      projectId: t,
      value: i,
      match: o,
      onChange: (c) => l(c, o),
      onMatchChange: (c) => l(i, c)
    }
  ) });
}
function sa({
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
      Kt,
      {
        value: i,
        placeholder: e("any"),
        "aria-label": s,
        onChange: (l) => a(l.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const o = t.kind === "entity";
  return /* @__PURE__ */ g(O, { label: s, children: [
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
    o && /* @__PURE__ */ r("datalist", { id: "aq-entities", children: Cn.map((l) => /* @__PURE__ */ r("option", { value: l }, l)) })
  ] });
}
const ia = 170, Ke = { color: "#aaaaaa", italic: !1 }, He = { color: "#ffffff", italic: !1 };
function ra({ ctx: e, quest: t }) {
  const { t: n, project: a, lang: s } = e, i = (d) => d.split(`
`).flatMap((u) => u === "" ? [""] : Pt(u, ia)), o = L(a, t.title.key, s) || t.key, l = L(a, t.description.key, s), c = t.stages.length > 1;
  return /* @__PURE__ */ r("div", { className: "aq-preview", children: /* @__PURE__ */ g("div", { className: "aq-preview-frame", children: [
    /* @__PURE__ */ r(ae, { source: i(o).join(`
`), defaults: He, scale: 2 }),
    l && /* @__PURE__ */ r(ae, { source: i(l).join(`
`), defaults: Ke, scale: 2 }),
    t.stages.map((d, u) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ g("div", { className: "aq-preview-stage", children: [
        c && /* @__PURE__ */ r(
          ae,
          {
            source: i(L(a, d.title.key, s) || n("stage", { n: u + 1 })).join(`
`),
            defaults: He,
            scale: 2
          }
        ),
        d.objectives.length > 0 && /* @__PURE__ */ r(
          ae,
          {
            source: d.objectives.flatMap((m) => i(`• ${oe(n, m)}`)).join(`
`),
            defaults: Ke,
            scale: 2
          }
        )
      ] }, u)
    ))
  ] }) });
}
function oa({ className: e }) {
  return /* @__PURE__ */ g(
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
const la = {
  kind: te,
  dir: tt,
  schemaVersion: _e,
  // Created in the module's folder only (SDK 1.8); a group already elsewhere still loads.
  projects: [Ft],
  // Data with no links: one "Quests" entry and page instead of a node per group (SDK 1.9).
  collection: { labels: Qt },
  // A group's id is its key on the server (`quest_group_key`): typed by hand, no prefix.
  label: Le.en,
  labels: Le,
  icon: oa,
  component: Fn,
  // The view is a page of its own: its cards, and the quest beside what the player sees.
  ownHeader: !0,
  wide: !0,
  title: (e, { project: t, lang: n }) => G(L(t, e.title.key, n)),
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
  parse: (e, t) => Wt(e, t),
  serialize: (e, t) => tn(e, t),
  ltextSites: (e) => nn(e),
  board: {
    size: { width: 300, height: 48 },
    accent: Sn,
    // The group's quests, one selectable row each: the Properties panel opens the one clicked.
    items: (e, { project: t, lang: n }) => En(e, t, n),
    summary: (e, { lang: t }) => Tn(e, t)
  }
}, Qe = "quests:groups", Fe = "quests:quests", ca = "quests:active";
function da(e) {
  return e.startsWith("msquests:") ? `quests:${e.slice(9)}` : e;
}
const Ge = {
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
}, Ue = { en: "Available", fr: "Disponible" };
function ua(e, t, n) {
  const a = da(t);
  if (a !== Qe && a !== Fe && a !== ca) return null;
  const s = e.documents?.[te];
  if (!s || s.length === 0) return null;
  const i = e.defaultLang ?? "en", o = n?.serverRows, l = n?.params?.group || void 0, c = [...s].sort((u, m) => u.id < m.id ? -1 : u.id > m.id ? 1 : 0);
  if (a === Qe) {
    const u = qe(o, "key");
    return c.map((m) => pa(m, u.get(m.id), i));
  }
  if (a === Fe) {
    const u = qe(o, "id");
    return c.filter((m) => !l || m.id === l).flatMap((m) => m.quests.map((q) => xt(m, q, u.get(`${m.id}:${q.key}`), i)));
  }
  if (!o) return null;
  const d = new Map(s.map((u) => [u.id, u]));
  return o.flatMap((u) => {
    const m = d.get(P(u.group));
    if (!m) return [u];
    const q = m.quests.find((f) => f.key === P(u.quest_key));
    return q ? [va(q, u, i)] : [];
  });
}
function pa(e, t, n) {
  const a = qe(J(t?.quests), "key");
  return {
    key: e.id,
    name: e.title,
    description: e.description,
    actor_type: e.actorType,
    max_active: ke(e.limits.max_active, 1),
    max_per_period: ke(e.limits.max_per_period, 0),
    rotatable: e.rotation.enabled === !0,
    // The period follows the server's clock and zone: its value stands until a deploy.
    period_end: t?.period_end ?? 0,
    active_count: t?.active_count ?? 0,
    completed_count: t?.completed_count ?? 0,
    can_rotate: t?.can_rotate ?? !1,
    quests: e.quests.map((s) => xt(e, s, a.get(s.key), n))
  };
}
function xt(e, t, n, a) {
  const s = e.tiers.find((i) => i.key === t.tier);
  return {
    id: `${e.id}:${t.key}`,
    group: e.id,
    key: t.key,
    name: t.title,
    description: t.description,
    duration: xa(t.duration),
    tier: t.tier,
    tier_name: s ? s.title : "",
    assigned: n?.assigned ?? !1,
    status_key: n?.status_key ?? "NOT_STARTED",
    status: n?.status ?? Ue[a.slice(0, 2)] ?? Ue.en,
    can_start: n?.can_start ?? !1,
    start_blocker: n?.start_blocker ?? "",
    start_blocker_label: n?.start_blocker_label ?? "",
    // `reference` in `QuestRows.questRow`: the attempt the server holds for this player.
    ...wt(t, n?.assigned === !0 ? n : void 0, a)
  };
}
function wt(e, t, n) {
  const a = t ? ma(t) : void 0, s = ha(e, a, t ? fa(t) : "", n), i = s.find((l) => l.active === !0), o = i ? i.objectives.find((l) => l.done !== !0) : void 0;
  return {
    objective_name: o?.name ?? "",
    objective_progress: o?.progress ?? 0,
    objective_target: o?.target ?? 0,
    progress_ratio: a ? Nt(s.map((l) => l.progress_ratio)) : 0,
    stage_index: s.filter((l) => l.completed === !0).length,
    stage_name: i?.name ?? "",
    stage_flow: i?.flow ?? "",
    stages: s.map((l) => ({ ...l, objectives: l.objectives.map(({ done: c, ...d }) => d) }))
  };
}
function ma(e) {
  const t = /* @__PURE__ */ new Map(), n = [
    ...J(e.objectives),
    ...J(e.stages).flatMap((a) => J(a.objectives))
  ];
  for (const a of n) {
    const s = P(a.status_key);
    t.set(P(a.key), {
      progress: ke(a.progress, 0),
      flag: s === "COMPLETED" || s === "FAILED" ? s : "",
      row: a
    });
  }
  return t;
}
function fa(e) {
  return P(J(e.stages).find((t) => t.active === !0)?.key);
}
function ha(e, t, n, a) {
  const s = t && n ? e.stages.findIndex((l) => l.key === n) : -1, i = e.stages.map((l, c) => {
    const d = c < s, u = l.objectives.map((m) => {
      const q = ga(m, ya(m, t), a);
      return d && q.status_key !== "FAILED" && (q.status_key = "COMPLETED"), q;
    });
    return {
      key: l.key,
      name: l.title,
      flow: ka(l),
      index: c,
      // `QuestStage.isCompleted`: passed, or all objectives done, so an empty stage is.
      completed: t !== void 0 && (d || u.every((m) => m.done)),
      active: !1,
      progress_ratio: t ? d ? 1 : Nt(u.map((m) => m.progress_ratio)) : 0,
      objectives: u
    };
  });
  if (!t) return i;
  const o = i.find((l) => l.completed !== !0);
  if (o) {
    o.active = !0;
    const l = o.objectives, c = l.find((d) => d.done !== !0);
    for (const d of l)
      d.status_key === "PENDING" && (o.flow !== "SEQUENTIAL" || d === c) && (d.status_key = "IN_PROGRESS");
  }
  return i;
}
function ya(e, t) {
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
function ga(e, t, n) {
  const a = qa(e), s = t?.progress ?? 0, i = t?.row, o = i && i.type === e.type && i.target === a, l = t !== void 0 && (t.flag === "COMPLETED" || s >= a);
  return {
    key: e.key,
    name: o && typeof i.name == "string" ? i.name : ba(e, n),
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
function va(e, t, n) {
  const a = wt(e, t, n), s = a.stages;
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
function ba(e, t) {
  const a = (Ge[t.slice(0, 2)] ?? Ge.en)[e.type];
  if (!a) return e.type;
  const s = e.params, i = {
    amount: String(s.amount ?? ""),
    distance: String(s.distance ?? ""),
    command: P(s.command),
    value: P(s.value),
    // Bukkit's translation keys, as the objective configs write them (`<lang:…>`).
    crop: ie("block", s.crop),
    entity_type: ie("entity", s.entity_type),
    material: e.type === "block_break" ? ie("block", s.material) : We(e),
    fish_type: We(e)
  };
  return a.replace(/%([a-z_]+)%/g, (o, l) => i[l] ?? "");
}
function ie(e, t) {
  const n = P(t).toLowerCase().replace(/^minecraft:/, "");
  return n === "" ? "" : `<lang:${e}.minecraft.${n}>`;
}
function We(e) {
  const t = z(e.type)?.params.find((i) => i.kind === "item");
  if (!t) return "";
  const n = Ce(e.params, t), a = n.title;
  if (typeof a == "string" && a.trim() !== "") return a;
  const s = P(n.material);
  return /^(minecraft:)?[a-z_0-9]+$/i.test(s) && !s.includes(":") ? ie("item", s) : s || ut(n);
}
function qa(e) {
  const t = ue(e.params);
  if (t === void 0) return 1;
  const n = Number(t);
  return Number.isFinite(n) ? n : 1;
}
function ka(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function xa(e) {
  const t = e.trim().toLowerCase().replace(/ /g, "");
  if (t === "") return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const n = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!n) return 0;
  const [, a, s, i, o] = n;
  return Number(a ?? 0) * 86400 + Number(s ?? 0) * 3600 + Number(i ?? 0) * 60 + Number(o ?? 0);
}
function qe(e, t) {
  return new Map((e ?? []).map((n) => [P(n[t]), n]));
}
function J(e) {
  return Array.isArray(e) ? e.filter((t) => t && typeof t == "object") : [];
}
function Nt(e) {
  return e.length === 0 ? 0 : e.reduce((t, n) => t + n, 0) / e.length;
}
function ke(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function P(e) {
  return typeof e == "string" ? e : "";
}
const wa = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: Ht,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  documents: [la],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: ua,
  // The Quests tab of the server's Statistics space (SDK 1.23).
  stats: { label: { en: "Quests", fr: "Quêtes" }, component: gn }
}, Ca = { ...wa, sdk: "1.23.0" };
export {
  Ca as default
};
