# Website Refactoring Protocol

## Rollen und Autorität

Der primäre Codex-Thread ist der Website Orchestrator. Er zerlegt Ziele in WRO-Tasks, verwaltet Abhängigkeiten, Git, Worktrees, Write Leases, Reviews, Integration, Reopens und Benutzerberichte. Nur er schreibt die autoritative Control Plane.

Spezialagenten lesen `AGENTS.md` und die Control Plane, arbeiten ausschließlich innerhalb eines zugewiesenen Tasks und melden Contract-Änderungen als Vorschlag. Bestehender Code ist Evidenz, nicht Designautorität. Funktionierendes Verhalten wird dennoch nur mit begründetem Ziel verändert.

Codex CLI `0.147.0` unterstützt native Subagents und project-scoped Custom Agents unter `.codex/agents/`. Die Agentdateien verwenden nur die dokumentierten Felder `name`, `description`, `developer_instructions` und beim reinen Reviewer `sandbox_mode`. Modelle sind nicht gepinnt. Live Runtime Overrides des Parent-Turns können eine Agent-Sandbox übersteuern; deshalb sichern zusätzlich No-Write-Instruktionen, Reviewer-Rolle und fehlende Write Leases den Visual-Integration-Agenten ab. Falls eine spätere Umgebung Custom Agents nicht lädt, verwendet der Orchestrator dieselben Rollenbeschreibungen als Task-Prompts.

## Task und Ergebnis

Jede konkrete Arbeit besitzt eine Datei `tasks/WRO-xxx.json` und genau einen Primary Owner. Vor Beginn müssen Objective, Scope, Non-Goals, Dependencies, Contract Reads, Files, Domains, Leases, Deliverables und Acceptance Checks feststehen.

Subagent-Ergebnisse bleiben kurz und enthalten genau diese Abschnitte:

1. Analyse
2. Vorschlag
3. Betroffene Dateien
4. Betroffene Contracts
5. Overlap
6. Abhängigkeiten
7. Risiken
8. Tests
9. Benutzerentscheidung nötig
10. Empfohlener nächster Schritt

## Parallelität und Write Leases

Read-only Exploration, Audits, Tests und unabhängige Reviews dürfen parallel laufen. Write-heavy Arbeit beginnt erst nach Lease-Prüfung.

Ein Lease umfasst:

- `write_files`: konkrete Pfade oder klar begrenzte Dateimengen
- `write_domains`: logische Bereiche wie `component.card` oder `interaction.card`
- `contract_nodes`: konsumierte oder beantragte Contract-Bereiche

Inkompatible Überschneidungen blockieren Parallelität. `assets/css/style.css`, `assets/js/atlas.js`, `index.html` und die auf 23 Seiten duplizierte Shell haben grundsätzlich einen Primary Writer. Bei einem Card-Paket liefern Foundation, Layout und Accessibility Perspektiven; `components-interaction` besitzt die Implementierung.

Der Orchestrator besitzt permanent den Control-Plane-Lease. Dieser reserviert ausschließlich die autoritativen Control-Plane-Dateien und `orchestration.control_plane`; er blockiert keine fachlichen Contract-Leases. Subagenten ändern die Control Plane nicht.

## Git und Worktrees

Vor jeder Git-Aktion werden Root, Status, Branch, HEAD, Remote, Merge-Base und Worktrees neu geprüft. Keine Aktion darf fremde Dirty-State-Änderungen einschließen. Verboten sind insbesondere Hard Reset, Clean, Force Push, `branch -D`, automatisches Stash und automatisches Pushen.

Ein Integrationsbranch `refactor/orchestrator` wird erst erzeugt, wenn Basis und Remote-Historie verstanden und ein sicherer Ausgangsstand vorhanden sind. Task-Branches heißen `agent/WRO-<id>-<slug>`.

Wenn die aktive Codex-Oberfläche isolierte Worktrees nativ bereitstellt, darf sie verwendet werden. Der lokale CLI-Stand exponiert dafür keinen eigenen Befehl; der Fallback ist ein normaler Git-Worktree an einem validierten Geschwisterpfad des Repositorys:

```sh
repo_root=$(git rev-parse --show-toplevel)
worktree_parent=$(dirname "$repo_root")/$(basename "$repo_root")-worktrees
task_path="$worktree_parent/WRO-<id>-<slug>"
git worktree add -b "agent/WRO-<id>-<slug>" "$task_path" refactor/orchestrator
```

Vor Ausführung müssen `worktree_parent` und `task_path` explizit angezeigt, als außerhalb des Repositorys geprüft und auf vorhandene fremde Inhalte geprüft werden. Nach akzeptierter Integration wird nur der genaue Task-Pfad mit `git worktree remove` entfernt; ein Branch wird ausschließlich mit `git branch -d` gelöscht.

Unveröffentlichte lokale Task-Branches dürfen nach Prüfung kontrolliert rebased werden. Veröffentlichte Historie wird nicht ungefragt umgeschrieben. Semantische Konflikte gehen an den Primary Owner zurück.

Commitformat:

```text
<type>(<system>): <kurze fachliche Beschreibung>

Task: WRO-xxx
Systems: ...
Contracts: ...
Checks: ...
```

Veröffentlicht wird niemals automatisch. Der dokumentierte `./veroeffentlichen.sh`-Weg ist aktuell nicht vorhanden und bleibt bis zur Klärung blockiert.

## Review Gates

Jeder Implementierungstask durchläuft ohne Sprung:

1. `repository-safety`
2. `analysis-complete`
3. `contract-ready`
4. `implementation-complete`
5. `automated-checks`
6. `specialist-review`
7. `visual-integration`
8. `integration`
9. `state-update`

Reviewer erzeugen Findings. Fixes gehen kontrolliert an den Primary Owner zurück. Native `codex review`-Funktionen werden bevorzugt, wenn ein isolierter Diff und eine klare Basis existieren.

Review-Zuordnung:

- Foundation: `architecture-cleanup` und `visual-integration`
- Layout: `semantics-accessibility` und `visual-integration`
- Components/Interaction: `semantics-accessibility` und `visual-integration`
- Visual/Artwork: `semantics-accessibility` und `visual-integration`
- Content/IA: `semantics-accessibility` und Orchestrator
- Cleanup: fachlicher Owner und Orchestrator

## Qualitätsgates

Vorhandene Checks werden bevorzugt. Neue Dependencies werden nicht beiläufig installiert. Statuskategorien sind Build, Lint, Existing Tests, Browser/Functional, Visual Regression, Accessibility und Responsive Review. `not_configured` ist ein gültiger, sichtbarer Zustand.

Ziel für Accessibility ist WCAG 2.2 AA soweit relevant. Automatisierung ersetzt keine manuelle Prüfung von Keyboard, Focus, Struktur, visueller Hierarchie, Zoom/Reflow, Kontrast über Artwork und Responsive-Verhalten.

## Reopen

Ein im neuen Programm akzeptiertes System darf nur mit Task-ID, auslösender Dependency, betroffenem Contract, fachlichem Grund, erwarteter Auswirkung und Review Owner auf `reopened` gesetzt werden. Eine persönliche Präferenz genügt nicht. Typography und Color sind im Bootstrap ohnehin im vollen Review Scope und benötigen aktuell keinen Reopen.

## Benutzerentscheidungen

Der Orchestrator entscheidet technische Zerlegung, konfliktfreie Organisation, Reviews und Scheduling. Eine Benutzerentscheidung ist nötig bei mehreren legitimen sichtbaren Richtungen, sichtbarer IA, geänderter Aussage, Branding, Website-Umfang oder einem grundlegenden Contract ohne objektiv bessere Option.

Format:

```text
DECISION REQUIRED
Thema: ...
Option A: ...
Option B: ...
Empfehlung: ...
Auswirkung: ...
```
