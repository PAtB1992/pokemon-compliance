# Übung: Der komplette Ablauf aus der Stellenausschreibung, einmal selbst durchspielen

Die Ausschreibung beschreibt diesen Ablauf: *Architectural Design Proposal → Design der Funktionalität →
Freigabe einholen → Implementierung → Testautomatisierung → manuelle Tests → Handover zum Review → Release nach
Bestätigung → Ergebnis dokumentieren.*

Diese Übung lässt dich genau diesen Ablauf einmal komplett durchlaufen - anhand einer kleinen, aber echten
Erweiterung des Pokémon-Compliance-Projekts. Das Projekt selbst läuft bereits (siehe `README.md`); hier geht es
darum, es Stage für Stage zu erweitern, so wie du es im echten Job tun würdest.

**Zeitbudget:** ca. 2-3 Stunden für alle Stages, gut aufteilbar über mehrere Tage deines 7-Tage-Plans. Die
Stages 1-3 sind reine Kopfarbeit/Schreibarbeit (kein Code), 4-6 sind Hands-on-Coding, 7-9 wieder Schreibarbeit.

---

## Stage 1 - Architectural Design Proposal (10 Min, schriftlich)

Bevor du Code schreibst: Schreibe dir 5-8 Sätze auf (auf Deutsch, wie im Interview), die folgende neue
Anforderung adressieren:

> "Trainer sollen zusätzlich zur Level-/Legendary-/Item-Prüfung auch gegen doppelte Spezies im selben Team
> geprüft werden können (Regel `noDuplicateSpecies`, existiert als Datenbankfeld bereits, wird aber noch nicht
> ausgewertet)."

Nutze die Struktur aus dem Interview-Guide (Kapitel "Architektur & Vorgehen"): Kontext & Problem, 2 Optionen
(z. B. "Prüfung in `RuleEngineService` ergänzen" vs. "separater `DuplicateSpeciesValidator`"), Trade-offs,
Empfehlung. Für dieses kleine Feature ist Option 1 (in `RuleEngineService` ergänzen) fast immer die richtige Wahl
- aber die Übung ist, dich zu zwingen, das kurz zu begründen statt einfach loszucoden.

## Stage 2 - Design der Funktionalität (10 Min, schriftlich)

Skizziere kurz (Stichpunkte reichen): Welche Eingabe braucht die Prüfung? Welche Ausgabe? Wie viele Verstöße soll
sie erzeugen, wenn 3x dieselbe Spezies im Team ist - einen pro Duplikat oder einen gesamt? (Empfehlung: einen
gesamt mit allen Duplikaten in den Details, sonst wird die Violation-Liste bei größeren Teams unübersichtlich.)

## Stage 3 - Freigabe einholen (5 Min)

Im echten Job würdest du das jetzt jemandem zeigen. Hier: Lies deinen eigenen Vorschlag aus Stage 1+2 laut vor
(oder schick ihn dir selbst als Sprachnachricht) - merkst du beim Erklären Lücken in deinem eigenen Design? Das
ist der eigentliche Wert von Approval-Schritten, nicht nur Bürokratie.

## Stage 4a - Implementierung (Hands-on)

Öffne `backend/src/rules/rule-engine.service.ts`. Dort steht bereits ein `TODO`-Kommentar an der richtigen
Stelle. Implementiere die Prüfung: Wenn `rule.noDuplicateSpecies === true` und mindestens eine Spezies mehrfach im
Roster vorkommt, füge ein `RuleCheckResult` mit `severity: ViolationSeverity.MEDIUM` und einer `details`-Nachricht
hinzu, die alle doppelten Spezies nennt.

<details>
<summary>Tipp, falls du nicht weiterkommst</summary>

Zähle die Vorkommen pro `speciesName` (z. B. mit einer `Map<string, number>`), filtere die mit Anzahl > 1, und
baue daraus eine Nachricht wie `"Team enthält mehrfach: Pikachu, Bulbasaur."`.
</details>

<details>
<summary>Vollständige Lösung anzeigen</summary>

```ts
if (rule.noDuplicateSpecies) {
  const counts = new Map<string, number>();
  for (const p of roster) {
    counts.set(p.speciesName, (counts.get(p.speciesName) ?? 0) + 1);
  }
  const duplicates = [...counts.entries()].filter(([, count]) => count > 1).map(([species]) => species);
  if (duplicates.length) {
    results.push({
      severity: ViolationSeverity.MEDIUM,
      details: `Team enthält mehrfach: ${duplicates.join(', ')}.`,
    });
  }
}
```
</details>

## Stage 4b - Testautomatisierung (Hands-on, TDD)

In `backend/src/rules/rule-engine.service.spec.ts` gibt es bereits einen Test für dieses Feature, aktuell markiert
mit `it.skip(...)`. Entferne `.skip` und passe den Test bei Bedarf an deine Implementierung an (z. B. an den
genauen Text deiner `details`-Nachricht). Führe dann aus:

```bash
cd backend
npm run test:watch
```

Ziel: der Test wird grün, **ohne** dass du ihn nachträglich an einen falschen Implementierungs-Output anpasst -
er soll dein Design aus Stage 2 verifizieren, nicht umgekehrt. Bonus-Übung: Schreibe einen zweiten Testfall für
den Fall "3x dieselbe Spezies" und einen für "zwei verschiedene Duplikate gleichzeitig".

## Stage 5a - Manuelle Tests (Hands-on)

Starte Backend und Frontend (siehe `README.md`). Lege testweise über die API einen neuen Trainer mit doppelten
Spezies an (z. B. via `curl -X POST` - du müsstest dafür kurz einen `POST /trainers`-Endpoint ergänzen, aktuell
gibt es nur `GET`; alternativ: passe testweise die Seed-Daten in `seed.service.ts` an und starte das Backend neu)
und prüfe manuell im Frontend, ob die Verstoßmeldung sinnvoll aussieht. Notiere dir währenddessen (Stichpunkte
reichen): Was würdest du bei einem echten manuellen Testdurchlauf zusätzlich prüfen (Edge Cases, Fehlermeldungen,
Performance bei großen Rostern)?

## Stage 5b - Testautomatisierung Frontend (Hands-on)

In `frontend/cypress/e2e/roster-compliance.cy.ts` steht am Ende ein Kommentar mit einer offenen Übungsaufgabe:
ein Test, der prüft, dass der "Prüfen"-Button deaktiviert ist, solange kein Trainer und keine Regel ausgewählt
wurden.

<details>
<summary>Lösung anzeigen</summary>

```ts
it('deaktiviert den Prüfen-Button ohne Auswahl', () => {
  cy.contains('button', 'Prüfen').should('be.disabled');
});
```
</details>

## Stage 6 - Handover zum Review (10 Min, schriftlich)

Schreib dir eine kurze Pull-Request-Beschreibung, so wie du sie wirklich einreichen würdest:

- **Was** wurde geändert (1-2 Sätze)
- **Warum** (Bezug zur Anforderung aus Stage 1)
- **Wie getestet** (Verweis auf den neuen Jest-Test + manuelle Tests aus Stage 5a)
- **Auswirkungen** (z. B. "keine Breaking Changes, `noDuplicateSpecies` war bereits im Schema vorhanden")

## Stage 7 - Release nach Bestätigung (5 Min)

Schau dir `.github/workflows/ci.yml` und `Jenkinsfile` an: An welcher Stelle genau würde deine Änderung durch die
Pipeline laufen, und wo ist das Approval-Gate? Erkläre es dir selbst laut, als würdest du es im Interview
erklären.

## Stage 8 - Ergebnis dokumentieren (10 Min, schriftlich)

Ergänze in Gedanken (oder wirklich, wenn du magst) einen Abschnitt "Changelog" in der `README.md`: Version,
Datum, was wurde hinzugefügt. Das ist der "document outcome for handover"-Schritt aus der Ausschreibung.

---

## Reflexion

Wenn du alle Stages durchlaufen hast, hast du im Kleinen genau das gemacht, was in der Stellenausschreibung als
Aufgabenprofil steht - das ist eine sehr gute, konkrete Geschichte für die Interview-Frage "Erzähl von einem
Feature, das du kürzlich gebaut hast" (siehe Kapitel "Verhaltensfragen" im Interview-Guide).
