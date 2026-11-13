import { createModuleI18n as Ie, fieldText as Pe, newTextKey as $, textValue as E, injectModuleStyles as Me, useProject as De, useContentLang as He, Button as K, selectDocumentItem as Ke, SortableList as ie, updateDocument as Ge, useUiLang as Qe, MiniMessageInput as be, ActionChainEditor as Ue, ItemInput as ze, MaterialInput as Fe, SDK_VERSION as Be } from "@artisan/editor-sdk";
import { jsxs as h, jsx as s, Fragment as U } from "react/jsx-runtime";
import { useState as ae, useEffect as Ve } from "react";
const We = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
}, Je = /^\d+$/;
function Y(e, t, i) {
  const n = String(i).padStart(2, "0");
  return e === "fr" ? i === 0 ? `${t} h` : `${t} h ${n}` : `${String(t).padStart(2, "0")}:${n}`;
}
function C(e, t, i) {
  return Je.test(e) && Number(e) >= t && Number(e) <= i;
}
function de(e) {
  return e.trim().split(/\s+/).length === 5;
}
function Ze(e, t) {
  const i = t === "fr", n = e.trim().split(/\s+/);
  if (n.length !== 5) return null;
  const [a, r, o, p, d] = n;
  if (p !== "*") return null;
  const l = /^\*\/(\d+)$/;
  if (o === "*" && d === "*") {
    if (C(a, 0, 59) && C(r, 0, 23))
      return i ? `tous les jours à ${Y(t, +r, +a)}` : `every day at ${Y(t, +r, +a)}`;
    const y = l.exec(r);
    if (C(a, 0, 59) && y)
      return i ? `toutes les ${y[1]} h, à la minute ${a}` : `every ${y[1]} hours, at minute ${a}`;
    if (C(a, 0, 59) && r === "*")
      return i ? `toutes les heures, à la minute ${a}` : `every hour, at minute ${a}`;
    const q = l.exec(a);
    return q && r === "*" ? i ? `toutes les ${q[1]} minutes` : `every ${q[1]} minutes` : null;
  }
  if (!C(a, 0, 59) || !C(r, 0, 23)) return null;
  const m = Y(t, +r, +a);
  if (o === "*" && C(d, 0, 7)) {
    const y = We[i ? "fr" : "en"][Number(d) % 7];
    return i ? `chaque ${y} à ${m}` : `every ${y} at ${m}`;
  }
  return d === "*" && C(o, 1, 31) ? i ? `le ${o === "1" ? "1er" : o} de chaque mois à ${m}` : `on day ${o} of each month at ${m}` : null;
}
function M(e, t, i) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e.split(",")) {
    const r = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(a);
    if (!r) return null;
    const o = r[4] ? Number(r[4]) : 1, p = r[1] === "*" ? t : Number(r[2]), d = r[1] === "*" ? i : r[3] ? Number(r[3]) : r[4] ? i : p;
    if (o < 1 || p < t || d > i || p > d) return null;
    for (let l = p; l <= d; l += o) n.add(l);
  }
  return n;
}
function Ye(e, t) {
  const i = e.trim().split(/\s+/);
  if (i.length !== 5) return null;
  const n = M(i[0], 0, 59), a = M(i[1], 0, 23), r = M(i[2], 1, 31), o = M(i[3], 1, 12), p = M(i[4], 0, 7);
  if (!n || !a || !r || !o || !p) return null;
  p.has(7) && p.add(0);
  const d = i[2] === "*", l = i[4] === "*", m = (v) => d && l ? !0 : d ? p.has(v.getDay()) : l ? r.has(v.getDate()) : r.has(v.getDate()) || p.has(v.getDay()), y = new Date(t.getTime());
  y.setSeconds(0, 0), y.setMinutes(y.getMinutes() + 1);
  const q = t.getTime() + 366 * 24 * 3600 * 1e3;
  for (; y.getTime() <= q; ) {
    if (!o.has(y.getMonth() + 1) || !m(y)) {
      y.setDate(y.getDate() + 1), y.setHours(0, 0, 0, 0);
      continue;
    }
    if (!a.has(y.getHours())) {
      y.setHours(y.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (n.has(y.getMinutes())) return y;
    y.setMinutes(y.getMinutes() + 1);
  }
  return null;
}
const G = {
  kindLabel: "Quest groups",
  collection: "Quests",
  group: "Group",
  title: "Title",
  description: "Description",
  actorType: "Who plays",
  "actor.player": "Each player",
  "actor.global": "The whole server",
  reset: "Period reset",
  cron: "Schedule (cron)",
  cronInvalid: "A cron has 5 fields: minute hour day month weekday.",
  nextRun: "next: {{when}}",
  cronRaw: "Custom schedule",
  noReset: "Never resets",
  distribution: "Distribution",
  strategy: "How quests are handed out",
  "strategy.none": "All at once",
  "strategy.sequential": "In list order",
  "strategy.random": "At random",
  amount: "Quests handed out",
  triggers: "Hand out when",
  "trigger.actor_load": "the player joins",
  "trigger.period_reset": "the period resets",
  "trigger.quest_complete": "a quest is completed",
  perTier: "Per tier",
  limits: "Limits",
  maxActive: "Active at once",
  questsPerPeriod: "Quests per period",
  rotationsPerPeriod: "Rotations per period",
  noLimit: "No limit",
  rotation: "Rotation",
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
  open: "Edit",
  remove: "Remove",
  back: "Back to the group",
  key: "Key",
  keyTaken: "Another quest of this group has this key.",
  objectiveKeyTaken: "Another objective of this quest has this key: they would share their progress.",
  tier: "Tier",
  duration: "Time limit",
  durationHint: "24h, 1h30m, 90s… empty: none",
  durationInvalid: "Write a duration such as 24h, 1h30m or 90s.",
  stages: "Stages",
  stage: "Stage {{n}}",
  addStage: "Add a stage",
  flow: "Order of the objectives",
  "flow.parallel": "In any order",
  "flow.sequential": "One after the other",
  objectives: "Objectives",
  addObjective: "Add an objective",
  type: "Type",
  required: "Required",
  questEvents: "Quest events",
  questEventsHint: "Actions run on an event of this quest, after the group's for the same event: any action Artisan or an installed plugin declares, with conditions; a plugin without an action (guild XP…) is reached with a command. Write what the player wins in the description.",
  "questHook.start": "The quest starts",
  "questHook.objective_progress": "An objective progresses",
  "questHook.objective_complete": "An objective is completed",
  "questHook.complete": "The quest is completed",
  addEvent: "+ Add an event…",
  removeEvent: "Remove this event and its actions",
  legacySteps: "Old MSQuests format, kept as is: the server converts it on load, /msquests migrate rewrites it.",
  hooks: "Group events",
  hooksHint: "Actions run on each event of the group, for the player concerned.",
  "hook.distribution": "Quests are handed out",
  "hook.actor_load": "A player is loaded",
  "hook.quest_start": "A quest starts",
  "hook.objective_progress": "An objective progresses",
  "hook.objective_complete": "An objective is completed",
  "hook.quest_complete": "A quest is completed",
  "hook.period_complete": "Every quest of the period is completed",
  questSummary: "Stages: {{stages}} · objectives: {{objectives}}",
  general: "General",
  more: "More options",
  questKeyHint: "Names the quest in commands and placeholders. Progress follows the quest, not its key.",
  objectiveKeyHint: "Progress is stored under this key: changing it resets the progress of the players doing this quest.",
  stageTitle: "Stage title (optional)",
  missing: "To fill: {{fields}}",
  itemKeyHint: "Matched instead of the material, for a custom item. Empty for a vanilla item.",
  kept: "Kept as is: {{fields}}",
  preview: "What the player sees",
  noQuests: "No quest yet.",
  noObjectives: "No objective: the stage completes at once.",
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
  giverNpcHint: "The NPC's id. Empty: no NPC gives this quest.",
  giverConversation: "Conversation of the offer",
  giverDistributed: "This group also hands its quests out by itself: a player may receive this one before meeting the NPC.",
  any: "any",
  anyItem: "Empty: any item counts."
}, J = {
  kindLabel: "Groupes de quêtes",
  collection: "Quêtes",
  group: "Groupe",
  title: "Titre",
  description: "Description",
  actorType: "Qui joue",
  "actor.player": "Chaque joueur",
  "actor.global": "Tout le serveur",
  reset: "Réinitialisation de la période",
  cron: "Planification (cron)",
  cronInvalid: "Un cron a 5 champs : minute heure jour mois jour-de-semaine.",
  nextRun: "prochaine : {{when}}",
  cronRaw: "Planification personnalisée",
  noReset: "Jamais réinitialisé",
  distribution: "Distribution",
  strategy: "Comment les quêtes sont données",
  "strategy.none": "Toutes d'un coup",
  "strategy.sequential": "Dans l'ordre de la liste",
  "strategy.random": "Au hasard",
  amount: "Quêtes données",
  triggers: "Donner quand",
  "trigger.actor_load": "le joueur se connecte",
  "trigger.period_reset": "la période se réinitialise",
  "trigger.quest_complete": "une quête est terminée",
  perTier: "Par tier",
  limits: "Limites",
  maxActive: "Actives en même temps",
  questsPerPeriod: "Quêtes par période",
  rotationsPerPeriod: "Rotations par période",
  noLimit: "Sans limite",
  rotation: "Rotation",
  rotationEnabled: "Faire tourner les quêtes",
  tiers: "Tiers",
  tierKey: "Clé",
  addTier: "Ajouter un tier",
  noTier: "Aucun tier",
  quests: "Quêtes",
  questCount: "{{count}} quêtes",
  questCountOne: "1 quête",
  addQuest: "Nouvelle quête",
  newQuestTitle: "Nouvelle quête",
  open: "Modifier",
  remove: "Supprimer",
  back: "Retour au groupe",
  key: "Clé",
  keyTaken: "Une autre quête du groupe a déjà cette clé.",
  objectiveKeyTaken: "Un autre objectif de la quête a déjà cette clé : ils partageraient leur progression.",
  tier: "Tier",
  duration: "Durée limite",
  durationHint: "24h, 1h30m, 90s… vide : aucune",
  durationInvalid: "Écrivez une durée comme 24h, 1h30m ou 90s.",
  stages: "Étapes",
  stage: "Étape {{n}}",
  addStage: "Ajouter une étape",
  flow: "Ordre des objectifs",
  "flow.parallel": "Dans n'importe quel ordre",
  "flow.sequential": "L'un après l'autre",
  objectives: "Objectifs",
  addObjective: "Ajouter un objectif",
  type: "Type",
  required: "Obligatoire",
  questEvents: "Événements de la quête",
  questEventsHint: "Actions exécutées sur un événement de cette quête, après celles du groupe pour le même événement : toute action d'Artisan ou d'un plugin installé, avec conditions ; un plugin sans action (XP de guilde…) passe par une commande. Écrivez ce que gagne le joueur dans la description.",
  "questHook.start": "La quête commence",
  "questHook.objective_progress": "Un objectif progresse",
  "questHook.objective_complete": "Un objectif est terminé",
  "questHook.complete": "La quête est terminée",
  addEvent: "+ Ajouter un événement…",
  removeEvent: "Retirer cet événement et ses actions",
  legacySteps: "Ancien format MSQuests, conservé tel quel : le serveur le convertit au chargement, /msquests migrate le réécrit.",
  hooks: "Événements du groupe",
  hooksHint: "Actions exécutées à chaque événement du groupe, pour le joueur concerné.",
  "hook.distribution": "Les quêtes sont distribuées",
  "hook.actor_load": "Un joueur est chargé",
  "hook.quest_start": "Une quête commence",
  "hook.objective_progress": "Un objectif progresse",
  "hook.objective_complete": "Un objectif est terminé",
  "hook.quest_complete": "Une quête est terminée",
  "hook.period_complete": "Toutes les quêtes de la période sont terminées",
  questSummary: "Étapes : {{stages}} · objectifs : {{objectives}}",
  general: "Général",
  more: "Plus d'options",
  questKeyHint: "Nomme la quête dans les commandes et placeholders. La progression suit la quête, pas sa clé.",
  objectiveKeyHint: "La progression est stockée sous cette clé : la changer remet à zéro la progression des joueurs qui font cette quête.",
  stageTitle: "Titre de l'étape (facultatif)",
  missing: "À remplir : {{fields}}",
  itemKeyHint: "Comparée à la place du matériau, pour un objet personnalisé. Vide pour un objet vanilla.",
  kept: "Conservé tel quel : {{fields}}",
  preview: "Ce que voit le joueur",
  noQuests: "Aucune quête pour l'instant.",
  noObjectives: "Aucun objectif : l'étape se termine aussitôt.",
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
  giverNpcHint: "L'identifiant du PNJ. Vide : aucun PNJ ne donne cette quête.",
  giverConversation: "Conversation de la proposition",
  giverDistributed: "Ce groupe distribue aussi ses quêtes tout seul : un joueur peut recevoir celle-ci avant d'avoir vu le PNJ.",
  any: "n'importe lequel",
  anyItem: "Vide : n’importe quel item compte."
}, ue = { en: G.kindLabel, fr: J.kindLabel }, Xe = { en: G.collection, fr: J.collection }, et = Ie({ en: G, fr: J });
function qe(e) {
  const t = e === "fr" ? J : G;
  return (i, n) => {
    const a = t[i] ?? G[i] ?? i;
    return n ? a.replace(/\{\{(\w+)\}\}/g, (r, o) => String(n[o] ?? r)) : a;
  };
}
const re = "quest_group", ke = "quest_groups", tt = "quests", se = "quest_group/v1", ee = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function V(e = Date.now()) {
  let t = "", i = e;
  for (let r = 0; r < 10; r++)
    t = ee[i % 32] + t, i = Math.floor(i / 32);
  const n = new Uint8Array(16);
  crypto.getRandomValues(n);
  let a = "";
  for (let r = 0; r < 16; r++) a += ee[n[r] % 32];
  return t + a;
}
function z(e, t) {
  const i = new Set(t);
  if (!i.has(e)) return e;
  for (let n = 2; ; n++) if (!i.has(`${e}_${n}`)) return `${e}_${n}`;
}
function nt(e, t) {
  const i = new Set(t), n = new Uint8Array(4);
  for (; ; ) {
    crypto.getRandomValues(n);
    const a = Array.from(n, (o) => ee[o % 32].toLowerCase()).join(""), r = `${Z(e)}_${a}`;
    if (!i.has(r)) return r;
  }
}
function xe(e) {
  return e.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
function Z(e) {
  return e.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "quest";
}
function j(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? { ...e } : {};
}
function X(e) {
  return Array.isArray(e) ? e : [];
}
function w(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? String(e) : "";
}
function D(e, ...t) {
  const i = { ...e };
  for (const n of t) delete i[n];
  return i;
}
function it(e, t) {
  const i = {}, n = [];
  function a(d) {
    if (d && typeof d == "object" && !Array.isArray(d)) {
      const y = $(), q = {};
      for (const [v, c] of Object.entries(d)) q[v] = w(c);
      return i[y] = q, { key: y };
    }
    const l = typeof d == "string" ? /^\{i18n:(.+)\}$/.exec(d) : null;
    if (l) {
      const y = t.translations?.[l[1]];
      return y && (i[l[1]] = { ...y }), { key: l[1] };
    }
    const m = $();
    return i[m] = d == null || d === "" ? {} : { [t.lang]: w(d) }, { key: m };
  }
  const r = Object.entries(j(e.tiers)).map(([d, l]) => {
    const m = j(l);
    return { key: d, title: a(m.title), rest: D(m, "title") };
  }), o = X(e.quests).map((d, l) => {
    const m = j(d), y = X(m.stages).map((q, v) => {
      const c = j(q), g = w(c.flow).toLowerCase();
      return {
        key: w(c.key) || `stage_${v + 1}`,
        title: a(c.title),
        flow: g === "parallel" || g === "sequential" ? g : "",
        objectives: X(c.objectives).map((u, b) => {
          const f = j(u);
          return {
            key: w(f.key) || `objective_${b + 1}`,
            type: w(f.type),
            params: D(f, "key", "type")
          };
        }),
        rest: D(c, "key", "title", "flow", "objectives")
      };
    });
    return {
      key: w(m.key) || `quest_${l + 1}`,
      uid: w(m.uid) || V(),
      tier: w(m.tier),
      title: a(m.title),
      description: a(m.description),
      duration: w(m.duration),
      stages: y,
      rest: at(m)
    };
  }), p = {
    id: w(e.id),
    projectId: t.projectId,
    uid: w(e.uid) || V(),
    title: a(e.title),
    description: a(e.description),
    actorType: w(e.actor_type) || "player",
    reset: j(e.reset),
    limits: j(e.limits),
    rotation: j(e.rotation),
    distribution: j(e.distribution),
    tiers: r,
    quests: o,
    rest: _e(D(
      j(e),
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
  return e.schema !== void 0 && e.schema !== se && n.push(`schema: ${String(e.schema)}`), { doc: p, i18nKeys: i, unsupported: n };
}
function _e(e) {
  return e.on !== void 0 && (e.actions == null && (e.actions = e.on), delete e.on), e;
}
function at(e) {
  const t = _e(
    D(e, "key", "uid", "tier", "title", "description", "duration", "stages", "reward_display")
  );
  if (t.rewards !== void 0) {
    const i = j(t.actions);
    i.complete == null && (t.actions = { ...i, complete: t.rewards }), delete t.rewards;
  }
  return t;
}
function rt(e) {
  return typeof e == "string" ? e === "" : Object.values(e).every((t) => t === "");
}
function T(e) {
  const t = {};
  for (const [i, n] of Object.entries(e))
    n == null || n === "" || Array.isArray(n) && n.length === 0 || typeof n == "object" && !Array.isArray(n) && Object.keys(n).length === 0 || (t[i] = n);
  return t;
}
const st = [
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
function ot(e, t) {
  const i = (l) => Pe(t, l.key), n = (l) => {
    const m = i(l);
    return rt(m) ? void 0 : m;
  }, a = {};
  for (const l of e.tiers) a[l.key] = { ...l.rest, title: i(l.title) };
  const r = e.quests.map(
    (l) => T({
      key: l.key,
      uid: l.uid,
      tier: l.tier,
      title: i(l.title),
      description: n(l.description),
      duration: l.duration,
      ...l.rest,
      stages: l.stages.map(
        (m) => T({
          key: m.key,
          title: n(m.title),
          flow: m.flow,
          ...m.rest,
          objectives: m.objectives.map((y) => ({ key: y.key, type: y.type, ...y.params }))
        })
      )
    })
  ), o = {
    ...e.rest,
    id: e.id,
    schema: se,
    uid: e.uid,
    title: i(e.title),
    description: n(e.description),
    actor_type: e.actorType,
    reset: T(e.reset),
    limits: T(e.limits),
    rotation: T(e.rotation),
    distribution: T(e.distribution),
    tiers: a,
    quests: r
  }, p = {};
  for (const l of st) l in o && (p[l] = o[l]);
  for (const l of Object.keys(o)) l in p || (p[l] = o[l]);
  const d = T(p);
  return d.quests = r, d;
}
function* lt(e) {
  const t = `${ke}.${e.id}`;
  yield { lText: e.title, key: `${t}.title`, path: "title", kind: "quest_group.title" }, yield {
    lText: e.description,
    key: `${t}.description`,
    path: "description",
    kind: "quest_group.description"
  };
  for (const n of e.tiers)
    yield {
      lText: n.title,
      key: `${t}.tiers.${n.key}.title`,
      path: `tiers.${n.key}.title`,
      kind: "quest_group.tier"
    };
  const i = /* @__PURE__ */ new Set();
  for (let n = 0; n < e.quests.length; n++) {
    const a = e.quests[n], r = i.has(a.uid) ? `${a.uid}_${n}` : a.uid;
    i.add(a.uid);
    const o = `${t}.quests.${r}`;
    yield {
      lText: a.title,
      key: `${o}.title`,
      path: `quests[${n}].title`,
      kind: "quest.title"
    }, yield {
      lText: a.description,
      key: `${o}.description`,
      path: `quests[${n}].description`,
      kind: "quest.description"
    };
    const p = /* @__PURE__ */ new Set();
    for (let d = 0; d < a.stages.length; d++) {
      const l = a.stages[d], m = p.has(l.key) ? `${l.key}_${d}` : l.key;
      p.add(l.key), yield {
        lText: l.title,
        key: `${o}.stages.${m}.title`,
        path: `quests[${n}].stages[${d}].title`,
        kind: "quest.stage"
      };
    }
  }
}
function pe(e) {
  return !!e && typeof e == "object" && !Array.isArray(e) && "type" in e;
}
function ct(e) {
  const t = Array.isArray(e) ? e : e == null ? [] : [e];
  return {
    chain: t.filter((i) => !pe(i)),
    legacy: t.filter(pe)
  };
}
function me(e, t) {
  const i = [...e, ...t];
  return i.length ? i : void 0;
}
function dt(e) {
  const t = String(e.type), i = e.command ?? e.message ?? e.title ?? e.material;
  return typeof i == "string" ? `${t} · ${i}` : t;
}
const ut = [
  "distribution",
  "actor_load",
  "quest_start",
  "objective_progress",
  "objective_complete",
  "quest_complete",
  "period_complete"
], pt = ["start", "objective_progress", "objective_complete", "complete"], S = { name: "amount", kind: "int", required: !0 }, Ne = [
  { type: "block_break", icon: "⛏", params: [{ name: "material", kind: "material" }, S] },
  {
    type: "craft_item",
    icon: "⚒",
    params: [{ name: "item", kind: "item", legacy: "material" }, S]
  },
  {
    type: "harvest_crop",
    icon: "🌾",
    params: [{ name: "crop", kind: "material", required: !0 }, S]
  },
  {
    type: "fishing",
    icon: "🎣",
    params: [{ name: "item", kind: "item", legacy: "fish_type" }, S]
  },
  {
    type: "deliver_item",
    icon: "📦",
    params: [
      { name: "item", kind: "item", legacy: "material" },
      S,
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
  { type: "kill_entity", icon: "⚔", params: [{ name: "entity_type", kind: "entity" }, S] },
  { type: "breed_animal", icon: "♥", params: [{ name: "entity_type", kind: "entity" }, S] },
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
function O(e) {
  return Ne.find((t) => t.type === e);
}
function je(e) {
  const t = {};
  for (const i of O(e)?.params ?? [])
    i.kind === "int" && (t[i.name] = 1);
  return t;
}
function oe(e) {
  return e.amount ?? e.distance;
}
function le(e, t) {
  const i = e[t.name];
  if (i && typeof i == "object" && !Array.isArray(i)) return i;
  const n = t.legacy ? e[t.legacy] : void 0;
  return typeof n == "string" && n !== "" ? { material: n } : {};
}
function mt(e, t, i, n) {
  t.legacy && delete e[t.legacy];
  const a = !i || Object.keys(i).length === 0;
  a ? delete e[t.name] : e[t.name] = i, a || n === void 0 ? delete e.match : e.match = n;
}
function we(e) {
  const t = e.title;
  if (typeof t == "string" && t.trim() !== "") return t.replace(/<[^>]*>/g, "");
  const i = e.material ?? e.item;
  return typeof i == "string" ? i : "";
}
function Ee(e, t) {
  const i = O(e);
  return i ? i.params.filter((n) => n.kind !== "int").map((n) => n.kind === "item" ? we(le(t, n)) : t[n.name]).filter((n) => typeof n == "string" && n !== "").join(" = ") : Object.keys(t).map((n) => t[n]).filter((n) => typeof n == "string" && n !== "").join(" = ");
}
function ht(e, t) {
  return (O(e)?.params ?? []).filter((i) => i.required && (t[i.name] === void 0 || t[i.name] === "")).map((i) => i.name);
}
const ft = [
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
], yt = "#f59e0b";
function Ae(e, t) {
  return O(t) ? e(`objective.${t}`) : t;
}
function W(e, t) {
  const i = Ee(t.type, t.params), n = oe(t.params);
  return `${Ae(e, t.type)}${i ? ` · ${i}` : ""}${n !== void 0 ? ` · 0/${String(n)}` : ""}`;
}
function Ce(e) {
  return e.replace(/<[^<>]*>/g, "").trim();
}
function gt(e) {
  const t = e.distribution?.strategy;
  return typeof t == "string" && t.toLowerCase() === "sequential";
}
function vt(e, t, i) {
  const n = qe(i), a = gt(e);
  return e.quests.map((r, o) => {
    const p = E(t, r.title.key, i);
    return {
      id: r.uid,
      label: Ce(p) || r.key,
      detail: r.tier || void 0,
      caption: bt(n, r),
      marker: a ? String(o + 1) : void 0,
      hover: {
        title: p || r.key,
        text: E(t, r.description.key, i) || void 0,
        lines: qt(n, r, t, i)
      }
    };
  });
}
function bt(e, t) {
  const i = t.stages.flatMap((r) => r.objectives), n = i[0];
  if (!n) return;
  const a = i.length - 1;
  return a > 0 ? `${W(e, n)} +${String(a)}` : W(e, n);
}
function qt(e, t, i, n) {
  const a = t.stages.length > 1;
  return t.stages.flatMap(
    (r, o) => r.objectives.map((p) => {
      const d = W(e, p);
      return a ? `<gray>${Ce(E(i, r.title.key, n)) || e("stage", { n: o + 1 })} ·</gray> ${d}` : d;
    })
  );
}
function kt(e, t) {
  const i = qe(t), n = typeof e.distribution?.strategy == "string" ? e.distribution.strategy.toLowerCase() : "", a = e.quests.length, r = a === 1 ? i("questCountOne") : i("questCount", { count: a });
  return ["none", "sequential", "random"].includes(n) ? `${r} · ${i(`strategy.${n}`).toLowerCase()}` : r;
}
const xt = `
.aq { display: flex; flex-direction: column; gap: 14px; padding: 12px; color: var(--text); font-size: 12.5px; }
.aq .input, .aq .select { height: 32px; padding: 5px 10px; font-size: 12.5px; }
.aq .textarea { padding: 6px 10px; font-size: 12.5px; min-height: 56px; resize: vertical; }
.aq-section { display: flex; flex-direction: column; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border-soft); }
.aq-section:first-child { border-top: 0; padding-top: 0; }
.aq-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.aq-h { font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--text-mut); }
.aq-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.aq-row { display: flex; gap: 8px; align-items: flex-end; }
.aq-row > * { flex: 1; min-width: 0; }
.aq-hint { color: var(--text-faint); font-size: 11.5px; }
.aq-ok { color: var(--success); font-size: 11.5px; }
.aq-err { color: var(--danger); font-size: 11.5px; }
.aq-warn { color: var(--warning); font-size: 11.5px; }
.aq-check { display: flex; align-items: center; gap: 6px; cursor: pointer; }
.aq-list { display: flex; flex-direction: column; gap: 6px; }
.aq-item { display: flex; align-items: center; gap: 6px; padding: 6px 8px 6px 2px; border: 1px solid var(--border); border-radius: var(--r-md); background: var(--surface); }
.aq-item-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; cursor: pointer; background: none; border: 0; color: inherit; text-align: left; padding: 0; font: inherit; }
.aq-item-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
.aq-item-sub { color: var(--text-faint); font-size: 11px; font-family: var(--font-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.aq-card { display: flex; flex-direction: column; gap: 8px; padding: 10px; border: 1px solid var(--border); border-radius: var(--r-md); background: var(--surface); }
.aq-sub { display: flex; flex-direction: column; gap: 8px; padding: 8px; border-radius: var(--r-sm); background: var(--surface-inset); }
.aq-icon-btn { width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border-radius: var(--r-sm); border: 0; background: none; color: var(--text-faint); cursor: pointer; flex: none; }
.aq-icon-btn:hover:not(:disabled) { background: var(--surface-hover); color: var(--text); }
.aq-icon-btn:disabled { opacity: .35; cursor: default; }
.aq-back { align-self: flex-start; }
.aq-preview { padding: 10px; border-radius: var(--r-md); background: var(--surface-inset); font-family: var(--font-mono); font-size: 11.5px; display: flex; flex-direction: column; gap: 2px; }
.aq-preview-title { color: var(--text); font-weight: 600; }
.aq-preview-line { color: var(--text-mut); }
.aq-mono { font-family: var(--font-mono); }
.aq-top { align-items: flex-start; }
.aq-wrap { flex-wrap: wrap; }
.aq-wrap > * { flex: 1 1 140px; }
.aq-badge { margin-left: auto; padding: 1px 7px; border-radius: 999px; background: var(--brand-soft); color: var(--text); font-size: 10.5px; }
.aq-fold > summary { display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--text-mut); font-size: 11.5px; padding: 4px 0; list-style: none; }
.aq-fold > summary::before { content: "▸"; color: var(--text-faint); transition: transform .12s; }
.aq-fold[open] > summary::before { transform: rotate(90deg); }
.aq-fold > summary::-webkit-details-marker { display: none; }
.aq-fold[open] { display: flex; flex-direction: column; gap: 8px; }
.aq-chain { display: flex; flex-direction: column; gap: 6px; }
.aq-event { display: flex; flex-direction: column; gap: 6px; }
.aq-event-name { color: var(--text); font-size: 12px; font-weight: 600; }
.aq-event-add { align-self: flex-start; width: auto; min-width: 240px; }
.aq-legacy { display: flex; flex-direction: column; gap: 4px; padding: 8px; border: 1px dashed var(--border); border-radius: var(--r-sm); }
.aq-legacy-row { display: flex; align-items: center; gap: 6px; }
.aq-legacy-row code { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--text-mut); }
.aq-stages { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; counter-reset: none; }
.aq-stage { display: flex; flex-direction: column; gap: 8px; padding: 10px 10px 8px; border: 1px solid var(--border); border-left: 3px solid var(--brand); border-radius: var(--r-md); background: var(--surface); }
.aq-stage-head { display: flex; align-items: center; gap: 6px; }
.aq-stage-n { flex: none; width: 22px; height: 22px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; background: var(--brand); color: var(--surface); font-weight: 700; font-size: 11.5px; }
.aq .aq-stage-title { flex: 1; min-width: 0; font-weight: 600; }
.aq .aq-stage-title .input { height: 28px; background: transparent; border-color: transparent; }
.aq .aq-stage-title .input:hover, .aq .aq-stage-title .input:focus { border-color: var(--border); background: var(--surface-inset); }
.aq-seg { display: flex; gap: 4px; flex-wrap: wrap; }
.aq-seg .chip { height: 24px; padding: 0 10px; font-size: 11px; cursor: pointer; }
.aq-objectives { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.aq-obj { border-radius: var(--r-sm); background: var(--surface-inset); border: 1px solid transparent; }
.aq-obj.is-open { border-color: var(--border); }
.aq-obj.has-problem:not(.is-open) { border-color: var(--warning); }
.aq-obj-line { display: flex; align-items: center; gap: 2px; padding: 0 4px 0 2px; }
.aq-obj-main { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; padding: 7px 8px; background: none; border: 0; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.aq-obj-main:hover .aq-obj-text { color: var(--text); }
.aq-obj-n { flex: none; min-width: 22px; color: var(--text-faint); font-family: var(--font-mono); font-size: 11px; }
.aq-obj-icon { flex: none; width: 20px; text-align: center; }
.aq-obj-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-mut); }
.aq-obj-text strong { color: var(--text); font-weight: 600; }
.aq-obj-dot { flex: none; width: 7px; height: 7px; border-radius: 999px; background: var(--warning); }
.aq-obj-form { display: flex; flex-direction: column; gap: 8px; padding: 4px 10px 10px; border-top: 1px solid var(--border-soft); }
.aq-add { align-self: flex-start; }
.aq-preview-stage { display: flex; flex-direction: column; gap: 2px; }
`, _t = /^(\d+|(\d+[dhms])+)$/, Nt = ["actor_load", "period_reset", "quest_complete"], jt = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
function wt(e, t) {
  const i = Ye(e, /* @__PURE__ */ new Date());
  if (!i) return null;
  try {
    return new Intl.DateTimeFormat(t, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(i);
  } catch {
    return i.toLocaleString();
  }
}
function Et({ projectId: e, documentId: t, document: i, item: n }) {
  Me("msquests", xt);
  const a = i, r = De(e), o = He(), p = et(), [d, l] = ae(n ?? null);
  Ve(() => {
    l(n ?? null);
  }, [n]);
  const m = (c) => {
    l(c), Ke({ documentId: t, item: c });
  }, q = { projectId: e, project: r, lang: o, t: p, edit: (c, g) => {
    const u = structuredClone(a);
    c(u), Ge({ projectId: e, kind: re, id: t, doc: u, texts: g });
  } }, v = d ? a.quests.findIndex((c) => c.uid === d) : -1;
  return v >= 0 ? /* @__PURE__ */ h("div", { className: "aq", children: [
    /* @__PURE__ */ h(K, { variant: "ghost", size: "sm", className: "aq-back", onClick: () => m(null), children: [
      "← ",
      p("back")
    ] }),
    /* @__PURE__ */ s($t, { ctx: q, group: a, index: v })
  ] }) : /* @__PURE__ */ s("div", { className: "aq", children: /* @__PURE__ */ s(Tt, { ctx: q, group: a, onOpen: m }) });
}
function _({
  label: e,
  children: t,
  hint: i
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the control is the child
    /* @__PURE__ */ h("label", { className: "aq-field", children: [
      /* @__PURE__ */ s("span", { className: "field-label", children: e }),
      t,
      i
    ] })
  );
}
function H({
  ctx: e,
  label: t,
  node: i,
  multiline: n
}) {
  const a = E(e.project, i.key, e.lang), r = (o) => e.edit(() => {
  }, [{ key: i.key, lang: e.lang, value: o }]);
  return /* @__PURE__ */ s(_, { label: `${t} · ${e.lang}`, children: /* @__PURE__ */ s(be, { value: a, onChange: r, multiline: n, "aria-label": t }) });
}
function At(e) {
  return typeof e == "number" ? String(e) : typeof e == "string" ? e : "";
}
function R({
  label: e,
  value: t,
  onChange: i,
  placeholder: n
}) {
  return /* @__PURE__ */ s(_, { label: e, children: /* @__PURE__ */ s(
    "input",
    {
      className: "input",
      type: "number",
      min: 0,
      step: 1,
      value: At(t),
      placeholder: n,
      onChange: (a) => {
        const r = a.target.value.trim();
        i(r === "" ? void 0 : Math.max(0, Math.trunc(Number(r))));
      }
    }
  ) });
}
function Ct(e) {
  const t = typeof e.strategy == "string" ? e.strategy.toLowerCase() : "";
  return t !== "" && t !== "none";
}
function x(e, t, i) {
  i === void 0 || i === "" ? delete e[t] : e[t] = i;
}
function ce(e, t, i) {
  if (i < 0 || i >= e.length) return;
  const [n] = e.splice(t, 1);
  e.splice(i, 0, n);
}
function L({
  label: e,
  onClick: t,
  disabled: i,
  children: n
}) {
  return /* @__PURE__ */ s(
    "button",
    {
      type: "button",
      className: "aq-icon-btn",
      title: e,
      "aria-label": e,
      onClick: t,
      disabled: i,
      children: n
    }
  );
}
function Te(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((i, n) => {
    const a = t.has(i) ? `${i}#${n}` : i;
    return t.add(i), a;
  });
}
function Tt({
  ctx: e,
  group: t,
  onOpen: i
}) {
  const { t: n, edit: a, project: r, lang: o } = e, p = Qe(), d = typeof t.reset.cron == "string" ? t.reset.cron : "", l = d ? Ze(d, p) : null, m = typeof t.reset.timezone == "string" ? t.reset.timezone : "", y = d && de(d) ? wt(d, p) : null, q = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], v = t.distribution.tiers ?? {}, c = Object.keys(t.rest).filter((u) => u !== "actions"), g = () => {
    const u = $(), b = V();
    a(
      (f) => {
        f.quests.push({
          key: z(
            "quest",
            f.quests.map((k) => k.key)
          ),
          uid: b,
          tier: "",
          title: { key: u },
          description: { key: $() },
          duration: "",
          stages: [Re(1)],
          rest: {}
        });
      },
      [{ key: u, lang: o, value: n("newQuestTitle") }]
    ), i(b);
  };
  return /* @__PURE__ */ h(U, { children: [
    /* @__PURE__ */ h("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("group") }),
      /* @__PURE__ */ s(H, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ s(H, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ s(_, { label: n("actorType"), children: /* @__PURE__ */ h(
        "select",
        {
          className: "select",
          value: t.actorType,
          onChange: (u) => a((b) => {
            b.actorType = u.target.value;
          }),
          children: [
            /* @__PURE__ */ s("option", { value: "player", children: n("actor.player") }),
            /* @__PURE__ */ s("option", { value: "global", children: n("actor.global") }),
            !["player", "global"].includes(t.actorType) && /* @__PURE__ */ s("option", { value: t.actorType, children: t.actorType })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ h("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("reset") }),
      /* @__PURE__ */ s(
        _,
        {
          label: n("cron"),
          hint: d ? de(d) ? /* @__PURE__ */ h("span", { className: "aq-ok", children: [
            l ?? n("cronRaw"),
            m && m !== jt ? `, ${m}` : y ? ` · ${n("nextRun", { when: y })}` : ""
          ] }) : /* @__PURE__ */ s("span", { className: "aq-err", children: n("cronInvalid") }) : /* @__PURE__ */ s("span", { className: "aq-hint", children: n("noReset") }),
          children: /* @__PURE__ */ s(
            "input",
            {
              className: "input",
              value: d,
              placeholder: "0 4 * * *",
              onChange: (u) => a((b) => x(b.reset, "cron", u.target.value))
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ h("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("distribution") }),
      /* @__PURE__ */ h("div", { className: "aq-row", children: [
        /* @__PURE__ */ s(_, { label: n("strategy"), children: /* @__PURE__ */ h(
          "select",
          {
            className: "select",
            value: typeof t.distribution.strategy == "string" ? t.distribution.strategy.toLowerCase() : "",
            onChange: (u) => a((b) => x(b.distribution, "strategy", u.target.value)),
            children: [
              /* @__PURE__ */ s("option", { value: "", children: "—" }),
              ["none", "sequential", "random"].map((u) => /* @__PURE__ */ s("option", { value: u, children: n(`strategy.${u}`) }, u))
            ]
          }
        ) }),
        /* @__PURE__ */ s(
          R,
          {
            label: n("amount"),
            value: t.distribution.amount,
            onChange: (u) => a((b) => x(b.distribution, "amount", u))
          }
        )
      ] }),
      /* @__PURE__ */ s("span", { className: "field-label", children: n("triggers") }),
      Nt.map((u) => /* @__PURE__ */ h("label", { className: "aq-check", children: [
        /* @__PURE__ */ s(
          "input",
          {
            type: "checkbox",
            checked: q.includes(u),
            onChange: (b) => a((f) => {
              const k = Array.isArray(f.distribution.triggers) ? f.distribution.triggers : [], N = b.target.checked ? [...k, u] : k.filter((I) => I !== u);
              x(f.distribution, "triggers", N.length ? N : void 0);
            })
          }
        ),
        n(`trigger.${u}`)
      ] }, u)),
      t.tiers.length > 0 && /* @__PURE__ */ h(U, { children: [
        /* @__PURE__ */ s("span", { className: "field-label", children: n("perTier") }),
        /* @__PURE__ */ s("div", { className: "aq-row", children: t.tiers.map((u) => /* @__PURE__ */ s(
          R,
          {
            label: E(r, u.title.key, o) || u.key,
            value: v[u.key],
            onChange: (b) => a((f) => {
              const k = { ...f.distribution.tiers ?? {} };
              x(k, u.key, b), x(
                f.distribution,
                "tiers",
                Object.keys(k).length ? k : void 0
              );
            })
          },
          u.key
        )) })
      ] })
    ] }),
    /* @__PURE__ */ h("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("limits") }),
      /* @__PURE__ */ h("div", { className: "aq-row", children: [
        /* @__PURE__ */ s(
          R,
          {
            label: n("maxActive"),
            value: t.limits.max_active,
            onChange: (u) => a((b) => x(b.limits, "max_active", u))
          }
        ),
        /* @__PURE__ */ s(
          R,
          {
            label: n("questsPerPeriod"),
            placeholder: n("noLimit"),
            value: t.limits.max_per_period,
            onChange: (u) => a((b) => x(b.limits, "max_per_period", u))
          }
        )
      ] }),
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("rotation") }),
      /* @__PURE__ */ h("div", { className: "aq-row", children: [
        /* @__PURE__ */ h("label", { className: "aq-check", children: [
          /* @__PURE__ */ s(
            "input",
            {
              type: "checkbox",
              checked: t.rotation.enabled === !0,
              onChange: (u) => a((b) => x(b.rotation, "enabled", u.target.checked ? !0 : void 0))
            }
          ),
          n("rotationEnabled")
        ] }),
        t.rotation.enabled === !0 ? /* @__PURE__ */ s(
          R,
          {
            label: n("rotationsPerPeriod"),
            placeholder: n("noLimit"),
            value: t.rotation.max_per_period,
            onChange: (u) => a((b) => x(b.rotation, "max_per_period", u))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ h("section", { className: "aq-section", children: [
      /* @__PURE__ */ h("div", { className: "aq-head", children: [
        /* @__PURE__ */ s("span", { className: "aq-h", children: n("tiers") }),
        /* @__PURE__ */ h(
          K,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => a((u) => {
              u.tiers.push({
                key: z(
                  "tier",
                  u.tiers.map((b) => b.key)
                ),
                title: { key: $() },
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
      t.tiers.map((u, b) => /* @__PURE__ */ h("div", { className: "aq-row", children: [
        /* @__PURE__ */ s(_, { label: n("tierKey"), children: /* @__PURE__ */ s(
          "input",
          {
            className: "input",
            defaultValue: u.key,
            onBlur: (f) => {
              const k = Z(f.target.value);
              k !== u.key && a((N) => {
                const I = z(
                  k,
                  N.tiers.map((Q) => Q.key)
                );
                N.tiers[b].key = I;
                for (const Q of N.quests) Q.tier === u.key && (Q.tier = I);
                const P = N.distribution.tiers;
                P && u.key in P && (P[I] = P[u.key], delete P[u.key]);
              });
            }
          }
        ) }),
        /* @__PURE__ */ s(H, { ctx: e, label: n("title"), node: u.title }),
        /* @__PURE__ */ s(
          L,
          {
            label: n("remove"),
            onClick: () => a((f) => {
              f.tiers.splice(b, 1);
            }),
            children: "×"
          }
        )
      ] }, u.key))
    ] }),
    /* @__PURE__ */ h("section", { className: "aq-section", children: [
      /* @__PURE__ */ h("div", { className: "aq-head", children: [
        /* @__PURE__ */ h("span", { className: "aq-h", children: [
          n("quests"),
          " · ",
          t.quests.length
        ] }),
        /* @__PURE__ */ h(K, { size: "sm", variant: "primary", onClick: g, children: [
          "+ ",
          n("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ s("span", { className: "aq-hint", children: n("noQuests") }),
      /* @__PURE__ */ s(
        ie,
        {
          ids: t.quests.map((u) => u.uid),
          onMove: (u, b) => a((f) => ce(f.quests, u, b)),
          className: "aq-list",
          itemClassName: "aq-item",
          children: (u, b) => {
            const f = t.quests[u];
            return /* @__PURE__ */ h(U, { children: [
              b,
              /* @__PURE__ */ h(
                "button",
                {
                  type: "button",
                  className: "aq-item-main",
                  onClick: () => i(f.uid),
                  title: n("open"),
                  children: [
                    /* @__PURE__ */ s("span", { className: "aq-item-title", children: E(r, f.title.key, o) || f.key }),
                    /* @__PURE__ */ h("span", { className: "aq-item-sub", children: [
                      n("questSummary", {
                        stages: f.stages.length,
                        objectives: f.stages.reduce((k, N) => k + N.objectives.length, 0)
                      }),
                      " · ",
                      f.key,
                      f.tier ? ` · ${f.tier}` : "",
                      f.duration ? ` · ${f.duration}` : ""
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ s(
                L,
                {
                  label: n("remove"),
                  onClick: () => a((k) => {
                    k.quests.splice(u, 1);
                  }),
                  children: "×"
                }
              )
            ] });
          }
        }
      ),
      c.length > 0 && /* @__PURE__ */ s("span", { className: "aq-hint", children: n("kept", { fields: c.join(", ") }) })
    ] }),
    /* @__PURE__ */ s(Rt, { ctx: e, group: t })
  ] });
}
function St({
  ctx: e,
  value: t,
  onChange: i
}) {
  const { chain: n, legacy: a } = ct(t);
  return /* @__PURE__ */ h("div", { className: "aq-chain", children: [
    /* @__PURE__ */ s(
      Ue,
      {
        projectId: e.projectId,
        value: n,
        onChange: (r) => i(me(r, a))
      }
    ),
    a.length > 0 && /* @__PURE__ */ h("div", { className: "aq-legacy", children: [
      /* @__PURE__ */ s("span", { className: "aq-hint", children: e.t("legacySteps") }),
      a.map((r, o) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
        /* @__PURE__ */ h("div", { className: "aq-legacy-row", children: [
          /* @__PURE__ */ s("code", { children: dt(r) }),
          /* @__PURE__ */ s(
            L,
            {
              label: e.t("remove"),
              onClick: () => i(me(n, a.filter((p, d) => d !== o))),
              children: "×"
            }
          )
        ] }, o)
      ))
    ] })
  ] });
}
function Se({
  ctx: e,
  title: t,
  hint: i,
  hooks: n,
  label: a,
  value: r,
  onChange: o,
  footer: p
}) {
  const { t: d } = e, l = j(r), [m, y] = ae([]), q = n.filter((c) => l[c] != null || m.includes(c)), v = n.filter((c) => !q.includes(c));
  return /* @__PURE__ */ h("section", { className: "aq-section", children: [
    /* @__PURE__ */ s("span", { className: "aq-h", children: t }),
    /* @__PURE__ */ s("span", { className: "aq-hint", children: i }),
    q.map((c) => /* @__PURE__ */ h("div", { className: "aq-event", children: [
      /* @__PURE__ */ h("div", { className: "aq-head", children: [
        /* @__PURE__ */ s("span", { className: "aq-event-name", children: a(c) }),
        /* @__PURE__ */ s(
          L,
          {
            label: d("removeEvent"),
            onClick: () => {
              y((g) => g.filter((u) => u !== c)), o(c, void 0);
            },
            children: "×"
          }
        )
      ] }),
      /* @__PURE__ */ s(St, { ctx: e, value: l[c], onChange: (g) => o(c, g) })
    ] }, c)),
    v.length > 0 && /* @__PURE__ */ h(
      "select",
      {
        className: "select aq-event-add",
        "aria-label": d("addEvent"),
        value: "",
        onChange: (c) => {
          const g = v.find((u) => u === c.target.value);
          g && y((u) => [...u, g]);
        },
        children: [
          /* @__PURE__ */ s("option", { value: "", children: d("addEvent") }),
          v.map((c) => /* @__PURE__ */ s("option", { value: c, children: a(c) }, c))
        ]
      }
    ),
    p
  ] });
}
function Rt({ ctx: e, group: t }) {
  const { t: i, edit: n } = e;
  return /* @__PURE__ */ s(
    Se,
    {
      ctx: e,
      title: i("hooks"),
      hint: i("hooksHint"),
      hooks: ut,
      label: (a) => i(`hook.${a}`),
      value: t.rest.actions,
      onChange: (a, r) => n((o) => {
        const p = { ...j(o.rest.actions) };
        x(p, a, r), x(o.rest, "actions", Object.keys(p).length ? p : void 0);
      })
    },
    t.uid
  );
}
function Re(e) {
  return {
    key: `stage_${e}`,
    title: { key: $() },
    flow: "parallel",
    objectives: [],
    rest: {}
  };
}
function $t({ ctx: e, group: t, index: i }) {
  const { t: n, edit: a } = e, r = t.quests[i], o = (c, g) => a((u) => c(u.quests[i]), g), p = t.quests.some((c, g) => g !== i && c.key === r.key), d = r.duration !== "" && !_t.test(r.duration.replace(/\s/g, "").toLowerCase()), l = Object.keys(r.rest).filter((c) => c !== "actions" && c !== "giver"), m = r.rest.giver && typeof r.rest.giver == "object" ? r.rest.giver : {}, y = (c, g) => o((u) => {
    const b = { ...m };
    x(b, c, g.trim()), typeof b.npc == "string" && b.npc !== "" ? u.rest.giver = b : delete u.rest.giver;
  }), q = typeof m.npc == "string" && m.npc !== "", v = Ct(t.distribution);
  return /* @__PURE__ */ h(U, { children: [
    /* @__PURE__ */ h("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("general") }),
      /* @__PURE__ */ s(H, { ctx: e, label: n("title"), node: r.title }),
      /* @__PURE__ */ s(H, { ctx: e, label: n("description"), node: r.description, multiline: !0 }),
      /* @__PURE__ */ h("div", { className: "aq-row aq-top", children: [
        /* @__PURE__ */ s(_, { label: n("tier"), children: /* @__PURE__ */ h(
          "select",
          {
            className: "select",
            value: r.tier,
            onChange: (c) => o((g) => {
              g.tier = c.target.value;
            }),
            children: [
              /* @__PURE__ */ s("option", { value: "", children: n("noTier") }),
              t.tiers.map((c) => /* @__PURE__ */ s("option", { value: c.key, children: E(e.project, c.title.key, e.lang) || c.key }, c.key)),
              r.tier && !t.tiers.some((c) => c.key === r.tier) && /* @__PURE__ */ s("option", { value: r.tier, children: r.tier })
            ]
          }
        ) }),
        /* @__PURE__ */ s(
          _,
          {
            label: n("duration"),
            hint: /* @__PURE__ */ s("span", { className: d ? "aq-err" : "aq-hint", children: n(d ? "durationInvalid" : "durationHint") }),
            children: /* @__PURE__ */ s(
              "input",
              {
                className: "input",
                value: r.duration,
                placeholder: "24h",
                onChange: (c) => o((g) => {
                  g.duration = c.target.value.trim();
                })
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ h("div", { className: "aq-row aq-top", children: [
        /* @__PURE__ */ s(_, { label: n("giverNpc"), hint: /* @__PURE__ */ s("span", { className: "aq-hint", children: n("giverNpcHint") }), children: /* @__PURE__ */ s(
          "input",
          {
            className: "input aq-mono",
            value: typeof m.npc == "string" ? m.npc : "",
            onChange: (c) => y("npc", c.target.value)
          }
        ) }),
        q && /* @__PURE__ */ s(_, { label: n("giverConversation"), children: /* @__PURE__ */ s(
          "input",
          {
            className: "input aq-mono",
            value: typeof m.conversation == "string" ? m.conversation : "",
            onChange: (c) => y("conversation", c.target.value)
          }
        ) })
      ] }),
      q && v && /* @__PURE__ */ s("span", { className: "aq-warn", children: n("giverDistributed") }),
      /* @__PURE__ */ h("details", { className: "aq-fold", open: p || void 0, children: [
        /* @__PURE__ */ s("summary", { children: n("more") }),
        /* @__PURE__ */ s(
          _,
          {
            label: n("key"),
            hint: /* @__PURE__ */ s("span", { className: p ? "aq-err" : "aq-hint", children: n(p ? "keyTaken" : "questKeyHint") }),
            children: /* @__PURE__ */ s(
              "input",
              {
                className: "input aq-mono",
                value: r.key,
                onChange: (c) => o((g) => {
                  g.key = xe(c.target.value);
                }),
                onBlur: () => {
                  const c = Z(r.key);
                  c !== r.key && o((g) => {
                    g.key = c;
                  });
                }
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ h("section", { className: "aq-section", children: [
      /* @__PURE__ */ h("div", { className: "aq-head", children: [
        /* @__PURE__ */ h("span", { className: "aq-h", children: [
          n("stages"),
          " · ",
          r.stages.length
        ] }),
        /* @__PURE__ */ h(
          K,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => o((c) => {
              const g = z(
                `stage_${c.stages.length + 1}`,
                c.stages.map((u) => u.key)
              );
              c.stages.push({ ...Re(c.stages.length + 1), key: g });
            }),
            children: [
              "+ ",
              n("addStage")
            ]
          }
        )
      ] }),
      /* @__PURE__ */ s(
        ie,
        {
          ids: Te(r.stages.map((c) => c.key)),
          onMove: (c, g) => o((u) => ce(u.stages, c, g)),
          className: "aq-stages",
          children: (c, g) => /* @__PURE__ */ s(
            Lt,
            {
              ctx: e,
              quest: r,
              stage: r.stages[c],
              si: c,
              handle: g,
              editQuest: o
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ s(
      Se,
      {
        ctx: e,
        title: n("questEvents"),
        hint: n("questEventsHint"),
        hooks: pt,
        label: (c) => n(`questHook.${c}`),
        value: r.rest.actions,
        onChange: (c, g) => o((u) => {
          const b = { ...j(u.rest.actions) };
          x(b, c, g), x(u.rest, "actions", Object.keys(b).length > 0 ? b : void 0);
        }),
        footer: l.length > 0 && /* @__PURE__ */ s("span", { className: "aq-hint", children: n("kept", { fields: l.join(", ") }) })
      },
      r.uid
    ),
    /* @__PURE__ */ h("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("preview") }),
      /* @__PURE__ */ s(Mt, { ctx: e, quest: r })
    ] })
  ] });
}
function Lt({
  ctx: e,
  quest: t,
  stage: i,
  si: n,
  handle: a,
  editQuest: r
}) {
  const { t: o } = e, [p, d] = ae(null), l = (v) => r((c) => v(c.stages[n])), m = E(e.project, i.title.key, e.lang), y = i.flow || "parallel", q = t.stages.flatMap((v) => v.objectives.map((c) => c.key));
  return /* @__PURE__ */ h("div", { className: "aq-stage", children: [
    /* @__PURE__ */ h("div", { className: "aq-stage-head", children: [
      a,
      /* @__PURE__ */ s("span", { className: "aq-stage-n", children: n + 1 }),
      /* @__PURE__ */ s("div", { className: "aq-stage-title", children: /* @__PURE__ */ s(
        be,
        {
          value: m,
          placeholder: o("stageTitle"),
          "aria-label": o("stage", { n: n + 1 }),
          onChange: (v) => e.edit(() => {
          }, [{ key: i.title.key, lang: e.lang, value: v }])
        }
      ) }),
      /* @__PURE__ */ s(
        L,
        {
          label: o("remove"),
          onClick: () => r((v) => {
            v.stages.splice(n, 1);
          }),
          children: "×"
        }
      )
    ] }),
    i.objectives.length > 1 && /* @__PURE__ */ s("div", { className: "aq-seg", role: "radiogroup", "aria-label": o("flow"), children: ["parallel", "sequential"].map((v) => /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": y === v,
        className: `chip${y === v ? " is-active" : ""}`,
        onClick: () => l((c) => {
          c.flow = v;
        }),
        children: o(`flow.${v}`)
      },
      v
    )) }),
    i.objectives.length === 0 && /* @__PURE__ */ s("span", { className: "aq-hint", children: o("noObjectives") }),
    /* @__PURE__ */ s(
      ie,
      {
        ids: Te(i.objectives.map((v) => v.key)),
        onMove: (v, c) => l((g) => ce(g.objectives, v, c)),
        className: "aq-objectives",
        children: (v, c) => {
          const g = i.objectives[v];
          return /* @__PURE__ */ s(
            Ot,
            {
              t: o,
              projectId: e.projectId,
              n: y === "sequential" ? `${n + 1}.${v + 1}` : "•",
              objective: g,
              open: p === g.key,
              onToggle: () => d(p === g.key ? null : g.key),
              keyTaken: q.filter((u) => u === g.key).length > 1,
              handle: c,
              onChange: (u) => l((b) => u(b.objectives[v])),
              onRename: (u) => {
                p === g.key && d(u);
              },
              onRemove: () => l((u) => {
                u.objectives.splice(v, 1);
              })
            }
          );
        }
      }
    ),
    /* @__PURE__ */ h(
      K,
      {
        size: "sm",
        variant: "ghost",
        className: "aq-add",
        onClick: () => {
          const v = nt("block_break", q);
          r((c) => {
            c.stages[n].objectives.push({
              key: v,
              type: "block_break",
              params: je("block_break")
            });
          }), d(v);
        },
        children: [
          "+ ",
          o("addObjective")
        ]
      }
    )
  ] });
}
function Ot({
  t: e,
  projectId: t,
  n: i,
  objective: n,
  open: a,
  onToggle: r,
  keyTaken: o,
  handle: p,
  onChange: d,
  onRename: l,
  onRemove: m
}) {
  const y = O(n.type), q = y ? y.params : Object.keys(n.params).map((f) => ({ name: f, kind: "text" })), v = oe(n.params), c = Ee(n.type, n.params), g = ht(n.type, n.params), u = o || g.length > 0, b = (f) => f.kind === "item" ? /* @__PURE__ */ s(
    It,
    {
      t: e,
      projectId: t,
      spec: f,
      params: n.params,
      onChange: (k) => d((N) => k(N.params))
    },
    f.name
  ) : /* @__PURE__ */ s(
    Pt,
    {
      t: e,
      spec: f,
      value: n.params[f.name],
      onChange: (k) => d((N) => x(N.params, f.name, k))
    },
    f.name
  );
  return /* @__PURE__ */ h("div", { className: `aq-obj${a ? " is-open" : ""}${u ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ h("div", { className: "aq-obj-line", children: [
      p,
      /* @__PURE__ */ h("button", { type: "button", className: "aq-obj-main", onClick: r, "aria-expanded": a, children: [
        /* @__PURE__ */ s("span", { className: "aq-obj-n", children: i }),
        /* @__PURE__ */ s("span", { className: "aq-obj-icon", "aria-hidden": !0, children: y?.icon ?? "?" }),
        /* @__PURE__ */ h("span", { className: "aq-obj-text", children: [
          Ae(e, n.type),
          v !== void 0 && /* @__PURE__ */ h("strong", { children: [
            " · ",
            String(v)
          ] }),
          c ? ` × ${c}` : v !== void 0 ? ` × ${e("any")}` : ""
        ] }),
        u && /* @__PURE__ */ s(
          "span",
          {
            className: "aq-obj-dot",
            title: o ? e("objectiveKeyTaken") : e("missing", {
              fields: g.map((f) => e(`param.${f}`)).join(", ")
            })
          }
        )
      ] }),
      /* @__PURE__ */ s(L, { label: e("remove"), onClick: m, children: "×" })
    ] }),
    a && /* @__PURE__ */ h("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ s(_, { label: e("type"), children: /* @__PURE__ */ h(
        "select",
        {
          className: "select",
          value: n.type,
          onChange: (f) => d((k) => {
            k.type = f.target.value, k.params = je(k.type);
          }),
          children: [
            Ne.map((f) => /* @__PURE__ */ h("option", { value: f.type, children: [
              f.icon,
              " ",
              e(`objective.${f.type}`)
            ] }, f.type)),
            !y && /* @__PURE__ */ s("option", { value: n.type, children: n.type })
          ]
        }
      ) }),
      /* @__PURE__ */ s("div", { className: "aq-row aq-wrap", children: q.filter((f) => !f.advanced).map(b) }),
      g.length > 0 && /* @__PURE__ */ s("span", { className: "aq-warn", children: e("missing", {
        fields: g.map((f) => e(`param.${f}`)).join(", ")
      }) }),
      /* @__PURE__ */ h("details", { className: "aq-fold", open: o || void 0, children: [
        /* @__PURE__ */ s("summary", { children: e("more") }),
        q.filter((f) => f.advanced).map(b),
        /* @__PURE__ */ s(
          _,
          {
            label: e("key"),
            hint: /* @__PURE__ */ s("span", { className: o ? "aq-err" : "aq-hint", children: e(o ? "objectiveKeyTaken" : "objectiveKeyHint") }),
            children: /* @__PURE__ */ s(
              "input",
              {
                className: "input aq-mono",
                value: n.key,
                onChange: (f) => {
                  const k = xe(f.target.value);
                  d((N) => {
                    N.key = k;
                  }), l(k);
                },
                onBlur: () => {
                  const f = Z(n.key);
                  f !== n.key && (d((k) => {
                    k.key = f;
                  }), l(f));
                }
              }
            )
          }
        )
      ] })
    ] })
  ] });
}
function It({
  t: e,
  projectId: t,
  spec: i,
  params: n,
  onChange: a
}) {
  const r = le(n, i), o = Array.isArray(n.match) ? n.match : void 0, p = (d, l) => a((m) => mt(m, i, d, l));
  return /* @__PURE__ */ s(
    _,
    {
      label: e(`param.${i.name}`),
      hint: Object.keys(r).length === 0 ? /* @__PURE__ */ s("span", { className: "aq-hint", children: e("anyItem") }) : void 0,
      children: /* @__PURE__ */ s(
        ze,
        {
          projectId: t,
          value: r,
          match: o,
          onChange: (d) => p(d, o),
          onMatchChange: (d) => p(r, d)
        }
      )
    }
  );
}
function Pt({
  t: e,
  spec: t,
  value: i,
  onChange: n
}) {
  const a = e(`param.${t.name}`), r = t.required && (i === void 0 || i === ""), o = typeof i == "string" || typeof i == "number" ? String(i) : "";
  if (t.kind === "int")
    return /* @__PURE__ */ s(R, { label: a, value: i, onChange: n });
  const p = r ? /* @__PURE__ */ s("span", { className: "aq-warn", children: e("required") }) : t.name === "itemKey" ? /* @__PURE__ */ s("span", { className: "aq-hint", children: e("itemKeyHint") }) : void 0;
  if (t.kind === "material")
    return /* @__PURE__ */ s(_, { label: a, hint: p, children: /* @__PURE__ */ s(
      Fe,
      {
        value: o,
        placeholder: e("any"),
        "aria-label": a,
        onChange: (l) => n(l.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const d = t.kind === "entity";
  return /* @__PURE__ */ h(_, { label: a, hint: p, children: [
    /* @__PURE__ */ s(
      "input",
      {
        className: `input${d ? " aq-mono" : ""}`,
        list: d ? "aq-entities" : void 0,
        value: o,
        placeholder: d ? e("any") : "",
        onChange: (l) => n(d ? l.target.value.toUpperCase().replace(/\s+/g, "_") : l.target.value)
      }
    ),
    d && /* @__PURE__ */ s("datalist", { id: "aq-entities", children: ft.map((l) => /* @__PURE__ */ s("option", { value: l }, l)) })
  ] });
}
function Mt({ ctx: e, quest: t }) {
  const { t: i, project: n, lang: a } = e, r = (o) => W(i, o);
  return /* @__PURE__ */ h("div", { className: "aq-preview", children: [
    /* @__PURE__ */ s("span", { className: "aq-preview-title", children: E(n, t.title.key, a) || t.key }),
    E(n, t.description.key, a) && /* @__PURE__ */ s("span", { className: "aq-preview-line", children: E(n, t.description.key, a) }),
    t.stages.map((o, p) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ h("span", { className: "aq-preview-stage", children: [
        t.stages.length > 1 && /* @__PURE__ */ s("span", { className: "aq-preview-line", children: E(n, o.title.key, a) || i("stage", { n: p + 1 }) }),
        o.objectives.map((d) => /* @__PURE__ */ h("span", { className: "aq-preview-line", children: [
          "• ",
          r(d)
        ] }, d.key))
      ] }, p)
    ))
  ] });
}
function Dt({ className: e }) {
  return /* @__PURE__ */ h(
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
        /* @__PURE__ */ s("path", { d: "M15 12h-5" }),
        /* @__PURE__ */ s("path", { d: "M15 8h-5" }),
        /* @__PURE__ */ s("path", { d: "M19 17V5a2 2 0 0 0-2-2H4" }),
        /* @__PURE__ */ s("path", { d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" })
      ]
    }
  );
}
const Ht = {
  kind: re,
  dir: ke,
  schemaVersion: se,
  // Created in the module's folder only (SDK 1.8); a group already elsewhere still loads.
  projects: [tt],
  // Data with no links: one "Quests" entry and page instead of a node per group (SDK 1.9).
  collection: { labels: Xe },
  // A group's id is its key on the server (`quest_group_key`): typed by hand, no prefix.
  label: ue.en,
  labels: ue,
  icon: Dt,
  component: Et,
  title: (e, { project: t, lang: i }) => E(t, e.title.key, i),
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
  parse: (e, t) => it(e, t),
  serialize: (e, t) => ot(e, t),
  ltextSites: (e) => lt(e),
  board: {
    size: { width: 300, height: 48 },
    accent: yt,
    // The group's quests, one selectable row each: the Properties panel opens the one clicked.
    items: (e, { project: t, lang: i }) => vt(e, t, i),
    summary: (e, { lang: t }) => kt(e, t)
  }
}, he = "msquests:groups", fe = "msquests:quests", Kt = "msquests:active", ye = {
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
}, ge = { en: "Available", fr: "Disponible" };
function Gt(e, t, i) {
  if (t !== he && t !== fe && t !== Kt) return null;
  const n = e.documents?.[re];
  if (!n || n.length === 0) return null;
  const a = e.defaultLang ?? "en", r = i?.serverRows, o = i?.params?.group || void 0, p = [...n].sort((l, m) => l.id < m.id ? -1 : l.id > m.id ? 1 : 0);
  if (t === he) {
    const l = te(r, "key");
    return p.map((m) => Qt(m, l.get(m.id), a));
  }
  if (t === fe) {
    const l = te(r, "id");
    return p.filter((m) => !o || m.id === o).flatMap((m) => m.quests.map((y) => $e(m, y, l.get(`${m.id}:${y.key}`), a)));
  }
  if (!r) return null;
  const d = new Map(n.map((l) => [l.id, l]));
  return r.flatMap((l) => {
    const m = d.get(A(l.group));
    if (!m) return [l];
    const y = m.quests.find((q) => q.key === A(l.quest_key));
    return y ? [Bt(y, l, a)] : [];
  });
}
function Qt(e, t, i) {
  const n = te(B(t?.quests), "key");
  return {
    key: e.id,
    name: e.title,
    description: e.description,
    actor_type: e.actorType,
    max_active: ne(e.limits.max_active, 1),
    max_per_period: ne(e.limits.max_per_period, 0),
    rotatable: e.rotation.enabled === !0,
    // The period follows the server's clock and zone: its value stands until a deploy.
    period_end: t?.period_end ?? 0,
    active_count: t?.active_count ?? 0,
    completed_count: t?.completed_count ?? 0,
    can_rotate: t?.can_rotate ?? !1,
    quests: e.quests.map((a) => $e(e, a, n.get(a.key), i))
  };
}
function $e(e, t, i, n) {
  const a = e.tiers.find((r) => r.key === t.tier);
  return {
    id: `${e.id}:${t.key}`,
    group: e.id,
    key: t.key,
    name: t.title,
    description: t.description,
    duration: Zt(t.duration),
    tier: t.tier,
    tier_name: a ? a.title : "",
    assigned: i?.assigned ?? !1,
    status_key: i?.status_key ?? "NOT_STARTED",
    status: i?.status ?? ge[n.slice(0, 2)] ?? ge.en,
    can_start: i?.can_start ?? !1,
    start_blocker: i?.start_blocker ?? "",
    start_blocker_label: i?.start_blocker_label ?? "",
    // `reference` in `QuestRows.questRow`: the attempt the server holds for this player.
    ...Le(t, i?.assigned === !0 ? i : void 0, n)
  };
}
function Le(e, t, i) {
  const n = t ? Ut(t) : void 0, a = zt(e, n, i), r = a.find((p) => p.active === !0), o = r ? r.objectives.find((p) => p.done !== !0) : void 0;
  return {
    objective_name: o?.name ?? "",
    objective_progress: o?.progress ?? 0,
    objective_target: o?.target ?? 0,
    progress_ratio: n ? Oe(a.map((p) => p.progress_ratio)) : 0,
    stage_index: a.filter((p) => p.completed === !0).length,
    stage_name: r?.name ?? "",
    stage_flow: r?.flow ?? "",
    stages: a.map((p) => ({ ...p, objectives: p.objectives.map(({ done: d, ...l }) => l) }))
  };
}
function Ut(e) {
  const t = /* @__PURE__ */ new Map(), i = [
    ...B(e.objectives),
    ...B(e.stages).flatMap((n) => B(n.objectives))
  ];
  for (const n of i) {
    const a = A(n.status_key);
    t.set(A(n.key), {
      progress: ne(n.progress, 0),
      flag: a === "COMPLETED" || a === "FAILED" ? a : "",
      row: n
    });
  }
  return t;
}
function zt(e, t, i) {
  const n = e.stages.map((r, o) => {
    const p = r.objectives.map((d) => Ft(d, t?.get(d.key), i));
    return {
      key: r.key,
      name: r.title,
      flow: Jt(r),
      index: o,
      // `QuestStage.isCompleted`: all objectives done, so an empty stage is.
      completed: t !== void 0 && p.every((d) => d.done),
      active: !1,
      progress_ratio: t ? Oe(p.map((d) => d.progress_ratio)) : 0,
      objectives: p
    };
  });
  if (!t) return n;
  const a = n.find((r) => r.completed !== !0);
  if (a) {
    a.active = !0;
    const r = a.objectives, o = r.find((p) => p.done !== !0);
    for (const p of r)
      p.status_key === "PENDING" && (a.flow !== "SEQUENTIAL" || p === o) && (p.status_key = "IN_PROGRESS");
  }
  return n;
}
function Ft(e, t, i) {
  const n = Wt(e), a = t?.progress ?? 0, r = t?.row, o = r && r.type === e.type && r.target === n;
  return {
    key: e.key,
    name: o && typeof r.name == "string" ? r.name : Vt(e, i),
    type: e.type,
    progress: a,
    target: n,
    // `AbstractQuestObjective`: done once the progress reaches the target, whatever the
    // stored flag says; the ratio is clamped, so a lowered target reads 1, not 1.4.
    progress_ratio: t ? n <= 0 ? 1 : Math.min(Math.max(a / n, 0), 1) : 0,
    completed: t !== void 0 && a >= n,
    status_key: t?.flag || "PENDING",
    done: t !== void 0 && a >= n
  };
}
function Bt(e, t, i) {
  const n = Le(e, t, i), a = n.stages;
  return {
    ...t,
    name: e.title,
    description: e.description,
    stage_index: n.stage_index,
    stage_count: e.stages.length,
    stage_name: n.stage_name,
    stage_flow: n.stage_flow,
    progress_ratio: n.progress_ratio,
    objectives: a.flatMap((r) => r.objectives),
    stages: a
  };
}
function Vt(e, t) {
  const n = (ye[t.slice(0, 2)] ?? ye.en)[e.type];
  if (!n) return e.type;
  const a = e.params, r = {
    amount: String(a.amount ?? ""),
    distance: String(a.distance ?? ""),
    command: A(a.command),
    value: A(a.value),
    // Bukkit's translation keys, as the objective configs write them (`<lang:…>`).
    crop: F("block", a.crop),
    entity_type: F("entity", a.entity_type),
    material: e.type === "block_break" ? F("block", a.material) : ve(e),
    fish_type: ve(e)
  };
  return n.replace(/%([a-z_]+)%/g, (o, p) => r[p] ?? "");
}
function F(e, t) {
  const i = A(t).toLowerCase().replace(/^minecraft:/, "");
  return i === "" ? "" : `<lang:${e}.minecraft.${i}>`;
}
function ve(e) {
  const t = O(e.type)?.params.find((r) => r.kind === "item");
  if (!t) return "";
  const i = le(e.params, t), n = i.title;
  if (typeof n == "string" && n.trim() !== "") return n;
  const a = A(i.material);
  return /^(minecraft:)?[a-z_0-9]+$/i.test(a) && !a.includes(":") ? F("item", a) : a || we(i);
}
function Wt(e) {
  const t = oe(e.params);
  if (t === void 0) return 1;
  const i = Number(t);
  return Number.isFinite(i) ? i : 1;
}
function Jt(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function Zt(e) {
  const t = e.trim().toLowerCase().replace(/ /g, "");
  if (t === "") return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const i = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!i) return 0;
  const [, n, a, r, o] = i;
  return Number(n ?? 0) * 86400 + Number(a ?? 0) * 3600 + Number(r ?? 0) * 60 + Number(o ?? 0);
}
function te(e, t) {
  return new Map((e ?? []).map((i) => [A(i[t]), i]));
}
function B(e) {
  return Array.isArray(e) ? e.filter((t) => t && typeof t == "object") : [];
}
function Oe(e) {
  return e.length === 0 ? 0 : e.reduce((t, i) => t + i, 0) / e.length;
}
function ne(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function A(e) {
  return typeof e == "string" ? e : "";
}
const Yt = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: Be,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  documents: [Ht],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: Gt
}, nn = { ...Yt, sdk: "1.10.0" };
export {
  nn as default
};
