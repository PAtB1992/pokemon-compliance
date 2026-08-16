# Pokémon Compliance Center

Ein kleines, aber **komplett lauffähiges** Full-Stack-Übungsprojekt, das genau den Stack aus deiner
Stellenausschreibung kombiniert: **Angular · TypeScript · NestJS · TypeORM · Jest · Cypress · GitHub Actions ·
Jenkins**. Thema: ein Compliance-System für ein Pokémon-Ligasystem - Trainer melden ihr Team (Roster) an, das
System prüft es gegen Turnier-Regeln und meldet Verstöße. Das ist bewusst dieselbe Art von Domäne (Policy / Rule /
Violation) wie in der echten Stellenbeschreibung ("Compliance Management"), nur mit mehr Spaß am Thema.

**Neu hier? Öffne zuerst [`TUTORIAL.html`](./TUTORIAL.html)** im Browser - das führt dich Schritt für Schritt durch
jede Datei in diesem Projekt und erklärt bei jedem Baustein, warum er nötig ist, ohne Vorwissen zu NestJS,
TypeORM, Angular Signals, Cypress oder CI/CD-Pipelines vorauszusetzen. Diese Datei (`README.md`) ist eher eine
Kurzreferenz zum späteren Nachschlagen (Start-Befehle, Endpunkte). Die eigentlichen **Lernaufgaben** danach stehen
in [`EXERCISE.md`](./EXERCISE.md) - sie folgt dem Ablauf aus der Stellenausschreibung (Design → Approval →
Implementierung → Test → Handover → Release → Dokumentation).

## Architektur im Überblick

```
pokemon-compliance/
├── backend/          NestJS-API (TypeORM + SQLite im Arbeitsspeicher, kein Setup nötig)
├── frontend/          Angular-Standalone-App (Signals, neue @if/@for-Syntax)
├── .github/workflows/ GitHub-Actions-Pipeline
├── Jenkinsfile        Äquivalente Jenkins-Pipeline
└── EXERCISE.md         Die eigentlichen Übungsaufgaben, Stage für Stage
```

Backend-Module: `trainers`, `rules` (inkl. `RuleEngineService` - die eigentliche Business-Logik),
`violations`, `compliance` (Orchestrator, transaktional) und `events` (Pub/Sub-Simulation über ein
`PublisherPort`-Interface, siehe unten).

## Voraussetzungen

- Node.js 20+ (wie in der Ausschreibung: WebStorm als IDE ist ideal, aber jeder Editor reicht)
- Kein Datenbank-Setup nötig - das Backend nutzt SQLite komplett im Arbeitsspeicher (`:memory:`), die
  Seed-Daten (3 Trainer, 2 Regeln) werden beim Start automatisch angelegt.

## Backend starten

```bash
cd backend
npm install
npm run start:dev
```

Läuft danach auf `http://localhost:3000`. Nützliche Endpunkte zum Ausprobieren (z. B. mit `curl` oder einem
REST-Client):

| Endpunkt | Beschreibung |
|---|---|
| `GET /trainers` | Alle Trainer inkl. Roster |
| `GET /rules` | Alle Turnier-Regeln |
| `POST /compliance/check` | `{ "trainerId": "...", "ruleId": "..." }` prüft ein Roster gegen eine Regel |
| `GET /violations` | Alle bisher erkannten Verstöße |
| `GET /events/recent` | Die letzten "publizierten" Events (Pub/Sub-Simulation, siehe unten) |

Backend-Tests:

```bash
npm run test          # einmalig
npm run test:watch    # im Watch-Modus, gut zum Üben von Stage 4b in EXERCISE.md
```

## Frontend starten

In einem zweiten Terminal:

```bash
cd frontend
npm install
npm start
```

Läuft danach auf `http://localhost:4200` (Backend muss parallel laufen). Zwei Seiten: **Roster-Check**
(Trainer + Regel wählen, prüfen) und **Verstöße** (alle bisher erkannten Verstöße als Tabelle).

Cypress-E2E-Tests (Frontend muss dafür nicht separat laufen, Cypress startet/nutzt `ng serve` selbst je nach
Befehl):

```bash
npx cypress open   # interaktiv, gut zum Lernen/Debuggen
npm run e2e:ci      # headless, wie in der CI-Pipeline
```

## Warum "Pub/Sub-Simulation"?

Echtes GCP Pub/Sub braucht ein GCP-Projekt und Zugangsdaten - für ein lokales Übungsprojekt unpraktisch. Stattdessen
kapselt `PublisherPort` (in `backend/src/events/publisher.port.ts`) die Publish-Operation hinter einem Interface.
Lokal implementiert `InMemoryPublisherAdapter` dieses Interface und "publiziert" nur in den Arbeitsspeicher
(abrufbar über `GET /events/recent`). In der echten Plattform wäre das eine `GcpPubSubPublisherAdapter`, die den
`@google-cloud/pubsub`-Client nutzt - der Rest der Anwendung (`ComplianceService`) müsste dafür **nicht**
angepasst werden. Genau dieses Ports-and-Adapters-Muster wird auch im Interview-Guide unter "Architektur &
Vorgehen" erklärt.

## CI/CD

`.github/workflows/ci.yml` und `Jenkinsfile` bilden denselben Ablauf zweimal ab (einmal pro Tool aus der
Ausschreibung): Backend installieren/testen/bauen → Frontend installieren/bauen → Cypress-E2E → manuelles
Approval-Gate → Deploy. Du musst dafür kein echtes GitHub-Repo/Jenkins aufsetzen, um zu lernen - lies die Dateien
einfach als Referenz, wie der Prozess aus der Stellenausschreibung technisch abgebildet würde. Wenn du magst,
kannst du das Projekt auch in ein eigenes GitHub-Repo pushen und die Actions-Pipeline wirklich laufen lassen.

## Nächster Schritt

Weiter mit [`EXERCISE.md`](./EXERCISE.md) - dort ist der komplette Ablauf in Stages aufgeteilt, inklusive zweier
konkreter Coding-Aufgaben (eine Backend-Regel, ein Cypress-Test) mit Lösungen zum Nachschlagen.
