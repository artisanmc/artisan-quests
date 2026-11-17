import { createModuleI18n as kt, fieldText as wt, newTextKey as G, injectModuleStyles as Be, useServerDocuments as Nt, textValue as T, useStatsRead as ne, statsQuery as Oe, StatCard as _t, StatsPanel as fe, Funnel as jt, SortableTable as Le, statsBreakdown as Ct, useProject as St, useContentLang as Et, SortableList as we, Button as F, ConditionsEditor as At, updateDocument as $t, selectDocumentItem as Tt, projectLangs as Ve, LocalizedField as Ye, MiniMessageInput as Je, textValues as Ze, McText as ae, useUiLang as Xe, useOptionList as Ot, ActionChainEditor as Lt, mcWrap as Rt, ItemInput as It, MaterialInput as Dt, SDK_VERSION as Pt } from "@artisan/editor-sdk";
import { jsx as r, jsxs as h, Fragment as D } from "react/jsx-runtime";
import { useState as R, useEffect as Ne, useRef as Mt } from "react";
const Y = {
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
}, de = {
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
}, Re = { en: Y.kindLabel, fr: de.kindLabel }, Ht = { en: Y.collection, fr: de.collection }, _e = kt({ en: Y, fr: de });
function et(e) {
  const t = e === "fr" ? de : Y;
  return (n, a) => {
    const i = t[n] ?? Y[n] ?? n;
    return a ? i.replace(/\{\{(\w+)\}\}/g, (s, o) => String(a[o] ?? s)) : i;
  };
}
const ee = "quest_group", tt = "quest_groups", Qt = "quests", je = "quest_group/v1";
function Gt(e) {
  const t = { ...A(e) };
  return typeof t.strategy == "string" && t.strategy.toLowerCase() === "ladder" && (t.strategy = "sequential"), t;
}
const be = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function J(e = Date.now()) {
  let t = "", n = e;
  for (let s = 0; s < 10; s++)
    t = be[n % 32] + t, n = Math.floor(n / 32);
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  let i = "";
  for (let s = 0; s < 16; s++) i += be[a[s] % 32];
  return t + i;
}
function Z(e, t) {
  const n = new Set(t);
  if (!n.has(e)) return e;
  for (let a = 2; ; a++) if (!n.has(`${e}_${a}`)) return `${e}_${a}`;
}
function Kt(e, t) {
  const n = new Set(t), a = new Uint8Array(4);
  for (; ; ) {
    crypto.getRandomValues(a);
    const i = Array.from(a, (o) => be[o % 32].toLowerCase()).join(""), s = `${ue(e)}_${i}`;
    if (!n.has(s)) return s;
  }
}
function nt(e) {
  return e.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
function ue(e) {
  return e.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "quest";
}
function A(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? { ...e } : {};
}
function he(e) {
  return Array.isArray(e) ? e : [];
}
function O(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? String(e) : "";
}
function V(e, ...t) {
  const n = { ...e };
  for (const a of t) delete n[a];
  return n;
}
function Ut(e, t) {
  const n = {}, a = [];
  function i(d) {
    if (d && typeof d == "object" && !Array.isArray(d)) {
      const v = G(), x = {};
      for (const [f, y] of Object.entries(d)) x[f] = O(y);
      return n[v] = x, { key: v };
    }
    const u = typeof d == "string" ? /^\{i18n:(.+)\}$/.exec(d) : null;
    if (u) {
      const v = t.translations?.[u[1]];
      return v && (n[u[1]] = { ...v }), { key: u[1] };
    }
    const p = G();
    return n[p] = d == null || d === "" ? {} : { [t.lang]: O(d) }, { key: p };
  }
  const s = Object.entries(A(e.tiers)).map(([d, u]) => {
    const p = A(u);
    return { key: d, title: i(p.title), rest: V(p, "title") };
  }), o = he(e.quests).map((d, u) => {
    const p = A(d), v = he(p.stages).map((x, f) => {
      const y = A(x), g = O(y.flow).toLowerCase();
      return {
        key: O(y.key) || `stage_${f + 1}`,
        title: i(y.title),
        flow: g === "parallel" || g === "sequential" ? g : "",
        objectives: he(y.objectives).map((m, b) => {
          const k = A(m);
          return {
            key: O(k.key) || `objective_${b + 1}`,
            type: O(k.type),
            params: V(k, "key", "type")
          };
        }),
        rest: V(y, "key", "title", "flow", "objectives")
      };
    });
    return {
      key: O(p.key) || `quest_${u + 1}`,
      uid: O(p.uid) || J(),
      tier: O(p.tier),
      title: i(p.title),
      description: i(p.description),
      duration: O(p.duration),
      stages: v,
      rest: Wt(p)
    };
  }), l = {
    id: O(e.id),
    projectId: t.projectId,
    uid: O(e.uid) || J(),
    title: i(e.title),
    description: i(e.description),
    actorType: O(e.actor_type) || "player",
    reset: A(e.reset),
    limits: A(e.limits),
    rotation: A(e.rotation),
    distribution: Gt(e.distribution),
    tiers: s,
    quests: o,
    rest: at(V(
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
  return e.schema !== void 0 && e.schema !== je && a.push(`schema: ${String(e.schema)}`), { doc: l, i18nKeys: n, unsupported: a };
}
function at(e) {
  return e.on !== void 0 && (e.actions == null && (e.actions = e.on), delete e.on), e;
}
function Wt(e) {
  const t = at(
    V(e, "key", "uid", "tier", "title", "description", "duration", "stages", "reward_display")
  );
  if (t.rewards !== void 0) {
    const n = A(t.actions);
    n.complete == null && (t.actions = { ...n, complete: t.rewards }), delete t.rewards;
  }
  return t;
}
function Ft(e) {
  return typeof e == "string" ? e === "" : Object.values(e).every((t) => t === "");
}
function M(e) {
  const t = {};
  for (const [n, a] of Object.entries(e))
    a == null || a === "" || Array.isArray(a) && a.length === 0 || typeof a == "object" && !Array.isArray(a) && Object.keys(a).length === 0 || (t[n] = a);
  return t;
}
const zt = [
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
function Bt(e, t) {
  const n = (u) => wt(t, u.key), a = (u) => {
    const p = n(u);
    return Ft(p) ? void 0 : p;
  }, i = {};
  for (const u of e.tiers) i[u.key] = { ...u.rest, title: n(u.title) };
  const s = e.quests.map(
    (u) => M({
      key: u.key,
      uid: u.uid,
      tier: u.tier,
      title: n(u.title),
      description: a(u.description),
      duration: u.duration,
      ...u.rest,
      stages: u.stages.map(
        (p) => M({
          key: p.key,
          title: a(p.title),
          flow: p.flow,
          ...p.rest,
          objectives: p.objectives.map((v) => ({ key: v.key, type: v.type, ...v.params }))
        })
      )
    })
  ), o = {
    ...e.rest,
    id: e.id,
    schema: je,
    uid: e.uid,
    title: n(e.title),
    description: a(e.description),
    actor_type: e.actorType,
    reset: M(e.reset),
    limits: M(e.limits),
    rotation: M(e.rotation),
    distribution: M(e.distribution),
    tiers: i,
    quests: s
  }, l = {};
  for (const u of zt) u in o && (l[u] = o[u]);
  for (const u of Object.keys(o)) u in l || (l[u] = o[u]);
  const d = M(l);
  return d.quests = s, d;
}
function* Vt(e) {
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
    const i = e.quests[a], s = n.has(i.uid) ? `${i.uid}_${a}` : i.uid;
    n.add(i.uid);
    const o = `${t}.quests.${s}`;
    yield {
      lText: i.title,
      key: `${o}.title`,
      path: `quests[${a}].title`,
      kind: "quest.title"
    }, yield {
      lText: i.description,
      key: `${o}.description`,
      path: `quests[${a}].description`,
      kind: "quest.description"
    };
    const l = /* @__PURE__ */ new Set();
    for (let d = 0; d < i.stages.length; d++) {
      const u = i.stages[d], p = l.has(u.key) ? `${u.key}_${d}` : u.key;
      l.add(u.key), yield {
        lText: u.title,
        key: `${o}.stages.${p}.title`,
        path: `quests[${a}].stages[${d}].title`,
        kind: "quest.stage"
      };
    }
  }
}
function Ie(e) {
  return !!e && typeof e == "object" && !Array.isArray(e) && "type" in e;
}
function Yt(e) {
  const t = Array.isArray(e) ? e : e == null ? [] : [e];
  return {
    chain: t.filter((n) => !Ie(n)),
    legacy: t.filter(Ie)
  };
}
function De(e, t) {
  const n = [...e, ...t];
  return n.length ? n : void 0;
}
function Jt(e) {
  const t = String(e.type), n = e.command ?? e.message ?? e.title ?? e.material;
  return typeof n == "string" ? `${t} · ${n}` : t;
}
const Zt = [
  "distribution",
  "actor_load",
  "quest_start",
  "objective_progress",
  "objective_complete",
  "quest_complete",
  "period_complete"
], Xt = ["start", "objective_progress", "objective_complete", "complete"], it = {
  started: "quests:started",
  completed: "quests:completed",
  abandoned: "quests:abandoned",
  expired: "quests:expired"
}, ie = Object.keys(it), en = "quests:progress", tn = "quests:stuck", U = (e) => typeof e == "number" && Number.isFinite(e) ? e : 0;
function nn(e) {
  return e.map((t) => ({
    quest: String(t.quest ?? ""),
    started: U(t.started),
    inProgress: U(t.in_progress),
    completed: U(t.completed),
    medianSeconds: typeof t.median_seconds == "number" ? t.median_seconds : null
  }));
}
function an(e) {
  return e.map((t) => ({
    quest: String(t.quest ?? ""),
    stage: String(t.stage ?? ""),
    players: U(t.players),
    medianSeconds: U(t.median_seconds),
    longestSeconds: U(t.longest_seconds)
  }));
}
function sn(e, t, n) {
  const a = (s, o) => t[s]?.find((l) => l.value === o)?.count ?? 0, i = e.map((s) => s.key);
  for (const s of ie)
    for (const o of t[s] ?? []) i.includes(o.value) || i.push(o.value);
  return i.map((s) => {
    const o = a("started", s), l = a("completed", s), d = n.find((u) => u.quest === s);
    return {
      key: s,
      started: o,
      completed: l,
      abandoned: a("abandoned", s),
      expired: a("expired", s),
      unfinished: o > 0 ? Math.max(0, 1 - l / o) : null,
      inProgress: d?.inProgress ?? 0,
      medianSeconds: d?.medianSeconds ?? null
    };
  });
}
const Pe = (e) => (e ?? []).reduce((t, n) => t + n.count, 0);
function rn(e) {
  return e.distribution.strategy === "sequential";
}
function on(e, t) {
  const n = e[0];
  if (!n) return [];
  const a = (s) => t.find((o) => o.quest === s), i = a(n.key)?.started ?? 0;
  return i === 0 ? [] : [
    { key: n.key, kind: "started", value: i },
    ...e.map((s) => ({ key: s.key, kind: "completed", value: a(s.key)?.completed ?? 0 }))
  ];
}
function ln(e, t = "d") {
  const n = Math.max(0, Math.round(e));
  if (n < 60) return `${n} s`;
  const a = Math.round(n / 60);
  if (a < 60) return `${a} min`;
  const i = Math.floor(a / 60);
  if (i < 24) return a % 60 === 0 ? `${i} h` : `${i} h ${String(a % 60).padStart(2, "0")}`;
  const s = Math.floor(i / 24);
  return i % 24 === 0 ? `${s} ${t}` : `${s} ${t} ${i % 24} h`;
}
function cn(e, t, n) {
  if (t === void 0 || t === 0) return null;
  const a = (e - t) / t, i = new Intl.NumberFormat(n, { style: "percent", maximumFractionDigits: 0 }).format(Math.abs(a));
  return `${a >= 0 ? "▲" : "▼"} ${i}`;
}
const st = `
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
.aq-stats { display: flex; flex-direction: column; gap: 16px; color: var(--text); }
.aq-stats-pick { display: flex; align-items: center; gap: 10px; }
.aq-stats-pick .select { height: 32px; padding: 5px 10px; font-size: 13px; min-width: 220px; }
.aq-stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; }
.aq-stats-empty { padding: 24px 0; text-align: center; color: var(--text-mut); font-size: 13px; }
`;
function dn(e) {
  Be("msquests", st);
  const t = _e(), n = Nt(ee).map((s) => ({
    group: s.document,
    project: s.project
  })), a = n.find((s) => s.group.id === e.focus) ?? n[0];
  if (!a) return /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: t("stats.noGroup") });
  const i = (s) => T(s.project, s.group.title.key, e.lang) || s.group.id;
  return /* @__PURE__ */ h("div", { className: "aq-stats", children: [
    /* @__PURE__ */ h("label", { className: "aq-stats-pick", children: [
      /* @__PURE__ */ r("span", { className: "aq-h", children: t("stats.group") }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: a.group.id,
          onChange: (s) => e.onFocus(s.target.value),
          children: n.map((s) => /* @__PURE__ */ r("option", { value: s.group.id, children: i(s) }, s.group.id))
        }
      )
    ] }),
    /* @__PURE__ */ r(un, { ...e, group: a.group, project: a.project }, a.group.id)
  ] });
}
function un({
  serverId: e,
  period: t,
  player: n,
  compare: a,
  lang: i,
  group: s,
  project: o
}) {
  const l = _e(), d = `${e}|${s.id}`, u = (c, w) => Promise.all(
    ie.map(
      (N) => Ct(e, { event: it[N], from: c, to: w, player: n, dims: { group: s.id } }, "quest")
    )
  ).then((N) => Object.fromEntries(ie.map((P, te) => [P, N[te] ?? []]))), p = ne(
    `${d}|${t.from}|${t.to}|${n ?? ""}`,
    () => u(t.from, t.to)
  ), v = ne(
    `${d}|${t.previous.from}|${t.previous.to}|${n ?? ""}|${a}`,
    () => a ? u(t.previous.from, t.previous.to) : Promise.resolve(void 0)
  ), x = ne(
    `${d}|progress`,
    () => Oe(e, en, { group: s.id }).then((c) => nn(c.rows))
  ), f = ne(
    `${d}|stuck`,
    () => Oe(e, tn, { group: s.id }).then((c) => an(c.rows))
  ), y = (c) => {
    const w = s.quests.find((N) => N.key === c);
    return w && T(o, w.title.key, i) || c;
  }, g = (c, w) => {
    const N = s.quests.find((P) => P.key === c)?.stages.find((P) => P.key === w);
    return N && T(o, N.title.key, i) || w;
  }, m = (c) => new Intl.NumberFormat(i).format(c), b = (c) => new Intl.NumberFormat(i, { style: "percent", maximumFractionDigits: 0 }).format(c), k = (c) => c === null ? "–" : ln(c, l("stats.day"));
  if (p.error) return /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.unavailable") });
  const _ = sn(s.quests, p.data ?? {}, x.data ?? []), j = rn(s) ? on(s.quests, x.data ?? []) : [], C = (c) => c === void 0 ? null : l(
    c === "server_offline" ? "stats.offline" : c === "unknown_query" ? "stats.notComputed" : "stats.unavailable"
  ), q = {
    started: void 0,
    completed: !0,
    abandoned: !1,
    expired: !1
  };
  return /* @__PURE__ */ h(D, { children: [
    /* @__PURE__ */ r("div", { className: "aq-stats-cards", children: ie.map((c) => {
      const w = Pe(p.data?.[c]), N = cn(w, v.data ? Pe(v.data[c]) : void 0, i), P = N?.startsWith("▲") ?? !1, te = q[c];
      return /* @__PURE__ */ r(
        _t,
        {
          label: l(`stats.${c}`),
          value: p.data ? m(w) : "…",
          sub: l("stats.overPeriod"),
          trend: N === null ? void 0 : {
            label: N,
            tone: te === void 0 ? "default" : P === te ? "positive" : "negative"
          }
        },
        c
      );
    }) }),
    j.length > 0 && /* @__PURE__ */ r(fe, { title: l("stats.funnel"), hint: l("stats.allTime"), children: /* @__PURE__ */ r(
      jt,
      {
        steps: j.map((c) => ({
          id: `${c.kind}:${c.key}`,
          label: l(c.kind === "started" ? "stats.funnelStarted" : "stats.funnelCompleted", {
            quest: y(c.key)
          }),
          value: c.value
        })),
        formatValue: m,
        formatShare: b
      }
    ) }),
    /* @__PURE__ */ h(fe, { title: l("stats.quests"), hint: l("stats.questsHint"), children: [
      _.length === 0 ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.noQuestYet") }) : /* @__PURE__ */ r(
        Le,
        {
          rows: _,
          rowId: (c) => c.key,
          initialSort: "unfinished",
          columns: pn(l, y, m, b, k)
        }
      ),
      x.error && /* @__PURE__ */ r("p", { className: "aq-hint", children: C(x.error) })
    ] }),
    /* @__PURE__ */ r(fe, { title: l("stats.stuck"), hint: l("stats.stuckHint"), children: f.error ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: C(f.error) }) : f.data && f.data.length === 0 ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.nobodyStuck") }) : /* @__PURE__ */ r(
      Le,
      {
        rows: f.data ?? [],
        rowId: (c) => `${c.quest}/${c.stage}`,
        initialSort: "players",
        columns: [
          { id: "quest", label: l("stats.quest"), value: (c) => y(c.quest) },
          { id: "stage", label: l("stats.stage"), value: (c) => g(c.quest, c.stage) },
          {
            id: "players",
            label: l("stats.waiting"),
            align: "right",
            value: (c) => c.players,
            render: (c) => m(c.players)
          },
          {
            id: "median",
            label: l("stats.medianWait"),
            align: "right",
            value: (c) => c.medianSeconds,
            render: (c) => k(c.medianSeconds)
          },
          {
            id: "longest",
            label: l("stats.longestWait"),
            align: "right",
            value: (c) => c.longestSeconds,
            render: (c) => k(c.longestSeconds)
          }
        ]
      }
    ) })
  ] });
}
function pn(e, t, n, a, i) {
  const s = (o, l) => ({
    id: o,
    label: l,
    align: "right",
    value: (d) => d[o],
    render: (d) => n(d[o])
  });
  return [
    { id: "quest", label: e("stats.quest"), value: (o) => t(o.key) },
    s("started", e("stats.started")),
    s("completed", e("stats.completed")),
    {
      id: "unfinished",
      label: e("stats.unfinished"),
      align: "right",
      // A quest nobody started sorts last: it has nothing to say about where players stop.
      value: (o) => o.unfinished ?? -1,
      render: (o) => o.unfinished === null ? "–" : a(o.unfinished)
    },
    s("abandoned", e("stats.abandoned")),
    s("expired", e("stats.expired")),
    s("inProgress", e("stats.inProgress")),
    {
      id: "median",
      label: e("stats.median"),
      align: "right",
      value: (o) => o.medianSeconds ?? -1,
      render: (o) => i(o.medianSeconds)
    }
  ];
}
const rt = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
}, mn = /^\d+$/;
function ge(e, t, n) {
  const a = String(n).padStart(2, "0");
  return e === "fr" ? n === 0 ? `${t} h` : `${t} h ${a}` : `${String(t).padStart(2, "0")}:${a}`;
}
function L(e, t, n) {
  return mn.test(e) && Number(e) >= t && Number(e) <= n;
}
function ye(e) {
  return e.trim().split(/\s+/).length === 5;
}
function fn(e, t) {
  const n = t === "fr", a = e.trim().split(/\s+/);
  if (a.length !== 5) return null;
  const [i, s, o, l, d] = a;
  if (l !== "*") return null;
  const u = /^\*\/(\d+)$/;
  if (o === "*" && d === "*") {
    if (L(i, 0, 59) && L(s, 0, 23))
      return n ? `tous les jours à ${ge(t, +s, +i)}` : `every day at ${ge(t, +s, +i)}`;
    const v = u.exec(s);
    if (L(i, 0, 59) && v)
      return n ? `toutes les ${v[1]} h, à la minute ${i}` : `every ${v[1]} hours, at minute ${i}`;
    if (L(i, 0, 59) && s === "*")
      return n ? `toutes les heures, à la minute ${i}` : `every hour, at minute ${i}`;
    const x = u.exec(i);
    return x && s === "*" ? n ? `toutes les ${x[1]} minutes` : `every ${x[1]} minutes` : null;
  }
  if (!L(i, 0, 59) || !L(s, 0, 23)) return null;
  const p = ge(t, +s, +i);
  if (o === "*" && L(d, 0, 7)) {
    const v = rt[n ? "fr" : "en"][Number(d) % 7];
    return n ? `chaque ${v} à ${p}` : `every ${v} at ${p}`;
  }
  return d === "*" && L(o, 1, 31) ? n ? `le ${o === "1" ? "1er" : o} de chaque mois à ${p}` : `on day ${o} of each month at ${p}` : null;
}
function B(e, t, n) {
  const a = /* @__PURE__ */ new Set();
  for (const i of e.split(",")) {
    const s = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(i);
    if (!s) return null;
    const o = s[4] ? Number(s[4]) : 1, l = s[1] === "*" ? t : Number(s[2]), d = s[1] === "*" ? n : s[3] ? Number(s[3]) : s[4] ? n : l;
    if (o < 1 || l < t || d > n || l > d) return null;
    for (let u = l; u <= d; u += o) a.add(u);
  }
  return a;
}
function hn(e, t) {
  const n = e.trim().split(/\s+/);
  if (n.length !== 5) return null;
  const a = B(n[0], 0, 59), i = B(n[1], 0, 23), s = B(n[2], 1, 31), o = B(n[3], 1, 12), l = B(n[4], 0, 7);
  if (!a || !i || !s || !o || !l) return null;
  l.has(7) && l.add(0);
  const d = n[2] === "*", u = n[4] === "*", p = (f) => d && u ? !0 : d ? l.has(f.getDay()) : u ? s.has(f.getDate()) : s.has(f.getDate()) || l.has(f.getDay()), v = new Date(t.getTime());
  v.setSeconds(0, 0), v.setMinutes(v.getMinutes() + 1);
  const x = t.getTime() + 366 * 24 * 3600 * 1e3;
  for (; v.getTime() <= x; ) {
    if (!o.has(v.getMonth() + 1) || !p(v)) {
      v.setDate(v.getDate() + 1), v.setHours(0, 0, 0, 0);
      continue;
    }
    if (!i.has(v.getHours())) {
      v.setHours(v.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (a.has(v.getMinutes())) return v;
    v.setMinutes(v.getMinutes() + 1);
  }
  return null;
}
function gn(e) {
  const t = e.trim().split(/\s+/);
  if (e.trim() === "") return { kind: "never" };
  if (t.length !== 5) return { kind: "custom" };
  const [n, a, i, s, o] = t;
  if (s !== "*" || !L(n, 0, 59) || !L(a, 0, 23)) return { kind: "custom" };
  const l = `${a.padStart(2, "0")}:${n.padStart(2, "0")}`;
  return i === "*" && o === "*" ? { kind: "daily", time: l } : i === "*" && L(o, 0, 7) ? { kind: "weekly", time: l, day: Number(o) % 7 } : o === "*" && L(i, 1, 31) ? { kind: "monthly", time: l, day: Number(i) } : { kind: "custom" };
}
function yn(e) {
  if (e.kind === "never") return "";
  if (e.kind === "custom") return null;
  const t = /^(\d{1,2}):(\d{2})$/.exec(e.time), n = t ? Math.min(23, Number(t[1])) : 4, a = t ? Math.min(59, Number(t[2])) : 0;
  return e.kind === "daily" ? `${a} ${n} * * *` : e.kind === "weekly" ? `${a} ${n} * * ${e.day}` : `${a} ${n} ${Math.min(31, Math.max(1, e.day))} * *`;
}
function vn(e) {
  return rt[e === "fr" ? "fr" : "en"];
}
const H = { name: "amount", kind: "int", required: !0 }, Ce = [
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
  return Ce.find((t) => t.type === e);
}
function ot(e) {
  const t = {};
  for (const n of z(e)?.params ?? [])
    n.kind === "int" && (t[n.name] = 1);
  return t;
}
function pe(e) {
  return e.amount ?? e.distance;
}
function Se(e, t) {
  const n = e[t.name];
  if (n && typeof n == "object" && !Array.isArray(n)) return n;
  const a = t.legacy ? e[t.legacy] : void 0;
  return typeof a == "string" && a !== "" ? { material: a } : {};
}
function bn(e, t, n, a) {
  t.legacy && delete e[t.legacy];
  const i = !n || Object.keys(n).length === 0;
  i ? delete e[t.name] : e[t.name] = n, i || a === void 0 ? delete e.match : e.match = a;
}
function lt(e) {
  const t = e.title;
  if (typeof t == "string" && t.trim() !== "") return t.replace(/<[^>]*>/g, "");
  const n = e.material ?? e.item;
  return typeof n == "string" ? n : "";
}
function Ee(e, t) {
  const n = z(e);
  return n ? n.params.filter((a) => a.kind !== "int" && a.kind !== "line").map((a) => a.kind === "item" ? lt(Se(t, a)) : t[a.name]).filter((a) => typeof a == "string" && a !== "").join(" = ") : Object.keys(t).map((a) => t[a]).filter((a) => typeof a == "string" && a !== "").join(" = ");
}
function ct(e, t) {
  return (z(e)?.params ?? []).filter((n) => n.required && (t[n.name] === void 0 || t[n.name] === "")).map((n) => n.name);
}
const qn = [
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
], xn = "#f59e0b";
function oe(e, t) {
  return z(t) ? e(`objective.${t}`) : t;
}
function le(e, t) {
  const n = Ee(t.type, t.params), a = pe(t.params);
  return `${oe(e, t.type)}${n ? ` · ${n}` : ""}${a !== void 0 ? ` · 0/${String(a)}` : ""}`;
}
function K(e) {
  return e.replace(/<[^<>]*>/g, "").trim();
}
function Ae(e) {
  const t = e.distribution?.strategy;
  return typeof t == "string" && ["sequential", "ladder"].includes(t.toLowerCase());
}
function kn(e, t, n) {
  const a = et(n), i = Ae(e);
  return e.quests.map((s, o) => {
    const l = T(t, s.title.key, n);
    return {
      id: s.uid,
      label: K(l) || s.key,
      detail: s.tier || void 0,
      caption: wn(a, s),
      marker: i ? String(o + 1) : void 0,
      hover: {
        title: l || s.key,
        text: T(t, s.description.key, n) || void 0,
        lines: Nn(a, s, t, n)
      }
    };
  });
}
function wn(e, t) {
  const n = t.stages.flatMap((s) => s.objectives), a = n[0];
  if (!a) return;
  const i = n.length - 1;
  return i > 0 ? `${le(e, a)} +${String(i)}` : le(e, a);
}
function Nn(e, t, n, a) {
  const i = t.stages.length > 1;
  return t.stages.flatMap(
    (s, o) => s.objectives.map((l) => {
      const d = le(e, l);
      return i ? `<gray>${K(T(n, s.title.key, a)) || e("stage", { n: o + 1 })} ·</gray> ${d}` : d;
    })
  );
}
function _n(e, t) {
  const n = et(t), a = typeof e.distribution?.strategy == "string" ? e.distribution.strategy.toLowerCase() : "", i = e.quests.length, s = i === 1 ? n("questCountOne") : n("questCount", { count: i }), o = a === "sequential" || a === "ladder" ? "ordered" : a;
  return ["none", "ordered", "random"].includes(o) ? `${s} · ${n(`strategy.${o}`).toLowerCase()}` : s;
}
function jn(e, t) {
  const n = pe(t.params), a = Ee(t.type, t.params), i = n !== void 0 ? String(n) : "", s = i && a ? `${i} × ${a}` : i || a;
  return s ? `${oe(e, t.type)} · ${s}` : oe(e, t.type);
}
function dt(e) {
  return e.stages.flatMap((t) => t.objectives);
}
function Cn(e) {
  const t = dt(e), n = t.map((a) => a.key);
  return t.some(
    (a) => ct(a.type, a.params).length > 0 || n.indexOf(a.key) !== n.lastIndexOf(a.key)
  );
}
function Sn(e) {
  return Object.values(A(e.rest.actions)).reduce(
    (t, n) => t + (Array.isArray(n) ? n.length : n == null ? 0 : 1),
    0
  );
}
function ut(e) {
  const t = e.completed_when;
  return Array.isArray(t) ? t : t ? [t] : [];
}
function Me(e) {
  const t = e.map((n) => {
    if (typeof n == "string") return n;
    const a = n && typeof n == "object" ? n.expression : void 0;
    return typeof a == "string" ? a : null;
  });
  return t.every((n) => n !== null) ? t.join(" · ") : null;
}
function En(e, t, n) {
  const a = structuredClone(e);
  a.uid = J(), a.key = Z(`${e.key}_copy`, t), a.title = n(e.title), a.description = n(e.description);
  for (const [i, s] of a.stages.entries()) s.title = n(e.stages[i].title);
  return a;
}
const He = ["player", "global"], ve = /* @__PURE__ */ new Set();
function An(e, t, n) {
  if (n && n.length > 0)
    return t && !n.includes(t) ? [...n, t] : [...n];
  const a = e?.documents?.[ee];
  for (const i of Array.isArray(a) ? a : []) {
    const s = i.actorType;
    typeof s == "string" && s && ve.add(s);
  }
  return t && ve.add(t), [...He, ...[...ve].filter((i) => !He.includes(i)).sort()];
}
function pt(e, t) {
  if (typeof e == "string") return e === "" ? {} : { [t]: e };
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const n = {};
  for (const [a, i] of Object.entries(e))
    typeof i == "string" && i !== "" && (n[a] = i);
  return n;
}
function $n(e, t, n, a) {
  const i = pt(e, t);
  return a === "" ? delete i[n] : i[n] = a, Object.keys(i).length > 0 ? i : void 0;
}
const Tn = /^(\d+|(\d+[dhms])+)$/, On = ["actor_load", "period_reset", "quest_complete"], Ln = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
function Rn(e, t) {
  const n = hn(e, /* @__PURE__ */ new Date());
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
function In({ projectId: e, documentId: t, document: n, item: a }) {
  Be("msquests", st);
  const i = n, s = St(e), o = Et(), l = _e(), [d, u] = R(a ?? null);
  Ne(() => {
    u(a ?? null);
  }, [a]);
  const p = (y) => {
    u(y), Tt({ documentId: t, item: y });
  }, x = { projectId: e, project: s, lang: o, t: l, edit: (y, g) => {
    const m = structuredClone(i);
    y(m), $t({ projectId: e, kind: ee, id: t, doc: m, texts: g });
  } }, f = d ? i.quests.findIndex((y) => y.uid === d) : -1;
  return /* @__PURE__ */ r("div", { className: "aq", children: f >= 0 ? /* @__PURE__ */ r(zn, { ctx: x, group: i, index: f, onLeave: () => p(null) }, d) : /* @__PURE__ */ r(Qn, { ctx: x, group: i, onOpen: p }) });
}
function X({ open: e }) {
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
function Dn() {
  return /* @__PURE__ */ h("svg", { "aria-hidden": "true", width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: [
    /* @__PURE__ */ r("circle", { cx: "3", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "8", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "13", cy: "8", r: "1.5" })
  ] });
}
function E({ tone: e, title: t, children: n }) {
  return /* @__PURE__ */ r("span", { className: `aq-chip${e ? ` is-${e}` : ""}`, title: t, children: n });
}
function ce({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  return /* @__PURE__ */ r("div", { className: "aq-seg", role: "radiogroup", "aria-label": e, children: n.map((i) => /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      role: "radio",
      "aria-checked": t === i.value,
      className: `aq-opt${t === i.value ? " is-on" : ""}`,
      onClick: () => a(i.value),
      children: i.label
    },
    i.value
  )) });
}
function $({
  label: e,
  children: t,
  hint: n,
  title: a
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the control is the child
    /* @__PURE__ */ h("label", { className: "aq-field", title: a, children: [
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
  rows: i,
  bare: s,
  placeholder: o
}) {
  const l = Ve(e.project);
  return /* @__PURE__ */ r(
    Ye,
    {
      className: "aq-field",
      label: t,
      langs: l,
      activeLang: e.lang,
      defaultLang: l[0] ?? e.lang,
      values: Ze(e.project, n.key),
      onChange: (d, u) => e.edit(() => {
      }, [{ key: n.key, lang: d, value: u }]),
      inline: s,
      renderEditor: (d) => /* @__PURE__ */ r(
        Je,
        {
          value: d.value,
          onChange: d.onChange,
          placeholder: d.fallback ?? o,
          multiline: a,
          rows: a ? i : void 0,
          "aria-label": d.label
        }
      )
    }
  );
}
function mt({
  ctx: e,
  label: t,
  value: n,
  onChange: a
}) {
  const i = Ve(e.project), s = i[0] ?? e.lang;
  return /* @__PURE__ */ r("span", { title: e.t("lineHint"), className: "aq-grow", children: /* @__PURE__ */ r(
    Ye,
    {
      className: "aq-field",
      label: t,
      langs: i,
      activeLang: e.lang,
      defaultLang: s,
      values: pt(n, s),
      onChange: (o, l) => a($n(n, s, o, l)),
      renderEditor: (o) => /* @__PURE__ */ r(
        Je,
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
function Pn(e) {
  return typeof e == "number" ? String(e) : typeof e == "string" ? e : "";
}
function Q({
  label: e,
  value: t,
  onChange: n,
  placeholder: a
}) {
  return /* @__PURE__ */ r($, { label: e, children: /* @__PURE__ */ r(
    "input",
    {
      className: "input",
      type: "number",
      min: 0,
      step: 1,
      value: Pn(t),
      placeholder: a,
      onChange: (i) => {
        const s = i.target.value.trim();
        n(s === "" ? void 0 : Math.max(0, Math.trunc(Number(s))));
      }
    }
  ) });
}
function Mn(e) {
  const t = ft(e);
  return t !== "" && t !== "none";
}
function ft(e) {
  return typeof e.strategy == "string" ? e.strategy.toLowerCase() : "";
}
function S(e, t, n) {
  n === void 0 || n === "" ? delete e[t] : e[t] = n;
}
function $e(e, t, n) {
  if (n < 0 || n >= e.length) return;
  const [a] = e.splice(t, 1);
  e.splice(n, 0, a);
}
function me({
  label: e,
  onClick: t,
  disabled: n,
  expanded: a,
  children: i
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
      children: i
    }
  );
}
function Te({
  t: e,
  label: t,
  sure: n,
  onRemove: a
}) {
  const [i, s] = R(!1);
  return i ? /* @__PURE__ */ h("span", { className: "aq-confirm", children: [
    /* @__PURE__ */ r(F, { size: "sm", variant: "ghost", onClick: () => s(!1), children: e("cancel") }),
    /* @__PURE__ */ r("button", { type: "button", className: "aq-danger", onClick: a, children: e("remove") })
  ] }) : /* @__PURE__ */ r(me, { label: t, onClick: () => n ? a() : s(!0), children: "×" });
}
function Hn({
  label: e,
  children: t
}) {
  const [n, a] = R(!1), i = Mt(null);
  return Ne(() => {
    if (!n) return;
    const s = (l) => {
      i.current?.contains(l.target) || a(!1);
    }, o = (l) => {
      l.key === "Escape" && (l.preventDefault(), a(!1));
    };
    return window.addEventListener("mousedown", s), window.addEventListener("keydown", o, !0), () => {
      window.removeEventListener("mousedown", s), window.removeEventListener("keydown", o, !0);
    };
  }, [n]), /* @__PURE__ */ h("div", { className: "aq-menu-anchor", ref: i, children: [
    /* @__PURE__ */ r(me, { label: e, expanded: n, onClick: () => a(!n), children: /* @__PURE__ */ r(Dn, {}) }),
    n && /* @__PURE__ */ r("div", { className: "aq-menu", role: "menu", children: t(() => a(!1)) })
  ] });
}
function ht(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n, a) => {
    const i = t.has(n) ? `${n}#${a}` : n;
    return t.add(n), i;
  });
}
function Qn({
  ctx: e,
  group: t,
  onOpen: n
}) {
  const { t: a, edit: i, project: s, lang: o } = e, [l, d] = R(t.quests.length === 0), [u, p] = R(null), v = Ae(t), x = Object.keys(t.rest).filter((g) => g !== "actions"), f = () => {
    const g = G(), m = J();
    i(
      (b) => {
        b.quests.push({
          key: Z(
            "quest",
            b.quests.map((k) => k.key)
          ),
          uid: m,
          tier: "",
          title: { key: g },
          description: { key: G() },
          duration: "",
          stages: [vt(1)],
          rest: {}
        });
      },
      [{ key: g, lang: o, value: a("newQuestTitle") }]
    ), n(m);
  }, y = (g) => {
    const m = [], b = (k) => {
      const _ = G();
      for (const [j, C] of Object.entries(Ze(s, k.key)))
        C !== "" && m.push({ key: _, lang: j, value: C });
      return { key: _ };
    };
    i((k) => {
      k.quests.splice(
        g + 1,
        0,
        En(
          k.quests[g],
          k.quests.map((_) => _.key),
          b
        )
      );
    }, m);
  };
  return /* @__PURE__ */ h(D, { children: [
    /* @__PURE__ */ h("section", { className: "aq-card", children: [
      /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: "aq-fold-head",
          "aria-expanded": l,
          onClick: () => d(!l),
          children: [
            /* @__PURE__ */ r(X, { open: l }),
            /* @__PURE__ */ r("span", { className: "aq-h", children: a("groupSettings") }),
            !l && /* @__PURE__ */ r(Kn, { ctx: e, group: t })
          ]
        }
      ),
      l && /* @__PURE__ */ r(Un, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ h("section", { className: "aq-card", children: [
      /* @__PURE__ */ h("div", { className: "aq-card-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: a("quests") }),
        /* @__PURE__ */ r("span", { className: "aq-count", children: t.quests.length }),
        /* @__PURE__ */ r("span", { className: "aq-grow" }),
        /* @__PURE__ */ h(F, { size: "sm", variant: "primary", onClick: f, children: [
          "+ ",
          a("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: a("noQuests") }),
      /* @__PURE__ */ r(
        we,
        {
          ids: t.quests.map((g) => g.uid),
          onMove: (g, m) => i((b) => $e(b.quests, g, m)),
          className: "aq-quests",
          itemClassName: "aq-quest",
          children: (g, m) => {
            const b = t.quests[g], k = K(T(s, b.title.key, o)) || b.key, _ = dt(b), j = ut(b.rest), C = t.tiers.find((c) => c.key === b.tier), q = Sn(b);
            return /* @__PURE__ */ h(D, { children: [
              m,
              v && /* @__PURE__ */ r("span", { className: "aq-n", children: g + 1 }),
              /* @__PURE__ */ h("button", { type: "button", className: "aq-quest-main", onClick: () => n(b.uid), children: [
                /* @__PURE__ */ r("span", { className: "aq-quest-title", children: k }),
                /* @__PURE__ */ r("span", { className: "aq-quest-sub", children: _.length === 0 ? a("noObjectivesShort") : _.map((c) => jn(a, c)).join("  ·  ") })
              ] }),
              u === b.uid ? /* @__PURE__ */ h("span", { className: "aq-confirm", children: [
                /* @__PURE__ */ r("span", { children: a("removeConfirm", { name: k }) }),
                /* @__PURE__ */ r(F, { size: "sm", variant: "ghost", onClick: () => p(null), children: a("cancel") }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "aq-danger",
                    onClick: () => {
                      p(null), i((c) => {
                        c.quests.splice(g, 1);
                      });
                    },
                    children: a("remove")
                  }
                )
              ] }) : /* @__PURE__ */ h(D, { children: [
                /* @__PURE__ */ h("span", { className: "aq-chips", children: [
                  Cn(b) && /* @__PURE__ */ r(E, { tone: "warn", children: a("toComplete") }),
                  v && j.length > 0 && /* @__PURE__ */ h(E, { title: a("completedWhenHint"), children: [
                    a("completedWhen"),
                    " ",
                    Me(j) !== null ? /* @__PURE__ */ r("span", { className: "aq-mono", children: Me(j) }) : a("conditionCount", { count: j.length })
                  ] }),
                  b.tier && /* @__PURE__ */ r(E, { children: C && K(T(s, C.title.key, o)) || b.tier }),
                  b.duration && /* @__PURE__ */ r(E, { children: b.duration }),
                  q > 0 && /* @__PURE__ */ r(E, { children: q === 1 ? a("actionCountOne") : a("actionCount", { count: q }) })
                ] }),
                /* @__PURE__ */ r(Hn, { label: a("moreActions"), children: (c) => /* @__PURE__ */ h(D, { children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      onClick: () => {
                        c(), y(g);
                      },
                      children: a("duplicate")
                    }
                  ),
                  /* @__PURE__ */ h(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      className: "is-danger",
                      onClick: () => {
                        c(), p(b.uid);
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
      x.length > 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: a("kept", { fields: x.join(", ") }) })
    ] })
  ] });
}
function gt(e, t) {
  return t === "player" || t === "global" || t === "guild" ? e(`actor.${t}`) : t;
}
const Gn = "quests:actor_types";
function qe(e) {
  const t = ft(e);
  return t === "sequential" || t === "ladder" ? "ordered" : t === "none" || t === "random" ? t : "";
}
function Kn({ ctx: e, group: t }) {
  const { t: n } = e, a = Xe(), i = typeof t.reset.cron == "string" ? t.reset.cron : "", s = qe(t.distribution), o = Object.keys(A(t.rest.actions)).length, l = i ? fn(i, a) ?? i : n("noReset");
  return /* @__PURE__ */ h("span", { className: "aq-chips", children: [
    /* @__PURE__ */ r(E, { children: gt(n, t.actorType) }),
    s && /* @__PURE__ */ r(E, { children: n(`strategy.${s}`) }),
    /* @__PURE__ */ r(E, { children: l.charAt(0).toUpperCase() + l.slice(1) }),
    t.tiers.length > 0 && /* @__PURE__ */ r(E, { children: n("tierCount", { count: t.tiers.length }) }),
    o > 0 && /* @__PURE__ */ r(E, { children: n("eventCount", { count: o }) })
  ] });
}
function Un({ ctx: e, group: t }) {
  const { t: n, edit: a, project: i, lang: s } = e, o = qe(t.distribution), l = o === "ordered", d = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], u = t.distribution.tiers ?? {}, p = Ot(Gn)?.map((f) => f.value), v = An(i, t.actorType, p), x = !!p?.length && !!t.actorType && !p.includes(t.actorType);
  return /* @__PURE__ */ h("div", { className: "aq-settings", children: [
    /* @__PURE__ */ h("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("identity") }),
      /* @__PURE__ */ r(W, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ r(W, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ h("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("actorType") }),
        /* @__PURE__ */ r(
          ce,
          {
            label: n("actorType"),
            value: t.actorType,
            options: v.map((f) => ({ value: f, label: gt(n, f) })),
            onChange: (f) => a((y) => {
              y.actorType = f;
            })
          }
        ),
        x && /* @__PURE__ */ r("span", { className: "aq-warn", children: n("actorUnknown", { type: t.actorType }) })
      ] })
    ] }),
    /* @__PURE__ */ h("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("distribution") }),
      /* @__PURE__ */ h("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("strategy") }),
        /* @__PURE__ */ r(
          ce,
          {
            label: n("strategy"),
            value: o,
            options: ["none", "ordered", "random"].map((f) => ({
              value: f,
              label: n(`strategy.${f}`)
            })),
            onChange: (f) => a((y) => {
              f === "ordered" && qe(y.distribution) === "ordered" || (y.distribution.strategy = f === "ordered" ? "sequential" : f);
            })
          }
        )
      ] }),
      !l && /* @__PURE__ */ h(D, { children: [
        /* @__PURE__ */ h("div", { className: "aq-row", children: [
          /* @__PURE__ */ r(
            Q,
            {
              label: n("amount"),
              value: t.distribution.amount,
              onChange: (f) => a((y) => S(y.distribution, "amount", f))
            }
          ),
          /* @__PURE__ */ r(
            Q,
            {
              label: n("maxActive"),
              value: t.limits.max_active,
              onChange: (f) => a((y) => S(y.limits, "max_active", f))
            }
          )
        ] }),
        /* @__PURE__ */ h("div", { className: "aq-field", children: [
          /* @__PURE__ */ r("span", { className: "field-label", children: n("triggers") }),
          On.map((f) => /* @__PURE__ */ h("label", { className: "aq-check", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: d.includes(f),
                onChange: (y) => a((g) => {
                  const m = Array.isArray(g.distribution.triggers) ? g.distribution.triggers : [], b = y.target.checked ? [...m, f] : m.filter((k) => k !== f);
                  S(g.distribution, "triggers", b.length ? b : void 0);
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
          onChange: (f) => a((y) => S(y.limits, "max_per_period", f))
        }
      ),
      !l && /* @__PURE__ */ h("div", { className: "aq-row", children: [
        /* @__PURE__ */ h("label", { className: "aq-check", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: t.rotation.enabled === !0,
              onChange: (f) => a((y) => S(y.rotation, "enabled", f.target.checked ? !0 : void 0))
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
            onChange: (f) => a((y) => S(y.rotation, "max_per_period", f))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ h("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("reset") }),
      /* @__PURE__ */ r(Wn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ h("div", { className: "aq-block", children: [
      /* @__PURE__ */ h("div", { className: "aq-block-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("tiers") }),
        /* @__PURE__ */ h(
          F,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => a((f) => {
              f.tiers.push({
                key: Z(
                  "tier",
                  f.tiers.map((y) => y.key)
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
      t.tiers.map((f, y) => /* @__PURE__ */ h("div", { className: "aq-tier", children: [
        /* @__PURE__ */ r(W, { ctx: e, label: n("title"), node: f.title }),
        /* @__PURE__ */ r($, { label: n("tierKey"), children: /* @__PURE__ */ r(
          "input",
          {
            className: "input aq-mono",
            defaultValue: f.key,
            onBlur: (g) => {
              const m = ue(g.target.value);
              m !== f.key && a((b) => {
                const k = Z(
                  m,
                  b.tiers.map((j) => j.key)
                );
                b.tiers[y].key = k;
                for (const j of b.quests) j.tier === f.key && (j.tier = k);
                const _ = b.distribution.tiers;
                _ && f.key in _ && (_[k] = _[f.key], delete _[f.key]);
              });
            }
          }
        ) }),
        !l && /* @__PURE__ */ r(
          Q,
          {
            label: n("perTier"),
            value: u[f.key],
            onChange: (g) => a((m) => {
              const b = { ...m.distribution.tiers ?? {} };
              S(b, f.key, g), S(m.distribution, "tiers", Object.keys(b).length ? b : void 0);
            })
          }
        ),
        /* @__PURE__ */ r(
          Te,
          {
            t: n,
            label: n("remove"),
            sure: !t.quests.some((g) => g.tier === f.key),
            onRemove: () => a((g) => {
              g.tiers.splice(y, 1);
            })
          }
        )
      ] }, f.key)),
      t.tiers.length === 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: n("noTier") })
    ] }),
    /* @__PURE__ */ r("div", { className: "aq-block is-wide", children: /* @__PURE__ */ r(
      yt,
      {
        ctx: e,
        title: n("hooks"),
        hooks: Zt,
        label: (f) => n(`hook.${f}`),
        value: t.rest.actions,
        onChange: (f, y) => a((g) => {
          const m = { ...A(g.rest.actions) };
          S(m, f, y), S(g.rest, "actions", Object.keys(m).length ? m : void 0);
        })
      },
      t.uid
    ) })
  ] });
}
function Wn({ ctx: e, group: t }) {
  const { t: n, edit: a } = e, i = Xe(), s = typeof t.reset.cron == "string" ? t.reset.cron : "", o = gn(s), [l, d] = R(!1), u = l && s !== "" ? { kind: "custom" } : o, p = typeof t.reset.timezone == "string" ? t.reset.timezone : "", v = s && ye(s) ? Rn(s, i) : null, x = (g) => {
    const m = yn(g);
    m !== null && a((b) => S(b.reset, "cron", m));
  }, f = "time" in u ? u.time : "04:00", y = (g) => {
    d(g === "custom"), g === "never" ? x({ kind: g }) : g === "daily" ? x({ kind: g, time: f }) : g === "weekly" ? x({ kind: g, time: f, day: 1 }) : g === "monthly" ? x({ kind: g, time: f, day: 1 }) : s === "" && a((m) => S(m.reset, "cron", "0 4 * * *"));
  };
  return /* @__PURE__ */ h(D, { children: [
    /* @__PURE__ */ r(
      ce,
      {
        label: n("reset"),
        value: u.kind,
        options: ["never", "daily", "weekly", "monthly", "custom"].map((g) => ({
          value: g,
          label: n(`reset.${g}`)
        })),
        onChange: y
      }
    ),
    u.kind !== "never" && /* @__PURE__ */ h("div", { className: "aq-row aq-reset", children: [
      u.kind === "weekly" && /* @__PURE__ */ r($, { label: n("resetDay"), children: /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: u.day,
          onChange: (g) => x({ ...u, day: Number(g.target.value) }),
          children: [1, 2, 3, 4, 5, 6, 0].map((g) => /* @__PURE__ */ r("option", { value: g, children: vn(i)[g] }, g))
        }
      ) }),
      u.kind === "monthly" && /* @__PURE__ */ r(
        Q,
        {
          label: n("resetDayOfMonth"),
          value: u.day,
          onChange: (g) => x({ ...u, day: g ?? 1 })
        }
      ),
      u.kind === "custom" ? /* @__PURE__ */ r(
        $,
        {
          label: n("cron"),
          hint: ye(s) ? void 0 : /* @__PURE__ */ r("span", { className: "aq-err", children: n("cronInvalid") }),
          children: /* @__PURE__ */ r(
            "input",
            {
              className: "input aq-mono",
              value: s,
              placeholder: "0 4 * * *",
              onChange: (g) => a((m) => S(m.reset, "cron", g.target.value))
            }
          )
        }
      ) : /* @__PURE__ */ r($, { label: n("resetTime"), children: /* @__PURE__ */ r(
        "input",
        {
          className: "input",
          type: "time",
          value: u.time,
          onChange: (g) => g.target.value && x({ ...u, time: g.target.value })
        }
      ) })
    ] }),
    s && ye(s) && (p || v) && /* @__PURE__ */ r("span", { className: "aq-ok", children: p && p !== Ln ? p : v ? n("nextRun", { when: v }) : "" })
  ] });
}
function Fn({
  ctx: e,
  value: t,
  onChange: n
}) {
  const { chain: a, legacy: i } = Yt(t);
  return /* @__PURE__ */ h("div", { className: "aq-chain", children: [
    /* @__PURE__ */ r(
      Lt,
      {
        projectId: e.projectId,
        value: a,
        onChange: (s) => n(De(s, i))
      }
    ),
    i.length > 0 && /* @__PURE__ */ r("div", { className: "aq-legacy", title: e.t("legacySteps"), children: i.map((s, o) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
      /* @__PURE__ */ h("div", { className: "aq-legacy-row", children: [
        /* @__PURE__ */ r("code", { children: Jt(s) }),
        /* @__PURE__ */ r(
          me,
          {
            label: e.t("remove"),
            onClick: () => n(De(a, i.filter((l, d) => d !== o))),
            children: "×"
          }
        )
      ] }, o)
    )) })
  ] });
}
function yt({
  ctx: e,
  title: t,
  hooks: n,
  label: a,
  value: i,
  onChange: s
}) {
  const { t: o } = e, l = A(i), [d, u] = R([]), [p, v] = R(null), x = n.filter((y) => l[y] != null || d.includes(y)), f = n.filter((y) => !x.includes(y));
  return /* @__PURE__ */ h(D, { children: [
    /* @__PURE__ */ h("div", { className: "aq-block-head", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: t }),
      f.length > 0 && /* @__PURE__ */ h(
        "select",
        {
          className: "select aq-event-add",
          "aria-label": o("addEvent"),
          value: "",
          onChange: (y) => {
            const g = f.find((m) => m === y.target.value);
            g && (u((m) => [...m, g]), v(g));
          },
          children: [
            /* @__PURE__ */ h("option", { value: "", children: [
              "+ ",
              o("addEvent")
            ] }),
            f.map((y) => /* @__PURE__ */ r("option", { value: y, children: a(y) }, y))
          ]
        }
      )
    ] }),
    x.map((y) => {
      const g = p === y, m = Array.isArray(l[y]) ? l[y].length : l[y] ? 1 : 0;
      return /* @__PURE__ */ h("div", { className: `aq-line${g ? " is-open" : ""}`, children: [
        /* @__PURE__ */ h("div", { className: "aq-line-head", children: [
          /* @__PURE__ */ h(
            "button",
            {
              type: "button",
              className: "aq-line-main",
              "aria-expanded": g,
              onClick: () => v(g ? null : y),
              children: [
                /* @__PURE__ */ r(X, { open: g }),
                /* @__PURE__ */ r("span", { className: "aq-line-text", children: a(y) }),
                m > 0 && /* @__PURE__ */ r(E, { children: m === 1 ? o("actionCountOne") : o("actionCount", { count: m }) })
              ]
            }
          ),
          /* @__PURE__ */ r(
            Te,
            {
              t: o,
              label: o("removeEvent"),
              sure: m === 0,
              onRemove: () => {
                u((b) => b.filter((k) => k !== y)), s(y, void 0);
              }
            }
          )
        ] }),
        g && /* @__PURE__ */ r("div", { className: "aq-line-body", children: /* @__PURE__ */ r(Fn, { ctx: e, value: l[y], onChange: (b) => s(y, b) }) })
      ] }, y);
    })
  ] });
}
function vt(e) {
  return {
    key: `stage_${e}`,
    title: { key: G() },
    flow: "parallel",
    objectives: [],
    rest: {}
  };
}
function zn({
  ctx: e,
  group: t,
  index: n,
  onLeave: a
}) {
  const { t: i, edit: s, project: o, lang: l } = e, d = t.quests[n], u = (q, c) => s((w) => q(w.quests[n]), c), p = t.quests.some((q, c) => c !== n && q.key === d.key), v = d.duration !== "" && !Tn.test(d.duration.replace(/\s/g, "").toLowerCase()), x = Object.keys(d.rest).filter(
    (q) => q !== "actions" && q !== "giver" && q !== "completed_when"
  ), f = Ae(t), y = d.rest.giver && typeof d.rest.giver == "object" ? d.rest.giver : {}, g = (q, c) => u((w) => {
    const N = { ...y };
    S(N, q, c.trim()), typeof N.npc == "string" && N.npc !== "" ? w.rest.giver = N : delete w.rest.giver;
  }), m = typeof y.npc == "string" ? y.npc : "", b = Mn(t.distribution), k = t.tiers.find((q) => q.key === d.tier), [_, j] = R(!1), C = _ || p || v;
  return Ne(() => {
    const q = (c) => {
      c.key !== "Escape" || c.defaultPrevented || c.target?.closest("input, textarea, select, [contenteditable='true']") || window.document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]') || (c.preventDefault(), a());
    };
    return window.addEventListener("keydown", q, !0), () => window.removeEventListener("keydown", q, !0);
  }, [a]), /* @__PURE__ */ h("div", { className: "aq-quest-page", children: [
    /* @__PURE__ */ h("div", { className: "aq-quest-col", children: [
      /* @__PURE__ */ h("section", { className: "aq-card", children: [
        /* @__PURE__ */ h("div", { className: "aq-quest-head", children: [
          /* @__PURE__ */ r("div", { className: "aq-quest-name", children: /* @__PURE__ */ r(W, { ctx: e, label: i("questName"), node: d.title }) }),
          /* @__PURE__ */ r(
            W,
            {
              ctx: e,
              multiline: !0,
              rows: 2,
              label: i("questDescription"),
              node: d.description
            }
          )
        ] }),
        /* @__PURE__ */ h(
          "button",
          {
            type: "button",
            className: "aq-fold-head is-inner",
            "aria-expanded": C,
            onClick: () => j(!C),
            children: [
              /* @__PURE__ */ r(X, { open: C }),
              /* @__PURE__ */ r("span", { className: "aq-fold-title", children: i("questSettings") }),
              !C && /* @__PURE__ */ h("span", { className: "aq-chips", children: [
                d.tier && /* @__PURE__ */ r(E, { children: k && K(T(o, k.title.key, l)) || d.tier }),
                /* @__PURE__ */ r(E, { children: d.duration || i("noTimeLimit") }),
                m && /* @__PURE__ */ r(E, { children: i("givenBy", { npc: m }) }),
                /* @__PURE__ */ r(E, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: d.key }) })
              ] })
            ]
          }
        ),
        C && /* @__PURE__ */ h("div", { className: "aq-fold-body", children: [
          /* @__PURE__ */ h("div", { className: "aq-row aq-top aq-wrap", children: [
            t.tiers.length > 0 || d.tier ? /* @__PURE__ */ r($, { label: i("tier"), children: /* @__PURE__ */ h(
              "select",
              {
                className: "select",
                value: d.tier,
                onChange: (q) => u((c) => {
                  c.tier = q.target.value;
                }),
                children: [
                  /* @__PURE__ */ r("option", { value: "", children: i("noTier") }),
                  t.tiers.map((q) => /* @__PURE__ */ r("option", { value: q.key, children: K(T(o, q.title.key, l)) || q.key }, q.key)),
                  d.tier && !k && /* @__PURE__ */ r("option", { value: d.tier, children: d.tier })
                ]
              }
            ) }) : null,
            /* @__PURE__ */ r(
              $,
              {
                label: i("duration"),
                hint: v ? /* @__PURE__ */ r("span", { className: "aq-err", children: i("durationInvalid") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input",
                    value: d.duration,
                    placeholder: "24h",
                    onChange: (q) => u((c) => {
                      c.duration = q.target.value.trim();
                    })
                  }
                )
              }
            ),
            /* @__PURE__ */ r(
              $,
              {
                label: i("key"),
                hint: p ? /* @__PURE__ */ r("span", { className: "aq-err", children: i("keyTaken") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input aq-mono",
                    value: d.key,
                    onChange: (q) => u((c) => {
                      c.key = nt(q.target.value);
                    }),
                    onBlur: () => {
                      const q = ue(d.key);
                      q !== d.key && u((c) => {
                        c.key = q;
                      });
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ h("div", { className: "aq-row aq-top aq-wrap", children: [
            /* @__PURE__ */ r($, { label: i("giverNpc"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: m,
                onChange: (q) => g("npc", q.target.value)
              }
            ) }),
            m && /* @__PURE__ */ r($, { label: i("giverConversation"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: typeof y.conversation == "string" ? y.conversation : "",
                onChange: (q) => g("conversation", q.target.value)
              }
            ) })
          ] }),
          m && /* @__PURE__ */ r(
            mt,
            {
              ctx: e,
              label: i("giverLine"),
              value: y.line,
              onChange: (q) => u((c) => {
                const w = { ...y };
                S(w, "line", q), c.rest.giver = w;
              })
            }
          ),
          m && b && /* @__PURE__ */ r("span", { className: "aq-warn", children: i("giverDistributed") })
        ] })
      ] }),
      /* @__PURE__ */ r(
        we,
        {
          ids: ht(d.stages.map((q) => q.key)),
          onMove: (q, c) => u((w) => $e(w.stages, q, c)),
          className: "aq-stages",
          children: (q, c) => /* @__PURE__ */ r(
            Bn,
            {
              ctx: e,
              quest: d,
              stage: d.stages[q],
              si: q,
              handle: c,
              editQuest: u
            }
          )
        }
      ),
      /* @__PURE__ */ h(
        F,
        {
          size: "sm",
          variant: "ghost",
          className: "aq-add",
          onClick: () => u((q) => {
            const c = Z(
              `stage_${q.stages.length + 1}`,
              q.stages.map((w) => w.key)
            );
            q.stages.push({ ...vt(q.stages.length + 1), key: c });
          }),
          children: [
            "+ ",
            i("addStage")
          ]
        }
      ),
      f && /* @__PURE__ */ h("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ h("span", { className: "aq-h aq-h-row", children: [
          i("completedWhen"),
          /* @__PURE__ */ r("span", { className: "aq-help", tabIndex: 0, role: "note", "aria-label": i("completedWhenHint"), "data-tip": i("completedWhenHint"), children: "?" })
        ] }),
        /* @__PURE__ */ r(
          At,
          {
            projectId: e.projectId,
            value: ut(d.rest),
            emptyHint: i("completedWhenEmpty"),
            onChange: (q) => u((c) => S(c.rest, "completed_when", q.length > 0 ? q : void 0))
          },
          d.uid
        )
      ] }),
      /* @__PURE__ */ h("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r(
          yt,
          {
            ctx: e,
            title: i("questEvents"),
            hooks: Xt,
            label: (q) => i(`questHook.${q}`),
            value: d.rest.actions,
            onChange: (q, c) => u((w) => {
              const N = { ...A(w.rest.actions) };
              S(N, q, c), S(w.rest, "actions", Object.keys(N).length > 0 ? N : void 0);
            })
          },
          d.uid
        ),
        x.length > 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: i("kept", { fields: x.join(", ") }) })
      ] })
    ] }),
    /* @__PURE__ */ h("aside", { className: "aq-card aq-pad aq-aside", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: i("preview") }),
      /* @__PURE__ */ r(Xn, { ctx: e, quest: d })
    ] })
  ] });
}
function Bn({
  ctx: e,
  quest: t,
  stage: n,
  si: a,
  handle: i,
  editQuest: s
}) {
  const { t: o } = e, [l, d] = R(null), [u, p] = R(!1), v = (m) => s((b) => m(b.stages[a])), x = n.flow || "parallel", f = t.stages.flatMap((m) => m.objectives.map((b) => b.key)), y = u || n.objectives.length === 0, g = (m) => {
    const b = Kt(m, f);
    s((k) => {
      k.stages[a].objectives.push({ key: b, type: m, params: ot(m) });
    }), d(b), p(!1);
  };
  return /* @__PURE__ */ h("div", { className: "aq-card aq-stage", children: [
    /* @__PURE__ */ h("div", { className: "aq-stage-head", children: [
      i,
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
        ce,
        {
          label: o("flow"),
          value: x,
          options: ["parallel", "sequential"].map((m) => ({
            value: m,
            label: o(`flow.${m}`)
          })),
          onChange: (m) => v((b) => {
            b.flow = m;
          })
        }
      ),
      /* @__PURE__ */ r(
        Te,
        {
          t: o,
          label: o("remove"),
          sure: n.objectives.length === 0,
          onRemove: () => s((m) => {
            m.stages.splice(a, 1);
          })
        }
      )
    ] }),
    /* @__PURE__ */ h("span", { className: "aq-eyebrow", children: [
      o("objectives"),
      " ",
      /* @__PURE__ */ r("span", { className: "aq-count", children: n.objectives.length })
    ] }),
    /* @__PURE__ */ r(
      we,
      {
        ids: ht(n.objectives.map((m) => m.key)),
        onMove: (m, b) => v((k) => $e(k.objectives, m, b)),
        className: "aq-objectives",
        children: (m, b) => {
          const k = n.objectives[m];
          return /* @__PURE__ */ r(
            Vn,
            {
              ctx: e,
              t: o,
              projectId: e.projectId,
              n: x === "sequential" ? `${a + 1}.${m + 1}` : "",
              objective: k,
              open: l === k.key,
              onToggle: () => d(l === k.key ? null : k.key),
              keyTaken: f.filter((_) => _ === k.key).length > 1,
              handle: b,
              onChange: (_) => v((j) => _(j.objectives[m])),
              onRename: (_) => {
                l === k.key && d(_);
              },
              onRemove: () => v((_) => {
                _.objectives.splice(m, 1);
              })
            }
          );
        }
      }
    ),
    y ? /* @__PURE__ */ h("div", { className: "aq-types", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: o("addObjective") }),
      /* @__PURE__ */ r("div", { className: "aq-seg", children: Ce.map((m) => /* @__PURE__ */ h("button", { type: "button", className: "aq-opt", onClick: () => g(m.type), children: [
        /* @__PURE__ */ r("span", { "aria-hidden": !0, children: m.icon }),
        " ",
        o(`objective.${m.type}`)
      ] }, m.type)) })
    ] }) : /* @__PURE__ */ h(F, { size: "sm", variant: "ghost", className: "aq-add", onClick: () => p(!0), children: [
      "+ ",
      o("addObjective")
    ] })
  ] });
}
function Vn({
  ctx: e,
  t,
  projectId: n,
  n: a,
  objective: i,
  open: s,
  onToggle: o,
  keyTaken: l,
  handle: d,
  onChange: u,
  onRename: p,
  onRemove: v
}) {
  const x = z(i.type), f = x ? x.params : Object.keys(i.params).map((c) => ({ name: c, kind: "text" })), y = pe(i.params), g = Ee(i.type, i.params), m = ct(i.type, i.params), b = l || m.length > 0, k = f.filter((c) => c.advanced), [_, j] = R(!1), C = _ || l, q = (c) => c.kind === "item" ? /* @__PURE__ */ r(
    Yn,
    {
      t,
      projectId: n,
      spec: c,
      params: i.params,
      onChange: (w) => u((N) => w(N.params))
    },
    c.name
  ) : c.kind === "line" ? /* @__PURE__ */ r(
    mt,
    {
      ctx: e,
      label: t(`param.${c.name}`),
      value: i.params[c.name],
      onChange: (w) => u((N) => S(N.params, c.name, w))
    },
    c.name
  ) : /* @__PURE__ */ r(
    Jn,
    {
      t,
      spec: c,
      value: i.params[c.name],
      onChange: (w) => u((N) => S(N.params, c.name, w))
    },
    c.name
  );
  return /* @__PURE__ */ h("div", { className: `aq-obj${s ? " is-open" : ""}${b ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ h("div", { className: "aq-obj-line", children: [
      d,
      /* @__PURE__ */ h("button", { type: "button", className: "aq-obj-main", onClick: o, "aria-expanded": s, children: [
        a && /* @__PURE__ */ r("span", { className: "aq-obj-n", children: a }),
        /* @__PURE__ */ r("span", { className: "aq-obj-icon", "aria-hidden": !0, children: x?.icon ?? "?" }),
        /* @__PURE__ */ h("span", { className: "aq-obj-text", children: [
          oe(t, i.type),
          y !== void 0 && /* @__PURE__ */ h("strong", { children: [
            " · ",
            String(y)
          ] }),
          g ? ` × ${g}` : y !== void 0 && x ? ` × ${t("any")}` : ""
        ] }),
        b && /* @__PURE__ */ r(E, { tone: "warn", children: l ? t("objectiveKeyTaken") : t("missing", {
          fields: m.map((c) => t(`param.${c}`)).join(", ")
        }) }),
        /* @__PURE__ */ r(X, { open: s })
      ] }),
      /* @__PURE__ */ r(me, { label: t("remove"), onClick: v, children: "×" })
    ] }),
    s && /* @__PURE__ */ h("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ h("div", { className: "aq-row aq-top aq-wrap", children: [
        /* @__PURE__ */ r($, { label: t("type"), children: /* @__PURE__ */ h(
          "select",
          {
            className: "select",
            value: i.type,
            onChange: (c) => u((w) => {
              w.type = c.target.value, w.params = ot(w.type);
            }),
            children: [
              Ce.map((c) => /* @__PURE__ */ h("option", { value: c.type, children: [
                c.icon,
                " ",
                t(`objective.${c.type}`)
              ] }, c.type)),
              !x && /* @__PURE__ */ r("option", { value: i.type, children: i.type })
            ]
          }
        ) }),
        f.filter((c) => !c.advanced).map(q)
      ] }),
      /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: "aq-fold-head is-inner",
          "aria-expanded": C,
          onClick: () => j(!C),
          children: [
            /* @__PURE__ */ r(X, { open: C }),
            /* @__PURE__ */ r("span", { className: "aq-fold-title", children: t("more") }),
            !C && /* @__PURE__ */ r(E, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: i.key }) })
          ]
        }
      ),
      C && /* @__PURE__ */ h("div", { className: "aq-row aq-top aq-wrap", children: [
        k.map(q),
        /* @__PURE__ */ r(
          $,
          {
            label: t("key"),
            title: t("objectiveKeyHint"),
            hint: l ? /* @__PURE__ */ r("span", { className: "aq-err", children: t("objectiveKeyTaken") }) : void 0,
            children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: i.key,
                onChange: (c) => {
                  const w = nt(c.target.value);
                  u((N) => {
                    N.key = w;
                  }), p(w);
                },
                onBlur: () => {
                  const c = ue(i.key);
                  c !== i.key && (u((w) => {
                    w.key = c;
                  }), p(c));
                }
              }
            )
          }
        )
      ] })
    ] })
  ] });
}
function Yn({
  t: e,
  projectId: t,
  spec: n,
  params: a,
  onChange: i
}) {
  const s = Se(a, n), o = Array.isArray(a.match) ? a.match : void 0, l = (d, u) => i((p) => bn(p, n, d, u));
  return /* @__PURE__ */ r($, { label: e(`param.${n.name}`), children: /* @__PURE__ */ r(
    It,
    {
      projectId: t,
      value: s,
      match: o,
      onChange: (d) => l(d, o),
      onMatchChange: (d) => l(s, d)
    }
  ) });
}
function Jn({
  t: e,
  spec: t,
  value: n,
  onChange: a
}) {
  const i = e(`param.${t.name}`), s = typeof n == "string" || typeof n == "number" ? String(n) : "";
  if (t.kind === "int")
    return /* @__PURE__ */ r(Q, { label: i, value: n, onChange: a });
  if (t.kind === "material")
    return /* @__PURE__ */ r($, { label: i, children: /* @__PURE__ */ r(
      Dt,
      {
        value: s,
        placeholder: e("any"),
        "aria-label": i,
        onChange: (l) => a(l.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const o = t.kind === "entity";
  return /* @__PURE__ */ h($, { label: i, children: [
    /* @__PURE__ */ r(
      "input",
      {
        className: `input${o ? " aq-mono" : ""}`,
        list: o ? "aq-entities" : void 0,
        value: s,
        placeholder: o ? e("any") : "",
        onChange: (l) => a(o ? l.target.value.toUpperCase().replace(/\s+/g, "_") : l.target.value)
      }
    ),
    o && /* @__PURE__ */ r("datalist", { id: "aq-entities", children: qn.map((l) => /* @__PURE__ */ r("option", { value: l }, l)) })
  ] });
}
const Zn = 170, Qe = { color: "#aaaaaa", italic: !1 }, Ge = { color: "#ffffff", italic: !1 };
function Xn({ ctx: e, quest: t }) {
  const { t: n, project: a, lang: i } = e, s = (u) => u.split(`
`).flatMap((p) => p === "" ? [""] : Rt(p, Zn)), o = T(a, t.title.key, i) || t.key, l = T(a, t.description.key, i), d = t.stages.length > 1;
  return /* @__PURE__ */ r("div", { className: "aq-preview", children: /* @__PURE__ */ h("div", { className: "aq-preview-frame", children: [
    /* @__PURE__ */ r(ae, { source: s(o).join(`
`), defaults: Ge, scale: 2 }),
    l && /* @__PURE__ */ r(ae, { source: s(l).join(`
`), defaults: Qe, scale: 2 }),
    t.stages.map((u, p) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ h("div", { className: "aq-preview-stage", children: [
        d && /* @__PURE__ */ r(
          ae,
          {
            source: s(T(a, u.title.key, i) || n("stage", { n: p + 1 })).join(`
`),
            defaults: Ge,
            scale: 2
          }
        ),
        u.objectives.length > 0 && /* @__PURE__ */ r(
          ae,
          {
            source: u.objectives.flatMap((v) => s(`• ${le(n, v)}`)).join(`
`),
            defaults: Qe,
            scale: 2
          }
        )
      ] }, p)
    ))
  ] }) });
}
function ea({ className: e }) {
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
        /* @__PURE__ */ r("path", { d: "M15 12h-5" }),
        /* @__PURE__ */ r("path", { d: "M15 8h-5" }),
        /* @__PURE__ */ r("path", { d: "M19 17V5a2 2 0 0 0-2-2H4" }),
        /* @__PURE__ */ r("path", { d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" })
      ]
    }
  );
}
const ta = {
  kind: ee,
  dir: tt,
  schemaVersion: je,
  // Created in the module's folder only (SDK 1.8); a group already elsewhere still loads.
  projects: [Qt],
  // Data with no links: one "Quests" entry and page instead of a node per group (SDK 1.9).
  collection: { labels: Ht },
  // A group's id is its key on the server (`quest_group_key`): typed by hand, no prefix.
  label: Re.en,
  labels: Re,
  icon: ea,
  component: In,
  // The view is a page of its own: its cards, and the quest beside what the player sees.
  ownHeader: !0,
  wide: !0,
  title: (e, { project: t, lang: n }) => K(T(t, e.title.key, n)),
  // The sidebar reads "Niveaux de guilde", the file's id stays in the group's settings.
  listByTitle: !0,
  create: ({ id: e, projectId: t }) => ({
    id: e,
    projectId: t,
    uid: J(),
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
  parse: (e, t) => Ut(e, t),
  serialize: (e, t) => Bt(e, t),
  ltextSites: (e) => Vt(e),
  board: {
    size: { width: 300, height: 48 },
    accent: xn,
    // The group's quests, one selectable row each: the Properties panel opens the one clicked.
    items: (e, { project: t, lang: n }) => kn(e, t, n),
    summary: (e, { lang: t }) => _n(e, t)
  }
}, Ke = "quests:groups", Ue = "quests:quests", na = "quests:active";
function aa(e) {
  return e.startsWith("msquests:") ? `quests:${e.slice(9)}` : e;
}
const We = {
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
}, Fe = { en: "Available", fr: "Disponible" };
function ia(e, t, n) {
  const a = aa(t);
  if (a !== Ke && a !== Ue && a !== na) return null;
  const i = e.documents?.[ee];
  if (!i || i.length === 0) return null;
  const s = e.defaultLang ?? "en", o = n?.serverRows, l = n?.params?.group || void 0, d = [...i].sort((p, v) => p.id < v.id ? -1 : p.id > v.id ? 1 : 0);
  if (a === Ke) {
    const p = xe(o, "key");
    return d.map((v) => sa(v, p.get(v.id), s));
  }
  if (a === Ue) {
    const p = xe(o, "id");
    return d.filter((v) => !l || v.id === l).flatMap((v) => v.quests.map((x) => bt(v, x, p.get(`${v.id}:${x.key}`), s)));
  }
  if (!o) return null;
  const u = new Map(i.map((p) => [p.id, p]));
  return o.flatMap((p) => {
    const v = u.get(I(p.group));
    if (!v) return [p];
    const x = v.quests.find((f) => f.key === I(p.quest_key));
    return x ? [ca(x, p, s)] : [];
  });
}
function sa(e, t, n) {
  const a = xe(re(t?.quests), "key");
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
    quests: e.quests.map((i) => bt(e, i, a.get(i.key), n))
  };
}
function bt(e, t, n, a) {
  const i = e.tiers.find((s) => s.key === t.tier);
  return {
    id: `${e.id}:${t.key}`,
    group: e.id,
    key: t.key,
    name: t.title,
    description: t.description,
    duration: ma(t.duration),
    tier: t.tier,
    tier_name: i ? i.title : "",
    assigned: n?.assigned ?? !1,
    status_key: n?.status_key ?? "NOT_STARTED",
    status: n?.status ?? Fe[a.slice(0, 2)] ?? Fe.en,
    can_start: n?.can_start ?? !1,
    start_blocker: n?.start_blocker ?? "",
    start_blocker_label: n?.start_blocker_label ?? "",
    // `reference` in `QuestRows.questRow`: the attempt the server holds for this player.
    ...qt(t, n?.assigned === !0 ? n : void 0, a)
  };
}
function qt(e, t, n) {
  const a = t ? ra(t) : void 0, i = oa(e, a, n), s = i.find((l) => l.active === !0), o = s ? s.objectives.find((l) => l.done !== !0) : void 0;
  return {
    objective_name: o?.name ?? "",
    objective_progress: o?.progress ?? 0,
    objective_target: o?.target ?? 0,
    progress_ratio: a ? xt(i.map((l) => l.progress_ratio)) : 0,
    stage_index: i.filter((l) => l.completed === !0).length,
    stage_name: s?.name ?? "",
    stage_flow: s?.flow ?? "",
    stages: i.map((l) => ({ ...l, objectives: l.objectives.map(({ done: d, ...u }) => u) }))
  };
}
function ra(e) {
  const t = /* @__PURE__ */ new Map(), n = [
    ...re(e.objectives),
    ...re(e.stages).flatMap((a) => re(a.objectives))
  ];
  for (const a of n) {
    const i = I(a.status_key);
    t.set(I(a.key), {
      progress: ke(a.progress, 0),
      flag: i === "COMPLETED" || i === "FAILED" ? i : "",
      row: a
    });
  }
  return t;
}
function oa(e, t, n) {
  const a = e.stages.map((s, o) => {
    const l = s.objectives.map((d) => la(d, t?.get(d.key), n));
    return {
      key: s.key,
      name: s.title,
      flow: pa(s),
      index: o,
      // `QuestStage.isCompleted`: all objectives done, so an empty stage is.
      completed: t !== void 0 && l.every((d) => d.done),
      active: !1,
      progress_ratio: t ? xt(l.map((d) => d.progress_ratio)) : 0,
      objectives: l
    };
  });
  if (!t) return a;
  const i = a.find((s) => s.completed !== !0);
  if (i) {
    i.active = !0;
    const s = i.objectives, o = s.find((l) => l.done !== !0);
    for (const l of s)
      l.status_key === "PENDING" && (i.flow !== "SEQUENTIAL" || l === o) && (l.status_key = "IN_PROGRESS");
  }
  return a;
}
function la(e, t, n) {
  const a = ua(e), i = t?.progress ?? 0, s = t?.row, o = s && s.type === e.type && s.target === a;
  return {
    key: e.key,
    name: o && typeof s.name == "string" ? s.name : da(e, n),
    type: e.type,
    progress: i,
    target: a,
    // `AbstractQuestObjective`: done once the progress reaches the target, whatever the
    // stored flag says; the ratio is clamped, so a lowered target reads 1, not 1.4.
    progress_ratio: t ? a <= 0 ? 1 : Math.min(Math.max(i / a, 0), 1) : 0,
    completed: t !== void 0 && i >= a,
    status_key: t?.flag || "PENDING",
    done: t !== void 0 && i >= a
  };
}
function ca(e, t, n) {
  const a = qt(e, t, n), i = a.stages;
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
    objectives: i.flatMap((s) => s.objectives),
    stages: i
  };
}
function da(e, t) {
  const a = (We[t.slice(0, 2)] ?? We.en)[e.type];
  if (!a) return e.type;
  const i = e.params, s = {
    amount: String(i.amount ?? ""),
    distance: String(i.distance ?? ""),
    command: I(i.command),
    value: I(i.value),
    // Bukkit's translation keys, as the objective configs write them (`<lang:…>`).
    crop: se("block", i.crop),
    entity_type: se("entity", i.entity_type),
    material: e.type === "block_break" ? se("block", i.material) : ze(e),
    fish_type: ze(e)
  };
  return a.replace(/%([a-z_]+)%/g, (o, l) => s[l] ?? "");
}
function se(e, t) {
  const n = I(t).toLowerCase().replace(/^minecraft:/, "");
  return n === "" ? "" : `<lang:${e}.minecraft.${n}>`;
}
function ze(e) {
  const t = z(e.type)?.params.find((s) => s.kind === "item");
  if (!t) return "";
  const n = Se(e.params, t), a = n.title;
  if (typeof a == "string" && a.trim() !== "") return a;
  const i = I(n.material);
  return /^(minecraft:)?[a-z_0-9]+$/i.test(i) && !i.includes(":") ? se("item", i) : i || lt(n);
}
function ua(e) {
  const t = pe(e.params);
  if (t === void 0) return 1;
  const n = Number(t);
  return Number.isFinite(n) ? n : 1;
}
function pa(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function ma(e) {
  const t = e.trim().toLowerCase().replace(/ /g, "");
  if (t === "") return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const n = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!n) return 0;
  const [, a, i, s, o] = n;
  return Number(a ?? 0) * 86400 + Number(i ?? 0) * 3600 + Number(s ?? 0) * 60 + Number(o ?? 0);
}
function xe(e, t) {
  return new Map((e ?? []).map((n) => [I(n[t]), n]));
}
function re(e) {
  return Array.isArray(e) ? e.filter((t) => t && typeof t == "object") : [];
}
function xt(e) {
  return e.length === 0 ? 0 : e.reduce((t, n) => t + n, 0) / e.length;
}
function ke(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function I(e) {
  return typeof e == "string" ? e : "";
}
const fa = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: Pt,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  documents: [ta],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: ia,
  // The Quests tab of the server's Statistics space (SDK 1.23).
  stats: { label: { en: "Quests", fr: "Quêtes" }, component: dn }
}, va = { ...fa, sdk: "1.23.0" };
export {
  va as default
};
