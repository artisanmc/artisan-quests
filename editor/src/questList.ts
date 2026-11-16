import { type T } from "./i18n";
import {
  KIND,
  type Objective,
  type Quest,
  type Raw,
  type Text,
  asMap,
  freeKey,
  newUid,
} from "./model";
import { missingParams, objectiveSubject, objectiveTarget } from "./objectives";
import { typeLabel } from "./questBoard";

/** What an objective asks, as the quest list reads it: `Break blocks · 64 × STONE`. */
export function objectiveSentence(t: T, o: Objective): string {
  const target = objectiveTarget(o.params);
  const subject = objectiveSubject(o.type, o.params);
  const amount = target !== undefined ? String(target) : "";
  const what = amount && subject ? `${amount} × ${subject}` : amount || subject;
  return what ? `${typeLabel(t, o.type)} · ${what}` : typeLabel(t, o.type);
}

/** Every objective of the quest, stage after stage. */
export function questObjectives(quest: Quest): Objective[] {
  return quest.stages.flatMap((stage) => stage.objectives);
}

/** Whether an objective of the quest misses a required field or shares its key with another. */
export function questIncomplete(quest: Quest): boolean {
  const objectives = questObjectives(quest);
  const keys = objectives.map((o) => o.key);
  return objectives.some(
    (o) => missingParams(o.type, o.params).length > 0 || keys.indexOf(o.key) !== keys.lastIndexOf(o.key),
  );
}

/** How many steps the quest's events run, all events together. */
export function questActionCount(quest: Quest): number {
  return Object.values(asMap(quest.rest.actions)).reduce<number>(
    (n, chain) => n + (Array.isArray(chain) ? chain.length : chain == null ? 0 : 1),
    0,
  );
}

/** A quest's `completed_when` as a list, whatever the file wrote (one condition or several). */
export function completedWhen(rest: Raw): unknown[] {
  const value = rest.completed_when;
  return Array.isArray(value) ? value : value ? [value] : [];
}

/**
 * The conditions in a few words when each is an expression (`guild_level >= 2`, as the file's
 * `{expression: …}` or a bare string), null when one is of another kind.
 */
export function conditionsText(conditions: unknown[]): string | null {
  const words = conditions.map((c) => {
    if (typeof c === "string") return c;
    const expression = c && typeof c === "object" ? (c as Raw).expression : undefined;
    return typeof expression === "string" ? expression : null;
  });
  return words.every((w) => w !== null) ? words.join(" · ") : null;
}

/**
 * A copy of `quest` for the same group: its own uid, a free key, and its own text nodes, so
 * editing the copy's title leaves the original's. `copyText` gives the new node of a text.
 */
export function duplicateQuest(
  quest: Quest,
  takenKeys: Iterable<string>,
  copyText: (from: Text) => Text,
): Quest {
  const copy = structuredClone(quest);
  copy.uid = newUid();
  copy.key = freeKey(`${quest.key}_copy`, takenKeys);
  copy.title = copyText(quest.title);
  copy.description = copyText(quest.description);
  for (const [i, stage] of copy.stages.entries()) stage.title = copyText(quest.stages[i]!.title);
  return copy;
}

const BUILT_IN_ACTORS = ["player", "global"];
/** Actor types of other plugins met since the editor opened: a choice left stays offered. */
const metActors = new Set<string>();

/**
 * Who may play a group. `declared` is the server's own list (`quests:actor_types`, with the
 * types other plugins registered): the group's current type joins it when the server does not
 * know it, so it stays readable. Without it (a server older than option lists), the two built-in
 * types and the ones the project's groups use or used.
 */
export function actorChoices(
  project: unknown,
  current: string,
  declared?: readonly string[],
): string[] {
  if (declared && declared.length > 0)
    return current && !declared.includes(current) ? [...declared, current] : [...declared];
  const groups = (project as { documents?: Record<string, unknown> } | undefined)?.documents?.[KIND];
  for (const g of Array.isArray(groups) ? groups : []) {
    const type = (g as { actorType?: unknown }).actorType;
    if (typeof type === "string" && type) metActors.add(type);
  }
  if (current) metActors.add(current);
  return [...BUILT_IN_ACTORS, ...[...metActors].filter((a) => !BUILT_IN_ACTORS.includes(a)).sort()];
}

/**
 * What an NPC says, as a quest writes it (`line`, `missing_line`, `giver.line`): a text, or one
 * per language. Read by language; a bare text answers `defaultLang`.
 */
export function lineValues(raw: unknown, defaultLang: string): Record<string, string> {
  if (typeof raw === "string") return raw === "" ? {} : { [defaultLang]: raw };
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [lang, text] of Object.entries(raw as Record<string, unknown>))
    if (typeof text === "string" && text !== "") out[lang] = text;
  return out;
}

/** The line with `lang` rewritten, as it is saved: one text per language, nothing when all are empty. */
export function withLine(
  raw: unknown,
  defaultLang: string,
  lang: string,
  value: string,
): Record<string, string> | undefined {
  const next = lineValues(raw, defaultLang);
  if (value === "") delete next[lang];
  else next[lang] = value;
  return Object.keys(next).length > 0 ? next : undefined;
}
