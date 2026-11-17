import { createModuleI18n as Ze, fieldText as Xe, newTextKey as D, injectModuleStyles as Te, useServerDocuments as Je, textValue as w, useStatsRead as Y, statsQuery as ve, StatCard as et, StatsPanel as re, Funnel as tt, SortableTable as qe, statsBreakdown as nt, useProject as st, useContentLang as at, Button as B, selectDocumentItem as it, SortableList as pe, updateDocument as rt, useUiLang as ot, MiniMessageInput as Ce, ActionChainEditor as lt, ItemInput as ct, MaterialInput as dt, SDK_VERSION as ut } from "@artisan/editor-sdk";
import { jsx as r, jsxs as f, Fragment as U } from "react/jsx-runtime";
import { useState as me, useEffect as pt } from "react";
const V = {
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
  any: "any",
  anyItem: "Empty: any item counts.",
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
}, se = {
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
  any: "n'importe lequel",
  anyItem: "Vide : n’importe quel item compte.",
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
}, ke = { en: V.kindLabel, fr: se.kindLabel }, mt = { en: V.collection, fr: se.collection }, fe = Ze({ en: V, fr: se });
function Re(e) {
  const t = e === "fr" ? se : V;
  return (s, n) => {
    const i = t[s] ?? V[s] ?? s;
    return n ? i.replace(/\{\{(\w+)\}\}/g, (a, o) => String(n[o] ?? a)) : i;
  };
}
const ae = "quest_group", Le = "quest_groups", ft = "quests", he = "quest_group/v1", ce = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function te(e = Date.now()) {
  let t = "", s = e;
  for (let a = 0; a < 10; a++)
    t = ce[s % 32] + t, s = Math.floor(s / 32);
  const n = new Uint8Array(16);
  crypto.getRandomValues(n);
  let i = "";
  for (let a = 0; a < 16; a++) i += ce[n[a] % 32];
  return t + i;
}
function Z(e, t) {
  const s = new Set(t);
  if (!s.has(e)) return e;
  for (let n = 2; ; n++) if (!s.has(`${e}_${n}`)) return `${e}_${n}`;
}
function ht(e, t) {
  const s = new Set(t), n = new Uint8Array(4);
  for (; ; ) {
    crypto.getRandomValues(n);
    const i = Array.from(n, (o) => ce[o % 32].toLowerCase()).join(""), a = `${ie(e)}_${i}`;
    if (!s.has(a)) return a;
  }
}
function Oe(e) {
  return e.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
function ie(e) {
  return e.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "quest";
}
function j(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? { ...e } : {};
}
function oe(e) {
  return Array.isArray(e) ? e : [];
}
function E(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? String(e) : "";
}
function F(e, ...t) {
  const s = { ...e };
  for (const n of t) delete s[n];
  return s;
}
function gt(e, t) {
  const s = {}, n = [];
  function i(c) {
    if (c && typeof c == "object" && !Array.isArray(c)) {
      const m = D(), q = {};
      for (const [y, b] of Object.entries(c)) q[y] = E(b);
      return s[m] = q, { key: m };
    }
    const u = typeof c == "string" ? /^\{i18n:(.+)\}$/.exec(c) : null;
    if (u) {
      const m = t.translations?.[u[1]];
      return m && (s[u[1]] = { ...m }), { key: u[1] };
    }
    const d = D();
    return s[d] = c == null || c === "" ? {} : { [t.lang]: E(c) }, { key: d };
  }
  const a = Object.entries(j(e.tiers)).map(([c, u]) => {
    const d = j(u);
    return { key: c, title: i(d.title), rest: F(d, "title") };
  }), o = oe(e.quests).map((c, u) => {
    const d = j(c), m = oe(d.stages).map((q, y) => {
      const b = j(q), x = E(b.flow).toLowerCase();
      return {
        key: E(b.key) || `stage_${y + 1}`,
        title: i(b.title),
        flow: x === "parallel" || x === "sequential" ? x : "",
        objectives: oe(b.objectives).map((p, v) => {
          const h = j(p);
          return {
            key: E(h.key) || `objective_${v + 1}`,
            type: E(h.type),
            params: F(h, "key", "type")
          };
        }),
        rest: F(b, "key", "title", "flow", "objectives")
      };
    });
    return {
      key: E(d.key) || `quest_${u + 1}`,
      uid: E(d.uid) || te(),
      tier: E(d.tier),
      title: i(d.title),
      description: i(d.description),
      duration: E(d.duration),
      stages: m,
      rest: yt(d)
    };
  }), l = {
    id: E(e.id),
    projectId: t.projectId,
    uid: E(e.uid) || te(),
    title: i(e.title),
    description: i(e.description),
    actorType: E(e.actor_type) || "player",
    reset: j(e.reset),
    limits: j(e.limits),
    rotation: j(e.rotation),
    distribution: j(e.distribution),
    tiers: a,
    quests: o,
    rest: Ie(F(
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
  return e.schema !== void 0 && e.schema !== he && n.push(`schema: ${String(e.schema)}`), { doc: l, i18nKeys: s, unsupported: n };
}
function Ie(e) {
  return e.on !== void 0 && (e.actions == null && (e.actions = e.on), delete e.on), e;
}
function yt(e) {
  const t = Ie(
    F(e, "key", "uid", "tier", "title", "description", "duration", "stages", "reward_display")
  );
  if (t.rewards !== void 0) {
    const s = j(t.actions);
    s.complete == null && (t.actions = { ...s, complete: t.rewards }), delete t.rewards;
  }
  return t;
}
function bt(e) {
  return typeof e == "string" ? e === "" : Object.values(e).every((t) => t === "");
}
function I(e) {
  const t = {};
  for (const [s, n] of Object.entries(e))
    n == null || n === "" || Array.isArray(n) && n.length === 0 || typeof n == "object" && !Array.isArray(n) && Object.keys(n).length === 0 || (t[s] = n);
  return t;
}
const vt = [
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
function qt(e, t) {
  const s = (u) => Xe(t, u.key), n = (u) => {
    const d = s(u);
    return bt(d) ? void 0 : d;
  }, i = {};
  for (const u of e.tiers) i[u.key] = { ...u.rest, title: s(u.title) };
  const a = e.quests.map(
    (u) => I({
      key: u.key,
      uid: u.uid,
      tier: u.tier,
      title: s(u.title),
      description: n(u.description),
      duration: u.duration,
      ...u.rest,
      stages: u.stages.map(
        (d) => I({
          key: d.key,
          title: n(d.title),
          flow: d.flow,
          ...d.rest,
          objectives: d.objectives.map((m) => ({ key: m.key, type: m.type, ...m.params }))
        })
      )
    })
  ), o = {
    ...e.rest,
    id: e.id,
    schema: he,
    uid: e.uid,
    title: s(e.title),
    description: n(e.description),
    actor_type: e.actorType,
    reset: I(e.reset),
    limits: I(e.limits),
    rotation: I(e.rotation),
    distribution: I(e.distribution),
    tiers: i,
    quests: a
  }, l = {};
  for (const u of vt) u in o && (l[u] = o[u]);
  for (const u of Object.keys(o)) u in l || (l[u] = o[u]);
  const c = I(l);
  return c.quests = a, c;
}
function* kt(e) {
  const t = `${Le}.${e.id}`;
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
  const s = /* @__PURE__ */ new Set();
  for (let n = 0; n < e.quests.length; n++) {
    const i = e.quests[n], a = s.has(i.uid) ? `${i.uid}_${n}` : i.uid;
    s.add(i.uid);
    const o = `${t}.quests.${a}`;
    yield {
      lText: i.title,
      key: `${o}.title`,
      path: `quests[${n}].title`,
      kind: "quest.title"
    }, yield {
      lText: i.description,
      key: `${o}.description`,
      path: `quests[${n}].description`,
      kind: "quest.description"
    };
    const l = /* @__PURE__ */ new Set();
    for (let c = 0; c < i.stages.length; c++) {
      const u = i.stages[c], d = l.has(u.key) ? `${u.key}_${c}` : u.key;
      l.add(u.key), yield {
        lText: u.title,
        key: `${o}.stages.${d}.title`,
        path: `quests[${n}].stages[${c}].title`,
        kind: "quest.stage"
      };
    }
  }
}
function xe(e) {
  return !!e && typeof e == "object" && !Array.isArray(e) && "type" in e;
}
function xt(e) {
  const t = Array.isArray(e) ? e : e == null ? [] : [e];
  return {
    chain: t.filter((s) => !xe(s)),
    legacy: t.filter(xe)
  };
}
function _e(e, t) {
  const s = [...e, ...t];
  return s.length ? s : void 0;
}
function _t(e) {
  const t = String(e.type), s = e.command ?? e.message ?? e.title ?? e.material;
  return typeof s == "string" ? `${t} · ${s}` : t;
}
const wt = [
  "distribution",
  "actor_load",
  "quest_start",
  "objective_progress",
  "objective_complete",
  "quest_complete",
  "period_complete"
], Nt = ["start", "objective_progress", "objective_complete", "complete"], Me = {
  started: "quests:started",
  completed: "quests:completed",
  abandoned: "quests:abandoned",
  expired: "quests:expired"
}, X = Object.keys(Me), jt = "quests:progress", St = "quests:stuck", H = (e) => typeof e == "number" && Number.isFinite(e) ? e : 0;
function Et(e) {
  return e.map((t) => ({
    quest: String(t.quest ?? ""),
    started: H(t.started),
    inProgress: H(t.in_progress),
    completed: H(t.completed),
    medianSeconds: typeof t.median_seconds == "number" ? t.median_seconds : null
  }));
}
function At(e) {
  return e.map((t) => ({
    quest: String(t.quest ?? ""),
    stage: String(t.stage ?? ""),
    players: H(t.players),
    medianSeconds: H(t.median_seconds),
    longestSeconds: H(t.longest_seconds)
  }));
}
function $t(e, t, s) {
  const n = (a, o) => t[a]?.find((l) => l.value === o)?.count ?? 0, i = e.map((a) => a.key);
  for (const a of X)
    for (const o of t[a] ?? []) i.includes(o.value) || i.push(o.value);
  return i.map((a) => {
    const o = n("started", a), l = n("completed", a), c = s.find((u) => u.quest === a);
    return {
      key: a,
      started: o,
      completed: l,
      abandoned: n("abandoned", a),
      expired: n("expired", a),
      unfinished: o > 0 ? Math.max(0, 1 - l / o) : null,
      inProgress: c?.inProgress ?? 0,
      medianSeconds: c?.medianSeconds ?? null
    };
  });
}
const we = (e) => (e ?? []).reduce((t, s) => t + s.count, 0);
function Tt(e) {
  return e.distribution.strategy === "sequential";
}
function Ct(e, t) {
  const s = e[0];
  if (!s) return [];
  const n = (a) => t.find((o) => o.quest === a), i = n(s.key)?.started ?? 0;
  return i === 0 ? [] : [
    { key: s.key, kind: "started", value: i },
    ...e.map((a) => ({ key: a.key, kind: "completed", value: n(a.key)?.completed ?? 0 }))
  ];
}
function Rt(e, t = "d") {
  const s = Math.max(0, Math.round(e));
  if (s < 60) return `${s} s`;
  const n = Math.round(s / 60);
  if (n < 60) return `${n} min`;
  const i = Math.floor(n / 60);
  if (i < 24) return n % 60 === 0 ? `${i} h` : `${i} h ${String(n % 60).padStart(2, "0")}`;
  const a = Math.floor(i / 24);
  return i % 24 === 0 ? `${a} ${t}` : `${a} ${t} ${i % 24} h`;
}
function Lt(e, t, s) {
  if (t === void 0 || t === 0) return null;
  const n = (e - t) / t, i = new Intl.NumberFormat(s, { style: "percent", maximumFractionDigits: 0 }).format(Math.abs(n));
  return `${n >= 0 ? "▲" : "▼"} ${i}`;
}
const Pe = `
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
.aq-stats { display: flex; flex-direction: column; gap: 16px; color: var(--text); }
.aq-stats-pick { display: flex; align-items: center; gap: 10px; }
.aq-stats-pick .select { height: 32px; padding: 5px 10px; font-size: 13px; min-width: 220px; }
.aq-stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; }
.aq-stats-empty { padding: 24px 0; text-align: center; color: var(--text-mut); font-size: 13px; }
`;
function Ot(e) {
  Te("msquests", Pe);
  const t = fe(), s = Je(ae).map((a) => ({
    group: a.document,
    project: a.project
  })), n = s.find((a) => a.group.id === e.focus) ?? s[0];
  if (!n) return /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: t("stats.noGroup") });
  const i = (a) => w(a.project, a.group.title.key, e.lang) || a.group.id;
  return /* @__PURE__ */ f("div", { className: "aq-stats", children: [
    /* @__PURE__ */ f("label", { className: "aq-stats-pick", children: [
      /* @__PURE__ */ r("span", { className: "aq-h", children: t("stats.group") }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: n.group.id,
          onChange: (a) => e.onFocus(a.target.value),
          children: s.map((a) => /* @__PURE__ */ r("option", { value: a.group.id, children: i(a) }, a.group.id))
        }
      )
    ] }),
    /* @__PURE__ */ r(It, { ...e, group: n.group, project: n.project }, n.group.id)
  ] });
}
function It({
  serverId: e,
  period: t,
  player: s,
  compare: n,
  lang: i,
  group: a,
  project: o
}) {
  const l = fe(), c = `${e}|${a.id}`, u = (g, $) => Promise.all(
    X.map(
      (A) => nt(e, { event: Me[A], from: g, to: $, player: s, dims: { group: a.id } }, "quest")
    )
  ).then((A) => Object.fromEntries(X.map((O, W) => [O, A[W] ?? []]))), d = Y(
    `${c}|${t.from}|${t.to}|${s ?? ""}`,
    () => u(t.from, t.to)
  ), m = Y(
    `${c}|${t.previous.from}|${t.previous.to}|${s ?? ""}|${n}`,
    () => n ? u(t.previous.from, t.previous.to) : Promise.resolve(void 0)
  ), q = Y(
    `${c}|progress`,
    () => ve(e, jt, { group: a.id }).then((g) => Et(g.rows))
  ), y = Y(
    `${c}|stuck`,
    () => ve(e, St, { group: a.id }).then((g) => At(g.rows))
  ), b = (g) => {
    const $ = a.quests.find((A) => A.key === g);
    return $ && w(o, $.title.key, i) || g;
  }, x = (g, $) => {
    const A = a.quests.find((O) => O.key === g)?.stages.find((O) => O.key === $);
    return A && w(o, A.title.key, i) || $;
  }, p = (g) => new Intl.NumberFormat(i).format(g), v = (g) => new Intl.NumberFormat(i, { style: "percent", maximumFractionDigits: 0 }).format(g), h = (g) => g === null ? "–" : Rt(g, l("stats.day"));
  if (d.error) return /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.unavailable") });
  const k = $t(a.quests, d.data ?? {}, q.data ?? []), _ = Tt(a) ? Ct(a.quests, q.data ?? []) : [], C = (g) => g === void 0 ? null : l(
    g === "server_offline" ? "stats.offline" : g === "unknown_query" ? "stats.notComputed" : "stats.unavailable"
  ), L = {
    started: void 0,
    completed: !0,
    abandoned: !1,
    expired: !1
  };
  return /* @__PURE__ */ f(U, { children: [
    /* @__PURE__ */ r("div", { className: "aq-stats-cards", children: X.map((g) => {
      const $ = we(d.data?.[g]), A = Lt($, m.data ? we(m.data[g]) : void 0, i), O = A?.startsWith("▲") ?? !1, W = L[g];
      return /* @__PURE__ */ r(
        et,
        {
          label: l(`stats.${g}`),
          value: d.data ? p($) : "…",
          sub: l("stats.overPeriod"),
          trend: A === null ? void 0 : {
            label: A,
            tone: W === void 0 ? "default" : O === W ? "positive" : "negative"
          }
        },
        g
      );
    }) }),
    _.length > 0 && /* @__PURE__ */ r(re, { title: l("stats.funnel"), hint: l("stats.allTime"), children: /* @__PURE__ */ r(
      tt,
      {
        steps: _.map((g) => ({
          id: `${g.kind}:${g.key}`,
          label: l(g.kind === "started" ? "stats.funnelStarted" : "stats.funnelCompleted", {
            quest: b(g.key)
          }),
          value: g.value
        })),
        formatValue: p,
        formatShare: v
      }
    ) }),
    /* @__PURE__ */ f(re, { title: l("stats.quests"), hint: l("stats.questsHint"), children: [
      k.length === 0 ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.noQuestYet") }) : /* @__PURE__ */ r(
        qe,
        {
          rows: k,
          rowId: (g) => g.key,
          initialSort: "unfinished",
          columns: Mt(l, b, p, v, h)
        }
      ),
      q.error && /* @__PURE__ */ r("p", { className: "aq-hint", children: C(q.error) })
    ] }),
    /* @__PURE__ */ r(re, { title: l("stats.stuck"), hint: l("stats.stuckHint"), children: y.error ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: C(y.error) }) : y.data && y.data.length === 0 ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.nobodyStuck") }) : /* @__PURE__ */ r(
      qe,
      {
        rows: y.data ?? [],
        rowId: (g) => `${g.quest}/${g.stage}`,
        initialSort: "players",
        columns: [
          { id: "quest", label: l("stats.quest"), value: (g) => b(g.quest) },
          { id: "stage", label: l("stats.stage"), value: (g) => x(g.quest, g.stage) },
          {
            id: "players",
            label: l("stats.waiting"),
            align: "right",
            value: (g) => g.players,
            render: (g) => p(g.players)
          },
          {
            id: "median",
            label: l("stats.medianWait"),
            align: "right",
            value: (g) => g.medianSeconds,
            render: (g) => h(g.medianSeconds)
          },
          {
            id: "longest",
            label: l("stats.longestWait"),
            align: "right",
            value: (g) => g.longestSeconds,
            render: (g) => h(g.longestSeconds)
          }
        ]
      }
    ) })
  ] });
}
function Mt(e, t, s, n, i) {
  const a = (o, l) => ({
    id: o,
    label: l,
    align: "right",
    value: (c) => c[o],
    render: (c) => s(c[o])
  });
  return [
    { id: "quest", label: e("stats.quest"), value: (o) => t(o.key) },
    a("started", e("stats.started")),
    a("completed", e("stats.completed")),
    {
      id: "unfinished",
      label: e("stats.unfinished"),
      align: "right",
      // A quest nobody started sorts last: it has nothing to say about where players stop.
      value: (o) => o.unfinished ?? -1,
      render: (o) => o.unfinished === null ? "–" : n(o.unfinished)
    },
    a("abandoned", e("stats.abandoned")),
    a("expired", e("stats.expired")),
    a("inProgress", e("stats.inProgress")),
    {
      id: "median",
      label: e("stats.median"),
      align: "right",
      value: (o) => o.medianSeconds ?? -1,
      render: (o) => i(o.medianSeconds)
    }
  ];
}
const Pt = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
}, Dt = /^\d+$/;
function le(e, t, s) {
  const n = String(s).padStart(2, "0");
  return e === "fr" ? s === 0 ? `${t} h` : `${t} h ${n}` : `${String(t).padStart(2, "0")}:${n}`;
}
function R(e, t, s) {
  return Dt.test(e) && Number(e) >= t && Number(e) <= s;
}
function Ne(e) {
  return e.trim().split(/\s+/).length === 5;
}
function Ht(e, t) {
  const s = t === "fr", n = e.trim().split(/\s+/);
  if (n.length !== 5) return null;
  const [i, a, o, l, c] = n;
  if (l !== "*") return null;
  const u = /^\*\/(\d+)$/;
  if (o === "*" && c === "*") {
    if (R(i, 0, 59) && R(a, 0, 23))
      return s ? `tous les jours à ${le(t, +a, +i)}` : `every day at ${le(t, +a, +i)}`;
    const m = u.exec(a);
    if (R(i, 0, 59) && m)
      return s ? `toutes les ${m[1]} h, à la minute ${i}` : `every ${m[1]} hours, at minute ${i}`;
    if (R(i, 0, 59) && a === "*")
      return s ? `toutes les heures, à la minute ${i}` : `every hour, at minute ${i}`;
    const q = u.exec(i);
    return q && a === "*" ? s ? `toutes les ${q[1]} minutes` : `every ${q[1]} minutes` : null;
  }
  if (!R(i, 0, 59) || !R(a, 0, 23)) return null;
  const d = le(t, +a, +i);
  if (o === "*" && R(c, 0, 7)) {
    const m = Pt[s ? "fr" : "en"][Number(c) % 7];
    return s ? `chaque ${m} à ${d}` : `every ${m} at ${d}`;
  }
  return c === "*" && R(o, 1, 31) ? s ? `le ${o === "1" ? "1er" : o} de chaque mois à ${d}` : `on day ${o} of each month at ${d}` : null;
}
function G(e, t, s) {
  const n = /* @__PURE__ */ new Set();
  for (const i of e.split(",")) {
    const a = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(i);
    if (!a) return null;
    const o = a[4] ? Number(a[4]) : 1, l = a[1] === "*" ? t : Number(a[2]), c = a[1] === "*" ? s : a[3] ? Number(a[3]) : a[4] ? s : l;
    if (o < 1 || l < t || c > s || l > c) return null;
    for (let u = l; u <= c; u += o) n.add(u);
  }
  return n;
}
function Qt(e, t) {
  const s = e.trim().split(/\s+/);
  if (s.length !== 5) return null;
  const n = G(s[0], 0, 59), i = G(s[1], 0, 23), a = G(s[2], 1, 31), o = G(s[3], 1, 12), l = G(s[4], 0, 7);
  if (!n || !i || !a || !o || !l) return null;
  l.has(7) && l.add(0);
  const c = s[2] === "*", u = s[4] === "*", d = (y) => c && u ? !0 : c ? l.has(y.getDay()) : u ? a.has(y.getDate()) : a.has(y.getDate()) || l.has(y.getDay()), m = new Date(t.getTime());
  m.setSeconds(0, 0), m.setMinutes(m.getMinutes() + 1);
  const q = t.getTime() + 366 * 24 * 3600 * 1e3;
  for (; m.getTime() <= q; ) {
    if (!o.has(m.getMonth() + 1) || !d(m)) {
      m.setDate(m.getDate() + 1), m.setHours(0, 0, 0, 0);
      continue;
    }
    if (!i.has(m.getHours())) {
      m.setHours(m.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (n.has(m.getMinutes())) return m;
    m.setMinutes(m.getMinutes() + 1);
  }
  return null;
}
const M = { name: "amount", kind: "int", required: !0 }, De = [
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
      { name: "itemKey", kind: "text", advanced: !0 }
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
function K(e) {
  return De.find((t) => t.type === e);
}
function He(e) {
  const t = {};
  for (const s of K(e)?.params ?? [])
    s.kind === "int" && (t[s.name] = 1);
  return t;
}
function ge(e) {
  return e.amount ?? e.distance;
}
function ye(e, t) {
  const s = e[t.name];
  if (s && typeof s == "object" && !Array.isArray(s)) return s;
  const n = t.legacy ? e[t.legacy] : void 0;
  return typeof n == "string" && n !== "" ? { material: n } : {};
}
function Kt(e, t, s, n) {
  t.legacy && delete e[t.legacy];
  const i = !s || Object.keys(s).length === 0;
  i ? delete e[t.name] : e[t.name] = s, i || n === void 0 ? delete e.match : e.match = n;
}
function Qe(e) {
  const t = e.title;
  if (typeof t == "string" && t.trim() !== "") return t.replace(/<[^>]*>/g, "");
  const s = e.material ?? e.item;
  return typeof s == "string" ? s : "";
}
function Ke(e, t) {
  const s = K(e);
  return s ? s.params.filter((n) => n.kind !== "int").map((n) => n.kind === "item" ? Qe(ye(t, n)) : t[n.name]).filter((n) => typeof n == "string" && n !== "").join(" = ") : Object.keys(t).map((n) => t[n]).filter((n) => typeof n == "string" && n !== "").join(" = ");
}
function Gt(e, t) {
  return (K(e)?.params ?? []).filter((s) => s.required && (t[s.name] === void 0 || t[s.name] === "")).map((s) => s.name);
}
const Ft = [
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
], Ut = "#f59e0b";
function Ge(e, t) {
  return K(t) ? e(`objective.${t}`) : t;
}
function ne(e, t) {
  const s = Ke(t.type, t.params), n = ge(t.params);
  return `${Ge(e, t.type)}${s ? ` · ${s}` : ""}${n !== void 0 ? ` · 0/${String(n)}` : ""}`;
}
function Fe(e) {
  return e.replace(/<[^<>]*>/g, "").trim();
}
function zt(e) {
  const t = e.distribution?.strategy;
  return typeof t == "string" && t.toLowerCase() === "sequential";
}
function Bt(e, t, s) {
  const n = Re(s), i = zt(e);
  return e.quests.map((a, o) => {
    const l = w(t, a.title.key, s);
    return {
      id: a.uid,
      label: Fe(l) || a.key,
      detail: a.tier || void 0,
      caption: Vt(n, a),
      marker: i ? String(o + 1) : void 0,
      hover: {
        title: l || a.key,
        text: w(t, a.description.key, s) || void 0,
        lines: Wt(n, a, t, s)
      }
    };
  });
}
function Vt(e, t) {
  const s = t.stages.flatMap((a) => a.objectives), n = s[0];
  if (!n) return;
  const i = s.length - 1;
  return i > 0 ? `${ne(e, n)} +${String(i)}` : ne(e, n);
}
function Wt(e, t, s, n) {
  const i = t.stages.length > 1;
  return t.stages.flatMap(
    (a, o) => a.objectives.map((l) => {
      const c = ne(e, l);
      return i ? `<gray>${Fe(w(s, a.title.key, n)) || e("stage", { n: o + 1 })} ·</gray> ${c}` : c;
    })
  );
}
function Yt(e, t) {
  const s = Re(t), n = typeof e.distribution?.strategy == "string" ? e.distribution.strategy.toLowerCase() : "", i = e.quests.length, a = i === 1 ? s("questCountOne") : s("questCount", { count: i });
  return ["none", "sequential", "random"].includes(n) ? `${a} · ${s(`strategy.${n}`).toLowerCase()}` : a;
}
const Zt = /^(\d+|(\d+[dhms])+)$/, Xt = ["actor_load", "period_reset", "quest_complete"], Jt = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
function en(e, t) {
  const s = Qt(e, /* @__PURE__ */ new Date());
  if (!s) return null;
  try {
    return new Intl.DateTimeFormat(t, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(s);
  } catch {
    return s.toLocaleString();
  }
}
function tn({ projectId: e, documentId: t, document: s, item: n }) {
  Te("msquests", Pe);
  const i = s, a = st(e), o = at(), l = fe(), [c, u] = me(n ?? null);
  pt(() => {
    u(n ?? null);
  }, [n]);
  const d = (b) => {
    u(b), it({ documentId: t, item: b });
  }, q = { projectId: e, project: a, lang: o, t: l, edit: (b, x) => {
    const p = structuredClone(i);
    b(p), rt({ projectId: e, kind: ae, id: t, doc: p, texts: x });
  } }, y = c ? i.quests.findIndex((b) => b.uid === c) : -1;
  return y >= 0 ? /* @__PURE__ */ f("div", { className: "aq", children: [
    /* @__PURE__ */ f(B, { variant: "ghost", size: "sm", className: "aq-back", onClick: () => d(null), children: [
      "← ",
      l("back")
    ] }),
    /* @__PURE__ */ r(on, { ctx: q, group: i, index: y })
  ] }) : /* @__PURE__ */ r("div", { className: "aq", children: /* @__PURE__ */ r(sn, { ctx: q, group: i, onOpen: d }) });
}
function S({
  label: e,
  children: t,
  hint: s
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the control is the child
    /* @__PURE__ */ f("label", { className: "aq-field", children: [
      /* @__PURE__ */ r("span", { className: "field-label", children: e }),
      t,
      s
    ] })
  );
}
function z({
  ctx: e,
  label: t,
  node: s,
  multiline: n
}) {
  const i = w(e.project, s.key, e.lang), a = (o) => e.edit(() => {
  }, [{ key: s.key, lang: e.lang, value: o }]);
  return /* @__PURE__ */ r(S, { label: `${t} · ${e.lang}`, children: /* @__PURE__ */ r(Ce, { value: i, onChange: a, multiline: n, "aria-label": t }) });
}
function nn(e) {
  return typeof e == "number" ? String(e) : typeof e == "string" ? e : "";
}
function P({
  label: e,
  value: t,
  onChange: s,
  placeholder: n
}) {
  return /* @__PURE__ */ r(S, { label: e, children: /* @__PURE__ */ r(
    "input",
    {
      className: "input",
      type: "number",
      min: 0,
      step: 1,
      value: nn(t),
      placeholder: n,
      onChange: (i) => {
        const a = i.target.value.trim();
        s(a === "" ? void 0 : Math.max(0, Math.trunc(Number(a))));
      }
    }
  ) });
}
function N(e, t, s) {
  s === void 0 || s === "" ? delete e[t] : e[t] = s;
}
function be(e, t, s) {
  if (s < 0 || s >= e.length) return;
  const [n] = e.splice(t, 1);
  e.splice(s, 0, n);
}
function Q({
  label: e,
  onClick: t,
  disabled: s,
  children: n
}) {
  return /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      className: "aq-icon-btn",
      title: e,
      "aria-label": e,
      onClick: t,
      disabled: s,
      children: n
    }
  );
}
function Ue(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((s, n) => {
    const i = t.has(s) ? `${s}#${n}` : s;
    return t.add(s), i;
  });
}
function sn({
  ctx: e,
  group: t,
  onOpen: s
}) {
  const { t: n, edit: i, project: a, lang: o } = e, l = ot(), c = typeof t.reset.cron == "string" ? t.reset.cron : "", u = c ? Ht(c, l) : null, d = typeof t.reset.timezone == "string" ? t.reset.timezone : "", m = c && Ne(c) ? en(c, l) : null, q = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], y = t.distribution.tiers ?? {}, b = Object.keys(t.rest).filter((p) => p !== "actions"), x = () => {
    const p = D(), v = te();
    i(
      (h) => {
        h.quests.push({
          key: Z(
            "quest",
            h.quests.map((k) => k.key)
          ),
          uid: v,
          tier: "",
          title: { key: p },
          description: { key: D() },
          duration: "",
          stages: [Be(1)],
          rest: {}
        });
      },
      [{ key: p, lang: o, value: n("newQuestTitle") }]
    ), s(v);
  };
  return /* @__PURE__ */ f(U, { children: [
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ r("span", { className: "aq-h", children: n("group") }),
      /* @__PURE__ */ r(z, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ r(z, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ r(S, { label: n("actorType"), children: /* @__PURE__ */ f(
        "select",
        {
          className: "select",
          value: t.actorType,
          onChange: (p) => i((v) => {
            v.actorType = p.target.value;
          }),
          children: [
            /* @__PURE__ */ r("option", { value: "player", children: n("actor.player") }),
            /* @__PURE__ */ r("option", { value: "global", children: n("actor.global") }),
            !["player", "global"].includes(t.actorType) && /* @__PURE__ */ r("option", { value: t.actorType, children: t.actorType })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ r("span", { className: "aq-h", children: n("reset") }),
      /* @__PURE__ */ r(
        S,
        {
          label: n("cron"),
          hint: c ? Ne(c) ? /* @__PURE__ */ f("span", { className: "aq-ok", children: [
            u ?? n("cronRaw"),
            d && d !== Jt ? `, ${d}` : m ? ` · ${n("nextRun", { when: m })}` : ""
          ] }) : /* @__PURE__ */ r("span", { className: "aq-err", children: n("cronInvalid") }) : /* @__PURE__ */ r("span", { className: "aq-hint", children: n("noReset") }),
          children: /* @__PURE__ */ r(
            "input",
            {
              className: "input",
              value: c,
              placeholder: "0 4 * * *",
              onChange: (p) => i((v) => N(v.reset, "cron", p.target.value))
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ r("span", { className: "aq-h", children: n("distribution") }),
      /* @__PURE__ */ f("div", { className: "aq-row", children: [
        /* @__PURE__ */ r(S, { label: n("strategy"), children: /* @__PURE__ */ f(
          "select",
          {
            className: "select",
            value: typeof t.distribution.strategy == "string" ? t.distribution.strategy.toLowerCase() : "",
            onChange: (p) => i((v) => N(v.distribution, "strategy", p.target.value)),
            children: [
              /* @__PURE__ */ r("option", { value: "", children: "—" }),
              ["none", "sequential", "random"].map((p) => /* @__PURE__ */ r("option", { value: p, children: n(`strategy.${p}`) }, p))
            ]
          }
        ) }),
        /* @__PURE__ */ r(
          P,
          {
            label: n("amount"),
            value: t.distribution.amount,
            onChange: (p) => i((v) => N(v.distribution, "amount", p))
          }
        )
      ] }),
      /* @__PURE__ */ r("span", { className: "field-label", children: n("triggers") }),
      Xt.map((p) => /* @__PURE__ */ f("label", { className: "aq-check", children: [
        /* @__PURE__ */ r(
          "input",
          {
            type: "checkbox",
            checked: q.includes(p),
            onChange: (v) => i((h) => {
              const k = Array.isArray(h.distribution.triggers) ? h.distribution.triggers : [], _ = v.target.checked ? [...k, p] : k.filter((C) => C !== p);
              N(h.distribution, "triggers", _.length ? _ : void 0);
            })
          }
        ),
        n(`trigger.${p}`)
      ] }, p)),
      t.tiers.length > 0 && /* @__PURE__ */ f(U, { children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("perTier") }),
        /* @__PURE__ */ r("div", { className: "aq-row", children: t.tiers.map((p) => /* @__PURE__ */ r(
          P,
          {
            label: w(a, p.title.key, o) || p.key,
            value: y[p.key],
            onChange: (v) => i((h) => {
              const k = { ...h.distribution.tiers ?? {} };
              N(k, p.key, v), N(
                h.distribution,
                "tiers",
                Object.keys(k).length ? k : void 0
              );
            })
          },
          p.key
        )) })
      ] })
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ r("span", { className: "aq-h", children: n("limits") }),
      /* @__PURE__ */ f("div", { className: "aq-row", children: [
        /* @__PURE__ */ r(
          P,
          {
            label: n("maxActive"),
            value: t.limits.max_active,
            onChange: (p) => i((v) => N(v.limits, "max_active", p))
          }
        ),
        /* @__PURE__ */ r(
          P,
          {
            label: n("questsPerPeriod"),
            placeholder: n("noLimit"),
            value: t.limits.max_per_period,
            onChange: (p) => i((v) => N(v.limits, "max_per_period", p))
          }
        )
      ] }),
      /* @__PURE__ */ r("span", { className: "aq-h", children: n("rotation") }),
      /* @__PURE__ */ f("div", { className: "aq-row", children: [
        /* @__PURE__ */ f("label", { className: "aq-check", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: t.rotation.enabled === !0,
              onChange: (p) => i((v) => N(v.rotation, "enabled", p.target.checked ? !0 : void 0))
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
            onChange: (p) => i((v) => N(v.rotation, "max_per_period", p))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ f("div", { className: "aq-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: n("tiers") }),
        /* @__PURE__ */ f(
          B,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => i((p) => {
              p.tiers.push({
                key: Z(
                  "tier",
                  p.tiers.map((v) => v.key)
                ),
                title: { key: D() },
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
      t.tiers.map((p, v) => /* @__PURE__ */ f("div", { className: "aq-row", children: [
        /* @__PURE__ */ r(S, { label: n("tierKey"), children: /* @__PURE__ */ r(
          "input",
          {
            className: "input",
            defaultValue: p.key,
            onBlur: (h) => {
              const k = ie(h.target.value);
              k !== p.key && i((_) => {
                const C = Z(
                  k,
                  _.tiers.map((g) => g.key)
                );
                _.tiers[v].key = C;
                for (const g of _.quests) g.tier === p.key && (g.tier = C);
                const L = _.distribution.tiers;
                L && p.key in L && (L[C] = L[p.key], delete L[p.key]);
              });
            }
          }
        ) }),
        /* @__PURE__ */ r(z, { ctx: e, label: n("title"), node: p.title }),
        /* @__PURE__ */ r(
          Q,
          {
            label: n("remove"),
            onClick: () => i((h) => {
              h.tiers.splice(v, 1);
            }),
            children: "×"
          }
        )
      ] }, p.key))
    ] }),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ f("div", { className: "aq-head", children: [
        /* @__PURE__ */ f("span", { className: "aq-h", children: [
          n("quests"),
          " · ",
          t.quests.length
        ] }),
        /* @__PURE__ */ f(B, { size: "sm", variant: "primary", onClick: x, children: [
          "+ ",
          n("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ r("span", { className: "aq-hint", children: n("noQuests") }),
      /* @__PURE__ */ r(
        pe,
        {
          ids: t.quests.map((p) => p.uid),
          onMove: (p, v) => i((h) => be(h.quests, p, v)),
          className: "aq-list",
          itemClassName: "aq-item",
          children: (p, v) => {
            const h = t.quests[p];
            return /* @__PURE__ */ f(U, { children: [
              v,
              /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "aq-item-main",
                  onClick: () => s(h.uid),
                  title: n("open"),
                  children: [
                    /* @__PURE__ */ r("span", { className: "aq-item-title", children: w(a, h.title.key, o) || h.key }),
                    /* @__PURE__ */ f("span", { className: "aq-item-sub", children: [
                      n("questSummary", {
                        stages: h.stages.length,
                        objectives: h.stages.reduce((k, _) => k + _.objectives.length, 0)
                      }),
                      " · ",
                      h.key,
                      h.tier ? ` · ${h.tier}` : "",
                      h.duration ? ` · ${h.duration}` : ""
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ r(
                Q,
                {
                  label: n("remove"),
                  onClick: () => i((k) => {
                    k.quests.splice(p, 1);
                  }),
                  children: "×"
                }
              )
            ] });
          }
        }
      ),
      b.length > 0 && /* @__PURE__ */ r("span", { className: "aq-hint", children: n("kept", { fields: b.join(", ") }) })
    ] }),
    /* @__PURE__ */ r(rn, { ctx: e, group: t })
  ] });
}
function an({
  ctx: e,
  value: t,
  onChange: s
}) {
  const { chain: n, legacy: i } = xt(t);
  return /* @__PURE__ */ f("div", { className: "aq-chain", children: [
    /* @__PURE__ */ r(
      lt,
      {
        projectId: e.projectId,
        value: n,
        onChange: (a) => s(_e(a, i))
      }
    ),
    i.length > 0 && /* @__PURE__ */ f("div", { className: "aq-legacy", children: [
      /* @__PURE__ */ r("span", { className: "aq-hint", children: e.t("legacySteps") }),
      i.map((a, o) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
        /* @__PURE__ */ f("div", { className: "aq-legacy-row", children: [
          /* @__PURE__ */ r("code", { children: _t(a) }),
          /* @__PURE__ */ r(
            Q,
            {
              label: e.t("remove"),
              onClick: () => s(_e(n, i.filter((l, c) => c !== o))),
              children: "×"
            }
          )
        ] }, o)
      ))
    ] })
  ] });
}
function ze({
  ctx: e,
  title: t,
  hint: s,
  hooks: n,
  label: i,
  value: a,
  onChange: o,
  footer: l
}) {
  const { t: c } = e, u = j(a), [d, m] = me([]), q = n.filter((b) => u[b] != null || d.includes(b)), y = n.filter((b) => !q.includes(b));
  return /* @__PURE__ */ f("section", { className: "aq-section", children: [
    /* @__PURE__ */ r("span", { className: "aq-h", children: t }),
    /* @__PURE__ */ r("span", { className: "aq-hint", children: s }),
    q.map((b) => /* @__PURE__ */ f("div", { className: "aq-event", children: [
      /* @__PURE__ */ f("div", { className: "aq-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-event-name", children: i(b) }),
        /* @__PURE__ */ r(
          Q,
          {
            label: c("removeEvent"),
            onClick: () => {
              m((x) => x.filter((p) => p !== b)), o(b, void 0);
            },
            children: "×"
          }
        )
      ] }),
      /* @__PURE__ */ r(an, { ctx: e, value: u[b], onChange: (x) => o(b, x) })
    ] }, b)),
    y.length > 0 && /* @__PURE__ */ f(
      "select",
      {
        className: "select aq-event-add",
        "aria-label": c("addEvent"),
        value: "",
        onChange: (b) => {
          const x = y.find((p) => p === b.target.value);
          x && m((p) => [...p, x]);
        },
        children: [
          /* @__PURE__ */ r("option", { value: "", children: c("addEvent") }),
          y.map((b) => /* @__PURE__ */ r("option", { value: b, children: i(b) }, b))
        ]
      }
    ),
    l
  ] });
}
function rn({ ctx: e, group: t }) {
  const { t: s, edit: n } = e;
  return /* @__PURE__ */ r(
    ze,
    {
      ctx: e,
      title: s("hooks"),
      hint: s("hooksHint"),
      hooks: wt,
      label: (i) => s(`hook.${i}`),
      value: t.rest.actions,
      onChange: (i, a) => n((o) => {
        const l = { ...j(o.rest.actions) };
        N(l, i, a), N(o.rest, "actions", Object.keys(l).length ? l : void 0);
      })
    },
    t.uid
  );
}
function Be(e) {
  return {
    key: `stage_${e}`,
    title: { key: D() },
    flow: "parallel",
    objectives: [],
    rest: {}
  };
}
function on({ ctx: e, group: t, index: s }) {
  const { t: n, edit: i } = e, a = t.quests[s], o = (d, m) => i((q) => d(q.quests[s]), m), l = t.quests.some((d, m) => m !== s && d.key === a.key), c = a.duration !== "" && !Zt.test(a.duration.replace(/\s/g, "").toLowerCase()), u = Object.keys(a.rest).filter((d) => d !== "actions");
  return /* @__PURE__ */ f(U, { children: [
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ r("span", { className: "aq-h", children: n("general") }),
      /* @__PURE__ */ r(z, { ctx: e, label: n("title"), node: a.title }),
      /* @__PURE__ */ r(z, { ctx: e, label: n("description"), node: a.description, multiline: !0 }),
      /* @__PURE__ */ f("div", { className: "aq-row aq-top", children: [
        /* @__PURE__ */ r(S, { label: n("tier"), children: /* @__PURE__ */ f(
          "select",
          {
            className: "select",
            value: a.tier,
            onChange: (d) => o((m) => {
              m.tier = d.target.value;
            }),
            children: [
              /* @__PURE__ */ r("option", { value: "", children: n("noTier") }),
              t.tiers.map((d) => /* @__PURE__ */ r("option", { value: d.key, children: w(e.project, d.title.key, e.lang) || d.key }, d.key)),
              a.tier && !t.tiers.some((d) => d.key === a.tier) && /* @__PURE__ */ r("option", { value: a.tier, children: a.tier })
            ]
          }
        ) }),
        /* @__PURE__ */ r(
          S,
          {
            label: n("duration"),
            hint: /* @__PURE__ */ r("span", { className: c ? "aq-err" : "aq-hint", children: n(c ? "durationInvalid" : "durationHint") }),
            children: /* @__PURE__ */ r(
              "input",
              {
                className: "input",
                value: a.duration,
                placeholder: "24h",
                onChange: (d) => o((m) => {
                  m.duration = d.target.value.trim();
                })
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ f("details", { className: "aq-fold", open: l || void 0, children: [
        /* @__PURE__ */ r("summary", { children: n("more") }),
        /* @__PURE__ */ r(
          S,
          {
            label: n("key"),
            hint: /* @__PURE__ */ r("span", { className: l ? "aq-err" : "aq-hint", children: n(l ? "keyTaken" : "questKeyHint") }),
            children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: a.key,
                onChange: (d) => o((m) => {
                  m.key = Oe(d.target.value);
                }),
                onBlur: () => {
                  const d = ie(a.key);
                  d !== a.key && o((m) => {
                    m.key = d;
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
          a.stages.length
        ] }),
        /* @__PURE__ */ f(
          B,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => o((d) => {
              const m = Z(
                `stage_${d.stages.length + 1}`,
                d.stages.map((q) => q.key)
              );
              d.stages.push({ ...Be(d.stages.length + 1), key: m });
            }),
            children: [
              "+ ",
              n("addStage")
            ]
          }
        )
      ] }),
      /* @__PURE__ */ r(
        pe,
        {
          ids: Ue(a.stages.map((d) => d.key)),
          onMove: (d, m) => o((q) => be(q.stages, d, m)),
          className: "aq-stages",
          children: (d, m) => /* @__PURE__ */ r(
            ln,
            {
              ctx: e,
              quest: a,
              stage: a.stages[d],
              si: d,
              handle: m,
              editQuest: o
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ r(
      ze,
      {
        ctx: e,
        title: n("questEvents"),
        hint: n("questEventsHint"),
        hooks: Nt,
        label: (d) => n(`questHook.${d}`),
        value: a.rest.actions,
        onChange: (d, m) => o((q) => {
          const y = { ...j(q.rest.actions) };
          N(y, d, m), N(q.rest, "actions", Object.keys(y).length > 0 ? y : void 0);
        }),
        footer: u.length > 0 && /* @__PURE__ */ r("span", { className: "aq-hint", children: n("kept", { fields: u.join(", ") }) })
      },
      a.uid
    ),
    /* @__PURE__ */ f("section", { className: "aq-section", children: [
      /* @__PURE__ */ r("span", { className: "aq-h", children: n("preview") }),
      /* @__PURE__ */ r(pn, { ctx: e, quest: a })
    ] })
  ] });
}
function ln({
  ctx: e,
  quest: t,
  stage: s,
  si: n,
  handle: i,
  editQuest: a
}) {
  const { t: o } = e, [l, c] = me(null), u = (y) => a((b) => y(b.stages[n])), d = w(e.project, s.title.key, e.lang), m = s.flow || "parallel", q = t.stages.flatMap((y) => y.objectives.map((b) => b.key));
  return /* @__PURE__ */ f("div", { className: "aq-stage", children: [
    /* @__PURE__ */ f("div", { className: "aq-stage-head", children: [
      i,
      /* @__PURE__ */ r("span", { className: "aq-stage-n", children: n + 1 }),
      /* @__PURE__ */ r("div", { className: "aq-stage-title", children: /* @__PURE__ */ r(
        Ce,
        {
          value: d,
          placeholder: o("stageTitle"),
          "aria-label": o("stage", { n: n + 1 }),
          onChange: (y) => e.edit(() => {
          }, [{ key: s.title.key, lang: e.lang, value: y }])
        }
      ) }),
      /* @__PURE__ */ r(
        Q,
        {
          label: o("remove"),
          onClick: () => a((y) => {
            y.stages.splice(n, 1);
          }),
          children: "×"
        }
      )
    ] }),
    s.objectives.length > 1 && /* @__PURE__ */ r("div", { className: "aq-seg", role: "radiogroup", "aria-label": o("flow"), children: ["parallel", "sequential"].map((y) => /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": m === y,
        className: `chip${m === y ? " is-active" : ""}`,
        onClick: () => u((b) => {
          b.flow = y;
        }),
        children: o(`flow.${y}`)
      },
      y
    )) }),
    s.objectives.length === 0 && /* @__PURE__ */ r("span", { className: "aq-hint", children: o("noObjectives") }),
    /* @__PURE__ */ r(
      pe,
      {
        ids: Ue(s.objectives.map((y) => y.key)),
        onMove: (y, b) => u((x) => be(x.objectives, y, b)),
        className: "aq-objectives",
        children: (y, b) => {
          const x = s.objectives[y];
          return /* @__PURE__ */ r(
            cn,
            {
              t: o,
              projectId: e.projectId,
              n: m === "sequential" ? `${n + 1}.${y + 1}` : "•",
              objective: x,
              open: l === x.key,
              onToggle: () => c(l === x.key ? null : x.key),
              keyTaken: q.filter((p) => p === x.key).length > 1,
              handle: b,
              onChange: (p) => u((v) => p(v.objectives[y])),
              onRename: (p) => {
                l === x.key && c(p);
              },
              onRemove: () => u((p) => {
                p.objectives.splice(y, 1);
              })
            }
          );
        }
      }
    ),
    /* @__PURE__ */ f(
      B,
      {
        size: "sm",
        variant: "ghost",
        className: "aq-add",
        onClick: () => {
          const y = ht("block_break", q);
          a((b) => {
            b.stages[n].objectives.push({
              key: y,
              type: "block_break",
              params: He("block_break")
            });
          }), c(y);
        },
        children: [
          "+ ",
          o("addObjective")
        ]
      }
    )
  ] });
}
function cn({
  t: e,
  projectId: t,
  n: s,
  objective: n,
  open: i,
  onToggle: a,
  keyTaken: o,
  handle: l,
  onChange: c,
  onRename: u,
  onRemove: d
}) {
  const m = K(n.type), q = m ? m.params : Object.keys(n.params).map((h) => ({ name: h, kind: "text" })), y = ge(n.params), b = Ke(n.type, n.params), x = Gt(n.type, n.params), p = o || x.length > 0, v = (h) => h.kind === "item" ? /* @__PURE__ */ r(
    dn,
    {
      t: e,
      projectId: t,
      spec: h,
      params: n.params,
      onChange: (k) => c((_) => k(_.params))
    },
    h.name
  ) : /* @__PURE__ */ r(
    un,
    {
      t: e,
      spec: h,
      value: n.params[h.name],
      onChange: (k) => c((_) => N(_.params, h.name, k))
    },
    h.name
  );
  return /* @__PURE__ */ f("div", { className: `aq-obj${i ? " is-open" : ""}${p ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ f("div", { className: "aq-obj-line", children: [
      l,
      /* @__PURE__ */ f("button", { type: "button", className: "aq-obj-main", onClick: a, "aria-expanded": i, children: [
        /* @__PURE__ */ r("span", { className: "aq-obj-n", children: s }),
        /* @__PURE__ */ r("span", { className: "aq-obj-icon", "aria-hidden": !0, children: m?.icon ?? "?" }),
        /* @__PURE__ */ f("span", { className: "aq-obj-text", children: [
          Ge(e, n.type),
          y !== void 0 && /* @__PURE__ */ f("strong", { children: [
            " · ",
            String(y)
          ] }),
          b ? ` × ${b}` : y !== void 0 ? ` × ${e("any")}` : ""
        ] }),
        p && /* @__PURE__ */ r(
          "span",
          {
            className: "aq-obj-dot",
            title: o ? e("objectiveKeyTaken") : e("missing", {
              fields: x.map((h) => e(`param.${h}`)).join(", ")
            })
          }
        )
      ] }),
      /* @__PURE__ */ r(Q, { label: e("remove"), onClick: d, children: "×" })
    ] }),
    i && /* @__PURE__ */ f("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ r(S, { label: e("type"), children: /* @__PURE__ */ f(
        "select",
        {
          className: "select",
          value: n.type,
          onChange: (h) => c((k) => {
            k.type = h.target.value, k.params = He(k.type);
          }),
          children: [
            De.map((h) => /* @__PURE__ */ f("option", { value: h.type, children: [
              h.icon,
              " ",
              e(`objective.${h.type}`)
            ] }, h.type)),
            !m && /* @__PURE__ */ r("option", { value: n.type, children: n.type })
          ]
        }
      ) }),
      /* @__PURE__ */ r("div", { className: "aq-row aq-wrap", children: q.filter((h) => !h.advanced).map(v) }),
      x.length > 0 && /* @__PURE__ */ r("span", { className: "aq-warn", children: e("missing", {
        fields: x.map((h) => e(`param.${h}`)).join(", ")
      }) }),
      /* @__PURE__ */ f("details", { className: "aq-fold", open: o || void 0, children: [
        /* @__PURE__ */ r("summary", { children: e("more") }),
        q.filter((h) => h.advanced).map(v),
        /* @__PURE__ */ r(
          S,
          {
            label: e("key"),
            hint: /* @__PURE__ */ r("span", { className: o ? "aq-err" : "aq-hint", children: e(o ? "objectiveKeyTaken" : "objectiveKeyHint") }),
            children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: n.key,
                onChange: (h) => {
                  const k = Oe(h.target.value);
                  c((_) => {
                    _.key = k;
                  }), u(k);
                },
                onBlur: () => {
                  const h = ie(n.key);
                  h !== n.key && (c((k) => {
                    k.key = h;
                  }), u(h));
                }
              }
            )
          }
        )
      ] })
    ] })
  ] });
}
function dn({
  t: e,
  projectId: t,
  spec: s,
  params: n,
  onChange: i
}) {
  const a = ye(n, s), o = Array.isArray(n.match) ? n.match : void 0, l = (c, u) => i((d) => Kt(d, s, c, u));
  return /* @__PURE__ */ r(
    S,
    {
      label: e(`param.${s.name}`),
      hint: Object.keys(a).length === 0 ? /* @__PURE__ */ r("span", { className: "aq-hint", children: e("anyItem") }) : void 0,
      children: /* @__PURE__ */ r(
        ct,
        {
          projectId: t,
          value: a,
          match: o,
          onChange: (c) => l(c, o),
          onMatchChange: (c) => l(a, c)
        }
      )
    }
  );
}
function un({
  t: e,
  spec: t,
  value: s,
  onChange: n
}) {
  const i = e(`param.${t.name}`), a = t.required && (s === void 0 || s === ""), o = typeof s == "string" || typeof s == "number" ? String(s) : "";
  if (t.kind === "int")
    return /* @__PURE__ */ r(P, { label: i, value: s, onChange: n });
  const l = a ? /* @__PURE__ */ r("span", { className: "aq-warn", children: e("required") }) : t.name === "itemKey" ? /* @__PURE__ */ r("span", { className: "aq-hint", children: e("itemKeyHint") }) : void 0;
  if (t.kind === "material")
    return /* @__PURE__ */ r(S, { label: i, hint: l, children: /* @__PURE__ */ r(
      dt,
      {
        value: o,
        placeholder: e("any"),
        "aria-label": i,
        onChange: (u) => n(u.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const c = t.kind === "entity";
  return /* @__PURE__ */ f(S, { label: i, hint: l, children: [
    /* @__PURE__ */ r(
      "input",
      {
        className: `input${c ? " aq-mono" : ""}`,
        list: c ? "aq-entities" : void 0,
        value: o,
        placeholder: c ? e("any") : "",
        onChange: (u) => n(c ? u.target.value.toUpperCase().replace(/\s+/g, "_") : u.target.value)
      }
    ),
    c && /* @__PURE__ */ r("datalist", { id: "aq-entities", children: Ft.map((u) => /* @__PURE__ */ r("option", { value: u }, u)) })
  ] });
}
function pn({ ctx: e, quest: t }) {
  const { t: s, project: n, lang: i } = e, a = (o) => ne(s, o);
  return /* @__PURE__ */ f("div", { className: "aq-preview", children: [
    /* @__PURE__ */ r("span", { className: "aq-preview-title", children: w(n, t.title.key, i) || t.key }),
    w(n, t.description.key, i) && /* @__PURE__ */ r("span", { className: "aq-preview-line", children: w(n, t.description.key, i) }),
    t.stages.map((o, l) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ f("span", { className: "aq-preview-stage", children: [
        t.stages.length > 1 && /* @__PURE__ */ r("span", { className: "aq-preview-line", children: w(n, o.title.key, i) || s("stage", { n: l + 1 }) }),
        o.objectives.map((c) => /* @__PURE__ */ f("span", { className: "aq-preview-line", children: [
          "• ",
          a(c)
        ] }, c.key))
      ] }, l)
    ))
  ] });
}
function mn({ className: e }) {
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
const fn = {
  kind: ae,
  dir: Le,
  schemaVersion: he,
  // Created in the module's folder only (SDK 1.8); a group already elsewhere still loads.
  projects: [ft],
  // Data with no links: one "Quests" entry and page instead of a node per group (SDK 1.9).
  collection: { labels: mt },
  // A group's id is its key on the server (`quest_group_key`): typed by hand, no prefix.
  label: ke.en,
  labels: ke,
  icon: mn,
  component: tn,
  title: (e, { project: t, lang: s }) => w(t, e.title.key, s),
  create: ({ id: e, projectId: t }) => ({
    id: e,
    projectId: t,
    uid: te(),
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
  parse: (e, t) => gt(e, t),
  serialize: (e, t) => qt(e, t),
  ltextSites: (e) => kt(e),
  board: {
    size: { width: 300, height: 48 },
    accent: Ut,
    // The group's quests, one selectable row each: the Properties panel opens the one clicked.
    items: (e, { project: t, lang: s }) => Bt(e, t, s),
    summary: (e, { lang: t }) => Yt(e, t)
  }
}, je = "msquests:groups", Se = "msquests:quests", hn = "msquests:active", Ee = {
  en: {
    block_break: "Mine %amount% %material%",
    breed_animal: "Breed %amount% %entity_type%",
    craft_item: "Craft %amount% %material%",
    harvest_crop: "Harvest %amount% %crop%",
    deliver_item: "Deliver %amount% %material%",
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
    kill_entity: "Tuer %amount% × %entity_type%",
    execute_command: "Exécuter la commande %command%",
    fishing: "Pêcher %amount% × %fish_type%",
    placeholder: "Atteindre %value%",
    travel: "Parcourir %distance% blocs"
  }
}, Ae = { en: "Available", fr: "Disponible" };
function gn(e, t, s) {
  if (t !== je && t !== Se && t !== hn) return null;
  const n = e.documents?.[ae];
  if (!n || n.length === 0) return null;
  const i = e.defaultLang ?? "en", a = s?.serverRows, o = s?.params?.group || void 0, l = [...n].sort((u, d) => u.id < d.id ? -1 : u.id > d.id ? 1 : 0);
  if (t === je) {
    const u = de(a, "key");
    return l.map((d) => yn(d, u.get(d.id), i));
  }
  if (t === Se) {
    const u = de(a, "id");
    return l.filter((d) => !o || d.id === o).flatMap((d) => d.quests.map((m) => Ve(d, m, u.get(`${d.id}:${m.key}`), i)));
  }
  if (!a) return null;
  const c = new Map(n.map((u) => [u.id, u]));
  return a.flatMap((u) => {
    const d = c.get(T(u.group));
    if (!d) return [u];
    const m = d.quests.find((q) => q.key === T(u.quest_key));
    return m ? [kn(m, u, i)] : [];
  });
}
function yn(e, t, s) {
  const n = de(ee(t?.quests), "key");
  return {
    key: e.id,
    name: e.title,
    description: e.description,
    actor_type: e.actorType,
    max_active: ue(e.limits.max_active, 1),
    max_per_period: ue(e.limits.max_per_period, 0),
    rotatable: e.rotation.enabled === !0,
    // The period follows the server's clock and zone: its value stands until a deploy.
    period_end: t?.period_end ?? 0,
    active_count: t?.active_count ?? 0,
    completed_count: t?.completed_count ?? 0,
    can_rotate: t?.can_rotate ?? !1,
    quests: e.quests.map((i) => Ve(e, i, n.get(i.key), s))
  };
}
function Ve(e, t, s, n) {
  const i = e.tiers.find((a) => a.key === t.tier);
  return {
    id: `${e.id}:${t.key}`,
    group: e.id,
    key: t.key,
    name: t.title,
    description: t.description,
    duration: Nn(t.duration),
    tier: t.tier,
    tier_name: i ? i.title : "",
    assigned: s?.assigned ?? !1,
    status_key: s?.status_key ?? "NOT_STARTED",
    status: s?.status ?? Ae[n.slice(0, 2)] ?? Ae.en,
    can_start: s?.can_start ?? !1,
    start_blocker: s?.start_blocker ?? "",
    start_blocker_label: s?.start_blocker_label ?? "",
    // `reference` in `QuestRows.questRow`: the attempt the server holds for this player.
    ...We(t, s?.assigned === !0 ? s : void 0, n)
  };
}
function We(e, t, s) {
  const n = t ? bn(t) : void 0, i = vn(e, n, s), a = i.find((l) => l.active === !0), o = a ? a.objectives.find((l) => l.done !== !0) : void 0;
  return {
    objective_name: o?.name ?? "",
    objective_progress: o?.progress ?? 0,
    objective_target: o?.target ?? 0,
    progress_ratio: n ? Ye(i.map((l) => l.progress_ratio)) : 0,
    stage_index: i.filter((l) => l.completed === !0).length,
    stage_name: a?.name ?? "",
    stage_flow: a?.flow ?? "",
    stages: i.map((l) => ({ ...l, objectives: l.objectives.map(({ done: c, ...u }) => u) }))
  };
}
function bn(e) {
  const t = /* @__PURE__ */ new Map(), s = [
    ...ee(e.objectives),
    ...ee(e.stages).flatMap((n) => ee(n.objectives))
  ];
  for (const n of s) {
    const i = T(n.status_key);
    t.set(T(n.key), {
      progress: ue(n.progress, 0),
      flag: i === "COMPLETED" || i === "FAILED" ? i : "",
      row: n
    });
  }
  return t;
}
function vn(e, t, s) {
  const n = e.stages.map((a, o) => {
    const l = a.objectives.map((c) => qn(c, t?.get(c.key), s));
    return {
      key: a.key,
      name: a.title,
      flow: wn(a),
      index: o,
      // `QuestStage.isCompleted`: all objectives done, so an empty stage is.
      completed: t !== void 0 && l.every((c) => c.done),
      active: !1,
      progress_ratio: t ? Ye(l.map((c) => c.progress_ratio)) : 0,
      objectives: l
    };
  });
  if (!t) return n;
  const i = n.find((a) => a.completed !== !0);
  if (i) {
    i.active = !0;
    const a = i.objectives, o = a.find((l) => l.done !== !0);
    for (const l of a)
      l.status_key === "PENDING" && (i.flow !== "SEQUENTIAL" || l === o) && (l.status_key = "IN_PROGRESS");
  }
  return n;
}
function qn(e, t, s) {
  const n = _n(e), i = t?.progress ?? 0, a = t?.row, o = a && a.type === e.type && a.target === n;
  return {
    key: e.key,
    name: o && typeof a.name == "string" ? a.name : xn(e, s),
    type: e.type,
    progress: i,
    target: n,
    // `AbstractQuestObjective`: done once the progress reaches the target, whatever the
    // stored flag says; the ratio is clamped, so a lowered target reads 1, not 1.4.
    progress_ratio: t ? n <= 0 ? 1 : Math.min(Math.max(i / n, 0), 1) : 0,
    completed: t !== void 0 && i >= n,
    status_key: t?.flag || "PENDING",
    done: t !== void 0 && i >= n
  };
}
function kn(e, t, s) {
  const n = We(e, t, s), i = n.stages;
  return {
    ...t,
    name: e.title,
    description: e.description,
    stage_index: n.stage_index,
    stage_count: e.stages.length,
    stage_name: n.stage_name,
    stage_flow: n.stage_flow,
    progress_ratio: n.progress_ratio,
    objectives: i.flatMap((a) => a.objectives),
    stages: i
  };
}
function xn(e, t) {
  const n = (Ee[t.slice(0, 2)] ?? Ee.en)[e.type];
  if (!n) return e.type;
  const i = e.params, a = {
    amount: String(i.amount ?? ""),
    distance: String(i.distance ?? ""),
    command: T(i.command),
    value: T(i.value),
    // Bukkit's translation keys, as the objective configs write them (`<lang:…>`).
    crop: J("block", i.crop),
    entity_type: J("entity", i.entity_type),
    material: e.type === "block_break" ? J("block", i.material) : $e(e),
    fish_type: $e(e)
  };
  return n.replace(/%([a-z_]+)%/g, (o, l) => a[l] ?? "");
}
function J(e, t) {
  const s = T(t).toLowerCase().replace(/^minecraft:/, "");
  return s === "" ? "" : `<lang:${e}.minecraft.${s}>`;
}
function $e(e) {
  const t = K(e.type)?.params.find((a) => a.kind === "item");
  if (!t) return "";
  const s = ye(e.params, t), n = s.title;
  if (typeof n == "string" && n.trim() !== "") return n;
  const i = T(s.material);
  return /^(minecraft:)?[a-z_0-9]+$/i.test(i) && !i.includes(":") ? J("item", i) : i || Qe(s);
}
function _n(e) {
  const t = ge(e.params);
  if (t === void 0) return 1;
  const s = Number(t);
  return Number.isFinite(s) ? s : 1;
}
function wn(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function Nn(e) {
  const t = e.trim().toLowerCase().replace(/ /g, "");
  if (t === "") return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const s = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!s) return 0;
  const [, n, i, a, o] = s;
  return Number(n ?? 0) * 86400 + Number(i ?? 0) * 3600 + Number(a ?? 0) * 60 + Number(o ?? 0);
}
function de(e, t) {
  return new Map((e ?? []).map((s) => [T(s[t]), s]));
}
function ee(e) {
  return Array.isArray(e) ? e.filter((t) => t && typeof t == "object") : [];
}
function Ye(e) {
  return e.length === 0 ? 0 : e.reduce((t, s) => t + s, 0) / e.length;
}
function ue(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function T(e) {
  return typeof e == "string" ? e : "";
}
const jn = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: ut,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  documents: [fn],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: gn,
  // The Quests tab of the server's Statistics space (SDK 1.23).
  stats: { label: { en: "Quests", fr: "Quêtes" }, component: Ot }
}, $n = { ...jn, sdk: "1.23.0" };
export {
  $n as default
};
