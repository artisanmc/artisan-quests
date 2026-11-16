package com.github.ibanetchep.msquests.core.quest.actor;

import com.github.ibanetchep.msquests.core.lang.Translatable;
import com.github.ibanetchep.msquests.core.lang.Translator;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class QuestStageDisplayNameTest {

    private static final Translator TRANSLATOR = new Translator() {
        @Override
        public String getRaw(String key) {
            return "placeholder.stage_default_name".equals(key) ? "Étape %stage_number%" : key;
        }

        @Override
        public String getRaw(Translatable translatable) {
            return getRaw(translatable.getTranslationKey());
        }
    };

    @Test
    void aNamedStageKeepsItsName() {
        assertEquals("Rassembler", QuestStage.displayName("Rassembler", 2, TRANSLATOR));
    }

    @Test
    void aStageWithoutNameTakesTheDefaultOfItsPlace() {
        assertEquals("Étape 2", QuestStage.displayName(null, 2, TRANSLATOR));
        assertEquals("Étape 1", QuestStage.displayName("  ", 1, TRANSLATOR));
    }
}
