import { createModuleI18n as at, fieldText as rt, newTextKey as K, textValue as R, injectModuleStyles as ot, useProject as st, useContentLang as lt, SortableList as ge, Button as U, ConditionsEditor as ct, updateDocument as dt, selectDocumentItem as ut, projectLangs as pt, LocalizedField as mt, MiniMessageInput as ft, textValues as Me, McText as Z, useUiLang as Pe, useOptionList as ht, ActionChainEditor as yt, mcWrap as gt, ItemInput as vt, MaterialInput as bt, SDK_VERSION as qt } from "@artisan/editor-sdk";
import { jsx as r, jsxs as y, Fragment as H } from "react/jsx-runtime";
import { useState as $, useEffect as ve, useRef as xt } from "react";
const He = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
}, kt = /^\d+$/;
function ce(e, t, n) {
  const i = String(n).padStart(2, "0");
  return e === "fr" ? n === 0 ? `${t} h` : `${t} h ${i}` : `${String(t).padStart(2, "0")}:${i}`;
}
function O(e, t, n) {
  return kt.test(e) && Number(e) >= t && Number(e) <= n;
}
function de(e) {
  return e.trim().split(/\s+/).length === 5;
}
function wt(e, t) {
  const n = t === "fr", i = e.trim().split(/\s+/);
  if (i.length !== 5) return null;
  const [a, o, l, c, s] = i;
  if (c !== "*") return null;
  const d = /^\*\/(\d+)$/;
  if (l === "*" && s === "*") {
    if (O(a, 0, 59) && O(o, 0, 23))
      return n ? `tous les jours à ${ce(t, +o, +a)}` : `every day at ${ce(t, +o, +a)}`;
    const g = d.exec(o);
    if (O(a, 0, 59) && g)
      return n ? `toutes les ${g[1]} h, à la minute ${a}` : `every ${g[1]} hours, at minute ${a}`;
    if (O(a, 0, 59) && o === "*")
      return n ? `toutes les heures, à la minute ${a}` : `every hour, at minute ${a}`;
    const x = d.exec(a);
    return x && o === "*" ? n ? `toutes les ${x[1]} minutes` : `every ${x[1]} minutes` : null;
  }
  if (!O(a, 0, 59) || !O(o, 0, 23)) return null;
  const m = ce(t, +o, +a);
  if (l === "*" && O(s, 0, 7)) {
    const g = He[n ? "fr" : "en"][Number(s) % 7];
    return n ? `chaque ${g} à ${m}` : `every ${g} at ${m}`;
  }
  return s === "*" && O(l, 1, 31) ? n ? `le ${l === "1" ? "1er" : l} de chaque mois à ${m}` : `on day ${l} of each month at ${m}` : null;
}
function z(e, t, n) {
  const i = /* @__PURE__ */ new Set();
  for (const a of e.split(",")) {
    const o = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(a);
    if (!o) return null;
    const l = o[4] ? Number(o[4]) : 1, c = o[1] === "*" ? t : Number(o[2]), s = o[1] === "*" ? n : o[3] ? Number(o[3]) : o[4] ? n : c;
    if (l < 1 || c < t || s > n || c > s) return null;
    for (let d = c; d <= s; d += l) i.add(d);
  }
  return i;
}
function Nt(e, t) {
  const n = e.trim().split(/\s+/);
  if (n.length !== 5) return null;
  const i = z(n[0], 0, 59), a = z(n[1], 0, 23), o = z(n[2], 1, 31), l = z(n[3], 1, 12), c = z(n[4], 0, 7);
  if (!i || !a || !o || !l || !c) return null;
  c.has(7) && c.add(0);
  const s = n[2] === "*", d = n[4] === "*", m = (f) => s && d ? !0 : s ? c.has(f.getDay()) : d ? o.has(f.getDate()) : o.has(f.getDate()) || c.has(f.getDay()), g = new Date(t.getTime());
  g.setSeconds(0, 0), g.setMinutes(g.getMinutes() + 1);
  const x = t.getTime() + 366 * 24 * 3600 * 1e3;
  for (; g.getTime() <= x; ) {
    if (!l.has(g.getMonth() + 1) || !m(g)) {
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
function _t(e) {
  const t = e.trim().split(/\s+/);
  if (e.trim() === "") return { kind: "never" };
  if (t.length !== 5) return { kind: "custom" };
  const [n, i, a, o, l] = t;
  if (o !== "*" || !O(n, 0, 59) || !O(i, 0, 23)) return { kind: "custom" };
  const c = `${i.padStart(2, "0")}:${n.padStart(2, "0")}`;
  return a === "*" && l === "*" ? { kind: "daily", time: c } : a === "*" && O(l, 0, 7) ? { kind: "weekly", time: c, day: Number(l) % 7 } : l === "*" && O(a, 1, 31) ? { kind: "monthly", time: c, day: Number(a) } : { kind: "custom" };
}
function jt(e) {
  if (e.kind === "never") return "";
  if (e.kind === "custom") return null;
  const t = /^(\d{1,2}):(\d{2})$/.exec(e.time), n = t ? Math.min(23, Number(t[1])) : 4, i = t ? Math.min(59, Number(t[2])) : 0;
  return e.kind === "daily" ? `${i} ${n} * * *` : e.kind === "weekly" ? `${i} ${n} * * ${e.day}` : `${i} ${n} ${Math.min(31, Math.max(1, e.day))} * *`;
}
function Ct(e) {
  return He[e === "fr" ? "fr" : "en"];
}
const W = {
  kindLabel: "Quest groups",
  collection: "Quests",
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
  completedWhen: "Already done if",
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
  collection: "Quêtes",
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
  completedWhen: "Déjà faite si",
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
}, je = { en: W.kindLabel, fr: ae.kindLabel }, Et = { en: W.collection, fr: ae.collection }, At = at({ en: W, fr: ae });
function Ke(e) {
  const t = e === "fr" ? ae : W;
  return (n, i) => {
    const a = t[n] ?? W[n] ?? n;
    return i ? a.replace(/\{\{(\w+)\}\}/g, (o, l) => String(i[l] ?? o)) : a;
  };
}
const re = "quest_group", Ge = "quest_groups", Tt = "quests", be = "quest_group/v1";
function St(e) {
  const t = { ...E(e) };
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
function Ot(e, t) {
  const n = new Set(t), i = new Uint8Array(4);
  for (; ; ) {
    crypto.getRandomValues(i);
    const a = Array.from(i, (l) => me[l % 32].toLowerCase()).join(""), o = `${oe(e)}_${a}`;
    if (!n.has(o)) return o;
  }
}
function Qe(e) {
  return e.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
function oe(e) {
  return e.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "quest";
}
function E(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? { ...e } : {};
}
function ue(e) {
  return Array.isArray(e) ? e : [];
}
function S(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? String(e) : "";
}
function F(e, ...t) {
  const n = { ...e };
  for (const i of t) delete n[i];
  return n;
}
function $t(e, t) {
  const n = {}, i = [];
  function a(s) {
    if (s && typeof s == "object" && !Array.isArray(s)) {
      const g = K(), x = {};
      for (const [f, v] of Object.entries(s)) x[f] = S(v);
      return n[g] = x, { key: g };
    }
    const d = typeof s == "string" ? /^\{i18n:(.+)\}$/.exec(s) : null;
    if (d) {
      const g = t.translations?.[d[1]];
      return g && (n[d[1]] = { ...g }), { key: d[1] };
    }
    const m = K();
    return n[m] = s == null || s === "" ? {} : { [t.lang]: S(s) }, { key: m };
  }
  const o = Object.entries(E(e.tiers)).map(([s, d]) => {
    const m = E(d);
    return { key: s, title: a(m.title), rest: F(m, "title") };
  }), l = ue(e.quests).map((s, d) => {
    const m = E(s), g = ue(m.stages).map((x, f) => {
      const v = E(x), p = S(v.flow).toLowerCase();
      return {
        key: S(v.key) || `stage_${f + 1}`,
        title: a(v.title),
        flow: p === "parallel" || p === "sequential" ? p : "",
        objectives: ue(v.objectives).map((h, b) => {
          const k = E(h);
          return {
            key: S(k.key) || `objective_${b + 1}`,
            type: S(k.type),
            params: F(k, "key", "type")
          };
        }),
        rest: F(v, "key", "title", "flow", "objectives")
      };
    });
    return {
      key: S(m.key) || `quest_${d + 1}`,
      uid: S(m.uid) || V(),
      tier: S(m.tier),
      title: a(m.title),
      description: a(m.description),
      duration: S(m.duration),
      stages: g,
      rest: Rt(m)
    };
  }), c = {
    id: S(e.id),
    projectId: t.projectId,
    uid: S(e.uid) || V(),
    title: a(e.title),
    description: a(e.description),
    actorType: S(e.actor_type) || "player",
    reset: E(e.reset),
    limits: E(e.limits),
    rotation: E(e.rotation),
    distribution: St(e.distribution),
    tiers: o,
    quests: l,
    rest: Ue(F(
      E(e),
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
  return e.schema !== void 0 && e.schema !== be && i.push(`schema: ${String(e.schema)}`), { doc: c, i18nKeys: n, unsupported: i };
}
function Ue(e) {
  return e.on !== void 0 && (e.actions == null && (e.actions = e.on), delete e.on), e;
}
function Rt(e) {
  const t = Ue(
    F(e, "key", "uid", "tier", "title", "description", "duration", "stages", "reward_display")
  );
  if (t.rewards !== void 0) {
    const n = E(t.actions);
    n.complete == null && (t.actions = { ...n, complete: t.rewards }), delete t.rewards;
  }
  return t;
}
function Lt(e) {
  return typeof e == "string" ? e === "" : Object.values(e).every((t) => t === "");
}
function D(e) {
  const t = {};
  for (const [n, i] of Object.entries(e))
    i == null || i === "" || Array.isArray(i) && i.length === 0 || typeof i == "object" && !Array.isArray(i) && Object.keys(i).length === 0 || (t[n] = i);
  return t;
}
const It = [
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
function Dt(e, t) {
  const n = (d) => rt(t, d.key), i = (d) => {
    const m = n(d);
    return Lt(m) ? void 0 : m;
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
        (m) => D({
          key: m.key,
          title: i(m.title),
          flow: m.flow,
          ...m.rest,
          objectives: m.objectives.map((g) => ({ key: g.key, type: g.type, ...g.params }))
        })
      )
    })
  ), l = {
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
  }, c = {};
  for (const d of It) d in l && (c[d] = l[d]);
  for (const d of Object.keys(l)) d in c || (c[d] = l[d]);
  const s = D(c);
  return s.quests = o, s;
}
function* Mt(e) {
  const t = `${Ge}.${e.id}`;
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
    const l = `${t}.quests.${o}`;
    yield {
      lText: a.title,
      key: `${l}.title`,
      path: `quests[${i}].title`,
      kind: "quest.title"
    }, yield {
      lText: a.description,
      key: `${l}.description`,
      path: `quests[${i}].description`,
      kind: "quest.description"
    };
    const c = /* @__PURE__ */ new Set();
    for (let s = 0; s < a.stages.length; s++) {
      const d = a.stages[s], m = c.has(d.key) ? `${d.key}_${s}` : d.key;
      c.add(d.key), yield {
        lText: d.title,
        key: `${l}.stages.${m}.title`,
        path: `quests[${i}].stages[${s}].title`,
        kind: "quest.stage"
      };
    }
  }
}
function Ce(e) {
  return !!e && typeof e == "object" && !Array.isArray(e) && "type" in e;
}
function Pt(e) {
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
function Ht(e) {
  const t = String(e.type), n = e.command ?? e.message ?? e.title ?? e.material;
  return typeof n == "string" ? `${t} · ${n}` : t;
}
const Kt = [
  "distribution",
  "actor_load",
  "quest_start",
  "objective_progress",
  "objective_complete",
  "quest_complete",
  "period_complete"
], Gt = ["start", "objective_progress", "objective_complete", "complete"], M = { name: "amount", kind: "int", required: !0 }, qe = [
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
      { name: "conversation", kind: "text", advanced: !0 },
      { name: "missing", kind: "text", advanced: !0 }
    ]
  },
  {
    type: "talk_npc",
    icon: "💬",
    params: [
      { name: "npc", kind: "text", required: !0 },
      { name: "conversation", kind: "text" }
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
function Be(e) {
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
function Qt(e, t, n, i) {
  t.legacy && delete e[t.legacy];
  const a = !n || Object.keys(n).length === 0;
  a ? delete e[t.name] : e[t.name] = n, a || i === void 0 ? delete e.match : e.match = i;
}
function ze(e) {
  const t = e.title;
  if (typeof t == "string" && t.trim() !== "") return t.replace(/<[^>]*>/g, "");
  const n = e.material ?? e.item;
  return typeof n == "string" ? n : "";
}
function ke(e, t) {
  const n = B(e);
  return n ? n.params.filter((i) => i.kind !== "int").map((i) => i.kind === "item" ? ze(xe(t, i)) : t[i.name]).filter((i) => typeof i == "string" && i !== "").join(" = ") : Object.keys(t).map((i) => t[i]).filter((i) => typeof i == "string" && i !== "").join(" = ");
}
function Fe(e, t) {
  return (B(e)?.params ?? []).filter((n) => n.required && (t[n.name] === void 0 || t[n.name] === "")).map((n) => n.name);
}
const Ut = [
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
], Bt = "#f59e0b";
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
function zt(e, t, n) {
  const i = Ke(n), a = we(e);
  return e.quests.map((o, l) => {
    const c = R(t, o.title.key, n);
    return {
      id: o.uid,
      label: G(c) || o.key,
      detail: o.tier || void 0,
      caption: Ft(i, o),
      marker: a ? String(l + 1) : void 0,
      hover: {
        title: c || o.key,
        text: R(t, o.description.key, n) || void 0,
        lines: Wt(i, o, t, n)
      }
    };
  });
}
function Ft(e, t) {
  const n = t.stages.flatMap((o) => o.objectives), i = n[0];
  if (!i) return;
  const a = n.length - 1;
  return a > 0 ? `${ne(e, i)} +${String(a)}` : ne(e, i);
}
function Wt(e, t, n, i) {
  const a = t.stages.length > 1;
  return t.stages.flatMap(
    (o, l) => o.objectives.map((c) => {
      const s = ne(e, c);
      return a ? `<gray>${G(R(n, o.title.key, i)) || e("stage", { n: l + 1 })} ·</gray> ${s}` : s;
    })
  );
}
function Vt(e, t) {
  const n = Ke(t), i = typeof e.distribution?.strategy == "string" ? e.distribution.strategy.toLowerCase() : "", a = e.quests.length, o = a === 1 ? n("questCountOne") : n("questCount", { count: a }), l = i === "sequential" || i === "ladder" ? "ordered" : i;
  return ["none", "ordered", "random"].includes(l) ? `${o} · ${n(`strategy.${l}`).toLowerCase()}` : o;
}
function Jt(e, t) {
  const n = se(t.params), i = ke(t.type, t.params), a = n !== void 0 ? String(n) : "", o = a && i ? `${a} × ${i}` : a || i;
  return o ? `${te(e, t.type)} · ${o}` : te(e, t.type);
}
function We(e) {
  return e.stages.flatMap((t) => t.objectives);
}
function Yt(e) {
  const t = We(e), n = t.map((i) => i.key);
  return t.some(
    (i) => Fe(i.type, i.params).length > 0 || n.indexOf(i.key) !== n.lastIndexOf(i.key)
  );
}
function Zt(e) {
  return Object.values(E(e.rest.actions)).reduce(
    (t, n) => t + (Array.isArray(n) ? n.length : n == null ? 0 : 1),
    0
  );
}
function Ve(e) {
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
function Xt(e, t, n) {
  const i = structuredClone(e);
  i.uid = V(), i.key = J(`${e.key}_copy`, t), i.title = n(e.title), i.description = n(e.description);
  for (const [a, o] of i.stages.entries()) o.title = n(e.stages[a].title);
  return i;
}
const Te = ["player", "global"], pe = /* @__PURE__ */ new Set();
function en(e, t, n) {
  if (n && n.length > 0)
    return t && !n.includes(t) ? [...n, t] : [...n];
  const i = e?.documents?.[re];
  for (const a of Array.isArray(i) ? i : []) {
    const o = a.actorType;
    typeof o == "string" && o && pe.add(o);
  }
  return t && pe.add(t), [...Te, ...[...pe].filter((a) => !Te.includes(a)).sort()];
}
const tn = `
.aq { display: flex; flex-direction: column; gap: 16px; padding: var(--page-pad, 12px); color: var(--text); font-size: 13px; width: 100%; max-width: 1500px; margin: 0 auto; box-sizing: border-box; }
.aq .input, .aq .select { height: 34px; padding: 5px 10px; font-size: 13px; }
.aq .textarea { padding: 6px 10px; font-size: 13px; min-height: 56px; resize: vertical; }
.aq-card { display: flex; flex-direction: column; border: 1px solid var(--border-soft); border-radius: var(--r-md); background: var(--surface-raised); min-width: 0; }
.aq-pad { padding: 14px 16px; gap: 10px; }
.aq-card-head { display: flex; align-items: center; gap: 10px; padding: 12px 16px; }
.aq-h { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--text); }
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
`, nn = /^(\d+|(\d+[dhms])+)$/, an = ["actor_load", "period_reset", "quest_complete"], rn = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
function on(e, t) {
  const n = Nt(e, /* @__PURE__ */ new Date());
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
function sn({ projectId: e, documentId: t, document: n, item: i }) {
  ot("msquests", tn);
  const a = n, o = st(e), l = lt(), c = At(), [s, d] = $(i ?? null);
  ve(() => {
    d(i ?? null);
  }, [i]);
  const m = (v) => {
    d(v), ut({ documentId: t, item: v });
  }, x = { projectId: e, project: o, lang: l, t: c, edit: (v, p) => {
    const h = structuredClone(a);
    v(h), dt({ projectId: e, kind: re, id: t, doc: h, texts: p });
  } }, f = s ? a.quests.findIndex((v) => v.uid === s) : -1;
  return /* @__PURE__ */ r("div", { className: "aq", children: f >= 0 ? /* @__PURE__ */ r(vn, { ctx: x, group: a, index: f, onLeave: () => m(null) }, s) : /* @__PURE__ */ r(pn, { ctx: x, group: a, onOpen: m }) });
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
function ln() {
  return /* @__PURE__ */ y("svg", { "aria-hidden": "true", width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: [
    /* @__PURE__ */ r("circle", { cx: "3", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "8", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "13", cy: "8", r: "1.5" })
  ] });
}
function C({ tone: e, children: t }) {
  return /* @__PURE__ */ r("span", { className: `aq-chip${e ? ` is-${e}` : ""}`, children: t });
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
function A({
  label: e,
  children: t,
  hint: n,
  title: i
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the control is the child
    /* @__PURE__ */ y("label", { className: "aq-field", title: i, children: [
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
  placeholder: l
}) {
  const c = pt(e.project);
  return /* @__PURE__ */ r(
    mt,
    {
      className: "aq-field",
      label: t,
      langs: c,
      activeLang: e.lang,
      defaultLang: c[0] ?? e.lang,
      values: Me(e.project, n.key),
      onChange: (s, d) => e.edit(() => {
      }, [{ key: n.key, lang: s, value: d }]),
      inline: o,
      renderEditor: (s) => /* @__PURE__ */ r(
        ft,
        {
          value: s.value,
          onChange: s.onChange,
          placeholder: s.fallback ?? l,
          multiline: i,
          rows: i ? a : void 0,
          "aria-label": s.label
        }
      )
    }
  );
}
function cn(e) {
  return typeof e == "number" ? String(e) : typeof e == "string" ? e : "";
}
function P({
  label: e,
  value: t,
  onChange: n,
  placeholder: i
}) {
  return /* @__PURE__ */ r(A, { label: e, children: /* @__PURE__ */ r(
    "input",
    {
      className: "input",
      type: "number",
      min: 0,
      step: 1,
      value: cn(t),
      placeholder: i,
      onChange: (a) => {
        const o = a.target.value.trim();
        n(o === "" ? void 0 : Math.max(0, Math.trunc(Number(o))));
      }
    }
  ) });
}
function dn(e) {
  const t = Je(e);
  return t !== "" && t !== "none";
}
function Je(e) {
  return typeof e.strategy == "string" ? e.strategy.toLowerCase() : "";
}
function j(e, t, n) {
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
  const [a, o] = $(!1);
  return a ? /* @__PURE__ */ y("span", { className: "aq-confirm", children: [
    /* @__PURE__ */ r(U, { size: "sm", variant: "ghost", onClick: () => o(!1), children: e("cancel") }),
    /* @__PURE__ */ r("button", { type: "button", className: "aq-danger", onClick: i, children: e("remove") })
  ] }) : /* @__PURE__ */ r(le, { label: t, onClick: () => n ? i() : o(!0), children: "×" });
}
function un({
  label: e,
  children: t
}) {
  const [n, i] = $(!1), a = xt(null);
  return ve(() => {
    if (!n) return;
    const o = (c) => {
      a.current?.contains(c.target) || i(!1);
    }, l = (c) => {
      c.key === "Escape" && (c.preventDefault(), i(!1));
    };
    return window.addEventListener("mousedown", o), window.addEventListener("keydown", l, !0), () => {
      window.removeEventListener("mousedown", o), window.removeEventListener("keydown", l, !0);
    };
  }, [n]), /* @__PURE__ */ y("div", { className: "aq-menu-anchor", ref: a, children: [
    /* @__PURE__ */ r(le, { label: e, expanded: n, onClick: () => i(!n), children: /* @__PURE__ */ r(ln, {}) }),
    n && /* @__PURE__ */ r("div", { className: "aq-menu", role: "menu", children: t(() => i(!1)) })
  ] });
}
function Ye(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n, i) => {
    const a = t.has(n) ? `${n}#${i}` : n;
    return t.add(n), a;
  });
}
function pn({
  ctx: e,
  group: t,
  onOpen: n
}) {
  const { t: i, edit: a, project: o, lang: l } = e, [c, s] = $(t.quests.length === 0), [d, m] = $(null), g = we(t), x = Object.keys(t.rest).filter((p) => p !== "actions"), f = () => {
    const p = K(), h = V();
    a(
      (b) => {
        b.quests.push({
          key: J(
            "quest",
            b.quests.map((k) => k.key)
          ),
          uid: h,
          tier: "",
          title: { key: p },
          description: { key: K() },
          duration: "",
          stages: [et(1)],
          rest: {}
        });
      },
      [{ key: p, lang: l, value: i("newQuestTitle") }]
    ), n(h);
  }, v = (p) => {
    const h = [], b = (k) => {
      const w = K();
      for (const [N, T] of Object.entries(Me(o, k.key)))
        T !== "" && h.push({ key: w, lang: N, value: T });
      return { key: w };
    };
    a((k) => {
      k.quests.splice(
        p + 1,
        0,
        Xt(
          k.quests[p],
          k.quests.map((w) => w.key),
          b
        )
      );
    }, h);
  };
  return /* @__PURE__ */ y(H, { children: [
    /* @__PURE__ */ y("section", { className: "aq-card", children: [
      /* @__PURE__ */ y(
        "button",
        {
          type: "button",
          className: "aq-fold-head",
          "aria-expanded": c,
          onClick: () => s(!c),
          children: [
            /* @__PURE__ */ r(Y, { open: c }),
            /* @__PURE__ */ r("span", { className: "aq-h", children: i("groupSettings") }),
            !c && /* @__PURE__ */ r(fn, { ctx: e, group: t })
          ]
        }
      ),
      c && /* @__PURE__ */ r(hn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ y("section", { className: "aq-card", children: [
      /* @__PURE__ */ y("div", { className: "aq-card-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: i("quests") }),
        /* @__PURE__ */ r("span", { className: "aq-count", children: t.quests.length }),
        /* @__PURE__ */ r("span", { className: "aq-grow" }),
        /* @__PURE__ */ y(U, { size: "sm", variant: "primary", onClick: f, children: [
          "+ ",
          i("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: i("noQuests") }),
      /* @__PURE__ */ r(
        ge,
        {
          ids: t.quests.map((p) => p.uid),
          onMove: (p, h) => a((b) => Ne(b.quests, p, h)),
          className: "aq-quests",
          itemClassName: "aq-quest",
          children: (p, h) => {
            const b = t.quests[p], k = G(R(o, b.title.key, l)) || b.key, w = We(b), N = Ve(b.rest), T = t.tiers.find((q) => q.key === b.tier), u = Zt(b);
            return /* @__PURE__ */ y(H, { children: [
              h,
              g && /* @__PURE__ */ r("span", { className: "aq-n", children: p + 1 }),
              /* @__PURE__ */ y("button", { type: "button", className: "aq-quest-main", onClick: () => n(b.uid), children: [
                /* @__PURE__ */ r("span", { className: "aq-quest-title", children: k }),
                /* @__PURE__ */ r("span", { className: "aq-quest-sub", children: w.length === 0 ? i("noObjectivesShort") : w.map((q) => Jt(i, q)).join("  ·  ") })
              ] }),
              d === b.uid ? /* @__PURE__ */ y("span", { className: "aq-confirm", children: [
                /* @__PURE__ */ r("span", { children: i("removeConfirm", { name: k }) }),
                /* @__PURE__ */ r(U, { size: "sm", variant: "ghost", onClick: () => m(null), children: i("cancel") }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "aq-danger",
                    onClick: () => {
                      m(null), a((q) => {
                        q.quests.splice(p, 1);
                      });
                    },
                    children: i("remove")
                  }
                )
              ] }) : /* @__PURE__ */ y(H, { children: [
                /* @__PURE__ */ y("span", { className: "aq-chips", children: [
                  Yt(b) && /* @__PURE__ */ r(C, { tone: "warn", children: i("toComplete") }),
                  g && N.length > 0 && /* @__PURE__ */ y(C, { children: [
                    i("completedWhen"),
                    " ",
                    Ae(N) !== null ? /* @__PURE__ */ r("span", { className: "aq-mono", children: Ae(N) }) : i("conditionCount", { count: N.length })
                  ] }),
                  b.tier && /* @__PURE__ */ r(C, { children: T && G(R(o, T.title.key, l)) || b.tier }),
                  b.duration && /* @__PURE__ */ r(C, { children: b.duration }),
                  u > 0 && /* @__PURE__ */ r(C, { children: u === 1 ? i("actionCountOne") : i("actionCount", { count: u }) })
                ] }),
                /* @__PURE__ */ r(un, { label: i("moreActions"), children: (q) => /* @__PURE__ */ y(H, { children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      onClick: () => {
                        q(), v(p);
                      },
                      children: i("duplicate")
                    }
                  ),
                  /* @__PURE__ */ y(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      className: "is-danger",
                      onClick: () => {
                        q(), m(b.uid);
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
function Ze(e, t) {
  return t === "player" || t === "global" || t === "guild" ? e(`actor.${t}`) : t;
}
const mn = "quests:actor_types";
function fe(e) {
  const t = Je(e);
  return t === "sequential" || t === "ladder" ? "ordered" : t === "none" || t === "random" ? t : "";
}
function fn({ ctx: e, group: t }) {
  const { t: n } = e, i = Pe(), a = typeof t.reset.cron == "string" ? t.reset.cron : "", o = fe(t.distribution), l = Object.keys(E(t.rest.actions)).length, c = a ? wt(a, i) ?? a : n("noReset");
  return /* @__PURE__ */ y("span", { className: "aq-chips", children: [
    /* @__PURE__ */ r(C, { children: Ze(n, t.actorType) }),
    o && /* @__PURE__ */ r(C, { children: n(`strategy.${o}`) }),
    /* @__PURE__ */ r(C, { children: c.charAt(0).toUpperCase() + c.slice(1) }),
    t.tiers.length > 0 && /* @__PURE__ */ r(C, { children: n("tierCount", { count: t.tiers.length }) }),
    l > 0 && /* @__PURE__ */ r(C, { children: n("eventCount", { count: l }) })
  ] });
}
function hn({ ctx: e, group: t }) {
  const { t: n, edit: i, project: a, lang: o } = e, l = fe(t.distribution), c = l === "ordered", s = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], d = t.distribution.tiers ?? {}, m = ht(mn)?.map((f) => f.value), g = en(a, t.actorType, m), x = !!m?.length && !!t.actorType && !m.includes(t.actorType);
  return /* @__PURE__ */ y("div", { className: "aq-settings", children: [
    /* @__PURE__ */ y("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("identity") }),
      /* @__PURE__ */ r(Q, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ r(Q, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ y("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("actorType") }),
        /* @__PURE__ */ r(
          ie,
          {
            label: n("actorType"),
            value: t.actorType,
            options: g.map((f) => ({ value: f, label: Ze(n, f) })),
            onChange: (f) => i((v) => {
              v.actorType = f;
            })
          }
        ),
        x && /* @__PURE__ */ r("span", { className: "aq-warn", children: n("actorUnknown", { type: t.actorType }) })
      ] })
    ] }),
    /* @__PURE__ */ y("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("distribution") }),
      /* @__PURE__ */ y("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("strategy") }),
        /* @__PURE__ */ r(
          ie,
          {
            label: n("strategy"),
            value: l,
            options: ["none", "ordered", "random"].map((f) => ({
              value: f,
              label: n(`strategy.${f}`)
            })),
            onChange: (f) => i((v) => {
              f === "ordered" && fe(v.distribution) === "ordered" || (v.distribution.strategy = f === "ordered" ? "sequential" : f);
            })
          }
        )
      ] }),
      !c && /* @__PURE__ */ y(H, { children: [
        /* @__PURE__ */ y("div", { className: "aq-row", children: [
          /* @__PURE__ */ r(
            P,
            {
              label: n("amount"),
              value: t.distribution.amount,
              onChange: (f) => i((v) => j(v.distribution, "amount", f))
            }
          ),
          /* @__PURE__ */ r(
            P,
            {
              label: n("maxActive"),
              value: t.limits.max_active,
              onChange: (f) => i((v) => j(v.limits, "max_active", f))
            }
          )
        ] }),
        /* @__PURE__ */ y("div", { className: "aq-field", children: [
          /* @__PURE__ */ r("span", { className: "field-label", children: n("triggers") }),
          an.map((f) => /* @__PURE__ */ y("label", { className: "aq-check", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: s.includes(f),
                onChange: (v) => i((p) => {
                  const h = Array.isArray(p.distribution.triggers) ? p.distribution.triggers : [], b = v.target.checked ? [...h, f] : h.filter((k) => k !== f);
                  j(p.distribution, "triggers", b.length ? b : void 0);
                })
              }
            ),
            n(`trigger.${f}`)
          ] }, f))
        ] })
      ] }),
      /* @__PURE__ */ r(
        P,
        {
          label: n("questsPerPeriod"),
          placeholder: n("noLimit"),
          value: t.limits.max_per_period,
          onChange: (f) => i((v) => j(v.limits, "max_per_period", f))
        }
      ),
      !c && /* @__PURE__ */ y("div", { className: "aq-row", children: [
        /* @__PURE__ */ y("label", { className: "aq-check", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: t.rotation.enabled === !0,
              onChange: (f) => i((v) => j(v.rotation, "enabled", f.target.checked ? !0 : void 0))
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
            onChange: (f) => i((v) => j(v.rotation, "max_per_period", f))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ y("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("reset") }),
      /* @__PURE__ */ r(yn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ y("div", { className: "aq-block", children: [
      /* @__PURE__ */ y("div", { className: "aq-block-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("tiers") }),
        /* @__PURE__ */ y(
          U,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => i((f) => {
              f.tiers.push({
                key: J(
                  "tier",
                  f.tiers.map((v) => v.key)
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
      t.tiers.map((f, v) => /* @__PURE__ */ y("div", { className: "aq-tier", children: [
        /* @__PURE__ */ r(Q, { ctx: e, label: n("title"), node: f.title }),
        /* @__PURE__ */ r(A, { label: n("tierKey"), children: /* @__PURE__ */ r(
          "input",
          {
            className: "input aq-mono",
            defaultValue: f.key,
            onBlur: (p) => {
              const h = oe(p.target.value);
              h !== f.key && i((b) => {
                const k = J(
                  h,
                  b.tiers.map((N) => N.key)
                );
                b.tiers[v].key = k;
                for (const N of b.quests) N.tier === f.key && (N.tier = k);
                const w = b.distribution.tiers;
                w && f.key in w && (w[k] = w[f.key], delete w[f.key]);
              });
            }
          }
        ) }),
        !c && /* @__PURE__ */ r(
          P,
          {
            label: n("perTier"),
            value: d[f.key],
            onChange: (p) => i((h) => {
              const b = { ...h.distribution.tiers ?? {} };
              j(b, f.key, p), j(h.distribution, "tiers", Object.keys(b).length ? b : void 0);
            })
          }
        ),
        /* @__PURE__ */ r(
          _e,
          {
            t: n,
            label: n("remove"),
            sure: !t.quests.some((p) => p.tier === f.key),
            onRemove: () => i((p) => {
              p.tiers.splice(v, 1);
            })
          }
        )
      ] }, f.key)),
      t.tiers.length === 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: n("noTier") })
    ] }),
    /* @__PURE__ */ r("div", { className: "aq-block is-wide", children: /* @__PURE__ */ r(
      Xe,
      {
        ctx: e,
        title: n("hooks"),
        hooks: Kt,
        label: (f) => n(`hook.${f}`),
        value: t.rest.actions,
        onChange: (f, v) => i((p) => {
          const h = { ...E(p.rest.actions) };
          j(h, f, v), j(p.rest, "actions", Object.keys(h).length ? h : void 0);
        })
      },
      t.uid
    ) })
  ] });
}
function yn({ ctx: e, group: t }) {
  const { t: n, edit: i } = e, a = Pe(), o = typeof t.reset.cron == "string" ? t.reset.cron : "", l = _t(o), [c, s] = $(!1), d = c && o !== "" ? { kind: "custom" } : l, m = typeof t.reset.timezone == "string" ? t.reset.timezone : "", g = o && de(o) ? on(o, a) : null, x = (p) => {
    const h = jt(p);
    h !== null && i((b) => j(b.reset, "cron", h));
  }, f = "time" in d ? d.time : "04:00", v = (p) => {
    s(p === "custom"), p === "never" ? x({ kind: p }) : p === "daily" ? x({ kind: p, time: f }) : p === "weekly" ? x({ kind: p, time: f, day: 1 }) : p === "monthly" ? x({ kind: p, time: f, day: 1 }) : o === "" && i((h) => j(h.reset, "cron", "0 4 * * *"));
  };
  return /* @__PURE__ */ y(H, { children: [
    /* @__PURE__ */ r(
      ie,
      {
        label: n("reset"),
        value: d.kind,
        options: ["never", "daily", "weekly", "monthly", "custom"].map((p) => ({
          value: p,
          label: n(`reset.${p}`)
        })),
        onChange: v
      }
    ),
    d.kind !== "never" && /* @__PURE__ */ y("div", { className: "aq-row aq-reset", children: [
      d.kind === "weekly" && /* @__PURE__ */ r(A, { label: n("resetDay"), children: /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: d.day,
          onChange: (p) => x({ ...d, day: Number(p.target.value) }),
          children: [1, 2, 3, 4, 5, 6, 0].map((p) => /* @__PURE__ */ r("option", { value: p, children: Ct(a)[p] }, p))
        }
      ) }),
      d.kind === "monthly" && /* @__PURE__ */ r(
        P,
        {
          label: n("resetDayOfMonth"),
          value: d.day,
          onChange: (p) => x({ ...d, day: p ?? 1 })
        }
      ),
      d.kind === "custom" ? /* @__PURE__ */ r(
        A,
        {
          label: n("cron"),
          hint: de(o) ? void 0 : /* @__PURE__ */ r("span", { className: "aq-err", children: n("cronInvalid") }),
          children: /* @__PURE__ */ r(
            "input",
            {
              className: "input aq-mono",
              value: o,
              placeholder: "0 4 * * *",
              onChange: (p) => i((h) => j(h.reset, "cron", p.target.value))
            }
          )
        }
      ) : /* @__PURE__ */ r(A, { label: n("resetTime"), children: /* @__PURE__ */ r(
        "input",
        {
          className: "input",
          type: "time",
          value: d.time,
          onChange: (p) => p.target.value && x({ ...d, time: p.target.value })
        }
      ) })
    ] }),
    o && de(o) && (m || g) && /* @__PURE__ */ r("span", { className: "aq-ok", children: m && m !== rn ? m : g ? n("nextRun", { when: g }) : "" })
  ] });
}
function gn({
  ctx: e,
  value: t,
  onChange: n
}) {
  const { chain: i, legacy: a } = Pt(t);
  return /* @__PURE__ */ y("div", { className: "aq-chain", children: [
    /* @__PURE__ */ r(
      yt,
      {
        projectId: e.projectId,
        value: i,
        onChange: (o) => n(Ee(o, a))
      }
    ),
    a.length > 0 && /* @__PURE__ */ r("div", { className: "aq-legacy", title: e.t("legacySteps"), children: a.map((o, l) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
      /* @__PURE__ */ y("div", { className: "aq-legacy-row", children: [
        /* @__PURE__ */ r("code", { children: Ht(o) }),
        /* @__PURE__ */ r(
          le,
          {
            label: e.t("remove"),
            onClick: () => n(Ee(i, a.filter((c, s) => s !== l))),
            children: "×"
          }
        )
      ] }, l)
    )) })
  ] });
}
function Xe({
  ctx: e,
  title: t,
  hooks: n,
  label: i,
  value: a,
  onChange: o
}) {
  const { t: l } = e, c = E(a), [s, d] = $([]), [m, g] = $(null), x = n.filter((v) => c[v] != null || s.includes(v)), f = n.filter((v) => !x.includes(v));
  return /* @__PURE__ */ y(H, { children: [
    /* @__PURE__ */ y("div", { className: "aq-block-head", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: t }),
      f.length > 0 && /* @__PURE__ */ y(
        "select",
        {
          className: "select aq-event-add",
          "aria-label": l("addEvent"),
          value: "",
          onChange: (v) => {
            const p = f.find((h) => h === v.target.value);
            p && (d((h) => [...h, p]), g(p));
          },
          children: [
            /* @__PURE__ */ y("option", { value: "", children: [
              "+ ",
              l("addEvent")
            ] }),
            f.map((v) => /* @__PURE__ */ r("option", { value: v, children: i(v) }, v))
          ]
        }
      )
    ] }),
    x.map((v) => {
      const p = m === v, h = Array.isArray(c[v]) ? c[v].length : c[v] ? 1 : 0;
      return /* @__PURE__ */ y("div", { className: `aq-line${p ? " is-open" : ""}`, children: [
        /* @__PURE__ */ y("div", { className: "aq-line-head", children: [
          /* @__PURE__ */ y(
            "button",
            {
              type: "button",
              className: "aq-line-main",
              "aria-expanded": p,
              onClick: () => g(p ? null : v),
              children: [
                /* @__PURE__ */ r(Y, { open: p }),
                /* @__PURE__ */ r("span", { className: "aq-line-text", children: i(v) }),
                h > 0 && /* @__PURE__ */ r(C, { children: h === 1 ? l("actionCountOne") : l("actionCount", { count: h }) })
              ]
            }
          ),
          /* @__PURE__ */ r(
            _e,
            {
              t: l,
              label: l("removeEvent"),
              sure: h === 0,
              onRemove: () => {
                d((b) => b.filter((k) => k !== v)), o(v, void 0);
              }
            }
          )
        ] }),
        p && /* @__PURE__ */ r("div", { className: "aq-line-body", children: /* @__PURE__ */ r(gn, { ctx: e, value: c[v], onChange: (b) => o(v, b) }) })
      ] }, v);
    })
  ] });
}
function et(e) {
  return {
    key: `stage_${e}`,
    title: { key: K() },
    flow: "parallel",
    objectives: [],
    rest: {}
  };
}
function vn({
  ctx: e,
  group: t,
  index: n,
  onLeave: i
}) {
  const { t: a, edit: o, project: l, lang: c } = e, s = t.quests[n], d = (u, q) => o((_) => u(_.quests[n]), q), m = t.quests.some((u, q) => q !== n && u.key === s.key), g = s.duration !== "" && !nn.test(s.duration.replace(/\s/g, "").toLowerCase()), x = Object.keys(s.rest).filter(
    (u) => u !== "actions" && u !== "giver" && u !== "completed_when"
  ), f = we(t), v = s.rest.giver && typeof s.rest.giver == "object" ? s.rest.giver : {}, p = (u, q) => d((_) => {
    const I = { ...v };
    j(I, u, q.trim()), typeof I.npc == "string" && I.npc !== "" ? _.rest.giver = I : delete _.rest.giver;
  }), h = typeof v.npc == "string" ? v.npc : "", b = dn(t.distribution), k = t.tiers.find((u) => u.key === s.tier), [w, N] = $(!1), T = w || m || g;
  return ve(() => {
    const u = (q) => {
      q.key !== "Escape" || q.defaultPrevented || q.target?.closest("input, textarea, select, [contenteditable='true']") || window.document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]') || (q.preventDefault(), i());
    };
    return window.addEventListener("keydown", u, !0), () => window.removeEventListener("keydown", u, !0);
  }, [i]), /* @__PURE__ */ y("div", { className: "aq-quest-page", children: [
    /* @__PURE__ */ y("div", { className: "aq-quest-col", children: [
      /* @__PURE__ */ y("section", { className: "aq-card", children: [
        /* @__PURE__ */ y("div", { className: "aq-quest-head", children: [
          /* @__PURE__ */ r("div", { className: "aq-quest-name", children: /* @__PURE__ */ r(Q, { ctx: e, label: a("questName"), node: s.title }) }),
          /* @__PURE__ */ r(
            Q,
            {
              ctx: e,
              multiline: !0,
              rows: 2,
              label: a("questDescription"),
              node: s.description
            }
          )
        ] }),
        /* @__PURE__ */ y(
          "button",
          {
            type: "button",
            className: "aq-fold-head is-inner",
            "aria-expanded": T,
            onClick: () => N(!T),
            children: [
              /* @__PURE__ */ r(Y, { open: T }),
              /* @__PURE__ */ r("span", { className: "aq-fold-title", children: a("questSettings") }),
              !T && /* @__PURE__ */ y("span", { className: "aq-chips", children: [
                s.tier && /* @__PURE__ */ r(C, { children: k && G(R(l, k.title.key, c)) || s.tier }),
                /* @__PURE__ */ r(C, { children: s.duration || a("noTimeLimit") }),
                h && /* @__PURE__ */ r(C, { children: a("givenBy", { npc: h }) }),
                /* @__PURE__ */ r(C, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: s.key }) })
              ] })
            ]
          }
        ),
        T && /* @__PURE__ */ y("div", { className: "aq-fold-body", children: [
          /* @__PURE__ */ y("div", { className: "aq-row aq-top aq-wrap", children: [
            t.tiers.length > 0 || s.tier ? /* @__PURE__ */ r(A, { label: a("tier"), children: /* @__PURE__ */ y(
              "select",
              {
                className: "select",
                value: s.tier,
                onChange: (u) => d((q) => {
                  q.tier = u.target.value;
                }),
                children: [
                  /* @__PURE__ */ r("option", { value: "", children: a("noTier") }),
                  t.tiers.map((u) => /* @__PURE__ */ r("option", { value: u.key, children: G(R(l, u.title.key, c)) || u.key }, u.key)),
                  s.tier && !k && /* @__PURE__ */ r("option", { value: s.tier, children: s.tier })
                ]
              }
            ) }) : null,
            /* @__PURE__ */ r(
              A,
              {
                label: a("duration"),
                hint: g ? /* @__PURE__ */ r("span", { className: "aq-err", children: a("durationInvalid") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input",
                    value: s.duration,
                    placeholder: "24h",
                    onChange: (u) => d((q) => {
                      q.duration = u.target.value.trim();
                    })
                  }
                )
              }
            ),
            /* @__PURE__ */ r(
              A,
              {
                label: a("key"),
                hint: m ? /* @__PURE__ */ r("span", { className: "aq-err", children: a("keyTaken") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input aq-mono",
                    value: s.key,
                    onChange: (u) => d((q) => {
                      q.key = Qe(u.target.value);
                    }),
                    onBlur: () => {
                      const u = oe(s.key);
                      u !== s.key && d((q) => {
                        q.key = u;
                      });
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ y("div", { className: "aq-row aq-top aq-wrap", children: [
            /* @__PURE__ */ r(A, { label: a("giverNpc"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: h,
                onChange: (u) => p("npc", u.target.value)
              }
            ) }),
            h && /* @__PURE__ */ r(A, { label: a("giverConversation"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: typeof v.conversation == "string" ? v.conversation : "",
                onChange: (u) => p("conversation", u.target.value)
              }
            ) })
          ] }),
          h && b && /* @__PURE__ */ r("span", { className: "aq-warn", children: a("giverDistributed") })
        ] })
      ] }),
      /* @__PURE__ */ r(
        ge,
        {
          ids: Ye(s.stages.map((u) => u.key)),
          onMove: (u, q) => d((_) => Ne(_.stages, u, q)),
          className: "aq-stages",
          children: (u, q) => /* @__PURE__ */ r(
            bn,
            {
              ctx: e,
              quest: s,
              stage: s.stages[u],
              si: u,
              handle: q,
              editQuest: d
            }
          )
        }
      ),
      /* @__PURE__ */ y(
        U,
        {
          size: "sm",
          variant: "ghost",
          className: "aq-add",
          onClick: () => d((u) => {
            const q = J(
              `stage_${u.stages.length + 1}`,
              u.stages.map((_) => _.key)
            );
            u.stages.push({ ...et(u.stages.length + 1), key: q });
          }),
          children: [
            "+ ",
            a("addStage")
          ]
        }
      ),
      f && /* @__PURE__ */ y("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: a("completedWhen") }),
        /* @__PURE__ */ r(
          ct,
          {
            projectId: e.projectId,
            value: Ve(s.rest),
            emptyHint: a("completedWhenEmpty"),
            onChange: (u) => d((q) => j(q.rest, "completed_when", u.length > 0 ? u : void 0))
          },
          s.uid
        )
      ] }),
      /* @__PURE__ */ y("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r(
          Xe,
          {
            ctx: e,
            title: a("questEvents"),
            hooks: Gt,
            label: (u) => a(`questHook.${u}`),
            value: s.rest.actions,
            onChange: (u, q) => d((_) => {
              const I = { ...E(_.rest.actions) };
              j(I, u, q), j(_.rest, "actions", Object.keys(I).length > 0 ? I : void 0);
            })
          },
          s.uid
        ),
        x.length > 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: a("kept", { fields: x.join(", ") }) })
      ] })
    ] }),
    /* @__PURE__ */ y("aside", { className: "aq-card aq-pad aq-aside", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: a("preview") }),
      /* @__PURE__ */ r(Nn, { ctx: e, quest: s })
    ] })
  ] });
}
function bn({
  ctx: e,
  quest: t,
  stage: n,
  si: i,
  handle: a,
  editQuest: o
}) {
  const { t: l } = e, [c, s] = $(null), [d, m] = $(!1), g = (h) => o((b) => h(b.stages[i])), x = n.flow || "parallel", f = t.stages.flatMap((h) => h.objectives.map((b) => b.key)), v = d || n.objectives.length === 0, p = (h) => {
    const b = Ot(h, f);
    o((k) => {
      k.stages[i].objectives.push({ key: b, type: h, params: Be(h) });
    }), s(b), m(!1);
  };
  return /* @__PURE__ */ y("div", { className: "aq-card aq-stage", children: [
    /* @__PURE__ */ y("div", { className: "aq-stage-head", children: [
      a,
      /* @__PURE__ */ r("span", { className: "aq-eyebrow aq-stage-label", children: l("stage", { n: i + 1 }) }),
      /* @__PURE__ */ r("div", { className: "aq-stage-title", children: /* @__PURE__ */ r(
        Q,
        {
          ctx: e,
          bare: !0,
          label: l("stageName"),
          node: n.title,
          placeholder: l("stageNameDefault", { n: i + 1 })
        }
      ) }),
      n.objectives.length > 1 && /* @__PURE__ */ r(
        ie,
        {
          label: l("flow"),
          value: x,
          options: ["parallel", "sequential"].map((h) => ({
            value: h,
            label: l(`flow.${h}`)
          })),
          onChange: (h) => g((b) => {
            b.flow = h;
          })
        }
      ),
      /* @__PURE__ */ r(
        _e,
        {
          t: l,
          label: l("remove"),
          sure: n.objectives.length === 0,
          onRemove: () => o((h) => {
            h.stages.splice(i, 1);
          })
        }
      )
    ] }),
    /* @__PURE__ */ y("span", { className: "aq-eyebrow", children: [
      l("objectives"),
      " ",
      /* @__PURE__ */ r("span", { className: "aq-count", children: n.objectives.length })
    ] }),
    /* @__PURE__ */ r(
      ge,
      {
        ids: Ye(n.objectives.map((h) => h.key)),
        onMove: (h, b) => g((k) => Ne(k.objectives, h, b)),
        className: "aq-objectives",
        children: (h, b) => {
          const k = n.objectives[h];
          return /* @__PURE__ */ r(
            qn,
            {
              t: l,
              projectId: e.projectId,
              n: x === "sequential" ? `${i + 1}.${h + 1}` : "",
              objective: k,
              open: c === k.key,
              onToggle: () => s(c === k.key ? null : k.key),
              keyTaken: f.filter((w) => w === k.key).length > 1,
              handle: b,
              onChange: (w) => g((N) => w(N.objectives[h])),
              onRename: (w) => {
                c === k.key && s(w);
              },
              onRemove: () => g((w) => {
                w.objectives.splice(h, 1);
              })
            }
          );
        }
      }
    ),
    v ? /* @__PURE__ */ y("div", { className: "aq-types", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: l("addObjective") }),
      /* @__PURE__ */ r("div", { className: "aq-seg", children: qe.map((h) => /* @__PURE__ */ y("button", { type: "button", className: "aq-opt", onClick: () => p(h.type), children: [
        /* @__PURE__ */ r("span", { "aria-hidden": !0, children: h.icon }),
        " ",
        l(`objective.${h.type}`)
      ] }, h.type)) })
    ] }) : /* @__PURE__ */ y(U, { size: "sm", variant: "ghost", className: "aq-add", onClick: () => m(!0), children: [
      "+ ",
      l("addObjective")
    ] })
  ] });
}
function qn({
  t: e,
  projectId: t,
  n,
  objective: i,
  open: a,
  onToggle: o,
  keyTaken: l,
  handle: c,
  onChange: s,
  onRename: d,
  onRemove: m
}) {
  const g = B(i.type), x = g ? g.params : Object.keys(i.params).map((u) => ({ name: u, kind: "text" })), f = se(i.params), v = ke(i.type, i.params), p = Fe(i.type, i.params), h = l || p.length > 0, b = x.filter((u) => u.advanced), [k, w] = $(!1), N = k || l, T = (u) => u.kind === "item" ? /* @__PURE__ */ r(
    xn,
    {
      t: e,
      projectId: t,
      spec: u,
      params: i.params,
      onChange: (q) => s((_) => q(_.params))
    },
    u.name
  ) : /* @__PURE__ */ r(
    kn,
    {
      t: e,
      spec: u,
      value: i.params[u.name],
      onChange: (q) => s((_) => j(_.params, u.name, q))
    },
    u.name
  );
  return /* @__PURE__ */ y("div", { className: `aq-obj${a ? " is-open" : ""}${h ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ y("div", { className: "aq-obj-line", children: [
      c,
      /* @__PURE__ */ y("button", { type: "button", className: "aq-obj-main", onClick: o, "aria-expanded": a, children: [
        n && /* @__PURE__ */ r("span", { className: "aq-obj-n", children: n }),
        /* @__PURE__ */ r("span", { className: "aq-obj-icon", "aria-hidden": !0, children: g?.icon ?? "?" }),
        /* @__PURE__ */ y("span", { className: "aq-obj-text", children: [
          te(e, i.type),
          f !== void 0 && /* @__PURE__ */ y("strong", { children: [
            " · ",
            String(f)
          ] }),
          v ? ` × ${v}` : f !== void 0 && g ? ` × ${e("any")}` : ""
        ] }),
        h && /* @__PURE__ */ r(C, { tone: "warn", children: l ? e("objectiveKeyTaken") : e("missing", {
          fields: p.map((u) => e(`param.${u}`)).join(", ")
        }) }),
        /* @__PURE__ */ r(Y, { open: a })
      ] }),
      /* @__PURE__ */ r(le, { label: e("remove"), onClick: m, children: "×" })
    ] }),
    a && /* @__PURE__ */ y("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ y("div", { className: "aq-row aq-top aq-wrap", children: [
        /* @__PURE__ */ r(A, { label: e("type"), children: /* @__PURE__ */ y(
          "select",
          {
            className: "select",
            value: i.type,
            onChange: (u) => s((q) => {
              q.type = u.target.value, q.params = Be(q.type);
            }),
            children: [
              qe.map((u) => /* @__PURE__ */ y("option", { value: u.type, children: [
                u.icon,
                " ",
                e(`objective.${u.type}`)
              ] }, u.type)),
              !g && /* @__PURE__ */ r("option", { value: i.type, children: i.type })
            ]
          }
        ) }),
        x.filter((u) => !u.advanced).map(T)
      ] }),
      /* @__PURE__ */ y(
        "button",
        {
          type: "button",
          className: "aq-fold-head is-inner",
          "aria-expanded": N,
          onClick: () => w(!N),
          children: [
            /* @__PURE__ */ r(Y, { open: N }),
            /* @__PURE__ */ r("span", { className: "aq-fold-title", children: e("more") }),
            !N && /* @__PURE__ */ r(C, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: i.key }) })
          ]
        }
      ),
      N && /* @__PURE__ */ y("div", { className: "aq-row aq-top aq-wrap", children: [
        b.map(T),
        /* @__PURE__ */ r(
          A,
          {
            label: e("key"),
            title: e("objectiveKeyHint"),
            hint: l ? /* @__PURE__ */ r("span", { className: "aq-err", children: e("objectiveKeyTaken") }) : void 0,
            children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: i.key,
                onChange: (u) => {
                  const q = Qe(u.target.value);
                  s((_) => {
                    _.key = q;
                  }), d(q);
                },
                onBlur: () => {
                  const u = oe(i.key);
                  u !== i.key && (s((q) => {
                    q.key = u;
                  }), d(u));
                }
              }
            )
          }
        )
      ] })
    ] })
  ] });
}
function xn({
  t: e,
  projectId: t,
  spec: n,
  params: i,
  onChange: a
}) {
  const o = xe(i, n), l = Array.isArray(i.match) ? i.match : void 0, c = (s, d) => a((m) => Qt(m, n, s, d));
  return /* @__PURE__ */ r(A, { label: e(`param.${n.name}`), children: /* @__PURE__ */ r(
    vt,
    {
      projectId: t,
      value: o,
      match: l,
      onChange: (s) => c(s, l),
      onMatchChange: (s) => c(o, s)
    }
  ) });
}
function kn({
  t: e,
  spec: t,
  value: n,
  onChange: i
}) {
  const a = e(`param.${t.name}`), o = typeof n == "string" || typeof n == "number" ? String(n) : "";
  if (t.kind === "int")
    return /* @__PURE__ */ r(P, { label: a, value: n, onChange: i });
  if (t.kind === "material")
    return /* @__PURE__ */ r(A, { label: a, children: /* @__PURE__ */ r(
      bt,
      {
        value: o,
        placeholder: e("any"),
        "aria-label": a,
        onChange: (c) => i(c.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const l = t.kind === "entity";
  return /* @__PURE__ */ y(A, { label: a, children: [
    /* @__PURE__ */ r(
      "input",
      {
        className: `input${l ? " aq-mono" : ""}`,
        list: l ? "aq-entities" : void 0,
        value: o,
        placeholder: l ? e("any") : "",
        onChange: (c) => i(l ? c.target.value.toUpperCase().replace(/\s+/g, "_") : c.target.value)
      }
    ),
    l && /* @__PURE__ */ r("datalist", { id: "aq-entities", children: Ut.map((c) => /* @__PURE__ */ r("option", { value: c }, c)) })
  ] });
}
const wn = 170, Se = { color: "#aaaaaa", italic: !1 }, Oe = { color: "#ffffff", italic: !1 };
function Nn({ ctx: e, quest: t }) {
  const { t: n, project: i, lang: a } = e, o = (d) => d.split(`
`).flatMap((m) => m === "" ? [""] : gt(m, wn)), l = R(i, t.title.key, a) || t.key, c = R(i, t.description.key, a), s = t.stages.length > 1;
  return /* @__PURE__ */ r("div", { className: "aq-preview", children: /* @__PURE__ */ y("div", { className: "aq-preview-frame", children: [
    /* @__PURE__ */ r(Z, { source: o(l).join(`
`), defaults: Oe, scale: 2 }),
    c && /* @__PURE__ */ r(Z, { source: o(c).join(`
`), defaults: Se, scale: 2 }),
    t.stages.map((d, m) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ y("div", { className: "aq-preview-stage", children: [
        s && /* @__PURE__ */ r(
          Z,
          {
            source: o(R(i, d.title.key, a) || n("stage", { n: m + 1 })).join(`
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
      ] }, m)
    ))
  ] }) });
}
function _n({ className: e }) {
  return /* @__PURE__ */ y(
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
const jn = {
  kind: re,
  dir: Ge,
  schemaVersion: be,
  // Created in the module's folder only (SDK 1.8); a group already elsewhere still loads.
  projects: [Tt],
  // Data with no links: one "Quests" entry and page instead of a node per group (SDK 1.9).
  collection: { labels: Et },
  // A group's id is its key on the server (`quest_group_key`): typed by hand, no prefix.
  label: je.en,
  labels: je,
  icon: _n,
  component: sn,
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
  parse: (e, t) => $t(e, t),
  serialize: (e, t) => Dt(e, t),
  ltextSites: (e) => Mt(e),
  board: {
    size: { width: 300, height: 48 },
    accent: Bt,
    // The group's quests, one selectable row each: the Properties panel opens the one clicked.
    items: (e, { project: t, lang: n }) => zt(e, t, n),
    summary: (e, { lang: t }) => Vt(e, t)
  }
}, $e = "quests:groups", Re = "quests:quests", Cn = "quests:active";
function En(e) {
  return e.startsWith("msquests:") ? `quests:${e.slice(9)}` : e;
}
const Le = {
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
function An(e, t, n) {
  const i = En(t);
  if (i !== $e && i !== Re && i !== Cn) return null;
  const a = e.documents?.[re];
  if (!a || a.length === 0) return null;
  const o = e.defaultLang ?? "en", l = n?.serverRows, c = n?.params?.group || void 0, s = [...a].sort((m, g) => m.id < g.id ? -1 : m.id > g.id ? 1 : 0);
  if (i === $e) {
    const m = he(l, "key");
    return s.map((g) => Tn(g, m.get(g.id), o));
  }
  if (i === Re) {
    const m = he(l, "id");
    return s.filter((g) => !c || g.id === c).flatMap((g) => g.quests.map((x) => tt(g, x, m.get(`${g.id}:${x.key}`), o)));
  }
  if (!l) return null;
  const d = new Map(a.map((m) => [m.id, m]));
  return l.flatMap((m) => {
    const g = d.get(L(m.group));
    if (!g) return [m];
    const x = g.quests.find((f) => f.key === L(m.quest_key));
    return x ? [Rn(x, m, o)] : [];
  });
}
function Tn(e, t, n) {
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
    quests: e.quests.map((a) => tt(e, a, i.get(a.key), n))
  };
}
function tt(e, t, n, i) {
  const a = e.tiers.find((o) => o.key === t.tier);
  return {
    id: `${e.id}:${t.key}`,
    group: e.id,
    key: t.key,
    name: t.title,
    description: t.description,
    duration: Mn(t.duration),
    tier: t.tier,
    tier_name: a ? a.title : "",
    assigned: n?.assigned ?? !1,
    status_key: n?.status_key ?? "NOT_STARTED",
    status: n?.status ?? Ie[i.slice(0, 2)] ?? Ie.en,
    can_start: n?.can_start ?? !1,
    start_blocker: n?.start_blocker ?? "",
    start_blocker_label: n?.start_blocker_label ?? "",
    // `reference` in `QuestRows.questRow`: the attempt the server holds for this player.
    ...nt(t, n?.assigned === !0 ? n : void 0, i)
  };
}
function nt(e, t, n) {
  const i = t ? Sn(t) : void 0, a = On(e, i, n), o = a.find((c) => c.active === !0), l = o ? o.objectives.find((c) => c.done !== !0) : void 0;
  return {
    objective_name: l?.name ?? "",
    objective_progress: l?.progress ?? 0,
    objective_target: l?.target ?? 0,
    progress_ratio: i ? it(a.map((c) => c.progress_ratio)) : 0,
    stage_index: a.filter((c) => c.completed === !0).length,
    stage_name: o?.name ?? "",
    stage_flow: o?.flow ?? "",
    stages: a.map((c) => ({ ...c, objectives: c.objectives.map(({ done: s, ...d }) => d) }))
  };
}
function Sn(e) {
  const t = /* @__PURE__ */ new Map(), n = [
    ...ee(e.objectives),
    ...ee(e.stages).flatMap((i) => ee(i.objectives))
  ];
  for (const i of n) {
    const a = L(i.status_key);
    t.set(L(i.key), {
      progress: ye(i.progress, 0),
      flag: a === "COMPLETED" || a === "FAILED" ? a : "",
      row: i
    });
  }
  return t;
}
function On(e, t, n) {
  const i = e.stages.map((o, l) => {
    const c = o.objectives.map((s) => $n(s, t?.get(s.key), n));
    return {
      key: o.key,
      name: o.title,
      flow: Dn(o),
      index: l,
      // `QuestStage.isCompleted`: all objectives done, so an empty stage is.
      completed: t !== void 0 && c.every((s) => s.done),
      active: !1,
      progress_ratio: t ? it(c.map((s) => s.progress_ratio)) : 0,
      objectives: c
    };
  });
  if (!t) return i;
  const a = i.find((o) => o.completed !== !0);
  if (a) {
    a.active = !0;
    const o = a.objectives, l = o.find((c) => c.done !== !0);
    for (const c of o)
      c.status_key === "PENDING" && (a.flow !== "SEQUENTIAL" || c === l) && (c.status_key = "IN_PROGRESS");
  }
  return i;
}
function $n(e, t, n) {
  const i = In(e), a = t?.progress ?? 0, o = t?.row, l = o && o.type === e.type && o.target === i;
  return {
    key: e.key,
    name: l && typeof o.name == "string" ? o.name : Ln(e, n),
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
function Rn(e, t, n) {
  const i = nt(e, t, n), a = i.stages;
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
function Ln(e, t) {
  const i = (Le[t.slice(0, 2)] ?? Le.en)[e.type];
  if (!i) return e.type;
  const a = e.params, o = {
    amount: String(a.amount ?? ""),
    distance: String(a.distance ?? ""),
    command: L(a.command),
    value: L(a.value),
    // Bukkit's translation keys, as the objective configs write them (`<lang:…>`).
    crop: X("block", a.crop),
    entity_type: X("entity", a.entity_type),
    material: e.type === "block_break" ? X("block", a.material) : De(e),
    fish_type: De(e)
  };
  return i.replace(/%([a-z_]+)%/g, (l, c) => o[c] ?? "");
}
function X(e, t) {
  const n = L(t).toLowerCase().replace(/^minecraft:/, "");
  return n === "" ? "" : `<lang:${e}.minecraft.${n}>`;
}
function De(e) {
  const t = B(e.type)?.params.find((o) => o.kind === "item");
  if (!t) return "";
  const n = xe(e.params, t), i = n.title;
  if (typeof i == "string" && i.trim() !== "") return i;
  const a = L(n.material);
  return /^(minecraft:)?[a-z_0-9]+$/i.test(a) && !a.includes(":") ? X("item", a) : a || ze(n);
}
function In(e) {
  const t = se(e.params);
  if (t === void 0) return 1;
  const n = Number(t);
  return Number.isFinite(n) ? n : 1;
}
function Dn(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function Mn(e) {
  const t = e.trim().toLowerCase().replace(/ /g, "");
  if (t === "") return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const n = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!n) return 0;
  const [, i, a, o, l] = n;
  return Number(i ?? 0) * 86400 + Number(a ?? 0) * 3600 + Number(o ?? 0) * 60 + Number(l ?? 0);
}
function he(e, t) {
  return new Map((e ?? []).map((n) => [L(n[t]), n]));
}
function ee(e) {
  return Array.isArray(e) ? e.filter((t) => t && typeof t == "object") : [];
}
function it(e) {
  return e.length === 0 ? 0 : e.reduce((t, n) => t + n, 0) / e.length;
}
function ye(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function L(e) {
  return typeof e == "string" ? e : "";
}
const Pn = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: qt,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  documents: [jn],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: An
}, Qn = { ...Pn, sdk: "1.21.0" };
export {
  Qn as default
};
