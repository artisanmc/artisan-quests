import { createModuleI18n as Ye, fieldText as Xe, newTextKey as G, textValue as S, injectModuleStyles as et, useProject as tt, useContentLang as nt, MiniMessageInput as X, SortableList as fe, Button as Q, ConditionsEditor as it, updateDocument as at, selectDocumentItem as rt, useUiLang as Oe, ActionChainEditor as ot, ItemInput as st, MaterialInput as lt, textValues as ct, SDK_VERSION as dt } from "@artisan/editor-sdk";
import { jsx as r, jsxs as m, Fragment as K } from "react/jsx-runtime";
import { useState as R, useEffect as ye, useRef as ut } from "react";
const Re = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
}, pt = /^\d+$/;
function se(e, t, n) {
  const i = String(n).padStart(2, "0");
  return e === "fr" ? n === 0 ? `${t} h` : `${t} h ${i}` : `${String(t).padStart(2, "0")}:${i}`;
}
function O(e, t, n) {
  return pt.test(e) && Number(e) >= t && Number(e) <= n;
}
function le(e) {
  return e.trim().split(/\s+/).length === 5;
}
function mt(e, t) {
  const n = t === "fr", i = e.trim().split(/\s+/);
  if (i.length !== 5) return null;
  const [a, o, l, c, d] = i;
  if (c !== "*") return null;
  const u = /^\*\/(\d+)$/;
  if (l === "*" && d === "*") {
    if (O(a, 0, 59) && O(o, 0, 23))
      return n ? `tous les jours à ${se(t, +o, +a)}` : `every day at ${se(t, +o, +a)}`;
    const s = u.exec(o);
    if (O(a, 0, 59) && s)
      return n ? `toutes les ${s[1]} h, à la minute ${a}` : `every ${s[1]} hours, at minute ${a}`;
    if (O(a, 0, 59) && o === "*")
      return n ? `toutes les heures, à la minute ${a}` : `every hour, at minute ${a}`;
    const v = u.exec(a);
    return v && o === "*" ? n ? `toutes les ${v[1]} minutes` : `every ${v[1]} minutes` : null;
  }
  if (!O(a, 0, 59) || !O(o, 0, 23)) return null;
  const f = se(t, +o, +a);
  if (l === "*" && O(d, 0, 7)) {
    const s = Re[n ? "fr" : "en"][Number(d) % 7];
    return n ? `chaque ${s} à ${f}` : `every ${s} at ${f}`;
  }
  return d === "*" && O(l, 1, 31) ? n ? `le ${l === "1" ? "1er" : l} de chaque mois à ${f}` : `on day ${l} of each month at ${f}` : null;
}
function B(e, t, n) {
  const i = /* @__PURE__ */ new Set();
  for (const a of e.split(",")) {
    const o = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(a);
    if (!o) return null;
    const l = o[4] ? Number(o[4]) : 1, c = o[1] === "*" ? t : Number(o[2]), d = o[1] === "*" ? n : o[3] ? Number(o[3]) : o[4] ? n : c;
    if (l < 1 || c < t || d > n || c > d) return null;
    for (let u = c; u <= d; u += l) i.add(u);
  }
  return i;
}
function ht(e, t) {
  const n = e.trim().split(/\s+/);
  if (n.length !== 5) return null;
  const i = B(n[0], 0, 59), a = B(n[1], 0, 23), o = B(n[2], 1, 31), l = B(n[3], 1, 12), c = B(n[4], 0, 7);
  if (!i || !a || !o || !l || !c) return null;
  c.has(7) && c.add(0);
  const d = n[2] === "*", u = n[4] === "*", f = (q) => d && u ? !0 : d ? c.has(q.getDay()) : u ? o.has(q.getDate()) : o.has(q.getDate()) || c.has(q.getDay()), s = new Date(t.getTime());
  s.setSeconds(0, 0), s.setMinutes(s.getMinutes() + 1);
  const v = t.getTime() + 366 * 24 * 3600 * 1e3;
  for (; s.getTime() <= v; ) {
    if (!l.has(s.getMonth() + 1) || !f(s)) {
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
function ft(e) {
  const t = e.trim().split(/\s+/);
  if (e.trim() === "") return { kind: "never" };
  if (t.length !== 5) return { kind: "custom" };
  const [n, i, a, o, l] = t;
  if (o !== "*" || !O(n, 0, 59) || !O(i, 0, 23)) return { kind: "custom" };
  const c = `${i.padStart(2, "0")}:${n.padStart(2, "0")}`;
  return a === "*" && l === "*" ? { kind: "daily", time: c } : a === "*" && O(l, 0, 7) ? { kind: "weekly", time: c, day: Number(l) % 7 } : l === "*" && O(a, 1, 31) ? { kind: "monthly", time: c, day: Number(a) } : { kind: "custom" };
}
function yt(e) {
  if (e.kind === "never") return "";
  if (e.kind === "custom") return null;
  const t = /^(\d{1,2}):(\d{2})$/.exec(e.time), n = t ? Math.min(23, Number(t[1])) : 4, i = t ? Math.min(59, Number(t[2])) : 0;
  return e.kind === "daily" ? `${i} ${n} * * *` : e.kind === "weekly" ? `${i} ${n} * * ${e.day}` : `${i} ${n} ${Math.min(31, Math.max(1, e.day))} * *`;
}
function gt(e) {
  return Re[e === "fr" ? "fr" : "en"];
}
const F = {
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
  givenBy: "Given by {{npc}}"
}, ie = {
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
  givenBy: "Donnée par {{npc}}"
}, _e = { en: F.kindLabel, fr: ie.kindLabel }, vt = { en: F.collection, fr: ie.collection }, bt = Ye({ en: F, fr: ie });
function Le(e) {
  const t = e === "fr" ? ie : F;
  return (n, i) => {
    const a = t[n] ?? F[n] ?? n;
    return i ? a.replace(/\{\{(\w+)\}\}/g, (o, l) => String(i[l] ?? o)) : a;
  };
}
const ge = "quest_group", Ie = "quest_groups", qt = "quests", ve = "quest_group/v1", ue = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function V(e = Date.now()) {
  let t = "", n = e;
  for (let o = 0; o < 10; o++)
    t = ue[n % 32] + t, n = Math.floor(n / 32);
  const i = new Uint8Array(16);
  crypto.getRandomValues(i);
  let a = "";
  for (let o = 0; o < 16; o++) a += ue[i[o] % 32];
  return t + a;
}
function W(e, t) {
  const n = new Set(t);
  if (!n.has(e)) return e;
  for (let i = 2; ; i++) if (!n.has(`${e}_${i}`)) return `${e}_${i}`;
}
function kt(e, t) {
  const n = new Set(t), i = new Uint8Array(4);
  for (; ; ) {
    crypto.getRandomValues(i);
    const a = Array.from(i, (l) => ue[l % 32].toLowerCase()).join(""), o = `${ae(e)}_${a}`;
    if (!n.has(o)) return o;
  }
}
function De(e) {
  return e.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
function ae(e) {
  return e.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "quest";
}
function A(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? { ...e } : {};
}
function ce(e) {
  return Array.isArray(e) ? e : [];
}
function $(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? String(e) : "";
}
function z(e, ...t) {
  const n = { ...e };
  for (const i of t) delete n[i];
  return n;
}
function xt(e, t) {
  const n = {}, i = [];
  function a(d) {
    if (d && typeof d == "object" && !Array.isArray(d)) {
      const s = G(), v = {};
      for (const [q, g] of Object.entries(d)) v[q] = $(g);
      return n[s] = v, { key: s };
    }
    const u = typeof d == "string" ? /^\{i18n:(.+)\}$/.exec(d) : null;
    if (u) {
      const s = t.translations?.[u[1]];
      return s && (n[u[1]] = { ...s }), { key: u[1] };
    }
    const f = G();
    return n[f] = d == null || d === "" ? {} : { [t.lang]: $(d) }, { key: f };
  }
  const o = Object.entries(A(e.tiers)).map(([d, u]) => {
    const f = A(u);
    return { key: d, title: a(f.title), rest: z(f, "title") };
  }), l = ce(e.quests).map((d, u) => {
    const f = A(d), s = ce(f.stages).map((v, q) => {
      const g = A(v), h = $(g.flow).toLowerCase();
      return {
        key: $(g.key) || `stage_${q + 1}`,
        title: a(g.title),
        flow: h === "parallel" || h === "sequential" ? h : "",
        objectives: ce(g.objectives).map((k, y) => {
          const x = A(k);
          return {
            key: $(x.key) || `objective_${y + 1}`,
            type: $(x.type),
            params: z(x, "key", "type")
          };
        }),
        rest: z(g, "key", "title", "flow", "objectives")
      };
    });
    return {
      key: $(f.key) || `quest_${u + 1}`,
      uid: $(f.uid) || V(),
      tier: $(f.tier),
      title: a(f.title),
      description: a(f.description),
      duration: $(f.duration),
      stages: s,
      rest: wt(f)
    };
  }), c = {
    id: $(e.id),
    projectId: t.projectId,
    uid: $(e.uid) || V(),
    title: a(e.title),
    description: a(e.description),
    actorType: $(e.actor_type) || "player",
    reset: A(e.reset),
    limits: A(e.limits),
    rotation: A(e.rotation),
    distribution: A(e.distribution),
    tiers: o,
    quests: l,
    rest: Me(z(
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
  return e.schema !== void 0 && e.schema !== ve && i.push(`schema: ${String(e.schema)}`), { doc: c, i18nKeys: n, unsupported: i };
}
function Me(e) {
  return e.on !== void 0 && (e.actions == null && (e.actions = e.on), delete e.on), e;
}
function wt(e) {
  const t = Me(
    z(e, "key", "uid", "tier", "title", "description", "duration", "stages", "reward_display")
  );
  if (t.rewards !== void 0) {
    const n = A(t.actions);
    n.complete == null && (t.actions = { ...n, complete: t.rewards }), delete t.rewards;
  }
  return t;
}
function Nt(e) {
  return typeof e == "string" ? e === "" : Object.values(e).every((t) => t === "");
}
function M(e) {
  const t = {};
  for (const [n, i] of Object.entries(e))
    i == null || i === "" || Array.isArray(i) && i.length === 0 || typeof i == "object" && !Array.isArray(i) && Object.keys(i).length === 0 || (t[n] = i);
  return t;
}
const _t = [
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
function jt(e, t) {
  const n = (u) => Xe(t, u.key), i = (u) => {
    const f = n(u);
    return Nt(f) ? void 0 : f;
  }, a = {};
  for (const u of e.tiers) a[u.key] = { ...u.rest, title: n(u.title) };
  const o = e.quests.map(
    (u) => M({
      key: u.key,
      uid: u.uid,
      tier: u.tier,
      title: n(u.title),
      description: i(u.description),
      duration: u.duration,
      ...u.rest,
      stages: u.stages.map(
        (f) => M({
          key: f.key,
          title: i(f.title),
          flow: f.flow,
          ...f.rest,
          objectives: f.objectives.map((s) => ({ key: s.key, type: s.type, ...s.params }))
        })
      )
    })
  ), l = {
    ...e.rest,
    id: e.id,
    schema: ve,
    uid: e.uid,
    title: n(e.title),
    description: i(e.description),
    actor_type: e.actorType,
    reset: M(e.reset),
    limits: M(e.limits),
    rotation: M(e.rotation),
    distribution: M(e.distribution),
    tiers: a,
    quests: o
  }, c = {};
  for (const u of _t) u in l && (c[u] = l[u]);
  for (const u of Object.keys(l)) u in c || (c[u] = l[u]);
  const d = M(c);
  return d.quests = o, d;
}
function* Ct(e) {
  const t = `${Ie}.${e.id}`;
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
    for (let d = 0; d < a.stages.length; d++) {
      const u = a.stages[d], f = c.has(u.key) ? `${u.key}_${d}` : u.key;
      c.add(u.key), yield {
        lText: u.title,
        key: `${l}.stages.${f}.title`,
        path: `quests[${i}].stages[${d}].title`,
        kind: "quest.stage"
      };
    }
  }
}
function je(e) {
  return !!e && typeof e == "object" && !Array.isArray(e) && "type" in e;
}
function Et(e) {
  const t = Array.isArray(e) ? e : e == null ? [] : [e];
  return {
    chain: t.filter((n) => !je(n)),
    legacy: t.filter(je)
  };
}
function Ce(e, t) {
  const n = [...e, ...t];
  return n.length ? n : void 0;
}
function At(e) {
  const t = String(e.type), n = e.command ?? e.message ?? e.title ?? e.material;
  return typeof n == "string" ? `${t} · ${n}` : t;
}
const Tt = [
  "distribution",
  "actor_load",
  "quest_start",
  "objective_progress",
  "objective_complete",
  "quest_complete",
  "period_complete"
], St = ["start", "objective_progress", "objective_complete", "complete"], P = { name: "amount", kind: "int", required: !0 }, be = [
  { type: "block_break", icon: "⛏", params: [{ name: "material", kind: "material" }, P] },
  {
    type: "craft_item",
    icon: "⚒",
    params: [{ name: "item", kind: "item", legacy: "material" }, P]
  },
  {
    type: "harvest_crop",
    icon: "🌾",
    params: [{ name: "crop", kind: "material", required: !0 }, P]
  },
  {
    type: "fishing",
    icon: "🎣",
    params: [{ name: "item", kind: "item", legacy: "fish_type" }, P]
  },
  {
    type: "deliver_item",
    icon: "📦",
    params: [
      { name: "item", kind: "item", legacy: "material" },
      P,
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
  { type: "kill_entity", icon: "⚔", params: [{ name: "entity_type", kind: "entity" }, P] },
  { type: "breed_animal", icon: "♥", params: [{ name: "entity_type", kind: "entity" }, P] },
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
  return be.find((t) => t.type === e);
}
function Pe(e) {
  const t = {};
  for (const n of U(e)?.params ?? [])
    n.kind === "int" && (t[n.name] = 1);
  return t;
}
function re(e) {
  return e.amount ?? e.distance;
}
function qe(e, t) {
  const n = e[t.name];
  if (n && typeof n == "object" && !Array.isArray(n)) return n;
  const i = t.legacy ? e[t.legacy] : void 0;
  return typeof i == "string" && i !== "" ? { material: i } : {};
}
function $t(e, t, n, i) {
  t.legacy && delete e[t.legacy];
  const a = !n || Object.keys(n).length === 0;
  a ? delete e[t.name] : e[t.name] = n, a || i === void 0 ? delete e.match : e.match = i;
}
function He(e) {
  const t = e.title;
  if (typeof t == "string" && t.trim() !== "") return t.replace(/<[^>]*>/g, "");
  const n = e.material ?? e.item;
  return typeof n == "string" ? n : "";
}
function ke(e, t) {
  const n = U(e);
  return n ? n.params.filter((i) => i.kind !== "int").map((i) => i.kind === "item" ? He(qe(t, i)) : t[i.name]).filter((i) => typeof i == "string" && i !== "").join(" = ") : Object.keys(t).map((i) => t[i]).filter((i) => typeof i == "string" && i !== "").join(" = ");
}
function Ke(e, t) {
  return (U(e)?.params ?? []).filter((n) => n.required && (t[n.name] === void 0 || t[n.name] === "")).map((n) => n.name);
}
const Ot = [
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
], Rt = "#f59e0b";
function ee(e, t) {
  return U(t) ? e(`objective.${t}`) : t;
}
function te(e, t) {
  const n = ke(t.type, t.params), i = re(t.params);
  return `${ee(e, t.type)}${n ? ` · ${n}` : ""}${i !== void 0 ? ` · 0/${String(i)}` : ""}`;
}
function L(e) {
  return e.replace(/<[^<>]*>/g, "").trim();
}
function xe(e) {
  const t = e.distribution?.strategy;
  return typeof t == "string" && ["sequential", "ladder"].includes(t.toLowerCase());
}
function Lt(e, t, n) {
  const i = Le(n), a = xe(e);
  return e.quests.map((o, l) => {
    const c = S(t, o.title.key, n);
    return {
      id: o.uid,
      label: L(c) || o.key,
      detail: o.tier || void 0,
      caption: It(i, o),
      marker: a ? String(l + 1) : void 0,
      hover: {
        title: c || o.key,
        text: S(t, o.description.key, n) || void 0,
        lines: Dt(i, o, t, n)
      }
    };
  });
}
function It(e, t) {
  const n = t.stages.flatMap((o) => o.objectives), i = n[0];
  if (!i) return;
  const a = n.length - 1;
  return a > 0 ? `${te(e, i)} +${String(a)}` : te(e, i);
}
function Dt(e, t, n, i) {
  const a = t.stages.length > 1;
  return t.stages.flatMap(
    (o, l) => o.objectives.map((c) => {
      const d = te(e, c);
      return a ? `<gray>${L(S(n, o.title.key, i)) || e("stage", { n: l + 1 })} ·</gray> ${d}` : d;
    })
  );
}
function Mt(e, t) {
  const n = Le(t), i = typeof e.distribution?.strategy == "string" ? e.distribution.strategy.toLowerCase() : "", a = e.quests.length, o = a === 1 ? n("questCountOne") : n("questCount", { count: a }), l = i === "sequential" || i === "ladder" ? "ordered" : i;
  return ["none", "ordered", "random"].includes(l) ? `${o} · ${n(`strategy.${l}`).toLowerCase()}` : o;
}
function Pt(e, t) {
  const n = re(t.params), i = ke(t.type, t.params), a = n !== void 0 ? String(n) : "", o = a && i ? `${a} × ${i}` : a || i;
  return o ? `${ee(e, t.type)} · ${o}` : ee(e, t.type);
}
function Ge(e) {
  return e.stages.flatMap((t) => t.objectives);
}
function Ht(e) {
  const t = Ge(e), n = t.map((i) => i.key);
  return t.some(
    (i) => Ke(i.type, i.params).length > 0 || n.indexOf(i.key) !== n.lastIndexOf(i.key)
  );
}
function Kt(e) {
  return Object.values(A(e.rest.actions)).reduce(
    (t, n) => t + (Array.isArray(n) ? n.length : n == null ? 0 : 1),
    0
  );
}
function Qe(e) {
  const t = e.completed_when;
  return Array.isArray(t) ? t : t ? [t] : [];
}
function Gt(e) {
  return e.every((t) => typeof t == "string") ? e.join(" · ") : null;
}
function Qt(e, t, n) {
  const i = structuredClone(e);
  i.uid = V(), i.key = W(`${e.key}_copy`, t), i.title = n(e.title), i.description = n(e.description);
  for (const [a, o] of i.stages.entries()) o.title = n(e.stages[a].title);
  return i;
}
const Ut = `
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
.aq-quest-head { display: flex; flex-direction: column; gap: 2px; padding: 12px 16px 4px; }
.aq .aq-quest-name .input { height: 38px; font-family: var(--font-display); font-size: 18px; font-weight: 700; }
.aq .aq-quest-name .input, .aq .aq-quest-desc .input, .aq .aq-quest-desc .textarea, .aq .aq-stage-title .input { padding-inline: 8px; margin-inline: -8px; width: calc(100% + 16px); background: transparent; border-color: transparent; }
.aq .aq-quest-name .input:hover, .aq .aq-quest-name .input:focus, .aq .aq-quest-desc .input:hover, .aq .aq-quest-desc .input:focus, .aq .aq-quest-desc .textarea:hover, .aq .aq-quest-desc .textarea:focus, .aq .aq-stage-title .input:hover, .aq .aq-stage-title .input:focus { border-color: var(--border-strong); background: var(--surface-inset); }
.aq .aq-quest-desc .input, .aq .aq-quest-desc .textarea { color: var(--text-mut); min-height: 0; }
.aq-quest-page .aq-fold-head.is-inner { margin: 0 16px; border-top: 1px solid var(--border-soft); }
.aq-quest-page .aq-card > .aq-fold-body { padding: 0 16px 14px; }

.aq-stages { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
.aq-stage { gap: 8px; padding: 12px 14px; }
.aq-stage-head { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.aq .aq-stage-title { flex: 1 1 180px; min-width: 0; font-weight: 600; }
.aq .aq-stage-title .input { height: 32px; margin-inline: 0; width: 100%; }
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

.aq-preview { padding: 12px 14px; border-radius: var(--r-sm); background: var(--surface-inset); border: 1px solid var(--border-soft); font-family: var(--font-mono); font-size: 12px; line-height: 1.6; display: flex; flex-direction: column; gap: 2px; overflow-wrap: anywhere; }
.aq-preview-title { color: var(--text); font-weight: 600; }
.aq-preview-head { color: var(--text); }
.aq-preview-line { color: var(--text-mut); }
.aq-preview-stage { display: flex; flex-direction: column; gap: 2px; padding-top: 8px; }
`, Bt = /^(\d+|(\d+[dhms])+)$/, zt = ["actor_load", "period_reset", "quest_complete"], Ft = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
function Vt(e, t) {
  const n = ht(e, /* @__PURE__ */ new Date());
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
function Wt({ projectId: e, documentId: t, document: n, item: i }) {
  et("msquests", Ut);
  const a = n, o = tt(e), l = nt(), c = bt(), [d, u] = R(i ?? null);
  ye(() => {
    u(i ?? null);
  }, [i]);
  const f = (g) => {
    u(g), rt({ documentId: t, item: g });
  }, v = { projectId: e, project: o, lang: l, t: c, edit: (g, h) => {
    const k = structuredClone(a);
    g(k), at({ projectId: e, kind: ge, id: t, doc: k, texts: h });
  } }, q = d ? a.quests.findIndex((g) => g.uid === d) : -1;
  return /* @__PURE__ */ r("div", { className: "aq", children: q >= 0 ? /* @__PURE__ */ r(on, { ctx: v, group: a, index: q, onLeave: () => f(null) }, d) : /* @__PURE__ */ r(en, { ctx: v, group: a, onOpen: f }) });
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
function Jt() {
  return /* @__PURE__ */ m("svg", { "aria-hidden": "true", width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: [
    /* @__PURE__ */ r("circle", { cx: "3", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "8", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "13", cy: "8", r: "1.5" })
  ] });
}
function C({ tone: e, children: t }) {
  return /* @__PURE__ */ r("span", { className: `aq-chip${e ? ` is-${e}` : ""}`, children: t });
}
function ne({
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
    /* @__PURE__ */ m("label", { className: "aq-field", title: i, children: [
      /* @__PURE__ */ r("span", { className: "field-label", children: e }),
      t,
      n
    ] })
  );
}
function de({
  ctx: e,
  label: t,
  node: n,
  multiline: i
}) {
  const a = S(e.project, n.key, e.lang), o = (l) => e.edit(() => {
  }, [{ key: n.key, lang: e.lang, value: l }]);
  return /* @__PURE__ */ r(T, { label: `${t} · ${e.lang}`, children: /* @__PURE__ */ r(X, { value: a, onChange: o, multiline: i, "aria-label": t }) });
}
function Zt(e) {
  return typeof e == "number" ? String(e) : typeof e == "string" ? e : "";
}
function H({
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
      value: Zt(t),
      placeholder: i,
      onChange: (a) => {
        const o = a.target.value.trim();
        n(o === "" ? void 0 : Math.max(0, Math.trunc(Number(o))));
      }
    }
  ) });
}
function Yt(e) {
  const t = Ue(e);
  return t !== "" && t !== "none";
}
function Ue(e) {
  return typeof e.strategy == "string" ? e.strategy.toLowerCase() : "";
}
function j(e, t, n) {
  n === void 0 || n === "" ? delete e[t] : e[t] = n;
}
function we(e, t, n) {
  if (n < 0 || n >= e.length) return;
  const [i] = e.splice(t, 1);
  e.splice(n, 0, i);
}
function oe({
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
function Ne({
  t: e,
  label: t,
  sure: n,
  onRemove: i
}) {
  const [a, o] = R(!1);
  return a ? /* @__PURE__ */ m("span", { className: "aq-confirm", children: [
    /* @__PURE__ */ r(Q, { size: "sm", variant: "ghost", onClick: () => o(!1), children: e("cancel") }),
    /* @__PURE__ */ r("button", { type: "button", className: "aq-danger", onClick: i, children: e("remove") })
  ] }) : /* @__PURE__ */ r(oe, { label: t, onClick: () => n ? i() : o(!0), children: "×" });
}
function Xt({
  label: e,
  children: t
}) {
  const [n, i] = R(!1), a = ut(null);
  return ye(() => {
    if (!n) return;
    const o = (c) => {
      a.current?.contains(c.target) || i(!1);
    }, l = (c) => {
      c.key === "Escape" && (c.preventDefault(), i(!1));
    };
    return window.addEventListener("mousedown", o), window.addEventListener("keydown", l, !0), () => {
      window.removeEventListener("mousedown", o), window.removeEventListener("keydown", l, !0);
    };
  }, [n]), /* @__PURE__ */ m("div", { className: "aq-menu-anchor", ref: a, children: [
    /* @__PURE__ */ r(oe, { label: e, expanded: n, onClick: () => i(!n), children: /* @__PURE__ */ r(Jt, {}) }),
    n && /* @__PURE__ */ r("div", { className: "aq-menu", role: "menu", children: t(() => i(!1)) })
  ] });
}
function Be(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n, i) => {
    const a = t.has(n) ? `${n}#${i}` : n;
    return t.add(n), a;
  });
}
function en({
  ctx: e,
  group: t,
  onOpen: n
}) {
  const { t: i, edit: a, project: o, lang: l } = e, [c, d] = R(t.quests.length === 0), [u, f] = R(null), s = xe(t), v = Object.keys(t.rest).filter((h) => h !== "actions"), q = () => {
    const h = G(), k = V();
    a(
      (y) => {
        y.quests.push({
          key: W(
            "quest",
            y.quests.map((x) => x.key)
          ),
          uid: k,
          tier: "",
          title: { key: h },
          description: { key: G() },
          duration: "",
          stages: [Ve(1)],
          rest: {}
        });
      },
      [{ key: h, lang: l, value: i("newQuestTitle") }]
    ), n(k);
  }, g = (h) => {
    const k = [], y = (x) => {
      const w = G();
      for (const [N, E] of Object.entries(ct(o, x.key)))
        E !== "" && k.push({ key: w, lang: N, value: E });
      return { key: w };
    };
    a((x) => {
      x.quests.splice(
        h + 1,
        0,
        Qt(
          x.quests[h],
          x.quests.map((w) => w.key),
          y
        )
      );
    }, k);
  };
  return /* @__PURE__ */ m(K, { children: [
    /* @__PURE__ */ m("section", { className: "aq-card", children: [
      /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "aq-fold-head",
          "aria-expanded": c,
          onClick: () => d(!c),
          children: [
            /* @__PURE__ */ r(J, { open: c }),
            /* @__PURE__ */ r("span", { className: "aq-h", children: i("groupSettings") }),
            !c && /* @__PURE__ */ r(tn, { ctx: e, group: t })
          ]
        }
      ),
      c && /* @__PURE__ */ r(nn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ m("section", { className: "aq-card", children: [
      /* @__PURE__ */ m("div", { className: "aq-card-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: i("quests") }),
        /* @__PURE__ */ r("span", { className: "aq-count", children: t.quests.length }),
        /* @__PURE__ */ r("span", { className: "aq-grow" }),
        /* @__PURE__ */ m(Q, { size: "sm", variant: "primary", onClick: q, children: [
          "+ ",
          i("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: i("noQuests") }),
      /* @__PURE__ */ r(
        fe,
        {
          ids: t.quests.map((h) => h.uid),
          onMove: (h, k) => a((y) => we(y.quests, h, k)),
          className: "aq-quests",
          itemClassName: "aq-quest",
          children: (h, k) => {
            const y = t.quests[h], x = L(S(o, y.title.key, l)) || y.key, w = Ge(y), N = Qe(y.rest), E = t.tiers.find((b) => b.key === y.tier), p = Kt(y);
            return /* @__PURE__ */ m(K, { children: [
              k,
              s && /* @__PURE__ */ r("span", { className: "aq-n", children: h + 1 }),
              /* @__PURE__ */ m("button", { type: "button", className: "aq-quest-main", onClick: () => n(y.uid), children: [
                /* @__PURE__ */ r("span", { className: "aq-quest-title", children: x }),
                /* @__PURE__ */ r("span", { className: "aq-quest-sub", children: w.length === 0 ? i("noObjectivesShort") : w.map((b) => Pt(i, b)).join("  ·  ") })
              ] }),
              u === y.uid ? /* @__PURE__ */ m("span", { className: "aq-confirm", children: [
                /* @__PURE__ */ r("span", { children: i("removeConfirm", { name: x }) }),
                /* @__PURE__ */ r(Q, { size: "sm", variant: "ghost", onClick: () => f(null), children: i("cancel") }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "aq-danger",
                    onClick: () => {
                      f(null), a((b) => {
                        b.quests.splice(h, 1);
                      });
                    },
                    children: i("remove")
                  }
                )
              ] }) : /* @__PURE__ */ m(K, { children: [
                /* @__PURE__ */ m("span", { className: "aq-chips", children: [
                  Ht(y) && /* @__PURE__ */ r(C, { tone: "warn", children: i("toComplete") }),
                  s && N.length > 0 && /* @__PURE__ */ m(C, { tone: "ok", children: [
                    i("completedWhen"),
                    " ",
                    /* @__PURE__ */ r("span", { className: "aq-mono", children: Gt(N) ?? String(N.length) })
                  ] }),
                  y.tier && /* @__PURE__ */ r(C, { children: E && L(S(o, E.title.key, l)) || y.tier }),
                  y.duration && /* @__PURE__ */ r(C, { children: y.duration }),
                  p > 0 && /* @__PURE__ */ r(C, { children: p === 1 ? i("actionCountOne") : i("actionCount", { count: p }) })
                ] }),
                /* @__PURE__ */ r(Xt, { label: i("moreActions"), children: (b) => /* @__PURE__ */ m(K, { children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      onClick: () => {
                        b(), g(h);
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
                        b(), f(y.uid);
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
function ze(e, t) {
  return t === "player" || t === "global" ? e(`actor.${t}`) : t;
}
function pe(e) {
  const t = Ue(e);
  return t === "sequential" || t === "ladder" ? "ordered" : t === "none" || t === "random" ? t : "";
}
function tn({ ctx: e, group: t }) {
  const { t: n } = e, i = Oe(), a = typeof t.reset.cron == "string" ? t.reset.cron : "", o = pe(t.distribution), l = Object.keys(A(t.rest.actions)).length, c = a ? mt(a, i) ?? a : n("noReset");
  return /* @__PURE__ */ m("span", { className: "aq-chips", children: [
    /* @__PURE__ */ r(C, { children: ze(n, t.actorType) }),
    o && /* @__PURE__ */ r(C, { children: n(`strategy.${o}`) }),
    /* @__PURE__ */ r(C, { children: c.charAt(0).toUpperCase() + c.slice(1) }),
    t.tiers.length > 0 && /* @__PURE__ */ r(C, { children: n("tierCount", { count: t.tiers.length }) }),
    l > 0 && /* @__PURE__ */ r(C, { children: n("eventCount", { count: l }) })
  ] });
}
function nn({ ctx: e, group: t }) {
  const { t: n, edit: i, project: a, lang: o } = e, l = pe(t.distribution), c = l === "ordered", d = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], u = t.distribution.tiers ?? {}, f = ["player", "global"].includes(t.actorType) ? ["player", "global"] : ["player", "global", t.actorType];
  return /* @__PURE__ */ m("div", { className: "aq-settings", children: [
    /* @__PURE__ */ m("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("identity") }),
      /* @__PURE__ */ r(de, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ r(de, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ m("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("actorType") }),
        /* @__PURE__ */ r(
          ne,
          {
            label: n("actorType"),
            value: t.actorType,
            options: f.map((s) => ({ value: s, label: ze(n, s) })),
            onChange: (s) => i((v) => {
              v.actorType = s;
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
          ne,
          {
            label: n("strategy"),
            value: l,
            options: ["none", "ordered", "random"].map((s) => ({
              value: s,
              label: n(`strategy.${s}`)
            })),
            onChange: (s) => i((v) => {
              s === "ordered" && pe(v.distribution) === "ordered" || (v.distribution.strategy = s === "ordered" ? "sequential" : s);
            })
          }
        )
      ] }),
      !c && /* @__PURE__ */ m(K, { children: [
        /* @__PURE__ */ m("div", { className: "aq-row", children: [
          /* @__PURE__ */ r(
            H,
            {
              label: n("amount"),
              value: t.distribution.amount,
              onChange: (s) => i((v) => j(v.distribution, "amount", s))
            }
          ),
          /* @__PURE__ */ r(
            H,
            {
              label: n("maxActive"),
              value: t.limits.max_active,
              onChange: (s) => i((v) => j(v.limits, "max_active", s))
            }
          )
        ] }),
        /* @__PURE__ */ m("div", { className: "aq-field", children: [
          /* @__PURE__ */ r("span", { className: "field-label", children: n("triggers") }),
          zt.map((s) => /* @__PURE__ */ m("label", { className: "aq-check", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: d.includes(s),
                onChange: (v) => i((q) => {
                  const g = Array.isArray(q.distribution.triggers) ? q.distribution.triggers : [], h = v.target.checked ? [...g, s] : g.filter((k) => k !== s);
                  j(q.distribution, "triggers", h.length ? h : void 0);
                })
              }
            ),
            n(`trigger.${s}`)
          ] }, s))
        ] })
      ] }),
      /* @__PURE__ */ r(
        H,
        {
          label: n("questsPerPeriod"),
          placeholder: n("noLimit"),
          value: t.limits.max_per_period,
          onChange: (s) => i((v) => j(v.limits, "max_per_period", s))
        }
      ),
      !c && /* @__PURE__ */ m("div", { className: "aq-row", children: [
        /* @__PURE__ */ m("label", { className: "aq-check", children: [
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
          H,
          {
            label: n("rotationsPerPeriod"),
            placeholder: n("noLimit"),
            value: t.rotation.max_per_period,
            onChange: (s) => i((v) => j(v.rotation, "max_per_period", s))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ m("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("reset") }),
      /* @__PURE__ */ r(an, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ m("div", { className: "aq-block", children: [
      /* @__PURE__ */ m("div", { className: "aq-block-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("tiers") }),
        /* @__PURE__ */ m(
          Q,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => i((s) => {
              s.tiers.push({
                key: W(
                  "tier",
                  s.tiers.map((v) => v.key)
                ),
                title: { key: G() },
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
      t.tiers.map((s, v) => /* @__PURE__ */ m("div", { className: "aq-row", children: [
        /* @__PURE__ */ r(T, { label: n("tierKey"), children: /* @__PURE__ */ r(
          "input",
          {
            className: "input aq-mono",
            defaultValue: s.key,
            onBlur: (q) => {
              const g = ae(q.target.value);
              g !== s.key && i((h) => {
                const k = W(
                  g,
                  h.tiers.map((x) => x.key)
                );
                h.tiers[v].key = k;
                for (const x of h.quests) x.tier === s.key && (x.tier = k);
                const y = h.distribution.tiers;
                y && s.key in y && (y[k] = y[s.key], delete y[s.key]);
              });
            }
          }
        ) }),
        /* @__PURE__ */ r(de, { ctx: e, label: n("title"), node: s.title }),
        !c && /* @__PURE__ */ r(
          H,
          {
            label: n("perTier"),
            value: u[s.key],
            onChange: (q) => i((g) => {
              const h = { ...g.distribution.tiers ?? {} };
              j(h, s.key, q), j(g.distribution, "tiers", Object.keys(h).length ? h : void 0);
            })
          }
        ),
        /* @__PURE__ */ r(
          Ne,
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
      Fe,
      {
        ctx: e,
        title: n("hooks"),
        hooks: Tt,
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
function an({ ctx: e, group: t }) {
  const { t: n, edit: i } = e, a = Oe(), o = typeof t.reset.cron == "string" ? t.reset.cron : "", l = ft(o), [c, d] = R(!1), u = c && o !== "" ? { kind: "custom" } : l, f = typeof t.reset.timezone == "string" ? t.reset.timezone : "", s = o && le(o) ? Vt(o, a) : null, v = (h) => {
    const k = yt(h);
    k !== null && i((y) => j(y.reset, "cron", k));
  }, q = "time" in u ? u.time : "04:00", g = (h) => {
    d(h === "custom"), h === "never" ? v({ kind: h }) : h === "daily" ? v({ kind: h, time: q }) : h === "weekly" ? v({ kind: h, time: q, day: 1 }) : h === "monthly" ? v({ kind: h, time: q, day: 1 }) : o === "" && i((k) => j(k.reset, "cron", "0 4 * * *"));
  };
  return /* @__PURE__ */ m(K, { children: [
    /* @__PURE__ */ r(
      ne,
      {
        label: n("reset"),
        value: u.kind,
        options: ["never", "daily", "weekly", "monthly", "custom"].map((h) => ({
          value: h,
          label: n(`reset.${h}`)
        })),
        onChange: g
      }
    ),
    u.kind !== "never" && /* @__PURE__ */ m("div", { className: "aq-row aq-reset", children: [
      u.kind === "weekly" && /* @__PURE__ */ r(T, { label: n("resetDay"), children: /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: u.day,
          onChange: (h) => v({ ...u, day: Number(h.target.value) }),
          children: [1, 2, 3, 4, 5, 6, 0].map((h) => /* @__PURE__ */ r("option", { value: h, children: gt(a)[h] }, h))
        }
      ) }),
      u.kind === "monthly" && /* @__PURE__ */ r(
        H,
        {
          label: n("resetDayOfMonth"),
          value: u.day,
          onChange: (h) => v({ ...u, day: h ?? 1 })
        }
      ),
      u.kind === "custom" ? /* @__PURE__ */ r(
        T,
        {
          label: n("cron"),
          hint: le(o) ? void 0 : /* @__PURE__ */ r("span", { className: "aq-err", children: n("cronInvalid") }),
          children: /* @__PURE__ */ r(
            "input",
            {
              className: "input aq-mono",
              value: o,
              placeholder: "0 4 * * *",
              onChange: (h) => i((k) => j(k.reset, "cron", h.target.value))
            }
          )
        }
      ) : /* @__PURE__ */ r(T, { label: n("resetTime"), children: /* @__PURE__ */ r(
        "input",
        {
          className: "input",
          type: "time",
          value: u.time,
          onChange: (h) => h.target.value && v({ ...u, time: h.target.value })
        }
      ) })
    ] }),
    o && le(o) && (f || s) && /* @__PURE__ */ r("span", { className: "aq-ok", children: f && f !== Ft ? f : s ? n("nextRun", { when: s }) : "" })
  ] });
}
function rn({
  ctx: e,
  value: t,
  onChange: n
}) {
  const { chain: i, legacy: a } = Et(t);
  return /* @__PURE__ */ m("div", { className: "aq-chain", children: [
    /* @__PURE__ */ r(
      ot,
      {
        projectId: e.projectId,
        value: i,
        onChange: (o) => n(Ce(o, a))
      }
    ),
    a.length > 0 && /* @__PURE__ */ r("div", { className: "aq-legacy", title: e.t("legacySteps"), children: a.map((o, l) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
      /* @__PURE__ */ m("div", { className: "aq-legacy-row", children: [
        /* @__PURE__ */ r("code", { children: At(o) }),
        /* @__PURE__ */ r(
          oe,
          {
            label: e.t("remove"),
            onClick: () => n(Ce(i, a.filter((c, d) => d !== l))),
            children: "×"
          }
        )
      ] }, l)
    )) })
  ] });
}
function Fe({
  ctx: e,
  title: t,
  hooks: n,
  label: i,
  value: a,
  onChange: o
}) {
  const { t: l } = e, c = A(a), [d, u] = R([]), [f, s] = R(null), v = n.filter((g) => c[g] != null || d.includes(g)), q = n.filter((g) => !v.includes(g));
  return /* @__PURE__ */ m(K, { children: [
    /* @__PURE__ */ m("div", { className: "aq-block-head", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: t }),
      q.length > 0 && /* @__PURE__ */ m(
        "select",
        {
          className: "select aq-event-add",
          "aria-label": l("addEvent"),
          value: "",
          onChange: (g) => {
            const h = q.find((k) => k === g.target.value);
            h && (u((k) => [...k, h]), s(h));
          },
          children: [
            /* @__PURE__ */ m("option", { value: "", children: [
              "+ ",
              l("addEvent")
            ] }),
            q.map((g) => /* @__PURE__ */ r("option", { value: g, children: i(g) }, g))
          ]
        }
      )
    ] }),
    v.map((g) => {
      const h = f === g, k = Array.isArray(c[g]) ? c[g].length : c[g] ? 1 : 0;
      return /* @__PURE__ */ m("div", { className: `aq-line${h ? " is-open" : ""}`, children: [
        /* @__PURE__ */ m("div", { className: "aq-line-head", children: [
          /* @__PURE__ */ m(
            "button",
            {
              type: "button",
              className: "aq-line-main",
              "aria-expanded": h,
              onClick: () => s(h ? null : g),
              children: [
                /* @__PURE__ */ r(J, { open: h }),
                /* @__PURE__ */ r("span", { className: "aq-line-text", children: i(g) }),
                k > 0 && /* @__PURE__ */ r(C, { children: k === 1 ? l("actionCountOne") : l("actionCount", { count: k }) })
              ]
            }
          ),
          /* @__PURE__ */ r(
            Ne,
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
        h && /* @__PURE__ */ r("div", { className: "aq-line-body", children: /* @__PURE__ */ r(rn, { ctx: e, value: c[g], onChange: (y) => o(g, y) }) })
      ] }, g);
    })
  ] });
}
function Ve(e) {
  return {
    key: `stage_${e}`,
    title: { key: G() },
    flow: "parallel",
    objectives: [],
    rest: {}
  };
}
function on({
  ctx: e,
  group: t,
  index: n,
  onLeave: i
}) {
  const { t: a, edit: o, project: l, lang: c } = e, d = t.quests[n], u = (p, b) => o((_) => p(_.quests[n]), b), f = t.quests.some((p, b) => b !== n && p.key === d.key), s = d.duration !== "" && !Bt.test(d.duration.replace(/\s/g, "").toLowerCase()), v = Object.keys(d.rest).filter(
    (p) => p !== "actions" && p !== "giver" && p !== "completed_when"
  ), q = xe(t), g = d.rest.giver && typeof d.rest.giver == "object" ? d.rest.giver : {}, h = (p, b) => u((_) => {
    const D = { ...g };
    j(D, p, b.trim()), typeof D.npc == "string" && D.npc !== "" ? _.rest.giver = D : delete _.rest.giver;
  }), k = typeof g.npc == "string" ? g.npc : "", y = Yt(t.distribution), x = t.tiers.find((p) => p.key === d.tier), [w, N] = R(!1), E = w || f || s;
  return ye(() => {
    const p = (b) => {
      b.key !== "Escape" || b.defaultPrevented || b.target?.closest("input, textarea, select, [contenteditable='true']") || window.document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]') || (b.preventDefault(), i());
    };
    return window.addEventListener("keydown", p, !0), () => window.removeEventListener("keydown", p, !0);
  }, [i]), /* @__PURE__ */ m("div", { className: "aq-quest-page", children: [
    /* @__PURE__ */ m("div", { className: "aq-quest-col", children: [
      /* @__PURE__ */ m("section", { className: "aq-card", children: [
        /* @__PURE__ */ m("div", { className: "aq-quest-head", children: [
          /* @__PURE__ */ r("div", { className: "aq-quest-name", children: /* @__PURE__ */ r(
            X,
            {
              value: S(l, d.title.key, c),
              placeholder: a("title"),
              "aria-label": a("title"),
              onChange: (p) => o(() => {
              }, [{ key: d.title.key, lang: c, value: p }])
            }
          ) }),
          /* @__PURE__ */ r("div", { className: "aq-quest-desc", children: /* @__PURE__ */ r(
            X,
            {
              value: S(l, d.description.key, c),
              placeholder: a("description"),
              "aria-label": a("description"),
              multiline: !0,
              rows: 2,
              onChange: (p) => o(() => {
              }, [{ key: d.description.key, lang: c, value: p }])
            }
          ) })
        ] }),
        /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: "aq-fold-head is-inner",
            "aria-expanded": E,
            onClick: () => N(!E),
            children: [
              /* @__PURE__ */ r(J, { open: E }),
              /* @__PURE__ */ r("span", { className: "aq-fold-title", children: a("questSettings") }),
              !E && /* @__PURE__ */ m("span", { className: "aq-chips", children: [
                d.tier && /* @__PURE__ */ r(C, { children: x && L(S(l, x.title.key, c)) || d.tier }),
                /* @__PURE__ */ r(C, { children: d.duration || a("noTimeLimit") }),
                k && /* @__PURE__ */ r(C, { children: a("givenBy", { npc: k }) }),
                /* @__PURE__ */ r(C, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: d.key }) })
              ] })
            ]
          }
        ),
        E && /* @__PURE__ */ m("div", { className: "aq-fold-body", children: [
          /* @__PURE__ */ m("div", { className: "aq-row aq-top aq-wrap", children: [
            t.tiers.length > 0 || d.tier ? /* @__PURE__ */ r(T, { label: a("tier"), children: /* @__PURE__ */ m(
              "select",
              {
                className: "select",
                value: d.tier,
                onChange: (p) => u((b) => {
                  b.tier = p.target.value;
                }),
                children: [
                  /* @__PURE__ */ r("option", { value: "", children: a("noTier") }),
                  t.tiers.map((p) => /* @__PURE__ */ r("option", { value: p.key, children: L(S(l, p.title.key, c)) || p.key }, p.key)),
                  d.tier && !x && /* @__PURE__ */ r("option", { value: d.tier, children: d.tier })
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
                    value: d.duration,
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
                hint: f ? /* @__PURE__ */ r("span", { className: "aq-err", children: a("keyTaken") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input aq-mono",
                    value: d.key,
                    onChange: (p) => u((b) => {
                      b.key = De(p.target.value);
                    }),
                    onBlur: () => {
                      const p = ae(d.key);
                      p !== d.key && u((b) => {
                        b.key = p;
                      });
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ m("div", { className: "aq-row aq-top aq-wrap", children: [
            /* @__PURE__ */ r(T, { label: a("giverNpc"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: k,
                onChange: (p) => h("npc", p.target.value)
              }
            ) }),
            k && /* @__PURE__ */ r(T, { label: a("giverConversation"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: typeof g.conversation == "string" ? g.conversation : "",
                onChange: (p) => h("conversation", p.target.value)
              }
            ) })
          ] }),
          k && y && /* @__PURE__ */ r("span", { className: "aq-warn", children: a("giverDistributed") })
        ] })
      ] }),
      /* @__PURE__ */ r(
        fe,
        {
          ids: Be(d.stages.map((p) => p.key)),
          onMove: (p, b) => u((_) => we(_.stages, p, b)),
          className: "aq-stages",
          children: (p, b) => /* @__PURE__ */ r(
            sn,
            {
              ctx: e,
              quest: d,
              stage: d.stages[p],
              si: p,
              handle: b,
              editQuest: u
            }
          )
        }
      ),
      /* @__PURE__ */ m(
        Q,
        {
          size: "sm",
          variant: "ghost",
          className: "aq-add",
          onClick: () => u((p) => {
            const b = W(
              `stage_${p.stages.length + 1}`,
              p.stages.map((_) => _.key)
            );
            p.stages.push({ ...Ve(p.stages.length + 1), key: b });
          }),
          children: [
            "+ ",
            a("addStage")
          ]
        }
      ),
      q && /* @__PURE__ */ m("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: a("completedWhen") }),
        /* @__PURE__ */ r(
          it,
          {
            projectId: e.projectId,
            value: Qe(d.rest),
            emptyHint: a("completedWhenEmpty"),
            onChange: (p) => u((b) => j(b.rest, "completed_when", p.length > 0 ? p : void 0))
          },
          d.uid
        )
      ] }),
      /* @__PURE__ */ m("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r(
          Fe,
          {
            ctx: e,
            title: a("questEvents"),
            hooks: St,
            label: (p) => a(`questHook.${p}`),
            value: d.rest.actions,
            onChange: (p, b) => u((_) => {
              const D = { ...A(_.rest.actions) };
              j(D, p, b), j(_.rest, "actions", Object.keys(D).length > 0 ? D : void 0);
            })
          },
          d.uid
        ),
        v.length > 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: a("kept", { fields: v.join(", ") }) })
      ] })
    ] }),
    /* @__PURE__ */ m("aside", { className: "aq-card aq-pad aq-aside", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: a("preview") }),
      /* @__PURE__ */ r(un, { ctx: e, quest: d })
    ] })
  ] });
}
function sn({
  ctx: e,
  quest: t,
  stage: n,
  si: i,
  handle: a,
  editQuest: o
}) {
  const { t: l } = e, [c, d] = R(null), [u, f] = R(!1), s = (y) => o((x) => y(x.stages[i])), v = S(e.project, n.title.key, e.lang), q = n.flow || "parallel", g = t.stages.flatMap((y) => y.objectives.map((x) => x.key)), h = u || n.objectives.length === 0, k = (y) => {
    const x = kt(y, g);
    o((w) => {
      w.stages[i].objectives.push({ key: x, type: y, params: Pe(y) });
    }), d(x), f(!1);
  };
  return /* @__PURE__ */ m("div", { className: "aq-card aq-stage", children: [
    /* @__PURE__ */ m("div", { className: "aq-stage-head", children: [
      a,
      /* @__PURE__ */ r("span", { className: "aq-n is-brand", children: i + 1 }),
      /* @__PURE__ */ r("div", { className: "aq-stage-title", children: /* @__PURE__ */ r(
        X,
        {
          value: v,
          placeholder: l("stageTitle"),
          "aria-label": l("stage", { n: i + 1 }),
          onChange: (y) => e.edit(() => {
          }, [{ key: n.title.key, lang: e.lang, value: y }])
        }
      ) }),
      n.objectives.length > 1 && /* @__PURE__ */ r(
        ne,
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
        Ne,
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
      fe,
      {
        ids: Be(n.objectives.map((y) => y.key)),
        onMove: (y, x) => s((w) => we(w.objectives, y, x)),
        className: "aq-objectives",
        children: (y, x) => {
          const w = n.objectives[y];
          return /* @__PURE__ */ r(
            ln,
            {
              t: l,
              projectId: e.projectId,
              n: q === "sequential" ? `${i + 1}.${y + 1}` : "",
              objective: w,
              open: c === w.key,
              onToggle: () => d(c === w.key ? null : w.key),
              keyTaken: g.filter((N) => N === w.key).length > 1,
              handle: x,
              onChange: (N) => s((E) => N(E.objectives[y])),
              onRename: (N) => {
                c === w.key && d(N);
              },
              onRemove: () => s((N) => {
                N.objectives.splice(y, 1);
              })
            }
          );
        }
      }
    ),
    h ? /* @__PURE__ */ m("div", { className: "aq-types", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: l("addObjective") }),
      /* @__PURE__ */ r("div", { className: "aq-seg", children: be.map((y) => /* @__PURE__ */ m("button", { type: "button", className: "aq-opt", onClick: () => k(y.type), children: [
        /* @__PURE__ */ r("span", { "aria-hidden": !0, children: y.icon }),
        " ",
        l(`objective.${y.type}`)
      ] }, y.type)) })
    ] }) : /* @__PURE__ */ m(Q, { size: "sm", variant: "ghost", className: "aq-add", onClick: () => f(!0), children: [
      "+ ",
      l("addObjective")
    ] })
  ] });
}
function ln({
  t: e,
  projectId: t,
  n,
  objective: i,
  open: a,
  onToggle: o,
  keyTaken: l,
  handle: c,
  onChange: d,
  onRename: u,
  onRemove: f
}) {
  const s = U(i.type), v = s ? s.params : Object.keys(i.params).map((p) => ({ name: p, kind: "text" })), q = re(i.params), g = ke(i.type, i.params), h = Ke(i.type, i.params), k = l || h.length > 0, y = v.filter((p) => p.advanced), [x, w] = R(!1), N = x || l, E = (p) => p.kind === "item" ? /* @__PURE__ */ r(
    cn,
    {
      t: e,
      projectId: t,
      spec: p,
      params: i.params,
      onChange: (b) => d((_) => b(_.params))
    },
    p.name
  ) : /* @__PURE__ */ r(
    dn,
    {
      t: e,
      spec: p,
      value: i.params[p.name],
      onChange: (b) => d((_) => j(_.params, p.name, b))
    },
    p.name
  );
  return /* @__PURE__ */ m("div", { className: `aq-obj${a ? " is-open" : ""}${k ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ m("div", { className: "aq-obj-line", children: [
      c,
      /* @__PURE__ */ m("button", { type: "button", className: "aq-obj-main", onClick: o, "aria-expanded": a, children: [
        n && /* @__PURE__ */ r("span", { className: "aq-obj-n", children: n }),
        /* @__PURE__ */ r("span", { className: "aq-obj-icon", "aria-hidden": !0, children: s?.icon ?? "?" }),
        /* @__PURE__ */ m("span", { className: "aq-obj-text", children: [
          ee(e, i.type),
          q !== void 0 && /* @__PURE__ */ m("strong", { children: [
            " · ",
            String(q)
          ] }),
          g ? ` × ${g}` : q !== void 0 ? ` × ${e("any")}` : ""
        ] }),
        k && /* @__PURE__ */ r(C, { tone: "warn", children: l ? e("objectiveKeyTaken") : e("missing", {
          fields: h.map((p) => e(`param.${p}`)).join(", ")
        }) }),
        /* @__PURE__ */ r(J, { open: a })
      ] }),
      /* @__PURE__ */ r(oe, { label: e("remove"), onClick: f, children: "×" })
    ] }),
    a && /* @__PURE__ */ m("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ m("div", { className: "aq-row aq-top aq-wrap", children: [
        /* @__PURE__ */ r(T, { label: e("type"), children: /* @__PURE__ */ m(
          "select",
          {
            className: "select",
            value: i.type,
            onChange: (p) => d((b) => {
              b.type = p.target.value, b.params = Pe(b.type);
            }),
            children: [
              be.map((p) => /* @__PURE__ */ m("option", { value: p.type, children: [
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
      /* @__PURE__ */ m(
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
      N && /* @__PURE__ */ m("div", { className: "aq-row aq-top aq-wrap", children: [
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
                  const b = De(p.target.value);
                  d((_) => {
                    _.key = b;
                  }), u(b);
                },
                onBlur: () => {
                  const p = ae(i.key);
                  p !== i.key && (d((b) => {
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
function cn({
  t: e,
  projectId: t,
  spec: n,
  params: i,
  onChange: a
}) {
  const o = qe(i, n), l = Array.isArray(i.match) ? i.match : void 0, c = (d, u) => a((f) => $t(f, n, d, u));
  return /* @__PURE__ */ r(T, { label: e(`param.${n.name}`), children: /* @__PURE__ */ r(
    st,
    {
      projectId: t,
      value: o,
      match: l,
      onChange: (d) => c(d, l),
      onMatchChange: (d) => c(o, d)
    }
  ) });
}
function dn({
  t: e,
  spec: t,
  value: n,
  onChange: i
}) {
  const a = e(`param.${t.name}`), o = typeof n == "string" || typeof n == "number" ? String(n) : "";
  if (t.kind === "int")
    return /* @__PURE__ */ r(H, { label: a, value: n, onChange: i });
  if (t.kind === "material")
    return /* @__PURE__ */ r(T, { label: a, children: /* @__PURE__ */ r(
      lt,
      {
        value: o,
        placeholder: e("any"),
        "aria-label": a,
        onChange: (c) => i(c.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const l = t.kind === "entity";
  return /* @__PURE__ */ m(T, { label: a, children: [
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
    l && /* @__PURE__ */ r("datalist", { id: "aq-entities", children: Ot.map((c) => /* @__PURE__ */ r("option", { value: c }, c)) })
  ] });
}
function un({ ctx: e, quest: t }) {
  const { t: n, project: i, lang: a } = e, o = (c) => te(n, c), l = L(S(i, t.description.key, a));
  return /* @__PURE__ */ m("div", { className: "aq-preview", children: [
    /* @__PURE__ */ r("span", { className: "aq-preview-title", children: L(S(i, t.title.key, a)) || t.key }),
    l && /* @__PURE__ */ r("span", { className: "aq-preview-line", children: l }),
    t.stages.map((c, d) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ m("span", { className: "aq-preview-stage", children: [
        t.stages.length > 1 && /* @__PURE__ */ r("span", { className: "aq-preview-head", children: L(S(i, c.title.key, a)) || n("stage", { n: d + 1 }) }),
        c.objectives.map((u) => /* @__PURE__ */ m("span", { className: "aq-preview-line", children: [
          "• ",
          o(u)
        ] }, u.key))
      ] }, d)
    ))
  ] });
}
function pn({ className: e }) {
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
const mn = {
  kind: ge,
  dir: Ie,
  schemaVersion: ve,
  // Created in the module's folder only (SDK 1.8); a group already elsewhere still loads.
  projects: [qt],
  // Data with no links: one "Quests" entry and page instead of a node per group (SDK 1.9).
  collection: { labels: vt },
  // A group's id is its key on the server (`quest_group_key`): typed by hand, no prefix.
  label: _e.en,
  labels: _e,
  icon: pn,
  component: Wt,
  // The view is a page of its own: its cards, and the quest beside what the player sees.
  ownHeader: !0,
  wide: !0,
  title: (e, { project: t, lang: n }) => S(t, e.title.key, n),
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
  parse: (e, t) => xt(e, t),
  serialize: (e, t) => jt(e, t),
  ltextSites: (e) => Ct(e),
  board: {
    size: { width: 300, height: 48 },
    accent: Rt,
    // The group's quests, one selectable row each: the Properties panel opens the one clicked.
    items: (e, { project: t, lang: n }) => Lt(e, t, n),
    summary: (e, { lang: t }) => Mt(e, t)
  }
}, Ee = "quests:groups", Ae = "quests:quests", hn = "quests:active";
function fn(e) {
  return e.startsWith("msquests:") ? `quests:${e.slice(9)}` : e;
}
const Te = {
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
}, Se = { en: "Available", fr: "Disponible" };
function yn(e, t, n) {
  const i = fn(t);
  if (i !== Ee && i !== Ae && i !== hn) return null;
  const a = e.documents?.[ge];
  if (!a || a.length === 0) return null;
  const o = e.defaultLang ?? "en", l = n?.serverRows, c = n?.params?.group || void 0, d = [...a].sort((f, s) => f.id < s.id ? -1 : f.id > s.id ? 1 : 0);
  if (i === Ee) {
    const f = me(l, "key");
    return d.map((s) => gn(s, f.get(s.id), o));
  }
  if (i === Ae) {
    const f = me(l, "id");
    return d.filter((s) => !c || s.id === c).flatMap((s) => s.quests.map((v) => We(s, v, f.get(`${s.id}:${v.key}`), o)));
  }
  if (!l) return null;
  const u = new Map(a.map((f) => [f.id, f]));
  return l.flatMap((f) => {
    const s = u.get(I(f.group));
    if (!s) return [f];
    const v = s.quests.find((q) => q.key === I(f.quest_key));
    return v ? [kn(v, f, o)] : [];
  });
}
function gn(e, t, n) {
  const i = me(Y(t?.quests), "key");
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
    quests: e.quests.map((a) => We(e, a, i.get(a.key), n))
  };
}
function We(e, t, n, i) {
  const a = e.tiers.find((o) => o.key === t.tier);
  return {
    id: `${e.id}:${t.key}`,
    group: e.id,
    key: t.key,
    name: t.title,
    description: t.description,
    duration: _n(t.duration),
    tier: t.tier,
    tier_name: a ? a.title : "",
    assigned: n?.assigned ?? !1,
    status_key: n?.status_key ?? "NOT_STARTED",
    status: n?.status ?? Se[i.slice(0, 2)] ?? Se.en,
    can_start: n?.can_start ?? !1,
    start_blocker: n?.start_blocker ?? "",
    start_blocker_label: n?.start_blocker_label ?? "",
    // `reference` in `QuestRows.questRow`: the attempt the server holds for this player.
    ...Je(t, n?.assigned === !0 ? n : void 0, i)
  };
}
function Je(e, t, n) {
  const i = t ? vn(t) : void 0, a = bn(e, i, n), o = a.find((c) => c.active === !0), l = o ? o.objectives.find((c) => c.done !== !0) : void 0;
  return {
    objective_name: l?.name ?? "",
    objective_progress: l?.progress ?? 0,
    objective_target: l?.target ?? 0,
    progress_ratio: i ? Ze(a.map((c) => c.progress_ratio)) : 0,
    stage_index: a.filter((c) => c.completed === !0).length,
    stage_name: o?.name ?? "",
    stage_flow: o?.flow ?? "",
    stages: a.map((c) => ({ ...c, objectives: c.objectives.map(({ done: d, ...u }) => u) }))
  };
}
function vn(e) {
  const t = /* @__PURE__ */ new Map(), n = [
    ...Y(e.objectives),
    ...Y(e.stages).flatMap((i) => Y(i.objectives))
  ];
  for (const i of n) {
    const a = I(i.status_key);
    t.set(I(i.key), {
      progress: he(i.progress, 0),
      flag: a === "COMPLETED" || a === "FAILED" ? a : "",
      row: i
    });
  }
  return t;
}
function bn(e, t, n) {
  const i = e.stages.map((o, l) => {
    const c = o.objectives.map((d) => qn(d, t?.get(d.key), n));
    return {
      key: o.key,
      name: o.title,
      flow: Nn(o),
      index: l,
      // `QuestStage.isCompleted`: all objectives done, so an empty stage is.
      completed: t !== void 0 && c.every((d) => d.done),
      active: !1,
      progress_ratio: t ? Ze(c.map((d) => d.progress_ratio)) : 0,
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
function qn(e, t, n) {
  const i = wn(e), a = t?.progress ?? 0, o = t?.row, l = o && o.type === e.type && o.target === i;
  return {
    key: e.key,
    name: l && typeof o.name == "string" ? o.name : xn(e, n),
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
function kn(e, t, n) {
  const i = Je(e, t, n), a = i.stages;
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
function xn(e, t) {
  const i = (Te[t.slice(0, 2)] ?? Te.en)[e.type];
  if (!i) return e.type;
  const a = e.params, o = {
    amount: String(a.amount ?? ""),
    distance: String(a.distance ?? ""),
    command: I(a.command),
    value: I(a.value),
    // Bukkit's translation keys, as the objective configs write them (`<lang:…>`).
    crop: Z("block", a.crop),
    entity_type: Z("entity", a.entity_type),
    material: e.type === "block_break" ? Z("block", a.material) : $e(e),
    fish_type: $e(e)
  };
  return i.replace(/%([a-z_]+)%/g, (l, c) => o[c] ?? "");
}
function Z(e, t) {
  const n = I(t).toLowerCase().replace(/^minecraft:/, "");
  return n === "" ? "" : `<lang:${e}.minecraft.${n}>`;
}
function $e(e) {
  const t = U(e.type)?.params.find((o) => o.kind === "item");
  if (!t) return "";
  const n = qe(e.params, t), i = n.title;
  if (typeof i == "string" && i.trim() !== "") return i;
  const a = I(n.material);
  return /^(minecraft:)?[a-z_0-9]+$/i.test(a) && !a.includes(":") ? Z("item", a) : a || He(n);
}
function wn(e) {
  const t = re(e.params);
  if (t === void 0) return 1;
  const n = Number(t);
  return Number.isFinite(n) ? n : 1;
}
function Nn(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function _n(e) {
  const t = e.trim().toLowerCase().replace(/ /g, "");
  if (t === "") return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const n = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!n) return 0;
  const [, i, a, o, l] = n;
  return Number(i ?? 0) * 86400 + Number(a ?? 0) * 3600 + Number(o ?? 0) * 60 + Number(l ?? 0);
}
function me(e, t) {
  return new Map((e ?? []).map((n) => [I(n[t]), n]));
}
function Y(e) {
  return Array.isArray(e) ? e.filter((t) => t && typeof t == "object") : [];
}
function Ze(e) {
  return e.length === 0 ? 0 : e.reduce((t, n) => t + n, 0) / e.length;
}
function he(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function I(e) {
  return typeof e == "string" ? e : "";
}
const jn = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: dt,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  documents: [mn],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: yn
}, Tn = { ...jn, sdk: "1.20.0" };
export {
  Tn as default
};
