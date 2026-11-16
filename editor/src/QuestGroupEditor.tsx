import {
  ActionChainEditor,
  Button,
  ConditionsEditor,
  type DocumentEditorProps,
  ItemInput,
  LocalizedField,
  type ItemComparisonWire,
  MaterialInput,
  McText,
  MiniMessageInput,
  SortableList,
  type TextWrite,
  injectModuleStyles,
  mcWrap,
  newTextKey,
  projectLangs,
  selectDocumentItem,
  textValue,
  textValues,
  updateDocument,
  useContentLang,
  useProject,
  useUiLang,
} from "@artisan/editor-sdk";
import { type ReactElement, type ReactNode, useEffect, useRef, useState } from "react";
import {
  type ResetPreset,
  describeCron,
  isCronShape,
  nextCronRun,
  presetCron,
  readPreset,
  weekdays,
} from "./cron";
import { type T, useT } from "./i18n";
import {
  KIND,
  type Objective,
  type Quest,
  type QuestGroup,
  type Raw,
  type Stage,
  type Text,
  HOOKS,
  QUEST_HOOKS,
  asMap,
  freeKey,
  joinChain,
  legacyLabel,
  newObjectiveKey,
  newUid,
  slugKey,
  splitChain,
  typedKey,
} from "./model";
import {
  ENTITY_TYPES,
  itemValue,
  OBJECTIVE_TYPES,
  type ParamSpec,
  defaultParams,
  missingParams,
  objectiveSpec,
  objectiveSubject,
  objectiveTarget,
  writeItemParam,
} from "./objectives";
import { isOrdered, objectiveLine, plainText, typeLabel } from "./questBoard";
import {
  completedWhen,
  conditionsText,
  duplicateQuest,
  objectiveSentence,
  questActionCount,
  questIncomplete,
  questObjectives,
} from "./questList";
import { QUESTS_CSS } from "./styles";

const DURATION = /^(\d+|(\d+[dhms])+)$/;
const TRIGGERS = ["actor_load", "period_reset", "quest_complete"] as const;
const BROWSER_ZONE = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();

/** When the cron next fires, in the browser's clock: "Sun 19 Oct, 04:00". */
function nextRunLabel(cron: string, lang: string): string | null {
  const next = nextCronRun(cron, new Date());
  if (!next) return null;
  try {
    return new Intl.DateTimeFormat(lang, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(next);
  } catch {
    return next.toLocaleString();
  }
}

/** One edit of the group: a copy changed by `recipe`, committed with the texts it sets. */
type Edit = (recipe: (draft: QuestGroup) => void, texts?: TextWrite[]) => void;

interface Ctx {
  projectId: string;
  project: unknown;
  lang: string;
  t: T;
  edit: Edit;
}

/**
 * The page of a `quest_group`: its quests first, its rules folded in one card, then one quest
 * at a time (its stages and objectives, what the player sees beside). The open quest is the
 * Document's selected part, so the editor's own navigation leads back to the group.
 */
export function QuestGroupEditor({ projectId, documentId, document, item }: DocumentEditorProps) {
  injectModuleStyles("msquests", QUESTS_CSS);
  const group = document as QuestGroup;
  const project = useProject(projectId);
  const lang = useContentLang();
  const t = useT();
  // The open quest follows the selection: a quest picked elsewhere (search, a board row) opens
  // here, and opening or leaving one here selects it or the group.
  const [openUid, setOpenUid] = useState<string | null>(item ?? null);
  useEffect(() => {
    setOpenUid(item ?? null);
  }, [item]);
  const open = (uid: string | null) => {
    setOpenUid(uid);
    selectDocumentItem({ documentId, item: uid });
  };

  const edit: Edit = (recipe, texts) => {
    const next = structuredClone(group) as QuestGroup;
    recipe(next);
    updateDocument({ projectId, kind: KIND, id: documentId, doc: next, texts });
  };
  const ctx: Ctx = { projectId, project, lang, t, edit };

  const index = openUid ? group.quests.findIndex((q) => q.uid === openUid) : -1;
  return (
    <div className="aq">
      {index >= 0 ? (
        <QuestView key={openUid} ctx={ctx} group={group} index={index} onLeave={() => open(null)} />
      ) : (
        <GroupView ctx={ctx} group={group} onOpen={open} />
      )}
    </div>
  );
}

// ------------------------------------------------------------------ small parts

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`aq-chevron${open ? " is-open" : ""}`}
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

function Dots() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="3" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="13" cy="8" r="1.5" />
    </svg>
  );
}

function Chip({ tone, children }: { tone?: "ok" | "warn"; children: ReactNode }) {
  return <span className={`aq-chip${tone ? ` is-${tone}` : ""}`}>{children}</span>;
}

/** One choice among a few, all visible: the buttons of a radio group. */
function Seg<V extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: V | "";
  options: readonly { value: V; label: string }[];
  onChange: (value: V) => void;
}) {
  return (
    <div className="aq-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={`aq-opt${value === o.value ? " is-on" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  children,
  hint,
  title,
}: { label: string; children: ReactNode; hint?: ReactNode; title?: string }) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the control is the child
    <label className="aq-field" title={title}>
      <span className="field-label">{label}</span>
      {children}
      {hint}
    </label>
  );
}

/**
 * A translatable text, the way Artisan edits every one (`LocalizedField`): the content
 * language's text, the default language's as a placeholder when it has none, and the
 * translations toggle unfolding every language in place.
 */
function TextField({
  ctx,
  label,
  node,
  multiline,
  rows,
  bare,
  placeholder,
}: {
  ctx: Ctx;
  label: string;
  node: Text;
  multiline?: boolean;
  rows?: number;
  /** No label row: the text is written where it reads (a quest's title, a stage's). */
  bare?: boolean;
  placeholder?: string;
}) {
  const langs = projectLangs(ctx.project);
  return (
    <LocalizedField
      className="aq-field"
      label={label}
      langs={langs}
      activeLang={ctx.lang}
      defaultLang={langs[0] ?? ctx.lang}
      values={textValues(ctx.project, node.key)}
      onChange={(lang, value) => ctx.edit(() => {}, [{ key: node.key, lang, value }])}
      inline={bare}
      renderEditor={(e) => (
        <MiniMessageInput
          value={e.value}
          onChange={e.onChange}
          placeholder={e.fallback ?? placeholder}
          multiline={multiline}
          rows={multiline ? rows : undefined}
          aria-label={e.label}
        />
      )}
    />
  );
}

function asNumber(value: unknown): string {
  return typeof value === "number" ? String(value) : typeof value === "string" ? value : "";
}

/** A whole number written into `map[key]`; cleared, the key leaves the map. */
function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: unknown;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <input
        className="input"
        type="number"
        min={0}
        step={1}
        value={asNumber(value)}
        placeholder={placeholder}
        onChange={(e) => {
          const raw = e.target.value.trim();
          onChange(raw === "" ? undefined : Math.max(0, Math.trunc(Number(raw))));
        }}
      />
    </Field>
  );
}

/** Whether the group hands quests out by itself: it names a strategy other than `none`. */
function givesAlone(distribution: Raw): boolean {
  const strategy = strategyOf(distribution);
  return strategy !== "" && strategy !== "none";
}

function strategyOf(distribution: Raw): string {
  return typeof distribution.strategy === "string" ? distribution.strategy.toLowerCase() : "";
}

function setOrDelete(map: Raw, key: string, value: unknown) {
  if (value === undefined || value === "") delete map[key];
  else map[key] = value;
}

function move<X>(list: X[], from: number, to: number) {
  if (to < 0 || to >= list.length) return;
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item!);
}

function IconButton({
  label,
  onClick,
  disabled,
  expanded,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  expanded?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="aq-icon-btn"
      title={label}
      aria-label={label}
      aria-expanded={expanded}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/**
 * Removes something that holds work (a quest, a stage with objectives): the first click asks,
 * the second removes. Something empty goes at once (`sure`).
 */
function RemoveButton({
  t,
  label,
  sure,
  onRemove,
}: { t: T; label: string; sure?: boolean; onRemove: () => void }) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <IconButton label={label} onClick={() => (sure ? onRemove() : setAsking(true))}>
        ×
      </IconButton>
    );
  }
  return (
    <span className="aq-confirm">
      <Button size="sm" variant="ghost" onClick={() => setAsking(false)}>
        {t("cancel")}
      </Button>
      <button type="button" className="aq-danger" onClick={onRemove}>
        {t("remove")}
      </button>
    </span>
  );
}

/** The "⋯" of a row: a few actions in a small menu, closed by a click outside or Escape. */
function RowMenu({
  label,
  children,
}: { label: string; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // The page's own Escape (back to the collection) must not fire for a menu closing.
      e.preventDefault();
      setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open]);
  return (
    <div className="aq-menu-anchor" ref={ref}>
      <IconButton label={label} expanded={open} onClick={() => setOpen(!open)}>
        <Dots />
      </IconButton>
      {open && (
        <div className="aq-menu" role="menu">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

/**
 * Row ids for a SortableList: a row's own key, suffixed by its index only when an earlier
 * row already holds that key (a hand-written file may repeat one).
 */
function rowIds(keys: string[]): string[] {
  const seen = new Set<string>();
  return keys.map((key, i) => {
    const id = seen.has(key) ? `${key}#${i}` : key;
    seen.add(key);
    return id;
  });
}

// ------------------------------------------------------------------ group

function GroupView({
  ctx,
  group,
  onOpen,
}: { ctx: Ctx; group: QuestGroup; onOpen: (uid: string) => void }) {
  const { t, edit, project, lang } = ctx;
  // A group without quests is being set up: its rules come first.
  const [settingsOpen, setSettingsOpen] = useState(group.quests.length === 0);
  const [removing, setRemoving] = useState<string | null>(null);
  const ordered = isOrdered(group);
  const kept = Object.keys(group.rest).filter((k) => k !== "actions");

  const addQuest = () => {
    const titleKey = newTextKey();
    const uid = newUid();
    edit(
      (g) => {
        g.quests.push({
          key: freeKey(
            "quest",
            g.quests.map((q) => q.key),
          ),
          uid,
          tier: "",
          title: { key: titleKey },
          description: { key: newTextKey() },
          duration: "",
          stages: [newStage(1)],
          rest: {},
        });
      },
      [{ key: titleKey, lang, value: t("newQuestTitle") }],
    );
    onOpen(uid);
  };

  const duplicate = (i: number) => {
    const texts: TextWrite[] = [];
    // The copy's texts are its own nodes, filled with the original's in every language.
    const copyText = (from: Text): Text => {
      const key = newTextKey();
      for (const [l, value] of Object.entries(textValues(project, from.key)))
        if (value !== "") texts.push({ key, lang: l, value });
      return { key };
    };
    edit((g) => {
      g.quests.splice(
        i + 1,
        0,
        duplicateQuest(
          g.quests[i]!,
          g.quests.map((q) => q.key),
          copyText,
        ),
      );
    }, texts);
  };

  return (
    <>
      <section className="aq-card">
        <button
          type="button"
          className="aq-fold-head"
          aria-expanded={settingsOpen}
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <Chevron open={settingsOpen} />
          <span className="aq-h">{t("groupSettings")}</span>
          {!settingsOpen && <GroupChips ctx={ctx} group={group} />}
        </button>
        {settingsOpen && <GroupSettings ctx={ctx} group={group} />}
      </section>

      <section className="aq-card">
        <div className="aq-card-head">
          <span className="aq-h">{t("quests")}</span>
          <span className="aq-count">{group.quests.length}</span>
          <span className="aq-grow" />
          <Button size="sm" variant="primary" onClick={addQuest}>
            + {t("addQuest")}
          </Button>
        </div>
        {group.quests.length === 0 && <div className="aq-empty">{t("noQuests")}</div>}
        <SortableList
          ids={group.quests.map((q) => q.uid)}
          onMove={(from, to) => edit((g) => move(g.quests, from, to))}
          className="aq-quests"
          itemClassName="aq-quest"
        >
          {(i, handle) => {
            const q = group.quests[i]!;
            const title = plainText(textValue(project, q.title.key, lang)) || q.key;
            const objectives = questObjectives(q);
            const conditions = completedWhen(q.rest);
            const tier = group.tiers.find((x) => x.key === q.tier);
            const actions = questActionCount(q);
            return (
              <>
                {handle}
                {ordered && <span className="aq-n">{i + 1}</span>}
                <button type="button" className="aq-quest-main" onClick={() => onOpen(q.uid)}>
                  <span className="aq-quest-title">{title}</span>
                  <span className="aq-quest-sub">
                    {objectives.length === 0
                      ? t("noObjectivesShort")
                      : objectives.map((o) => objectiveSentence(t, o)).join("  ·  ")}
                  </span>
                </button>
                {removing === q.uid ? (
                  <span className="aq-confirm">
                    <span>{t("removeConfirm", { name: title })}</span>
                    <Button size="sm" variant="ghost" onClick={() => setRemoving(null)}>
                      {t("cancel")}
                    </Button>
                    <button
                      type="button"
                      className="aq-danger"
                      onClick={() => {
                        setRemoving(null);
                        edit((g) => {
                          g.quests.splice(i, 1);
                        });
                      }}
                    >
                      {t("remove")}
                    </button>
                  </span>
                ) : (
                  <>
                    <span className="aq-chips">
                      {questIncomplete(q) && <Chip tone="warn">{t("toComplete")}</Chip>}
                      {ordered && conditions.length > 0 && (
                        <Chip tone="ok">
                          {t("completedWhen")}{" "}
                          {conditionsText(conditions) !== null ? (
                            <span className="aq-mono">{conditionsText(conditions)}</span>
                          ) : (
                            t("conditionCount", { count: conditions.length })
                          )}
                        </Chip>
                      )}
                      {q.tier && (
                        <Chip>
                          {(tier && plainText(textValue(project, tier.title.key, lang))) || q.tier}
                        </Chip>
                      )}
                      {q.duration && <Chip>{q.duration}</Chip>}
                      {actions > 0 && (
                        <Chip>
                          {actions === 1 ? t("actionCountOne") : t("actionCount", { count: actions })}
                        </Chip>
                      )}
                    </span>
                    <RowMenu label={t("moreActions")}>
                      {(close) => (
                        <>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              close();
                              duplicate(i);
                            }}
                          >
                            {t("duplicate")}
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="is-danger"
                            onClick={() => {
                              close();
                              setRemoving(q.uid);
                            }}
                          >
                            {t("remove")}…
                          </button>
                        </>
                      )}
                    </RowMenu>
                  </>
                )}
              </>
            );
          }}
        </SortableList>
        {kept.length > 0 && (
          <div className="aq-empty">{t("kept", { fields: kept.join(", ") })}</div>
        )}
      </section>
    </>
  );
}

function actorLabel(t: T, actorType: string): string {
  return actorType === "player" || actorType === "global" || actorType === "guild"
    ? t(`actor.${actorType}`)
    : actorType;
}

const BUILT_IN_ACTORS = ["player", "global"];
/** Actor types of other plugins met since the editor opened: a choice left stays offered. */
const metActors = new Set<string>();

/**
 * Who may play a group: the two built-in types, then the types other plugins add (`guild`)
 * that the project's groups use or used. The editor cannot ask the server for its registry.
 */
export function actorChoices(project: unknown, current: string): string[] {
  const groups = (project as { documents?: Record<string, unknown> } | undefined)?.documents?.[KIND];
  for (const g of Array.isArray(groups) ? groups : []) {
    const type = (g as { actorType?: unknown }).actorType;
    if (typeof type === "string" && type) metActors.add(type);
  }
  if (current) metActors.add(current);
  return [...BUILT_IN_ACTORS, ...[...metActors].filter((a) => !BUILT_IN_ACTORS.includes(a)).sort()];
}

/** The three ways a group hands its quests out; `sequential` and `ladder` are both "in order". */
function strategyChoice(distribution: Raw): "" | "none" | "ordered" | "random" {
  const strategy = strategyOf(distribution);
  if (strategy === "sequential" || strategy === "ladder") return "ordered";
  return strategy === "none" || strategy === "random" ? strategy : "";
}

/** The folded settings said in a few chips: who plays, how quests come, when they reset. */
function GroupChips({ ctx, group }: { ctx: Ctx; group: QuestGroup }) {
  const { t } = ctx;
  const uiLang = useUiLang();
  const cron = typeof group.reset.cron === "string" ? group.reset.cron : "";
  const choice = strategyChoice(group.distribution);
  const events = Object.keys(asMap(group.rest.actions)).length;
  const words = cron ? (describeCron(cron, uiLang) ?? cron) : t("noReset");
  return (
    <span className="aq-chips">
      <Chip>{actorLabel(t, group.actorType)}</Chip>
      {choice && <Chip>{t(`strategy.${choice}`)}</Chip>}
      <Chip>{words.charAt(0).toUpperCase() + words.slice(1)}</Chip>
      {group.tiers.length > 0 && <Chip>{t("tierCount", { count: group.tiers.length })}</Chip>}
      {events > 0 && <Chip>{t("eventCount", { count: events })}</Chip>}
    </span>
  );
}

function GroupSettings({ ctx, group }: { ctx: Ctx; group: QuestGroup }) {
  const { t, edit, project, lang } = ctx;
  const choice = strategyChoice(group.distribution);
  const ordered = choice === "ordered";
  const triggers = Array.isArray(group.distribution.triggers)
    ? (group.distribution.triggers as string[])
    : [];
  const perTier = (group.distribution.tiers ?? {}) as Record<string, unknown>;
  const actors = actorChoices(project, group.actorType);

  return (
    <div className="aq-settings">
      <div className="aq-block">
        <span className="aq-eyebrow">{t("identity")}</span>
        <TextField ctx={ctx} label={t("title")} node={group.title} />
        <TextField ctx={ctx} label={t("description")} node={group.description} multiline />
        <div className="aq-field">
          <span className="field-label">{t("actorType")}</span>
          <Seg
            label={t("actorType")}
            value={group.actorType}
            options={actors.map((a) => ({ value: a, label: actorLabel(t, a) }))}
            onChange={(a) =>
              edit((g) => {
                g.actorType = a;
              })
            }
          />
        </div>
      </div>

      <div className="aq-block">
        <span className="aq-eyebrow">{t("distribution")}</span>
        <div className="aq-field">
          <span className="field-label">{t("strategy")}</span>
          <Seg
            label={t("strategy")}
            value={choice}
            options={(["none", "ordered", "random"] as const).map((s) => ({
              value: s,
              label: t(`strategy.${s}`),
            }))}
            onChange={(s) =>
              edit((g) => {
                // A group already in order keeps the name its file wrote.
                if (s === "ordered" && strategyChoice(g.distribution) === "ordered") return;
                g.distribution.strategy = s === "ordered" ? "sequential" : s;
              })
            }
          />
        </div>
        {!ordered && (
          <>
            <div className="aq-row">
              <NumberField
                label={t("amount")}
                value={group.distribution.amount}
                onChange={(v) => edit((g) => setOrDelete(g.distribution, "amount", v))}
              />
              <NumberField
                label={t("maxActive")}
                value={group.limits.max_active}
                onChange={(v) => edit((g) => setOrDelete(g.limits, "max_active", v))}
              />
            </div>
            <div className="aq-field">
              <span className="field-label">{t("triggers")}</span>
              {TRIGGERS.map((trigger) => (
                <label key={trigger} className="aq-check">
                  <input
                    type="checkbox"
                    checked={triggers.includes(trigger)}
                    onChange={(e) =>
                      edit((g) => {
                        const list = (
                          Array.isArray(g.distribution.triggers) ? g.distribution.triggers : []
                        ) as string[];
                        const next = e.target.checked
                          ? [...list, trigger]
                          : list.filter((x) => x !== trigger);
                        setOrDelete(g.distribution, "triggers", next.length ? next : undefined);
                      })
                    }
                  />
                  {t(`trigger.${trigger}`)}
                </label>
              ))}
            </div>
          </>
        )}
        <NumberField
          label={t("questsPerPeriod")}
          placeholder={t("noLimit")}
          value={group.limits.max_per_period}
          onChange={(v) => edit((g) => setOrDelete(g.limits, "max_per_period", v))}
        />
        {!ordered && (
          <div className="aq-row">
            <label className="aq-check">
              <input
                type="checkbox"
                checked={group.rotation.enabled === true}
                onChange={(e) =>
                  edit((g) => setOrDelete(g.rotation, "enabled", e.target.checked ? true : undefined))
                }
              />
              {t("rotationEnabled")}
            </label>
            {group.rotation.enabled === true ? (
              <NumberField
                label={t("rotationsPerPeriod")}
                placeholder={t("noLimit")}
                value={group.rotation.max_per_period}
                onChange={(v) => edit((g) => setOrDelete(g.rotation, "max_per_period", v))}
              />
            ) : null}
          </div>
        )}
      </div>

      <div className="aq-block">
        <span className="aq-eyebrow">{t("reset")}</span>
        <ResetField ctx={ctx} group={group} />
      </div>

      <div className="aq-block">
        <div className="aq-block-head">
          <span className="aq-eyebrow">{t("tiers")}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              edit((g) => {
                g.tiers.push({
                  key: freeKey(
                    "tier",
                    g.tiers.map((x) => x.key),
                  ),
                  title: { key: newTextKey() },
                  rest: {},
                });
              })
            }
          >
            + {t("addTier")}
          </Button>
        </div>
        {group.tiers.map((tier, i) => (
          <div key={tier.key} className="aq-tier">
            <TextField ctx={ctx} label={t("title")} node={tier.title} />
            <Field label={t("tierKey")}>
              <input
                className="input aq-mono"
                defaultValue={tier.key}
                onBlur={(e) => {
                  const next = slugKey(e.target.value);
                  if (next === tier.key) return;
                  edit((g) => {
                    const key = freeKey(
                      next,
                      g.tiers.map((x) => x.key),
                    );
                    g.tiers[i]!.key = key;
                    for (const q of g.quests) if (q.tier === tier.key) q.tier = key;
                    const map = g.distribution.tiers as Raw | undefined;
                    if (map && tier.key in map) {
                      map[key] = map[tier.key];
                      delete map[tier.key];
                    }
                  });
                }}
              />
            </Field>
            {!ordered && (
              <NumberField
                label={t("perTier")}
                value={perTier[tier.key]}
                onChange={(v) =>
                  edit((g) => {
                    const map = { ...((g.distribution.tiers ?? {}) as Raw) };
                    setOrDelete(map, tier.key, v);
                    setOrDelete(g.distribution, "tiers", Object.keys(map).length ? map : undefined);
                  })
                }
              />
            )}
            <RemoveButton
              t={t}
              label={t("remove")}
              sure={!group.quests.some((q) => q.tier === tier.key)}
              onRemove={() =>
                edit((g) => {
                  g.tiers.splice(i, 1);
                })
              }
            />
          </div>
        ))}
        {group.tiers.length === 0 && <span className="aq-mut">{t("noTier")}</span>}
      </div>

      <div className="aq-block is-wide">
        <EventsSection
          key={group.uid}
          ctx={ctx}
          title={t("hooks")}
          hooks={HOOKS}
          label={(hook) => t(`hook.${hook}`)}
          value={group.rest.actions}
          onChange={(hook, next) =>
            edit((g) => {
              const map = { ...asMap(g.rest.actions) };
              setOrDelete(map, hook, next);
              setOrDelete(g.rest, "actions", Object.keys(map).length ? map : undefined);
            })
          }
        />
      </div>
    </div>
  );
}

/**
 * When the period resets: never, every day, week or month at a time, or a cron written by
 * hand. The file only ever holds the cron; a preset is the cron it writes.
 */
function ResetField({ ctx, group }: { ctx: Ctx; group: QuestGroup }) {
  const { t, edit } = ctx;
  const uiLang = useUiLang();
  const cron = typeof group.reset.cron === "string" ? group.reset.cron : "";
  const read = readPreset(cron);
  // "Cron…" picked on an expression a preset also says: stays in hand-written mode.
  const [byHand, setByHand] = useState(false);
  const preset: ResetPreset = byHand && cron !== "" ? { kind: "custom" } : read;
  const timezone = typeof group.reset.timezone === "string" ? group.reset.timezone : "";
  const nextRun = cron && isCronShape(cron) ? nextRunLabel(cron, uiLang) : null;
  const write = (next: ResetPreset) => {
    const value = presetCron(next);
    if (value !== null) edit((g) => setOrDelete(g.reset, "cron", value));
  };
  const time = "time" in preset ? preset.time : "04:00";
  const pick = (kind: ResetPreset["kind"]) => {
    setByHand(kind === "custom");
    if (kind === "never") write({ kind });
    else if (kind === "daily") write({ kind, time });
    else if (kind === "weekly") write({ kind, time, day: 1 });
    else if (kind === "monthly") write({ kind, time, day: 1 });
    else if (cron === "") edit((g) => setOrDelete(g.reset, "cron", "0 4 * * *"));
  };

  return (
    <>
      <Seg
        label={t("reset")}
        value={preset.kind}
        options={(["never", "daily", "weekly", "monthly", "custom"] as const).map((kind) => ({
          value: kind,
          label: t(`reset.${kind}`),
        }))}
        onChange={pick}
      />
      {preset.kind !== "never" && (
        <div className="aq-row aq-reset">
          {preset.kind === "weekly" && (
            <Field label={t("resetDay")}>
              <select
                className="select"
                value={preset.day}
                onChange={(e) => write({ ...preset, day: Number(e.target.value) })}
              >
                {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                  <option key={d} value={d}>
                    {weekdays(uiLang)[d]}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {preset.kind === "monthly" && (
            <NumberField
              label={t("resetDayOfMonth")}
              value={preset.day}
              onChange={(v) => write({ ...preset, day: v ?? 1 })}
            />
          )}
          {preset.kind === "custom" ? (
            <Field
              label={t("cron")}
              hint={
                isCronShape(cron) ? undefined : <span className="aq-err">{t("cronInvalid")}</span>
              }
            >
              <input
                className="input aq-mono"
                value={cron}
                placeholder="0 4 * * *"
                onChange={(e) => edit((g) => setOrDelete(g.reset, "cron", e.target.value))}
              />
            </Field>
          ) : (
            <Field label={t("resetTime")}>
              <input
                className="input"
                type="time"
                value={preset.time}
                onChange={(e) => e.target.value && write({ ...preset, time: e.target.value })}
              />
            </Field>
          )}
        </div>
      )}
      {/* A zone written in the file (the editor does not set one) still applies. */}
      {cron && isCronShape(cron) && (timezone || nextRun) && (
        <span className="aq-ok">
          {timezone && timezone !== BROWSER_ZONE ? timezone : nextRun ? t("nextRun", { when: nextRun }) : ""}
        </span>
      )}
    </>
  );
}

// ------------------------------------------------------------------ chains

/**
 * An action chain of the group (a hook, a quest's rewards) in the editor's chain editor.
 * Steps still in the MSQuests format stay apart, listed as they are (see `splitChain`).
 */
function ChainField({
  ctx,
  value,
  onChange,
}: { ctx: Ctx; value: unknown; onChange: (next: unknown[] | undefined) => void }) {
  const { chain, legacy } = splitChain(value);
  return (
    <div className="aq-chain">
      <ActionChainEditor
        projectId={ctx.projectId}
        value={chain}
        onChange={(next) => onChange(joinChain(next, legacy))}
      />
      {legacy.length > 0 && (
        <div className="aq-legacy" title={ctx.t("legacySteps")}>
          {legacy.map((step, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: a step has no identity
            <div key={i} className="aq-legacy-row">
              <code>{legacyLabel(step)}</code>
              <IconButton
                label={ctx.t("remove")}
                onClick={() => onChange(joinChain(chain, legacy.filter((_, j) => j !== i)))}
              >
                ×
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The events of a group or a quest: only those with actions (or just added) are listed, each a
 * line that unfolds its chain; a select adds one of the others, which then leaves the select.
 */
function EventsSection<H extends string>({
  ctx,
  title,
  hooks,
  label,
  value,
  onChange,
}: {
  ctx: Ctx;
  title: string;
  hooks: readonly H[];
  label: (hook: H) => string;
  value: unknown;
  onChange: (hook: H, next: unknown[] | undefined) => void;
}) {
  const { t } = ctx;
  const map = asMap(value);
  // Added but still without actions: kept on screen, absent from the file until a step is added.
  const [added, setAdded] = useState<H[]>([]);
  const [openHook, setOpenHook] = useState<H | null>(null);
  const shown = hooks.filter((hook) => map[hook] != null || added.includes(hook));
  const free = hooks.filter((hook) => !shown.includes(hook));
  return (
    <>
      <div className="aq-block-head">
        <span className="aq-eyebrow">{title}</span>
        {free.length > 0 && (
          <select
            className="select aq-event-add"
            aria-label={t("addEvent")}
            value=""
            onChange={(e) => {
              const hook = free.find((h) => h === e.target.value);
              if (!hook) return;
              setAdded((list) => [...list, hook]);
              setOpenHook(hook);
            }}
          >
            <option value="">+ {t("addEvent")}</option>
            {free.map((hook) => (
              <option key={hook} value={hook}>
                {label(hook)}
              </option>
            ))}
          </select>
        )}
      </div>
      {shown.map((hook) => {
        const open = openHook === hook;
        const steps = Array.isArray(map[hook]) ? (map[hook] as unknown[]).length : map[hook] ? 1 : 0;
        return (
          <div key={hook} className={`aq-line${open ? " is-open" : ""}`}>
            <div className="aq-line-head">
              <button
                type="button"
                className="aq-line-main"
                aria-expanded={open}
                onClick={() => setOpenHook(open ? null : hook)}
              >
                <Chevron open={open} />
                <span className="aq-line-text">{label(hook)}</span>
                {steps > 0 && (
                  <Chip>{steps === 1 ? t("actionCountOne") : t("actionCount", { count: steps })}</Chip>
                )}
              </button>
              <RemoveButton
                t={t}
                label={t("removeEvent")}
                sure={steps === 0}
                onRemove={() => {
                  setAdded((list) => list.filter((h) => h !== hook));
                  onChange(hook, undefined);
                }}
              />
            </div>
            {open && (
              <div className="aq-line-body">
                <ChainField ctx={ctx} value={map[hook]} onChange={(next) => onChange(hook, next)} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// ------------------------------------------------------------------ quest

function newStage(n: number): Stage {
  // `flow` written: a stage without it had no active objective before QuestStage read it as parallel.
  return {
    key: `stage_${n}`,
    title: { key: newTextKey() },
    flow: "parallel",
    objectives: [],
    rest: {},
  };
}

function QuestView({
  ctx,
  group,
  index,
  onLeave,
}: { ctx: Ctx; group: QuestGroup; index: number; onLeave: () => void }) {
  const { t, edit, project, lang } = ctx;
  const quest = group.quests[index]!;
  const editQuest = (recipe: (q: Quest) => void, texts?: TextWrite[]) =>
    edit((g) => recipe(g.quests[index]!), texts);
  const keyTaken = group.quests.some((q, i) => i !== index && q.key === quest.key);
  const durationBad =
    quest.duration !== "" && !DURATION.test(quest.duration.replace(/\s/g, "").toLowerCase());
  const kept = Object.keys(quest.rest).filter(
    (k) => k !== "actions" && k !== "giver" && k !== "completed_when",
  );
  // In an ordered group, the current quest is the first one not done: each may say when it is.
  const ordered = isOrdered(group);
  const giver = (
    quest.rest.giver && typeof quest.rest.giver === "object" ? quest.rest.giver : {}
  ) as Raw;
  const setGiver = (field: "npc" | "conversation", value: string) =>
    editQuest((q) => {
      const next = { ...giver };
      setOrDelete(next, field, value.trim());
      if (typeof next.npc === "string" && next.npc !== "") q.rest.giver = next;
      else delete q.rest.giver;
    });
  const giverNpc = typeof giver.npc === "string" ? giver.npc : "";
  const distributed = givesAlone(group.distribution);
  const tier = group.tiers.find((x) => x.key === quest.tier);
  // A problem in the settings shows them: the fold never hides an error.
  const [settingsOpen, setSettingsOpen] = useState(false);
  const showSettings = settingsOpen || keyTaken || durationBad;
  // Escape leaves the quest for its group, as the breadcrumb's group level does; the page's own
  // Escape (back to the collection) then applies from the group.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (window.document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]')) return;
      e.preventDefault();
      onLeave();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onLeave]);

  return (
    <div className="aq-quest-page">
      <div className="aq-quest-col">
        <section className="aq-card">
          <div className="aq-quest-head">
            <div className="aq-quest-name">
              <TextField ctx={ctx} bare label={t("title")} node={quest.title} placeholder={t("title")} />
            </div>
            <div className="aq-quest-desc">
              <TextField
                ctx={ctx}
                bare
                multiline
                rows={2}
                label={t("description")}
                node={quest.description}
                placeholder={t("description")}
              />
            </div>
          </div>
          <button
            type="button"
            className="aq-fold-head is-inner"
            aria-expanded={showSettings}
            onClick={() => setSettingsOpen(!showSettings)}
          >
            <Chevron open={showSettings} />
            <span className="aq-fold-title">{t("questSettings")}</span>
            {!showSettings && (
              <span className="aq-chips">
                {quest.tier && (
                  <Chip>
                    {(tier && plainText(textValue(project, tier.title.key, lang))) || quest.tier}
                  </Chip>
                )}
                <Chip>{quest.duration || t("noTimeLimit")}</Chip>
                {giverNpc && <Chip>{t("givenBy", { npc: giverNpc })}</Chip>}
                <Chip>
                  <span className="aq-mono">{quest.key}</span>
                </Chip>
              </span>
            )}
          </button>
          {showSettings && (
            <div className="aq-fold-body">
              <div className="aq-row aq-top aq-wrap">
                {group.tiers.length > 0 || quest.tier ? (
                  <Field label={t("tier")}>
                    <select
                      className="select"
                      value={quest.tier}
                      onChange={(e) =>
                        editQuest((q) => {
                          q.tier = e.target.value;
                        })
                      }
                    >
                      <option value="">{t("noTier")}</option>
                      {group.tiers.map((x) => (
                        <option key={x.key} value={x.key}>
                          {plainText(textValue(project, x.title.key, lang)) || x.key}
                        </option>
                      ))}
                      {quest.tier && !tier && <option value={quest.tier}>{quest.tier}</option>}
                    </select>
                  </Field>
                ) : null}
                <Field
                  label={t("duration")}
                  hint={durationBad ? <span className="aq-err">{t("durationInvalid")}</span> : undefined}
                >
                  <input
                    className="input"
                    value={quest.duration}
                    placeholder="24h"
                    onChange={(e) =>
                      editQuest((q) => {
                        q.duration = e.target.value.trim();
                      })
                    }
                  />
                </Field>
                <Field
                  label={t("key")}
                  hint={keyTaken ? <span className="aq-err">{t("keyTaken")}</span> : undefined}
                >
                  <input
                    className="input aq-mono"
                    value={quest.key}
                    onChange={(e) =>
                      editQuest((q) => {
                        q.key = typedKey(e.target.value);
                      })
                    }
                    onBlur={() => {
                      const final = slugKey(quest.key);
                      if (final !== quest.key)
                        editQuest((q) => {
                          q.key = final;
                        });
                    }}
                  />
                </Field>
              </div>
              <div className="aq-row aq-top aq-wrap">
                <Field label={t("giverNpc")}>
                  <input
                    className="input aq-mono"
                    value={giverNpc}
                    onChange={(e) => setGiver("npc", e.target.value)}
                  />
                </Field>
                {giverNpc && (
                  <Field label={t("giverConversation")}>
                    <input
                      className="input aq-mono"
                      value={typeof giver.conversation === "string" ? giver.conversation : ""}
                      onChange={(e) => setGiver("conversation", e.target.value)}
                    />
                  </Field>
                )}
              </div>
              {giverNpc && distributed && <span className="aq-warn">{t("giverDistributed")}</span>}
            </div>
          )}
        </section>

        <SortableList
          ids={rowIds(quest.stages.map((s) => s.key))}
          onMove={(from, to) => editQuest((q) => move(q.stages, from, to))}
          className="aq-stages"
        >
          {(si, handle) => (
            <StageCard
              ctx={ctx}
              quest={quest}
              stage={quest.stages[si]!}
              si={si}
              handle={handle}
              editQuest={editQuest}
            />
          )}
        </SortableList>
        <Button
          size="sm"
          variant="ghost"
          className="aq-add"
          onClick={() =>
            editQuest((q) => {
              const key = freeKey(
                `stage_${q.stages.length + 1}`,
                q.stages.map((s) => s.key),
              );
              q.stages.push({ ...newStage(q.stages.length + 1), key });
            })
          }
        >
          + {t("addStage")}
        </Button>

        {ordered && (
          <section className="aq-card aq-pad">
            <span className="aq-h">{t("completedWhen")}</span>
            <ConditionsEditor
              key={quest.uid}
              projectId={ctx.projectId}
              value={completedWhen(quest.rest)}
              emptyHint={t("completedWhenEmpty")}
              onChange={(next) =>
                editQuest((q) => setOrDelete(q.rest, "completed_when", next.length > 0 ? next : undefined))
              }
            />
          </section>
        )}

        <section className="aq-card aq-pad">
          <EventsSection
            key={quest.uid}
            ctx={ctx}
            title={t("questEvents")}
            hooks={QUEST_HOOKS}
            label={(hook) => t(`questHook.${hook}`)}
            value={quest.rest.actions}
            onChange={(hook, next) =>
              editQuest((q) => {
                const actions = { ...asMap(q.rest.actions) };
                setOrDelete(actions, hook, next);
                setOrDelete(q.rest, "actions", Object.keys(actions).length > 0 ? actions : undefined);
              })
            }
          />
          {kept.length > 0 && <span className="aq-mut">{t("kept", { fields: kept.join(", ") })}</span>}
        </section>
      </div>

      <aside className="aq-card aq-pad aq-aside">
        <span className="aq-eyebrow">{t("preview")}</span>
        <Preview ctx={ctx} quest={quest} />
      </aside>
    </div>
  );
}

function StageCard({
  ctx,
  quest,
  stage,
  si,
  handle,
  editQuest,
}: {
  ctx: Ctx;
  quest: Quest;
  stage: Stage;
  si: number;
  handle: ReactElement;
  editQuest: (recipe: (q: Quest) => void, texts?: TextWrite[]) => void;
}) {
  const { t } = ctx;
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const editStage = (recipe: (s: Stage) => void) => editQuest((q) => recipe(q.stages[si]!));
  // A stage without `flow` reads as parallel (QuestStageConfig).
  const flow = stage.flow || "parallel";
  const allKeys = quest.stages.flatMap((s) => s.objectives.map((o) => o.key));
  // An empty stage asks for its first objective straight away.
  const showTypes = picking || stage.objectives.length === 0;

  const add = (type: string) => {
    // Objective keys are unique within a quest: the database keys progress by them.
    const key = newObjectiveKey(type, allKeys);
    editQuest((q) => {
      q.stages[si]!.objectives.push({ key, type, params: defaultParams(type) });
    });
    setOpenKey(key);
    setPicking(false);
  };

  return (
    <div className="aq-card aq-stage">
      <div className="aq-stage-head">
        {handle}
        <span className="aq-n is-brand">{si + 1}</span>
        <div className="aq-stage-title">
          <TextField
            ctx={ctx}
            bare
            label={t("stage", { n: si + 1 })}
            node={stage.title}
            placeholder={t("stageTitle")}
          />
        </div>
        {stage.objectives.length > 1 && (
          <Seg
            label={t("flow")}
            value={flow}
            options={(["parallel", "sequential"] as const).map((f) => ({
              value: f,
              label: t(`flow.${f}`),
            }))}
            onChange={(f) =>
              editStage((s) => {
                s.flow = f;
              })
            }
          />
        )}
        <RemoveButton
          t={t}
          label={t("remove")}
          sure={stage.objectives.length === 0}
          onRemove={() =>
            editQuest((q) => {
              q.stages.splice(si, 1);
            })
          }
        />
      </div>
      <SortableList
        ids={rowIds(stage.objectives.map((o) => o.key))}
        onMove={(from, to) => editStage((s) => move(s.objectives, from, to))}
        className="aq-objectives"
      >
        {(oi, handle) => {
          const objective = stage.objectives[oi]!;
          return (
            <ObjectiveRow
              t={t}
              projectId={ctx.projectId}
              n={flow === "sequential" ? `${si + 1}.${oi + 1}` : ""}
              objective={objective}
              open={openKey === objective.key}
              onToggle={() => setOpenKey(openKey === objective.key ? null : objective.key)}
              keyTaken={allKeys.filter((k) => k === objective.key).length > 1}
              handle={handle}
              onChange={(recipe) => editStage((s) => recipe(s.objectives[oi]!))}
              onRename={(key) => {
                if (openKey === objective.key) setOpenKey(key);
              }}
              onRemove={() =>
                editStage((s) => {
                  s.objectives.splice(oi, 1);
                })
              }
            />
          );
        }}
      </SortableList>
      {showTypes ? (
        <div className="aq-types">
          <span className="aq-eyebrow">{t("addObjective")}</span>
          <div className="aq-seg">
            {OBJECTIVE_TYPES.map((s) => (
              <button key={s.type} type="button" className="aq-opt" onClick={() => add(s.type)}>
                <span aria-hidden>{s.icon}</span> {t(`objective.${s.type}` as Parameters<T>[0])}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Button size="sm" variant="ghost" className="aq-add" onClick={() => setPicking(true)}>
          + {t("addObjective")}
        </Button>
      )}
    </div>
  );
}

/**
 * One objective: a line saying what it asks (`⛏ Break blocks · 64 × STONE`), which opens
 * its form. Its key, generated from the type, waits under the form's own chevron.
 */
function ObjectiveRow({
  t,
  projectId,
  n,
  objective,
  open,
  onToggle,
  keyTaken,
  handle,
  onChange,
  onRename,
  onRemove,
}: {
  t: T;
  projectId: string;
  n: string;
  objective: Objective;
  open: boolean;
  onToggle: () => void;
  keyTaken: boolean;
  handle: ReactElement;
  onChange: (recipe: (o: Objective) => void) => void;
  onRename: (key: string) => void;
  onRemove: () => void;
}) {
  const spec = objectiveSpec(objective.type);
  const params: ParamSpec[] = spec
    ? spec.params
    : Object.keys(objective.params).map((name) => ({ name, kind: "text" as const }));
  const target = objectiveTarget(objective.params);
  const subject = objectiveSubject(objective.type, objective.params);
  const missing = missingParams(objective.type, objective.params);
  const problem = keyTaken || missing.length > 0;
  const advanced = params.filter((p) => p.advanced);
  const [moreOpen, setMoreOpen] = useState(false);
  const showMore = moreOpen || keyTaken;
  const field = (p: ParamSpec) =>
    p.kind === "item" ? (
      <ItemParamField
        key={p.name}
        t={t}
        projectId={projectId}
        spec={p}
        params={objective.params}
        onChange={(recipe) => onChange((o) => recipe(o.params))}
      />
    ) : (
      <ParamField
        key={p.name}
        t={t}
        spec={p}
        value={objective.params[p.name]}
        onChange={(v) => onChange((o) => setOrDelete(o.params, p.name, v))}
      />
    );

  return (
    <div className={`aq-obj${open ? " is-open" : ""}${problem ? " has-problem" : ""}`}>
      <div className="aq-obj-line">
        {handle}
        <button type="button" className="aq-obj-main" onClick={onToggle} aria-expanded={open}>
          {n && <span className="aq-obj-n">{n}</span>}
          <span className="aq-obj-icon" aria-hidden>
            {spec?.icon ?? "?"}
          </span>
          <span className="aq-obj-text">
            {typeLabel(t, objective.type)}
            {target !== undefined && <strong> · {String(target)}</strong>}
            {subject ? ` × ${subject}` : target !== undefined && spec ? ` × ${t("any")}` : ""}
          </span>
          {problem && (
            <Chip tone="warn">
              {keyTaken
                ? t("objectiveKeyTaken")
                : t("missing", {
                    fields: missing.map((m) => t(`param.${m}` as Parameters<T>[0])).join(", "),
                  })}
            </Chip>
          )}
          <Chevron open={open} />
        </button>
        <IconButton label={t("remove")} onClick={onRemove}>
          ×
        </IconButton>
      </div>
      {open && (
        <div className="aq-obj-form">
          <div className="aq-row aq-top aq-wrap">
            <Field label={t("type")}>
              <select
                className="select"
                value={objective.type}
                onChange={(e) =>
                  onChange((o) => {
                    o.type = e.target.value;
                    o.params = defaultParams(o.type);
                  })
                }
              >
                {OBJECTIVE_TYPES.map((s) => (
                  <option key={s.type} value={s.type}>
                    {s.icon} {t(`objective.${s.type}` as Parameters<T>[0])}
                  </option>
                ))}
                {!spec && <option value={objective.type}>{objective.type}</option>}
              </select>
            </Field>
            {params.filter((p) => !p.advanced).map(field)}
          </div>
          <button
            type="button"
            className="aq-fold-head is-inner"
            aria-expanded={showMore}
            onClick={() => setMoreOpen(!showMore)}
          >
            <Chevron open={showMore} />
            <span className="aq-fold-title">{t("more")}</span>
            {!showMore && (
              <Chip>
                <span className="aq-mono">{objective.key}</span>
              </Chip>
            )}
          </button>
          {showMore && (
            <div className="aq-row aq-top aq-wrap">
              {advanced.map(field)}
              <Field
                label={t("key")}
                title={t("objectiveKeyHint")}
                hint={keyTaken ? <span className="aq-err">{t("objectiveKeyTaken")}</span> : undefined}
              >
                <input
                  className="input aq-mono"
                  value={objective.key}
                  onChange={(e) => {
                    const key = typedKey(e.target.value);
                    onChange((o) => {
                      o.key = key;
                    });
                    onRename(key);
                  }}
                  onBlur={() => {
                    const final = slugKey(objective.key);
                    if (final !== objective.key) {
                      onChange((o) => {
                        o.key = final;
                      });
                      onRename(final);
                    }
                  }}
                />
              </Field>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * An objective's item: the whole item of menus (vanilla, custom or captured item, name, lore,
 * enchantments…) and the criteria a player's item is compared on (`match`), ticked by default
 * from the item. Empty: any item. Replaces the legacy bare material on the first edit.
 */
function ItemParamField({
  t,
  projectId,
  spec,
  params,
  onChange,
}: {
  t: T;
  projectId: string;
  spec: ParamSpec;
  params: Raw;
  onChange: (recipe: (params: Raw) => void) => void;
}) {
  const item = itemValue(params, spec);
  const match = Array.isArray(params.match) ? (params.match as ItemComparisonWire[]) : undefined;
  const write = (next: Raw | undefined, nextMatch: ItemComparisonWire[] | undefined) =>
    onChange((p) => writeItemParam(p, spec, next, nextMatch));
  return (
    <Field label={t(`param.${spec.name}` as Parameters<T>[0])}>
      <ItemInput
        projectId={projectId}
        value={item}
        match={match}
        onChange={(next) => write(next, match)}
        onMatchChange={(next) => write(item, next)}
      />
    </Field>
  );
}

function ParamField({
  t,
  spec,
  value,
  onChange,
}: {
  t: T;
  spec: ParamSpec;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const label = t(`param.${spec.name}` as Parameters<T>[0]);
  const text = typeof value === "string" || typeof value === "number" ? String(value) : "";
  if (spec.kind === "int") {
    return <NumberField label={label} value={value} onChange={onChange} />;
  }
  if (spec.kind === "material") {
    return (
      <Field label={label}>
        <MaterialInput
          value={text}
          placeholder={t("any")}
          aria-label={label}
          onChange={(v) => onChange(v.toUpperCase().replace(/\s+/g, "_"))}
        />
      </Field>
    );
  }
  const entity = spec.kind === "entity";
  return (
    <Field label={label}>
      <input
        className={`input${entity ? " aq-mono" : ""}`}
        list={entity ? "aq-entities" : undefined}
        value={text}
        placeholder={entity ? t("any") : ""}
        onChange={(e) =>
          onChange(entity ? e.target.value.toUpperCase().replace(/\s+/g, "_") : e.target.value)
        }
      />
      {entity && (
        <datalist id="aq-entities">
          {ENTITY_TYPES.map((e) => (
            <option key={e} value={e} />
          ))}
        </datalist>
      )}
    </Field>
  );
}

/** The tooltip's width in Minecraft pixels: lines wrap there, as lore does in game. */
const PREVIEW_WIDTH = 170;
const PREVIEW_GRAY = { color: "#aaaaaa", italic: false };
const PREVIEW_WHITE = { color: "#ffffff", italic: false };

/**
 * The quest as an item tooltip draws it in game: its title, its description line by line with
 * its colours, then each stage's objectives at 0. A menu may lay a quest out otherwise; this
 * shows the texts as the client renders them.
 */
function Preview({ ctx, quest }: { ctx: Ctx; quest: Quest }) {
  const { t, project, lang } = ctx;
  const wrap = (source: string) =>
    source.split("\n").flatMap((line) => (line === "" ? [""] : mcWrap(line, PREVIEW_WIDTH)));
  const title = textValue(project, quest.title.key, lang) || quest.key;
  const description = textValue(project, quest.description.key, lang);
  const staged = quest.stages.length > 1;
  return (
    <div className="aq-preview">
      <div className="aq-preview-frame">
        <McText source={wrap(title).join("\n")} defaults={PREVIEW_WHITE} scale={2} />
        {description && (
          <McText source={wrap(description).join("\n")} defaults={PREVIEW_GRAY} scale={2} />
        )}
        {quest.stages.map((s, si) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: stages are listed in order
          <div key={si} className="aq-preview-stage">
            {staged && (
              <McText
                source={wrap(textValue(project, s.title.key, lang) || t("stage", { n: si + 1 })).join("\n")}
                defaults={PREVIEW_WHITE}
                scale={2}
              />
            )}
            {s.objectives.length > 0 && (
              <McText
                source={s.objectives.flatMap((o) => wrap(`• ${objectiveLine(t, o)}`)).join("\n")}
                defaults={PREVIEW_GRAY}
                scale={2}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
