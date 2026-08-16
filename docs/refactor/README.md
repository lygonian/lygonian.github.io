# Website Refactoring Orchestrator

Diese Control Plane steuert spätere Website-Refactorings. Sie ist kein eigenes Agenten-Framework: Codex Subagents, project-scoped Agentrollen, Git, Worktrees und native Reviews werden direkt genutzt.

## Lesereihenfolge

1. `../../AGENTS.md`
2. `../../../DESIGN.md`
3. `website-state.yaml`
4. `design-contracts.yaml`
5. `dependency-graph.yaml`
6. `protocol.md`
7. der zugewiesene Task unter `tasks/`

## Erkannter Bestand

- 23 statische HTML-Seiten
- eine gemeinsame CSS-Datei mit 3.317 Zeilen
- eine gemeinsame JS-Datei mit 529 Zeilen
- 20 Rasterbilder und zwei SVG-Dateien im aktuellen Worktree
- Header, Hauptnavigation und Footer pro Seite dupliziert
- kein Framework, Paketmanager, Build, Lint, Test, CI, Browser-, Visual- oder Accessibility-Harness
- Firefox ist für manuelle Prüfung vorhanden

Positiv vorhanden sind einheitliche globale Navigation, Skip-Links, genau ein `h1` pro Seite, sichtbare Focus-Regeln, Reduced-Motion-Fallbacks und progressive Enhancement. Konkrete Befunde und Blocker stehen in `reports/latest.md` und im State.

## Initialer Backlog

- `WRO-002`: Foundation Contracts — Typography, UI Color, Artwork-Grenze, Spacing, Containers, Tokens
- `WRO-003`: Layout, Responsive, Breakpoints und Layer-Grundstruktur
- `WRO-004`: Components, Surfaces und Interaction
- `WRO-005`: Artwork, Effects, Layers und Visual Composition
- `WRO-006`: Semantics und Accessibility
- `WRO-007`: Content, IA, Navigation und Shared Shell
- `WRO-008`: CSS/JS Architecture und Legacy Cleanup
- `WRO-009`: Cross-System Contract Synthesis und Implementierungsfreigabe

## Waves

**Discovery:** Read-only Systemaudits und Baselines parallel; aktuelle Bootstrap-Audits liefern den ersten Snapshot, ersetzen aber keine Browser- oder visuelle Baseline.

**Contracts:** Foundation, Layout/Layer, Components sowie Content/Semantics parallel vorschlagen; der Orchestrator reconciliiert und schreibt. Sichtbare Richtungsfragen gehen an Samet.

**Implementation:** Nur akzeptierte, geleaste Pakete. Gemeinsame UI-Objekte besitzen einen Writer; zentrale CSS-/JS-/Index-/Shell-Änderungen sind seriell.

**Integration:** automatisierte Checks soweit vorhanden, Specialist Review, Accessibility und Visual Integration vor Merge.

**Cleanup:** Dead Code, Media-Query- und Architekturvereinfachung erst nach Stabilisierung der konsumierten Contracts.
