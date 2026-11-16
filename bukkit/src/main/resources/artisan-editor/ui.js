import { createModuleI18n as nt, fieldText as it, newTextKey as K, textValue as $, injectModuleStyles as at, useProject as rt, useContentLang as ot, MiniMessageInput as ee, SortableList as ye, Button as G, ConditionsEditor as st, updateDocument as lt, selectDocumentItem as ct, McText as Y, useUiLang as De, ActionChainEditor as dt, mcWrap as ut, ItemInput as pt, MaterialInput as mt, textValues as ft, SDK_VERSION as ht } from "@artisan/editor-sdk";
import { jsx as r, jsxs as f, Fragment as H } from "react/jsx-runtime";
import { useState as R, useEffect as ge, useRef as yt } from "react";
const Me = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
}, gt = /^\d+$/;
function le(e, t, n) {
  const i = String(n).padStart(2, "0");
  return e === "fr" ? n === 0 ? `${t} h` : `${t} h ${i}` : `${String(t).padStart(2, "0")}:${i}`;
}
function O(e, t, n) {
  return gt.test(e) && Number(e) >= t && Number(e) <= n;
}
function ce(e) {
  return e.trim().split(/\s+/).length === 5;
}
function vt(e, t) {
  const n = t === "fr", i = e.trim().split(/\s+/);
  if (i.length !== 5) return null;
  const [a, o, l, d, c] = i;
  if (d !== "*") return null;
  const u = /^\*\/(\d+)$/;
  if (l === "*" && c === "*") {
    if (O(a, 0, 59) && O(o, 0, 23))
      return n ? `tous les jours à ${le(t, +o, +a)}` : `every day at ${le(t, +o, +a)}`;
    const s = u.exec(o);
    if (O(a, 0, 59) && s)
      return n ? `toutes les ${s[1]} h, à la minute ${a}` : `every ${s[1]} hours, at minute ${a}`;
    if (O(a, 0, 59) && o === "*")
      return n ? `toutes les heures, à la minute ${a}` : `every hour, at minute ${a}`;
    const v = u.exec(a);
    return v && o === "*" ? n ? `toutes les ${v[1]} minutes` : `every ${v[1]} minutes` : null;
  }
  if (!O(a, 0, 59) || !O(o, 0, 23)) return null;
  const h = le(t, +o, +a);
  if (l === "*" && O(c, 0, 7)) {
    const s = Me[n ? "fr" : "en"][Number(c) % 7];
    return n ? `chaque ${s} à ${h}` : `every ${s} at ${h}`;
  }
  return c === "*" && O(l, 1, 31) ? n ? `le ${l === "1" ? "1er" : l} de chaque mois à ${h}` : `on day ${l} of each month at ${h}` : null;
}
function B(e, t, n) {
  const i = /* @__PURE__ */ new Set();
  for (const a of e.split(",")) {
    const o = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(a);
    if (!o) return null;
    const l = o[4] ? Number(o[4]) : 1, d = o[1] === "*" ? t : Number(o[2]), c = o[1] === "*" ? n : o[3] ? Number(o[3]) : o[4] ? n : d;
    if (l < 1 || d < t || c > n || d > c) return null;
    for (let u = d; u <= c; u += l) i.add(u);
  }
  return i;
}
function bt(e, t) {
  const n = e.trim().split(/\s+/);
  if (n.length !== 5) return null;
  const i = B(n[0], 0, 59), a = B(n[1], 0, 23), o = B(n[2], 1, 31), l = B(n[3], 1, 12), d = B(n[4], 0, 7);
  if (!i || !a || !o || !l || !d) return null;
  d.has(7) && d.add(0);
  const c = n[2] === "*", u = n[4] === "*", h = (q) => c && u ? !0 : c ? d.has(q.getDay()) : u ? o.has(q.getDate()) : o.has(q.getDate()) || d.has(q.getDay()), s = new Date(t.getTime());
  s.setSeconds(0, 0), s.setMinutes(s.getMinutes() + 1);
  const v = t.getTime() + 366 * 24 * 3600 * 1e3;
  for (; s.getTime() <= v; ) {
    if (!l.has(s.getMonth() + 1) || !h(s)) {
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
function qt(e) {
  const t = e.trim().split(/\s+/);
  if (e.trim() === "") return { kind: "never" };
  if (t.length !== 5) return { kind: "custom" };
  const [n, i, a, o, l] = t;
  if (o !== "*" || !O(n, 0, 59) || !O(i, 0, 23)) return { kind: "custom" };
  const d = `${i.padStart(2, "0")}:${n.padStart(2, "0")}`;
  return a === "*" && l === "*" ? { kind: "daily", time: d } : a === "*" && O(l, 0, 7) ? { kind: "weekly", time: d, day: Number(l) % 7 } : l === "*" && O(a, 1, 31) ? { kind: "monthly", time: d, day: Number(a) } : { kind: "custom" };
}
function kt(e) {
  if (e.kind === "never") return "";
  if (e.kind === "custom") return null;
  const t = /^(\d{1,2}):(\d{2})$/.exec(e.time), n = t ? Math.min(23, Number(t[1])) : 4, i = t ? Math.min(59, Number(t[2])) : 0;
  return e.kind === "daily" ? `${i} ${n} * * *` : e.kind === "weekly" ? `${i} ${n} * * ${e.day}` : `${i} ${n} ${Math.min(31, Math.max(1, e.day))} * *`;
}
function xt(e) {
  return Me[e === "fr" ? "fr" : "en"];
}
const z = {
  kindLabel: "Quest groups",
  collection: "Quests",
  title: "Title",
  description: "Description",
  actorType: "Who plays",
  "actor.player": "Each player",
  "actor.global": "The whole server",
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
  stageTitle: "Stage title (optional)",
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
  stageTitle: "Titre de l'étape (facultatif)",
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
}, je = { en: z.kindLabel, fr: ae.kindLabel }, wt = { en: z.collection, fr: ae.collection }, Nt = nt({ en: z, fr: ae });
function Pe(e) {
  const t = e === "fr" ? ae : z;
  return (n, i) => {
    const a = t[n] ?? z[n] ?? n;
    return i ? a.replace(/\{\{(\w+)\}\}/g, (o, l) => String(i[l] ?? o)) : a;
  };
}
const ve = "quest_group", He = "quest_groups", _t = "quests", be = "quest_group/v1", pe = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function W(e = Date.now()) {
  let t = "", n = e;
  for (let o = 0; o < 10; o++)
    t = pe[n % 32] + t, n = Math.floor(n / 32);
  const i = new Uint8Array(16);
  crypto.getRandomValues(i);
  let a = "";
  for (let o = 0; o < 16; o++) a += pe[i[o] % 32];
  return t + a;
}
function V(e, t) {
  const n = new Set(t);
  if (!n.has(e)) return e;
  for (let i = 2; ; i++) if (!n.has(`${e}_${i}`)) return `${e}_${i}`;
}
function jt(e, t) {
  const n = new Set(t), i = new Uint8Array(4);
  for (; ; ) {
    crypto.getRandomValues(i);
    const a = Array.from(i, (l) => pe[l % 32].toLowerCase()).join(""), o = `${re(e)}_${a}`;
    if (!n.has(o)) return o;
  }
}
function Ke(e) {
  return e.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
function re(e) {
  return e.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "quest";
}
function A(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? { ...e } : {};
}
function de(e) {
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
function Ct(e, t) {
  const n = {}, i = [];
  function a(c) {
    if (c && typeof c == "object" && !Array.isArray(c)) {
      const s = K(), v = {};
      for (const [q, g] of Object.entries(c)) v[q] = S(g);
      return n[s] = v, { key: s };
    }
    const u = typeof c == "string" ? /^\{i18n:(.+)\}$/.exec(c) : null;
    if (u) {
      const s = t.translations?.[u[1]];
      return s && (n[u[1]] = { ...s }), { key: u[1] };
    }
    const h = K();
    return n[h] = c == null || c === "" ? {} : { [t.lang]: S(c) }, { key: h };
  }
  const o = Object.entries(A(e.tiers)).map(([c, u]) => {
    const h = A(u);
    return { key: c, title: a(h.title), rest: F(h, "title") };
  }), l = de(e.quests).map((c, u) => {
    const h = A(c), s = de(h.stages).map((v, q) => {
      const g = A(v), m = S(g.flow).toLowerCase();
      return {
        key: S(g.key) || `stage_${q + 1}`,
        title: a(g.title),
        flow: m === "parallel" || m === "sequential" ? m : "",
        objectives: de(g.objectives).map((k, y) => {
          const x = A(k);
          return {
            key: S(x.key) || `objective_${y + 1}`,
            type: S(x.type),
            params: F(x, "key", "type")
          };
        }),
        rest: F(g, "key", "title", "flow", "objectives")
      };
    });
    return {
      key: S(h.key) || `quest_${u + 1}`,
      uid: S(h.uid) || W(),
      tier: S(h.tier),
      title: a(h.title),
      description: a(h.description),
      duration: S(h.duration),
      stages: s,
      rest: Et(h)
    };
  }), d = {
    id: S(e.id),
    projectId: t.projectId,
    uid: S(e.uid) || W(),
    title: a(e.title),
    description: a(e.description),
    actorType: S(e.actor_type) || "player",
    reset: A(e.reset),
    limits: A(e.limits),
    rotation: A(e.rotation),
    distribution: A(e.distribution),
    tiers: o,
    quests: l,
    rest: Ge(F(
      A(e),
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
function Ge(e) {
  return e.on !== void 0 && (e.actions == null && (e.actions = e.on), delete e.on), e;
}
function Et(e) {
  const t = Ge(
    F(e, "key", "uid", "tier", "title", "description", "duration", "stages", "reward_display")
  );
  if (t.rewards !== void 0) {
    const n = A(t.actions);
    n.complete == null && (t.actions = { ...n, complete: t.rewards }), delete t.rewards;
  }
  return t;
}
function At(e) {
  return typeof e == "string" ? e === "" : Object.values(e).every((t) => t === "");
}
function D(e) {
  const t = {};
  for (const [n, i] of Object.entries(e))
    i == null || i === "" || Array.isArray(i) && i.length === 0 || typeof i == "object" && !Array.isArray(i) && Object.keys(i).length === 0 || (t[n] = i);
  return t;
}
const Tt = [
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
function $t(e, t) {
  const n = (u) => it(t, u.key), i = (u) => {
    const h = n(u);
    return At(h) ? void 0 : h;
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
  }, d = {};
  for (const u of Tt) u in l && (d[u] = l[u]);
  for (const u of Object.keys(l)) u in d || (d[u] = l[u]);
  const c = D(d);
  return c.quests = o, c;
}
function* St(e) {
  const t = `${He}.${e.id}`;
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
    const d = /* @__PURE__ */ new Set();
    for (let c = 0; c < a.stages.length; c++) {
      const u = a.stages[c], h = d.has(u.key) ? `${u.key}_${c}` : u.key;
      d.add(u.key), yield {
        lText: u.title,
        key: `${l}.stages.${h}.title`,
        path: `quests[${i}].stages[${c}].title`,
        kind: "quest.stage"
      };
    }
  }
}
function Ce(e) {
  return !!e && typeof e == "object" && !Array.isArray(e) && "type" in e;
}
function Ot(e) {
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
function Rt(e) {
  const t = String(e.type), n = e.command ?? e.message ?? e.title ?? e.material;
  return typeof n == "string" ? `${t} · ${n}` : t;
}
const Lt = [
  "distribution",
  "actor_load",
  "quest_start",
  "objective_progress",
  "objective_complete",
  "quest_complete",
  "period_complete"
], It = ["start", "objective_progress", "objective_complete", "complete"], M = { name: "amount", kind: "int", required: !0 }, qe = [
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
function Qe(e) {
  const t = {};
  for (const n of U(e)?.params ?? [])
    n.kind === "int" && (t[n.name] = 1);
  return t;
}
function oe(e) {
  return e.amount ?? e.distance;
}
function ke(e, t) {
  const n = e[t.name];
  if (n && typeof n == "object" && !Array.isArray(n)) return n;
  const i = t.legacy ? e[t.legacy] : void 0;
  return typeof i == "string" && i !== "" ? { material: i } : {};
}
function Dt(e, t, n, i) {
  t.legacy && delete e[t.legacy];
  const a = !n || Object.keys(n).length === 0;
  a ? delete e[t.name] : e[t.name] = n, a || i === void 0 ? delete e.match : e.match = i;
}
function Ue(e) {
  const t = e.title;
  if (typeof t == "string" && t.trim() !== "") return t.replace(/<[^>]*>/g, "");
  const n = e.material ?? e.item;
  return typeof n == "string" ? n : "";
}
function xe(e, t) {
  const n = U(e);
  return n ? n.params.filter((i) => i.kind !== "int").map((i) => i.kind === "item" ? Ue(ke(t, i)) : t[i.name]).filter((i) => typeof i == "string" && i !== "").join(" = ") : Object.keys(t).map((i) => t[i]).filter((i) => typeof i == "string" && i !== "").join(" = ");
}
function Be(e, t) {
  return (U(e)?.params ?? []).filter((n) => n.required && (t[n.name] === void 0 || t[n.name] === "")).map((n) => n.name);
}
const Mt = [
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
], Pt = "#f59e0b";
function te(e, t) {
  return U(t) ? e(`objective.${t}`) : t;
}
function ne(e, t) {
  const n = xe(t.type, t.params), i = oe(t.params);
  return `${te(e, t.type)}${n ? ` · ${n}` : ""}${i !== void 0 ? ` · 0/${String(i)}` : ""}`;
}
function Q(e) {
  return e.replace(/<[^<>]*>/g, "").trim();
}
function we(e) {
  const t = e.distribution?.strategy;
  return typeof t == "string" && ["sequential", "ladder"].includes(t.toLowerCase());
}
function Ht(e, t, n) {
  const i = Pe(n), a = we(e);
  return e.quests.map((o, l) => {
    const d = $(t, o.title.key, n);
    return {
      id: o.uid,
      label: Q(d) || o.key,
      detail: o.tier || void 0,
      caption: Kt(i, o),
      marker: a ? String(l + 1) : void 0,
      hover: {
        title: d || o.key,
        text: $(t, o.description.key, n) || void 0,
        lines: Gt(i, o, t, n)
      }
    };
  });
}
function Kt(e, t) {
  const n = t.stages.flatMap((o) => o.objectives), i = n[0];
  if (!i) return;
  const a = n.length - 1;
  return a > 0 ? `${ne(e, i)} +${String(a)}` : ne(e, i);
}
function Gt(e, t, n, i) {
  const a = t.stages.length > 1;
  return t.stages.flatMap(
    (o, l) => o.objectives.map((d) => {
      const c = ne(e, d);
      return a ? `<gray>${Q($(n, o.title.key, i)) || e("stage", { n: l + 1 })} ·</gray> ${c}` : c;
    })
  );
}
function Qt(e, t) {
  const n = Pe(t), i = typeof e.distribution?.strategy == "string" ? e.distribution.strategy.toLowerCase() : "", a = e.quests.length, o = a === 1 ? n("questCountOne") : n("questCount", { count: a }), l = i === "sequential" || i === "ladder" ? "ordered" : i;
  return ["none", "ordered", "random"].includes(l) ? `${o} · ${n(`strategy.${l}`).toLowerCase()}` : o;
}
function Ut(e, t) {
  const n = oe(t.params), i = xe(t.type, t.params), a = n !== void 0 ? String(n) : "", o = a && i ? `${a} × ${i}` : a || i;
  return o ? `${te(e, t.type)} · ${o}` : te(e, t.type);
}
function Fe(e) {
  return e.stages.flatMap((t) => t.objectives);
}
function Bt(e) {
  const t = Fe(e), n = t.map((i) => i.key);
  return t.some(
    (i) => Be(i.type, i.params).length > 0 || n.indexOf(i.key) !== n.lastIndexOf(i.key)
  );
}
function Ft(e) {
  return Object.values(A(e.rest.actions)).reduce(
    (t, n) => t + (Array.isArray(n) ? n.length : n == null ? 0 : 1),
    0
  );
}
function ze(e) {
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
function zt(e, t, n) {
  const i = structuredClone(e);
  i.uid = W(), i.key = V(`${e.key}_copy`, t), i.title = n(e.title), i.description = n(e.description);
  for (const [a, o] of i.stages.entries()) o.title = n(e.stages[a].title);
  return i;
}
const Wt = `
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
.aq .aq-stage-title { flex: 1 1 180px; min-width: 0; font-weight: 600; }
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
`, Vt = /^(\d+|(\d+[dhms])+)$/, Jt = ["actor_load", "period_reset", "quest_complete"], Yt = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
function Zt(e, t) {
  const n = bt(e, /* @__PURE__ */ new Date());
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
function Xt({ projectId: e, documentId: t, document: n, item: i }) {
  at("msquests", Wt);
  const a = n, o = rt(e), l = ot(), d = Nt(), [c, u] = R(i ?? null);
  ge(() => {
    u(i ?? null);
  }, [i]);
  const h = (g) => {
    u(g), ct({ documentId: t, item: g });
  }, v = { projectId: e, project: o, lang: l, t: d, edit: (g, m) => {
    const k = structuredClone(a);
    g(k), lt({ projectId: e, kind: ve, id: t, doc: k, texts: m });
  } }, q = c ? a.quests.findIndex((g) => g.uid === c) : -1;
  return /* @__PURE__ */ r("div", { className: "aq", children: q >= 0 ? /* @__PURE__ */ r(dn, { ctx: v, group: a, index: q, onLeave: () => h(null) }, c) : /* @__PURE__ */ r(rn, { ctx: v, group: a, onOpen: h }) });
}
function J({ open: e }) {
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
function en() {
  return /* @__PURE__ */ f("svg", { "aria-hidden": "true", width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: [
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
function T({
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
function ue({
  ctx: e,
  label: t,
  node: n,
  multiline: i
}) {
  const a = $(e.project, n.key, e.lang), o = (l) => e.edit(() => {
  }, [{ key: n.key, lang: e.lang, value: l }]);
  return /* @__PURE__ */ r(T, { label: `${t} · ${e.lang}`, children: /* @__PURE__ */ r(ee, { value: a, onChange: o, multiline: i, "aria-label": t }) });
}
function tn(e) {
  return typeof e == "number" ? String(e) : typeof e == "string" ? e : "";
}
function P({
  label: e,
  value: t,
  onChange: n,
  placeholder: i
}) {
  return /* @__PURE__ */ r(T, { label: e, children: /* @__PURE__ */ r(
    "input",
    {
      className: "input",
      type: "number",
      min: 0,
      step: 1,
      value: tn(t),
      placeholder: i,
      onChange: (a) => {
        const o = a.target.value.trim();
        n(o === "" ? void 0 : Math.max(0, Math.trunc(Number(o))));
      }
    }
  ) });
}
function nn(e) {
  const t = We(e);
  return t !== "" && t !== "none";
}
function We(e) {
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
function se({
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
  const [a, o] = R(!1);
  return a ? /* @__PURE__ */ f("span", { className: "aq-confirm", children: [
    /* @__PURE__ */ r(G, { size: "sm", variant: "ghost", onClick: () => o(!1), children: e("cancel") }),
    /* @__PURE__ */ r("button", { type: "button", className: "aq-danger", onClick: i, children: e("remove") })
  ] }) : /* @__PURE__ */ r(se, { label: t, onClick: () => n ? i() : o(!0), children: "×" });
}
function an({
  label: e,
  children: t
}) {
  const [n, i] = R(!1), a = yt(null);
  return ge(() => {
    if (!n) return;
    const o = (d) => {
      a.current?.contains(d.target) || i(!1);
    }, l = (d) => {
      d.key === "Escape" && (d.preventDefault(), i(!1));
    };
    return window.addEventListener("mousedown", o), window.addEventListener("keydown", l, !0), () => {
      window.removeEventListener("mousedown", o), window.removeEventListener("keydown", l, !0);
    };
  }, [n]), /* @__PURE__ */ f("div", { className: "aq-menu-anchor", ref: a, children: [
    /* @__PURE__ */ r(se, { label: e, expanded: n, onClick: () => i(!n), children: /* @__PURE__ */ r(en, {}) }),
    n && /* @__PURE__ */ r("div", { className: "aq-menu", role: "menu", children: t(() => i(!1)) })
  ] });
}
function Ve(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n, i) => {
    const a = t.has(n) ? `${n}#${i}` : n;
    return t.add(n), a;
  });
}
function rn({
  ctx: e,
  group: t,
  onOpen: n
}) {
  const { t: i, edit: a, project: o, lang: l } = e, [d, c] = R(t.quests.length === 0), [u, h] = R(null), s = we(t), v = Object.keys(t.rest).filter((m) => m !== "actions"), q = () => {
    const m = K(), k = W();
    a(
      (y) => {
        y.quests.push({
          key: V(
            "quest",
            y.quests.map((x) => x.key)
          ),
          uid: k,
          tier: "",
          title: { key: m },
          description: { key: K() },
          duration: "",
          stages: [Ze(1)],
          rest: {}
        });
      },
      [{ key: m, lang: l, value: i("newQuestTitle") }]
    ), n(k);
  }, g = (m) => {
    const k = [], y = (x) => {
      const w = K();
      for (const [N, E] of Object.entries(ft(o, x.key)))
        E !== "" && k.push({ key: w, lang: N, value: E });
      return { key: w };
    };
    a((x) => {
      x.quests.splice(
        m + 1,
        0,
        zt(
          x.quests[m],
          x.quests.map((w) => w.key),
          y
        )
      );
    }, k);
  };
  return /* @__PURE__ */ f(H, { children: [
    /* @__PURE__ */ f("section", { className: "aq-card", children: [
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "aq-fold-head",
          "aria-expanded": d,
          onClick: () => c(!d),
          children: [
            /* @__PURE__ */ r(J, { open: d }),
            /* @__PURE__ */ r("span", { className: "aq-h", children: i("groupSettings") }),
            !d && /* @__PURE__ */ r(on, { ctx: e, group: t })
          ]
        }
      ),
      d && /* @__PURE__ */ r(sn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-card", children: [
      /* @__PURE__ */ f("div", { className: "aq-card-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: i("quests") }),
        /* @__PURE__ */ r("span", { className: "aq-count", children: t.quests.length }),
        /* @__PURE__ */ r("span", { className: "aq-grow" }),
        /* @__PURE__ */ f(G, { size: "sm", variant: "primary", onClick: q, children: [
          "+ ",
          i("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: i("noQuests") }),
      /* @__PURE__ */ r(
        ye,
        {
          ids: t.quests.map((m) => m.uid),
          onMove: (m, k) => a((y) => Ne(y.quests, m, k)),
          className: "aq-quests",
          itemClassName: "aq-quest",
          children: (m, k) => {
            const y = t.quests[m], x = Q($(o, y.title.key, l)) || y.key, w = Fe(y), N = ze(y.rest), E = t.tiers.find((b) => b.key === y.tier), p = Ft(y);
            return /* @__PURE__ */ f(H, { children: [
              k,
              s && /* @__PURE__ */ r("span", { className: "aq-n", children: m + 1 }),
              /* @__PURE__ */ f("button", { type: "button", className: "aq-quest-main", onClick: () => n(y.uid), children: [
                /* @__PURE__ */ r("span", { className: "aq-quest-title", children: x }),
                /* @__PURE__ */ r("span", { className: "aq-quest-sub", children: w.length === 0 ? i("noObjectivesShort") : w.map((b) => Ut(i, b)).join("  ·  ") })
              ] }),
              u === y.uid ? /* @__PURE__ */ f("span", { className: "aq-confirm", children: [
                /* @__PURE__ */ r("span", { children: i("removeConfirm", { name: x }) }),
                /* @__PURE__ */ r(G, { size: "sm", variant: "ghost", onClick: () => h(null), children: i("cancel") }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "aq-danger",
                    onClick: () => {
                      h(null), a((b) => {
                        b.quests.splice(m, 1);
                      });
                    },
                    children: i("remove")
                  }
                )
              ] }) : /* @__PURE__ */ f(H, { children: [
                /* @__PURE__ */ f("span", { className: "aq-chips", children: [
                  Bt(y) && /* @__PURE__ */ r(C, { tone: "warn", children: i("toComplete") }),
                  s && N.length > 0 && /* @__PURE__ */ f(C, { tone: "ok", children: [
                    i("completedWhen"),
                    " ",
                    Ae(N) !== null ? /* @__PURE__ */ r("span", { className: "aq-mono", children: Ae(N) }) : i("conditionCount", { count: N.length })
                  ] }),
                  y.tier && /* @__PURE__ */ r(C, { children: E && Q($(o, E.title.key, l)) || y.tier }),
                  y.duration && /* @__PURE__ */ r(C, { children: y.duration }),
                  p > 0 && /* @__PURE__ */ r(C, { children: p === 1 ? i("actionCountOne") : i("actionCount", { count: p }) })
                ] }),
                /* @__PURE__ */ r(an, { label: i("moreActions"), children: (b) => /* @__PURE__ */ f(H, { children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      onClick: () => {
                        b(), g(m);
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
                        b(), h(y.uid);
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
      v.length > 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: i("kept", { fields: v.join(", ") }) })
    ] })
  ] });
}
function Je(e, t) {
  return t === "player" || t === "global" ? e(`actor.${t}`) : t;
}
function me(e) {
  const t = We(e);
  return t === "sequential" || t === "ladder" ? "ordered" : t === "none" || t === "random" ? t : "";
}
function on({ ctx: e, group: t }) {
  const { t: n } = e, i = De(), a = typeof t.reset.cron == "string" ? t.reset.cron : "", o = me(t.distribution), l = Object.keys(A(t.rest.actions)).length, d = a ? vt(a, i) ?? a : n("noReset");
  return /* @__PURE__ */ f("span", { className: "aq-chips", children: [
    /* @__PURE__ */ r(C, { children: Je(n, t.actorType) }),
    o && /* @__PURE__ */ r(C, { children: n(`strategy.${o}`) }),
    /* @__PURE__ */ r(C, { children: d.charAt(0).toUpperCase() + d.slice(1) }),
    t.tiers.length > 0 && /* @__PURE__ */ r(C, { children: n("tierCount", { count: t.tiers.length }) }),
    l > 0 && /* @__PURE__ */ r(C, { children: n("eventCount", { count: l }) })
  ] });
}
function sn({ ctx: e, group: t }) {
  const { t: n, edit: i, project: a, lang: o } = e, l = me(t.distribution), d = l === "ordered", c = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], u = t.distribution.tiers ?? {}, h = ["player", "global"].includes(t.actorType) ? ["player", "global"] : ["player", "global", t.actorType];
  return /* @__PURE__ */ f("div", { className: "aq-settings", children: [
    /* @__PURE__ */ f("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("identity") }),
      /* @__PURE__ */ r(ue, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ r(ue, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ f("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("actorType") }),
        /* @__PURE__ */ r(
          ie,
          {
            label: n("actorType"),
            value: t.actorType,
            options: h.map((s) => ({ value: s, label: Je(n, s) })),
            onChange: (s) => i((v) => {
              v.actorType = s;
            })
          }
        )
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
            value: l,
            options: ["none", "ordered", "random"].map((s) => ({
              value: s,
              label: n(`strategy.${s}`)
            })),
            onChange: (s) => i((v) => {
              s === "ordered" && me(v.distribution) === "ordered" || (v.distribution.strategy = s === "ordered" ? "sequential" : s);
            })
          }
        )
      ] }),
      !d && /* @__PURE__ */ f(H, { children: [
        /* @__PURE__ */ f("div", { className: "aq-row", children: [
          /* @__PURE__ */ r(
            P,
            {
              label: n("amount"),
              value: t.distribution.amount,
              onChange: (s) => i((v) => j(v.distribution, "amount", s))
            }
          ),
          /* @__PURE__ */ r(
            P,
            {
              label: n("maxActive"),
              value: t.limits.max_active,
              onChange: (s) => i((v) => j(v.limits, "max_active", s))
            }
          )
        ] }),
        /* @__PURE__ */ f("div", { className: "aq-field", children: [
          /* @__PURE__ */ r("span", { className: "field-label", children: n("triggers") }),
          Jt.map((s) => /* @__PURE__ */ f("label", { className: "aq-check", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: c.includes(s),
                onChange: (v) => i((q) => {
                  const g = Array.isArray(q.distribution.triggers) ? q.distribution.triggers : [], m = v.target.checked ? [...g, s] : g.filter((k) => k !== s);
                  j(q.distribution, "triggers", m.length ? m : void 0);
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
          onChange: (s) => i((v) => j(v.limits, "max_per_period", s))
        }
      ),
      !d && /* @__PURE__ */ f("div", { className: "aq-row", children: [
        /* @__PURE__ */ f("label", { className: "aq-check", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: t.rotation.enabled === !0,
              onChange: (s) => i((v) => j(v.rotation, "enabled", s.target.checked ? !0 : void 0))
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
            onChange: (s) => i((v) => j(v.rotation, "max_per_period", s))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ f("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("reset") }),
      /* @__PURE__ */ r(ln, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ f("div", { className: "aq-block", children: [
      /* @__PURE__ */ f("div", { className: "aq-block-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("tiers") }),
        /* @__PURE__ */ f(
          G,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => i((s) => {
              s.tiers.push({
                key: V(
                  "tier",
                  s.tiers.map((v) => v.key)
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
      t.tiers.map((s, v) => /* @__PURE__ */ f("div", { className: "aq-row", children: [
        /* @__PURE__ */ r(T, { label: n("tierKey"), children: /* @__PURE__ */ r(
          "input",
          {
            className: "input aq-mono",
            defaultValue: s.key,
            onBlur: (q) => {
              const g = re(q.target.value);
              g !== s.key && i((m) => {
                const k = V(
                  g,
                  m.tiers.map((x) => x.key)
                );
                m.tiers[v].key = k;
                for (const x of m.quests) x.tier === s.key && (x.tier = k);
                const y = m.distribution.tiers;
                y && s.key in y && (y[k] = y[s.key], delete y[s.key]);
              });
            }
          }
        ) }),
        /* @__PURE__ */ r(ue, { ctx: e, label: n("title"), node: s.title }),
        !d && /* @__PURE__ */ r(
          P,
          {
            label: n("perTier"),
            value: u[s.key],
            onChange: (q) => i((g) => {
              const m = { ...g.distribution.tiers ?? {} };
              j(m, s.key, q), j(g.distribution, "tiers", Object.keys(m).length ? m : void 0);
            })
          }
        ),
        /* @__PURE__ */ r(
          _e,
          {
            t: n,
            label: n("remove"),
            sure: !t.quests.some((q) => q.tier === s.key),
            onRemove: () => i((q) => {
              q.tiers.splice(v, 1);
            })
          }
        )
      ] }, s.key)),
      t.tiers.length === 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: n("noTier") })
    ] }),
    /* @__PURE__ */ r("div", { className: "aq-block is-wide", children: /* @__PURE__ */ r(
      Ye,
      {
        ctx: e,
        title: n("hooks"),
        hooks: Lt,
        label: (s) => n(`hook.${s}`),
        value: t.rest.actions,
        onChange: (s, v) => i((q) => {
          const g = { ...A(q.rest.actions) };
          j(g, s, v), j(q.rest, "actions", Object.keys(g).length ? g : void 0);
        })
      },
      t.uid
    ) })
  ] });
}
function ln({ ctx: e, group: t }) {
  const { t: n, edit: i } = e, a = De(), o = typeof t.reset.cron == "string" ? t.reset.cron : "", l = qt(o), [d, c] = R(!1), u = d && o !== "" ? { kind: "custom" } : l, h = typeof t.reset.timezone == "string" ? t.reset.timezone : "", s = o && ce(o) ? Zt(o, a) : null, v = (m) => {
    const k = kt(m);
    k !== null && i((y) => j(y.reset, "cron", k));
  }, q = "time" in u ? u.time : "04:00", g = (m) => {
    c(m === "custom"), m === "never" ? v({ kind: m }) : m === "daily" ? v({ kind: m, time: q }) : m === "weekly" ? v({ kind: m, time: q, day: 1 }) : m === "monthly" ? v({ kind: m, time: q, day: 1 }) : o === "" && i((k) => j(k.reset, "cron", "0 4 * * *"));
  };
  return /* @__PURE__ */ f(H, { children: [
    /* @__PURE__ */ r(
      ie,
      {
        label: n("reset"),
        value: u.kind,
        options: ["never", "daily", "weekly", "monthly", "custom"].map((m) => ({
          value: m,
          label: n(`reset.${m}`)
        })),
        onChange: g
      }
    ),
    u.kind !== "never" && /* @__PURE__ */ f("div", { className: "aq-row aq-reset", children: [
      u.kind === "weekly" && /* @__PURE__ */ r(T, { label: n("resetDay"), children: /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: u.day,
          onChange: (m) => v({ ...u, day: Number(m.target.value) }),
          children: [1, 2, 3, 4, 5, 6, 0].map((m) => /* @__PURE__ */ r("option", { value: m, children: xt(a)[m] }, m))
        }
      ) }),
      u.kind === "monthly" && /* @__PURE__ */ r(
        P,
        {
          label: n("resetDayOfMonth"),
          value: u.day,
          onChange: (m) => v({ ...u, day: m ?? 1 })
        }
      ),
      u.kind === "custom" ? /* @__PURE__ */ r(
        T,
        {
          label: n("cron"),
          hint: ce(o) ? void 0 : /* @__PURE__ */ r("span", { className: "aq-err", children: n("cronInvalid") }),
          children: /* @__PURE__ */ r(
            "input",
            {
              className: "input aq-mono",
              value: o,
              placeholder: "0 4 * * *",
              onChange: (m) => i((k) => j(k.reset, "cron", m.target.value))
            }
          )
        }
      ) : /* @__PURE__ */ r(T, { label: n("resetTime"), children: /* @__PURE__ */ r(
        "input",
        {
          className: "input",
          type: "time",
          value: u.time,
          onChange: (m) => m.target.value && v({ ...u, time: m.target.value })
        }
      ) })
    ] }),
    o && ce(o) && (h || s) && /* @__PURE__ */ r("span", { className: "aq-ok", children: h && h !== Yt ? h : s ? n("nextRun", { when: s }) : "" })
  ] });
}
function cn({
  ctx: e,
  value: t,
  onChange: n
}) {
  const { chain: i, legacy: a } = Ot(t);
  return /* @__PURE__ */ f("div", { className: "aq-chain", children: [
    /* @__PURE__ */ r(
      dt,
      {
        projectId: e.projectId,
        value: i,
        onChange: (o) => n(Ee(o, a))
      }
    ),
    a.length > 0 && /* @__PURE__ */ r("div", { className: "aq-legacy", title: e.t("legacySteps"), children: a.map((o, l) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
      /* @__PURE__ */ f("div", { className: "aq-legacy-row", children: [
        /* @__PURE__ */ r("code", { children: Rt(o) }),
        /* @__PURE__ */ r(
          se,
          {
            label: e.t("remove"),
            onClick: () => n(Ee(i, a.filter((d, c) => c !== l))),
            children: "×"
          }
        )
      ] }, l)
    )) })
  ] });
}
function Ye({
  ctx: e,
  title: t,
  hooks: n,
  label: i,
  value: a,
  onChange: o
}) {
  const { t: l } = e, d = A(a), [c, u] = R([]), [h, s] = R(null), v = n.filter((g) => d[g] != null || c.includes(g)), q = n.filter((g) => !v.includes(g));
  return /* @__PURE__ */ f(H, { children: [
    /* @__PURE__ */ f("div", { className: "aq-block-head", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: t }),
      q.length > 0 && /* @__PURE__ */ f(
        "select",
        {
          className: "select aq-event-add",
          "aria-label": l("addEvent"),
          value: "",
          onChange: (g) => {
            const m = q.find((k) => k === g.target.value);
            m && (u((k) => [...k, m]), s(m));
          },
          children: [
            /* @__PURE__ */ f("option", { value: "", children: [
              "+ ",
              l("addEvent")
            ] }),
            q.map((g) => /* @__PURE__ */ r("option", { value: g, children: i(g) }, g))
          ]
        }
      )
    ] }),
    v.map((g) => {
      const m = h === g, k = Array.isArray(d[g]) ? d[g].length : d[g] ? 1 : 0;
      return /* @__PURE__ */ f("div", { className: `aq-line${m ? " is-open" : ""}`, children: [
        /* @__PURE__ */ f("div", { className: "aq-line-head", children: [
          /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "aq-line-main",
              "aria-expanded": m,
              onClick: () => s(m ? null : g),
              children: [
                /* @__PURE__ */ r(J, { open: m }),
                /* @__PURE__ */ r("span", { className: "aq-line-text", children: i(g) }),
                k > 0 && /* @__PURE__ */ r(C, { children: k === 1 ? l("actionCountOne") : l("actionCount", { count: k }) })
              ]
            }
          ),
          /* @__PURE__ */ r(
            _e,
            {
              t: l,
              label: l("removeEvent"),
              sure: k === 0,
              onRemove: () => {
                u((y) => y.filter((x) => x !== g)), o(g, void 0);
              }
            }
          )
        ] }),
        m && /* @__PURE__ */ r("div", { className: "aq-line-body", children: /* @__PURE__ */ r(cn, { ctx: e, value: d[g], onChange: (y) => o(g, y) }) })
      ] }, g);
    })
  ] });
}
function Ze(e) {
  return {
    key: `stage_${e}`,
    title: { key: K() },
    flow: "parallel",
    objectives: [],
    rest: {}
  };
}
function dn({
  ctx: e,
  group: t,
  index: n,
  onLeave: i
}) {
  const { t: a, edit: o, project: l, lang: d } = e, c = t.quests[n], u = (p, b) => o((_) => p(_.quests[n]), b), h = t.quests.some((p, b) => b !== n && p.key === c.key), s = c.duration !== "" && !Vt.test(c.duration.replace(/\s/g, "").toLowerCase()), v = Object.keys(c.rest).filter(
    (p) => p !== "actions" && p !== "giver" && p !== "completed_when"
  ), q = we(t), g = c.rest.giver && typeof c.rest.giver == "object" ? c.rest.giver : {}, m = (p, b) => u((_) => {
    const I = { ...g };
    j(I, p, b.trim()), typeof I.npc == "string" && I.npc !== "" ? _.rest.giver = I : delete _.rest.giver;
  }), k = typeof g.npc == "string" ? g.npc : "", y = nn(t.distribution), x = t.tiers.find((p) => p.key === c.tier), [w, N] = R(!1), E = w || h || s;
  return ge(() => {
    const p = (b) => {
      b.key !== "Escape" || b.defaultPrevented || b.target?.closest("input, textarea, select, [contenteditable='true']") || window.document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]') || (b.preventDefault(), i());
    };
    return window.addEventListener("keydown", p, !0), () => window.removeEventListener("keydown", p, !0);
  }, [i]), /* @__PURE__ */ f("div", { className: "aq-quest-page", children: [
    /* @__PURE__ */ f("div", { className: "aq-quest-col", children: [
      /* @__PURE__ */ f("section", { className: "aq-card", children: [
        /* @__PURE__ */ f("div", { className: "aq-quest-head", children: [
          /* @__PURE__ */ r("div", { className: "aq-quest-name", children: /* @__PURE__ */ r(
            ee,
            {
              value: $(l, c.title.key, d),
              placeholder: a("title"),
              "aria-label": a("title"),
              onChange: (p) => o(() => {
              }, [{ key: c.title.key, lang: d, value: p }])
            }
          ) }),
          /* @__PURE__ */ r("div", { className: "aq-quest-desc", children: /* @__PURE__ */ r(
            ee,
            {
              value: $(l, c.description.key, d),
              placeholder: a("description"),
              "aria-label": a("description"),
              multiline: !0,
              rows: 2,
              onChange: (p) => o(() => {
              }, [{ key: c.description.key, lang: d, value: p }])
            }
          ) })
        ] }),
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: "aq-fold-head is-inner",
            "aria-expanded": E,
            onClick: () => N(!E),
            children: [
              /* @__PURE__ */ r(J, { open: E }),
              /* @__PURE__ */ r("span", { className: "aq-fold-title", children: a("questSettings") }),
              !E && /* @__PURE__ */ f("span", { className: "aq-chips", children: [
                c.tier && /* @__PURE__ */ r(C, { children: x && Q($(l, x.title.key, d)) || c.tier }),
                /* @__PURE__ */ r(C, { children: c.duration || a("noTimeLimit") }),
                k && /* @__PURE__ */ r(C, { children: a("givenBy", { npc: k }) }),
                /* @__PURE__ */ r(C, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: c.key }) })
              ] })
            ]
          }
        ),
        E && /* @__PURE__ */ f("div", { className: "aq-fold-body", children: [
          /* @__PURE__ */ f("div", { className: "aq-row aq-top aq-wrap", children: [
            t.tiers.length > 0 || c.tier ? /* @__PURE__ */ r(T, { label: a("tier"), children: /* @__PURE__ */ f(
              "select",
              {
                className: "select",
                value: c.tier,
                onChange: (p) => u((b) => {
                  b.tier = p.target.value;
                }),
                children: [
                  /* @__PURE__ */ r("option", { value: "", children: a("noTier") }),
                  t.tiers.map((p) => /* @__PURE__ */ r("option", { value: p.key, children: Q($(l, p.title.key, d)) || p.key }, p.key)),
                  c.tier && !x && /* @__PURE__ */ r("option", { value: c.tier, children: c.tier })
                ]
              }
            ) }) : null,
            /* @__PURE__ */ r(
              T,
              {
                label: a("duration"),
                hint: s ? /* @__PURE__ */ r("span", { className: "aq-err", children: a("durationInvalid") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input",
                    value: c.duration,
                    placeholder: "24h",
                    onChange: (p) => u((b) => {
                      b.duration = p.target.value.trim();
                    })
                  }
                )
              }
            ),
            /* @__PURE__ */ r(
              T,
              {
                label: a("key"),
                hint: h ? /* @__PURE__ */ r("span", { className: "aq-err", children: a("keyTaken") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input aq-mono",
                    value: c.key,
                    onChange: (p) => u((b) => {
                      b.key = Ke(p.target.value);
                    }),
                    onBlur: () => {
                      const p = re(c.key);
                      p !== c.key && u((b) => {
                        b.key = p;
                      });
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ f("div", { className: "aq-row aq-top aq-wrap", children: [
            /* @__PURE__ */ r(T, { label: a("giverNpc"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: k,
                onChange: (p) => m("npc", p.target.value)
              }
            ) }),
            k && /* @__PURE__ */ r(T, { label: a("giverConversation"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: typeof g.conversation == "string" ? g.conversation : "",
                onChange: (p) => m("conversation", p.target.value)
              }
            ) })
          ] }),
          k && y && /* @__PURE__ */ r("span", { className: "aq-warn", children: a("giverDistributed") })
        ] })
      ] }),
      /* @__PURE__ */ r(
        ye,
        {
          ids: Ve(c.stages.map((p) => p.key)),
          onMove: (p, b) => u((_) => Ne(_.stages, p, b)),
          className: "aq-stages",
          children: (p, b) => /* @__PURE__ */ r(
            un,
            {
              ctx: e,
              quest: c,
              stage: c.stages[p],
              si: p,
              handle: b,
              editQuest: u
            }
          )
        }
      ),
      /* @__PURE__ */ f(
        G,
        {
          size: "sm",
          variant: "ghost",
          className: "aq-add",
          onClick: () => u((p) => {
            const b = V(
              `stage_${p.stages.length + 1}`,
              p.stages.map((_) => _.key)
            );
            p.stages.push({ ...Ze(p.stages.length + 1), key: b });
          }),
          children: [
            "+ ",
            a("addStage")
          ]
        }
      ),
      q && /* @__PURE__ */ f("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: a("completedWhen") }),
        /* @__PURE__ */ r(
          st,
          {
            projectId: e.projectId,
            value: ze(c.rest),
            emptyHint: a("completedWhenEmpty"),
            onChange: (p) => u((b) => j(b.rest, "completed_when", p.length > 0 ? p : void 0))
          },
          c.uid
        )
      ] }),
      /* @__PURE__ */ f("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r(
          Ye,
          {
            ctx: e,
            title: a("questEvents"),
            hooks: It,
            label: (p) => a(`questHook.${p}`),
            value: c.rest.actions,
            onChange: (p, b) => u((_) => {
              const I = { ...A(_.rest.actions) };
              j(I, p, b), j(_.rest, "actions", Object.keys(I).length > 0 ? I : void 0);
            })
          },
          c.uid
        ),
        v.length > 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: a("kept", { fields: v.join(", ") }) })
      ] })
    ] }),
    /* @__PURE__ */ f("aside", { className: "aq-card aq-pad aq-aside", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: a("preview") }),
      /* @__PURE__ */ r(yn, { ctx: e, quest: c })
    ] })
  ] });
}
function un({
  ctx: e,
  quest: t,
  stage: n,
  si: i,
  handle: a,
  editQuest: o
}) {
  const { t: l } = e, [d, c] = R(null), [u, h] = R(!1), s = (y) => o((x) => y(x.stages[i])), v = $(e.project, n.title.key, e.lang), q = n.flow || "parallel", g = t.stages.flatMap((y) => y.objectives.map((x) => x.key)), m = u || n.objectives.length === 0, k = (y) => {
    const x = jt(y, g);
    o((w) => {
      w.stages[i].objectives.push({ key: x, type: y, params: Qe(y) });
    }), c(x), h(!1);
  };
  return /* @__PURE__ */ f("div", { className: "aq-card aq-stage", children: [
    /* @__PURE__ */ f("div", { className: "aq-stage-head", children: [
      a,
      /* @__PURE__ */ r("span", { className: "aq-n is-brand", children: i + 1 }),
      /* @__PURE__ */ r("div", { className: "aq-stage-title", children: /* @__PURE__ */ r(
        ee,
        {
          value: v,
          placeholder: l("stageTitle"),
          "aria-label": l("stage", { n: i + 1 }),
          onChange: (y) => e.edit(() => {
          }, [{ key: n.title.key, lang: e.lang, value: y }])
        }
      ) }),
      n.objectives.length > 1 && /* @__PURE__ */ r(
        ie,
        {
          label: l("flow"),
          value: q,
          options: ["parallel", "sequential"].map((y) => ({
            value: y,
            label: l(`flow.${y}`)
          })),
          onChange: (y) => s((x) => {
            x.flow = y;
          })
        }
      ),
      /* @__PURE__ */ r(
        _e,
        {
          t: l,
          label: l("remove"),
          sure: n.objectives.length === 0,
          onRemove: () => o((y) => {
            y.stages.splice(i, 1);
          })
        }
      )
    ] }),
    /* @__PURE__ */ r(
      ye,
      {
        ids: Ve(n.objectives.map((y) => y.key)),
        onMove: (y, x) => s((w) => Ne(w.objectives, y, x)),
        className: "aq-objectives",
        children: (y, x) => {
          const w = n.objectives[y];
          return /* @__PURE__ */ r(
            pn,
            {
              t: l,
              projectId: e.projectId,
              n: q === "sequential" ? `${i + 1}.${y + 1}` : "",
              objective: w,
              open: d === w.key,
              onToggle: () => c(d === w.key ? null : w.key),
              keyTaken: g.filter((N) => N === w.key).length > 1,
              handle: x,
              onChange: (N) => s((E) => N(E.objectives[y])),
              onRename: (N) => {
                d === w.key && c(N);
              },
              onRemove: () => s((N) => {
                N.objectives.splice(y, 1);
              })
            }
          );
        }
      }
    ),
    m ? /* @__PURE__ */ f("div", { className: "aq-types", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: l("addObjective") }),
      /* @__PURE__ */ r("div", { className: "aq-seg", children: qe.map((y) => /* @__PURE__ */ f("button", { type: "button", className: "aq-opt", onClick: () => k(y.type), children: [
        /* @__PURE__ */ r("span", { "aria-hidden": !0, children: y.icon }),
        " ",
        l(`objective.${y.type}`)
      ] }, y.type)) })
    ] }) : /* @__PURE__ */ f(G, { size: "sm", variant: "ghost", className: "aq-add", onClick: () => h(!0), children: [
      "+ ",
      l("addObjective")
    ] })
  ] });
}
function pn({
  t: e,
  projectId: t,
  n,
  objective: i,
  open: a,
  onToggle: o,
  keyTaken: l,
  handle: d,
  onChange: c,
  onRename: u,
  onRemove: h
}) {
  const s = U(i.type), v = s ? s.params : Object.keys(i.params).map((p) => ({ name: p, kind: "text" })), q = oe(i.params), g = xe(i.type, i.params), m = Be(i.type, i.params), k = l || m.length > 0, y = v.filter((p) => p.advanced), [x, w] = R(!1), N = x || l, E = (p) => p.kind === "item" ? /* @__PURE__ */ r(
    mn,
    {
      t: e,
      projectId: t,
      spec: p,
      params: i.params,
      onChange: (b) => c((_) => b(_.params))
    },
    p.name
  ) : /* @__PURE__ */ r(
    fn,
    {
      t: e,
      spec: p,
      value: i.params[p.name],
      onChange: (b) => c((_) => j(_.params, p.name, b))
    },
    p.name
  );
  return /* @__PURE__ */ f("div", { className: `aq-obj${a ? " is-open" : ""}${k ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ f("div", { className: "aq-obj-line", children: [
      d,
      /* @__PURE__ */ f("button", { type: "button", className: "aq-obj-main", onClick: o, "aria-expanded": a, children: [
        n && /* @__PURE__ */ r("span", { className: "aq-obj-n", children: n }),
        /* @__PURE__ */ r("span", { className: "aq-obj-icon", "aria-hidden": !0, children: s?.icon ?? "?" }),
        /* @__PURE__ */ f("span", { className: "aq-obj-text", children: [
          te(e, i.type),
          q !== void 0 && /* @__PURE__ */ f("strong", { children: [
            " · ",
            String(q)
          ] }),
          g ? ` × ${g}` : q !== void 0 && s ? ` × ${e("any")}` : ""
        ] }),
        k && /* @__PURE__ */ r(C, { tone: "warn", children: l ? e("objectiveKeyTaken") : e("missing", {
          fields: m.map((p) => e(`param.${p}`)).join(", ")
        }) }),
        /* @__PURE__ */ r(J, { open: a })
      ] }),
      /* @__PURE__ */ r(se, { label: e("remove"), onClick: h, children: "×" })
    ] }),
    a && /* @__PURE__ */ f("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ f("div", { className: "aq-row aq-top aq-wrap", children: [
        /* @__PURE__ */ r(T, { label: e("type"), children: /* @__PURE__ */ f(
          "select",
          {
            className: "select",
            value: i.type,
            onChange: (p) => c((b) => {
              b.type = p.target.value, b.params = Qe(b.type);
            }),
            children: [
              qe.map((p) => /* @__PURE__ */ f("option", { value: p.type, children: [
                p.icon,
                " ",
                e(`objective.${p.type}`)
              ] }, p.type)),
              !s && /* @__PURE__ */ r("option", { value: i.type, children: i.type })
            ]
          }
        ) }),
        v.filter((p) => !p.advanced).map(E)
      ] }),
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "aq-fold-head is-inner",
          "aria-expanded": N,
          onClick: () => w(!N),
          children: [
            /* @__PURE__ */ r(J, { open: N }),
            /* @__PURE__ */ r("span", { className: "aq-fold-title", children: e("more") }),
            !N && /* @__PURE__ */ r(C, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: i.key }) })
          ]
        }
      ),
      N && /* @__PURE__ */ f("div", { className: "aq-row aq-top aq-wrap", children: [
        y.map(E),
        /* @__PURE__ */ r(
          T,
          {
            label: e("key"),
            title: e("objectiveKeyHint"),
            hint: l ? /* @__PURE__ */ r("span", { className: "aq-err", children: e("objectiveKeyTaken") }) : void 0,
            children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: i.key,
                onChange: (p) => {
                  const b = Ke(p.target.value);
                  c((_) => {
                    _.key = b;
                  }), u(b);
                },
                onBlur: () => {
                  const p = re(i.key);
                  p !== i.key && (c((b) => {
                    b.key = p;
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
function mn({
  t: e,
  projectId: t,
  spec: n,
  params: i,
  onChange: a
}) {
  const o = ke(i, n), l = Array.isArray(i.match) ? i.match : void 0, d = (c, u) => a((h) => Dt(h, n, c, u));
  return /* @__PURE__ */ r(T, { label: e(`param.${n.name}`), children: /* @__PURE__ */ r(
    pt,
    {
      projectId: t,
      value: o,
      match: l,
      onChange: (c) => d(c, l),
      onMatchChange: (c) => d(o, c)
    }
  ) });
}
function fn({
  t: e,
  spec: t,
  value: n,
  onChange: i
}) {
  const a = e(`param.${t.name}`), o = typeof n == "string" || typeof n == "number" ? String(n) : "";
  if (t.kind === "int")
    return /* @__PURE__ */ r(P, { label: a, value: n, onChange: i });
  if (t.kind === "material")
    return /* @__PURE__ */ r(T, { label: a, children: /* @__PURE__ */ r(
      mt,
      {
        value: o,
        placeholder: e("any"),
        "aria-label": a,
        onChange: (d) => i(d.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const l = t.kind === "entity";
  return /* @__PURE__ */ f(T, { label: a, children: [
    /* @__PURE__ */ r(
      "input",
      {
        className: `input${l ? " aq-mono" : ""}`,
        list: l ? "aq-entities" : void 0,
        value: o,
        placeholder: l ? e("any") : "",
        onChange: (d) => i(l ? d.target.value.toUpperCase().replace(/\s+/g, "_") : d.target.value)
      }
    ),
    l && /* @__PURE__ */ r("datalist", { id: "aq-entities", children: Mt.map((d) => /* @__PURE__ */ r("option", { value: d }, d)) })
  ] });
}
const hn = 170, Te = { color: "#aaaaaa", italic: !1 }, $e = { color: "#ffffff", italic: !1 };
function yn({ ctx: e, quest: t }) {
  const { t: n, project: i, lang: a } = e, o = (u) => u.split(`
`).flatMap((h) => h === "" ? [""] : ut(h, hn)), l = $(i, t.title.key, a) || t.key, d = $(i, t.description.key, a), c = t.stages.length > 1;
  return /* @__PURE__ */ r("div", { className: "aq-preview", children: /* @__PURE__ */ f("div", { className: "aq-preview-frame", children: [
    /* @__PURE__ */ r(Y, { source: o(l).join(`
`), defaults: $e, scale: 2 }),
    d && /* @__PURE__ */ r(Y, { source: o(d).join(`
`), defaults: Te, scale: 2 }),
    t.stages.map((u, h) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ f("div", { className: "aq-preview-stage", children: [
        c && /* @__PURE__ */ r(
          Y,
          {
            source: o($(i, u.title.key, a) || n("stage", { n: h + 1 })).join(`
`),
            defaults: $e,
            scale: 2
          }
        ),
        u.objectives.length > 0 && /* @__PURE__ */ r(
          Y,
          {
            source: u.objectives.flatMap((s) => o(`• ${ne(n, s)}`)).join(`
`),
            defaults: Te,
            scale: 2
          }
        )
      ] }, h)
    ))
  ] }) });
}
function gn({ className: e }) {
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
const vn = {
  kind: ve,
  dir: He,
  schemaVersion: be,
  // Created in the module's folder only (SDK 1.8); a group already elsewhere still loads.
  projects: [_t],
  // Data with no links: one "Quests" entry and page instead of a node per group (SDK 1.9).
  collection: { labels: wt },
  // A group's id is its key on the server (`quest_group_key`): typed by hand, no prefix.
  label: je.en,
  labels: je,
  icon: gn,
  component: Xt,
  // The view is a page of its own: its cards, and the quest beside what the player sees.
  ownHeader: !0,
  wide: !0,
  title: (e, { project: t, lang: n }) => $(t, e.title.key, n),
  create: ({ id: e, projectId: t }) => ({
    id: e,
    projectId: t,
    uid: W(),
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
  parse: (e, t) => Ct(e, t),
  serialize: (e, t) => $t(e, t),
  ltextSites: (e) => St(e),
  board: {
    size: { width: 300, height: 48 },
    accent: Pt,
    // The group's quests, one selectable row each: the Properties panel opens the one clicked.
    items: (e, { project: t, lang: n }) => Ht(e, t, n),
    summary: (e, { lang: t }) => Qt(e, t)
  }
}, Se = "quests:groups", Oe = "quests:quests", bn = "quests:active";
function qn(e) {
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
}, Le = { en: "Available", fr: "Disponible" };
function kn(e, t, n) {
  const i = qn(t);
  if (i !== Se && i !== Oe && i !== bn) return null;
  const a = e.documents?.[ve];
  if (!a || a.length === 0) return null;
  const o = e.defaultLang ?? "en", l = n?.serverRows, d = n?.params?.group || void 0, c = [...a].sort((h, s) => h.id < s.id ? -1 : h.id > s.id ? 1 : 0);
  if (i === Se) {
    const h = fe(l, "key");
    return c.map((s) => xn(s, h.get(s.id), o));
  }
  if (i === Oe) {
    const h = fe(l, "id");
    return c.filter((s) => !d || s.id === d).flatMap((s) => s.quests.map((v) => Xe(s, v, h.get(`${s.id}:${v.key}`), o)));
  }
  if (!l) return null;
  const u = new Map(a.map((h) => [h.id, h]));
  return l.flatMap((h) => {
    const s = u.get(L(h.group));
    if (!s) return [h];
    const v = s.quests.find((q) => q.key === L(h.quest_key));
    return v ? [jn(v, h, o)] : [];
  });
}
function xn(e, t, n) {
  const i = fe(X(t?.quests), "key");
  return {
    key: e.id,
    name: e.title,
    description: e.description,
    actor_type: e.actorType,
    max_active: he(e.limits.max_active, 1),
    max_per_period: he(e.limits.max_per_period, 0),
    rotatable: e.rotation.enabled === !0,
    // The period follows the server's clock and zone: its value stands until a deploy.
    period_end: t?.period_end ?? 0,
    active_count: t?.active_count ?? 0,
    completed_count: t?.completed_count ?? 0,
    can_rotate: t?.can_rotate ?? !1,
    quests: e.quests.map((a) => Xe(e, a, i.get(a.key), n))
  };
}
function Xe(e, t, n, i) {
  const a = e.tiers.find((o) => o.key === t.tier);
  return {
    id: `${e.id}:${t.key}`,
    group: e.id,
    key: t.key,
    name: t.title,
    description: t.description,
    duration: Tn(t.duration),
    tier: t.tier,
    tier_name: a ? a.title : "",
    assigned: n?.assigned ?? !1,
    status_key: n?.status_key ?? "NOT_STARTED",
    status: n?.status ?? Le[i.slice(0, 2)] ?? Le.en,
    can_start: n?.can_start ?? !1,
    start_blocker: n?.start_blocker ?? "",
    start_blocker_label: n?.start_blocker_label ?? "",
    // `reference` in `QuestRows.questRow`: the attempt the server holds for this player.
    ...et(t, n?.assigned === !0 ? n : void 0, i)
  };
}
function et(e, t, n) {
  const i = t ? wn(t) : void 0, a = Nn(e, i, n), o = a.find((d) => d.active === !0), l = o ? o.objectives.find((d) => d.done !== !0) : void 0;
  return {
    objective_name: l?.name ?? "",
    objective_progress: l?.progress ?? 0,
    objective_target: l?.target ?? 0,
    progress_ratio: i ? tt(a.map((d) => d.progress_ratio)) : 0,
    stage_index: a.filter((d) => d.completed === !0).length,
    stage_name: o?.name ?? "",
    stage_flow: o?.flow ?? "",
    stages: a.map((d) => ({ ...d, objectives: d.objectives.map(({ done: c, ...u }) => u) }))
  };
}
function wn(e) {
  const t = /* @__PURE__ */ new Map(), n = [
    ...X(e.objectives),
    ...X(e.stages).flatMap((i) => X(i.objectives))
  ];
  for (const i of n) {
    const a = L(i.status_key);
    t.set(L(i.key), {
      progress: he(i.progress, 0),
      flag: a === "COMPLETED" || a === "FAILED" ? a : "",
      row: i
    });
  }
  return t;
}
function Nn(e, t, n) {
  const i = e.stages.map((o, l) => {
    const d = o.objectives.map((c) => _n(c, t?.get(c.key), n));
    return {
      key: o.key,
      name: o.title,
      flow: An(o),
      index: l,
      // `QuestStage.isCompleted`: all objectives done, so an empty stage is.
      completed: t !== void 0 && d.every((c) => c.done),
      active: !1,
      progress_ratio: t ? tt(d.map((c) => c.progress_ratio)) : 0,
      objectives: d
    };
  });
  if (!t) return i;
  const a = i.find((o) => o.completed !== !0);
  if (a) {
    a.active = !0;
    const o = a.objectives, l = o.find((d) => d.done !== !0);
    for (const d of o)
      d.status_key === "PENDING" && (a.flow !== "SEQUENTIAL" || d === l) && (d.status_key = "IN_PROGRESS");
  }
  return i;
}
function _n(e, t, n) {
  const i = En(e), a = t?.progress ?? 0, o = t?.row, l = o && o.type === e.type && o.target === i;
  return {
    key: e.key,
    name: l && typeof o.name == "string" ? o.name : Cn(e, n),
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
function jn(e, t, n) {
  const i = et(e, t, n), a = i.stages;
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
function Cn(e, t) {
  const i = (Re[t.slice(0, 2)] ?? Re.en)[e.type];
  if (!i) return e.type;
  const a = e.params, o = {
    amount: String(a.amount ?? ""),
    distance: String(a.distance ?? ""),
    command: L(a.command),
    value: L(a.value),
    // Bukkit's translation keys, as the objective configs write them (`<lang:…>`).
    crop: Z("block", a.crop),
    entity_type: Z("entity", a.entity_type),
    material: e.type === "block_break" ? Z("block", a.material) : Ie(e),
    fish_type: Ie(e)
  };
  return i.replace(/%([a-z_]+)%/g, (l, d) => o[d] ?? "");
}
function Z(e, t) {
  const n = L(t).toLowerCase().replace(/^minecraft:/, "");
  return n === "" ? "" : `<lang:${e}.minecraft.${n}>`;
}
function Ie(e) {
  const t = U(e.type)?.params.find((o) => o.kind === "item");
  if (!t) return "";
  const n = ke(e.params, t), i = n.title;
  if (typeof i == "string" && i.trim() !== "") return i;
  const a = L(n.material);
  return /^(minecraft:)?[a-z_0-9]+$/i.test(a) && !a.includes(":") ? Z("item", a) : a || Ue(n);
}
function En(e) {
  const t = oe(e.params);
  if (t === void 0) return 1;
  const n = Number(t);
  return Number.isFinite(n) ? n : 1;
}
function An(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function Tn(e) {
  const t = e.trim().toLowerCase().replace(/ /g, "");
  if (t === "") return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const n = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!n) return 0;
  const [, i, a, o, l] = n;
  return Number(i ?? 0) * 86400 + Number(a ?? 0) * 3600 + Number(o ?? 0) * 60 + Number(l ?? 0);
}
function fe(e, t) {
  return new Map((e ?? []).map((n) => [L(n[t]), n]));
}
function X(e) {
  return Array.isArray(e) ? e.filter((t) => t && typeof t == "object") : [];
}
function tt(e) {
  return e.length === 0 ? 0 : e.reduce((t, n) => t + n, 0) / e.length;
}
function he(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function L(e) {
  return typeof e == "string" ? e : "";
}
const $n = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: ht,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  documents: [vn],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: kn
}, Ln = { ...$n, sdk: "1.20.0" };
export {
  Ln as default
};
