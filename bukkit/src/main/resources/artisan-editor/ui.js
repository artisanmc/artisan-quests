import { createModuleI18n as Nt, fieldText as _t, newTextKey as F, injectModuleStyles as Be, useServerDocuments as jt, textValue as L, useStatsRead as te, statsQuery as Te, StatCard as Ct, StatsPanel as me, Funnel as St, SortableTable as Oe, statsBreakdown as Et, useProject as At, useContentLang as $t, SortableList as xe, Button as B, ConditionsEditor as Tt, updateDocument as Ot, selectDocumentItem as Lt, projectLangs as ze, LocalizedField as Ve, MiniMessageInput as Ye, textValues as Je, McText as ne, useUiLang as Ze, useOptionList as Rt, ActionChainEditor as It, mcWrap as Dt, ItemInput as Pt, MaterialInput as Mt, SDK_VERSION as Kt } from "@artisan/editor-sdk";
import { jsx as r, jsxs as y, Fragment as M } from "react/jsx-runtime";
import { useState as D, useEffect as we, useRef as Xe } from "react";
const J = {
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
  formerKeys: "Formerly {{keys}}: players keep their progress.",
  forgetFormerKeys: "Forget",
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
}, ce = {
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
  formerKeys: "Anciennement {{keys}} : les joueurs gardent leur progression.",
  forgetFormerKeys: "Oublier",
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
}, Le = { en: J.kindLabel, fr: ce.kindLabel }, Ht = { en: J.collection, fr: ce.collection }, Ne = Nt({ en: J, fr: ce });
function et(e) {
  const t = e === "fr" ? ce : J;
  return (n, a) => {
    const s = t[n] ?? J[n] ?? n;
    return a ? s.replace(/\{\{(\w+)\}\}/g, (i, o) => String(a[o] ?? i)) : s;
  };
}
const ee = "quest_group", tt = "quest_groups", Qt = "quests", _e = "quest_group/v1";
function Ft(e) {
  const t = { ...A(e) };
  return typeof t.strategy == "string" && t.strategy.toLowerCase() === "ladder" && (t.strategy = "sequential"), t;
}
const ve = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function nt(e = Date.now()) {
  let t = "", n = e;
  for (let i = 0; i < 10; i++)
    t = ve[n % 32] + t, n = Math.floor(n / 32);
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  let s = "";
  for (let i = 0; i < 16; i++) s += ve[a[i] % 32];
  return t + s;
}
function Z(e, t) {
  const n = new Set(t);
  if (!n.has(e)) return e;
  for (let a = 2; ; a++) if (!n.has(`${e}_${a}`)) return `${e}_${a}`;
}
function Gt(e, t) {
  const n = new Set(t), a = new Uint8Array(4);
  for (; ; ) {
    crypto.getRandomValues(a);
    const s = Array.from(a, (o) => ve[o % 32].toLowerCase()).join(""), i = `${de(e)}_${s}`;
    if (!n.has(i)) return i;
  }
}
function at(e) {
  return e.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
function de(e) {
  return e.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "quest";
}
function A(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? { ...e } : {};
}
function fe(e) {
  return Array.isArray(e) ? e : [];
}
function $(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? String(e) : "";
}
function Y(e, ...t) {
  const n = { ...e };
  for (const a of t) delete n[a];
  return n;
}
function Ut(e, t) {
  const n = {}, a = [];
  function s(p) {
    if (p && typeof p == "object" && !Array.isArray(p)) {
      const k = F(), f = {};
      for (const [b, h] of Object.entries(p)) f[b] = $(h);
      return n[k] = f, { key: k };
    }
    const u = typeof p == "string" ? /^\{i18n:(.+)\}$/.exec(p) : null;
    if (u) {
      const k = t.translations?.[u[1]];
      return k && (n[u[1]] = { ...k }), { key: u[1] };
    }
    const m = F();
    return n[m] = p == null || p === "" ? {} : { [t.lang]: $(p) }, { key: m };
  }
  const i = Object.entries(A(e.tiers)).map(([p, u]) => {
    const m = A(u);
    return { key: p, title: s(m.title), rest: Y(m, "title") };
  }), o = /* @__PURE__ */ new Set(), l = fe(e.quests).map((p, u) => {
    const m = A(p), k = fe(m.stages).map((g, q) => {
      const w = A(g), N = $(w.flow).toLowerCase();
      return {
        key: $(w.key) || `stage_${q + 1}`,
        title: s(w.title),
        flow: N === "parallel" || N === "sequential" ? N : "",
        objectives: fe(w.objectives).map((j, S) => {
          const O = A(j);
          return {
            key: $(O.key) || `objective_${S + 1}`,
            type: $(O.type),
            params: Y(O, "key", "type")
          };
        }),
        rest: Y(w, "key", "title", "flow", "objectives")
      };
    }), f = $(m.key) || `quest_${u + 1}`, b = $(m.uid) || void 0;
    let h = b ?? f;
    return o.has(h) && (h = `${h}_${u}`), o.add(h), {
      key: f,
      uid: h,
      savedUid: b,
      savedKey: $(m.key) || void 0,
      oldKeys: Bt(m.old_key),
      tier: $(m.tier),
      title: s(m.title),
      description: s(m.description),
      duration: $(m.duration),
      stages: k,
      rest: Wt(m)
    };
  }), c = {
    id: $(e.id),
    projectId: t.projectId,
    uid: $(e.uid) || void 0,
    title: s(e.title),
    description: s(e.description),
    actorType: $(e.actor_type) || "player",
    reset: A(e.reset),
    limits: A(e.limits),
    rotation: A(e.rotation),
    distribution: Ft(e.distribution),
    tiers: i,
    quests: l,
    rest: st(Y(
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
  return e.schema !== void 0 && e.schema !== _e && a.push(`schema: ${String(e.schema)}`), { doc: c, i18nKeys: n, unsupported: a };
}
function st(e) {
  return e.on !== void 0 && (e.actions == null && (e.actions = e.on), delete e.on), e;
}
function Wt(e) {
  const t = st(
    Y(e, "key", "uid", "old_key", "tier", "title", "description", "duration", "stages", "reward_display")
  );
  if (t.rewards !== void 0) {
    const n = A(t.actions);
    n.complete == null && (t.actions = { ...n, complete: t.rewards }), delete t.rewards;
  }
  return t;
}
function Bt(e) {
  return (Array.isArray(e) ? e : e == null ? [] : [e]).map((n) => $(n)).filter((n) => n !== "");
}
function zt(e, t) {
  e.savedKey === void 0 || t === "" || t === e.key || e.oldKeys.includes(t) || e.oldKeys.push(t);
}
function it(e, t) {
  const n = [];
  for (const a of [...e.oldKeys, e.savedKey ?? ""])
    a === "" || a === e.key || t.has(a) || n.includes(a) || n.push(a);
  return n;
}
function Vt(e, t) {
  const n = it(e, t);
  return n.length === 0 ? void 0 : n.length === 1 ? n[0] : n;
}
function Yt(e) {
  return typeof e == "string" ? e === "" : Object.values(e).every((t) => t === "");
}
function K(e) {
  const t = {};
  for (const [n, a] of Object.entries(e))
    a == null || a === "" || Array.isArray(a) && a.length === 0 || typeof a == "object" && !Array.isArray(a) && Object.keys(a).length === 0 || (t[n] = a);
  return t;
}
const Jt = [
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
function Zt(e, t) {
  const n = (u) => _t(t, u.key), a = (u) => {
    const m = n(u);
    return Yt(m) ? void 0 : m;
  }, s = {};
  for (const u of e.tiers) s[u.key] = { ...u.rest, title: n(u.title) };
  const i = new Set(e.quests.map((u) => u.key)), o = e.quests.map(
    (u) => K({
      key: u.key,
      uid: u.savedUid,
      old_key: Vt(u, i),
      tier: u.tier,
      title: n(u.title),
      description: a(u.description),
      duration: u.duration,
      ...u.rest,
      stages: u.stages.map(
        (m) => K({
          key: m.key,
          title: a(m.title),
          flow: m.flow,
          ...m.rest,
          objectives: m.objectives.map((k) => ({ key: k.key, type: k.type, ...k.params }))
        })
      )
    })
  ), l = {
    ...e.rest,
    id: e.id,
    schema: _e,
    uid: e.uid,
    title: n(e.title),
    description: a(e.description),
    actor_type: e.actorType,
    reset: K(e.reset),
    limits: K(e.limits),
    rotation: K(e.rotation),
    distribution: K(e.distribution),
    tiers: s,
    quests: o
  }, c = {};
  for (const u of Jt) u in l && (c[u] = l[u]);
  for (const u of Object.keys(l)) u in c || (c[u] = l[u]);
  const p = K(c);
  return p.quests = o, p;
}
function* Xt(e) {
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
    const s = e.quests[a], i = n.has(s.key) ? `${s.key}_${a}` : s.key;
    n.add(s.key);
    const o = `${t}.quests.${i}`;
    yield {
      lText: s.title,
      key: `${o}.title`,
      path: `quests[${a}].title`,
      kind: "quest.title"
    }, yield {
      lText: s.description,
      key: `${o}.description`,
      path: `quests[${a}].description`,
      kind: "quest.description"
    };
    const l = /* @__PURE__ */ new Set();
    for (let c = 0; c < s.stages.length; c++) {
      const p = s.stages[c], u = l.has(p.key) ? `${p.key}_${c}` : p.key;
      l.add(p.key), yield {
        lText: p.title,
        key: `${o}.stages.${u}.title`,
        path: `quests[${a}].stages[${c}].title`,
        kind: "quest.stage"
      };
    }
  }
}
function Re(e) {
  return !!e && typeof e == "object" && !Array.isArray(e) && "type" in e;
}
function en(e) {
  const t = Array.isArray(e) ? e : e == null ? [] : [e];
  return {
    chain: t.filter((n) => !Re(n)),
    legacy: t.filter(Re)
  };
}
function Ie(e, t) {
  const n = [...e, ...t];
  return n.length ? n : void 0;
}
function tn(e) {
  const t = String(e.type), n = e.command ?? e.message ?? e.title ?? e.material;
  return typeof n == "string" ? `${t} · ${n}` : t;
}
const nn = [
  "distribution",
  "actor_load",
  "quest_start",
  "objective_progress",
  "objective_complete",
  "quest_complete",
  "period_complete"
], an = ["start", "objective_progress", "objective_complete", "complete"], rt = {
  started: "quests:started",
  completed: "quests:completed",
  abandoned: "quests:abandoned",
  expired: "quests:expired"
}, ae = Object.keys(rt), sn = "quests:progress", rn = "quests:stuck", U = (e) => typeof e == "number" && Number.isFinite(e) ? e : 0;
function on(e) {
  return e.map((t) => ({
    quest: String(t.quest ?? ""),
    started: U(t.started),
    inProgress: U(t.in_progress),
    completed: U(t.completed),
    medianSeconds: typeof t.median_seconds == "number" ? t.median_seconds : null
  }));
}
function ln(e) {
  return e.map((t) => ({
    quest: String(t.quest ?? ""),
    stage: String(t.stage ?? ""),
    players: U(t.players),
    medianSeconds: U(t.median_seconds),
    longestSeconds: U(t.longest_seconds)
  }));
}
function cn(e, t, n) {
  const a = (i, o) => t[i]?.find((l) => l.value === o)?.count ?? 0, s = e.map((i) => i.key);
  for (const i of ae)
    for (const o of t[i] ?? []) s.includes(o.value) || s.push(o.value);
  return s.map((i) => {
    const o = a("started", i), l = a("completed", i), c = n.find((p) => p.quest === i);
    return {
      key: i,
      started: o,
      completed: l,
      abandoned: a("abandoned", i),
      expired: a("expired", i),
      unfinished: o > 0 ? Math.max(0, 1 - l / o) : null,
      inProgress: c?.inProgress ?? 0,
      medianSeconds: c?.medianSeconds ?? null
    };
  });
}
const De = (e) => (e ?? []).reduce((t, n) => t + n.count, 0);
function dn(e) {
  return e.distribution.strategy === "sequential";
}
function un(e, t) {
  const n = e[0];
  if (!n) return [];
  const a = (i) => t.find((o) => o.quest === i), s = a(n.key)?.started ?? 0;
  return s === 0 ? [] : [
    { key: n.key, kind: "started", value: s },
    ...e.map((i) => ({ key: i.key, kind: "completed", value: a(i.key)?.completed ?? 0 }))
  ];
}
function pn(e, t = "d") {
  const n = Math.max(0, Math.round(e));
  if (n < 60) return `${n} s`;
  const a = Math.round(n / 60);
  if (a < 60) return `${a} min`;
  const s = Math.floor(a / 60);
  if (s < 24) return a % 60 === 0 ? `${s} h` : `${s} h ${String(a % 60).padStart(2, "0")}`;
  const i = Math.floor(s / 24);
  return s % 24 === 0 ? `${i} ${t}` : `${i} ${t} ${s % 24} h`;
}
function mn(e, t, n) {
  if (t === void 0 || t === 0) return null;
  const a = (e - t) / t, s = new Intl.NumberFormat(n, { style: "percent", maximumFractionDigits: 0 }).format(Math.abs(a));
  return `${a >= 0 ? "▲" : "▼"} ${s}`;
}
const ot = `
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
.aq-forget { padding: 0; border: 0; background: none; color: var(--text); font: inherit; cursor: pointer; text-decoration: underline; }
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
function fn(e) {
  Be("msquests", ot);
  const t = Ne(), n = jt(ee).map((i) => ({
    group: i.document,
    project: i.project
  })), a = n.find((i) => i.group.id === e.focus) ?? n[0];
  if (!a) return /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: t("stats.noGroup") });
  const s = (i) => L(i.project, i.group.title.key, e.lang) || i.group.id;
  return /* @__PURE__ */ y("div", { className: "aq-stats", children: [
    /* @__PURE__ */ y("label", { className: "aq-stats-pick", children: [
      /* @__PURE__ */ r("span", { className: "aq-h", children: t("stats.group") }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: a.group.id,
          onChange: (i) => e.onFocus(i.target.value),
          children: n.map((i) => /* @__PURE__ */ r("option", { value: i.group.id, children: s(i) }, i.group.id))
        }
      )
    ] }),
    /* @__PURE__ */ r(hn, { ...e, group: a.group, project: a.project }, a.group.id)
  ] });
}
function hn({
  serverId: e,
  period: t,
  player: n,
  compare: a,
  lang: s,
  group: i,
  project: o
}) {
  const l = Ne(), c = `${e}|${i.id}`, p = (d, v) => Promise.all(
    ae.map(
      (x) => Et(e, { event: rt[x], from: d, to: v, player: n, dims: { group: i.id } }, "quest")
    )
  ).then((x) => Object.fromEntries(ae.map((_, R) => [_, x[R] ?? []]))), u = te(
    `${c}|${t.from}|${t.to}|${n ?? ""}`,
    () => p(t.from, t.to)
  ), m = te(
    `${c}|${t.previous.from}|${t.previous.to}|${n ?? ""}|${a}`,
    () => a ? p(t.previous.from, t.previous.to) : Promise.resolve(void 0)
  ), k = te(
    `${c}|progress`,
    () => Te(e, sn, { group: i.id }).then((d) => on(d.rows))
  ), f = te(
    `${c}|stuck`,
    () => Te(e, rn, { group: i.id }).then((d) => ln(d.rows))
  ), b = (d) => {
    const v = i.quests.find((x) => x.key === d);
    return v && L(o, v.title.key, s) || d;
  }, h = (d, v) => {
    const x = i.quests.find((_) => _.key === d)?.stages.find((_) => _.key === v);
    return x && L(o, x.title.key, s) || v;
  }, g = (d) => new Intl.NumberFormat(s).format(d), q = (d) => new Intl.NumberFormat(s, { style: "percent", maximumFractionDigits: 0 }).format(d), w = (d) => d === null ? "–" : pn(d, l("stats.day"));
  if (u.error) return /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.unavailable") });
  const N = cn(i.quests, u.data ?? {}, k.data ?? []), j = dn(i) ? un(i.quests, k.data ?? []) : [], S = (d) => d === void 0 ? null : l(
    d === "server_offline" ? "stats.offline" : d === "unknown_query" ? "stats.notComputed" : "stats.unavailable"
  ), O = {
    started: void 0,
    completed: !0,
    abandoned: !1,
    expired: !1
  };
  return /* @__PURE__ */ y(M, { children: [
    /* @__PURE__ */ r("div", { className: "aq-stats-cards", children: ae.map((d) => {
      const v = De(u.data?.[d]), x = mn(v, m.data ? De(m.data[d]) : void 0, s), _ = x?.startsWith("▲") ?? !1, R = O[d];
      return /* @__PURE__ */ r(
        Ct,
        {
          label: l(`stats.${d}`),
          value: u.data ? g(v) : "…",
          sub: l("stats.overPeriod"),
          trend: x === null ? void 0 : {
            label: x,
            tone: R === void 0 ? "default" : _ === R ? "positive" : "negative"
          }
        },
        d
      );
    }) }),
    j.length > 0 && /* @__PURE__ */ r(me, { title: l("stats.funnel"), hint: l("stats.allTime"), children: /* @__PURE__ */ r(
      St,
      {
        steps: j.map((d) => ({
          id: `${d.kind}:${d.key}`,
          label: l(d.kind === "started" ? "stats.funnelStarted" : "stats.funnelCompleted", {
            quest: b(d.key)
          }),
          value: d.value
        })),
        formatValue: g,
        formatShare: q
      }
    ) }),
    /* @__PURE__ */ y(me, { title: l("stats.quests"), hint: l("stats.questsHint"), children: [
      N.length === 0 ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.noQuestYet") }) : /* @__PURE__ */ r(
        Oe,
        {
          rows: N,
          rowId: (d) => d.key,
          initialSort: "unfinished",
          columns: gn(l, b, g, q, w)
        }
      ),
      k.error && /* @__PURE__ */ r("p", { className: "aq-hint", children: S(k.error) })
    ] }),
    /* @__PURE__ */ r(me, { title: l("stats.stuck"), hint: l("stats.stuckHint"), children: f.error ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: S(f.error) }) : f.data && f.data.length === 0 ? /* @__PURE__ */ r("p", { className: "aq-stats-empty", children: l("stats.nobodyStuck") }) : /* @__PURE__ */ r(
      Oe,
      {
        rows: f.data ?? [],
        rowId: (d) => `${d.quest}/${d.stage}`,
        initialSort: "players",
        columns: [
          { id: "quest", label: l("stats.quest"), value: (d) => b(d.quest) },
          { id: "stage", label: l("stats.stage"), value: (d) => h(d.quest, d.stage) },
          {
            id: "players",
            label: l("stats.waiting"),
            align: "right",
            value: (d) => d.players,
            render: (d) => g(d.players)
          },
          {
            id: "median",
            label: l("stats.medianWait"),
            align: "right",
            value: (d) => d.medianSeconds,
            render: (d) => w(d.medianSeconds)
          },
          {
            id: "longest",
            label: l("stats.longestWait"),
            align: "right",
            value: (d) => d.longestSeconds,
            render: (d) => w(d.longestSeconds)
          }
        ]
      }
    ) })
  ] });
}
function gn(e, t, n, a, s) {
  const i = (o, l) => ({
    id: o,
    label: l,
    align: "right",
    value: (c) => c[o],
    render: (c) => n(c[o])
  });
  return [
    { id: "quest", label: e("stats.quest"), value: (o) => t(o.key) },
    i("started", e("stats.started")),
    i("completed", e("stats.completed")),
    {
      id: "unfinished",
      label: e("stats.unfinished"),
      align: "right",
      // A quest nobody started sorts last: it has nothing to say about where players stop.
      value: (o) => o.unfinished ?? -1,
      render: (o) => o.unfinished === null ? "–" : a(o.unfinished)
    },
    i("abandoned", e("stats.abandoned")),
    i("expired", e("stats.expired")),
    i("inProgress", e("stats.inProgress")),
    {
      id: "median",
      label: e("stats.median"),
      align: "right",
      value: (o) => o.medianSeconds ?? -1,
      render: (o) => s(o.medianSeconds)
    }
  ];
}
const lt = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
}, yn = /^\d+$/;
function he(e, t, n) {
  const a = String(n).padStart(2, "0");
  return e === "fr" ? n === 0 ? `${t} h` : `${t} h ${a}` : `${String(t).padStart(2, "0")}:${a}`;
}
function I(e, t, n) {
  return yn.test(e) && Number(e) >= t && Number(e) <= n;
}
function ge(e) {
  return e.trim().split(/\s+/).length === 5;
}
function vn(e, t) {
  const n = t === "fr", a = e.trim().split(/\s+/);
  if (a.length !== 5) return null;
  const [s, i, o, l, c] = a;
  if (l !== "*") return null;
  const p = /^\*\/(\d+)$/;
  if (o === "*" && c === "*") {
    if (I(s, 0, 59) && I(i, 0, 23))
      return n ? `tous les jours à ${he(t, +i, +s)}` : `every day at ${he(t, +i, +s)}`;
    const m = p.exec(i);
    if (I(s, 0, 59) && m)
      return n ? `toutes les ${m[1]} h, à la minute ${s}` : `every ${m[1]} hours, at minute ${s}`;
    if (I(s, 0, 59) && i === "*")
      return n ? `toutes les heures, à la minute ${s}` : `every hour, at minute ${s}`;
    const k = p.exec(s);
    return k && i === "*" ? n ? `toutes les ${k[1]} minutes` : `every ${k[1]} minutes` : null;
  }
  if (!I(s, 0, 59) || !I(i, 0, 23)) return null;
  const u = he(t, +i, +s);
  if (o === "*" && I(c, 0, 7)) {
    const m = lt[n ? "fr" : "en"][Number(c) % 7];
    return n ? `chaque ${m} à ${u}` : `every ${m} at ${u}`;
  }
  return c === "*" && I(o, 1, 31) ? n ? `le ${o === "1" ? "1er" : o} de chaque mois à ${u}` : `on day ${o} of each month at ${u}` : null;
}
function V(e, t, n) {
  const a = /* @__PURE__ */ new Set();
  for (const s of e.split(",")) {
    const i = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(s);
    if (!i) return null;
    const o = i[4] ? Number(i[4]) : 1, l = i[1] === "*" ? t : Number(i[2]), c = i[1] === "*" ? n : i[3] ? Number(i[3]) : i[4] ? n : l;
    if (o < 1 || l < t || c > n || l > c) return null;
    for (let p = l; p <= c; p += o) a.add(p);
  }
  return a;
}
function bn(e, t) {
  const n = e.trim().split(/\s+/);
  if (n.length !== 5) return null;
  const a = V(n[0], 0, 59), s = V(n[1], 0, 23), i = V(n[2], 1, 31), o = V(n[3], 1, 12), l = V(n[4], 0, 7);
  if (!a || !s || !i || !o || !l) return null;
  l.has(7) && l.add(0);
  const c = n[2] === "*", p = n[4] === "*", u = (f) => c && p ? !0 : c ? l.has(f.getDay()) : p ? i.has(f.getDate()) : i.has(f.getDate()) || l.has(f.getDay()), m = new Date(t.getTime());
  m.setSeconds(0, 0), m.setMinutes(m.getMinutes() + 1);
  const k = t.getTime() + 366 * 24 * 3600 * 1e3;
  for (; m.getTime() <= k; ) {
    if (!o.has(m.getMonth() + 1) || !u(m)) {
      m.setDate(m.getDate() + 1), m.setHours(0, 0, 0, 0);
      continue;
    }
    if (!s.has(m.getHours())) {
      m.setHours(m.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (a.has(m.getMinutes())) return m;
    m.setMinutes(m.getMinutes() + 1);
  }
  return null;
}
function qn(e) {
  const t = e.trim().split(/\s+/);
  if (e.trim() === "") return { kind: "never" };
  if (t.length !== 5) return { kind: "custom" };
  const [n, a, s, i, o] = t;
  if (i !== "*" || !I(n, 0, 59) || !I(a, 0, 23)) return { kind: "custom" };
  const l = `${a.padStart(2, "0")}:${n.padStart(2, "0")}`;
  return s === "*" && o === "*" ? { kind: "daily", time: l } : s === "*" && I(o, 0, 7) ? { kind: "weekly", time: l, day: Number(o) % 7 } : o === "*" && I(s, 1, 31) ? { kind: "monthly", time: l, day: Number(s) } : { kind: "custom" };
}
function kn(e) {
  if (e.kind === "never") return "";
  if (e.kind === "custom") return null;
  const t = /^(\d{1,2}):(\d{2})$/.exec(e.time), n = t ? Math.min(23, Number(t[1])) : 4, a = t ? Math.min(59, Number(t[2])) : 0;
  return e.kind === "daily" ? `${a} ${n} * * *` : e.kind === "weekly" ? `${a} ${n} * * ${e.day}` : `${a} ${n} ${Math.min(31, Math.max(1, e.day))} * *`;
}
function xn(e) {
  return lt[e === "fr" ? "fr" : "en"];
}
const H = { name: "amount", kind: "int", required: !0 }, je = [
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
  return je.find((t) => t.type === e);
}
function ct(e) {
  const t = {};
  for (const n of z(e)?.params ?? [])
    n.kind === "int" && (t[n.name] = 1);
  return t;
}
function ue(e) {
  return e.amount ?? e.distance;
}
function Ce(e, t) {
  const n = e[t.name];
  if (n && typeof n == "object" && !Array.isArray(n)) return n;
  const a = t.legacy ? e[t.legacy] : void 0;
  return typeof a == "string" && a !== "" ? { material: a } : {};
}
function wn(e, t, n, a) {
  t.legacy && delete e[t.legacy];
  const s = !n || Object.keys(n).length === 0;
  s ? delete e[t.name] : e[t.name] = n, s || a === void 0 ? delete e.match : e.match = a;
}
function dt(e) {
  const t = e.title;
  if (typeof t == "string" && t.trim() !== "") return t.replace(/<[^>]*>/g, "");
  const n = e.material ?? e.item;
  return typeof n == "string" ? n : "";
}
function Se(e, t) {
  const n = z(e);
  return n ? n.params.filter((a) => a.kind !== "int" && a.kind !== "line").map((a) => a.kind === "item" ? dt(Ce(t, a)) : t[a.name]).filter((a) => typeof a == "string" && a !== "").join(" = ") : Object.keys(t).map((a) => t[a]).filter((a) => typeof a == "string" && a !== "").join(" = ");
}
function ut(e, t) {
  return (z(e)?.params ?? []).filter((n) => n.required && (t[n.name] === void 0 || t[n.name] === "")).map((n) => n.name);
}
const Nn = [
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
], _n = "#f59e0b";
function re(e, t) {
  return z(t) ? e(`objective.${t}`) : t;
}
function oe(e, t) {
  const n = Se(t.type, t.params), a = ue(t.params);
  return `${re(e, t.type)}${n ? ` · ${n}` : ""}${a !== void 0 ? ` · 0/${String(a)}` : ""}`;
}
function G(e) {
  return e.replace(/<[^<>]*>/g, "").trim();
}
function Ee(e) {
  const t = e.distribution?.strategy;
  return typeof t == "string" && ["sequential", "ladder"].includes(t.toLowerCase());
}
function jn(e, t, n) {
  const a = et(n), s = Ee(e);
  return e.quests.map((i, o) => {
    const l = L(t, i.title.key, n);
    return {
      id: i.uid,
      label: G(l) || i.key,
      detail: i.tier || void 0,
      caption: Cn(a, i),
      marker: s ? String(o + 1) : void 0,
      hover: {
        title: l || i.key,
        text: L(t, i.description.key, n) || void 0,
        lines: Sn(a, i, t, n)
      }
    };
  });
}
function Cn(e, t) {
  const n = t.stages.flatMap((i) => i.objectives), a = n[0];
  if (!a) return;
  const s = n.length - 1;
  return s > 0 ? `${oe(e, a)} +${String(s)}` : oe(e, a);
}
function Sn(e, t, n, a) {
  const s = t.stages.length > 1;
  return t.stages.flatMap(
    (i, o) => i.objectives.map((l) => {
      const c = oe(e, l);
      return s ? `<gray>${G(L(n, i.title.key, a)) || e("stage", { n: o + 1 })} ·</gray> ${c}` : c;
    })
  );
}
function En(e, t) {
  const n = et(t), a = typeof e.distribution?.strategy == "string" ? e.distribution.strategy.toLowerCase() : "", s = e.quests.length, i = s === 1 ? n("questCountOne") : n("questCount", { count: s }), o = a === "sequential" || a === "ladder" ? "ordered" : a;
  return ["none", "ordered", "random"].includes(o) ? `${i} · ${n(`strategy.${o}`).toLowerCase()}` : i;
}
function An(e, t) {
  const n = ue(t.params), a = Se(t.type, t.params), s = n !== void 0 ? String(n) : "", i = s && a ? `${s} × ${a}` : s || a;
  return i ? `${re(e, t.type)} · ${i}` : re(e, t.type);
}
function pt(e) {
  return e.stages.flatMap((t) => t.objectives);
}
function $n(e) {
  const t = pt(e), n = t.map((a) => a.key);
  return t.some(
    (a) => ut(a.type, a.params).length > 0 || n.indexOf(a.key) !== n.lastIndexOf(a.key)
  );
}
function Tn(e) {
  return Object.values(A(e.rest.actions)).reduce(
    (t, n) => t + (Array.isArray(n) ? n.length : n == null ? 0 : 1),
    0
  );
}
function mt(e) {
  const t = e.completed_when;
  return Array.isArray(t) ? t : t ? [t] : [];
}
function Pe(e) {
  const t = e.map((n) => {
    if (typeof n == "string") return n;
    const a = n && typeof n == "object" ? n.expression : void 0;
    return typeof a == "string" ? a : null;
  });
  return t.every((n) => n !== null) ? t.join(" · ") : null;
}
function On(e, t, n) {
  const a = structuredClone(e);
  a.uid = nt(), a.savedUid = void 0, a.savedKey = void 0, a.oldKeys = [], a.key = Z(`${e.key}_copy`, t), a.title = n(e.title), a.description = n(e.description);
  for (const [s, i] of a.stages.entries()) i.title = n(e.stages[s].title);
  return a;
}
const Me = ["player", "global"], ye = /* @__PURE__ */ new Set();
function Ln(e, t, n) {
  if (n && n.length > 0)
    return t && !n.includes(t) ? [...n, t] : [...n];
  const a = e?.documents?.[ee];
  for (const s of Array.isArray(a) ? a : []) {
    const i = s.actorType;
    typeof i == "string" && i && ye.add(i);
  }
  return t && ye.add(t), [...Me, ...[...ye].filter((s) => !Me.includes(s)).sort()];
}
function ft(e, t) {
  if (typeof e == "string") return e === "" ? {} : { [t]: e };
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const n = {};
  for (const [a, s] of Object.entries(e))
    typeof s == "string" && s !== "" && (n[a] = s);
  return n;
}
function Rn(e, t, n, a) {
  const s = ft(e, t);
  return a === "" ? delete s[n] : s[n] = a, Object.keys(s).length > 0 ? s : void 0;
}
const In = /^(\d+|(\d+[dhms])+)$/, Dn = ["actor_load", "period_reset", "quest_complete"], Pn = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
function Mn(e, t) {
  const n = bn(e, /* @__PURE__ */ new Date());
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
function Kn({ projectId: e, documentId: t, document: n, item: a }) {
  Be("msquests", ot);
  const s = n, i = At(e), o = $t(), l = Ne(), [c, p] = D(a ?? null);
  we(() => {
    p(a ?? null);
  }, [a]);
  const u = (b) => {
    p(b), Lt({ documentId: t, item: b });
  }, k = { projectId: e, project: i, lang: o, t: l, edit: (b, h) => {
    const g = structuredClone(s);
    b(g), Ot({ projectId: e, kind: ee, id: t, doc: g, texts: h });
  } }, f = c ? s.quests.findIndex((b) => b.uid === c) : -1;
  return /* @__PURE__ */ r("div", { className: "aq", children: f >= 0 ? /* @__PURE__ */ r(Jn, { ctx: k, group: s, index: f, onLeave: () => u(null) }, c) : /* @__PURE__ */ r(Un, { ctx: k, group: s, onOpen: u }) });
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
function Hn() {
  return /* @__PURE__ */ y("svg", { "aria-hidden": "true", width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: [
    /* @__PURE__ */ r("circle", { cx: "3", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "8", cy: "8", r: "1.5" }),
    /* @__PURE__ */ r("circle", { cx: "13", cy: "8", r: "1.5" })
  ] });
}
function E({ tone: e, title: t, children: n }) {
  return /* @__PURE__ */ r("span", { className: `aq-chip${e ? ` is-${e}` : ""}`, title: t, children: n });
}
function le({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  return /* @__PURE__ */ r("div", { className: "aq-seg", role: "radiogroup", "aria-label": e, children: n.map((s) => /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      role: "radio",
      "aria-checked": t === s.value,
      className: `aq-opt${t === s.value ? " is-on" : ""}`,
      onClick: () => a(s.value),
      children: s.label
    },
    s.value
  )) });
}
function T({
  label: e,
  children: t,
  hint: n,
  title: a
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the control is the child
    /* @__PURE__ */ y("label", { className: "aq-field", title: a, children: [
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
  rows: s,
  bare: i,
  placeholder: o
}) {
  const l = ze(e.project);
  return /* @__PURE__ */ r(
    Ve,
    {
      className: "aq-field",
      label: t,
      langs: l,
      activeLang: e.lang,
      defaultLang: l[0] ?? e.lang,
      values: Je(e.project, n.key),
      onChange: (c, p) => e.edit(() => {
      }, [{ key: n.key, lang: c, value: p }]),
      inline: i,
      renderEditor: (c) => /* @__PURE__ */ r(
        Ye,
        {
          value: c.value,
          onChange: c.onChange,
          placeholder: c.fallback ?? o,
          multiline: a,
          rows: a ? s : void 0,
          "aria-label": c.label
        }
      )
    }
  );
}
function ht({
  ctx: e,
  label: t,
  value: n,
  onChange: a
}) {
  const s = ze(e.project), i = s[0] ?? e.lang;
  return /* @__PURE__ */ r("span", { title: e.t("lineHint"), className: "aq-grow", children: /* @__PURE__ */ r(
    Ve,
    {
      className: "aq-field",
      label: t,
      langs: s,
      activeLang: e.lang,
      defaultLang: i,
      values: ft(n, i),
      onChange: (o, l) => a(Rn(n, i, o, l)),
      renderEditor: (o) => /* @__PURE__ */ r(
        Ye,
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
function Qn(e) {
  return typeof e == "number" ? String(e) : typeof e == "string" ? e : "";
}
function Q({
  label: e,
  value: t,
  onChange: n,
  placeholder: a
}) {
  return /* @__PURE__ */ r(T, { label: e, children: /* @__PURE__ */ r(
    "input",
    {
      className: "input",
      type: "number",
      min: 0,
      step: 1,
      value: Qn(t),
      placeholder: a,
      onChange: (s) => {
        const i = s.target.value.trim();
        n(i === "" ? void 0 : Math.max(0, Math.trunc(Number(i))));
      }
    }
  ) });
}
function Fn(e) {
  const t = gt(e);
  return t !== "" && t !== "none";
}
function gt(e) {
  return typeof e.strategy == "string" ? e.strategy.toLowerCase() : "";
}
function C(e, t, n) {
  n === void 0 || n === "" ? delete e[t] : e[t] = n;
}
function Ae(e, t, n) {
  if (n < 0 || n >= e.length) return;
  const [a] = e.splice(t, 1);
  e.splice(n, 0, a);
}
function pe({
  label: e,
  onClick: t,
  disabled: n,
  expanded: a,
  children: s
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
      children: s
    }
  );
}
function $e({
  t: e,
  label: t,
  sure: n,
  onRemove: a
}) {
  const [s, i] = D(!1);
  return s ? /* @__PURE__ */ y("span", { className: "aq-confirm", children: [
    /* @__PURE__ */ r(B, { size: "sm", variant: "ghost", onClick: () => i(!1), children: e("cancel") }),
    /* @__PURE__ */ r("button", { type: "button", className: "aq-danger", onClick: a, children: e("remove") })
  ] }) : /* @__PURE__ */ r(pe, { label: t, onClick: () => n ? a() : i(!0), children: "×" });
}
function Gn({
  label: e,
  children: t
}) {
  const [n, a] = D(!1), s = Xe(null);
  return we(() => {
    if (!n) return;
    const i = (l) => {
      s.current?.contains(l.target) || a(!1);
    }, o = (l) => {
      l.key === "Escape" && (l.preventDefault(), a(!1));
    };
    return window.addEventListener("mousedown", i), window.addEventListener("keydown", o, !0), () => {
      window.removeEventListener("mousedown", i), window.removeEventListener("keydown", o, !0);
    };
  }, [n]), /* @__PURE__ */ y("div", { className: "aq-menu-anchor", ref: s, children: [
    /* @__PURE__ */ r(pe, { label: e, expanded: n, onClick: () => a(!n), children: /* @__PURE__ */ r(Hn, {}) }),
    n && /* @__PURE__ */ r("div", { className: "aq-menu", role: "menu", children: t(() => a(!1)) })
  ] });
}
function yt(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n, a) => {
    const s = t.has(n) ? `${n}#${a}` : n;
    return t.add(n), s;
  });
}
function Un({
  ctx: e,
  group: t,
  onOpen: n
}) {
  const { t: a, edit: s, project: i, lang: o } = e, [l, c] = D(t.quests.length === 0), [p, u] = D(null), m = Ee(t), k = Object.keys(t.rest).filter((h) => h !== "actions"), f = () => {
    const h = F(), g = nt();
    s(
      (q) => {
        q.quests.push({
          key: Z(
            "quest",
            q.quests.map((w) => w.key)
          ),
          uid: g,
          oldKeys: [],
          tier: "",
          title: { key: h },
          description: { key: F() },
          duration: "",
          stages: [qt(1)],
          rest: {}
        });
      },
      [{ key: h, lang: o, value: a("newQuestTitle") }]
    ), n(g);
  }, b = (h) => {
    const g = [], q = (w) => {
      const N = F();
      for (const [j, S] of Object.entries(Je(i, w.key)))
        S !== "" && g.push({ key: N, lang: j, value: S });
      return { key: N };
    };
    s((w) => {
      w.quests.splice(
        h + 1,
        0,
        On(
          w.quests[h],
          w.quests.map((N) => N.key),
          q
        )
      );
    }, g);
  };
  return /* @__PURE__ */ y(M, { children: [
    /* @__PURE__ */ y("section", { className: "aq-card", children: [
      /* @__PURE__ */ y(
        "button",
        {
          type: "button",
          className: "aq-fold-head",
          "aria-expanded": l,
          onClick: () => c(!l),
          children: [
            /* @__PURE__ */ r(X, { open: l }),
            /* @__PURE__ */ r("span", { className: "aq-h", children: a("groupSettings") }),
            !l && /* @__PURE__ */ r(Bn, { ctx: e, group: t })
          ]
        }
      ),
      l && /* @__PURE__ */ r(zn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ y("section", { className: "aq-card", children: [
      /* @__PURE__ */ y("div", { className: "aq-card-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-h", children: a("quests") }),
        /* @__PURE__ */ r("span", { className: "aq-count", children: t.quests.length }),
        /* @__PURE__ */ r("span", { className: "aq-grow" }),
        /* @__PURE__ */ y(B, { size: "sm", variant: "primary", onClick: f, children: [
          "+ ",
          a("addQuest")
        ] })
      ] }),
      t.quests.length === 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: a("noQuests") }),
      /* @__PURE__ */ r(
        xe,
        {
          ids: t.quests.map((h) => h.uid),
          onMove: (h, g) => s((q) => Ae(q.quests, h, g)),
          className: "aq-quests",
          itemClassName: "aq-quest",
          children: (h, g) => {
            const q = t.quests[h], w = G(L(i, q.title.key, o)) || q.key, N = pt(q), j = mt(q.rest), S = t.tiers.find((d) => d.key === q.tier), O = Tn(q);
            return /* @__PURE__ */ y(M, { children: [
              g,
              m && /* @__PURE__ */ r("span", { className: "aq-n", children: h + 1 }),
              /* @__PURE__ */ y("button", { type: "button", className: "aq-quest-main", onClick: () => n(q.uid), children: [
                /* @__PURE__ */ r("span", { className: "aq-quest-title", children: w }),
                /* @__PURE__ */ r("span", { className: "aq-quest-sub", children: N.length === 0 ? a("noObjectivesShort") : N.map((d) => An(a, d)).join("  ·  ") })
              ] }),
              p === q.uid ? /* @__PURE__ */ y("span", { className: "aq-confirm", children: [
                /* @__PURE__ */ r("span", { children: a("removeConfirm", { name: w }) }),
                /* @__PURE__ */ r(B, { size: "sm", variant: "ghost", onClick: () => u(null), children: a("cancel") }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "aq-danger",
                    onClick: () => {
                      u(null), s((d) => {
                        d.quests.splice(h, 1);
                      });
                    },
                    children: a("remove")
                  }
                )
              ] }) : /* @__PURE__ */ y(M, { children: [
                /* @__PURE__ */ y("span", { className: "aq-chips", children: [
                  $n(q) && /* @__PURE__ */ r(E, { tone: "warn", children: a("toComplete") }),
                  m && j.length > 0 && /* @__PURE__ */ y(E, { title: a("completedWhenHint"), children: [
                    a("completedWhen"),
                    " ",
                    Pe(j) !== null ? /* @__PURE__ */ r("span", { className: "aq-mono", children: Pe(j) }) : a("conditionCount", { count: j.length })
                  ] }),
                  q.tier && /* @__PURE__ */ r(E, { children: S && G(L(i, S.title.key, o)) || q.tier }),
                  q.duration && /* @__PURE__ */ r(E, { children: q.duration }),
                  O > 0 && /* @__PURE__ */ r(E, { children: O === 1 ? a("actionCountOne") : a("actionCount", { count: O }) })
                ] }),
                /* @__PURE__ */ r(Gn, { label: a("moreActions"), children: (d) => /* @__PURE__ */ y(M, { children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      onClick: () => {
                        d(), b(h);
                      },
                      children: a("duplicate")
                    }
                  ),
                  /* @__PURE__ */ y(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      className: "is-danger",
                      onClick: () => {
                        d(), u(q.uid);
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
      k.length > 0 && /* @__PURE__ */ r("div", { className: "aq-empty", children: a("kept", { fields: k.join(", ") }) })
    ] })
  ] });
}
function vt(e, t) {
  return t === "player" || t === "global" || t === "guild" ? e(`actor.${t}`) : t;
}
const Wn = "quests:actor_types";
function be(e) {
  const t = gt(e);
  return t === "sequential" || t === "ladder" ? "ordered" : t === "none" || t === "random" ? t : "";
}
function Bn({ ctx: e, group: t }) {
  const { t: n } = e, a = Ze(), s = typeof t.reset.cron == "string" ? t.reset.cron : "", i = be(t.distribution), o = Object.keys(A(t.rest.actions)).length, l = s ? vn(s, a) ?? s : n("noReset");
  return /* @__PURE__ */ y("span", { className: "aq-chips", children: [
    /* @__PURE__ */ r(E, { children: vt(n, t.actorType) }),
    i && /* @__PURE__ */ r(E, { children: n(`strategy.${i}`) }),
    /* @__PURE__ */ r(E, { children: l.charAt(0).toUpperCase() + l.slice(1) }),
    t.tiers.length > 0 && /* @__PURE__ */ r(E, { children: n("tierCount", { count: t.tiers.length }) }),
    o > 0 && /* @__PURE__ */ r(E, { children: n("eventCount", { count: o }) })
  ] });
}
function zn({ ctx: e, group: t }) {
  const { t: n, edit: a, project: s, lang: i } = e, o = be(t.distribution), l = o === "ordered", c = Array.isArray(t.distribution.triggers) ? t.distribution.triggers : [], p = t.distribution.tiers ?? {}, u = Rt(Wn)?.map((f) => f.value), m = Ln(s, t.actorType, u), k = !!u?.length && !!t.actorType && !u.includes(t.actorType);
  return /* @__PURE__ */ y("div", { className: "aq-settings", children: [
    /* @__PURE__ */ y("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("identity") }),
      /* @__PURE__ */ r(W, { ctx: e, label: n("title"), node: t.title }),
      /* @__PURE__ */ r(W, { ctx: e, label: n("description"), node: t.description, multiline: !0 }),
      /* @__PURE__ */ y("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("actorType") }),
        /* @__PURE__ */ r(
          le,
          {
            label: n("actorType"),
            value: t.actorType,
            options: m.map((f) => ({ value: f, label: vt(n, f) })),
            onChange: (f) => a((b) => {
              b.actorType = f;
            })
          }
        ),
        k && /* @__PURE__ */ r("span", { className: "aq-warn", children: n("actorUnknown", { type: t.actorType }) })
      ] })
    ] }),
    /* @__PURE__ */ y("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("distribution") }),
      /* @__PURE__ */ y("div", { className: "aq-field", children: [
        /* @__PURE__ */ r("span", { className: "field-label", children: n("strategy") }),
        /* @__PURE__ */ r(
          le,
          {
            label: n("strategy"),
            value: o,
            options: ["none", "ordered", "random"].map((f) => ({
              value: f,
              label: n(`strategy.${f}`)
            })),
            onChange: (f) => a((b) => {
              f === "ordered" && be(b.distribution) === "ordered" || (b.distribution.strategy = f === "ordered" ? "sequential" : f);
            })
          }
        )
      ] }),
      !l && /* @__PURE__ */ y(M, { children: [
        /* @__PURE__ */ y("div", { className: "aq-row", children: [
          /* @__PURE__ */ r(
            Q,
            {
              label: n("amount"),
              value: t.distribution.amount,
              onChange: (f) => a((b) => C(b.distribution, "amount", f))
            }
          ),
          /* @__PURE__ */ r(
            Q,
            {
              label: n("maxActive"),
              value: t.limits.max_active,
              onChange: (f) => a((b) => C(b.limits, "max_active", f))
            }
          )
        ] }),
        /* @__PURE__ */ y("div", { className: "aq-field", children: [
          /* @__PURE__ */ r("span", { className: "field-label", children: n("triggers") }),
          Dn.map((f) => /* @__PURE__ */ y("label", { className: "aq-check", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: c.includes(f),
                onChange: (b) => a((h) => {
                  const g = Array.isArray(h.distribution.triggers) ? h.distribution.triggers : [], q = b.target.checked ? [...g, f] : g.filter((w) => w !== f);
                  C(h.distribution, "triggers", q.length ? q : void 0);
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
          onChange: (f) => a((b) => C(b.limits, "max_per_period", f))
        }
      ),
      !l && /* @__PURE__ */ y("div", { className: "aq-row", children: [
        /* @__PURE__ */ y("label", { className: "aq-check", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: t.rotation.enabled === !0,
              onChange: (f) => a((b) => C(b.rotation, "enabled", f.target.checked ? !0 : void 0))
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
            onChange: (f) => a((b) => C(b.rotation, "max_per_period", f))
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ y("div", { className: "aq-block", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("reset") }),
      /* @__PURE__ */ r(Vn, { ctx: e, group: t })
    ] }),
    /* @__PURE__ */ y("div", { className: "aq-block", children: [
      /* @__PURE__ */ y("div", { className: "aq-block-head", children: [
        /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: n("tiers") }),
        /* @__PURE__ */ y(
          B,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => a((f) => {
              f.tiers.push({
                key: Z(
                  "tier",
                  f.tiers.map((b) => b.key)
                ),
                title: { key: F() },
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
      t.tiers.map((f, b) => /* @__PURE__ */ y("div", { className: "aq-tier", children: [
        /* @__PURE__ */ r(W, { ctx: e, label: n("title"), node: f.title }),
        /* @__PURE__ */ r(T, { label: n("tierKey"), children: /* @__PURE__ */ r(
          "input",
          {
            className: "input aq-mono",
            defaultValue: f.key,
            onBlur: (h) => {
              const g = de(h.target.value);
              g !== f.key && a((q) => {
                const w = Z(
                  g,
                  q.tiers.map((j) => j.key)
                );
                q.tiers[b].key = w;
                for (const j of q.quests) j.tier === f.key && (j.tier = w);
                const N = q.distribution.tiers;
                N && f.key in N && (N[w] = N[f.key], delete N[f.key]);
              });
            }
          }
        ) }),
        !l && /* @__PURE__ */ r(
          Q,
          {
            label: n("perTier"),
            value: p[f.key],
            onChange: (h) => a((g) => {
              const q = { ...g.distribution.tiers ?? {} };
              C(q, f.key, h), C(g.distribution, "tiers", Object.keys(q).length ? q : void 0);
            })
          }
        ),
        /* @__PURE__ */ r(
          $e,
          {
            t: n,
            label: n("remove"),
            sure: !t.quests.some((h) => h.tier === f.key),
            onRemove: () => a((h) => {
              h.tiers.splice(b, 1);
            })
          }
        )
      ] }, f.key)),
      t.tiers.length === 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: n("noTier") })
    ] }),
    /* @__PURE__ */ r("div", { className: "aq-block is-wide", children: /* @__PURE__ */ r(
      bt,
      {
        ctx: e,
        title: n("hooks"),
        hooks: nn,
        label: (f) => n(`hook.${f}`),
        value: t.rest.actions,
        onChange: (f, b) => a((h) => {
          const g = { ...A(h.rest.actions) };
          C(g, f, b), C(h.rest, "actions", Object.keys(g).length ? g : void 0);
        })
      },
      t.id
    ) })
  ] });
}
function Vn({ ctx: e, group: t }) {
  const { t: n, edit: a } = e, s = Ze(), i = typeof t.reset.cron == "string" ? t.reset.cron : "", o = qn(i), [l, c] = D(!1), p = l && i !== "" ? { kind: "custom" } : o, u = typeof t.reset.timezone == "string" ? t.reset.timezone : "", m = i && ge(i) ? Mn(i, s) : null, k = (h) => {
    const g = kn(h);
    g !== null && a((q) => C(q.reset, "cron", g));
  }, f = "time" in p ? p.time : "04:00", b = (h) => {
    c(h === "custom"), h === "never" ? k({ kind: h }) : h === "daily" ? k({ kind: h, time: f }) : h === "weekly" ? k({ kind: h, time: f, day: 1 }) : h === "monthly" ? k({ kind: h, time: f, day: 1 }) : i === "" && a((g) => C(g.reset, "cron", "0 4 * * *"));
  };
  return /* @__PURE__ */ y(M, { children: [
    /* @__PURE__ */ r(
      le,
      {
        label: n("reset"),
        value: p.kind,
        options: ["never", "daily", "weekly", "monthly", "custom"].map((h) => ({
          value: h,
          label: n(`reset.${h}`)
        })),
        onChange: b
      }
    ),
    p.kind !== "never" && /* @__PURE__ */ y("div", { className: "aq-row aq-reset", children: [
      p.kind === "weekly" && /* @__PURE__ */ r(T, { label: n("resetDay"), children: /* @__PURE__ */ r(
        "select",
        {
          className: "select",
          value: p.day,
          onChange: (h) => k({ ...p, day: Number(h.target.value) }),
          children: [1, 2, 3, 4, 5, 6, 0].map((h) => /* @__PURE__ */ r("option", { value: h, children: xn(s)[h] }, h))
        }
      ) }),
      p.kind === "monthly" && /* @__PURE__ */ r(
        Q,
        {
          label: n("resetDayOfMonth"),
          value: p.day,
          onChange: (h) => k({ ...p, day: h ?? 1 })
        }
      ),
      p.kind === "custom" ? /* @__PURE__ */ r(
        T,
        {
          label: n("cron"),
          hint: ge(i) ? void 0 : /* @__PURE__ */ r("span", { className: "aq-err", children: n("cronInvalid") }),
          children: /* @__PURE__ */ r(
            "input",
            {
              className: "input aq-mono",
              value: i,
              placeholder: "0 4 * * *",
              onChange: (h) => a((g) => C(g.reset, "cron", h.target.value))
            }
          )
        }
      ) : /* @__PURE__ */ r(T, { label: n("resetTime"), children: /* @__PURE__ */ r(
        "input",
        {
          className: "input",
          type: "time",
          value: p.time,
          onChange: (h) => h.target.value && k({ ...p, time: h.target.value })
        }
      ) })
    ] }),
    i && ge(i) && (u || m) && /* @__PURE__ */ r("span", { className: "aq-ok", children: u && u !== Pn ? u : m ? n("nextRun", { when: m }) : "" })
  ] });
}
function Yn({
  ctx: e,
  value: t,
  onChange: n
}) {
  const { chain: a, legacy: s } = en(t);
  return /* @__PURE__ */ y("div", { className: "aq-chain", children: [
    /* @__PURE__ */ r(
      It,
      {
        projectId: e.projectId,
        value: a,
        onChange: (i) => n(Ie(i, s))
      }
    ),
    s.length > 0 && /* @__PURE__ */ r("div", { className: "aq-legacy", title: e.t("legacySteps"), children: s.map((i, o) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
      /* @__PURE__ */ y("div", { className: "aq-legacy-row", children: [
        /* @__PURE__ */ r("code", { children: tn(i) }),
        /* @__PURE__ */ r(
          pe,
          {
            label: e.t("remove"),
            onClick: () => n(Ie(a, s.filter((l, c) => c !== o))),
            children: "×"
          }
        )
      ] }, o)
    )) })
  ] });
}
function bt({
  ctx: e,
  title: t,
  hooks: n,
  label: a,
  value: s,
  onChange: i
}) {
  const { t: o } = e, l = A(s), [c, p] = D([]), [u, m] = D(null), k = n.filter((b) => l[b] != null || c.includes(b)), f = n.filter((b) => !k.includes(b));
  return /* @__PURE__ */ y(M, { children: [
    /* @__PURE__ */ y("div", { className: "aq-block-head", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: t }),
      f.length > 0 && /* @__PURE__ */ y(
        "select",
        {
          className: "select aq-event-add",
          "aria-label": o("addEvent"),
          value: "",
          onChange: (b) => {
            const h = f.find((g) => g === b.target.value);
            h && (p((g) => [...g, h]), m(h));
          },
          children: [
            /* @__PURE__ */ y("option", { value: "", children: [
              "+ ",
              o("addEvent")
            ] }),
            f.map((b) => /* @__PURE__ */ r("option", { value: b, children: a(b) }, b))
          ]
        }
      )
    ] }),
    k.map((b) => {
      const h = u === b, g = Array.isArray(l[b]) ? l[b].length : l[b] ? 1 : 0;
      return /* @__PURE__ */ y("div", { className: `aq-line${h ? " is-open" : ""}`, children: [
        /* @__PURE__ */ y("div", { className: "aq-line-head", children: [
          /* @__PURE__ */ y(
            "button",
            {
              type: "button",
              className: "aq-line-main",
              "aria-expanded": h,
              onClick: () => m(h ? null : b),
              children: [
                /* @__PURE__ */ r(X, { open: h }),
                /* @__PURE__ */ r("span", { className: "aq-line-text", children: a(b) }),
                g > 0 && /* @__PURE__ */ r(E, { children: g === 1 ? o("actionCountOne") : o("actionCount", { count: g }) })
              ]
            }
          ),
          /* @__PURE__ */ r(
            $e,
            {
              t: o,
              label: o("removeEvent"),
              sure: g === 0,
              onRemove: () => {
                p((q) => q.filter((w) => w !== b)), i(b, void 0);
              }
            }
          )
        ] }),
        h && /* @__PURE__ */ r("div", { className: "aq-line-body", children: /* @__PURE__ */ r(Yn, { ctx: e, value: l[b], onChange: (q) => i(b, q) }) })
      ] }, b);
    })
  ] });
}
function qt(e) {
  return {
    key: `stage_${e}`,
    title: { key: F() },
    flow: "parallel",
    objectives: [],
    rest: {}
  };
}
function Jn({
  ctx: e,
  group: t,
  index: n,
  onLeave: a
}) {
  const { t: s, edit: i, project: o, lang: l } = e, c = t.quests[n], p = (v, x) => i((_) => v(_.quests[n]), x), u = t.quests.some((v, x) => x !== n && v.key === c.key), m = Xe(c.key), k = it(c, new Set(t.quests.map((v) => v.key))), f = c.duration !== "" && !In.test(c.duration.replace(/\s/g, "").toLowerCase()), b = Object.keys(c.rest).filter(
    (v) => v !== "actions" && v !== "giver" && v !== "completed_when"
  ), h = Ee(t), g = c.rest.giver && typeof c.rest.giver == "object" ? c.rest.giver : {}, q = (v, x) => p((_) => {
    const R = { ...g };
    C(R, v, x.trim()), typeof R.npc == "string" && R.npc !== "" ? _.rest.giver = R : delete _.rest.giver;
  }), w = typeof g.npc == "string" ? g.npc : "", N = Fn(t.distribution), j = t.tiers.find((v) => v.key === c.tier), [S, O] = D(!1), d = S || u || f;
  return we(() => {
    const v = (x) => {
      x.key !== "Escape" || x.defaultPrevented || x.target?.closest("input, textarea, select, [contenteditable='true']") || window.document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]') || (x.preventDefault(), a());
    };
    return window.addEventListener("keydown", v, !0), () => window.removeEventListener("keydown", v, !0);
  }, [a]), /* @__PURE__ */ y("div", { className: "aq-quest-page", children: [
    /* @__PURE__ */ y("div", { className: "aq-quest-col", children: [
      /* @__PURE__ */ y("section", { className: "aq-card", children: [
        /* @__PURE__ */ y("div", { className: "aq-quest-head", children: [
          /* @__PURE__ */ r("div", { className: "aq-quest-name", children: /* @__PURE__ */ r(W, { ctx: e, label: s("questName"), node: c.title }) }),
          /* @__PURE__ */ r(
            W,
            {
              ctx: e,
              multiline: !0,
              rows: 2,
              label: s("questDescription"),
              node: c.description
            }
          )
        ] }),
        /* @__PURE__ */ y(
          "button",
          {
            type: "button",
            className: "aq-fold-head is-inner",
            "aria-expanded": d,
            onClick: () => O(!d),
            children: [
              /* @__PURE__ */ r(X, { open: d }),
              /* @__PURE__ */ r("span", { className: "aq-fold-title", children: s("questSettings") }),
              !d && /* @__PURE__ */ y("span", { className: "aq-chips", children: [
                c.tier && /* @__PURE__ */ r(E, { children: j && G(L(o, j.title.key, l)) || c.tier }),
                /* @__PURE__ */ r(E, { children: c.duration || s("noTimeLimit") }),
                w && /* @__PURE__ */ r(E, { children: s("givenBy", { npc: w }) }),
                /* @__PURE__ */ r(E, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: c.key }) })
              ] })
            ]
          }
        ),
        d && /* @__PURE__ */ y("div", { className: "aq-fold-body", children: [
          /* @__PURE__ */ y("div", { className: "aq-row aq-top aq-wrap", children: [
            t.tiers.length > 0 || c.tier ? /* @__PURE__ */ r(T, { label: s("tier"), children: /* @__PURE__ */ y(
              "select",
              {
                className: "select",
                value: c.tier,
                onChange: (v) => p((x) => {
                  x.tier = v.target.value;
                }),
                children: [
                  /* @__PURE__ */ r("option", { value: "", children: s("noTier") }),
                  t.tiers.map((v) => /* @__PURE__ */ r("option", { value: v.key, children: G(L(o, v.title.key, l)) || v.key }, v.key)),
                  c.tier && !j && /* @__PURE__ */ r("option", { value: c.tier, children: c.tier })
                ]
              }
            ) }) : null,
            /* @__PURE__ */ r(
              T,
              {
                label: s("duration"),
                hint: f ? /* @__PURE__ */ r("span", { className: "aq-err", children: s("durationInvalid") }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input",
                    value: c.duration,
                    placeholder: "24h",
                    onChange: (v) => p((x) => {
                      x.duration = v.target.value.trim();
                    })
                  }
                )
              }
            ),
            /* @__PURE__ */ r(
              T,
              {
                label: s("key"),
                hint: u ? /* @__PURE__ */ r("span", { className: "aq-err", children: s("keyTaken") }) : k.length > 0 ? /* @__PURE__ */ y("span", { children: [
                  s("formerKeys", { keys: k.join(", ") }),
                  " ",
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "aq-forget",
                      onClick: () => p((v) => {
                        v.oldKeys = [], v.savedKey = v.key;
                      }),
                      children: s("forgetFormerKeys")
                    }
                  )
                ] }) : void 0,
                children: /* @__PURE__ */ r(
                  "input",
                  {
                    className: "input aq-mono",
                    value: c.key,
                    onFocus: () => {
                      m.current = c.key;
                    },
                    onChange: (v) => p((x) => {
                      x.key = at(v.target.value);
                    }),
                    onBlur: () => {
                      const v = de(c.key), x = m.current;
                      (v !== c.key || x !== v) && p((_) => {
                        _.key = v, zt(_, x);
                      });
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ y("div", { className: "aq-row aq-top aq-wrap", children: [
            /* @__PURE__ */ r(T, { label: s("giverNpc"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: w,
                onChange: (v) => q("npc", v.target.value)
              }
            ) }),
            w && /* @__PURE__ */ r(T, { label: s("giverConversation"), children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: typeof g.conversation == "string" ? g.conversation : "",
                onChange: (v) => q("conversation", v.target.value)
              }
            ) })
          ] }),
          w && /* @__PURE__ */ r(
            ht,
            {
              ctx: e,
              label: s("giverLine"),
              value: g.line,
              onChange: (v) => p((x) => {
                const _ = { ...g };
                C(_, "line", v), x.rest.giver = _;
              })
            }
          ),
          w && N && /* @__PURE__ */ r("span", { className: "aq-warn", children: s("giverDistributed") })
        ] })
      ] }),
      /* @__PURE__ */ r(
        xe,
        {
          ids: yt(c.stages.map((v) => v.key)),
          onMove: (v, x) => p((_) => Ae(_.stages, v, x)),
          className: "aq-stages",
          children: (v, x) => /* @__PURE__ */ r(
            Zn,
            {
              ctx: e,
              quest: c,
              stage: c.stages[v],
              si: v,
              handle: x,
              editQuest: p
            }
          )
        }
      ),
      /* @__PURE__ */ y(
        B,
        {
          size: "sm",
          variant: "ghost",
          className: "aq-add",
          onClick: () => p((v) => {
            const x = Z(
              `stage_${v.stages.length + 1}`,
              v.stages.map((_) => _.key)
            );
            v.stages.push({ ...qt(v.stages.length + 1), key: x });
          }),
          children: [
            "+ ",
            s("addStage")
          ]
        }
      ),
      h && /* @__PURE__ */ y("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ y("span", { className: "aq-h aq-h-row", children: [
          s("completedWhen"),
          /* @__PURE__ */ r("span", { className: "aq-help", tabIndex: 0, role: "note", "aria-label": s("completedWhenHint"), "data-tip": s("completedWhenHint"), children: "?" })
        ] }),
        /* @__PURE__ */ r(
          Tt,
          {
            projectId: e.projectId,
            value: mt(c.rest),
            emptyHint: s("completedWhenEmpty"),
            onChange: (v) => p((x) => C(x.rest, "completed_when", v.length > 0 ? v : void 0))
          },
          c.uid
        )
      ] }),
      /* @__PURE__ */ y("section", { className: "aq-card aq-pad", children: [
        /* @__PURE__ */ r(
          bt,
          {
            ctx: e,
            title: s("questEvents"),
            hooks: an,
            label: (v) => s(`questHook.${v}`),
            value: c.rest.actions,
            onChange: (v, x) => p((_) => {
              const R = { ...A(_.rest.actions) };
              C(R, v, x), C(_.rest, "actions", Object.keys(R).length > 0 ? R : void 0);
            })
          },
          c.uid
        ),
        b.length > 0 && /* @__PURE__ */ r("span", { className: "aq-mut", children: s("kept", { fields: b.join(", ") }) })
      ] })
    ] }),
    /* @__PURE__ */ y("aside", { className: "aq-card aq-pad aq-aside", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: s("preview") }),
      /* @__PURE__ */ r(aa, { ctx: e, quest: c })
    ] })
  ] });
}
function Zn({
  ctx: e,
  quest: t,
  stage: n,
  si: a,
  handle: s,
  editQuest: i
}) {
  const { t: o } = e, [l, c] = D(null), [p, u] = D(!1), m = (g) => i((q) => g(q.stages[a])), k = n.flow || "parallel", f = t.stages.flatMap((g) => g.objectives.map((q) => q.key)), b = p || n.objectives.length === 0, h = (g) => {
    const q = Gt(g, f);
    i((w) => {
      w.stages[a].objectives.push({ key: q, type: g, params: ct(g) });
    }), c(q), u(!1);
  };
  return /* @__PURE__ */ y("div", { className: "aq-card aq-stage", children: [
    /* @__PURE__ */ y("div", { className: "aq-stage-head", children: [
      s,
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
        le,
        {
          label: o("flow"),
          value: k,
          options: ["parallel", "sequential"].map((g) => ({
            value: g,
            label: o(`flow.${g}`)
          })),
          onChange: (g) => m((q) => {
            q.flow = g;
          })
        }
      ),
      /* @__PURE__ */ r(
        $e,
        {
          t: o,
          label: o("remove"),
          sure: n.objectives.length === 0,
          onRemove: () => i((g) => {
            g.stages.splice(a, 1);
          })
        }
      )
    ] }),
    /* @__PURE__ */ y("span", { className: "aq-eyebrow", children: [
      o("objectives"),
      " ",
      /* @__PURE__ */ r("span", { className: "aq-count", children: n.objectives.length })
    ] }),
    /* @__PURE__ */ r(
      xe,
      {
        ids: yt(n.objectives.map((g) => g.key)),
        onMove: (g, q) => m((w) => Ae(w.objectives, g, q)),
        className: "aq-objectives",
        children: (g, q) => {
          const w = n.objectives[g];
          return /* @__PURE__ */ r(
            Xn,
            {
              ctx: e,
              t: o,
              projectId: e.projectId,
              n: k === "sequential" ? `${a + 1}.${g + 1}` : "",
              objective: w,
              open: l === w.key,
              onToggle: () => c(l === w.key ? null : w.key),
              keyTaken: f.filter((N) => N === w.key).length > 1,
              handle: q,
              onChange: (N) => m((j) => N(j.objectives[g])),
              onRename: (N) => {
                l === w.key && c(N);
              },
              onRemove: () => m((N) => {
                N.objectives.splice(g, 1);
              })
            }
          );
        }
      }
    ),
    b ? /* @__PURE__ */ y("div", { className: "aq-types", children: [
      /* @__PURE__ */ r("span", { className: "aq-eyebrow", children: o("addObjective") }),
      /* @__PURE__ */ r("div", { className: "aq-seg", children: je.map((g) => /* @__PURE__ */ y("button", { type: "button", className: "aq-opt", onClick: () => h(g.type), children: [
        /* @__PURE__ */ r("span", { "aria-hidden": !0, children: g.icon }),
        " ",
        o(`objective.${g.type}`)
      ] }, g.type)) })
    ] }) : /* @__PURE__ */ y(B, { size: "sm", variant: "ghost", className: "aq-add", onClick: () => u(!0), children: [
      "+ ",
      o("addObjective")
    ] })
  ] });
}
function Xn({
  ctx: e,
  t,
  projectId: n,
  n: a,
  objective: s,
  open: i,
  onToggle: o,
  keyTaken: l,
  handle: c,
  onChange: p,
  onRename: u,
  onRemove: m
}) {
  const k = z(s.type), f = k ? k.params : Object.keys(s.params).map((d) => ({ name: d, kind: "text" })), b = ue(s.params), h = Se(s.type, s.params), g = ut(s.type, s.params), q = l || g.length > 0, w = f.filter((d) => d.advanced), [N, j] = D(!1), S = N || l, O = (d) => d.kind === "item" ? /* @__PURE__ */ r(
    ea,
    {
      t,
      projectId: n,
      spec: d,
      params: s.params,
      onChange: (v) => p((x) => v(x.params))
    },
    d.name
  ) : d.kind === "line" ? /* @__PURE__ */ r(
    ht,
    {
      ctx: e,
      label: t(`param.${d.name}`),
      value: s.params[d.name],
      onChange: (v) => p((x) => C(x.params, d.name, v))
    },
    d.name
  ) : /* @__PURE__ */ r(
    ta,
    {
      t,
      spec: d,
      value: s.params[d.name],
      onChange: (v) => p((x) => C(x.params, d.name, v))
    },
    d.name
  );
  return /* @__PURE__ */ y("div", { className: `aq-obj${i ? " is-open" : ""}${q ? " has-problem" : ""}`, children: [
    /* @__PURE__ */ y("div", { className: "aq-obj-line", children: [
      c,
      /* @__PURE__ */ y("button", { type: "button", className: "aq-obj-main", onClick: o, "aria-expanded": i, children: [
        a && /* @__PURE__ */ r("span", { className: "aq-obj-n", children: a }),
        /* @__PURE__ */ r("span", { className: "aq-obj-icon", "aria-hidden": !0, children: k?.icon ?? "?" }),
        /* @__PURE__ */ y("span", { className: "aq-obj-text", children: [
          re(t, s.type),
          b !== void 0 && /* @__PURE__ */ y("strong", { children: [
            " · ",
            String(b)
          ] }),
          h ? ` × ${h}` : b !== void 0 && k ? ` × ${t("any")}` : ""
        ] }),
        q && /* @__PURE__ */ r(E, { tone: "warn", children: l ? t("objectiveKeyTaken") : t("missing", {
          fields: g.map((d) => t(`param.${d}`)).join(", ")
        }) }),
        /* @__PURE__ */ r(X, { open: i })
      ] }),
      /* @__PURE__ */ r(pe, { label: t("remove"), onClick: m, children: "×" })
    ] }),
    i && /* @__PURE__ */ y("div", { className: "aq-obj-form", children: [
      /* @__PURE__ */ y("div", { className: "aq-row aq-top aq-wrap", children: [
        /* @__PURE__ */ r(T, { label: t("type"), children: /* @__PURE__ */ y(
          "select",
          {
            className: "select",
            value: s.type,
            onChange: (d) => p((v) => {
              v.type = d.target.value, v.params = ct(v.type);
            }),
            children: [
              je.map((d) => /* @__PURE__ */ y("option", { value: d.type, children: [
                d.icon,
                " ",
                t(`objective.${d.type}`)
              ] }, d.type)),
              !k && /* @__PURE__ */ r("option", { value: s.type, children: s.type })
            ]
          }
        ) }),
        f.filter((d) => !d.advanced).map(O)
      ] }),
      /* @__PURE__ */ y(
        "button",
        {
          type: "button",
          className: "aq-fold-head is-inner",
          "aria-expanded": S,
          onClick: () => j(!S),
          children: [
            /* @__PURE__ */ r(X, { open: S }),
            /* @__PURE__ */ r("span", { className: "aq-fold-title", children: t("more") }),
            !S && /* @__PURE__ */ r(E, { children: /* @__PURE__ */ r("span", { className: "aq-mono", children: s.key }) })
          ]
        }
      ),
      S && /* @__PURE__ */ y("div", { className: "aq-row aq-top aq-wrap", children: [
        w.map(O),
        /* @__PURE__ */ r(
          T,
          {
            label: t("key"),
            title: t("objectiveKeyHint"),
            hint: l ? /* @__PURE__ */ r("span", { className: "aq-err", children: t("objectiveKeyTaken") }) : void 0,
            children: /* @__PURE__ */ r(
              "input",
              {
                className: "input aq-mono",
                value: s.key,
                onChange: (d) => {
                  const v = at(d.target.value);
                  p((x) => {
                    x.key = v;
                  }), u(v);
                },
                onBlur: () => {
                  const d = de(s.key);
                  d !== s.key && (p((v) => {
                    v.key = d;
                  }), u(d));
                }
              }
            )
          }
        )
      ] })
    ] })
  ] });
}
function ea({
  t: e,
  projectId: t,
  spec: n,
  params: a,
  onChange: s
}) {
  const i = Ce(a, n), o = Array.isArray(a.match) ? a.match : void 0, l = (c, p) => s((u) => wn(u, n, c, p));
  return /* @__PURE__ */ r(T, { label: e(`param.${n.name}`), children: /* @__PURE__ */ r(
    Pt,
    {
      projectId: t,
      value: i,
      match: o,
      onChange: (c) => l(c, o),
      onMatchChange: (c) => l(i, c)
    }
  ) });
}
function ta({
  t: e,
  spec: t,
  value: n,
  onChange: a
}) {
  const s = e(`param.${t.name}`), i = typeof n == "string" || typeof n == "number" ? String(n) : "";
  if (t.kind === "int")
    return /* @__PURE__ */ r(Q, { label: s, value: n, onChange: a });
  if (t.kind === "material")
    return /* @__PURE__ */ r(T, { label: s, children: /* @__PURE__ */ r(
      Mt,
      {
        value: i,
        placeholder: e("any"),
        "aria-label": s,
        onChange: (l) => a(l.toUpperCase().replace(/\s+/g, "_"))
      }
    ) });
  const o = t.kind === "entity";
  return /* @__PURE__ */ y(T, { label: s, children: [
    /* @__PURE__ */ r(
      "input",
      {
        className: `input${o ? " aq-mono" : ""}`,
        list: o ? "aq-entities" : void 0,
        value: i,
        placeholder: o ? e("any") : "",
        onChange: (l) => a(o ? l.target.value.toUpperCase().replace(/\s+/g, "_") : l.target.value)
      }
    ),
    o && /* @__PURE__ */ r("datalist", { id: "aq-entities", children: Nn.map((l) => /* @__PURE__ */ r("option", { value: l }, l)) })
  ] });
}
const na = 170, Ke = { color: "#aaaaaa", italic: !1 }, He = { color: "#ffffff", italic: !1 };
function aa({ ctx: e, quest: t }) {
  const { t: n, project: a, lang: s } = e, i = (p) => p.split(`
`).flatMap((u) => u === "" ? [""] : Dt(u, na)), o = L(a, t.title.key, s) || t.key, l = L(a, t.description.key, s), c = t.stages.length > 1;
  return /* @__PURE__ */ r("div", { className: "aq-preview", children: /* @__PURE__ */ y("div", { className: "aq-preview-frame", children: [
    /* @__PURE__ */ r(ne, { source: i(o).join(`
`), defaults: He, scale: 2 }),
    l && /* @__PURE__ */ r(ne, { source: i(l).join(`
`), defaults: Ke, scale: 2 }),
    t.stages.map((p, u) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
      /* @__PURE__ */ y("div", { className: "aq-preview-stage", children: [
        c && /* @__PURE__ */ r(
          ne,
          {
            source: i(L(a, p.title.key, s) || n("stage", { n: u + 1 })).join(`
`),
            defaults: He,
            scale: 2
          }
        ),
        p.objectives.length > 0 && /* @__PURE__ */ r(
          ne,
          {
            source: p.objectives.flatMap((m) => i(`• ${oe(n, m)}`)).join(`
`),
            defaults: Ke,
            scale: 2
          }
        )
      ] }, u)
    ))
  ] }) });
}
function sa({ className: e }) {
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
const ia = {
  kind: ee,
  dir: tt,
  schemaVersion: _e,
  // Created in the module's folder only (SDK 1.8); a group already elsewhere still loads.
  projects: [Qt],
  // Data with no links: one "Quests" entry and page instead of a node per group (SDK 1.9).
  collection: { labels: Ht },
  // A group's id is its key on the server (`quest_group_key`): typed by hand, no prefix.
  label: Le.en,
  labels: Le,
  icon: sa,
  component: Kn,
  // The view is a page of its own: its cards, and the quest beside what the player sees.
  ownHeader: !0,
  wide: !0,
  title: (e, { project: t, lang: n }) => G(L(t, e.title.key, n)),
  // The sidebar reads "Niveaux de guilde", the file's id stays in the group's settings.
  listByTitle: !0,
  create: ({ id: e, projectId: t }) => ({
    id: e,
    projectId: t,
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
  serialize: (e, t) => Zt(e, t),
  ltextSites: (e) => Xt(e),
  board: {
    size: { width: 300, height: 48 },
    accent: _n,
    // The group's quests, one selectable row each: the Properties panel opens the one clicked.
    items: (e, { project: t, lang: n }) => jn(e, t, n),
    summary: (e, { lang: t }) => En(e, t)
  }
}, Qe = "quests:groups", Fe = "quests:quests", ra = "quests:active";
function oa(e) {
  return e.startsWith("msquests:") ? `quests:${e.slice(9)}` : e;
}
const Ge = {
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
}, Ue = { en: "Available", fr: "Disponible" };
function la(e, t, n) {
  const a = oa(t);
  if (a !== Qe && a !== Fe && a !== ra) return null;
  const s = e.documents?.[ee];
  if (!s || s.length === 0) return null;
  const i = e.defaultLang ?? "en", o = n?.serverRows, l = n?.params?.group || void 0, c = [...s].sort((u, m) => u.id < m.id ? -1 : u.id > m.id ? 1 : 0);
  if (a === Qe) {
    const u = qe(o, "key");
    return c.map((m) => ca(m, u.get(m.id), i));
  }
  if (a === Fe) {
    const u = qe(o, "id");
    return c.filter((m) => !l || m.id === l).flatMap((m) => m.quests.map((k) => kt(m, k, u.get(`${m.id}:${k.key}`), i)));
  }
  if (!o) return null;
  const p = new Map(s.map((u) => [u.id, u]));
  return o.flatMap((u) => {
    const m = p.get(P(u.group));
    if (!m) return [u];
    const k = m.quests.find((f) => f.key === P(u.quest_key));
    return k ? [ma(k, u, i)] : [];
  });
}
function ca(e, t, n) {
  const a = qe(ie(t?.quests), "key");
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
    quests: e.quests.map((s) => kt(e, s, a.get(s.key), n))
  };
}
function kt(e, t, n, a) {
  const s = e.tiers.find((i) => i.key === t.tier);
  return {
    id: `${e.id}:${t.key}`,
    group: e.id,
    key: t.key,
    name: t.title,
    description: t.description,
    duration: ya(t.duration),
    tier: t.tier,
    tier_name: s ? s.title : "",
    assigned: n?.assigned ?? !1,
    status_key: n?.status_key ?? "NOT_STARTED",
    status: n?.status ?? Ue[a.slice(0, 2)] ?? Ue.en,
    can_start: n?.can_start ?? !1,
    start_blocker: n?.start_blocker ?? "",
    start_blocker_label: n?.start_blocker_label ?? "",
    // `reference` in `QuestRows.questRow`: the attempt the server holds for this player.
    ...xt(t, n?.assigned === !0 ? n : void 0, a)
  };
}
function xt(e, t, n) {
  const a = t ? da(t) : void 0, s = ua(e, a, n), i = s.find((l) => l.active === !0), o = i ? i.objectives.find((l) => l.done !== !0) : void 0;
  return {
    objective_name: o?.name ?? "",
    objective_progress: o?.progress ?? 0,
    objective_target: o?.target ?? 0,
    progress_ratio: a ? wt(s.map((l) => l.progress_ratio)) : 0,
    stage_index: s.filter((l) => l.completed === !0).length,
    stage_name: i?.name ?? "",
    stage_flow: i?.flow ?? "",
    stages: s.map((l) => ({ ...l, objectives: l.objectives.map(({ done: c, ...p }) => p) }))
  };
}
function da(e) {
  const t = /* @__PURE__ */ new Map(), n = [
    ...ie(e.objectives),
    ...ie(e.stages).flatMap((a) => ie(a.objectives))
  ];
  for (const a of n) {
    const s = P(a.status_key);
    t.set(P(a.key), {
      progress: ke(a.progress, 0),
      flag: s === "COMPLETED" || s === "FAILED" ? s : "",
      row: a
    });
  }
  return t;
}
function ua(e, t, n) {
  const a = e.stages.map((i, o) => {
    const l = i.objectives.map((c) => pa(c, t?.get(c.key), n));
    return {
      key: i.key,
      name: i.title,
      flow: ga(i),
      index: o,
      // `QuestStage.isCompleted`: all objectives done, so an empty stage is.
      completed: t !== void 0 && l.every((c) => c.done),
      active: !1,
      progress_ratio: t ? wt(l.map((c) => c.progress_ratio)) : 0,
      objectives: l
    };
  });
  if (!t) return a;
  const s = a.find((i) => i.completed !== !0);
  if (s) {
    s.active = !0;
    const i = s.objectives, o = i.find((l) => l.done !== !0);
    for (const l of i)
      l.status_key === "PENDING" && (s.flow !== "SEQUENTIAL" || l === o) && (l.status_key = "IN_PROGRESS");
  }
  return a;
}
function pa(e, t, n) {
  const a = ha(e), s = t?.progress ?? 0, i = t?.row, o = i && i.type === e.type && i.target === a;
  return {
    key: e.key,
    name: o && typeof i.name == "string" ? i.name : fa(e, n),
    type: e.type,
    progress: s,
    target: a,
    // `AbstractQuestObjective`: done once the progress reaches the target, whatever the
    // stored flag says; the ratio is clamped, so a lowered target reads 1, not 1.4.
    progress_ratio: t ? a <= 0 ? 1 : Math.min(Math.max(s / a, 0), 1) : 0,
    completed: t !== void 0 && s >= a,
    status_key: t?.flag || "PENDING",
    done: t !== void 0 && s >= a
  };
}
function ma(e, t, n) {
  const a = xt(e, t, n), s = a.stages;
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
    objectives: s.flatMap((i) => i.objectives),
    stages: s
  };
}
function fa(e, t) {
  const a = (Ge[t.slice(0, 2)] ?? Ge.en)[e.type];
  if (!a) return e.type;
  const s = e.params, i = {
    amount: String(s.amount ?? ""),
    distance: String(s.distance ?? ""),
    command: P(s.command),
    value: P(s.value),
    // Bukkit's translation keys, as the objective configs write them (`<lang:…>`).
    crop: se("block", s.crop),
    entity_type: se("entity", s.entity_type),
    material: e.type === "block_break" ? se("block", s.material) : We(e),
    fish_type: We(e)
  };
  return a.replace(/%([a-z_]+)%/g, (o, l) => i[l] ?? "");
}
function se(e, t) {
  const n = P(t).toLowerCase().replace(/^minecraft:/, "");
  return n === "" ? "" : `<lang:${e}.minecraft.${n}>`;
}
function We(e) {
  const t = z(e.type)?.params.find((i) => i.kind === "item");
  if (!t) return "";
  const n = Ce(e.params, t), a = n.title;
  if (typeof a == "string" && a.trim() !== "") return a;
  const s = P(n.material);
  return /^(minecraft:)?[a-z_0-9]+$/i.test(s) && !s.includes(":") ? se("item", s) : s || dt(n);
}
function ha(e) {
  const t = ue(e.params);
  if (t === void 0) return 1;
  const n = Number(t);
  return Number.isFinite(n) ? n : 1;
}
function ga(e) {
  return e.flow === "" ? "PARALLEL" : e.flow.toUpperCase();
}
function ya(e) {
  const t = e.trim().toLowerCase().replace(/ /g, "");
  if (t === "") return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const n = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!n) return 0;
  const [, a, s, i, o] = n;
  return Number(a ?? 0) * 86400 + Number(s ?? 0) * 3600 + Number(i ?? 0) * 60 + Number(o ?? 0);
}
function qe(e, t) {
  return new Map((e ?? []).map((n) => [P(n[t]), n]));
}
function ie(e) {
  return Array.isArray(e) ? e.filter((t) => t && typeof t == "object") : [];
}
function wt(e) {
  return e.length === 0 ? 0 : e.reduce((t, n) => t + n, 0) / e.length;
}
function ke(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function P(e) {
  return typeof e == "string" ? e : "";
}
const va = {
  id: "msquests",
  displayName: "Quests",
  schemaVersion: "quest_group/v1",
  sdk: Kt,
  sidebar: { icon: () => null, label: "Quests", to: "/m/msquests" },
  // Quests are Documents: they are edited from the project, no screen of their own.
  routes: [],
  documents: [ia],
  // The quest sources previewed from the draft, joined to the player's state on the server.
  localPreviewRows: la,
  // The Quests tab of the server's Statistics space (SDK 1.23).
  stats: { label: { en: "Quests", fr: "Quêtes" }, component: fn }
}, xa = { ...va, sdk: "1.23.0" };
export {
  xa as default
};
