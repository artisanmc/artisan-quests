import { createModuleI18n as Pe, fieldText as Me, newTextKey as L, textValue as E, injectModuleStyles as De, useProject as He, useContentLang as Ke, Button as G, selectDocumentItem as Ge, SortableList as ae, updateDocument as Qe, useUiLang as Ue, MiniMessageInput as qe, ActionChainEditor as ze, ItemInput as Fe, MaterialInput as Be, SDK_VERSION as Ve } from "@artisan/editor-sdk";
import { jsxs as y, jsx as s, Fragment as z } from "react/jsx-runtime";
import { useState as re, useEffect as We } from "react";
const Je = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
}, Ze = /^\d+$/;
function X(e, t, i) {
  const n = String(i).padStart(2, "0");
  return e === "fr" ? i === 0 ? `${t} h` : `${t} h ${n}` : `${String(t).padStart(2, "0")}:${n}`;
}
function T(e, t, i) {
  return Ze.test(e) && Number(e) >= t && Number(e) <= i;
}
function ue(e) {
  return e.trim().split(/\s+/).length === 5;
}
function Ye(e, t) {
  const i = t === "fr", n = e.trim().split(/\s+/);
  if (n.length !== 5) return null;
  const [a, r, o, d, l] = n;
  if (d !== "*") return null;
  const u = /^\*\/(\d+)$/;
  if (o === "*" && l === "*") {
    if (T(a, 0, 59) && T(r, 0, 23))
      return i ? `tous les jours à ${X(t, +r, +a)}` : `every day at ${X(t, +r, +a)}`;
    const h = u.exec(r);
    if (T(a, 0, 59) && h)
      return i ? `toutes les ${h[1]} h, à la minute ${a}` : `every ${h[1]} hours, at minute ${a}`;
    if (T(a, 0, 59) && r === "*")
      return i ? `toutes les heures, à la minute ${a}` : `every hour, at minute ${a}`;
    const q = u.exec(a);
    return q && r === "*" ? i ? `toutes les ${q[1]} minutes` : `every ${q[1]} minutes` : null;
  }
  if (!T(a, 0, 59) || !T(r, 0, 23)) return null;
  const m = X(t, +r, +a);
  if (o === "*" && T(l, 0, 7)) {
    const h = Je[i ? "fr" : "en"][Number(l) % 7];
    return i ? `chaque ${h} à ${m}` : `every ${h} at ${m}`;
  }
  return l === "*" && T(o, 1, 31) ? i ? `le ${o === "1" ? "1er" : o} de chaque mois à ${m}` : `on day ${o} of each month at ${m}` : null;
}
function D(e, t, i) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e.split(",")) {
    const r = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(a);
    if (!r) return null;
    const o = r[4] ? Number(r[4]) : 1, d = r[1] === "*" ? t : Number(r[2]), l = r[1] === "*" ? i : r[3] ? Number(r[3]) : r[4] ? i : d;
    if (o < 1 || d < t || l > i || d > l) return null;
    for (let u = d; u <= l; u += o) n.add(u);
  }
  return n;
}
function Xe(e, t) {
  const i = e.trim().split(/\s+/);
  if (i.length !== 5) return null;
  const n = D(i[0], 0, 59), a = D(i[1], 0, 23), r = D(i[2], 1, 31), o = D(i[3], 1, 12), d = D(i[4], 0, 7);
  if (!n || !a || !r || !o || !d) return null;
  d.has(7) && d.add(0);
  const l = i[2] === "*", u = i[4] === "*", m = (g) => l && u ? !0 : l ? d.has(g.getDay()) : u ? r.has(g.getDate()) : r.has(g.getDate()) || d.has(g.getDay()), h = new Date(t.getTime());
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
const Q = {
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
  "strategy.ladder": "By position (rankup)",
  position: "Position (a whole number, such as %msguilds_level%)",
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
}, Z = {
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
  "strategy.ladder": "Selon la position (rankup)",
  position: "Position (un nombre entier, comme %msguilds_level%)",
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
}, pe = { en: Q.kindLabel, fr: Z.kindLabel }, et = { en: Q.collection, fr: Z.collection }, tt = Pe({ en: Q, fr: Z });
function ke(e) {
  const t = e === "fr" ? Z : Q;
  return (i, n) => {
    const a = t[i] ?? Q[i] ?? i;
    return n ? a.replace(/\{\{(\w+)\}\}/g, (r, o) => String(n[o] ?? r)) : a;
  };
}
const se = "quest_group", xe = "quest_groups", nt = "quests", oe = "quest_group/v1", te = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function W(e = Date.now()) {
  let t = "", i = e;
  for (let r = 0; r < 10; r++)
    t = te[i % 32] + t, i = Math.floor(i / 32);
  const n = new Uint8Array(16);
  crypto.getRandomValues(n);
  let a = "";
  for (let r = 0; r < 16; r++) a += te[n[r] % 32];
  return t + a;
}
function F(e, t) {
  const i = new Set(t);
  if (!i.has(e)) return e;
  for (let n = 2; ; n++) if (!i.has(`${e}_${n}`)) return `${e}_${n}`;
}
function it(e, t) {
  const i = new Set(t), n = new Uint8Array(4);
  for (; ; ) {
    crypto.getRandomValues(n);
    const a = Array.from(n, (o) => te[o % 32].toLowerCase()).join(""), r = `${Y(e)}_${a}`;
    if (!i.has(r)) return r;
  }
}
function _e(e) {
  return e.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
function Y(e) {
  return e.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "quest";
}
function j(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? { ...e } : {};
}
function ee(e) {
  return Array.isArray(e) ? e : [];
}
function w(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? String(e) : "";
}
function H(e, ...t) {
  const i = { ...e };
  for (const n of t) delete i[n];
  return i;
}
function at(e, t) {
  const i = {}, n = [];
  function a(l) {
    if (l && typeof l == "object" && !Array.isArray(l)) {
      const h = L(), q = {};
      for (const [g, c] of Object.entries(l)) q[g] = w(c);
      return i[h] = q, { key: h };
    }
    const u = typeof l == "string" ? /^\{i18n:(.+)\}$/.exec(l) : null;
    if (u) {
      const h = t.translations?.[u[1]];
      return h && (i[u[1]] = { ...h }), { key: u[1] };
    }
    const m = L();
    return i[m] = l == null || l === "" ? {} : { [t.lang]: w(l) }, { key: m };
  }
  const r = Object.entries(j(e.tiers)).map(([l, u]) => {
    const m = j(u);
    return { key: l, title: a(m.title), rest: H(m, "title") };
  }), o = ee(e.quests).map((l, u) => {
    const m = j(l), h = ee(m.stages).map((q, g) => {
      const c = j(q), v = w(c.flow).toLowerCase();
      return {
        key: w(c.key) || `stage_${g + 1}`,
        title: a(c.title),
        flow: v === "parallel" || v === "sequential" ? v : "",
        objectives: ee(c.objectives).map((k, p) => {
          const f = j(k);
          return {
            key: w(f.key) || `objective_${p + 1}`,
            type: w(f.type),
            params: H(f, "key", "type")
          };
        }),
        rest: H(c, "key", "title", "flow", "objectives")
      };
    });
    return {
      key: w(m.key) || `quest_${u + 1}`,
      uid: w(m.uid) || W(),
      tier: w(m.tier),
      title: a(m.title),
      description: a(m.description),
      duration: w(m.duration),
      stages: h,
      rest: rt(m)
    };
  }), d = {
    id: w(e.id),
    projectId: t.projectId,
    uid: w(e.uid) || W(),
    title: a(e.title),
    description: a(e.description),
    actorType: w(e.actor_type) || "player",
    reset: j(e.reset),
    limits: j(e.limits),
    rotation: j(e.rotation),
    distribution: j(e.distribution),
    tiers: r,
    quests: o,
    rest: Ne(H(
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
  return e.schema !== void 0 && e.schema !== oe && n.push(`schema: ${String(e.schema)}`), { doc: d, i18nKeys: i, unsupported: n };
}
function Ne(e) {
  return e.on !== void 0 && (e.actions == null && (e.actions = e.on), delete e.on), e;
}
function rt(e) {
  const t = Ne(
    H(e, "key", "uid", "tier", "title", "description", "duration", "stages", "reward_display")
  );
  if (t.rewards !== void 0) {
    const i = j(t.actions);
    i.complete == null && (t.actions = { ...i, complete: t.rewards }), delete t.rewards;
  }
  return t;
}
function st(e) {
  return typeof e == "string" ? e === "" : Object.values(e).every((t) => t === "");
}
function S(e) {
  const t = {};
  for (const [i, n] of Object.entries(e))
    n == null || n === "" || Array.isArray(n) && n.length === 0 || typeof n == "object" && !Array.isArray(n) && Object.keys(n).length === 0 || (t[i] = n);
  return t;
}
const ot = [
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
function lt(e, t) {
  const i = (u) => Me(t, u.key), n = (u) => {
    const m = i(u);
    return st(m) ? void 0 : m;
  }, a = {};
  for (const u of e.tiers) a[u.key] = { ...u.rest, title: i(u.title) };
  const r = e.quests.map(
    (u) => S({
      key: u.key,
      uid: u.uid,
      tier: u.tier,
      title: i(u.title),
      description: n(u.description),
      duration: u.duration,
      ...u.rest,
      stages: u.stages.map(
        (m) => S({
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
    schema: oe,
    uid: e.uid,
    title: i(e.title),
    description: n(e.description),
    actor_type: e.actorType,
    reset: S(e.reset),
    limits: S(e.limits),
    rotation: S(e.rotation),
    distribution: S(e.distribution),
    tiers: a,
    quests: r
  }, d = {};
  for (const u of ot) u in o && (d[u] = o[u]);
  for (const u of Object.keys(o)) u in d || (d[u] = o[u]);
  const l = S(d);
  return l.quests = r, l;
}
function* ct(e) {
  const t = `${xe}.${e.id}`;
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
    const d = /* @__PURE__ */ new Set();
    for (let l = 0; l < a.stages.length; l++) {
      const u = a.stages[l], m = d.has(u.key) ? `${u.key}_${l}` : u.key;
      d.add(u.key), yield {
        lText: u.title,
        key: `${o}.stages.${m}.title`,
        path: `quests[${n}].stages[${l}].title`,
        kind: "quest.stage"
      };
    }
  }
}
function me(e) {
  return !!e && typeof e == "object" && !Array.isArray(e) && "type" in e;
}
function dt(e) {
  const t = Array.isArray(e) ? e : e == null ? [] : [e];
  return {
    chain: t.filter((i) => !me(i)),
    legacy: t.filter(me)
  };
}
function he(e, t) {
  const i = [...e, ...t];
  return i.length ? i : void 0;
}
function ut(e) {
  const t = String(e.type), i = e.command ?? e.message ?? e.title ?? e.material;
  return typeof i == "string" ? `${t} · ${i}` : t;
}
const pt = [
  "distribution",
  "actor_load",
  "quest_start",
  "objective_progress",
  "objective_complete",
  "quest_complete",
  "period_complete"
], mt = ["start", "objective_progress", "objective_complete", "complete"], R = { name: "amount", kind: "int", required: !0 }, je = [
  { type: "block_break", icon: "⛏", params: [{ name: "material", kind: "material" }, R] },
  {
    type: "craft_item",
    icon: "⚒",
    params: [{ name: "item", kind: "item", legacy: "material" }, R]
  },
  {
    type: "harvest_crop",
    icon: "🌾",
    params: [{ name: "crop", kind: "material", required: !0 }, R]
  },
  {
    type: "fishing",
    icon: "🎣",
    params: [{ name: "item", kind: "item", legacy: "fish_type" }, R]
  },
  {
    type: "deliver_item",
    icon: "📦",
    params: [
      { name: "item", kind: "item", legacy: "material" },
      R,
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
  { type: "kill_entity", icon: "⚔", params: [{ name: "entity_type", kind: "entity" }, R] },
  { type: "breed_animal", icon: "♥", params: [{ name: "entity_type", kind: "entity" }, R] },
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
function I(e) {
  return je.find((t) => t.type === e);
}
function we(e) {
  const t = {};
  for (const i of I(e)?.params ?? [])
    i.kind === "int" && (t[i.name] = 1);
  return t;
}
function le(e) {
  return e.amount ?? e.distance;
}
function ce(e, t) {
  const i = e[t.name];
  if (i && typeof i == "object" && !Array.isArray(i)) return i;
  const n = t.legacy ? e[t.legacy] : void 0;
  return typeof n == "string" && n !== "" ? { material: n } : {};
}
function ht(e, t, i, n) {
  t.legacy && delete e[t.legacy];
  const a = !i || Object.keys(i).length === 0;
  a ? delete e[t.name] : e[t.name] = i, a || n === void 0 ? delete e.match : e.match = n;
}
function Ee(e) {
  const t = e.title;
  if (typeof t == "string" && t.trim() !== "") return t.replace(/<[^>]*>/g, "");
  const i = e.material ?? e.item;
  return typeof i == "string" ? i : "";
}
function Ae(e, t) {
  const i = I(e);
  return i ? i.params.filter((n) => n.kind !== "int").map((n) => n.kind === "item" ? Ee(ce(t, n)) : t[n.name]).filter((n) => typeof n == "string" && n !== "").join(" = ") : Object.keys(t).map((n) => t[n]).filter((n) => typeof n == "string" && n !== "").join(" = ");
}
function ft(e, t) {
  return (I(e)?.params ?? []).filter((i) => i.required && (t[i.name] === void 0 || t[i.name] === "")).map((i) => i.name);
}
const yt = [
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
], gt = "#f59e0b";
function Ce(e, t) {
  return I(t) ? e(`objective.${t}`) : t;
}
function J(e, t) {
  const i = Ae(t.type, t.params), n = le(t.params);
  return `${Ce(e, t.type)}${i ? ` · ${i}` : ""}${n !== void 0 ? ` · 0/${String(n)}` : ""}`;
}
function Te(e) {
  return e.replace(/<[^<>]*>/g, "").trim();
}
function vt(e) {
  const t = e.distribution?.strategy;
  return typeof t == "string" && ["sequential", "ladder"].includes(t.toLowerCase());
}
function bt(e, t, i) {
  const n = ke(i), a = vt(e);
  return e.quests.map((r, o) => {
    const d = E(t, r.title.key, i);
    return {
      id: r.uid,
      label: Te(d) || r.key,
      detail: r.tier || void 0,
      caption: qt(n, r),
      marker: a ? String(o + 1) : void 0,
      hover: {
        title: d || r.key,
        text: E(t, r.description.key, i) || void 0,
        lines: kt(n, r, t, i)
      }
    };
  });
}
function qt(e, t) {
  const i = t.stages.flatMap((r) => r.objectives), n = i[0];
  if (!n) return;
  const a = i.length - 1;
  return a > 0 ? `${J(e, n)} +${String(a)}` : J(e, n);
}
function kt(e, t, i, n) {
  const a = t.stages.length > 1;
  return t.stages.flatMap(
    (r, o) => r.objectives.map((d) => {
      const l = J(e, d);
      return a ? `<gray>${Te(E(i, r.title.key, n)) || e("stage", { n: o + 1 })} ·</gray> ${l}` : l;
    })
  );
}
function xt(e, t) {
  const i = ke(t), n = typeof e.distribution?.strategy == "string" ? e.distribution.strategy.toLowerCase() : "", a = e.quests.length, r = a === 1 ? i("questCountOne") : i("questCount", { count: a });
  return ["none", "sequential", "random", "ladder"].includes(n) ? `${r} · ${i(`strategy.${n}`).toLowerCase()}` : r;
}
const _t = `
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
`, Nt = /^(\d+|(\d+[dhms])+)$/, jt = ["actor_load", "period_reset", "quest_complete"], wt = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
function Et(e, t) {
  const i = Xe(e, /* @__PURE__ */ new Date());
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
function At({ projectId: e, documentId: t, document: i, item: n }) {
  De("msquests", _t);
  const a = i, r = He(e), o = Ke(), d = tt(), [l, u] = re(n ?? null);
  We(() => {
    u(n ?? null);
  }, [n]);
  const m = (c) => {
    u(c), Ge({ documentId: t, item: c });
  }, q = { projectId: e, project: r, lang: o, t: d, edit: (c, v) => {
    const k = structuredClone(a);
    c(k), Qe({ projectId: e, kind: se, id: t, doc: k, texts: v });
  } }, g = l ? a.quests.findIndex((c) => c.uid === l) : -1;
  return g >= 0 ? /* @__PURE__ */ y("div", { className: "aq", children: [
    /* @__PURE__ */ y(G, { variant: "ghost", size: "sm", className: "aq-back", onClick: () => m(null), children: [
      "← ",
      d("back")
    ] }),
    /* @__PURE__ */ s(Lt, { ctx: q, group: a, index: g })
  ] }) : /* @__PURE__ */ s("div", { className: "aq", children: /* @__PURE__ */ s(St, { ctx: q, group: a, onOpen: m }) });
}
function N({
  label: e,
  children: t,
  hint: i
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the control is the child
    /* @__PURE__ */ y("label", { className: "aq-field", children: [
      /* @__PURE__ */ s("span", { className: "field-label", children: e }),
      t,
      i
    ] })
  );
}
function K({
  ctx: e,
  label: t,
  node: i,
  multiline: n
}) {
  const a = E(e.project, i.key, e.lang), r = (o) => e.edit(() => {
  }, [{ key: i.key, lang: e.lang, value: o }]);
  return /* @__PURE__ */ s(N, { label: `${t} · ${e.lang}`, children: /* @__PURE__ */ s(qe, { value: a, onChange: r, multiline: n, "aria-label": t }) });
}
function Ct(e) {
  return typeof e == "number" ? String(e) : typeof e == "string" ? e : "";
}
function $({
  label: e,
  value: t,
  onChange: i,
  placeholder: n
}) {
  return /* @__PURE__ */ s(N, { label: e, children: /* @__PURE__ */ s(
    "input",
    {
      className: "input",
      type: "number",
      min: 0,
      step: 1,
      value: Ct(t),
      placeholder: n,
      onChange: (a) => {
        const r = a.target.value.trim();
        i(r === "" ? void 0 : Math.max(0, Math.trunc(Number(r))));
      }
    }
  ) });
}
function Tt(e) {
  const t = typeof e.strategy == "string" ? e.strategy.toLowerCase() : "";
  return t !== "" && t !== "none";
}
function _(e, t, i) {
  i === void 0 || i === "" ? delete e[t] : e[t] = i;
}
function de(e, t, i) {
  if (i < 0 || i >= e.length) return;
  const [n] = e.splice(t, 1);
  e.splice(i, 0, n);
}
function O({
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
function Se(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((i, n) => {
    const a = t.has(i) ? `${i}#${n}` : i;
    return t.add(i), a;
  });
}
function St({
  ctx: e,
  group: t,
  onOpen: i
}) {
  const { t: n, edit: a, project: r, lang: o } = e, d = Ue(), l = typeof t.reset.cron == "string" ? t.reset.cron : "", u = l ? Ye(l, d) : null, m = typeof t.reset.timezone == "string" ? t.reset.timezone : "", h = l && ue(l) ? Et(l, d) : null, q = typeof t.distribution.strategy == "string" && t.distribution.strategy.toLowerCase() === "ladder", g = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], c = t.distribution.tiers ?? {}, v = Object.keys(t.rest).filter((p) => p !== "actions"), k = () => {
    const p = L(), f = W();
    a(
      (b) => {
        b.quests.push({
          key: F(
            "quest",
            b.quests.map((x) => x.key)
          ),
          uid: f,
          tier: "",
          title: { key: p },
          description: { key: L() },
          duration: "",
          stages: [$e(1)],
          rest: {}
        });
      },
      [{ key: p, lang: o, value: n("newQuestTitle") }]
    ), i(f);
  };
  return /* @__PURE__ */ y(z, { children: [
    /* @__PURE__ */ y("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("group") }),
      /* @__PURE__ */ s(K, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ s(K, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ s(N, { label: n("actorType"), children: /* @__PURE__ */ y(
        "select",
        {
          className: "select",
          value: t.actorType,
          onChange: (p) => a((f) => {
            f.actorType = p.target.value;
          }),
          children: [
            /* @__PURE__ */ s("option", { value: "player", children: n("actor.player") }),
            /* @__PURE__ */ s("option", { value: "global", children: n("actor.global") }),
            !["player", "global"].includes(t.actorType) && /* @__PURE__ */ s("option", { value: t.actorType, children: t.actorType })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ y("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("reset") }),
      /* @__PURE__ */ s(
        N,
        {
          label: n("cron"),
          hint: l ? ue(l) ? /* @__PURE__ */ y("span", { className: "aq-ok", children: [
            u ?? n("cronRaw"),
            m && m !== wt ? `, ${m}` : h ? ` · ${n("nextRun", { when: h })}` : ""
          ] }) : /* @__PURE__ */ s("span", { className: "aq-err", children: n("cronInvalid") }) : /* @__PURE__ */ s("span", { className: "aq-hint", children: n("noReset") }),
          children: /* @__PURE__ */ s(
            "input",
            {
              className: "input",
              value: l,
              placeholder: "0 4 * * *",
              onChange: (p) => a((f) => _(f.reset, "cron", p.target.value))
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ y("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("distribution") }),
      /* @__PURE__ */ y("div", { className: "aq-row", children: [
        /* @__PURE__ */ s(N, { label: n("strategy"), children: /* @__PURE__ */ y(
          "select",
          {
            className: "select",
            value: typeof t.distribution.strategy == "string" ? t.distribution.strategy.toLowerCase() : "",
            onChange: (p) => a((f) => _(f.distribution, "strategy", p.target.value)),
            children: [
              /* @__PURE__ */ s("option", { value: "", children: "—" }),
              ["none", "sequential", "random", "ladder"].map((p) => /* @__PURE__ */ s("option", { value: p, children: n(`strategy.${p}`) }, p))
            ]
          }
        ) }),
        q ? /* @__PURE__ */ s(N, { label: n("position"), children: /* @__PURE__ */ s(
          "input",
          {
            className: "input",
            value: typeof t.distribution.position == "string" ? t.distribution.position : "",
            placeholder: "%msguilds_level%",
            onChange: (p) => a((f) => _(f.distribution, "position", p.target.value || void 0))
          }
        ) }) : /* @__PURE__ */ s(
          $,
          {
            label: n("amount"),
            value: t.distribution.amount,
            onChange: (p) => a((f) => _(f.distribution, "amount", p))
          }
        )
      ] }),
      !q && /* @__PURE__ */ s("span", { className: "field-label", children: n("triggers") }),
      !q && jt.map((p) => /* @__PURE__ */ y("label", { className: "aq-check", children: [
        /* @__PURE__ */ s(
          "input",
          {
            type: "checkbox",
            checked: g.includes(p),
            onChange: (f) => a((b) => {
              const x = Array.isArray(b.distribution.triggers) ? b.distribution.triggers : [], A = f.target.checked ? [...x, p] : x.filter((P) => P !== p);
              _(b.distribution, "triggers", A.length ? A : void 0);
            })
          }
        ),
        n(`trigger.${p}`)
      ] }, p)),
      t.tiers.length > 0 && /* @__PURE__ */ y(z, { children: [
        /* @__PURE__ */ s("span", { className: "field-label", children: n("perTier") }),
        /* @__PURE__ */ s("div", { className: "aq-row", children: t.tiers.map((p) => /* @__PURE__ */ s(
          $,
          {
            label: E(r, p.title.key, o) || p.key,
            value: c[p.key],
            onChange: (f) => a((b) => {
              const x = { ...b.distribution.tiers ?? {} };
              _(x, p.key, f), _(
                b.distribution,
                "tiers",
                Object.keys(x).length ? x : void 0
              );
            })
          },
          p.key
        )) })
      ] })
    ] }),
    /* @__PURE__ */ y("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("limits") }),
      /* @__PURE__ */ y("div", { className: "aq-row", children: [
        /* @__PURE__ */ s(
          $,
          {
            label: n("maxActive"),
            value: t.limits.max_active,
            onChange: (p) => a((f) => _(f.limits, "max_active", p))
          }
        ),
        /* @__PURE__ */ s(
          $,
          {
            label: n("questsPerPeriod"),
            placeholder: n("noLimit"),
            value: t.limits.max_per_period,
            onChange: (p) => a((f) => _(f.limits, "max_per_period", p))
          }
        )
      ] }),
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("rotation") }),
      /* @__PURE__ */ y("div", { className: "aq-row", children: [
        /* @__PURE__ */ y("label", { className: "aq-check", children: [
          /* @__PURE__ */ s(
            "input",
            {
              type: "checkbox",
              checked: t.rotation.enabled === !0,
              onChange: (p) => a((f) => _(f.rotation, "enabled", p.target.checked ? !0 : void 0))
            }
          ),
          n("rotationEnabled")
        ] }),
        t.rotation.enabled === !0 ? /* @__PURE__ */ s(
          $,
          {
            label: n("rotationsPerPeriod"),
            placeholder: n("noLimit"),
            value: t.rotation.max_per_period,
            onChange: (p) => a((f) => _(f.rotation, "max_per_period", p))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ y("section", { className: "aq-section", children: [
      /* @__PURE__ */ y("div", { className: "aq-head", children: [
        /* @__PURE__ */ s("span", { className: "aq-h", children: n("tiers") }),
        /* @__PURE__ */ y(
          G,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => a((p) => {
              p.tiers.push({
                key: F(
                  "tier",
                  p.tiers.map((f) => f.key)
                ),
                title: { key: L() },
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
      t.tiers.map((p, f) => /* @__PURE__ */ y("div", { className: "aq-row", children: [
        /* @__PURE__ */ s(N, { label: n("tierKey"), children: /* @__PURE__ */ s(
          "input",
          {
            className: "input",
            defaultValue: p.key,
            onBlur: (b) => {
              const x = Y(b.target.value);
              x !== p.key && a((A) => {
                const P = F(
                  x,
                  A.tiers.map((U) => U.key)
                );
                A.tiers[f].key = P;
                for (const U of A.quests) U.tier === p.key && (U.tier = P);
                const M = A.distribution.tiers;
                M && p.key in M && (M[P] = M[p.key], delete M[p.key]);
              });
            }
          }
        ) }),
        /* @__PURE__ */ s(K, { ctx: e, label: n("title"), node: p.title }),
        /* @__PURE__ */ s(
          O,
          {
            label: n("remove"),
            onClick: () => a((b) => {
              b.tiers.splice(f, 1);
            }),
            children: "×"
          }
        )
      ] }, p.key))
    ] }),
    /* @__PURE__ */ y("section", { className: "aq-section", children: [
      /* @__PURE__ */ y("div", { className: "aq-head", children: [
        /* @__PURE__ */ y("span", { className: "aq-h", children: [
          n("quests"),
          " · ",
          t.quests.length
        ] }),
        /* @__PURE__ */ y(G, { size: "sm", variant: "primary", onClick: k, children: [
          "+ ",
          n("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ s("span", { className: "aq-hint", children: n("noQuests") }),
      /* @__PURE__ */ s(
        ae,
        {
          ids: t.quests.map((p) => p.uid),
          onMove: (p, f) => a((b) => de(b.quests, p, f)),
          className: "aq-list",
          itemClassName: "aq-item",
          children: (p, f) => {
            const b = t.quests[p];
            return /* @__PURE__ */ y(z, { children: [
              f,
              /* @__PURE__ */ y(
                "button",
                {
                  type: "button",
                  className: "aq-item-main",
                  onClick: () => i(b.uid),
                  title: n("open"),
                  children: [
                    /* @__PURE__ */ s("span", { className: "aq-item-title", children: E(r, b.title.key, o) || b.key }),
                    /* @__PURE__ */ y("span", { className: "aq-item-sub", children: [
                      n("questSummary", {
                        stages: b.stages.length,
                        objectives: b.stages.reduce((x, A) => x + A.objectives.length, 0)
                      }),
                      " · ",
                      b.key,
                      b.tier ? ` · ${b.tier}` : "",
                      b.duration ? ` · ${b.duration}` : ""
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ s(
                O,
                {
                  label: n("remove"),
                  onClick: () => a((x) => {
                    x.quests.splice(p, 1);
                  }),
                  children: "×"
                }
              )
            ] });
          }
        }
      ),
      v.length > 0 && /* @__PURE__ */ s("span", { className: "aq-hint", children: n("kept", { fields: v.join(", ") }) })
    ] }),
    /* @__PURE__ */ s($t, { ctx: e, group: t })
  ] });
}
function Rt({
  ctx: e,
  value: t,
  onChange: i
}) {
  const { chain: n, legacy: a } = dt(t);
  return /* @__PURE__ */ y("div", { className: "aq-chain", children: [
    /* @__PURE__ */ s(
      ze,
      {
        projectId: e.projectId,
        value: n,
        onChange: (r) => i(he(r, a))
      }
    ),
    a.length > 0 && /* @__PURE__ */ y("div", { className: "aq-legacy", children: [
      /* @__PURE__ */ s("span", { className: "aq-hint", children: e.t("legacySteps") }),
      a.map((r, o) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
        /* @__PURE__ */ y("div", { className: "aq-legacy-row", children: [
          /* @__PURE__ */ s("code", { children: ut(r) }),
          /* @__PURE__ */ s(
            O,
            {
              label: e.t("remove"),
              onClick: () => i(he(n, a.filter((d, l) => l !== o))),
              children: "×"
            }
          )
        ] }, o)
      ))
    ] })
  ] });
}
function Re({
  ctx: e,
  title: t,
  hint: i,
  hooks: n,
  label: a,
  value: r,
  onChange: o,
  footer: d
}) {
  const { t: l } = e, u = j(r), [m, h] = re([]), q = n.filter((c) => u[c] != null || m.includes(c)), g = n.filter((c) => !q.includes(c));
  return /* @__PURE__ */ y("section", { className: "aq-section", children: [
    /* @__PURE__ */ s("span", { className: "aq-h", children: t }),
    /* @__PURE__ */ s("span", { className: "aq-hint", children: i }),
    q.map((c) => /* @__PURE__ */ y("div", { className: "aq-event", children: [
      /* @__PURE__ */ y("div", { className: "aq-head", children: [
        /* @__PURE__ */ s("span", { className: "aq-event-name", children: a(c) }),
        /* @__PURE__ */ s(
          O,
          {
            label: l("removeEvent"),
            onClick: () => {
              h((v) => v.filter((k) => k !== c)), o(c, void 0);
            },
            children: "×"
          }
        )
      ] }),
      /* @__PURE__ */ s(Rt, { ctx: e, value: u[c], onChange: (v) => o(c, v) })
    ] }, c)),
    g.length > 0 && /* @__PURE__ */ y(
      "select",
      {
        className: "select aq-event-add",
        "aria-label": l("addEvent"),
        value: "",
        onChange: (c) => {
          const v = g.find((k) => k === c.target.value);
          v && h((k) => [...k, v]);
        },
        children: [
          /* @__PURE__ */ s("option", { value: "", children: l("addEvent") }),
          g.map((c) => /* @__PURE__ */ s("option", { value: c, children: a(c) }, c))
        ]
      }
    ),
    d
  ] });
}
function $t({ ctx: e, group: t }) {
  const { t: i, edit: n } = e;
  return /* @__PURE__ */ s(
    Re,
    {
      ctx: e,
      title: i("hooks"),
      hint: i("hooksHint"),
      hooks: pt,
      label: (a) => i(`hook.${a}`),
      value: t.rest.actions,
      onChange: (a, r) => n((o) => {
        const d = { ...j(o.rest.actions) };
        _(d, a, r), _(o.rest, "actions", Object.keys(d).length ? d : void 0);
      })
    },
    t.uid
  );
}
function $e(e) {
  return {
    key: `stage_${e}`,
    title: { key: L() },
    flow: "parallel",
    objectives: [],
    rest: {}
  };
}
function Lt({ ctx: e, group: t, index: i }) {
  const { t: n, edit: a } = e, r = t.quests[i], o = (c, v) => a((k) => c(k.quests[i]), v), d = t.quests.some((c, v) => v !== i && c.key === r.key), l = r.duration !== "" && !Nt.test(r.duration.replace(/\s/g, "").toLowerCase()), u = Object.keys(r.rest).filter((c) => c !== "actions" && c !== "giver"), m = r.rest.giver && typeof r.rest.giver == "object" ? r.rest.giver : {}, h = (c, v) => o((k) => {
    const p = { ...m };
    _(p, c, v.trim()), typeof p.npc == "string" && p.npc !== "" ? k.rest.giver = p : delete k.rest.giver;
  }), q = typeof m.npc == "string" && m.npc !== "", g = Tt(t.distribution);
  return /* @__PURE__ */ y(z, { children: [
    /* @__PURE__ */ y("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("general") }),
      /* @__PURE__ */ s(K, { ctx: e, label: n("title"), node: r.title }),
      /* @__PURE__ */ s(K, { ctx: e, label: n("description"), node: r.description, multiline: !0 }),
      /* @__PURE__ */ y("div", { className: "aq-row aq-top", children: [
        /* @__PURE__ */ s(N, { label: n("tier"), children: /* @__PURE__ */ y(
          "select",
          {
            className: "select",
            value: r.tier,
            onChange: (c) => o((v) => {
              v.tier = c.target.value;
            }),
            children: [
              /* @__PURE__ */ s("option", { value: "", children: n("noTier") }),
              t.tiers.map((c) => /* @__PURE__ */ s("option", { value: c.key, children: E(e.project, c.title.key, e.lang) || c.key }, c.key)),
              r.tier && !t.tiers.some((c) => c.key === r.tier) && /* @__PURE__ */ s("option", { value: r.tier, children: r.tier })
            ]
          }
        ) }),
        /* @__PURE__ */ s(
          N,
          {
            label: n("duration"),
            hint: /* @__PURE__ */ s("span", { className: l ? "aq-err" : "aq-hint", children: n(l ? "durationInvalid" : "durationHint") }),
            children: /* @__PURE__ */ s(
              "input",
              {
                className: "input",
                value: r.duration,
                placeholder: "24h",
                onChange: (c) => o((v) => {
                  v.duration = c.target.value.trim();
                })
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ y("div", { className: "aq-row aq-top", children: [
        /* @__PURE__ */ s(N, { label: n("giverNpc"), hint: /* @__PURE__ */ s("span", { className: "aq-hint", children: n("giverNpcHint") }), children: /* @__PURE__ */ s(
          "input",
          {
            className: "input aq-mono",
            value: typeof m.npc == "string" ? m.npc : "",
            onChange: (c) => h("npc", c.target.value)
          }
        ) }),
        q && /* @__PURE__ */ s(N, { label: n("giverConversation"), children: /* @__PURE__ */ s(
          "input",
          {
            className: "input aq-mono",
            value: typeof m.conversation == "string" ? m.conversation : "",
            onChange: (c) => h("conversation", c.target.value)
          }
        ) })
      ] }),
      q && g && /* @__PURE__ */ s("span", { className: "aq-warn", children: n("giverDistributed") }),
      /* @__PURE__ */ y("details", { className: "aq-fold", open: d || void 0, children: [
        /* @__PURE__ */ s("summary", { children: n("more") }),
        /* @__PURE__ */ s(
          N,
          {
            label: n("key"),
            hint: /* @__PURE__ */ s("span", { className: d ? "aq-err" : "aq-hint", children: n(d ? "keyTaken" : "questKeyHint") }),
            children: /* @__PURE__ */ s(
              "input",
              {
                className: "input aq-mono",
                value: r.key,
                onChange: (c) => o((v) => {
                  v.key = _e(c.target.value);
                }),
                onBlur: () => {
                  const c = Y(r.key);
                  c !== r.key && o((v) => {
                    v.key = c;
                  });
                }
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ y("section", { className: "aq-section", children: [
      /* @__PURE__ */ y("div", { className: "aq-head", children: [
        /* @__PURE__ */ y("span", { className: "aq-h", children: [
          n("stages"),
          " · ",
          r.stages.length
        ] }),
        /* @__PURE__ */ y(
          G,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => o((c) => {
              const v = F(
                `stage_${c.stages.length + 1}`,
                c.stages.map((k) => k.key)
              );
              c.stages.push({ ...$e(c.stages.length + 1), key: v });
            }),
            children: [
              "+ ",
              n("addStage")
            ]
          }
        )
      ] }),
      /* @__PURE__ */ s(
        ae,
        {
          ids: Se(r.stages.map((c) => c.key)),
          onMove: (c, v) => o((k) => de(k.stages, c, v)),
          className: "aq-stages",
          children: (c, v) => /* @__PURE__ */ s(
            Ot,
            {
              ctx: e,
              quest: r,
              stage: r.stages[c],
              si: c,
              handle: v,
              editQuest: o
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ s(
      Re,
      {
        ctx: e,
        title: n("questEvents"),
        hint: n("questEventsHint"),
        hooks: mt,
        label: (c) => n(`questHook.${c}`),
        value: r.rest.actions,
        onChange: (c, v) => o((k) => {
          const p = { ...j(k.rest.actions) };
          _(p, c, v), _(k.rest, "actions", Object.keys(p).length > 0 ? p : void 0);
        }),
        footer: u.length > 0 && /* @__PURE__ */ s("span", { className: "aq-hint", children: n("kept", { fields: u.join(", ") }) })
      },
      r.uid
    ),
    /* @__PURE__ */ y("section", { className: "aq-section", children: [
      /* @__PURE__ */ s("span", { className: "aq-h", children: n("preview") }),
      /* @__PURE__ */ s(Dt, { ctx: e, quest: r })
    ] })
  ] });
}
function Ot({
  ctx: e,
  quest: t,
  stage: i,
  si: n,
  handle: a,
  editQuest: r
}) {
  const { t: o } = e, [d, l] = re(null), u = (g) => r((c) => g(c.stages[n])), m = E(e.project, i.title.key, e.lang), h = i.flow || "parallel", q = t.stages.flatMap((g) => g.objectives.map((c) => c.key));
  return /* @__PURE__ */ y("div", { className: "aq-stage", children: [
    /* @__PURE__ */ y("div", { className: "aq-stage-head", children: [
      a,
      /* @__PURE__ */ s("span", { className: "aq-stage-n", children: n + 1 }),
      /* @__PURE__ */ s("div", { className: "aq-stage-title", children: /* @__PURE__ */ s(
        qe,
        {
          value: m,
          placeholder: o("stageTitle"),
          "aria-label": o("stage", { n: n + 1 }),
          onChange: (g) => e.edit(() => {
          }, [{ key: i.title.key, lang: e.lang, value: g }])
        }
      ) }),
      /* @__PURE__ */ s(
        O,
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
        onClick: () => u((c) => {
          c.flow = g;
        }),
        children: o(`flow.${g}`)
      },
      g
    )) }),
    i.objectives.length === 0 && /* @__PURE__ */ s("span", { className: "aq-hint", children: o("noObjectives") }),
    /* @__PURE__ */ s(
      ae,
      {
        ids: Se(i.objectives.map((g) => g.key)),
        onMove: (g, c) => u((v) => de(v.objectives, g, c)),
        className: "aq-objectives",
        children: (g, c) => {
          const v = i.objectives[g];
          return /* @__PURE__ */ s(
            It,
            {
              t: o,
              projectId: e.projectId,
              n: h === "sequential" ? `${n + 1}.${g + 1}` : "•",
              objective: v,
              open: d === v.key,
              onToggle: () => l(d === v.key ? null : v.key),
              keyTaken: q.filter((k) => k === v.key).length > 1,
              handle: c,
              onChange: (k) => u((p) => k(p.objectives[g])),
              onRename: (k) => {
                d === v.key && l(k);
              },
              onRemove: () => u((k) => {
                k.objectives.splice(g, 1);
              })
            }
          );
        }
      }
    ),
    /* @__PURE__ */ y(
      G,
      {
        size: "sm",
        variant: "ghost",
        className: "aq-add",
        onClick: () => {
          const g = it("block_break", q);
          r((c) => {
            c.stages[n].objectives.push({
              key: g,
              type: "block_break",
              params: we("block_break")
            });
          }), l(g);
        },
        children: [
          "+ ",
          o("addObjective")
        ]
      }
    )
  ] });
}
function It({
  t: e,
  projectId: t,
  n: i,
  objective: n,
  open: a,
  onToggle: r,
  keyTaken: o,
  handle: d,
  onChange: l,
  onRename: u,
  onRemove: m
}) {
  const h = I(n.type), q = h ? h.params : Object.keys(n.params).map((f) => ({ name: f, kind: "text" })), g = le(n.params), c = Ae(n.type, n.params), v = ft(n.type, n.params), k = o || v.length > 0, p = (f) => f.kind === "item" ? /* @__PURE__ */ s(
    Pt,
    {
      t: e,
      projectId: t,
      spec: f,
      params: n.params,
      onChange: (b) => l((x) => b(x.params))
    },
    f.name
  ) : /* @__PURE__ */ s(
    Mt,
    {
      t: e,
      spec: f,
      value: n.params[f.name],
      onChange: (b) => l((x) => _(x.params, f.name, b))
    },
    f.name
  );
  return /* @__PURE__ */ y("div", { className: `aq-obj${a ? " is-open" : ""}${k ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ y("div", { className: "aq-obj-line", children: [
      d,
      /* @__PURE__ */ y("button", { type: "button", className: "aq-obj-main", onClick: r, "aria-expanded": a, children: [
        /* @__PURE__ */ s("span", { className: "aq-obj-n", children: i }),
        /* @__PURE__ */ s("span", { className: "aq-obj-icon", "aria-hidden": !0, children: h?.icon ?? "?" }),
        /* @__PURE__ */ y("span", { className: "aq-obj-text", children: [
          Ce(e, n.type),
          g !== void 0 && /* @__PURE__ */ y("strong", { children: [
            " · ",
            String(g)
          ] }),
          c ? ` × ${c}` : g !== void 0 ? ` × ${e("any")}` : ""
        ] }),
        k && /* @__PURE__ */ s(
          "span",
          {
            className: "aq-obj-dot",
            title: o ? e("objectiveKeyTaken") : e("missing", {
              fields: v.map((f) => e(`param.${f}`)).join(", ")
            })
          }
        )
      ] }),
      /* @__PURE__ */ s(O, { label: e("remove"), onClick: m, children: "×" })
    ] }),
    a && /* @__PURE__ */ y("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ s(N, { label: e("type"), children: /* @__PURE__ */ y(
        "select",
        {
          className: "select",
          value: n.type,
          onChange: (f) => l((b) => {
            b.type = f.target.value, b.params = we(b.type);
          }),
          children: [
            je.map((f) => /* @__PURE__ */ y("option", { value: f.type, children: [
              f.icon,
              " ",
              e(`objective.${f.type}`)
            ] }, f.type)),
            !h && /* @__PURE__ */ s("option", { value: n.type, children: n.type })
          ]
        }
      ) }),
      /* @__PURE__ */ s("div", { className: "aq-row aq-wrap", children: q.filter((f) => !f.advanced).map(p) }),
      v.length > 0 && /* @__PURE__ */ s("span", { className: "aq-warn", children: e("missing", {
        fields: v.map((f) => e(`param.${f}`)).join(", ")
      }) }),
      /* @__PURE__ */ y("details", { className: "aq-fold", open: o || void 0, children: [
        /* @__PURE__ */ s("summary", { children: e("more") }),
        q.filter((f) => f.advanced).map(p),
        /* @__PURE__ */ s(
          N,
          {
            label: e("key"),
            hint: /* @__PURE__ */ s("span", { className: o ? "aq-err" : "aq-hint", children: e(o ? "objectiveKeyTaken" : "objectiveKeyHint") }),
            children: /* @__PURE__ */ s(
              "input",
              {
                className: "input aq-mono",
                value: n.key,
                onChange: (f) => {
                  const b = _e(f.target.value);
                  l((x) => {
                    x.key = b;
                  }), u(b);
                },
                onBlur: () => {
                  const f = Y(n.key);
                  f !== n.key && (l((b) => {
                    b.key = f;
                  }), u(f));
                }
              }
            )
          }
        )
      ] })
    ] })
  ] });
}
function Pt({
  t: e,
  projectId: t,
  spec: i,
  params: n,
  onChange: a
}) {
  const r = ce(n, i), o = Array.isArray(n.match) ? n.match : void 0, d = (l, u) => a((m) => ht(m, i, l, u));
  return /* @__PURE__ */ s(
    N,
    {
      label: e(`param.${i.name}`),
      hint: Object.keys(r).length === 0 ? /* @__PURE__ */ s("span", { className: "aq-hint", children: e("anyItem") }) : void 0,
      children: /* @__PURE__ */ s(
        Fe,
        {
          projectId: t,
          value: r,
          match: o,
          onChange: (l) => d(l, o),
          onMatchChange: (l) => d(r, l)
        }
      )
    }
  );
}
function Mt({
  t: e,
  spec: t,
  value: i,
  onChange: n
}) {
  const a = e(`param.${t.name}`), r = t.required && (i === void 0 || i === ""), o = typeof i == "string" || typeof i == "number" ? String(i) : "";
  if (t.kind === "int")
    return /* @__PURE__ */ s($, { label: a, value: i, onChange: n });
  const d = r ? /* @__PURE__ */ s("span", { className: "aq-warn", children: e("required") }) : t.name === "itemKey" ? /* @__PURE__ */ s("span", { className: "aq-hint", children: e("itemKeyHint") }) : void 0;
  if (t.kind === "material")
    return /* @__PURE__ */ s(N, { label: a, hint: d, children: /* @__PURE__ */ s(
      Be,
      {
        value: o,
        placeholder: e("any"),
        "aria-label": a,
        onChange: (u) => n(u.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const l = t.kind === "entity";
  return /* @__PURE__ */ y(N, { label: a, hint: d, children: [
    /* @__PURE__ */ s(
      "input",
      {
        className: `input${l ? " aq-mono" : ""}`,
        list: l ? "aq-entities" : void 0,
        value: o,
        placeholder: l ? e("any") : "",
        onChange: (u) => n(l ? u.target.value.toUpperCase().replace(/\s+/g, "_") : u.target.value)
      }
    ),
    l && /* @__PURE__ */ s("datalist", { id: "aq-entities", children: yt.map((u) => /* @__PURE__ */ s("option", { value: u }, u)) })
  ] });
}
function Dt({ ctx: e, quest: t }) {
  const { t: i, project: n, lang: a } = e, r = (o) => J(i, o);
  return /* @__PURE__ */ y("div", { className: "aq-preview", children: [
    /* @__PURE__ */ s("span", { className: "aq-preview-title", children: E(n, t.title.key, a) || t.key }),
    E(n, t.description.key, a) && /* @__PURE__ */ s("span", { className: "aq-preview-line", children: E(n, t.description.key, a) }),
    t.stages.map((o, d) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ y("span", { className: "aq-preview-stage", children: [
        t.stages.length > 1 && /* @__PURE__ */ s("span", { className: "aq-preview-line", children: E(n, o.title.key, a) || i("stage", { n: d + 1 }) }),
        o.objectives.map((l) => /* @__PURE__ */ y("span", { className: "aq-preview-line", children: [
          "• ",
          r(l)
        ] }, l.key))
      ] }, d)
    ))
  ] });
}
function Ht({ className: e }) {
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
        /* @__PURE__ */ s("path", { d: "M15 12h-5" }),
        /* @__PURE__ */ s("path", { d: "M15 8h-5" }),
        /* @__PURE__ */ s("path", { d: "M19 17V5a2 2 0 0 0-2-2H4" }),
        /* @__PURE__ */ s("path", { d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" })
      ]
    }
  );
}
const Kt = {
  kind: se,
  dir: xe,
  schemaVersion: oe,
  // Created in the module's folder only (SDK 1.8); a group already elsewhere still loads.
  projects: [nt],
  // Data with no links: one "Quests" entry and page instead of a node per group (SDK 1.9).
  collection: { labels: et },
  // A group's id is its key on the server (`quest_group_key`): typed by hand, no prefix.
  label: pe.en,
  labels: pe,
  icon: Ht,
  component: At,
  title: (e, { project: t, lang: i }) => E(t, e.title.key, i),
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
  parse: (e, t) => at(e, t),
  serialize: (e, t) => lt(e, t),
  ltextSites: (e) => ct(e),
  board: {
    size: { width: 300, height: 48 },
    accent: gt,
    // The group's quests, one selectable row each: the Properties panel opens the one clicked.
    items: (e, { project: t, lang: i }) => bt(e, t, i),
    summary: (e, { lang: t }) => xt(e, t)
  }
}, fe = "quests:groups", ye = "quests:quests", Gt = "quests:active";
function Qt(e) {
  return e.startsWith("msquests:") ? `quests:${e.slice(9)}` : e;
}
const ge = {
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
}, ve = { en: "Available", fr: "Disponible" };
function Ut(e, t, i) {
  const n = Qt(t);
  if (n !== fe && n !== ye && n !== Gt) return null;
  const a = e.documents?.[se];
  if (!a || a.length === 0) return null;
  const r = e.defaultLang ?? "en", o = i?.serverRows, d = i?.params?.group || void 0, l = [...a].sort((m, h) => m.id < h.id ? -1 : m.id > h.id ? 1 : 0);
  if (n === fe) {
    const m = ne(o, "key");
    return l.map((h) => zt(h, m.get(h.id), r));
  }
  if (n === ye) {
    const m = ne(o, "id");
    return l.filter((h) => !d || h.id === d).flatMap((h) => h.quests.map((q) => Le(h, q, m.get(`${h.id}:${q.key}`), r)));
  }
  if (!o) return null;
  const u = new Map(a.map((m) => [m.id, m]));
  return o.flatMap((m) => {
    const h = u.get(C(m.group));
    if (!h) return [m];
    const q = h.quests.find((g) => g.key === C(m.quest_key));
    return q ? [Wt(q, m, r)] : [];
  });
}
function zt(e, t, i) {
  const n = ne(V(t?.quests), "key");
  return {
    key: e.id,
    name: e.title,
    description: e.description,
    actor_type: e.actorType,
    max_active: ie(e.limits.max_active, 1),
    max_per_period: ie(e.limits.max_per_period, 0),
    rotatable: e.rotation.enabled === !0,
    // The period follows the server's clock and zone: its value stands until a deploy.
    period_end: t?.period_end ?? 0,
    active_count: t?.active_count ?? 0,
    completed_count: t?.completed_count ?? 0,
    can_rotate: t?.can_rotate ?? !1,
    quests: e.quests.map((a) => Le(e, a, n.get(a.key), i))
  };
}
function Le(e, t, i, n) {
  const a = e.tiers.find((r) => r.key === t.tier);
  return {
    id: `${e.id}:${t.key}`,
    group: e.id,
    key: t.key,
    name: t.title,
    description: t.description,
    duration: Xt(t.duration),
    tier: t.tier,
    tier_name: a ? a.title : "",
    assigned: i?.assigned ?? !1,
    status_key: i?.status_key ?? "NOT_STARTED",
    status: i?.status ?? ve[n.slice(0, 2)] ?? ve.en,
    can_start: i?.can_start ?? !1,
    start_blocker: i?.start_blocker ?? "",
    start_blocker_label: i?.start_blocker_label ?? "",
    // `reference` in `QuestRows.questRow`: the attempt the server holds for this player.
    ...Oe(t, i?.assigned === !0 ? i : void 0, n)
  };
}
function Oe(e, t, i) {
  const n = t ? Ft(t) : void 0, a = Bt(e, n, i), r = a.find((d) => d.active === !0), o = r ? r.objectives.find((d) => d.done !== !0) : void 0;
  return {
    objective_name: o?.name ?? "",
    objective_progress: o?.progress ?? 0,
    objective_target: o?.target ?? 0,
    progress_ratio: n ? Ie(a.map((d) => d.progress_ratio)) : 0,
    stage_index: a.filter((d) => d.completed === !0).length,
    stage_name: r?.name ?? "",
    stage_flow: r?.flow ?? "",
    stages: a.map((d) => ({ ...d, objectives: d.objectives.map(({ done: l, ...u }) => u) }))
  };
}
function Ft(e) {
  const t = /* @__PURE__ */ new Map(), i = [
    ...V(e.objectives),
    ...V(e.stages).flatMap((n) => V(n.objectives))
  ];
  for (const n of i) {
    const a = C(n.status_key);
    t.set(C(n.key), {
      progress: ie(n.progress, 0),
      flag: a === "COMPLETED" || a === "FAILED" ? a : "",
      row: n
    });
  }
  return t;
}
function Bt(e, t, i) {
  const n = e.stages.map((r, o) => {
    const d = r.objectives.map((l) => Vt(l, t?.get(l.key), i));
    return {
      key: r.key,
      name: r.title,
      flow: Yt(r),
      index: o,
      // `QuestStage.isCompleted`: all objectives done, so an empty stage is.
      completed: t !== void 0 && d.every((l) => l.done),
      active: !1,
      progress_ratio: t ? Ie(d.map((l) => l.progress_ratio)) : 0,
      objectives: d
    };
  });
  if (!t) return n;
  const a = n.find((r) => r.completed !== !0);
  if (a) {
    a.active = !0;
    const r = a.objectives, o = r.find((d) => d.done !== !0);
    for (const d of r)
      d.status_key === "PENDING" && (a.flow !== "SEQUENTIAL" || d === o) && (d.status_key = "IN_PROGRESS");
  }
  return n;
}
function Vt(e, t, i) {
  const n = Zt(e), a = t?.progress ?? 0, r = t?.row, o = r && r.type === e.type && r.target === n;
  return {
    key: e.key,
    name: o && typeof r.name == "string" ? r.name : Jt(e, i),
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
function Wt(e, t, i) {
  const n = Oe(e, t, i), a = n.stages;
  return {
    ...t,
    name: e.title,
    description: e.description,
    stage_index: n.stage_index,
    stage_count: e.stages.length,
    stage_name: n.stage_name,
    stage_flow: n.stage_flow,
    progress_ratio: n.progress_ratio,
    objective_name: n.objective_name,
    objective_progress: n.objective_progress,
    objective_target: n.objective_target,
    objectives: a.flatMap((r) => r.objectives),
    stages: a
  };
}
function Jt(e, t) {
  const n = (ge[t.slice(0, 2)] ?? ge.en)[e.type];
  if (!n) return e.type;
  const a = e.params, r = {
    amount: String(a.amount ?? ""),
    distance: String(a.distance ?? ""),
    command: C(a.command),
    value: C(a.value),
    // Bukkit's translation keys, as the objective configs write them (`<lang:…>`).
    crop: B("block", a.crop),
    entity_type: B("entity", a.entity_type),
    material: e.type === "block_break" ? B("block", a.material) : be(e),
    fish_type: be(e)
  };
  return n.replace(/%([a-z_]+)%/g, (o, d) => r[d] ?? "");
}
function B(e, t) {
  const i = C(t).toLowerCase().replace(/^minecraft:/, "");
  return i === "" ? "" : `<lang:${e}.minecraft.${i}>`;
}
function be(e) {
  const t = I(e.type)?.params.find((r) => r.kind === "item");
  if (!t) return "";
  const i = ce(e.params, t), n = i.title;
  if (typeof n == "string" && n.trim() !== "") return n;
  const a = C(i.material);
  return /^(minecraft:)?[a-z_0-9]+$/i.test(a) && !a.includes(":") ? B("item", a) : a || Ee(i);
}
function Zt(e) {
  const t = le(e.params);
  if (t === void 0) return 1;
  const i = Number(t);
  return Number.isFinite(i) ? i : 1;
}
function Yt(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function Xt(e) {
  const t = e.trim().toLowerCase().replace(/ /g, "");
  if (t === "") return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const i = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!i) return 0;
  const [, n, a, r, o] = i;
  return Number(n ?? 0) * 86400 + Number(a ?? 0) * 3600 + Number(r ?? 0) * 60 + Number(o ?? 0);
}
function ne(e, t) {
  return new Map((e ?? []).map((i) => [C(i[t]), i]));
}
function V(e) {
  return Array.isArray(e) ? e.filter((t) => t && typeof t == "object") : [];
}
function Ie(e) {
  return e.length === 0 ? 0 : e.reduce((t, i) => t + i, 0) / e.length;
}
function ie(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function C(e) {
  return typeof e == "string" ? e : "";
}
const en = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: Ve,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  documents: [Kt],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: Ut
}, rn = { ...en, sdk: "1.10.0" };
export {
  rn as default
};
