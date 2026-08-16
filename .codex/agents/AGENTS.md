# Schlankes Website-Agentensystem

Dieses Verzeichnis enthält genau vier projektunabhängige Codex-Agentenprofile. Sie bündeln die Fachgebiete des früheren Spezialistensystems und sind aus den aktuellen Rollen in `.codex/agents/` abgeleitet.

## Systemgrenze

- Zulässig sind höchstens vier Agentenprofile: `weaver`, `cartographer`, `architect` und `sentinel`.
- Der primäre Codex-Thread bleibt Conductor und ist deshalb kein zusätzliches Agentenprofil.
- Die vier Agenten arbeiten als breite Generalisten direkt an ihrem Auftrag. Sie starten keine weiteren Subagenten und bauen keine verschachtelten Teams auf.
- Der Conductor beauftragt standardmäßig nur einen Agenten. Mehrere Agenten werden nur für wirklich unabhängige Arbeiten eingesetzt; parallele Schreibarbeit an denselben Dateien ist ausgeschlossen.

## Geschwindigkeit

- Aufträge werden klein und eindeutig zugeschnitten. Jeder Agent liest nur den relevanten Kontext und liefert ein verdichtetes Ergebnis.
- Vorhandene Evidenz wird wiederverwendet. Doppelte Bestandsaufnahmen, ritualisierte Vollprüfungen und lange Zwischenberichte entfallen.
- Prüfungen richten sich nach dem Risiko der tatsächlichen Änderung. Repräsentative Browser- und Sichtprüfungen haben Vorrang vor einer unnötig breiten Matrix.
- Agenten klären normale fachliche Details selbst. Sie eskalieren nur echte Richtungsentscheidungen, fehlende Autorität oder nicht auflösbare Blocker.

## Qualitätsgrundsätze

- Der ursprüngliche Nutzerauftrag und die geltenden Projektregeln bleiben maßgeblich.
- Bestehender Code ist Evidenz, aber keine automatische Designautorität.
- Entscheidungen werden durch passende Quellen, Code, Tests oder sichtbare Browserwirkung gestützt.
- Unsicherheit, Risiken und nicht geprüfte Bereiche werden knapp benannt.
- `sentinel` bleibt unabhängig und read-only; Reparaturen übernimmt der zuständige Arbeitsagent oder der Conductor.
