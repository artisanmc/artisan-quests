import {
  type DocumentEditorProps,
  MiniMessageInput,
  OverlayComposer,
  injectModuleStyles,
  updateDocument,
} from "@artisan/editor-sdk";
import { HUD_KIND, HUD_SLOTS, type HudSlot, type QuestHud, hudPreview, hudText } from "./hud";
import { useT } from "./i18n";
import { QUESTS_CSS } from "./styles";

/**
 * The view of a `quest_hud`: its layout laid out with the mouse at the top of the game's screen,
 * where Artisan's boss bar slot draws it (`OverlayComposer`, `slot: "boss_bar"`, SDK 1.24), and the
 * MiniMessage each named layer shows, with the objective's placeholders.
 */
export function QuestHudEditor({ projectId, documentId, document }: DocumentEditorProps) {
  injectModuleStyles("msquests", QUESTS_CSS);
  const hud = document as QuestHud;
  const t = useT();
  const save = (next: QuestHud) => updateDocument({ projectId, kind: HUD_KIND, id: documentId, doc: next });
  const sample = {
    quest_name: t("hud.sample.quest"),
    objective_name: t("hud.sample.objective"),
    objective_progress: "0",
    objective_target: "3",
    objective_progress_percent: "0%",
  };
  // Offered on `{` in each text, with the sample the composer shows (SDK 1.25).
  const variables = Object.entries(sample).map(([path, value]) => ({ path, sample: value }));
  const setText = (slot: HudSlot, value: string) => {
    const texts = { ...hud.texts };
    if (value.trim() === "") delete texts[slot];
    else texts[slot] = value;
    save({ ...hud, texts });
  };

  return (
    <div className="aq">
      <section className="aq-section">
        <span className="aq-h">{t("hud.layout")}</span>
        <span className="aq-hint">{t("hud.layoutHint")}</span>
        <OverlayComposer
          projectId={projectId}
          slot="boss_bar"
          value={hud.layout}
          onChange={(next) => save({ ...hud, layout: next })}
          slots={HUD_SLOTS.map((slot) => ({ name: slot, kind: "text" as const, label: t(`hud.slot.${slot}`) }))}
          preview={hudPreview(hud, sample)}
        />
      </section>
      <section className="aq-section">
        <span className="aq-h">{t("hud.texts")}</span>
        <span className="aq-hint">{t("hud.textsHint")}</span>
        {HUD_SLOTS.map((slot) => (
          // A div, not a label: a label hands a click in the text to the toolbar's Bold button.
          <div key={slot} className="aq-field">
            <span className="field-label">{t(`hud.slot.${slot}`)}</span>
            <MiniMessageInput
              value={hud.texts[slot] ?? ""}
              placeholder={hudText({ ...hud, texts: {} }, slot)}
              onChange={(value) => setText(slot, value)}
              variables={variables}
              aria-label={t(`hud.slot.${slot}`)}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
