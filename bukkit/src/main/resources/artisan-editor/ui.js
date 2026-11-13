import { createModuleI18n as Ie, fieldText as Pe, newTextKey as $, textValue as E, injectModuleStyles as Me, useProject as De, useContentLang as He, Button as K, selectDocumentItem as Ke, SortableList as ie, updateDocument as Ge, useUiLang as Qe, MiniMessageInput as be, ActionChainEditor as Ue, ItemInput as ze, MaterialInput as Fe, SDK_VERSION as Be } from "@artisan/editor-sdk";
import { jsxs as f, jsx as s, Fragment as U } from "react/jsx-runtime";
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
  const [a, r, o, u, c] = n;
  if (u !== "*") return null;
  const p = /^\*\/(\d+)$/;
  if (o === "*" && c === "*") {
    if (C(a, 0, 59) && C(r, 0, 23))
      return i ? `tous les jours à ${Y(t, +r, +a)}` : `every day at ${Y(t, +r, +a)}`;
    const h = p.exec(r);
    if (C(a, 0, 59) && h)
      return i ? `toutes les ${h[1]} h, à la minute ${a}` : `every ${h[1]} hours, at minute ${a}`;
    if (C(a, 0, 59) && r === "*")
      return i ? `toutes les heures, à la minute ${a}` : `every hour, at minute ${a}`;
    const q = p.exec(a);
    return q && r === "*" ? i ? `toutes les ${q[1]} minutes` : `every ${q[1]} minutes` : null;
  }
  if (!C(a, 0, 59) || !C(r, 0, 23)) return null;
  const m = Y(t, +r, +a);
  if (o === "*" && C(c, 0, 7)) {
    const h = We[i ? "fr" : "en"][Number(c) % 7];
    return i ? `chaque ${h} à ${m}` : `every ${h} at ${m}`;
  }
  return c === "*" && C(o, 1, 31) ? i ? `le ${o === "1" ? "1er" : o} de chaque mois à ${m}` : `on day ${o} of each month at ${m}` : null;
}
function M(e, t, i) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e.split(",")) {
    const r = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(a);
    if (!r) return null;
    const o = r[4] ? Number(r[4]) : 1, u = r[1] === "*" ? t : Number(r[2]), c = r[1] === "*" ? i : r[3] ? Number(r[3]) : r[4] ? i : u;
    if (o < 1 || u < t || c > i || u > c) return null;
    for (let p = u; p <= c; p += o) n.add(p);
  }
  return n;
}
function Ye(e, t) {
  const i = e.trim().split(/\s+/);
  if (i.length !== 5) return null;
  const n = M(i[0], 0, 59), a = M(i[1], 0, 23), r = M(i[2], 1, 31), o = M(i[3], 1, 12), u = M(i[4], 0, 7);
  if (!n || !a || !r || !o || !u) return null;
  u.has(7) && u.add(0);
  const c = i[2] === "*", p = i[4] === "*", m = (g) => c && p ? !0 : c ? u.has(g.getDay()) : p ? r.has(g.getDate()) : r.has(g.getDate()) || u.has(g.getDay()), h = new Date(t.getTime());
  h.setSeconds(0, 0), h.setMinutes(h.getMinutes() + 1);
  const q = t.getTime() + 366 * 24 * 3600 * 1e3;
  for (; h.getTime() <= q; ) {
    if (!o.has(h.getMonth() + 1) || !m(h)) {
      h.setDate(h.getDate() + 1), h.setHours(0, 0, 0, 0);
      continue;
    }
    if (!a.has(h.getHours())) {
      h.setHours(h.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (n.has(h.getMinutes())) return h;
    h.setMinutes(h.getMinutes() + 1);
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
  function a(c) {
    if (c && typeof c == "object" && !Array.isArray(c)) {
      const h = $(), q = {};
      for (const [g, l] of Object.entries(c)) q[g] = w(l);
      return i[h] = q, { key: h };
    }
    const p = typeof c == "string" ? /^\{i18n:(.+)\}$/.exec(c) : null;
    if (p) {
      const h = t.translations?.[p[1]];
      return h && (i[p[1]] = { ...h }), { key: p[1] };
    }
    const m = $();
    return i[m] = c == null || c === "" ? {} : { [t.lang]: w(c) }, { key: m };
  }
  const r = Object.entries(j(e.tiers)).map(([c, p]) => {
    const m = j(p);
    return { key: c, title: a(m.title), rest: D(m, "title") };
  }), o = X(e.quests).map((c, p) => {
    const m = j(c), h = X(m.stages).map((q, g) => {
      const l = j(q), v = w(l.flow).toLowerCase();
      return {
        key: w(l.key) || `stage_${g + 1}`,
        title: a(l.title),
        flow: v === "parallel" || v === "sequential" ? v : "",
        objectives: X(l.objectives).map((d, b) => {
          const y = j(d);
          return {
            key: w(y.key) || `objective_${b + 1}`,
            type: w(y.type),
            params: D(y, "key", "type")
          };
        }),
        rest: D(l, "key", "title", "flow", "objectives")
      };
    });
    return {
      key: w(m.key) || `quest_${p + 1}`,
      uid: w(m.uid) || V(),
      tier: w(m.tier),
      title: a(m.title),
      description: a(m.description),
      duration: w(m.duration),
      stages: h,
      rest: at(m)
    };
  }), u = {
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
  return e.schema !== void 0 && e.schema !== se && n.push(`schema: ${String(e.schema)}`), { doc: u, i18nKeys: i, unsupported: n };
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
  const i = (p) => Pe(t, p.key), n = (p) => {
    const m = i(p);
    return rt(m) ? void 0 : m;
  }, a = {};
  for (const p of e.tiers) a[p.key] = { ...p.rest, title: i(p.title) };
  const r = e.quests.map(
    (p) => T({
      key: p.key,
      uid: p.uid,
      tier: p.tier,
      title: i(p.title),
      description: n(p.description),
      duration: p.duration,
      ...p.rest,
      stages: p.stages.map(
        (m) => T({
          key: m.key,
          title: n(m.title),
          flow: m.flow,
          ...m.rest,
          objectives: m.objectives.map((h) => ({ key: h.key, type: h.type, ...h.params }))
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
  }, u = {};
  for (const p of st) p in o && (u[p] = o[p]);
  for (const p of Object.keys(o)) p in u || (u[p] = o[p]);
  const c = T(u);
  return c.quests = r, c;
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
    const u = /* @__PURE__ */ new Set();
    for (let c = 0; c < a.stages.length; c++) {
      const p = a.stages[c], m = u.has(p.key) ? `${p.key}_${c}` : p.key;
      u.add(p.key), yield {
        lText: p.title,
        key: `${o}.stages.${m}.title`,
        path: `quests[${n}].stages[${c}].title`,
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
    const u = E(t, r.title.key, i);
    return {
      id: r.uid,
      label: Ce(u) || r.key,
      detail: r.tier || void 0,
      caption: bt(n, r),
      marker: a ? String(o + 1) : void 0,
      hover: {
        title: u || r.key,
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
    (r, o) => r.objectives.map((u) => {
      const c = W(e, u);
      return a ? `<gray>${Ce(E(i, r.title.key, n)) || e("stage", { n: o + 1 })} ·</gray> ${c}` : c;
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
  const a = i, r = De(e), o = He(), u = et(), [c, p] = ae(n ?? null);
  Ve(() => {
    p(n ?? null);
  }, [n]);
  const m = (l) => {
    p(l), Ke({ documentId: t, item: l });
  }, q = { projectId: e, project: r, lang: o, t: u, edit: (l, v) => {
    const d = structuredClone(a);
    l(d), Ge({ projectId: e, kind: re, id: t, doc: d, texts: v });
  } }, g = c ? a.quests.findIndex((l) => l.uid === c) : -1;
  return g >= 0 ? /* @__PURE__ */ f("div", { className: "aq", children: [
    /* @__PURE__ */ f(K, { variant: "ghost", size: "sm", className: "aq-back", onClick: () => m(null), children: [
      "← ",
      u("back")
    ] }),
    /* @__PURE__ */ s($t, { ctx: q, group: a, index: g })
  ] }) : /* @__PURE__ */ s("div", { className: "aq", children: /* @__PURE__ */ s(Tt, { ctx: q, group: a, onOpen: m }) });
}
function _({
  label: e,
  children: t,
  hint: i
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the control is the child
    /* @__PURE__ */ f("label", { className: "aq-field", children: [
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
  const { t: n, edit: a, project: r, lang: o } = e, u = Qe(), c = typeof t.reset.cron == "string" ? t.reset.cron : "", p = c ? Ze(c, u) : null, m = typeof t.reset.timezone == "string" ? t.reset.timezone : "", h = c && de(c) ? wt(c, u) : null, q = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], g = t.distribution.tiers ?? {}, l = Object.keys(t.rest).filter((d) => d !== "actions"), v = () => {
    const d = $(), b = V();
    a(
      (y) => {
        y.quests.push({
          key: z(
            "quest",
            y.quests.map((k) => k.key)
          ),
          uid: b,
          tier: "",
          title: { key: d },
          description: { key: $() },
          duration: "",
          stages: [Re(1)],
          rest: {}
        });
      },
      [{ key: d, lang: o, value: n("newQuestTitle") }]
    ), i(b);
  };
  return /* @__PURE__ */ f(U, { children: [
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("group") }),
      /* @__PURE__ */ s(H, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ s(H, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ s(_, { label: n("actorType"), children: /* @__PURE__ */ f(
        "select",
        {
          className: "select",
          value: t.actorType,
          onChange: (d) => a((b) => {
            b.actorType = d.target.value;
          }),
          children: [
            /* @__PURE__ */ s("option", { value: "player", children: n("actor.player") }),
            /* @__PURE__ */ s("option", { value: "global", children: n("actor.global") }),
            !["player", "global"].includes(t.actorType) && /* @__PURE__ */ s("option", { value: t.actorType, children: t.actorType })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("reset") }),
      /* @__PURE__ */ s(
        _,
        {
          label: n("cron"),
          hint: c ? de(c) ? /* @__PURE__ */ f("span", { className: "aq-ok", children: [
            p ?? n("cronRaw"),
            m && m !== jt ? `, ${m}` : h ? ` · ${n("nextRun", { when: h })}` : ""
          ] }) : /* @__PURE__ */ s("span", { className: "aq-err", children: n("cronInvalid") }) : /* @__PURE__ */ s("span", { className: "aq-hint", children: n("noReset") }),
          children: /* @__PURE__ */ s(
            "input",
            {
              className: "input",
              value: c,
              placeholder: "0 4 * * *",
              onChange: (d) => a((b) => x(b.reset, "cron", d.target.value))
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("distribution") }),
      /* @__PURE__ */ f("div", { className: "aq-row", children: [
        /* @__PURE__ */ s(_, { label: n("strategy"), children: /* @__PURE__ */ f(
          "select",
          {
            className: "select",
            value: typeof t.distribution.strategy == "string" ? t.distribution.strategy.toLowerCase() : "",
            onChange: (d) => a((b) => x(b.distribution, "strategy", d.target.value)),
            children: [
              /* @__PURE__ */ s("option", { value: "", children: "—" }),
              ["none", "sequential", "random"].map((d) => /* @__PURE__ */ s("option", { value: d, children: n(`strategy.${d}`) }, d))
            ]
          }
        ) }),
        /* @__PURE__ */ s(
          R,
          {
            label: n("amount"),
            value: t.distribution.amount,
            onChange: (d) => a((b) => x(b.distribution, "amount", d))
          }
        )
      ] }),
      /* @__PURE__ */ s("span", { className: "field-label", children: n("triggers") }),
      Nt.map((d) => /* @__PURE__ */ f("label", { className: "aq-check", children: [
        /* @__PURE__ */ s(
          "input",
          {
            type: "checkbox",
            checked: q.includes(d),
            onChange: (b) => a((y) => {
              const k = Array.isArray(y.distribution.triggers) ? y.distribution.triggers : [], N = b.target.checked ? [...k, d] : k.filter((I) => I !== d);
              x(y.distribution, "triggers", N.length ? N : void 0);
            })
          }
        ),
        n(`trigger.${d}`)
      ] }, d)),
      t.tiers.length > 0 && /* @__PURE__ */ f(U, { children: [
        /* @__PURE__ */ s("span", { className: "field-label", children: n("perTier") }),
        /* @__PURE__ */ s("div", { className: "aq-row", children: t.tiers.map((d) => /* @__PURE__ */ s(
          R,
          {
            label: E(r, d.title.key, o) || d.key,
            value: g[d.key],
            onChange: (b) => a((y) => {
              const k = { ...y.distribution.tiers ?? {} };
              x(k, d.key, b), x(
                y.distribution,
                "tiers",
                Object.keys(k).length ? k : void 0
              );
            })
          },
          d.key
        )) })
      ] })
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("limits") }),
      /* @__PURE__ */ f("div", { className: "aq-row", children: [
        /* @__PURE__ */ s(
          R,
          {
            label: n("maxActive"),
            value: t.limits.max_active,
            onChange: (d) => a((b) => x(b.limits, "max_active", d))
          }
        ),
        /* @__PURE__ */ s(
          R,
          {
            label: n("questsPerPeriod"),
            placeholder: n("noLimit"),
            value: t.limits.max_per_period,
            onChange: (d) => a((b) => x(b.limits, "max_per_period", d))
          }
        )
      ] }),
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("rotation") }),
      /* @__PURE__ */ f("div", { className: "aq-row", children: [
        /* @__PURE__ */ f("label", { className: "aq-check", children: [
          /* @__PURE__ */ s(
            "input",
            {
              type: "checkbox",
              checked: t.rotation.enabled === !0,
              onChange: (d) => a((b) => x(b.rotation, "enabled", d.target.checked ? !0 : void 0))
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
            onChange: (d) => a((b) => x(b.rotation, "max_per_period", d))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ f("div", { className: "aq-head", children: [
        /* @__PURE__ */ s("span", { className: "aq-h", children: n("tiers") }),
        /* @__PURE__ */ f(
          K,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => a((d) => {
              d.tiers.push({
                key: z(
                  "tier",
                  d.tiers.map((b) => b.key)
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
      t.tiers.map((d, b) => /* @__PURE__ */ f("div", { className: "aq-row", children: [
        /* @__PURE__ */ s(_, { label: n("tierKey"), children: /* @__PURE__ */ s(
          "input",
          {
            className: "input",
            defaultValue: d.key,
            onBlur: (y) => {
              const k = Z(y.target.value);
              k !== d.key && a((N) => {
                const I = z(
                  k,
                  N.tiers.map((Q) => Q.key)
                );
                N.tiers[b].key = I;
                for (const Q of N.quests) Q.tier === d.key && (Q.tier = I);
                const P = N.distribution.tiers;
                P && d.key in P && (P[I] = P[d.key], delete P[d.key]);
              });
            }
          }
        ) }),
        /* @__PURE__ */ s(H, { ctx: e, label: n("title"), node: d.title }),
        /* @__PURE__ */ s(
          L,
          {
            label: n("remove"),
            onClick: () => a((y) => {
              y.tiers.splice(b, 1);
            }),
            children: "×"
          }
        )
      ] }, d.key))
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ f("div", { className: "aq-head", children: [
        /* @__PURE__ */ f("span", { className: "aq-h", children: [
          n("quests"),
          " · ",
          t.quests.length
        ] }),
        /* @__PURE__ */ f(K, { size: "sm", variant: "primary", onClick: v, children: [
          "+ ",
          n("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ s("span", { className: "aq-hint", children: n("noQuests") }),
      /* @__PURE__ */ s(
        ie,
        {
          ids: t.quests.map((d) => d.uid),
          onMove: (d, b) => a((y) => ce(y.quests, d, b)),
          className: "aq-list",
          itemClassName: "aq-item",
          children: (d, b) => {
            const y = t.quests[d];
            return /* @__PURE__ */ f(U, { children: [
              b,
              /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "aq-item-main",
                  onClick: () => i(y.uid),
                  title: n("open"),
                  children: [
                    /* @__PURE__ */ s("span", { className: "aq-item-title", children: E(r, y.title.key, o) || y.key }),
                    /* @__PURE__ */ f("span", { className: "aq-item-sub", children: [
                      n("questSummary", {
                        stages: y.stages.length,
                        objectives: y.stages.reduce((k, N) => k + N.objectives.length, 0)
                      }),
                      " · ",
                      y.key,
                      y.tier ? ` · ${y.tier}` : "",
                      y.duration ? ` · ${y.duration}` : ""
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ s(
                L,
                {
                  label: n("remove"),
                  onClick: () => a((k) => {
                    k.quests.splice(d, 1);
                  }),
                  children: "×"
                }
              )
            ] });
          }
        }
      ),
      l.length > 0 && /* @__PURE__ */ s("span", { className: "aq-hint", children: n("kept", { fields: l.join(", ") }) })
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
  return /* @__PURE__ */ f("div", { className: "aq-chain", children: [
    /* @__PURE__ */ s(
      Ue,
      {
        projectId: e.projectId,
        value: n,
        onChange: (r) => i(me(r, a))
      }
    ),
    a.length > 0 && /* @__PURE__ */ f("div", { className: "aq-legacy", children: [
      /* @__PURE__ */ s("span", { className: "aq-hint", children: e.t("legacySteps") }),
      a.map((r, o) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
        /* @__PURE__ */ f("div", { className: "aq-legacy-row", children: [
          /* @__PURE__ */ s("code", { children: dt(r) }),
          /* @__PURE__ */ s(
            L,
            {
              label: e.t("remove"),
              onClick: () => i(me(n, a.filter((u, c) => c !== o))),
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
  footer: u
}) {
  const { t: c } = e, p = j(r), [m, h] = ae([]), q = n.filter((l) => p[l] != null || m.includes(l)), g = n.filter((l) => !q.includes(l));
  return /* @__PURE__ */ f("section", { className: "aq-section", children: [
    /* @__PURE__ */ s("span", { className: "aq-h", children: t }),
    /* @__PURE__ */ s("span", { className: "aq-hint", children: i }),
    q.map((l) => /* @__PURE__ */ f("div", { className: "aq-event", children: [
      /* @__PURE__ */ f("div", { className: "aq-head", children: [
        /* @__PURE__ */ s("span", { className: "aq-event-name", children: a(l) }),
        /* @__PURE__ */ s(
          L,
          {
            label: c("removeEvent"),
            onClick: () => {
              h((v) => v.filter((d) => d !== l)), o(l, void 0);
            },
            children: "×"
          }
        )
      ] }),
      /* @__PURE__ */ s(St, { ctx: e, value: p[l], onChange: (v) => o(l, v) })
    ] }, l)),
    g.length > 0 && /* @__PURE__ */ f(
      "select",
      {
        className: "select aq-event-add",
        "aria-label": c("addEvent"),
        value: "",
        onChange: (l) => {
          const v = g.find((d) => d === l.target.value);
          v && h((d) => [...d, v]);
        },
        children: [
          /* @__PURE__ */ s("option", { value: "", children: c("addEvent") }),
          g.map((l) => /* @__PURE__ */ s("option", { value: l, children: a(l) }, l))
        ]
      }
    ),
    u
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
        const u = { ...j(o.rest.actions) };
        x(u, a, r), x(o.rest, "actions", Object.keys(u).length ? u : void 0);
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
  const { t: n, edit: a } = e, r = t.quests[i], o = (l, v) => a((d) => l(d.quests[i]), v), u = t.quests.some((l, v) => v !== i && l.key === r.key), c = r.duration !== "" && !_t.test(r.duration.replace(/\s/g, "").toLowerCase()), p = Object.keys(r.rest).filter((l) => l !== "actions" && l !== "giver"), m = r.rest.giver && typeof r.rest.giver == "object" ? r.rest.giver : {}, h = (l, v) => o((d) => {
    const b = { ...m };
    x(b, l, v.trim()), typeof b.npc == "string" && b.npc !== "" ? d.rest.giver = b : delete d.rest.giver;
  }), q = typeof m.npc == "string" && m.npc !== "", g = Ct(t.distribution);
  return /* @__PURE__ */ f(U, { children: [
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("general") }),
      /* @__PURE__ */ s(H, { ctx: e, label: n("title"), node: r.title }),
      /* @__PURE__ */ s(H, { ctx: e, label: n("description"), node: r.description, multiline: !0 }),
      /* @__PURE__ */ f("div", { className: "aq-row aq-top", children: [
        /* @__PURE__ */ s(_, { label: n("tier"), children: /* @__PURE__ */ f(
          "select",
          {
            className: "select",
            value: r.tier,
            onChange: (l) => o((v) => {
              v.tier = l.target.value;
            }),
            children: [
              /* @__PURE__ */ s("option", { value: "", children: n("noTier") }),
              t.tiers.map((l) => /* @__PURE__ */ s("option", { value: l.key, children: E(e.project, l.title.key, e.lang) || l.key }, l.key)),
              r.tier && !t.tiers.some((l) => l.key === r.tier) && /* @__PURE__ */ s("option", { value: r.tier, children: r.tier })
            ]
          }
        ) }),
        /* @__PURE__ */ s(
          _,
          {
            label: n("duration"),
            hint: /* @__PURE__ */ s("span", { className: c ? "aq-err" : "aq-hint", children: n(c ? "durationInvalid" : "durationHint") }),
            children: /* @__PURE__ */ s(
              "input",
              {
                className: "input",
                value: r.duration,
                placeholder: "24h",
                onChange: (l) => o((v) => {
                  v.duration = l.target.value.trim();
                })
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { className: "aq-row aq-top", children: [
        /* @__PURE__ */ s(_, { label: n("giverNpc"), hint: /* @__PURE__ */ s("span", { className: "aq-hint", children: n("giverNpcHint") }), children: /* @__PURE__ */ s(
          "input",
          {
            className: "input aq-mono",
            value: typeof m.npc == "string" ? m.npc : "",
            onChange: (l) => h("npc", l.target.value)
          }
        ) }),
        q && /* @__PURE__ */ s(_, { label: n("giverConversation"), children: /* @__PURE__ */ s(
          "input",
          {
            className: "input aq-mono",
            value: typeof m.conversation == "string" ? m.conversation : "",
            onChange: (l) => h("conversation", l.target.value)
          }
        ) })
      ] }),
      q && g && /* @__PURE__ */ s("span", { className: "aq-warn", children: n("giverDistributed") }),
      /* @__PURE__ */ f("details", { className: "aq-fold", open: u || void 0, children: [
        /* @__PURE__ */ s("summary", { children: n("more") }),
        /* @__PURE__ */ s(
          _,
          {
            label: n("key"),
            hint: /* @__PURE__ */ s("span", { className: u ? "aq-err" : "aq-hint", children: n(u ? "keyTaken" : "questKeyHint") }),
            children: /* @__PURE__ */ s(
              "input",
              {
                className: "input aq-mono",
                value: r.key,
                onChange: (l) => o((v) => {
                  v.key = xe(l.target.value);
                }),
                onBlur: () => {
                  const l = Z(r.key);
                  l !== r.key && o((v) => {
                    v.key = l;
                  });
                }
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ f("div", { className: "aq-head", children: [
        /* @__PURE__ */ f("span", { className: "aq-h", children: [
          n("stages"),
          " · ",
          r.stages.length
        ] }),
        /* @__PURE__ */ f(
          K,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => o((l) => {
              const v = z(
                `stage_${l.stages.length + 1}`,
                l.stages.map((d) => d.key)
              );
              l.stages.push({ ...Re(l.stages.length + 1), key: v });
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
          ids: Te(r.stages.map((l) => l.key)),
          onMove: (l, v) => o((d) => ce(d.stages, l, v)),
          className: "aq-stages",
          children: (l, v) => /* @__PURE__ */ s(
            Lt,
            {
              ctx: e,
              quest: r,
              stage: r.stages[l],
              si: l,
              handle: v,
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
        label: (l) => n(`questHook.${l}`),
        value: r.rest.actions,
        onChange: (l, v) => o((d) => {
          const b = { ...j(d.rest.actions) };
          x(b, l, v), x(d.rest, "actions", Object.keys(b).length > 0 ? b : void 0);
        }),
        footer: p.length > 0 && /* @__PURE__ */ s("span", { className: "aq-hint", children: n("kept", { fields: p.join(", ") }) })
      },
      r.uid
    ),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
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
  const { t: o } = e, [u, c] = ae(null), p = (g) => r((l) => g(l.stages[n])), m = E(e.project, i.title.key, e.lang), h = i.flow || "parallel", q = t.stages.flatMap((g) => g.objectives.map((l) => l.key));
  return /* @__PURE__ */ f("div", { className: "aq-stage", children: [
    /* @__PURE__ */ f("div", { className: "aq-stage-head", children: [
      a,
      /* @__PURE__ */ s("span", { className: "aq-stage-n", children: n + 1 }),
      /* @__PURE__ */ s("div", { className: "aq-stage-title", children: /* @__PURE__ */ s(
        be,
        {
          value: m,
          placeholder: o("stageTitle"),
          "aria-label": o("stage", { n: n + 1 }),
          onChange: (g) => e.edit(() => {
          }, [{ key: i.title.key, lang: e.lang, value: g }])
        }
      ) }),
      /* @__PURE__ */ s(
        L,
        {
          label: o("remove"),
          onClick: () => r((g) => {
            g.stages.splice(n, 1);
          }),
          children: "×"
        }
      )
    ] }),
    i.objectives.length > 1 && /* @__PURE__ */ s("div", { className: "aq-seg", role: "radiogroup", "aria-label": o("flow"), children: ["parallel", "sequential"].map((g) => /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": h === g,
        className: `chip${h === g ? " is-active" : ""}`,
        onClick: () => p((l) => {
          l.flow = g;
        }),
        children: o(`flow.${g}`)
      },
      g
    )) }),
    i.objectives.length === 0 && /* @__PURE__ */ s("span", { className: "aq-hint", children: o("noObjectives") }),
    /* @__PURE__ */ s(
      ie,
      {
        ids: Te(i.objectives.map((g) => g.key)),
        onMove: (g, l) => p((v) => ce(v.objectives, g, l)),
        className: "aq-objectives",
        children: (g, l) => {
          const v = i.objectives[g];
          return /* @__PURE__ */ s(
            Ot,
            {
              t: o,
              projectId: e.projectId,
              n: h === "sequential" ? `${n + 1}.${g + 1}` : "•",
              objective: v,
              open: u === v.key,
              onToggle: () => c(u === v.key ? null : v.key),
              keyTaken: q.filter((d) => d === v.key).length > 1,
              handle: l,
              onChange: (d) => p((b) => d(b.objectives[g])),
              onRename: (d) => {
                u === v.key && c(d);
              },
              onRemove: () => p((d) => {
                d.objectives.splice(g, 1);
              })
            }
          );
        }
      }
    ),
    /* @__PURE__ */ f(
      K,
      {
        size: "sm",
        variant: "ghost",
        className: "aq-add",
        onClick: () => {
          const g = nt("block_break", q);
          r((l) => {
            l.stages[n].objectives.push({
              key: g,
              type: "block_break",
              params: je("block_break")
            });
          }), c(g);
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
  handle: u,
  onChange: c,
  onRename: p,
  onRemove: m
}) {
  const h = O(n.type), q = h ? h.params : Object.keys(n.params).map((y) => ({ name: y, kind: "text" })), g = oe(n.params), l = Ee(n.type, n.params), v = ht(n.type, n.params), d = o || v.length > 0, b = (y) => y.kind === "item" ? /* @__PURE__ */ s(
    It,
    {
      t: e,
      projectId: t,
      spec: y,
      params: n.params,
      onChange: (k) => c((N) => k(N.params))
    },
    y.name
  ) : /* @__PURE__ */ s(
    Pt,
    {
      t: e,
      spec: y,
      value: n.params[y.name],
      onChange: (k) => c((N) => x(N.params, y.name, k))
    },
    y.name
  );
  return /* @__PURE__ */ f("div", { className: `aq-obj${a ? " is-open" : ""}${d ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ f("div", { className: "aq-obj-line", children: [
      u,
      /* @__PURE__ */ f("button", { type: "button", className: "aq-obj-main", onClick: r, "aria-expanded": a, children: [
        /* @__PURE__ */ s("span", { className: "aq-obj-n", children: i }),
        /* @__PURE__ */ s("span", { className: "aq-obj-icon", "aria-hidden": !0, children: h?.icon ?? "?" }),
        /* @__PURE__ */ f("span", { className: "aq-obj-text", children: [
          Ae(e, n.type),
          g !== void 0 && /* @__PURE__ */ f("strong", { children: [
            " · ",
            String(g)
          ] }),
          l ? ` × ${l}` : g !== void 0 ? ` × ${e("any")}` : ""
        ] }),
        d && /* @__PURE__ */ s(
          "span",
          {
            className: "aq-obj-dot",
            title: o ? e("objectiveKeyTaken") : e("missing", {
              fields: v.map((y) => e(`param.${y}`)).join(", ")
            })
          }
        )
      ] }),
      /* @__PURE__ */ s(L, { label: e("remove"), onClick: m, children: "×" })
    ] }),
    a && /* @__PURE__ */ f("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ s(_, { label: e("type"), children: /* @__PURE__ */ f(
        "select",
        {
          className: "select",
          value: n.type,
          onChange: (y) => c((k) => {
            k.type = y.target.value, k.params = je(k.type);
          }),
          children: [
            Ne.map((y) => /* @__PURE__ */ f("option", { value: y.type, children: [
              y.icon,
              " ",
              e(`objective.${y.type}`)
            ] }, y.type)),
            !h && /* @__PURE__ */ s("option", { value: n.type, children: n.type })
          ]
        }
      ) }),
      /* @__PURE__ */ s("div", { className: "aq-row aq-wrap", children: q.filter((y) => !y.advanced).map(b) }),
      v.length > 0 && /* @__PURE__ */ s("span", { className: "aq-warn", children: e("missing", {
        fields: v.map((y) => e(`param.${y}`)).join(", ")
      }) }),
      /* @__PURE__ */ f("details", { className: "aq-fold", open: o || void 0, children: [
        /* @__PURE__ */ s("summary", { children: e("more") }),
        q.filter((y) => y.advanced).map(b),
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
                onChange: (y) => {
                  const k = xe(y.target.value);
                  c((N) => {
                    N.key = k;
                  }), p(k);
                },
                onBlur: () => {
                  const y = Z(n.key);
                  y !== n.key && (c((k) => {
                    k.key = y;
                  }), p(y));
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
  const r = le(n, i), o = Array.isArray(n.match) ? n.match : void 0, u = (c, p) => a((m) => mt(m, i, c, p));
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
          onChange: (c) => u(c, o),
          onMatchChange: (c) => u(r, c)
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
  const u = r ? /* @__PURE__ */ s("span", { className: "aq-warn", children: e("required") }) : t.name === "itemKey" ? /* @__PURE__ */ s("span", { className: "aq-hint", children: e("itemKeyHint") }) : void 0;
  if (t.kind === "material")
    return /* @__PURE__ */ s(_, { label: a, hint: u, children: /* @__PURE__ */ s(
      Fe,
      {
        value: o,
        placeholder: e("any"),
        "aria-label": a,
        onChange: (p) => n(p.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const c = t.kind === "entity";
  return /* @__PURE__ */ f(_, { label: a, hint: u, children: [
    /* @__PURE__ */ s(
      "input",
      {
        className: `input${c ? " aq-mono" : ""}`,
        list: c ? "aq-entities" : void 0,
        value: o,
        placeholder: c ? e("any") : "",
        onChange: (p) => n(c ? p.target.value.toUpperCase().replace(/\s+/g, "_") : p.target.value)
      }
    ),
    c && /* @__PURE__ */ s("datalist", { id: "aq-entities", children: ft.map((p) => /* @__PURE__ */ s("option", { value: p }, p)) })
  ] });
}
function Mt({ ctx: e, quest: t }) {
  const { t: i, project: n, lang: a } = e, r = (o) => W(i, o);
  return /* @__PURE__ */ f("div", { className: "aq-preview", children: [
    /* @__PURE__ */ s("span", { className: "aq-preview-title", children: E(n, t.title.key, a) || t.key }),
    E(n, t.description.key, a) && /* @__PURE__ */ s("span", { className: "aq-preview-line", children: E(n, t.description.key, a) }),
    t.stages.map((o, u) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ f("span", { className: "aq-preview-stage", children: [
        t.stages.length > 1 && /* @__PURE__ */ s("span", { className: "aq-preview-line", children: E(n, o.title.key, a) || i("stage", { n: u + 1 }) }),
        o.objectives.map((c) => /* @__PURE__ */ f("span", { className: "aq-preview-line", children: [
          "• ",
          r(c)
        ] }, c.key))
      ] }, u)
    ))
  ] });
}
function Dt({ className: e }) {
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
}, he = "quests:groups", fe = "quests:quests", Kt = "quests:active";
function Gt(e) {
  return e.startsWith("msquests:") ? `quests:${e.slice(9)}` : e;
}
const ye = {
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
function Qt(e, t, i) {
  const n = Gt(t);
  if (n !== he && n !== fe && n !== Kt) return null;
  const a = e.documents?.[re];
  if (!a || a.length === 0) return null;
  const r = e.defaultLang ?? "en", o = i?.serverRows, u = i?.params?.group || void 0, c = [...a].sort((m, h) => m.id < h.id ? -1 : m.id > h.id ? 1 : 0);
  if (n === he) {
    const m = te(o, "key");
    return c.map((h) => Ut(h, m.get(h.id), r));
  }
  if (n === fe) {
    const m = te(o, "id");
    return c.filter((h) => !u || h.id === u).flatMap((h) => h.quests.map((q) => $e(h, q, m.get(`${h.id}:${q.key}`), r)));
  }
  if (!o) return null;
  const p = new Map(a.map((m) => [m.id, m]));
  return o.flatMap((m) => {
    const h = p.get(A(m.group));
    if (!h) return [m];
    const q = h.quests.find((g) => g.key === A(m.quest_key));
    return q ? [Vt(q, m, r)] : [];
  });
}
function Ut(e, t, i) {
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
    duration: Yt(t.duration),
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
  const n = t ? zt(t) : void 0, a = Ft(e, n, i), r = a.find((u) => u.active === !0), o = r ? r.objectives.find((u) => u.done !== !0) : void 0;
  return {
    objective_name: o?.name ?? "",
    objective_progress: o?.progress ?? 0,
    objective_target: o?.target ?? 0,
    progress_ratio: n ? Oe(a.map((u) => u.progress_ratio)) : 0,
    stage_index: a.filter((u) => u.completed === !0).length,
    stage_name: r?.name ?? "",
    stage_flow: r?.flow ?? "",
    stages: a.map((u) => ({ ...u, objectives: u.objectives.map(({ done: c, ...p }) => p) }))
  };
}
function zt(e) {
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
function Ft(e, t, i) {
  const n = e.stages.map((r, o) => {
    const u = r.objectives.map((c) => Bt(c, t?.get(c.key), i));
    return {
      key: r.key,
      name: r.title,
      flow: Zt(r),
      index: o,
      // `QuestStage.isCompleted`: all objectives done, so an empty stage is.
      completed: t !== void 0 && u.every((c) => c.done),
      active: !1,
      progress_ratio: t ? Oe(u.map((c) => c.progress_ratio)) : 0,
      objectives: u
    };
  });
  if (!t) return n;
  const a = n.find((r) => r.completed !== !0);
  if (a) {
    a.active = !0;
    const r = a.objectives, o = r.find((u) => u.done !== !0);
    for (const u of r)
      u.status_key === "PENDING" && (a.flow !== "SEQUENTIAL" || u === o) && (u.status_key = "IN_PROGRESS");
  }
  return n;
}
function Bt(e, t, i) {
  const n = Jt(e), a = t?.progress ?? 0, r = t?.row, o = r && r.type === e.type && r.target === n;
  return {
    key: e.key,
    name: o && typeof r.name == "string" ? r.name : Wt(e, i),
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
function Vt(e, t, i) {
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
function Wt(e, t) {
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
  return n.replace(/%([a-z_]+)%/g, (o, u) => r[u] ?? "");
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
function Jt(e) {
  const t = oe(e.params);
  if (t === void 0) return 1;
  const i = Number(t);
  return Number.isFinite(i) ? i : 1;
}
function Zt(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function Yt(e) {
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
const Xt = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: Be,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  documents: [Ht],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: Qt
}, an = { ...Xt, sdk: "1.10.0" };
export {
  an as default
};
