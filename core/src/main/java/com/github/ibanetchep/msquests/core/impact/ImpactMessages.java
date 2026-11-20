package com.github.ibanetchep.msquests.core.impact;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * The sentence of each {@link Impact}, for the author of the change, in English or French.
 * {@code {name}} is an argument; {@code [n:one|other]} is the count {@code n} with its noun.
 */
public final class ImpactMessages {

    private static final Pattern COUNT = Pattern.compile("\\[(\\w+):([^|\\]]*)\\|([^\\]]*)]");
    private static final Pattern ARG = Pattern.compile("\\{(\\w+)}");

    private static final Map<String, String> EN = Map.ofEntries(
            Map.entry("group.removed", "The group '{group}' is removed: [n:quest in progress stops|quests in progress stop] and leave the journal. Their progress stays in the database, unused."),
            Map.entry("group.renamed", "The progress saved under '{from}' follows to '{group}' ([n:quest in progress|quests in progress]). This is done once per database: publish the same file on every server that runs this group."),
            Map.entry("quest.moved", "Quest '{quest}' comes from '{from}': the progress of [n:quest in progress|quests in progress] follows it."),
            Map.entry("quest.renamed", "Quest '{from}' becomes '{quest}' and keeps its progress ([n:quest in progress|quests in progress]). This is done once per database: publish the same file on every server that runs this group."),
            Map.entry("quest.replaced", "Quest '{quest}' is gone and '{new}' is new: [n:quest in progress|quests in progress] under '{quest}' leave the journal and '{new}' starts from zero ([finished:earlier completion|earlier completions] no longer count). If it is the same quest under a new key, give '{new}' the line old_key: {quest} to keep the progress."),
            Map.entry("quest.removed", "Quest '{quest}' is removed: [n:quest in progress leaves|quests in progress leave] the journal ([finished:earlier completion|earlier completions] no longer count). The slot of a quest in progress stays taken until the group's period ends."),
            Map.entry("group.reset_added", "A reset is added to '{group}': what was completed before the last reset no longer counts ([n:completion|completions] so far), so these quests can be handed out again."),
            Map.entry("objective.replaced", "Quest '{quest}': objective '{objective}' is gone and '{new}' is new. [n:player loses|players lose] their progress on it. If it is the same objective under a new key, give '{new}' the line old_key: {objective}."),
            Map.entry("objective.type_changed", "Quest '{quest}': objective '{objective}' changes type ({from} to {to}), so it starts from zero for [n:player who had|players who had] progress on it."),
            Map.entry("objective.removed", "Quest '{quest}': objective '{objective}' is removed and no longer asked ([n:player was|players were] working on it). A stage left with nothing to do is passed at the player's next load."),
            Map.entry("objective.target_raised", "Quest '{quest}': objective '{objective}' goes from {from} to {to}. [n:player in progress has|players in progress have] more to do; [kept:player who had completed it keeps|players who had completed it keep] it."),
            Map.entry("objective.target_lowered", "Quest '{quest}': objective '{objective}' goes from {from} to {to}. [n:player already has|players already have] enough: it completes at their next load and its completion actions run then."),
            Map.entry("objective.added", "Quest '{quest}': objective '{objective}' is added to stage '{stage}'. [n:player on that stage has|players on that stage have] it to do; [past:player already past it is|players already past it are] not asked."),
            Map.entry("stage.added", "Quest '{quest}': stage '{stage}' is new. [n:player already past its place is|players already past its place are] not asked to do it; the others meet it in order."),
            Map.entry("stage.removed", "Quest '{quest}': stage '{stage}' is removed. [n:player on it moves|players on it move] to the next stage at their next load."),
            Map.entry("stage.removed_last", "Quest '{quest}': stage '{stage}' is removed and nothing follows it. [n:player on it completes|players on it complete] the quest, with its rewards, at their next load."));

    private static final Map<String, String> FR = Map.ofEntries(
            Map.entry("group.removed", "Le groupe '{group}' est supprimé : [n:quête en cours s'arrête et quitte|quêtes en cours s'arrêtent et quittent] le journal. Leur progression reste en base, inutilisée."),
            Map.entry("group.renamed", "La progression enregistrée sous '{from}' suit vers '{group}' ([n:quête en cours|quêtes en cours]). C'est fait une seule fois par base : publiez le même fichier sur chaque serveur qui fait tourner ce groupe."),
            Map.entry("quest.moved", "La quête '{quest}' vient de '{from}' : la progression de [n:quête en cours|quêtes en cours] la suit."),
            Map.entry("quest.renamed", "La quête '{from}' devient '{quest}' et garde sa progression ([n:quête en cours|quêtes en cours]). C'est fait une seule fois par base : publiez le même fichier sur chaque serveur qui fait tourner ce groupe."),
            Map.entry("quest.replaced", "La quête '{quest}' disparaît et '{new}' est nouvelle : [n:quête en cours|quêtes en cours] sous '{quest}' quittent le journal et '{new}' repart de zéro ([finished:complétion passée ne compte plus|complétions passées ne comptent plus]). Si c'est la même quête sous une nouvelle clé, ajoutez à '{new}' la ligne old_key: {quest} pour garder la progression."),
            Map.entry("quest.removed", "La quête '{quest}' est supprimée : [n:quête en cours quitte|quêtes en cours quittent] le journal ([finished:complétion passée ne compte plus|complétions passées ne comptent plus]). La place d'une quête en cours reste prise jusqu'à la fin de la période du groupe."),
            Map.entry("group.reset_added", "Une réinitialisation est ajoutée à '{group}' : ce qui a été terminé avant la dernière réinitialisation ne compte plus ([n:complétion|complétions] à ce jour), ces quêtes peuvent donc être redonnées."),
            Map.entry("objective.replaced", "Quête '{quest}' : l'objectif '{objective}' disparaît et '{new}' est nouveau. [n:joueur perd|joueurs perdent] leur progression dessus. Si c'est le même objectif sous une nouvelle clé, ajoutez à '{new}' la ligne old_key: {objective}."),
            Map.entry("objective.type_changed", "Quête '{quest}' : l'objectif '{objective}' change de type ({from} vers {to}), il repart donc de zéro pour [n:joueur qui avait|joueurs qui avaient] progressé dessus."),
            Map.entry("objective.removed", "Quête '{quest}' : l'objectif '{objective}' est supprimé et n'est plus demandé ([n:joueur y travaillait|joueurs y travaillaient]). Une étape où il ne reste rien à faire est passée au prochain chargement du joueur."),
            Map.entry("objective.target_raised", "Quête '{quest}' : l'objectif '{objective}' passe de {from} à {to}. [n:joueur en cours a|joueurs en cours ont] davantage à faire ; [kept:joueur qui l'avait terminé le garde|joueurs qui l'avaient terminé le gardent]."),
            Map.entry("objective.target_lowered", "Quête '{quest}' : l'objectif '{objective}' passe de {from} à {to}. [n:joueur en a|joueurs en ont] déjà assez : il se termine à leur prochain chargement, et ses actions de fin s'exécutent à ce moment."),
            Map.entry("objective.added", "Quête '{quest}' : l'objectif '{objective}' est ajouté à l'étape '{stage}'. [n:joueur sur cette étape doit|joueurs sur cette étape doivent] le faire ; [past:joueur déjà plus loin n'est pas concerné|joueurs déjà plus loin ne sont pas concernés]."),
            Map.entry("stage.added", "Quête '{quest}' : l'étape '{stage}' est nouvelle. [n:joueur déjà plus loin n'a|joueurs déjà plus loin n'ont] pas à la faire ; les autres la rencontrent dans l'ordre."),
            Map.entry("stage.removed", "Quête '{quest}' : l'étape '{stage}' est supprimée. [n:joueur qui y était passe|joueurs qui y étaient passent] à l'étape suivante à leur prochain chargement."),
            Map.entry("stage.removed_last", "Quête '{quest}' : l'étape '{stage}' est supprimée et rien ne la suit. [n:joueur qui y était termine|joueurs qui y étaient terminent] la quête, avec ses récompenses, à leur prochain chargement."));

    private ImpactMessages() {
    }

    /** The codes that have a sentence, for the tests. */
    static java.util.Set<String> codes(String lang) {
        return table(lang).keySet();
    }

    public static String render(Impact impact, String lang) {
        String template = table(lang).getOrDefault(impact.code(), EN.get(impact.code()));
        if (template == null) {
            return impact.code() + " " + impact.args();
        }
        Matcher counts = COUNT.matcher(template);
        StringBuilder counted = new StringBuilder();
        while (counts.find()) {
            int n = impact.args().get(counts.group(1)) instanceof Number number ? number.intValue() : 0;
            counts.appendReplacement(counted, Matcher.quoteReplacement(n + " " + (n == 1 ? counts.group(2) : counts.group(3))));
        }
        counts.appendTail(counted);
        Matcher args = ARG.matcher(counted);
        StringBuilder out = new StringBuilder();
        while (args.find()) {
            args.appendReplacement(out, Matcher.quoteReplacement(String.valueOf(impact.args().get(args.group(1)))));
        }
        args.appendTail(out);
        return out.toString();
    }

    private static Map<String, String> table(String lang) {
        return "fr".equals(lang) ? FR : EN;
    }
}
