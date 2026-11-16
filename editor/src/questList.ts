import { type T } from "./i18n";
import { type Objective, type Quest, type Raw, type Text, asMap, freeKey, newUid } from "./model";
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

/** The conditions in a few words when each is an expression, null when one is not. */
export function conditionsText(conditions: unknown[]): string | null {
  return conditions.every((c) => typeof c === "string") ? conditions.join(" · ") : null;
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
