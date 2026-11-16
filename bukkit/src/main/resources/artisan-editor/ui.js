import { createModuleI18n as ct, fieldText as dt, newTextKey as K, textValue as R, injectModuleStyles as ut, useProject as pt, useContentLang as mt, SortableList as ge, Button as U, ConditionsEditor as ft, updateDocument as ht, selectDocumentItem as yt, projectLangs as Me, LocalizedField as Pe, MiniMessageInput as He, textValues as Ke, McText as Z, useUiLang as Ge, useOptionList as gt, ActionChainEditor as vt, mcWrap as bt, ItemInput as qt, MaterialInput as xt, SDK_VERSION as kt } from "@artisan/editor-sdk";
import { jsx as r, jsxs as f, Fragment as H } from "react/jsx-runtime";
import { useState as L, useEffect as ve, useRef as wt } from "react";
const Qe = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
}, Nt = /^\d+$/;
function ce(e, t, n) {
  const i = String(n).padStart(2, "0");
  return e === "fr" ? n === 0 ? `${t} h` : `${t} h ${i}` : `${String(t).padStart(2, "0")}:${i}`;
}
function $(e, t, n) {
  return Nt.test(e) && Number(e) >= t && Number(e) <= n;
}
function de(e) {
  return e.trim().split(/\s+/).length === 5;
}
function _t(e, t) {
  const n = t === "fr", i = e.trim().split(/\s+/);
  if (i.length !== 5) return null;
  const [a, o, s, l, c] = i;
  if (l !== "*") return null;
  const d = /^\*\/(\d+)$/;
  if (s === "*" && c === "*") {
    if ($(a, 0, 59) && $(o, 0, 23))
      return n ? `tous les jours à ${ce(t, +o, +a)}` : `every day at ${ce(t, +o, +a)}`;
    const g = d.exec(o);
    if ($(a, 0, 59) && g)
      return n ? `toutes les ${g[1]} h, à la minute ${a}` : `every ${g[1]} hours, at minute ${a}`;
    if ($(a, 0, 59) && o === "*")
      return n ? `toutes les heures, à la minute ${a}` : `every hour, at minute ${a}`;
    const x = d.exec(a);
    return x && o === "*" ? n ? `toutes les ${x[1]} minutes` : `every ${x[1]} minutes` : null;
  }
  if (!$(a, 0, 59) || !$(o, 0, 23)) return null;
  const p = ce(t, +o, +a);
  if (s === "*" && $(c, 0, 7)) {
    const g = Qe[n ? "fr" : "en"][Number(c) % 7];
    return n ? `chaque ${g} à ${p}` : `every ${g} at ${p}`;
  }
  return c === "*" && $(s, 1, 31) ? n ? `le ${s === "1" ? "1er" : s} de chaque mois à ${p}` : `on day ${s} of each month at ${p}` : null;
}
function z(e, t, n) {
  const i = /* @__PURE__ */ new Set();
  for (const a of e.split(",")) {
    const o = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(a);
    if (!o) return null;
    const s = o[4] ? Number(o[4]) : 1, l = o[1] === "*" ? t : Number(o[2]), c = o[1] === "*" ? n : o[3] ? Number(o[3]) : o[4] ? n : l;
    if (s < 1 || l < t || c > n || l > c) return null;
    for (let d = l; d <= c; d += s) i.add(d);
  }
  return i;
}
function jt(e, t) {
  const n = e.trim().split(/\s+/);
  if (n.length !== 5) return null;
  const i = z(n[0], 0, 59), a = z(n[1], 0, 23), o = z(n[2], 1, 31), s = z(n[3], 1, 12), l = z(n[4], 0, 7);
  if (!i || !a || !o || !s || !l) return null;
  l.has(7) && l.add(0);
  const c = n[2] === "*", d = n[4] === "*", p = (h) => c && d ? !0 : c ? l.has(h.getDay()) : d ? o.has(h.getDate()) : o.has(h.getDate()) || l.has(h.getDay()), g = new Date(t.getTime());
  g.setSeconds(0, 0), g.setMinutes(g.getMinutes() + 1);
  const x = t.getTime() + 366 * 24 * 3600 * 1e3;
  for (; g.getTime() <= x; ) {
    if (!s.has(g.getMonth() + 1) || !p(g)) {
      g.setDate(g.getDate() + 1), g.setHours(0, 0, 0, 0);
      continue;
    }
    if (!a.has(g.getHours())) {
      g.setHours(g.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (i.has(g.getMinutes())) return g;
    g.setMinutes(g.getMinutes() + 1);
  }
  return null;
}
function Ct(e) {
  const t = e.trim().split(/\s+/);
  if (e.trim() === "") return { kind: "never" };
  if (t.length !== 5) return { kind: "custom" };
  const [n, i, a, o, s] = t;
  if (o !== "*" || !$(n, 0, 59) || !$(i, 0, 23)) return { kind: "custom" };
  const l = `${i.padStart(2, "0")}:${n.padStart(2, "0")}`;
  return a === "*" && s === "*" ? { kind: "daily", time: l } : a === "*" && $(s, 0, 7) ? { kind: "weekly", time: l, day: Number(s) % 7 } : s === "*" && $(a, 1, 31) ? { kind: "monthly", time: l, day: Number(a) } : { kind: "custom" };
}
function Et(e) {
  if (e.kind === "never") return "";
  if (e.kind === "custom") return null;
  const t = /^(\d{1,2}):(\d{2})$/.exec(e.time), n = t ? Math.min(23, Number(t[1])) : 4, i = t ? Math.min(59, Number(t[2])) : 0;
  return e.kind === "daily" ? `${i} ${n} * * *` : e.kind === "weekly" ? `${i} ${n} * * ${e.day}` : `${i} ${n} ${Math.min(31, Math.max(1, e.day))} * *`;
}
function At(e) {
  return Qe[e === "fr" ? "fr" : "en"];
}
const F = {
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
  givenBy: "Given by {{npc}}"
}, ae = {
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
  givenBy: "Donnée par {{npc}}"
}, je = { en: F.kindLabel, fr: ae.kindLabel }, Tt = { en: F.collection, fr: ae.collection }, St = ct({ en: F, fr: ae });
function Ue(e) {
  const t = e === "fr" ? ae : F;
  return (n, i) => {
    const a = t[n] ?? F[n] ?? n;
    return i ? a.replace(/\{\{(\w+)\}\}/g, (o, s) => String(i[s] ?? o)) : a;
  };
}
const re = "quest_group", Be = "quest_groups", Ot = "quests", be = "quest_group/v1";
function $t(e) {
  const t = { ...T(e) };
  return typeof t.strategy == "string" && t.strategy.toLowerCase() === "ladder" && (t.strategy = "sequential"), t;
}
const me = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function V(e = Date.now()) {
  let t = "", n = e;
  for (let o = 0; o < 10; o++)
    t = me[n % 32] + t, n = Math.floor(n / 32);
  const i = new Uint8Array(16);
  crypto.getRandomValues(i);
  let a = "";
  for (let o = 0; o < 16; o++) a += me[i[o] % 32];
  return t + a;
}
function J(e, t) {
  const n = new Set(t);
  if (!n.has(e)) return e;
  for (let i = 2; ; i++) if (!n.has(`${e}_${i}`)) return `${e}_${i}`;
}
function Lt(e, t) {
  const n = new Set(t), i = new Uint8Array(4);
  for (; ; ) {
    crypto.getRandomValues(i);
    const a = Array.from(i, (s) => me[s % 32].toLowerCase()).join(""), o = `${oe(e)}_${a}`;
    if (!n.has(o)) return o;
  }
}
function ze(e) {
  return e.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
function oe(e) {
  return e.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "quest";
}
function T(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? { ...e } : {};
}
function ue(e) {
  return Array.isArray(e) ? e : [];
}
function O(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? String(e) : "";
}
function W(e, ...t) {
  const n = { ...e };
  for (const i of t) delete n[i];
  return n;
}
function Rt(e, t) {
  const n = {}, i = [];
  function a(c) {
    if (c && typeof c == "object" && !Array.isArray(c)) {
      const g = K(), x = {};
      for (const [h, y] of Object.entries(c)) x[h] = O(y);
      return n[g] = x, { key: g };
    }
    const d = typeof c == "string" ? /^\{i18n:(.+)\}$/.exec(c) : null;
    if (d) {
      const g = t.translations?.[d[1]];
      return g && (n[d[1]] = { ...g }), { key: d[1] };
    }
    const p = K();
    return n[p] = c == null || c === "" ? {} : { [t.lang]: O(c) }, { key: p };
  }
  const o = Object.entries(T(e.tiers)).map(([c, d]) => {
    const p = T(d);
    return { key: c, title: a(p.title), rest: W(p, "title") };
  }), s = ue(e.quests).map((c, d) => {
    const p = T(c), g = ue(p.stages).map((x, h) => {
      const y = T(x), u = O(y.flow).toLowerCase();
      return {
        key: O(y.key) || `stage_${h + 1}`,
        title: a(y.title),
        flow: u === "parallel" || u === "sequential" ? u : "",
        objectives: ue(y.objectives).map((m, q) => {
          const k = T(m);
          return {
            key: O(k.key) || `objective_${q + 1}`,
            type: O(k.type),
            params: W(k, "key", "type")
          };
        }),
        rest: W(y, "key", "title", "flow", "objectives")
      };
    });
    return {
      key: O(p.key) || `quest_${d + 1}`,
      uid: O(p.uid) || V(),
      tier: O(p.tier),
      title: a(p.title),
      description: a(p.description),
      duration: O(p.duration),
      stages: g,
      rest: It(p)
    };
  }), l = {
    id: O(e.id),
    projectId: t.projectId,
    uid: O(e.uid) || V(),
    title: a(e.title),
    description: a(e.description),
    actorType: O(e.actor_type) || "player",
    reset: T(e.reset),
    limits: T(e.limits),
    rotation: T(e.rotation),
    distribution: $t(e.distribution),
    tiers: o,
    quests: s,
    rest: We(W(
      T(e),
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
  return e.schema !== void 0 && e.schema !== be && i.push(`schema: ${String(e.schema)}`), { doc: l, i18nKeys: n, unsupported: i };
}
function We(e) {
  return e.on !== void 0 && (e.actions == null && (e.actions = e.on), delete e.on), e;
}
function It(e) {
  const t = We(
    W(e, "key", "uid", "tier", "title", "description", "duration", "stages", "reward_display")
  );
  if (t.rewards !== void 0) {
    const n = T(t.actions);
    n.complete == null && (t.actions = { ...n, complete: t.rewards }), delete t.rewards;
  }
  return t;
}
function Dt(e) {
  return typeof e == "string" ? e === "" : Object.values(e).every((t) => t === "");
}
function D(e) {
  const t = {};
  for (const [n, i] of Object.entries(e))
    i == null || i === "" || Array.isArray(i) && i.length === 0 || typeof i == "object" && !Array.isArray(i) && Object.keys(i).length === 0 || (t[n] = i);
  return t;
}
const Mt = [
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
function Pt(e, t) {
  const n = (d) => dt(t, d.key), i = (d) => {
    const p = n(d);
    return Dt(p) ? void 0 : p;
  }, a = {};
  for (const d of e.tiers) a[d.key] = { ...d.rest, title: n(d.title) };
  const o = e.quests.map(
    (d) => D({
      key: d.key,
      uid: d.uid,
      tier: d.tier,
      title: n(d.title),
      description: i(d.description),
      duration: d.duration,
      ...d.rest,
      stages: d.stages.map(
        (p) => D({
          key: p.key,
          title: i(p.title),
          flow: p.flow,
          ...p.rest,
          objectives: p.objectives.map((g) => ({ key: g.key, type: g.type, ...g.params }))
        })
      )
    })
  ), s = {
    ...e.rest,
    id: e.id,
    schema: be,
    uid: e.uid,
    title: n(e.title),
    description: i(e.description),
    actor_type: e.actorType,
    reset: D(e.reset),
    limits: D(e.limits),
    rotation: D(e.rotation),
    distribution: D(e.distribution),
    tiers: a,
    quests: o
  }, l = {};
  for (const d of Mt) d in s && (l[d] = s[d]);
  for (const d of Object.keys(s)) d in l || (l[d] = s[d]);
  const c = D(l);
  return c.quests = o, c;
}
function* Ht(e) {
  const t = `${Be}.${e.id}`;
  yield { lText: e.title, key: `${t}.title`, path: "title", kind: "quest_group.title" }, yield {
    lText: e.description,
    key: `${t}.description`,
    path: "description",
    kind: "quest_group.description"
  };
  for (const i of e.tiers)
    yield {
      lText: i.title,
      key: `${t}.tiers.${i.key}.title`,
      path: `tiers.${i.key}.title`,
      kind: "quest_group.tier"
    };
  const n = /* @__PURE__ */ new Set();
  for (let i = 0; i < e.quests.length; i++) {
    const a = e.quests[i], o = n.has(a.uid) ? `${a.uid}_${i}` : a.uid;
    n.add(a.uid);
    const s = `${t}.quests.${o}`;
    yield {
      lText: a.title,
      key: `${s}.title`,
      path: `quests[${i}].title`,
      kind: "quest.title"
    }, yield {
      lText: a.description,
      key: `${s}.description`,
      path: `quests[${i}].description`,
      kind: "quest.description"
    };
    const l = /* @__PURE__ */ new Set();
    for (let c = 0; c < a.stages.length; c++) {
      const d = a.stages[c], p = l.has(d.key) ? `${d.key}_${c}` : d.key;
      l.add(d.key), yield {
        lText: d.title,
        key: `${s}.stages.${p}.title`,
        path: `quests[${i}].stages[${c}].title`,
        kind: "quest.stage"
      };
    }
  }
}
function Ce(e) {
  return !!e && typeof e == "object" && !Array.isArray(e) && "type" in e;
}
function Kt(e) {
  const t = Array.isArray(e) ? e : e == null ? [] : [e];
  return {
    chain: t.filter((n) => !Ce(n)),
    legacy: t.filter(Ce)
  };
}
function Ee(e, t) {
  const n = [...e, ...t];
  return n.length ? n : void 0;
}
function Gt(e) {
  const t = String(e.type), n = e.command ?? e.message ?? e.title ?? e.material;
  return typeof n == "string" ? `${t} · ${n}` : t;
}
const Qt = [
  "distribution",
  "actor_load",
  "quest_start",
  "objective_progress",
  "objective_complete",
  "quest_complete",
  "period_complete"
], Ut = ["start", "objective_progress", "objective_complete", "complete"], M = { name: "amount", kind: "int", required: !0 }, qe = [
  { type: "block_break", icon: "⛏", params: [{ name: "material", kind: "material" }, M] },
  {
    type: "craft_item",
    icon: "⚒",
    params: [{ name: "item", kind: "item", legacy: "material" }, M]
  },
  {
    type: "harvest_crop",
    icon: "🌾",
    params: [{ name: "crop", kind: "material", required: !0 }, M]
  },
  {
    type: "fishing",
    icon: "🎣",
    params: [{ name: "item", kind: "item", legacy: "fish_type" }, M]
  },
  {
    type: "deliver_item",
    icon: "📦",
    params: [
      { name: "item", kind: "item", legacy: "material" },
      M,
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
  { type: "kill_entity", icon: "⚔", params: [{ name: "entity_type", kind: "entity" }, M] },
  { type: "breed_animal", icon: "♥", params: [{ name: "entity_type", kind: "entity" }, M] },
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
function B(e) {
  return qe.find((t) => t.type === e);
}
function Fe(e) {
  const t = {};
  for (const n of B(e)?.params ?? [])
    n.kind === "int" && (t[n.name] = 1);
  return t;
}
function se(e) {
  return e.amount ?? e.distance;
}
function xe(e, t) {
  const n = e[t.name];
  if (n && typeof n == "object" && !Array.isArray(n)) return n;
  const i = t.legacy ? e[t.legacy] : void 0;
  return typeof i == "string" && i !== "" ? { material: i } : {};
}
function Bt(e, t, n, i) {
  t.legacy && delete e[t.legacy];
  const a = !n || Object.keys(n).length === 0;
  a ? delete e[t.name] : e[t.name] = n, a || i === void 0 ? delete e.match : e.match = i;
}
function Ve(e) {
  const t = e.title;
  if (typeof t == "string" && t.trim() !== "") return t.replace(/<[^>]*>/g, "");
  const n = e.material ?? e.item;
  return typeof n == "string" ? n : "";
}
function ke(e, t) {
  const n = B(e);
  return n ? n.params.filter((i) => i.kind !== "int" && i.kind !== "line").map((i) => i.kind === "item" ? Ve(xe(t, i)) : t[i.name]).filter((i) => typeof i == "string" && i !== "").join(" = ") : Object.keys(t).map((i) => t[i]).filter((i) => typeof i == "string" && i !== "").join(" = ");
}
function Je(e, t) {
  return (B(e)?.params ?? []).filter((n) => n.required && (t[n.name] === void 0 || t[n.name] === "")).map((n) => n.name);
}
const zt = [
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
], Wt = "#f59e0b";
function te(e, t) {
  return B(t) ? e(`objective.${t}`) : t;
}
function ne(e, t) {
  const n = ke(t.type, t.params), i = se(t.params);
  return `${te(e, t.type)}${n ? ` · ${n}` : ""}${i !== void 0 ? ` · 0/${String(i)}` : ""}`;
}
function G(e) {
  return e.replace(/<[^<>]*>/g, "").trim();
}
function we(e) {
  const t = e.distribution?.strategy;
  return typeof t == "string" && ["sequential", "ladder"].includes(t.toLowerCase());
}
function Ft(e, t, n) {
  const i = Ue(n), a = we(e);
  return e.quests.map((o, s) => {
    const l = R(t, o.title.key, n);
    return {
      id: o.uid,
      label: G(l) || o.key,
      detail: o.tier || void 0,
      caption: Vt(i, o),
      marker: a ? String(s + 1) : void 0,
      hover: {
        title: l || o.key,
        text: R(t, o.description.key, n) || void 0,
        lines: Jt(i, o, t, n)
      }
    };
  });
}
function Vt(e, t) {
  const n = t.stages.flatMap((o) => o.objectives), i = n[0];
  if (!i) return;
  const a = n.length - 1;
  return a > 0 ? `${ne(e, i)} +${String(a)}` : ne(e, i);
}
function Jt(e, t, n, i) {
  const a = t.stages.length > 1;
  return t.stages.flatMap(
    (o, s) => o.objectives.map((l) => {
      const c = ne(e, l);
      return a ? `<gray>${G(R(n, o.title.key, i)) || e("stage", { n: s + 1 })} ·</gray> ${c}` : c;
    })
  );
}
function Yt(e, t) {
  const n = Ue(t), i = typeof e.distribution?.strategy == "string" ? e.distribution.strategy.toLowerCase() : "", a = e.quests.length, o = a === 1 ? n("questCountOne") : n("questCount", { count: a }), s = i === "sequential" || i === "ladder" ? "ordered" : i;
  return ["none", "ordered", "random"].includes(s) ? `${o} · ${n(`strategy.${s}`).toLowerCase()}` : o;
}
function Zt(e, t) {
  const n = se(t.params), i = ke(t.type, t.params), a = n !== void 0 ? String(n) : "", o = a && i ? `${a} × ${i}` : a || i;
  return o ? `${te(e, t.type)} · ${o}` : te(e, t.type);
}
function Ye(e) {
  return e.stages.flatMap((t) => t.objectives);
}
function Xt(e) {
  const t = Ye(e), n = t.map((i) => i.key);
  return t.some(
    (i) => Je(i.type, i.params).length > 0 || n.indexOf(i.key) !== n.lastIndexOf(i.key)
  );
}
function en(e) {
  return Object.values(T(e.rest.actions)).reduce(
    (t, n) => t + (Array.isArray(n) ? n.length : n == null ? 0 : 1),
    0
  );
}
function Ze(e) {
  const t = e.completed_when;
  return Array.isArray(t) ? t : t ? [t] : [];
}
function Ae(e) {
  const t = e.map((n) => {
    if (typeof n == "string") return n;
    const i = n && typeof n == "object" ? n.expression : void 0;
    return typeof i == "string" ? i : null;
  });
  return t.every((n) => n !== null) ? t.join(" · ") : null;
}
function tn(e, t, n) {
  const i = structuredClone(e);
  i.uid = V(), i.key = J(`${e.key}_copy`, t), i.title = n(e.title), i.description = n(e.description);
  for (const [a, o] of i.stages.entries()) o.title = n(e.stages[a].title);
  return i;
}
const Te = ["player", "global"], pe = /* @__PURE__ */ new Set();
function nn(e, t, n) {
  if (n && n.length > 0)
    return t && !n.includes(t) ? [...n, t] : [...n];
  const i = e?.documents?.[re];
  for (const a of Array.isArray(i) ? i : []) {
    const o = a.actorType;
    typeof o == "string" && o && pe.add(o);
  }
  return t && pe.add(t), [...Te, ...[...pe].filter((a) => !Te.includes(a)).sort()];
}
function Xe(e, t) {
  if (typeof e == "string") return e === "" ? {} : { [t]: e };
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const n = {};
  for (const [i, a] of Object.entries(e))
    typeof a == "string" && a !== "" && (n[i] = a);
  return n;
}
function an(e, t, n, i) {
  const a = Xe(e, t);
  return i === "" ? delete a[n] : a[n] = i, Object.keys(a).length > 0 ? a : void 0;
}
const rn = `
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
`, on = /^(\d+|(\d+[dhms])+)$/, sn = ["actor_load", "period_reset", "quest_complete"], ln = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
function cn(e, t) {
  const n = jt(e, /* @__PURE__ */ new Date());
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
function dn({ projectId: e, documentId: t, document: n, item: i }) {
  ut("msquests", rn);
  const a = n, o = pt(e), s = mt(), l = St(), [c, d] = L(i ?? null);
  ve(() => {
    d(i ?? null);
  }, [i]);
  const p = (y) => {
    d(y), yt({ documentId: t, item: y });
  }, x = { projectId: e, project: o, lang: s, t: l, edit: (y, u) => {
    const m = structuredClone(a);
    y(m), ht({ projectId: e, kind: re, id: t, doc: m, texts: u });
  } }, h = c ? a.quests.findIndex((y) => y.uid === c) : -1;
  return /* @__PURE__ */ r("div", { className: "aq", children: h >= 0 ? /* @__PURE__ */ r(xn, { ctx: x, group: a, index: h, onLeave: () => p(null) }, c) : /* @__PURE__ */ r(hn, { ctx: x, group: a, onOpen: p }) });
}
function Y({ open: e }) {
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
function un() {
  return /* @__PURE__ */ f("svg", { "aria-hidden": "true", width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: [
    /* @__PURE__ */ r("circle", { cx: "3", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "8", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "13", cy: "8", r: "1.5" })
  ] });
}
function E({ tone: e, title: t, children: n }) {
  return /* @__PURE__ */ r("span", { className: `aq-chip${e ? ` is-${e}` : ""}`, title: t, children: n });
}
function ie({
  label: e,
  value: t,
  options: n,
  onChange: i
}) {
  return /* @__PURE__ */ r("div", { className: "aq-seg", role: "radiogroup", "aria-label": e, children: n.map((a) => /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      role: "radio",
      "aria-checked": t === a.value,
      className: `aq-opt${t === a.value ? " is-on" : ""}`,
      onClick: () => i(a.value),
      children: a.label
    },
    a.value
  )) });
}
function S({
  label: e,
  children: t,
  hint: n,
  title: i
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the control is the child
    /* @__PURE__ */ f("label", { className: "aq-field", title: i, children: [
      /* @__PURE__ */ r("span", { className: "field-label", children: e }),
      t,
      n
    ] })
  );
}
function Q({
  ctx: e,
  label: t,
  node: n,
  multiline: i,
  rows: a,
  bare: o,
  placeholder: s
}) {
  const l = Me(e.project);
  return /* @__PURE__ */ r(
    Pe,
    {
      className: "aq-field",
      label: t,
      langs: l,
      activeLang: e.lang,
      defaultLang: l[0] ?? e.lang,
      values: Ke(e.project, n.key),
      onChange: (c, d) => e.edit(() => {
      }, [{ key: n.key, lang: c, value: d }]),
      inline: o,
      renderEditor: (c) => /* @__PURE__ */ r(
        He,
        {
          value: c.value,
          onChange: c.onChange,
          placeholder: c.fallback ?? s,
          multiline: i,
          rows: i ? a : void 0,
          "aria-label": c.label
        }
      )
    }
  );
}
function et({
  ctx: e,
  label: t,
  value: n,
  onChange: i
}) {
  const a = Me(e.project), o = a[0] ?? e.lang;
  return /* @__PURE__ */ r("span", { title: e.t("lineHint"), className: "aq-grow", children: /* @__PURE__ */ r(
    Pe,
    {
      className: "aq-field",
      label: t,
      langs: a,
      activeLang: e.lang,
      defaultLang: o,
      values: Xe(n, o),
      onChange: (s, l) => i(an(n, o, s, l)),
      renderEditor: (s) => /* @__PURE__ */ r(
        He,
        {
          value: s.value,
          onChange: s.onChange,
          placeholder: s.fallback,
          "aria-label": s.label
        }
      )
    }
  ) });
}
function pn(e) {
  return typeof e == "number" ? String(e) : typeof e == "string" ? e : "";
}
function P({
  label: e,
  value: t,
  onChange: n,
  placeholder: i
}) {
  return /* @__PURE__ */ r(S, { label: e, children: /* @__PURE__ */ r(
    "input",
    {
      className: "input",
      type: "number",
      min: 0,
      step: 1,
      value: pn(t),
      placeholder: i,
      onChange: (a) => {
        const o = a.target.value.trim();
        n(o === "" ? void 0 : Math.max(0, Math.trunc(Number(o))));
      }
    }
  ) });
}
function mn(e) {
  const t = tt(e);
  return t !== "" && t !== "none";
}
function tt(e) {
  return typeof e.strategy == "string" ? e.strategy.toLowerCase() : "";
}
function _(e, t, n) {
  n === void 0 || n === "" ? delete e[t] : e[t] = n;
}
function Ne(e, t, n) {
  if (n < 0 || n >= e.length) return;
  const [i] = e.splice(t, 1);
  e.splice(n, 0, i);
}
function le({
  label: e,
  onClick: t,
  disabled: n,
  expanded: i,
  children: a
}) {
  return /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      className: "aq-icon-btn",
      title: e,
      "aria-label": e,
      "aria-expanded": i,
      onClick: t,
      disabled: n,
      children: a
    }
  );
}
function _e({
  t: e,
  label: t,
  sure: n,
  onRemove: i
}) {
  const [a, o] = L(!1);
  return a ? /* @__PURE__ */ f("span", { className: "aq-confirm", children: [
    /* @__PURE__ */ r(U, { size: "sm", variant: "ghost", onClick: () => o(!1), children: e("cancel") }),
    /* @__PURE__ */ r("button", { type: "button", className: "aq-danger", onClick: i, children: e("remove") })
  ] }) : /* @__PURE__ */ r(le, { label: t, onClick: () => n ? i() : o(!0), children: "×" });
}
function fn({
  label: e,
  children: t
}) {
  const [n, i] = L(!1), a = wt(null);
  return ve(() => {
    if (!n) return;
    const o = (l) => {
      a.current?.contains(l.target) || i(!1);
    }, s = (l) => {
      l.key === "Escape" && (l.preventDefault(), i(!1));
    };
    return window.addEventListener("mousedown", o), window.addEventListener("keydown", s, !0), () => {
      window.removeEventListener("mousedown", o), window.removeEventListener("keydown", s, !0);
    };
  }, [n]), /* @__PURE__ */ f("div", { className: "aq-menu-anchor", ref: a, children: [
    /* @__PURE__ */ r(le, { label: e, expanded: n, onClick: () => i(!n), children: /* @__PURE__ */ r(un, {}) }),
    n && /* @__PURE__ */ r("div", { className: "aq-menu", role: "menu", children: t(() => i(!1)) })
  ] });
}
function nt(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n, i) => {
    const a = t.has(n) ? `${n}#${i}` : n;
    return t.add(n), a;
  });
}
function hn({
  ctx: e,
  group: t,
  onOpen: n
}) {
  const { t: i, edit: a, project: o, lang: s } = e, [l, c] = L(t.quests.length === 0), [d, p] = L(null), g = we(t), x = Object.keys(t.rest).filter((u) => u !== "actions"), h = () => {
    const u = K(), m = V();
    a(
      (q) => {
        q.quests.push({
          key: J(
            "quest",
            q.quests.map((k) => k.key)
          ),
          uid: m,
          tier: "",
          title: { key: u },
          description: { key: K() },
          duration: "",
          stages: [rt(1)],
          rest: {}
        });
      },
      [{ key: u, lang: s, value: i("newQuestTitle") }]
    ), n(m);
  }, y = (u) => {
    const m = [], q = (k) => {
      const N = K();
      for (const [j, C] of Object.entries(Ke(o, k.key)))
        C !== "" && m.push({ key: N, lang: j, value: C });
      return { key: N };
    };
    a((k) => {
      k.quests.splice(
        u + 1,
        0,
        tn(
          k.quests[u],
          k.quests.map((N) => N.key),
          q
        )
      );
    }, m);
  };
  return /* @__PURE__ */ f(H, { children: [
    /* @__PURE__ */ f("section", { className: "aq-card", children: [
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "aq-fold-head",
          "aria-expanded": l,
          onClick: () => c(!l),
          children: [
            /* @__PURE__ */ r(Y, { open: l }),
            /* @__PURE__ */ r("span", { className: "aq-h", children: i("groupSettings") }),
            !l && /* @__PURE__ */ r(gn, { ctx: e, group: t })
          ]
        }
      ),
      l && /* @__PURE__ */ r(vn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-card", children: [
      /* @__PURE__ */ f("div", { className: "aq-card-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: i("quests") }),
        /* @__PURE__ */ r("span", { className: "aq-count", children: t.quests.length }),
        /* @__PURE__ */ r("span", { className: "aq-grow" }),
        /* @__PURE__ */ f(U, { size: "sm", variant: "primary", onClick: h, children: [
          "+ ",
          i("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: i("noQuests") }),
      /* @__PURE__ */ r(
        ge,
        {
          ids: t.quests.map((u) => u.uid),
          onMove: (u, m) => a((q) => Ne(q.quests, u, m)),
          className: "aq-quests",
          itemClassName: "aq-quest",
          children: (u, m) => {
            const q = t.quests[u], k = G(R(o, q.title.key, s)) || q.key, N = Ye(q), j = Ze(q.rest), C = t.tiers.find((v) => v.key === q.tier), b = en(q);
            return /* @__PURE__ */ f(H, { children: [
              m,
              g && /* @__PURE__ */ r("span", { className: "aq-n", children: u + 1 }),
              /* @__PURE__ */ f("button", { type: "button", className: "aq-quest-main", onClick: () => n(q.uid), children: [
                /* @__PURE__ */ r("span", { className: "aq-quest-title", children: k }),
                /* @__PURE__ */ r("span", { className: "aq-quest-sub", children: N.length === 0 ? i("noObjectivesShort") : N.map((v) => Zt(i, v)).join("  ·  ") })
              ] }),
              d === q.uid ? /* @__PURE__ */ f("span", { className: "aq-confirm", children: [
                /* @__PURE__ */ r("span", { children: i("removeConfirm", { name: k }) }),
                /* @__PURE__ */ r(U, { size: "sm", variant: "ghost", onClick: () => p(null), children: i("cancel") }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "aq-danger",
                    onClick: () => {
                      p(null), a((v) => {
                        v.quests.splice(u, 1);
                      });
                    },
                    children: i("remove")
                  }
                )
              ] }) : /* @__PURE__ */ f(H, { children: [
                /* @__PURE__ */ f("span", { className: "aq-chips", children: [
                  Xt(q) && /* @__PURE__ */ r(E, { tone: "warn", children: i("toComplete") }),
                  g && j.length > 0 && /* @__PURE__ */ f(E, { title: i("completedWhenHint"), children: [
                    i("completedWhen"),
                    " ",
                    Ae(j) !== null ? /* @__PURE__ */ r("span", { className: "aq-mono", children: Ae(j) }) : i("conditionCount", { count: j.length })
                  ] }),
                  q.tier && /* @__PURE__ */ r(E, { children: C && G(R(o, C.title.key, s)) || q.tier }),
                  q.duration && /* @__PURE__ */ r(E, { children: q.duration }),
                  b > 0 && /* @__PURE__ */ r(E, { children: b === 1 ? i("actionCountOne") : i("actionCount", { count: b }) })
                ] }),
                /* @__PURE__ */ r(fn, { label: i("moreActions"), children: (v) => /* @__PURE__ */ f(H, { children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      onClick: () => {
                        v(), y(u);
                      },
                      children: i("duplicate")
                    }
                  ),
                  /* @__PURE__ */ f(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      className: "is-danger",
                      onClick: () => {
                        v(), p(q.uid);
                      },
                      children: [
                        i("remove"),
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
      x.length > 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: i("kept", { fields: x.join(", ") }) })
    ] })
  ] });
}
function it(e, t) {
  return t === "player" || t === "global" || t === "guild" ? e(`actor.${t}`) : t;
}
const yn = "quests:actor_types";
function fe(e) {
  const t = tt(e);
  return t === "sequential" || t === "ladder" ? "ordered" : t === "none" || t === "random" ? t : "";
}
function gn({ ctx: e, group: t }) {
  const { t: n } = e, i = Ge(), a = typeof t.reset.cron == "string" ? t.reset.cron : "", o = fe(t.distribution), s = Object.keys(T(t.rest.actions)).length, l = a ? _t(a, i) ?? a : n("noReset");
  return /* @__PURE__ */ f("span", { className: "aq-chips", children: [
    /* @__PURE__ */ r(E, { children: it(n, t.actorType) }),
    o && /* @__PURE__ */ r(E, { children: n(`strategy.${o}`) }),
    /* @__PURE__ */ r(E, { children: l.charAt(0).toUpperCase() + l.slice(1) }),
    t.tiers.length > 0 && /* @__PURE__ */ r(E, { children: n("tierCount", { count: t.tiers.length }) }),
    s > 0 && /* @__PURE__ */ r(E, { children: n("eventCount", { count: s }) })
  ] });
}
function vn({ ctx: e, group: t }) {
  const { t: n, edit: i, project: a, lang: o } = e, s = fe(t.distribution), l = s === "ordered", c = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], d = t.distribution.tiers ?? {}, p = gt(yn)?.map((h) => h.value), g = nn(a, t.actorType, p), x = !!p?.length && !!t.actorType && !p.includes(t.actorType);
  return /* @__PURE__ */ f("div", { className: "aq-settings", children: [
    /* @__PURE__ */ f("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("identity") }),
      /* @__PURE__ */ r(Q, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ r(Q, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ f("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("actorType") }),
        /* @__PURE__ */ r(
          ie,
          {
            label: n("actorType"),
            value: t.actorType,
            options: g.map((h) => ({ value: h, label: it(n, h) })),
            onChange: (h) => i((y) => {
              y.actorType = h;
            })
          }
        ),
        x && /* @__PURE__ */ r("span", { className: "aq-warn", children: n("actorUnknown", { type: t.actorType }) })
      ] })
    ] }),
    /* @__PURE__ */ f("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("distribution") }),
      /* @__PURE__ */ f("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("strategy") }),
        /* @__PURE__ */ r(
          ie,
          {
            label: n("strategy"),
            value: s,
            options: ["none", "ordered", "random"].map((h) => ({
              value: h,
              label: n(`strategy.${h}`)
            })),
            onChange: (h) => i((y) => {
              h === "ordered" && fe(y.distribution) === "ordered" || (y.distribution.strategy = h === "ordered" ? "sequential" : h);
            })
          }
        )
      ] }),
      !l && /* @__PURE__ */ f(H, { children: [
        /* @__PURE__ */ f("div", { className: "aq-row", children: [
          /* @__PURE__ */ r(
            P,
            {
              label: n("amount"),
              value: t.distribution.amount,
              onChange: (h) => i((y) => _(y.distribution, "amount", h))
            }
          ),
          /* @__PURE__ */ r(
            P,
            {
              label: n("maxActive"),
              value: t.limits.max_active,
              onChange: (h) => i((y) => _(y.limits, "max_active", h))
            }
          )
        ] }),
        /* @__PURE__ */ f("div", { className: "aq-field", children: [
          /* @__PURE__ */ r("span", { className: "field-label", children: n("triggers") }),
          sn.map((h) => /* @__PURE__ */ f("label", { className: "aq-check", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: c.includes(h),
                onChange: (y) => i((u) => {
                  const m = Array.isArray(u.distribution.triggers) ? u.distribution.triggers : [], q = y.target.checked ? [...m, h] : m.filter((k) => k !== h);
                  _(u.distribution, "triggers", q.length ? q : void 0);
                })
              }
            ),
            n(`trigger.${h}`)
          ] }, h))
        ] })
      ] }),
      /* @__PURE__ */ r(
        P,
        {
          label: n("questsPerPeriod"),
          placeholder: n("noLimit"),
          value: t.limits.max_per_period,
          onChange: (h) => i((y) => _(y.limits, "max_per_period", h))
        }
      ),
      !l && /* @__PURE__ */ f("div", { className: "aq-row", children: [
        /* @__PURE__ */ f("label", { className: "aq-check", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: t.rotation.enabled === !0,
              onChange: (h) => i((y) => _(y.rotation, "enabled", h.target.checked ? !0 : void 0))
            }
          ),
          n("rotationEnabled")
        ] }),
        t.rotation.enabled === !0 ? /* @__PURE__ */ r(
          P,
          {
            label: n("rotationsPerPeriod"),
            placeholder: n("noLimit"),
            value: t.rotation.max_per_period,
            onChange: (h) => i((y) => _(y.rotation, "max_per_period", h))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ f("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("reset") }),
      /* @__PURE__ */ r(bn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ f("div", { className: "aq-block", children: [
      /* @__PURE__ */ f("div", { className: "aq-block-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("tiers") }),
        /* @__PURE__ */ f(
          U,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => i((h) => {
              h.tiers.push({
                key: J(
                  "tier",
                  h.tiers.map((y) => y.key)
                ),
                title: { key: K() },
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
      t.tiers.map((h, y) => /* @__PURE__ */ f("div", { className: "aq-tier", children: [
        /* @__PURE__ */ r(Q, { ctx: e, label: n("title"), node: h.title }),
        /* @__PURE__ */ r(S, { label: n("tierKey"), children: /* @__PURE__ */ r(
          "input",
          {
            className: "input aq-mono",
            defaultValue: h.key,
            onBlur: (u) => {
              const m = oe(u.target.value);
              m !== h.key && i((q) => {
                const k = J(
                  m,
                  q.tiers.map((j) => j.key)
                );
                q.tiers[y].key = k;
                for (const j of q.quests) j.tier === h.key && (j.tier = k);
                const N = q.distribution.tiers;
                N && h.key in N && (N[k] = N[h.key], delete N[h.key]);
              });
            }
          }
        ) }),
        !l && /* @__PURE__ */ r(
          P,
          {
            label: n("perTier"),
            value: d[h.key],
            onChange: (u) => i((m) => {
              const q = { ...m.distribution.tiers ?? {} };
              _(q, h.key, u), _(m.distribution, "tiers", Object.keys(q).length ? q : void 0);
            })
          }
        ),
        /* @__PURE__ */ r(
          _e,
          {
            t: n,
            label: n("remove"),
            sure: !t.quests.some((u) => u.tier === h.key),
            onRemove: () => i((u) => {
              u.tiers.splice(y, 1);
            })
          }
        )
      ] }, h.key)),
      t.tiers.length === 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: n("noTier") })
    ] }),
    /* @__PURE__ */ r("div", { className: "aq-block is-wide", children: /* @__PURE__ */ r(
      at,
      {
        ctx: e,
        title: n("hooks"),
        hooks: Qt,
        label: (h) => n(`hook.${h}`),
        value: t.rest.actions,
        onChange: (h, y) => i((u) => {
          const m = { ...T(u.rest.actions) };
          _(m, h, y), _(u.rest, "actions", Object.keys(m).length ? m : void 0);
        })
      },
      t.uid
    ) })
  ] });
}
function bn({ ctx: e, group: t }) {
  const { t: n, edit: i } = e, a = Ge(), o = typeof t.reset.cron == "string" ? t.reset.cron : "", s = Ct(o), [l, c] = L(!1), d = l && o !== "" ? { kind: "custom" } : s, p = typeof t.reset.timezone == "string" ? t.reset.timezone : "", g = o && de(o) ? cn(o, a) : null, x = (u) => {
    const m = Et(u);
    m !== null && i((q) => _(q.reset, "cron", m));
  }, h = "time" in d ? d.time : "04:00", y = (u) => {
    c(u === "custom"), u === "never" ? x({ kind: u }) : u === "daily" ? x({ kind: u, time: h }) : u === "weekly" ? x({ kind: u, time: h, day: 1 }) : u === "monthly" ? x({ kind: u, time: h, day: 1 }) : o === "" && i((m) => _(m.reset, "cron", "0 4 * * *"));
  };
  return /* @__PURE__ */ f(H, { children: [
    /* @__PURE__ */ r(
      ie,
      {
        label: n("reset"),
        value: d.kind,
        options: ["never", "daily", "weekly", "monthly", "custom"].map((u) => ({
          value: u,
          label: n(`reset.${u}`)
        })),
        onChange: y
      }
    ),
    d.kind !== "never" && /* @__PURE__ */ f("div", { className: "aq-row aq-reset", children: [
      d.kind === "weekly" && /* @__PURE__ */ r(S, { label: n("resetDay"), children: /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: d.day,
          onChange: (u) => x({ ...d, day: Number(u.target.value) }),
          children: [1, 2, 3, 4, 5, 6, 0].map((u) => /* @__PURE__ */ r("option", { value: u, children: At(a)[u] }, u))
        }
      ) }),
      d.kind === "monthly" && /* @__PURE__ */ r(
        P,
        {
          label: n("resetDayOfMonth"),
          value: d.day,
          onChange: (u) => x({ ...d, day: u ?? 1 })
        }
      ),
      d.kind === "custom" ? /* @__PURE__ */ r(
        S,
        {
          label: n("cron"),
          hint: de(o) ? void 0 : /* @__PURE__ */ r("span", { className: "aq-err", children: n("cronInvalid") }),
          children: /* @__PURE__ */ r(
            "input",
            {
              className: "input aq-mono",
              value: o,
              placeholder: "0 4 * * *",
              onChange: (u) => i((m) => _(m.reset, "cron", u.target.value))
            }
          )
        }
      ) : /* @__PURE__ */ r(S, { label: n("resetTime"), children: /* @__PURE__ */ r(
        "input",
        {
          className: "input",
          type: "time",
          value: d.time,
          onChange: (u) => u.target.value && x({ ...d, time: u.target.value })
        }
      ) })
    ] }),
    o && de(o) && (p || g) && /* @__PURE__ */ r("span", { className: "aq-ok", children: p && p !== ln ? p : g ? n("nextRun", { when: g }) : "" })
  ] });
}
function qn({
  ctx: e,
  value: t,
  onChange: n
}) {
  const { chain: i, legacy: a } = Kt(t);
  return /* @__PURE__ */ f("div", { className: "aq-chain", children: [
    /* @__PURE__ */ r(
      vt,
      {
        projectId: e.projectId,
        value: i,
        onChange: (o) => n(Ee(o, a))
      }
    ),
    a.length > 0 && /* @__PURE__ */ r("div", { className: "aq-legacy", title: e.t("legacySteps"), children: a.map((o, s) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
      /* @__PURE__ */ f("div", { className: "aq-legacy-row", children: [
        /* @__PURE__ */ r("code", { children: Gt(o) }),
        /* @__PURE__ */ r(
          le,
          {
            label: e.t("remove"),
            onClick: () => n(Ee(i, a.filter((l, c) => c !== s))),
            children: "×"
          }
        )
      ] }, s)
    )) })
  ] });
}
function at({
  ctx: e,
  title: t,
  hooks: n,
  label: i,
  value: a,
  onChange: o
}) {
  const { t: s } = e, l = T(a), [c, d] = L([]), [p, g] = L(null), x = n.filter((y) => l[y] != null || c.includes(y)), h = n.filter((y) => !x.includes(y));
  return /* @__PURE__ */ f(H, { children: [
    /* @__PURE__ */ f("div", { className: "aq-block-head", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: t }),
      h.length > 0 && /* @__PURE__ */ f(
        "select",
        {
          className: "select aq-event-add",
          "aria-label": s("addEvent"),
          value: "",
          onChange: (y) => {
            const u = h.find((m) => m === y.target.value);
            u && (d((m) => [...m, u]), g(u));
          },
          children: [
            /* @__PURE__ */ f("option", { value: "", children: [
              "+ ",
              s("addEvent")
            ] }),
            h.map((y) => /* @__PURE__ */ r("option", { value: y, children: i(y) }, y))
          ]
        }
      )
    ] }),
    x.map((y) => {
      const u = p === y, m = Array.isArray(l[y]) ? l[y].length : l[y] ? 1 : 0;
      return /* @__PURE__ */ f("div", { className: `aq-line${u ? " is-open" : ""}`, children: [
        /* @__PURE__ */ f("div", { className: "aq-line-head", children: [
          /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "aq-line-main",
              "aria-expanded": u,
              onClick: () => g(u ? null : y),
              children: [
                /* @__PURE__ */ r(Y, { open: u }),
                /* @__PURE__ */ r("span", { className: "aq-line-text", children: i(y) }),
                m > 0 && /* @__PURE__ */ r(E, { children: m === 1 ? s("actionCountOne") : s("actionCount", { count: m }) })
              ]
            }
          ),
          /* @__PURE__ */ r(
            _e,
            {
              t: s,
              label: s("removeEvent"),
              sure: m === 0,
              onRemove: () => {
                d((q) => q.filter((k) => k !== y)), o(y, void 0);
              }
            }
          )
        ] }),
        u && /* @__PURE__ */ r("div", { className: "aq-line-body", children: /* @__PURE__ */ r(qn, { ctx: e, value: l[y], onChange: (q) => o(y, q) }) })
      ] }, y);
    })
  ] });
}
function rt(e) {
  return {
    key: `stage_${e}`,
    title: { key: K() },
    flow: "parallel",
    objectives: [],
    rest: {}
  };
}
function xn({
  ctx: e,
  group: t,
  index: n,
  onLeave: i
}) {
  const { t: a, edit: o, project: s, lang: l } = e, c = t.quests[n], d = (b, v) => o((w) => b(w.quests[n]), v), p = t.quests.some((b, v) => v !== n && b.key === c.key), g = c.duration !== "" && !on.test(c.duration.replace(/\s/g, "").toLowerCase()), x = Object.keys(c.rest).filter(
    (b) => b !== "actions" && b !== "giver" && b !== "completed_when"
  ), h = we(t), y = c.rest.giver && typeof c.rest.giver == "object" ? c.rest.giver : {}, u = (b, v) => d((w) => {
    const A = { ...y };
    _(A, b, v.trim()), typeof A.npc == "string" && A.npc !== "" ? w.rest.giver = A : delete w.rest.giver;
  }), m = typeof y.npc == "string" ? y.npc : "", q = mn(t.distribution), k = t.tiers.find((b) => b.key === c.tier), [N, j] = L(!1), C = N || p || g;
  return ve(() => {
    const b = (v) => {
      v.key !== "Escape" || v.defaultPrevented || v.target?.closest("input, textarea, select, [contenteditable='true']") || window.document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]') || (v.preventDefault(), i());
    };
    return window.addEventListener("keydown", b, !0), () => window.removeEventListener("keydown", b, !0);
  }, [i]), /* @__PURE__ */ f("div", { className: "aq-quest-page", children: [
    /* @__PURE__ */ f("div", { className: "aq-quest-col", children: [
      /* @__PURE__ */ f("section", { className: "aq-card", children: [
        /* @__PURE__ */ f("div", { className: "aq-quest-head", children: [
          /* @__PURE__ */ r("div", { className: "aq-quest-name", children: /* @__PURE__ */ r(Q, { ctx: e, label: a("questName"), node: c.title }) }),
          /* @__PURE__ */ r(
            Q,
            {
              ctx: e,
              multiline: !0,
              rows: 2,
              label: a("questDescription"),
              node: c.description
            }
          )
        ] }),
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: "aq-fold-head is-inner",
            "aria-expanded": C,
            onClick: () => j(!C),
            children: [
              /* @__PURE__ */ r(Y, { open: C }),
              /* @__PURE__ */ r("span", { className: "aq-fold-title", children: a("questSettings") }),
              !C && /* @__PURE__ */ f("span", { className: "aq-chips", children: [
                c.tier && /* @__PURE__ */ r(E, { children: k && G(R(s, k.title.key, l)) || c.tier }),
                /* @__PURE__ */ r(E, { children: c.duration || a("noTimeLimit") }),
                m && /* @__PURE__ */ r(E, { children: a("givenBy", { npc: m }) }),
                /* @__PURE__ */ r(E, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: c.key }) })
              ] })
            ]
          }
        ),
        C && /* @__PURE__ */ f("div", { className: "aq-fold-body", children: [
          /* @__PURE__ */ f("div", { className: "aq-row aq-top aq-wrap", children: [
            t.tiers.length > 0 || c.tier ? /* @__PURE__ */ r(S, { label: a("tier"), children: /* @__PURE__ */ f(
              "select",
              {
                className: "select",
                value: c.tier,
                onChange: (b) => d((v) => {
                  v.tier = b.target.value;
                }),
                children: [
                  /* @__PURE__ */ r("option", { value: "", children: a("noTier") }),
                  t.tiers.map((b) => /* @__PURE__ */ r("option", { value: b.key, children: G(R(s, b.title.key, l)) || b.key }, b.key)),
                  c.tier && !k && /* @__PURE__ */ r("option", { value: c.tier, children: c.tier })
                ]
              }
            ) }) : null,
            /* @__PURE__ */ r(
              S,
              {
                label: a("duration"),
                hint: g ? /* @__PURE__ */ r("span", { className: "aq-err", children: a("durationInvalid") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input",
                    value: c.duration,
                    placeholder: "24h",
                    onChange: (b) => d((v) => {
                      v.duration = b.target.value.trim();
                    })
                  }
                )
              }
            ),
            /* @__PURE__ */ r(
              S,
              {
                label: a("key"),
                hint: p ? /* @__PURE__ */ r("span", { className: "aq-err", children: a("keyTaken") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input aq-mono",
                    value: c.key,
                    onChange: (b) => d((v) => {
                      v.key = ze(b.target.value);
                    }),
                    onBlur: () => {
                      const b = oe(c.key);
                      b !== c.key && d((v) => {
                        v.key = b;
                      });
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ f("div", { className: "aq-row aq-top aq-wrap", children: [
            /* @__PURE__ */ r(S, { label: a("giverNpc"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: m,
                onChange: (b) => u("npc", b.target.value)
              }
            ) }),
            m && /* @__PURE__ */ r(S, { label: a("giverConversation"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: typeof y.conversation == "string" ? y.conversation : "",
                onChange: (b) => u("conversation", b.target.value)
              }
            ) })
          ] }),
          m && /* @__PURE__ */ r(
            et,
            {
              ctx: e,
              label: a("giverLine"),
              value: y.line,
              onChange: (b) => d((v) => {
                const w = { ...y };
                _(w, "line", b), v.rest.giver = w;
              })
            }
          ),
          m && q && /* @__PURE__ */ r("span", { className: "aq-warn", children: a("giverDistributed") })
        ] })
      ] }),
      /* @__PURE__ */ r(
        ge,
        {
          ids: nt(c.stages.map((b) => b.key)),
          onMove: (b, v) => d((w) => Ne(w.stages, b, v)),
          className: "aq-stages",
          children: (b, v) => /* @__PURE__ */ r(
            kn,
            {
              ctx: e,
              quest: c,
              stage: c.stages[b],
              si: b,
              handle: v,
              editQuest: d
            }
          )
        }
      ),
      /* @__PURE__ */ f(
        U,
        {
          size: "sm",
          variant: "ghost",
          className: "aq-add",
          onClick: () => d((b) => {
            const v = J(
              `stage_${b.stages.length + 1}`,
              b.stages.map((w) => w.key)
            );
            b.stages.push({ ...rt(b.stages.length + 1), key: v });
          }),
          children: [
            "+ ",
            a("addStage")
          ]
        }
      ),
      h && /* @__PURE__ */ f("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ f("span", { className: "aq-h aq-h-row", children: [
          a("completedWhen"),
          /* @__PURE__ */ r("span", { className: "aq-help", tabIndex: 0, role: "note", "aria-label": a("completedWhenHint"), "data-tip": a("completedWhenHint"), children: "?" })
        ] }),
        /* @__PURE__ */ r(
          ft,
          {
            projectId: e.projectId,
            value: Ze(c.rest),
            emptyHint: a("completedWhenEmpty"),
            onChange: (b) => d((v) => _(v.rest, "completed_when", b.length > 0 ? b : void 0))
          },
          c.uid
        )
      ] }),
      /* @__PURE__ */ f("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r(
          at,
          {
            ctx: e,
            title: a("questEvents"),
            hooks: Ut,
            label: (b) => a(`questHook.${b}`),
            value: c.rest.actions,
            onChange: (b, v) => d((w) => {
              const A = { ...T(w.rest.actions) };
              _(A, b, v), _(w.rest, "actions", Object.keys(A).length > 0 ? A : void 0);
            })
          },
          c.uid
        ),
        x.length > 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: a("kept", { fields: x.join(", ") }) })
      ] })
    ] }),
    /* @__PURE__ */ f("aside", { className: "aq-card aq-pad aq-aside", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: a("preview") }),
      /* @__PURE__ */ r(Cn, { ctx: e, quest: c })
    ] })
  ] });
}
function kn({
  ctx: e,
  quest: t,
  stage: n,
  si: i,
  handle: a,
  editQuest: o
}) {
  const { t: s } = e, [l, c] = L(null), [d, p] = L(!1), g = (m) => o((q) => m(q.stages[i])), x = n.flow || "parallel", h = t.stages.flatMap((m) => m.objectives.map((q) => q.key)), y = d || n.objectives.length === 0, u = (m) => {
    const q = Lt(m, h);
    o((k) => {
      k.stages[i].objectives.push({ key: q, type: m, params: Fe(m) });
    }), c(q), p(!1);
  };
  return /* @__PURE__ */ f("div", { className: "aq-card aq-stage", children: [
    /* @__PURE__ */ f("div", { className: "aq-stage-head", children: [
      a,
      /* @__PURE__ */ r("span", { className: "aq-eyebrow aq-stage-label", children: s("stage", { n: i + 1 }) }),
      /* @__PURE__ */ r("div", { className: "aq-stage-title", children: /* @__PURE__ */ r(
        Q,
        {
          ctx: e,
          bare: !0,
          label: s("stageName"),
          node: n.title,
          placeholder: s("stageNameDefault", { n: i + 1 })
        }
      ) }),
      n.objectives.length > 1 && /* @__PURE__ */ r(
        ie,
        {
          label: s("flow"),
          value: x,
          options: ["parallel", "sequential"].map((m) => ({
            value: m,
            label: s(`flow.${m}`)
          })),
          onChange: (m) => g((q) => {
            q.flow = m;
          })
        }
      ),
      /* @__PURE__ */ r(
        _e,
        {
          t: s,
          label: s("remove"),
          sure: n.objectives.length === 0,
          onRemove: () => o((m) => {
            m.stages.splice(i, 1);
          })
        }
      )
    ] }),
    /* @__PURE__ */ f("span", { className: "aq-eyebrow", children: [
      s("objectives"),
      " ",
      /* @__PURE__ */ r("span", { className: "aq-count", children: n.objectives.length })
    ] }),
    /* @__PURE__ */ r(
      ge,
      {
        ids: nt(n.objectives.map((m) => m.key)),
        onMove: (m, q) => g((k) => Ne(k.objectives, m, q)),
        className: "aq-objectives",
        children: (m, q) => {
          const k = n.objectives[m];
          return /* @__PURE__ */ r(
            wn,
            {
              ctx: e,
              t: s,
              projectId: e.projectId,
              n: x === "sequential" ? `${i + 1}.${m + 1}` : "",
              objective: k,
              open: l === k.key,
              onToggle: () => c(l === k.key ? null : k.key),
              keyTaken: h.filter((N) => N === k.key).length > 1,
              handle: q,
              onChange: (N) => g((j) => N(j.objectives[m])),
              onRename: (N) => {
                l === k.key && c(N);
              },
              onRemove: () => g((N) => {
                N.objectives.splice(m, 1);
              })
            }
          );
        }
      }
    ),
    y ? /* @__PURE__ */ f("div", { className: "aq-types", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: s("addObjective") }),
      /* @__PURE__ */ r("div", { className: "aq-seg", children: qe.map((m) => /* @__PURE__ */ f("button", { type: "button", className: "aq-opt", onClick: () => u(m.type), children: [
        /* @__PURE__ */ r("span", { "aria-hidden": !0, children: m.icon }),
        " ",
        s(`objective.${m.type}`)
      ] }, m.type)) })
    ] }) : /* @__PURE__ */ f(U, { size: "sm", variant: "ghost", className: "aq-add", onClick: () => p(!0), children: [
      "+ ",
      s("addObjective")
    ] })
  ] });
}
function wn({
  ctx: e,
  t,
  projectId: n,
  n: i,
  objective: a,
  open: o,
  onToggle: s,
  keyTaken: l,
  handle: c,
  onChange: d,
  onRename: p,
  onRemove: g
}) {
  const x = B(a.type), h = x ? x.params : Object.keys(a.params).map((v) => ({ name: v, kind: "text" })), y = se(a.params), u = ke(a.type, a.params), m = Je(a.type, a.params), q = l || m.length > 0, k = h.filter((v) => v.advanced), [N, j] = L(!1), C = N || l, b = (v) => v.kind === "item" ? /* @__PURE__ */ r(
    Nn,
    {
      t,
      projectId: n,
      spec: v,
      params: a.params,
      onChange: (w) => d((A) => w(A.params))
    },
    v.name
  ) : v.kind === "line" ? /* @__PURE__ */ r(
    et,
    {
      ctx: e,
      label: t(`param.${v.name}`),
      value: a.params[v.name],
      onChange: (w) => d((A) => _(A.params, v.name, w))
    },
    v.name
  ) : /* @__PURE__ */ r(
    _n,
    {
      t,
      spec: v,
      value: a.params[v.name],
      onChange: (w) => d((A) => _(A.params, v.name, w))
    },
    v.name
  );
  return /* @__PURE__ */ f("div", { className: `aq-obj${o ? " is-open" : ""}${q ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ f("div", { className: "aq-obj-line", children: [
      c,
      /* @__PURE__ */ f("button", { type: "button", className: "aq-obj-main", onClick: s, "aria-expanded": o, children: [
        i && /* @__PURE__ */ r("span", { className: "aq-obj-n", children: i }),
        /* @__PURE__ */ r("span", { className: "aq-obj-icon", "aria-hidden": !0, children: x?.icon ?? "?" }),
        /* @__PURE__ */ f("span", { className: "aq-obj-text", children: [
          te(t, a.type),
          y !== void 0 && /* @__PURE__ */ f("strong", { children: [
            " · ",
            String(y)
          ] }),
          u ? ` × ${u}` : y !== void 0 && x ? ` × ${t("any")}` : ""
        ] }),
        q && /* @__PURE__ */ r(E, { tone: "warn", children: l ? t("objectiveKeyTaken") : t("missing", {
          fields: m.map((v) => t(`param.${v}`)).join(", ")
        }) }),
        /* @__PURE__ */ r(Y, { open: o })
      ] }),
      /* @__PURE__ */ r(le, { label: t("remove"), onClick: g, children: "×" })
    ] }),
    o && /* @__PURE__ */ f("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ f("div", { className: "aq-row aq-top aq-wrap", children: [
        /* @__PURE__ */ r(S, { label: t("type"), children: /* @__PURE__ */ f(
          "select",
          {
            className: "select",
            value: a.type,
            onChange: (v) => d((w) => {
              w.type = v.target.value, w.params = Fe(w.type);
            }),
            children: [
              qe.map((v) => /* @__PURE__ */ f("option", { value: v.type, children: [
                v.icon,
                " ",
                t(`objective.${v.type}`)
              ] }, v.type)),
              !x && /* @__PURE__ */ r("option", { value: a.type, children: a.type })
            ]
          }
        ) }),
        h.filter((v) => !v.advanced).map(b)
      ] }),
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "aq-fold-head is-inner",
          "aria-expanded": C,
          onClick: () => j(!C),
          children: [
            /* @__PURE__ */ r(Y, { open: C }),
            /* @__PURE__ */ r("span", { className: "aq-fold-title", children: t("more") }),
            !C && /* @__PURE__ */ r(E, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: a.key }) })
          ]
        }
      ),
      C && /* @__PURE__ */ f("div", { className: "aq-row aq-top aq-wrap", children: [
        k.map(b),
        /* @__PURE__ */ r(
          S,
          {
            label: t("key"),
            title: t("objectiveKeyHint"),
            hint: l ? /* @__PURE__ */ r("span", { className: "aq-err", children: t("objectiveKeyTaken") }) : void 0,
            children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: a.key,
                onChange: (v) => {
                  const w = ze(v.target.value);
                  d((A) => {
                    A.key = w;
                  }), p(w);
                },
                onBlur: () => {
                  const v = oe(a.key);
                  v !== a.key && (d((w) => {
                    w.key = v;
                  }), p(v));
                }
              }
            )
          }
        )
      ] })
    ] })
  ] });
}
function Nn({
  t: e,
  projectId: t,
  spec: n,
  params: i,
  onChange: a
}) {
  const o = xe(i, n), s = Array.isArray(i.match) ? i.match : void 0, l = (c, d) => a((p) => Bt(p, n, c, d));
  return /* @__PURE__ */ r(S, { label: e(`param.${n.name}`), children: /* @__PURE__ */ r(
    qt,
    {
      projectId: t,
      value: o,
      match: s,
      onChange: (c) => l(c, s),
      onMatchChange: (c) => l(o, c)
    }
  ) });
}
function _n({
  t: e,
  spec: t,
  value: n,
  onChange: i
}) {
  const a = e(`param.${t.name}`), o = typeof n == "string" || typeof n == "number" ? String(n) : "";
  if (t.kind === "int")
    return /* @__PURE__ */ r(P, { label: a, value: n, onChange: i });
  if (t.kind === "material")
    return /* @__PURE__ */ r(S, { label: a, children: /* @__PURE__ */ r(
      xt,
      {
        value: o,
        placeholder: e("any"),
        "aria-label": a,
        onChange: (l) => i(l.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const s = t.kind === "entity";
  return /* @__PURE__ */ f(S, { label: a, children: [
    /* @__PURE__ */ r(
      "input",
      {
        className: `input${s ? " aq-mono" : ""}`,
        list: s ? "aq-entities" : void 0,
        value: o,
        placeholder: s ? e("any") : "",
        onChange: (l) => i(s ? l.target.value.toUpperCase().replace(/\s+/g, "_") : l.target.value)
      }
    ),
    s && /* @__PURE__ */ r("datalist", { id: "aq-entities", children: zt.map((l) => /* @__PURE__ */ r("option", { value: l }, l)) })
  ] });
}
const jn = 170, Se = { color: "#aaaaaa", italic: !1 }, Oe = { color: "#ffffff", italic: !1 };
function Cn({ ctx: e, quest: t }) {
  const { t: n, project: i, lang: a } = e, o = (d) => d.split(`
`).flatMap((p) => p === "" ? [""] : bt(p, jn)), s = R(i, t.title.key, a) || t.key, l = R(i, t.description.key, a), c = t.stages.length > 1;
  return /* @__PURE__ */ r("div", { className: "aq-preview", children: /* @__PURE__ */ f("div", { className: "aq-preview-frame", children: [
    /* @__PURE__ */ r(Z, { source: o(s).join(`
`), defaults: Oe, scale: 2 }),
    l && /* @__PURE__ */ r(Z, { source: o(l).join(`
`), defaults: Se, scale: 2 }),
    t.stages.map((d, p) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ f("div", { className: "aq-preview-stage", children: [
        c && /* @__PURE__ */ r(
          Z,
          {
            source: o(R(i, d.title.key, a) || n("stage", { n: p + 1 })).join(`
`),
            defaults: Oe,
            scale: 2
          }
        ),
        d.objectives.length > 0 && /* @__PURE__ */ r(
          Z,
          {
            source: d.objectives.flatMap((g) => o(`• ${ne(n, g)}`)).join(`
`),
            defaults: Se,
            scale: 2
          }
        )
      ] }, p)
    ))
  ] }) });
}
function En({ className: e }) {
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
const An = {
  kind: re,
  dir: Be,
  schemaVersion: be,
  // Created in the module's folder only (SDK 1.8); a group already elsewhere still loads.
  projects: [Ot],
  // Data with no links: one "Quests" entry and page instead of a node per group (SDK 1.9).
  collection: { labels: Tt },
  // A group's id is its key on the server (`quest_group_key`): typed by hand, no prefix.
  label: je.en,
  labels: je,
  icon: En,
  component: dn,
  // The view is a page of its own: its cards, and the quest beside what the player sees.
  ownHeader: !0,
  wide: !0,
  title: (e, { project: t, lang: n }) => G(R(t, e.title.key, n)),
  // The sidebar reads "Niveaux de guilde", the file's id stays in the group's settings.
  listByTitle: !0,
  create: ({ id: e, projectId: t }) => ({
    id: e,
    projectId: t,
    uid: V(),
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
  parse: (e, t) => Rt(e, t),
  serialize: (e, t) => Pt(e, t),
  ltextSites: (e) => Ht(e),
  board: {
    size: { width: 300, height: 48 },
    accent: Wt,
    // The group's quests, one selectable row each: the Properties panel opens the one clicked.
    items: (e, { project: t, lang: n }) => Ft(e, t, n),
    summary: (e, { lang: t }) => Yt(e, t)
  }
}, $e = "quests:groups", Le = "quests:quests", Tn = "quests:active";
function Sn(e) {
  return e.startsWith("msquests:") ? `quests:${e.slice(9)}` : e;
}
const Re = {
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
}, Ie = { en: "Available", fr: "Disponible" };
function On(e, t, n) {
  const i = Sn(t);
  if (i !== $e && i !== Le && i !== Tn) return null;
  const a = e.documents?.[re];
  if (!a || a.length === 0) return null;
  const o = e.defaultLang ?? "en", s = n?.serverRows, l = n?.params?.group || void 0, c = [...a].sort((p, g) => p.id < g.id ? -1 : p.id > g.id ? 1 : 0);
  if (i === $e) {
    const p = he(s, "key");
    return c.map((g) => $n(g, p.get(g.id), o));
  }
  if (i === Le) {
    const p = he(s, "id");
    return c.filter((g) => !l || g.id === l).flatMap((g) => g.quests.map((x) => ot(g, x, p.get(`${g.id}:${x.key}`), o)));
  }
  if (!s) return null;
  const d = new Map(a.map((p) => [p.id, p]));
  return s.flatMap((p) => {
    const g = d.get(I(p.group));
    if (!g) return [p];
    const x = g.quests.find((h) => h.key === I(p.quest_key));
    return x ? [Dn(x, p, o)] : [];
  });
}
function $n(e, t, n) {
  const i = he(ee(t?.quests), "key");
  return {
    key: e.id,
    name: e.title,
    description: e.description,
    actor_type: e.actorType,
    max_active: ye(e.limits.max_active, 1),
    max_per_period: ye(e.limits.max_per_period, 0),
    rotatable: e.rotation.enabled === !0,
    // The period follows the server's clock and zone: its value stands until a deploy.
    period_end: t?.period_end ?? 0,
    active_count: t?.active_count ?? 0,
    completed_count: t?.completed_count ?? 0,
    can_rotate: t?.can_rotate ?? !1,
    quests: e.quests.map((a) => ot(e, a, i.get(a.key), n))
  };
}
function ot(e, t, n, i) {
  const a = e.tiers.find((o) => o.key === t.tier);
  return {
    id: `${e.id}:${t.key}`,
    group: e.id,
    key: t.key,
    name: t.title,
    description: t.description,
    duration: Kn(t.duration),
    tier: t.tier,
    tier_name: a ? a.title : "",
    assigned: n?.assigned ?? !1,
    status_key: n?.status_key ?? "NOT_STARTED",
    status: n?.status ?? Ie[i.slice(0, 2)] ?? Ie.en,
    can_start: n?.can_start ?? !1,
    start_blocker: n?.start_blocker ?? "",
    start_blocker_label: n?.start_blocker_label ?? "",
    // `reference` in `QuestRows.questRow`: the attempt the server holds for this player.
    ...st(t, n?.assigned === !0 ? n : void 0, i)
  };
}
function st(e, t, n) {
  const i = t ? Ln(t) : void 0, a = Rn(e, i, n), o = a.find((l) => l.active === !0), s = o ? o.objectives.find((l) => l.done !== !0) : void 0;
  return {
    objective_name: s?.name ?? "",
    objective_progress: s?.progress ?? 0,
    objective_target: s?.target ?? 0,
    progress_ratio: i ? lt(a.map((l) => l.progress_ratio)) : 0,
    stage_index: a.filter((l) => l.completed === !0).length,
    stage_name: o?.name ?? "",
    stage_flow: o?.flow ?? "",
    stages: a.map((l) => ({ ...l, objectives: l.objectives.map(({ done: c, ...d }) => d) }))
  };
}
function Ln(e) {
  const t = /* @__PURE__ */ new Map(), n = [
    ...ee(e.objectives),
    ...ee(e.stages).flatMap((i) => ee(i.objectives))
  ];
  for (const i of n) {
    const a = I(i.status_key);
    t.set(I(i.key), {
      progress: ye(i.progress, 0),
      flag: a === "COMPLETED" || a === "FAILED" ? a : "",
      row: i
    });
  }
  return t;
}
function Rn(e, t, n) {
  const i = e.stages.map((o, s) => {
    const l = o.objectives.map((c) => In(c, t?.get(c.key), n));
    return {
      key: o.key,
      name: o.title,
      flow: Hn(o),
      index: s,
      // `QuestStage.isCompleted`: all objectives done, so an empty stage is.
      completed: t !== void 0 && l.every((c) => c.done),
      active: !1,
      progress_ratio: t ? lt(l.map((c) => c.progress_ratio)) : 0,
      objectives: l
    };
  });
  if (!t) return i;
  const a = i.find((o) => o.completed !== !0);
  if (a) {
    a.active = !0;
    const o = a.objectives, s = o.find((l) => l.done !== !0);
    for (const l of o)
      l.status_key === "PENDING" && (a.flow !== "SEQUENTIAL" || l === s) && (l.status_key = "IN_PROGRESS");
  }
  return i;
}
function In(e, t, n) {
  const i = Pn(e), a = t?.progress ?? 0, o = t?.row, s = o && o.type === e.type && o.target === i;
  return {
    key: e.key,
    name: s && typeof o.name == "string" ? o.name : Mn(e, n),
    type: e.type,
    progress: a,
    target: i,
    // `AbstractQuestObjective`: done once the progress reaches the target, whatever the
    // stored flag says; the ratio is clamped, so a lowered target reads 1, not 1.4.
    progress_ratio: t ? i <= 0 ? 1 : Math.min(Math.max(a / i, 0), 1) : 0,
    completed: t !== void 0 && a >= i,
    status_key: t?.flag || "PENDING",
    done: t !== void 0 && a >= i
  };
}
function Dn(e, t, n) {
  const i = st(e, t, n), a = i.stages;
  return {
    ...t,
    name: e.title,
    description: e.description,
    stage_index: i.stage_index,
    stage_count: e.stages.length,
    stage_name: i.stage_name,
    stage_flow: i.stage_flow,
    progress_ratio: i.progress_ratio,
    objective_name: i.objective_name,
    objective_progress: i.objective_progress,
    objective_target: i.objective_target,
    objectives: a.flatMap((o) => o.objectives),
    stages: a
  };
}
function Mn(e, t) {
  const i = (Re[t.slice(0, 2)] ?? Re.en)[e.type];
  if (!i) return e.type;
  const a = e.params, o = {
    amount: String(a.amount ?? ""),
    distance: String(a.distance ?? ""),
    command: I(a.command),
    value: I(a.value),
    // Bukkit's translation keys, as the objective configs write them (`<lang:…>`).
    crop: X("block", a.crop),
    entity_type: X("entity", a.entity_type),
    material: e.type === "block_break" ? X("block", a.material) : De(e),
    fish_type: De(e)
  };
  return i.replace(/%([a-z_]+)%/g, (s, l) => o[l] ?? "");
}
function X(e, t) {
  const n = I(t).toLowerCase().replace(/^minecraft:/, "");
  return n === "" ? "" : `<lang:${e}.minecraft.${n}>`;
}
function De(e) {
  const t = B(e.type)?.params.find((o) => o.kind === "item");
  if (!t) return "";
  const n = xe(e.params, t), i = n.title;
  if (typeof i == "string" && i.trim() !== "") return i;
  const a = I(n.material);
  return /^(minecraft:)?[a-z_0-9]+$/i.test(a) && !a.includes(":") ? X("item", a) : a || Ve(n);
}
function Pn(e) {
  const t = se(e.params);
  if (t === void 0) return 1;
  const n = Number(t);
  return Number.isFinite(n) ? n : 1;
}
function Hn(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function Kn(e) {
  const t = e.trim().toLowerCase().replace(/ /g, "");
  if (t === "") return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const n = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!n) return 0;
  const [, i, a, o, s] = n;
  return Number(i ?? 0) * 86400 + Number(a ?? 0) * 3600 + Number(o ?? 0) * 60 + Number(s ?? 0);
}
function he(e, t) {
  return new Map((e ?? []).map((n) => [I(n[t]), n]));
}
function ee(e) {
  return Array.isArray(e) ? e.filter((t) => t && typeof t == "object") : [];
}
function lt(e) {
  return e.length === 0 ? 0 : e.reduce((t, n) => t + n, 0) / e.length;
}
function ye(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function I(e) {
  return typeof e == "string" ? e : "";
}
const Gn = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: kt,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  documents: [An],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: On
}, zn = { ...Gn, sdk: "1.21.0" };
export {
  zn as default
};
