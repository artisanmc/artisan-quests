import { createModuleI18n as at, fieldText as rt, newTextKey as K, textValue as R, injectModuleStyles as ot, useProject as st, useContentLang as lt, SortableList as ge, Button as B, ConditionsEditor as ct, updateDocument as dt, selectDocumentItem as ut, projectLangs as pt, LocalizedField as mt, MiniMessageInput as ft, textValues as Me, McText as Z, useUiLang as Pe, ActionChainEditor as ht, mcWrap as yt, ItemInput as gt, MaterialInput as vt, SDK_VERSION as bt } from "@artisan/editor-sdk";
import { jsx as r, jsxs as m, Fragment as H } from "react/jsx-runtime";
import { useState as O, useEffect as ve, useRef as qt } from "react";
const He = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
}, xt = /^\d+$/;
function ce(e, t, n) {
  const i = String(n).padStart(2, "0");
  return e === "fr" ? n === 0 ? `${t} h` : `${t} h ${i}` : `${String(t).padStart(2, "0")}:${i}`;
}
function $(e, t, n) {
  return xt.test(e) && Number(e) >= t && Number(e) <= n;
}
function de(e) {
  return e.trim().split(/\s+/).length === 5;
}
function kt(e, t) {
  const n = t === "fr", i = e.trim().split(/\s+/);
  if (i.length !== 5) return null;
  const [a, o, c, d, l] = i;
  if (d !== "*") return null;
  const u = /^\*\/(\d+)$/;
  if (c === "*" && l === "*") {
    if ($(a, 0, 59) && $(o, 0, 23))
      return n ? `tous les jours à ${ce(t, +o, +a)}` : `every day at ${ce(t, +o, +a)}`;
    const s = u.exec(o);
    if ($(a, 0, 59) && s)
      return n ? `toutes les ${s[1]} h, à la minute ${a}` : `every ${s[1]} hours, at minute ${a}`;
    if ($(a, 0, 59) && o === "*")
      return n ? `toutes les heures, à la minute ${a}` : `every hour, at minute ${a}`;
    const g = u.exec(a);
    return g && o === "*" ? n ? `toutes les ${g[1]} minutes` : `every ${g[1]} minutes` : null;
  }
  if (!$(a, 0, 59) || !$(o, 0, 23)) return null;
  const h = ce(t, +o, +a);
  if (c === "*" && $(l, 0, 7)) {
    const s = He[n ? "fr" : "en"][Number(l) % 7];
    return n ? `chaque ${s} à ${h}` : `every ${s} at ${h}`;
  }
  return l === "*" && $(c, 1, 31) ? n ? `le ${c === "1" ? "1er" : c} de chaque mois à ${h}` : `on day ${c} of each month at ${h}` : null;
}
function F(e, t, n) {
  const i = /* @__PURE__ */ new Set();
  for (const a of e.split(",")) {
    const o = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(a);
    if (!o) return null;
    const c = o[4] ? Number(o[4]) : 1, d = o[1] === "*" ? t : Number(o[2]), l = o[1] === "*" ? n : o[3] ? Number(o[3]) : o[4] ? n : d;
    if (c < 1 || d < t || l > n || d > l) return null;
    for (let u = d; u <= l; u += c) i.add(u);
  }
  return i;
}
function wt(e, t) {
  const n = e.trim().split(/\s+/);
  if (n.length !== 5) return null;
  const i = F(n[0], 0, 59), a = F(n[1], 0, 23), o = F(n[2], 1, 31), c = F(n[3], 1, 12), d = F(n[4], 0, 7);
  if (!i || !a || !o || !c || !d) return null;
  d.has(7) && d.add(0);
  const l = n[2] === "*", u = n[4] === "*", h = (x) => l && u ? !0 : l ? d.has(x.getDay()) : u ? o.has(x.getDate()) : o.has(x.getDate()) || d.has(x.getDay()), s = new Date(t.getTime());
  s.setSeconds(0, 0), s.setMinutes(s.getMinutes() + 1);
  const g = t.getTime() + 366 * 24 * 3600 * 1e3;
  for (; s.getTime() <= g; ) {
    if (!c.has(s.getMonth() + 1) || !h(s)) {
      s.setDate(s.getDate() + 1), s.setHours(0, 0, 0, 0);
      continue;
    }
    if (!a.has(s.getHours())) {
      s.setHours(s.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (i.has(s.getMinutes())) return s;
    s.setMinutes(s.getMinutes() + 1);
  }
  return null;
}
function Nt(e) {
  const t = e.trim().split(/\s+/);
  if (e.trim() === "") return { kind: "never" };
  if (t.length !== 5) return { kind: "custom" };
  const [n, i, a, o, c] = t;
  if (o !== "*" || !$(n, 0, 59) || !$(i, 0, 23)) return { kind: "custom" };
  const d = `${i.padStart(2, "0")}:${n.padStart(2, "0")}`;
  return a === "*" && c === "*" ? { kind: "daily", time: d } : a === "*" && $(c, 0, 7) ? { kind: "weekly", time: d, day: Number(c) % 7 } : c === "*" && $(a, 1, 31) ? { kind: "monthly", time: d, day: Number(a) } : { kind: "custom" };
}
function _t(e) {
  if (e.kind === "never") return "";
  if (e.kind === "custom") return null;
  const t = /^(\d{1,2}):(\d{2})$/.exec(e.time), n = t ? Math.min(23, Number(t[1])) : 4, i = t ? Math.min(59, Number(t[2])) : 0;
  return e.kind === "daily" ? `${i} ${n} * * *` : e.kind === "weekly" ? `${i} ${n} * * ${e.day}` : `${i} ${n} ${Math.min(31, Math.max(1, e.day))} * *`;
}
function jt(e) {
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
  reset: "Period reset",
  cron: "Schedule (cron)",
  cronInvalid: "A cron has 5 fields: minute hour day month weekday.",
  nextRun: "next: {{when}}",
  noReset: "Never resets",
  distribution: "Distribution",
  strategy: "How quests are handed out",
  "strategy.none": "All at once",
  "strategy.random": "At random",
  completedWhen: "Done when",
  completedWhenEmpty: "Once the quest is completed",
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
  reset: "Réinitialisation",
  cron: "Planification (cron)",
  cronInvalid: "Un cron a 5 champs : minute heure jour mois jour-de-semaine.",
  nextRun: "prochaine : {{when}}",
  noReset: "Jamais réinitialisé",
  distribution: "Distribution",
  strategy: "Comment les quêtes sont données",
  "strategy.none": "Toutes d'un coup",
  "strategy.random": "Au hasard",
  completedWhen: "Faite quand",
  completedWhenEmpty: "Une fois la quête terminée",
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
}, je = { en: W.kindLabel, fr: ae.kindLabel }, Ct = { en: W.collection, fr: ae.collection }, Et = at({ en: W, fr: ae });
function Ke(e) {
  const t = e === "fr" ? ae : W;
  return (n, i) => {
    const a = t[n] ?? W[n] ?? n;
    return i ? a.replace(/\{\{(\w+)\}\}/g, (o, c) => String(i[c] ?? o)) : a;
  };
}
const re = "quest_group", Ge = "quest_groups", At = "quests", be = "quest_group/v1";
function Tt(e) {
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
function St(e, t) {
  const n = new Set(t), i = new Uint8Array(4);
  for (; ; ) {
    crypto.getRandomValues(i);
    const a = Array.from(i, (c) => me[c % 32].toLowerCase()).join(""), o = `${oe(e)}_${a}`;
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
function z(e, ...t) {
  const n = { ...e };
  for (const i of t) delete n[i];
  return n;
}
function $t(e, t) {
  const n = {}, i = [];
  function a(l) {
    if (l && typeof l == "object" && !Array.isArray(l)) {
      const s = K(), g = {};
      for (const [x, v] of Object.entries(l)) g[x] = S(v);
      return n[s] = g, { key: s };
    }
    const u = typeof l == "string" ? /^\{i18n:(.+)\}$/.exec(l) : null;
    if (u) {
      const s = t.translations?.[u[1]];
      return s && (n[u[1]] = { ...s }), { key: u[1] };
    }
    const h = K();
    return n[h] = l == null || l === "" ? {} : { [t.lang]: S(l) }, { key: h };
  }
  const o = Object.entries(E(e.tiers)).map(([l, u]) => {
    const h = E(u);
    return { key: l, title: a(h.title), rest: z(h, "title") };
  }), c = ue(e.quests).map((l, u) => {
    const h = E(l), s = ue(h.stages).map((g, x) => {
      const v = E(g), f = S(v.flow).toLowerCase();
      return {
        key: S(v.key) || `stage_${x + 1}`,
        title: a(v.title),
        flow: f === "parallel" || f === "sequential" ? f : "",
        objectives: ue(v.objectives).map((y, b) => {
          const k = E(y);
          return {
            key: S(k.key) || `objective_${b + 1}`,
            type: S(k.type),
            params: z(k, "key", "type")
          };
        }),
        rest: z(v, "key", "title", "flow", "objectives")
      };
    });
    return {
      key: S(h.key) || `quest_${u + 1}`,
      uid: S(h.uid) || V(),
      tier: S(h.tier),
      title: a(h.title),
      description: a(h.description),
      duration: S(h.duration),
      stages: s,
      rest: Ot(h)
    };
  }), d = {
    id: S(e.id),
    projectId: t.projectId,
    uid: S(e.uid) || V(),
    title: a(e.title),
    description: a(e.description),
    actorType: S(e.actor_type) || "player",
    reset: E(e.reset),
    limits: E(e.limits),
    rotation: E(e.rotation),
    distribution: Tt(e.distribution),
    tiers: o,
    quests: c,
    rest: Be(z(
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
  return e.schema !== void 0 && e.schema !== be && i.push(`schema: ${String(e.schema)}`), { doc: d, i18nKeys: n, unsupported: i };
}
function Be(e) {
  return e.on !== void 0 && (e.actions == null && (e.actions = e.on), delete e.on), e;
}
function Ot(e) {
  const t = Be(
    z(e, "key", "uid", "tier", "title", "description", "duration", "stages", "reward_display")
  );
  if (t.rewards !== void 0) {
    const n = E(t.actions);
    n.complete == null && (t.actions = { ...n, complete: t.rewards }), delete t.rewards;
  }
  return t;
}
function Rt(e) {
  return typeof e == "string" ? e === "" : Object.values(e).every((t) => t === "");
}
function D(e) {
  const t = {};
  for (const [n, i] of Object.entries(e))
    i == null || i === "" || Array.isArray(i) && i.length === 0 || typeof i == "object" && !Array.isArray(i) && Object.keys(i).length === 0 || (t[n] = i);
  return t;
}
const Lt = [
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
function It(e, t) {
  const n = (u) => rt(t, u.key), i = (u) => {
    const h = n(u);
    return Rt(h) ? void 0 : h;
  }, a = {};
  for (const u of e.tiers) a[u.key] = { ...u.rest, title: n(u.title) };
  const o = e.quests.map(
    (u) => D({
      key: u.key,
      uid: u.uid,
      tier: u.tier,
      title: n(u.title),
      description: i(u.description),
      duration: u.duration,
      ...u.rest,
      stages: u.stages.map(
        (h) => D({
          key: h.key,
          title: i(h.title),
          flow: h.flow,
          ...h.rest,
          objectives: h.objectives.map((s) => ({ key: s.key, type: s.type, ...s.params }))
        })
      )
    })
  ), c = {
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
  }, d = {};
  for (const u of Lt) u in c && (d[u] = c[u]);
  for (const u of Object.keys(c)) u in d || (d[u] = c[u]);
  const l = D(d);
  return l.quests = o, l;
}
function* Dt(e) {
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
    const c = `${t}.quests.${o}`;
    yield {
      lText: a.title,
      key: `${c}.title`,
      path: `quests[${i}].title`,
      kind: "quest.title"
    }, yield {
      lText: a.description,
      key: `${c}.description`,
      path: `quests[${i}].description`,
      kind: "quest.description"
    };
    const d = /* @__PURE__ */ new Set();
    for (let l = 0; l < a.stages.length; l++) {
      const u = a.stages[l], h = d.has(u.key) ? `${u.key}_${l}` : u.key;
      d.add(u.key), yield {
        lText: u.title,
        key: `${c}.stages.${h}.title`,
        path: `quests[${i}].stages[${l}].title`,
        kind: "quest.stage"
      };
    }
  }
}
function Ce(e) {
  return !!e && typeof e == "object" && !Array.isArray(e) && "type" in e;
}
function Mt(e) {
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
function Pt(e) {
  const t = String(e.type), n = e.command ?? e.message ?? e.title ?? e.material;
  return typeof n == "string" ? `${t} · ${n}` : t;
}
const Ht = [
  "distribution",
  "actor_load",
  "quest_start",
  "objective_progress",
  "objective_complete",
  "quest_complete",
  "period_complete"
], Kt = ["start", "objective_progress", "objective_complete", "complete"], M = { name: "amount", kind: "int", required: !0 }, qe = [
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
function U(e) {
  return qe.find((t) => t.type === e);
}
function Ue(e) {
  const t = {};
  for (const n of U(e)?.params ?? [])
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
function Gt(e, t, n, i) {
  t.legacy && delete e[t.legacy];
  const a = !n || Object.keys(n).length === 0;
  a ? delete e[t.name] : e[t.name] = n, a || i === void 0 ? delete e.match : e.match = i;
}
function Fe(e) {
  const t = e.title;
  if (typeof t == "string" && t.trim() !== "") return t.replace(/<[^>]*>/g, "");
  const n = e.material ?? e.item;
  return typeof n == "string" ? n : "";
}
function ke(e, t) {
  const n = U(e);
  return n ? n.params.filter((i) => i.kind !== "int").map((i) => i.kind === "item" ? Fe(xe(t, i)) : t[i.name]).filter((i) => typeof i == "string" && i !== "").join(" = ") : Object.keys(t).map((i) => t[i]).filter((i) => typeof i == "string" && i !== "").join(" = ");
}
function ze(e, t) {
  return (U(e)?.params ?? []).filter((n) => n.required && (t[n.name] === void 0 || t[n.name] === "")).map((n) => n.name);
}
const Qt = [
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
  return U(t) ? e(`objective.${t}`) : t;
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
function Ut(e, t, n) {
  const i = Ke(n), a = we(e);
  return e.quests.map((o, c) => {
    const d = R(t, o.title.key, n);
    return {
      id: o.uid,
      label: G(d) || o.key,
      detail: o.tier || void 0,
      caption: Ft(i, o),
      marker: a ? String(c + 1) : void 0,
      hover: {
        title: d || o.key,
        text: R(t, o.description.key, n) || void 0,
        lines: zt(i, o, t, n)
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
function zt(e, t, n, i) {
  const a = t.stages.length > 1;
  return t.stages.flatMap(
    (o, c) => o.objectives.map((d) => {
      const l = ne(e, d);
      return a ? `<gray>${G(R(n, o.title.key, i)) || e("stage", { n: c + 1 })} ·</gray> ${l}` : l;
    })
  );
}
function Wt(e, t) {
  const n = Ke(t), i = typeof e.distribution?.strategy == "string" ? e.distribution.strategy.toLowerCase() : "", a = e.quests.length, o = a === 1 ? n("questCountOne") : n("questCount", { count: a }), c = i === "sequential" || i === "ladder" ? "ordered" : i;
  return ["none", "ordered", "random"].includes(c) ? `${o} · ${n(`strategy.${c}`).toLowerCase()}` : o;
}
function Vt(e, t) {
  const n = se(t.params), i = ke(t.type, t.params), a = n !== void 0 ? String(n) : "", o = a && i ? `${a} × ${i}` : a || i;
  return o ? `${te(e, t.type)} · ${o}` : te(e, t.type);
}
function We(e) {
  return e.stages.flatMap((t) => t.objectives);
}
function Jt(e) {
  const t = We(e), n = t.map((i) => i.key);
  return t.some(
    (i) => ze(i.type, i.params).length > 0 || n.indexOf(i.key) !== n.lastIndexOf(i.key)
  );
}
function Yt(e) {
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
function Zt(e, t, n) {
  const i = structuredClone(e);
  i.uid = V(), i.key = J(`${e.key}_copy`, t), i.title = n(e.title), i.description = n(e.description);
  for (const [a, o] of i.stages.entries()) o.title = n(e.stages[a].title);
  return i;
}
const Xt = `
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
.aq-aside { flex: 1 1 300px; max-width: 420px; position: sticky; top: 16px; }
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
.aq-preview-frame { display: flex; flex-direction: column; gap: 4px; padding: 6px 8px; border-radius: 2px; background: var(--mc-tooltip-bg, #100010); border: 2px solid var(--mc-tooltip-border-top, #2a0a66); }
.aq-preview-stage { display: flex; flex-direction: column; gap: 4px; padding-top: 8px; }
`, en = /^(\d+|(\d+[dhms])+)$/, tn = ["actor_load", "period_reset", "quest_complete"], nn = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
function an(e, t) {
  const n = wt(e, /* @__PURE__ */ new Date());
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
function rn({ projectId: e, documentId: t, document: n, item: i }) {
  ot("msquests", Xt);
  const a = n, o = st(e), c = lt(), d = Et(), [l, u] = O(i ?? null);
  ve(() => {
    u(i ?? null);
  }, [i]);
  const h = (v) => {
    u(v), ut({ documentId: t, item: v });
  }, g = { projectId: e, project: o, lang: c, t: d, edit: (v, f) => {
    const y = structuredClone(a);
    v(y), dt({ projectId: e, kind: re, id: t, doc: y, texts: f });
  } }, x = l ? a.quests.findIndex((v) => v.uid === l) : -1;
  return /* @__PURE__ */ r("div", { className: "aq", children: x >= 0 ? /* @__PURE__ */ r(yn, { ctx: g, group: a, index: x, onLeave: () => h(null) }, l) : /* @__PURE__ */ r(dn, { ctx: g, group: a, onOpen: h }) });
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
function on() {
  return /* @__PURE__ */ m("svg", { "aria-hidden": "true", width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: [
    /* @__PURE__ */ r("circle", { cx: "3", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "8", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "13", cy: "8", r: "1.5" })
  ] });
}
function j({ tone: e, children: t }) {
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
    /* @__PURE__ */ m("label", { className: "aq-field", title: i, children: [
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
  placeholder: c
}) {
  const d = pt(e.project);
  return /* @__PURE__ */ r(
    mt,
    {
      className: "aq-field",
      label: t,
      langs: d,
      activeLang: e.lang,
      defaultLang: d[0] ?? e.lang,
      values: Me(e.project, n.key),
      onChange: (l, u) => e.edit(() => {
      }, [{ key: n.key, lang: l, value: u }]),
      inline: o,
      renderEditor: (l) => /* @__PURE__ */ r(
        ft,
        {
          value: l.value,
          onChange: l.onChange,
          placeholder: l.fallback ?? c,
          multiline: i,
          rows: i ? a : void 0,
          "aria-label": l.label
        }
      )
    }
  );
}
function sn(e) {
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
      value: sn(t),
      placeholder: i,
      onChange: (a) => {
        const o = a.target.value.trim();
        n(o === "" ? void 0 : Math.max(0, Math.trunc(Number(o))));
      }
    }
  ) });
}
function ln(e) {
  const t = Je(e);
  return t !== "" && t !== "none";
}
function Je(e) {
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
  const [a, o] = O(!1);
  return a ? /* @__PURE__ */ m("span", { className: "aq-confirm", children: [
    /* @__PURE__ */ r(B, { size: "sm", variant: "ghost", onClick: () => o(!1), children: e("cancel") }),
    /* @__PURE__ */ r("button", { type: "button", className: "aq-danger", onClick: i, children: e("remove") })
  ] }) : /* @__PURE__ */ r(le, { label: t, onClick: () => n ? i() : o(!0), children: "×" });
}
function cn({
  label: e,
  children: t
}) {
  const [n, i] = O(!1), a = qt(null);
  return ve(() => {
    if (!n) return;
    const o = (d) => {
      a.current?.contains(d.target) || i(!1);
    }, c = (d) => {
      d.key === "Escape" && (d.preventDefault(), i(!1));
    };
    return window.addEventListener("mousedown", o), window.addEventListener("keydown", c, !0), () => {
      window.removeEventListener("mousedown", o), window.removeEventListener("keydown", c, !0);
    };
  }, [n]), /* @__PURE__ */ m("div", { className: "aq-menu-anchor", ref: a, children: [
    /* @__PURE__ */ r(le, { label: e, expanded: n, onClick: () => i(!n), children: /* @__PURE__ */ r(on, {}) }),
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
function dn({
  ctx: e,
  group: t,
  onOpen: n
}) {
  const { t: i, edit: a, project: o, lang: c } = e, [d, l] = O(t.quests.length === 0), [u, h] = O(null), s = we(t), g = Object.keys(t.rest).filter((f) => f !== "actions"), x = () => {
    const f = K(), y = V();
    a(
      (b) => {
        b.quests.push({
          key: J(
            "quest",
            b.quests.map((k) => k.key)
          ),
          uid: y,
          tier: "",
          title: { key: f },
          description: { key: K() },
          duration: "",
          stages: [et(1)],
          rest: {}
        });
      },
      [{ key: f, lang: c, value: i("newQuestTitle") }]
    ), n(y);
  }, v = (f) => {
    const y = [], b = (k) => {
      const w = K();
      for (const [C, T] of Object.entries(Me(o, k.key)))
        T !== "" && y.push({ key: w, lang: C, value: T });
      return { key: w };
    };
    a((k) => {
      k.quests.splice(
        f + 1,
        0,
        Zt(
          k.quests[f],
          k.quests.map((w) => w.key),
          b
        )
      );
    }, y);
  };
  return /* @__PURE__ */ m(H, { children: [
    /* @__PURE__ */ m("section", { className: "aq-card", children: [
      /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "aq-fold-head",
          "aria-expanded": d,
          onClick: () => l(!d),
          children: [
            /* @__PURE__ */ r(Y, { open: d }),
            /* @__PURE__ */ r("span", { className: "aq-h", children: i("groupSettings") }),
            !d && /* @__PURE__ */ r(pn, { ctx: e, group: t })
          ]
        }
      ),
      d && /* @__PURE__ */ r(mn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ m("section", { className: "aq-card", children: [
      /* @__PURE__ */ m("div", { className: "aq-card-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: i("quests") }),
        /* @__PURE__ */ r("span", { className: "aq-count", children: t.quests.length }),
        /* @__PURE__ */ r("span", { className: "aq-grow" }),
        /* @__PURE__ */ m(B, { size: "sm", variant: "primary", onClick: x, children: [
          "+ ",
          i("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: i("noQuests") }),
      /* @__PURE__ */ r(
        ge,
        {
          ids: t.quests.map((f) => f.uid),
          onMove: (f, y) => a((b) => Ne(b.quests, f, y)),
          className: "aq-quests",
          itemClassName: "aq-quest",
          children: (f, y) => {
            const b = t.quests[f], k = G(R(o, b.title.key, c)) || b.key, w = We(b), C = Ve(b.rest), T = t.tiers.find((q) => q.key === b.tier), p = Yt(b);
            return /* @__PURE__ */ m(H, { children: [
              y,
              s && /* @__PURE__ */ r("span", { className: "aq-n", children: f + 1 }),
              /* @__PURE__ */ m("button", { type: "button", className: "aq-quest-main", onClick: () => n(b.uid), children: [
                /* @__PURE__ */ r("span", { className: "aq-quest-title", children: k }),
                /* @__PURE__ */ r("span", { className: "aq-quest-sub", children: w.length === 0 ? i("noObjectivesShort") : w.map((q) => Vt(i, q)).join("  ·  ") })
              ] }),
              u === b.uid ? /* @__PURE__ */ m("span", { className: "aq-confirm", children: [
                /* @__PURE__ */ r("span", { children: i("removeConfirm", { name: k }) }),
                /* @__PURE__ */ r(B, { size: "sm", variant: "ghost", onClick: () => h(null), children: i("cancel") }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "aq-danger",
                    onClick: () => {
                      h(null), a((q) => {
                        q.quests.splice(f, 1);
                      });
                    },
                    children: i("remove")
                  }
                )
              ] }) : /* @__PURE__ */ m(H, { children: [
                /* @__PURE__ */ m("span", { className: "aq-chips", children: [
                  Jt(b) && /* @__PURE__ */ r(j, { tone: "warn", children: i("toComplete") }),
                  s && C.length > 0 && /* @__PURE__ */ m(j, { tone: "ok", children: [
                    i("completedWhen"),
                    " ",
                    Ae(C) !== null ? /* @__PURE__ */ r("span", { className: "aq-mono", children: Ae(C) }) : i("conditionCount", { count: C.length })
                  ] }),
                  b.tier && /* @__PURE__ */ r(j, { children: T && G(R(o, T.title.key, c)) || b.tier }),
                  b.duration && /* @__PURE__ */ r(j, { children: b.duration }),
                  p > 0 && /* @__PURE__ */ r(j, { children: p === 1 ? i("actionCountOne") : i("actionCount", { count: p }) })
                ] }),
                /* @__PURE__ */ r(cn, { label: i("moreActions"), children: (q) => /* @__PURE__ */ m(H, { children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      onClick: () => {
                        q(), v(f);
                      },
                      children: i("duplicate")
                    }
                  ),
                  /* @__PURE__ */ m(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      className: "is-danger",
                      onClick: () => {
                        q(), h(b.uid);
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
      g.length > 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: i("kept", { fields: g.join(", ") }) })
    ] })
  ] });
}
function Ze(e, t) {
  return t === "player" || t === "global" || t === "guild" ? e(`actor.${t}`) : t;
}
const Te = ["player", "global"], pe = /* @__PURE__ */ new Set();
function un(e, t) {
  const n = e?.documents?.[re];
  for (const i of Array.isArray(n) ? n : []) {
    const a = i.actorType;
    typeof a == "string" && a && pe.add(a);
  }
  return t && pe.add(t), [...Te, ...[...pe].filter((i) => !Te.includes(i)).sort()];
}
function fe(e) {
  const t = Je(e);
  return t === "sequential" || t === "ladder" ? "ordered" : t === "none" || t === "random" ? t : "";
}
function pn({ ctx: e, group: t }) {
  const { t: n } = e, i = Pe(), a = typeof t.reset.cron == "string" ? t.reset.cron : "", o = fe(t.distribution), c = Object.keys(E(t.rest.actions)).length, d = a ? kt(a, i) ?? a : n("noReset");
  return /* @__PURE__ */ m("span", { className: "aq-chips", children: [
    /* @__PURE__ */ r(j, { children: Ze(n, t.actorType) }),
    o && /* @__PURE__ */ r(j, { children: n(`strategy.${o}`) }),
    /* @__PURE__ */ r(j, { children: d.charAt(0).toUpperCase() + d.slice(1) }),
    t.tiers.length > 0 && /* @__PURE__ */ r(j, { children: n("tierCount", { count: t.tiers.length }) }),
    c > 0 && /* @__PURE__ */ r(j, { children: n("eventCount", { count: c }) })
  ] });
}
function mn({ ctx: e, group: t }) {
  const { t: n, edit: i, project: a, lang: o } = e, c = fe(t.distribution), d = c === "ordered", l = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], u = t.distribution.tiers ?? {}, h = un(a, t.actorType);
  return /* @__PURE__ */ m("div", { className: "aq-settings", children: [
    /* @__PURE__ */ m("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("identity") }),
      /* @__PURE__ */ r(Q, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ r(Q, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ m("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("actorType") }),
        /* @__PURE__ */ r(
          ie,
          {
            label: n("actorType"),
            value: t.actorType,
            options: h.map((s) => ({ value: s, label: Ze(n, s) })),
            onChange: (s) => i((g) => {
              g.actorType = s;
            })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ m("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("distribution") }),
      /* @__PURE__ */ m("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("strategy") }),
        /* @__PURE__ */ r(
          ie,
          {
            label: n("strategy"),
            value: c,
            options: ["none", "ordered", "random"].map((s) => ({
              value: s,
              label: n(`strategy.${s}`)
            })),
            onChange: (s) => i((g) => {
              s === "ordered" && fe(g.distribution) === "ordered" || (g.distribution.strategy = s === "ordered" ? "sequential" : s);
            })
          }
        )
      ] }),
      !d && /* @__PURE__ */ m(H, { children: [
        /* @__PURE__ */ m("div", { className: "aq-row", children: [
          /* @__PURE__ */ r(
            P,
            {
              label: n("amount"),
              value: t.distribution.amount,
              onChange: (s) => i((g) => _(g.distribution, "amount", s))
            }
          ),
          /* @__PURE__ */ r(
            P,
            {
              label: n("maxActive"),
              value: t.limits.max_active,
              onChange: (s) => i((g) => _(g.limits, "max_active", s))
            }
          )
        ] }),
        /* @__PURE__ */ m("div", { className: "aq-field", children: [
          /* @__PURE__ */ r("span", { className: "field-label", children: n("triggers") }),
          tn.map((s) => /* @__PURE__ */ m("label", { className: "aq-check", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: l.includes(s),
                onChange: (g) => i((x) => {
                  const v = Array.isArray(x.distribution.triggers) ? x.distribution.triggers : [], f = g.target.checked ? [...v, s] : v.filter((y) => y !== s);
                  _(x.distribution, "triggers", f.length ? f : void 0);
                })
              }
            ),
            n(`trigger.${s}`)
          ] }, s))
        ] })
      ] }),
      /* @__PURE__ */ r(
        P,
        {
          label: n("questsPerPeriod"),
          placeholder: n("noLimit"),
          value: t.limits.max_per_period,
          onChange: (s) => i((g) => _(g.limits, "max_per_period", s))
        }
      ),
      !d && /* @__PURE__ */ m("div", { className: "aq-row", children: [
        /* @__PURE__ */ m("label", { className: "aq-check", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: t.rotation.enabled === !0,
              onChange: (s) => i((g) => _(g.rotation, "enabled", s.target.checked ? !0 : void 0))
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
            onChange: (s) => i((g) => _(g.rotation, "max_per_period", s))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ m("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("reset") }),
      /* @__PURE__ */ r(fn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ m("div", { className: "aq-block", children: [
      /* @__PURE__ */ m("div", { className: "aq-block-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("tiers") }),
        /* @__PURE__ */ m(
          B,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => i((s) => {
              s.tiers.push({
                key: J(
                  "tier",
                  s.tiers.map((g) => g.key)
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
      t.tiers.map((s, g) => /* @__PURE__ */ m("div", { className: "aq-tier", children: [
        /* @__PURE__ */ r(Q, { ctx: e, label: n("title"), node: s.title }),
        /* @__PURE__ */ r(A, { label: n("tierKey"), children: /* @__PURE__ */ r(
          "input",
          {
            className: "input aq-mono",
            defaultValue: s.key,
            onBlur: (x) => {
              const v = oe(x.target.value);
              v !== s.key && i((f) => {
                const y = J(
                  v,
                  f.tiers.map((k) => k.key)
                );
                f.tiers[g].key = y;
                for (const k of f.quests) k.tier === s.key && (k.tier = y);
                const b = f.distribution.tiers;
                b && s.key in b && (b[y] = b[s.key], delete b[s.key]);
              });
            }
          }
        ) }),
        !d && /* @__PURE__ */ r(
          P,
          {
            label: n("perTier"),
            value: u[s.key],
            onChange: (x) => i((v) => {
              const f = { ...v.distribution.tiers ?? {} };
              _(f, s.key, x), _(v.distribution, "tiers", Object.keys(f).length ? f : void 0);
            })
          }
        ),
        /* @__PURE__ */ r(
          _e,
          {
            t: n,
            label: n("remove"),
            sure: !t.quests.some((x) => x.tier === s.key),
            onRemove: () => i((x) => {
              x.tiers.splice(g, 1);
            })
          }
        )
      ] }, s.key)),
      t.tiers.length === 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: n("noTier") })
    ] }),
    /* @__PURE__ */ r("div", { className: "aq-block is-wide", children: /* @__PURE__ */ r(
      Xe,
      {
        ctx: e,
        title: n("hooks"),
        hooks: Ht,
        label: (s) => n(`hook.${s}`),
        value: t.rest.actions,
        onChange: (s, g) => i((x) => {
          const v = { ...E(x.rest.actions) };
          _(v, s, g), _(x.rest, "actions", Object.keys(v).length ? v : void 0);
        })
      },
      t.uid
    ) })
  ] });
}
function fn({ ctx: e, group: t }) {
  const { t: n, edit: i } = e, a = Pe(), o = typeof t.reset.cron == "string" ? t.reset.cron : "", c = Nt(o), [d, l] = O(!1), u = d && o !== "" ? { kind: "custom" } : c, h = typeof t.reset.timezone == "string" ? t.reset.timezone : "", s = o && de(o) ? an(o, a) : null, g = (f) => {
    const y = _t(f);
    y !== null && i((b) => _(b.reset, "cron", y));
  }, x = "time" in u ? u.time : "04:00", v = (f) => {
    l(f === "custom"), f === "never" ? g({ kind: f }) : f === "daily" ? g({ kind: f, time: x }) : f === "weekly" ? g({ kind: f, time: x, day: 1 }) : f === "monthly" ? g({ kind: f, time: x, day: 1 }) : o === "" && i((y) => _(y.reset, "cron", "0 4 * * *"));
  };
  return /* @__PURE__ */ m(H, { children: [
    /* @__PURE__ */ r(
      ie,
      {
        label: n("reset"),
        value: u.kind,
        options: ["never", "daily", "weekly", "monthly", "custom"].map((f) => ({
          value: f,
          label: n(`reset.${f}`)
        })),
        onChange: v
      }
    ),
    u.kind !== "never" && /* @__PURE__ */ m("div", { className: "aq-row aq-reset", children: [
      u.kind === "weekly" && /* @__PURE__ */ r(A, { label: n("resetDay"), children: /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: u.day,
          onChange: (f) => g({ ...u, day: Number(f.target.value) }),
          children: [1, 2, 3, 4, 5, 6, 0].map((f) => /* @__PURE__ */ r("option", { value: f, children: jt(a)[f] }, f))
        }
      ) }),
      u.kind === "monthly" && /* @__PURE__ */ r(
        P,
        {
          label: n("resetDayOfMonth"),
          value: u.day,
          onChange: (f) => g({ ...u, day: f ?? 1 })
        }
      ),
      u.kind === "custom" ? /* @__PURE__ */ r(
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
              onChange: (f) => i((y) => _(y.reset, "cron", f.target.value))
            }
          )
        }
      ) : /* @__PURE__ */ r(A, { label: n("resetTime"), children: /* @__PURE__ */ r(
        "input",
        {
          className: "input",
          type: "time",
          value: u.time,
          onChange: (f) => f.target.value && g({ ...u, time: f.target.value })
        }
      ) })
    ] }),
    o && de(o) && (h || s) && /* @__PURE__ */ r("span", { className: "aq-ok", children: h && h !== nn ? h : s ? n("nextRun", { when: s }) : "" })
  ] });
}
function hn({
  ctx: e,
  value: t,
  onChange: n
}) {
  const { chain: i, legacy: a } = Mt(t);
  return /* @__PURE__ */ m("div", { className: "aq-chain", children: [
    /* @__PURE__ */ r(
      ht,
      {
        projectId: e.projectId,
        value: i,
        onChange: (o) => n(Ee(o, a))
      }
    ),
    a.length > 0 && /* @__PURE__ */ r("div", { className: "aq-legacy", title: e.t("legacySteps"), children: a.map((o, c) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
      /* @__PURE__ */ m("div", { className: "aq-legacy-row", children: [
        /* @__PURE__ */ r("code", { children: Pt(o) }),
        /* @__PURE__ */ r(
          le,
          {
            label: e.t("remove"),
            onClick: () => n(Ee(i, a.filter((d, l) => l !== c))),
            children: "×"
          }
        )
      ] }, c)
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
  const { t: c } = e, d = E(a), [l, u] = O([]), [h, s] = O(null), g = n.filter((v) => d[v] != null || l.includes(v)), x = n.filter((v) => !g.includes(v));
  return /* @__PURE__ */ m(H, { children: [
    /* @__PURE__ */ m("div", { className: "aq-block-head", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: t }),
      x.length > 0 && /* @__PURE__ */ m(
        "select",
        {
          className: "select aq-event-add",
          "aria-label": c("addEvent"),
          value: "",
          onChange: (v) => {
            const f = x.find((y) => y === v.target.value);
            f && (u((y) => [...y, f]), s(f));
          },
          children: [
            /* @__PURE__ */ m("option", { value: "", children: [
              "+ ",
              c("addEvent")
            ] }),
            x.map((v) => /* @__PURE__ */ r("option", { value: v, children: i(v) }, v))
          ]
        }
      )
    ] }),
    g.map((v) => {
      const f = h === v, y = Array.isArray(d[v]) ? d[v].length : d[v] ? 1 : 0;
      return /* @__PURE__ */ m("div", { className: `aq-line${f ? " is-open" : ""}`, children: [
        /* @__PURE__ */ m("div", { className: "aq-line-head", children: [
          /* @__PURE__ */ m(
            "button",
            {
              type: "button",
              className: "aq-line-main",
              "aria-expanded": f,
              onClick: () => s(f ? null : v),
              children: [
                /* @__PURE__ */ r(Y, { open: f }),
                /* @__PURE__ */ r("span", { className: "aq-line-text", children: i(v) }),
                y > 0 && /* @__PURE__ */ r(j, { children: y === 1 ? c("actionCountOne") : c("actionCount", { count: y }) })
              ]
            }
          ),
          /* @__PURE__ */ r(
            _e,
            {
              t: c,
              label: c("removeEvent"),
              sure: y === 0,
              onRemove: () => {
                u((b) => b.filter((k) => k !== v)), o(v, void 0);
              }
            }
          )
        ] }),
        f && /* @__PURE__ */ r("div", { className: "aq-line-body", children: /* @__PURE__ */ r(hn, { ctx: e, value: d[v], onChange: (b) => o(v, b) }) })
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
function yn({
  ctx: e,
  group: t,
  index: n,
  onLeave: i
}) {
  const { t: a, edit: o, project: c, lang: d } = e, l = t.quests[n], u = (p, q) => o((N) => p(N.quests[n]), q), h = t.quests.some((p, q) => q !== n && p.key === l.key), s = l.duration !== "" && !en.test(l.duration.replace(/\s/g, "").toLowerCase()), g = Object.keys(l.rest).filter(
    (p) => p !== "actions" && p !== "giver" && p !== "completed_when"
  ), x = we(t), v = l.rest.giver && typeof l.rest.giver == "object" ? l.rest.giver : {}, f = (p, q) => u((N) => {
    const I = { ...v };
    _(I, p, q.trim()), typeof I.npc == "string" && I.npc !== "" ? N.rest.giver = I : delete N.rest.giver;
  }), y = typeof v.npc == "string" ? v.npc : "", b = ln(t.distribution), k = t.tiers.find((p) => p.key === l.tier), [w, C] = O(!1), T = w || h || s;
  return ve(() => {
    const p = (q) => {
      q.key !== "Escape" || q.defaultPrevented || q.target?.closest("input, textarea, select, [contenteditable='true']") || window.document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]') || (q.preventDefault(), i());
    };
    return window.addEventListener("keydown", p, !0), () => window.removeEventListener("keydown", p, !0);
  }, [i]), /* @__PURE__ */ m("div", { className: "aq-quest-page", children: [
    /* @__PURE__ */ m("div", { className: "aq-quest-col", children: [
      /* @__PURE__ */ m("section", { className: "aq-card", children: [
        /* @__PURE__ */ m("div", { className: "aq-quest-head", children: [
          /* @__PURE__ */ r("div", { className: "aq-quest-name", children: /* @__PURE__ */ r(Q, { ctx: e, label: a("questName"), node: l.title }) }),
          /* @__PURE__ */ r(
            Q,
            {
              ctx: e,
              multiline: !0,
              rows: 2,
              label: a("questDescription"),
              node: l.description
            }
          )
        ] }),
        /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: "aq-fold-head is-inner",
            "aria-expanded": T,
            onClick: () => C(!T),
            children: [
              /* @__PURE__ */ r(Y, { open: T }),
              /* @__PURE__ */ r("span", { className: "aq-fold-title", children: a("questSettings") }),
              !T && /* @__PURE__ */ m("span", { className: "aq-chips", children: [
                l.tier && /* @__PURE__ */ r(j, { children: k && G(R(c, k.title.key, d)) || l.tier }),
                /* @__PURE__ */ r(j, { children: l.duration || a("noTimeLimit") }),
                y && /* @__PURE__ */ r(j, { children: a("givenBy", { npc: y }) }),
                /* @__PURE__ */ r(j, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: l.key }) })
              ] })
            ]
          }
        ),
        T && /* @__PURE__ */ m("div", { className: "aq-fold-body", children: [
          /* @__PURE__ */ m("div", { className: "aq-row aq-top aq-wrap", children: [
            t.tiers.length > 0 || l.tier ? /* @__PURE__ */ r(A, { label: a("tier"), children: /* @__PURE__ */ m(
              "select",
              {
                className: "select",
                value: l.tier,
                onChange: (p) => u((q) => {
                  q.tier = p.target.value;
                }),
                children: [
                  /* @__PURE__ */ r("option", { value: "", children: a("noTier") }),
                  t.tiers.map((p) => /* @__PURE__ */ r("option", { value: p.key, children: G(R(c, p.title.key, d)) || p.key }, p.key)),
                  l.tier && !k && /* @__PURE__ */ r("option", { value: l.tier, children: l.tier })
                ]
              }
            ) }) : null,
            /* @__PURE__ */ r(
              A,
              {
                label: a("duration"),
                hint: s ? /* @__PURE__ */ r("span", { className: "aq-err", children: a("durationInvalid") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input",
                    value: l.duration,
                    placeholder: "24h",
                    onChange: (p) => u((q) => {
                      q.duration = p.target.value.trim();
                    })
                  }
                )
              }
            ),
            /* @__PURE__ */ r(
              A,
              {
                label: a("key"),
                hint: h ? /* @__PURE__ */ r("span", { className: "aq-err", children: a("keyTaken") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input aq-mono",
                    value: l.key,
                    onChange: (p) => u((q) => {
                      q.key = Qe(p.target.value);
                    }),
                    onBlur: () => {
                      const p = oe(l.key);
                      p !== l.key && u((q) => {
                        q.key = p;
                      });
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ m("div", { className: "aq-row aq-top aq-wrap", children: [
            /* @__PURE__ */ r(A, { label: a("giverNpc"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: y,
                onChange: (p) => f("npc", p.target.value)
              }
            ) }),
            y && /* @__PURE__ */ r(A, { label: a("giverConversation"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: typeof v.conversation == "string" ? v.conversation : "",
                onChange: (p) => f("conversation", p.target.value)
              }
            ) })
          ] }),
          y && b && /* @__PURE__ */ r("span", { className: "aq-warn", children: a("giverDistributed") })
        ] })
      ] }),
      /* @__PURE__ */ r(
        ge,
        {
          ids: Ye(l.stages.map((p) => p.key)),
          onMove: (p, q) => u((N) => Ne(N.stages, p, q)),
          className: "aq-stages",
          children: (p, q) => /* @__PURE__ */ r(
            gn,
            {
              ctx: e,
              quest: l,
              stage: l.stages[p],
              si: p,
              handle: q,
              editQuest: u
            }
          )
        }
      ),
      /* @__PURE__ */ m(
        B,
        {
          size: "sm",
          variant: "ghost",
          className: "aq-add",
          onClick: () => u((p) => {
            const q = J(
              `stage_${p.stages.length + 1}`,
              p.stages.map((N) => N.key)
            );
            p.stages.push({ ...et(p.stages.length + 1), key: q });
          }),
          children: [
            "+ ",
            a("addStage")
          ]
        }
      ),
      x && /* @__PURE__ */ m("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: a("completedWhen") }),
        /* @__PURE__ */ r(
          ct,
          {
            projectId: e.projectId,
            value: Ve(l.rest),
            emptyHint: a("completedWhenEmpty"),
            onChange: (p) => u((q) => _(q.rest, "completed_when", p.length > 0 ? p : void 0))
          },
          l.uid
        )
      ] }),
      /* @__PURE__ */ m("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r(
          Xe,
          {
            ctx: e,
            title: a("questEvents"),
            hooks: Kt,
            label: (p) => a(`questHook.${p}`),
            value: l.rest.actions,
            onChange: (p, q) => u((N) => {
              const I = { ...E(N.rest.actions) };
              _(I, p, q), _(N.rest, "actions", Object.keys(I).length > 0 ? I : void 0);
            })
          },
          l.uid
        ),
        g.length > 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: a("kept", { fields: g.join(", ") }) })
      ] })
    ] }),
    /* @__PURE__ */ m("aside", { className: "aq-card aq-pad aq-aside", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: a("preview") }),
      /* @__PURE__ */ r(kn, { ctx: e, quest: l })
    ] })
  ] });
}
function gn({
  ctx: e,
  quest: t,
  stage: n,
  si: i,
  handle: a,
  editQuest: o
}) {
  const { t: c } = e, [d, l] = O(null), [u, h] = O(!1), s = (y) => o((b) => y(b.stages[i])), g = n.flow || "parallel", x = t.stages.flatMap((y) => y.objectives.map((b) => b.key)), v = u || n.objectives.length === 0, f = (y) => {
    const b = St(y, x);
    o((k) => {
      k.stages[i].objectives.push({ key: b, type: y, params: Ue(y) });
    }), l(b), h(!1);
  };
  return /* @__PURE__ */ m("div", { className: "aq-card aq-stage", children: [
    /* @__PURE__ */ m("div", { className: "aq-stage-head", children: [
      a,
      /* @__PURE__ */ r("span", { className: "aq-eyebrow aq-stage-label", children: c("stage", { n: i + 1 }) }),
      /* @__PURE__ */ r("div", { className: "aq-stage-title", children: /* @__PURE__ */ r(
        Q,
        {
          ctx: e,
          bare: !0,
          label: c("stageName"),
          node: n.title,
          placeholder: c("stageNameDefault", { n: i + 1 })
        }
      ) }),
      n.objectives.length > 1 && /* @__PURE__ */ r(
        ie,
        {
          label: c("flow"),
          value: g,
          options: ["parallel", "sequential"].map((y) => ({
            value: y,
            label: c(`flow.${y}`)
          })),
          onChange: (y) => s((b) => {
            b.flow = y;
          })
        }
      ),
      /* @__PURE__ */ r(
        _e,
        {
          t: c,
          label: c("remove"),
          sure: n.objectives.length === 0,
          onRemove: () => o((y) => {
            y.stages.splice(i, 1);
          })
        }
      )
    ] }),
    /* @__PURE__ */ m("span", { className: "aq-eyebrow", children: [
      c("objectives"),
      " ",
      /* @__PURE__ */ r("span", { className: "aq-count", children: n.objectives.length })
    ] }),
    /* @__PURE__ */ r(
      ge,
      {
        ids: Ye(n.objectives.map((y) => y.key)),
        onMove: (y, b) => s((k) => Ne(k.objectives, y, b)),
        className: "aq-objectives",
        children: (y, b) => {
          const k = n.objectives[y];
          return /* @__PURE__ */ r(
            vn,
            {
              t: c,
              projectId: e.projectId,
              n: g === "sequential" ? `${i + 1}.${y + 1}` : "",
              objective: k,
              open: d === k.key,
              onToggle: () => l(d === k.key ? null : k.key),
              keyTaken: x.filter((w) => w === k.key).length > 1,
              handle: b,
              onChange: (w) => s((C) => w(C.objectives[y])),
              onRename: (w) => {
                d === k.key && l(w);
              },
              onRemove: () => s((w) => {
                w.objectives.splice(y, 1);
              })
            }
          );
        }
      }
    ),
    v ? /* @__PURE__ */ m("div", { className: "aq-types", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: c("addObjective") }),
      /* @__PURE__ */ r("div", { className: "aq-seg", children: qe.map((y) => /* @__PURE__ */ m("button", { type: "button", className: "aq-opt", onClick: () => f(y.type), children: [
        /* @__PURE__ */ r("span", { "aria-hidden": !0, children: y.icon }),
        " ",
        c(`objective.${y.type}`)
      ] }, y.type)) })
    ] }) : /* @__PURE__ */ m(B, { size: "sm", variant: "ghost", className: "aq-add", onClick: () => h(!0), children: [
      "+ ",
      c("addObjective")
    ] })
  ] });
}
function vn({
  t: e,
  projectId: t,
  n,
  objective: i,
  open: a,
  onToggle: o,
  keyTaken: c,
  handle: d,
  onChange: l,
  onRename: u,
  onRemove: h
}) {
  const s = U(i.type), g = s ? s.params : Object.keys(i.params).map((p) => ({ name: p, kind: "text" })), x = se(i.params), v = ke(i.type, i.params), f = ze(i.type, i.params), y = c || f.length > 0, b = g.filter((p) => p.advanced), [k, w] = O(!1), C = k || c, T = (p) => p.kind === "item" ? /* @__PURE__ */ r(
    bn,
    {
      t: e,
      projectId: t,
      spec: p,
      params: i.params,
      onChange: (q) => l((N) => q(N.params))
    },
    p.name
  ) : /* @__PURE__ */ r(
    qn,
    {
      t: e,
      spec: p,
      value: i.params[p.name],
      onChange: (q) => l((N) => _(N.params, p.name, q))
    },
    p.name
  );
  return /* @__PURE__ */ m("div", { className: `aq-obj${a ? " is-open" : ""}${y ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ m("div", { className: "aq-obj-line", children: [
      d,
      /* @__PURE__ */ m("button", { type: "button", className: "aq-obj-main", onClick: o, "aria-expanded": a, children: [
        n && /* @__PURE__ */ r("span", { className: "aq-obj-n", children: n }),
        /* @__PURE__ */ r("span", { className: "aq-obj-icon", "aria-hidden": !0, children: s?.icon ?? "?" }),
        /* @__PURE__ */ m("span", { className: "aq-obj-text", children: [
          te(e, i.type),
          x !== void 0 && /* @__PURE__ */ m("strong", { children: [
            " · ",
            String(x)
          ] }),
          v ? ` × ${v}` : x !== void 0 && s ? ` × ${e("any")}` : ""
        ] }),
        y && /* @__PURE__ */ r(j, { tone: "warn", children: c ? e("objectiveKeyTaken") : e("missing", {
          fields: f.map((p) => e(`param.${p}`)).join(", ")
        }) }),
        /* @__PURE__ */ r(Y, { open: a })
      ] }),
      /* @__PURE__ */ r(le, { label: e("remove"), onClick: h, children: "×" })
    ] }),
    a && /* @__PURE__ */ m("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ m("div", { className: "aq-row aq-top aq-wrap", children: [
        /* @__PURE__ */ r(A, { label: e("type"), children: /* @__PURE__ */ m(
          "select",
          {
            className: "select",
            value: i.type,
            onChange: (p) => l((q) => {
              q.type = p.target.value, q.params = Ue(q.type);
            }),
            children: [
              qe.map((p) => /* @__PURE__ */ m("option", { value: p.type, children: [
                p.icon,
                " ",
                e(`objective.${p.type}`)
              ] }, p.type)),
              !s && /* @__PURE__ */ r("option", { value: i.type, children: i.type })
            ]
          }
        ) }),
        g.filter((p) => !p.advanced).map(T)
      ] }),
      /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "aq-fold-head is-inner",
          "aria-expanded": C,
          onClick: () => w(!C),
          children: [
            /* @__PURE__ */ r(Y, { open: C }),
            /* @__PURE__ */ r("span", { className: "aq-fold-title", children: e("more") }),
            !C && /* @__PURE__ */ r(j, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: i.key }) })
          ]
        }
      ),
      C && /* @__PURE__ */ m("div", { className: "aq-row aq-top aq-wrap", children: [
        b.map(T),
        /* @__PURE__ */ r(
          A,
          {
            label: e("key"),
            title: e("objectiveKeyHint"),
            hint: c ? /* @__PURE__ */ r("span", { className: "aq-err", children: e("objectiveKeyTaken") }) : void 0,
            children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: i.key,
                onChange: (p) => {
                  const q = Qe(p.target.value);
                  l((N) => {
                    N.key = q;
                  }), u(q);
                },
                onBlur: () => {
                  const p = oe(i.key);
                  p !== i.key && (l((q) => {
                    q.key = p;
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
function bn({
  t: e,
  projectId: t,
  spec: n,
  params: i,
  onChange: a
}) {
  const o = xe(i, n), c = Array.isArray(i.match) ? i.match : void 0, d = (l, u) => a((h) => Gt(h, n, l, u));
  return /* @__PURE__ */ r(A, { label: e(`param.${n.name}`), children: /* @__PURE__ */ r(
    gt,
    {
      projectId: t,
      value: o,
      match: c,
      onChange: (l) => d(l, c),
      onMatchChange: (l) => d(o, l)
    }
  ) });
}
function qn({
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
      vt,
      {
        value: o,
        placeholder: e("any"),
        "aria-label": a,
        onChange: (d) => i(d.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const c = t.kind === "entity";
  return /* @__PURE__ */ m(A, { label: a, children: [
    /* @__PURE__ */ r(
      "input",
      {
        className: `input${c ? " aq-mono" : ""}`,
        list: c ? "aq-entities" : void 0,
        value: o,
        placeholder: c ? e("any") : "",
        onChange: (d) => i(c ? d.target.value.toUpperCase().replace(/\s+/g, "_") : d.target.value)
      }
    ),
    c && /* @__PURE__ */ r("datalist", { id: "aq-entities", children: Qt.map((d) => /* @__PURE__ */ r("option", { value: d }, d)) })
  ] });
}
const xn = 170, Se = { color: "#aaaaaa", italic: !1 }, $e = { color: "#ffffff", italic: !1 };
function kn({ ctx: e, quest: t }) {
  const { t: n, project: i, lang: a } = e, o = (u) => u.split(`
`).flatMap((h) => h === "" ? [""] : yt(h, xn)), c = R(i, t.title.key, a) || t.key, d = R(i, t.description.key, a), l = t.stages.length > 1;
  return /* @__PURE__ */ r("div", { className: "aq-preview", children: /* @__PURE__ */ m("div", { className: "aq-preview-frame", children: [
    /* @__PURE__ */ r(Z, { source: o(c).join(`
`), defaults: $e, scale: 2 }),
    d && /* @__PURE__ */ r(Z, { source: o(d).join(`
`), defaults: Se, scale: 2 }),
    t.stages.map((u, h) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ m("div", { className: "aq-preview-stage", children: [
        l && /* @__PURE__ */ r(
          Z,
          {
            source: o(R(i, u.title.key, a) || n("stage", { n: h + 1 })).join(`
`),
            defaults: $e,
            scale: 2
          }
        ),
        u.objectives.length > 0 && /* @__PURE__ */ r(
          Z,
          {
            source: u.objectives.flatMap((s) => o(`• ${ne(n, s)}`)).join(`
`),
            defaults: Se,
            scale: 2
          }
        )
      ] }, h)
    ))
  ] }) });
}
function wn({ className: e }) {
  return /* @__PURE__ */ m(
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
const Nn = {
  kind: re,
  dir: Ge,
  schemaVersion: be,
  // Created in the module's folder only (SDK 1.8); a group already elsewhere still loads.
  projects: [At],
  // Data with no links: one "Quests" entry and page instead of a node per group (SDK 1.9).
  collection: { labels: Ct },
  // A group's id is its key on the server (`quest_group_key`): typed by hand, no prefix.
  label: je.en,
  labels: je,
  icon: wn,
  component: rn,
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
  serialize: (e, t) => It(e, t),
  ltextSites: (e) => Dt(e),
  board: {
    size: { width: 300, height: 48 },
    accent: Bt,
    // The group's quests, one selectable row each: the Properties panel opens the one clicked.
    items: (e, { project: t, lang: n }) => Ut(e, t, n),
    summary: (e, { lang: t }) => Wt(e, t)
  }
}, Oe = "quests:groups", Re = "quests:quests", _n = "quests:active";
function jn(e) {
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
function Cn(e, t, n) {
  const i = jn(t);
  if (i !== Oe && i !== Re && i !== _n) return null;
  const a = e.documents?.[re];
  if (!a || a.length === 0) return null;
  const o = e.defaultLang ?? "en", c = n?.serverRows, d = n?.params?.group || void 0, l = [...a].sort((h, s) => h.id < s.id ? -1 : h.id > s.id ? 1 : 0);
  if (i === Oe) {
    const h = he(c, "key");
    return l.map((s) => En(s, h.get(s.id), o));
  }
  if (i === Re) {
    const h = he(c, "id");
    return l.filter((s) => !d || s.id === d).flatMap((s) => s.quests.map((g) => tt(s, g, h.get(`${s.id}:${g.key}`), o)));
  }
  if (!c) return null;
  const u = new Map(a.map((h) => [h.id, h]));
  return c.flatMap((h) => {
    const s = u.get(L(h.group));
    if (!s) return [h];
    const g = s.quests.find((x) => x.key === L(h.quest_key));
    return g ? [$n(g, h, o)] : [];
  });
}
function En(e, t, n) {
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
    duration: In(t.duration),
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
  const i = t ? An(t) : void 0, a = Tn(e, i, n), o = a.find((d) => d.active === !0), c = o ? o.objectives.find((d) => d.done !== !0) : void 0;
  return {
    objective_name: c?.name ?? "",
    objective_progress: c?.progress ?? 0,
    objective_target: c?.target ?? 0,
    progress_ratio: i ? it(a.map((d) => d.progress_ratio)) : 0,
    stage_index: a.filter((d) => d.completed === !0).length,
    stage_name: o?.name ?? "",
    stage_flow: o?.flow ?? "",
    stages: a.map((d) => ({ ...d, objectives: d.objectives.map(({ done: l, ...u }) => u) }))
  };
}
function An(e) {
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
function Tn(e, t, n) {
  const i = e.stages.map((o, c) => {
    const d = o.objectives.map((l) => Sn(l, t?.get(l.key), n));
    return {
      key: o.key,
      name: o.title,
      flow: Ln(o),
      index: c,
      // `QuestStage.isCompleted`: all objectives done, so an empty stage is.
      completed: t !== void 0 && d.every((l) => l.done),
      active: !1,
      progress_ratio: t ? it(d.map((l) => l.progress_ratio)) : 0,
      objectives: d
    };
  });
  if (!t) return i;
  const a = i.find((o) => o.completed !== !0);
  if (a) {
    a.active = !0;
    const o = a.objectives, c = o.find((d) => d.done !== !0);
    for (const d of o)
      d.status_key === "PENDING" && (a.flow !== "SEQUENTIAL" || d === c) && (d.status_key = "IN_PROGRESS");
  }
  return i;
}
function Sn(e, t, n) {
  const i = Rn(e), a = t?.progress ?? 0, o = t?.row, c = o && o.type === e.type && o.target === i;
  return {
    key: e.key,
    name: c && typeof o.name == "string" ? o.name : On(e, n),
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
function $n(e, t, n) {
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
function On(e, t) {
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
  return i.replace(/%([a-z_]+)%/g, (c, d) => o[d] ?? "");
}
function X(e, t) {
  const n = L(t).toLowerCase().replace(/^minecraft:/, "");
  return n === "" ? "" : `<lang:${e}.minecraft.${n}>`;
}
function De(e) {
  const t = U(e.type)?.params.find((o) => o.kind === "item");
  if (!t) return "";
  const n = xe(e.params, t), i = n.title;
  if (typeof i == "string" && i.trim() !== "") return i;
  const a = L(n.material);
  return /^(minecraft:)?[a-z_0-9]+$/i.test(a) && !a.includes(":") ? X("item", a) : a || Fe(n);
}
function Rn(e) {
  const t = se(e.params);
  if (t === void 0) return 1;
  const n = Number(t);
  return Number.isFinite(n) ? n : 1;
}
function Ln(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function In(e) {
  const t = e.trim().toLowerCase().replace(/ /g, "");
  if (t === "") return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const n = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!n) return 0;
  const [, i, a, o, c] = n;
  return Number(i ?? 0) * 86400 + Number(a ?? 0) * 3600 + Number(o ?? 0) * 60 + Number(c ?? 0);
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
const Dn = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: bt,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  documents: [Nn],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: Cn
}, Kn = { ...Dn, sdk: "1.20.0" };
export {
  Kn as default
};
