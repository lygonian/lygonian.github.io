# ROSSMANN Filialen - Eine ausführliche Umsatzanalyse
Mit diesem Projekt vertiefe ich meine Fähigkeiten als DataScientist. Dafür analysiere ich historischen Verkaufsdaten, visualisiere gewonnene Erkentnisse und wende maschinelle Lernmodelle am um Umsatzprognosen für 8 Wochen zu erstellen.

![Alt text](https://github.com/lygonian/ROSSMANN_Umsatz_Vorhersage/blob/master/Ausgew%C3%A4hlte_Plots/Rossmann_Au%C3%9Fenansicht_Innenstadtlage.jfif)
(Bildquelle: https://de.wikipedia.org/wiki/Rossmann_(Handelskette)#/media/Datei:Rossmann_Au%C3%9Fenansicht_Innenstadtlage.JPG)

## Projektbeschreibung
Die Daten stammen aus dem Rossmann Store Sales-Wettbewerb auf Kaggle und dienen als Abschlussprüfung für meine Weiterbildung als DataScientist. Sie umfassen historische Verkaufsdaten (2,5 Jahre) von 1115 Rossmann-Filialen sowie zusätzliche Informationen zu jedem Verkaufstag wie Kundenzahl, Werbeaktionen, Feiertage und diverse Weitere.

## Projektstruktur
0. Gesamtes Notebook [hier](https://nbviewer.org/github/lygonian/ROSSMANN_Umsatz_Vorhersage/blob/master/Notebooks/1_complete.ipynb#toc1_4_)
1. Datenvorbereitung [hier](https://nbviewer.org/github/lygonian/ROSSMANN_Umsatz_Vorhersage/blob/master/Notebooks/2_Datenvorbereitung.ipynb)
2. Explorative Datenanalyse [hier](https://nbviewer.org/github/lygonian/ROSSMANN_Umsatz_Vorhersage/blob/master/Notebooks/3_Explorative_Datenanalyse.ipynb)
3. Umsatzvorhersage mittels machinellem Learning [hier](https://nbviewer.org/github/lygonian/ROSSMANN_Umsatz_Vorhersage/blob/master/Notebooks/4_MachineLearning_Vorhersage.ipynb)
4. Filialbericht-Generator [hier](https://nbviewer.org/github/lygonian/ROSSMANN_Umsatz_Vorhersage/blob/master/Notebooks/5_Filialbericht_Generator.ipynb)

## Aufgabenstellung
Die Bearbeitung der Aufgaben unterteilt sich in 4 Bereiche:
### 1. Datenvorbereitung:
- Übersetzen
- Korrigieren der Datentypen und transformieren von kategorialen Variablen
- Behandeln von duplizierten und fehlenden Werten durch simple Imputation und Imputation mittels machinellem Lernen
- Erstellen zusätzlicher Features durch Feature-Engineering wie
    - Ermittlung der Bundesländer durch das Feature Schulferien
    - Gruppierung der Filialen nach Leistung

### 2. Explorative Datenanalyse
- systematische Analyse der Key Performance Indicators (Umsatz pro Tag, Kunden pro Tag und Umsatz pro Kunde) für alle Features und Kombinationen
- Darstellung als normierte Werte in interaktiven pyplot Diagrammen
- einige Erkenntnisse:
    - Top12-Filialen befinden sich in Baden-Württemberg, Hessen, Rheinland-Pfalz, Sachsen-Anhalt und sind nur vom Typ d-basic, d-extended
    - Schlechteste12 Filialen befinden sich in Baden-Württemberg, Bayern, Hessen, NRW, Rheinland-Pfalz und sind nur vom Typ a-basic, b-extra und c-basic.
    - Höchster Umsatz pro Tag wurde in Berlin erreicht, aber der höchste Umsatz pro Kunde in Bayern.
    - b-extended nimmt nicht an Promo2 teil, erzielt aber den höchsten Umsatz an regulären Tagen und während Promo.
    - Sortimente basic und extended profitieren am meisten von Promotions.
    - Umsatz und Kunden pro Tag fallen mit der Distanz zu Wettbewerbern
    - Umsatz steigt bis Mai, fällt bis September und erreicht Maximum im Dezember.
- exemplarische Diagramme: 
![Alt text](https://github.com/lygonian/ROSSMANN_Umsatz_Vorhersage/blob/master/Ausgew%C3%A4hlte_Plots/Korrelationen_von_Umsatz.png)
![Alt text](https://github.com/lygonian/ROSSMANN_Umsatz_Vorhersage/blob/master/Ausgew%C3%A4hlte_Plots/Jahresverlauf_der_KPIs.png)
![Alt text](https://github.com/lygonian/ROSSMANN_Umsatz_Vorhersage/blob/master/Ausgew%C3%A4hlte_Plots/Wirkung_der_Promos_auf_Gesch%C3%A4ftstyp_und_Sortiment.png)
![Alt text](/https://github.com/lygonian/ROSSMANN_Umsatz_Vorhersage/blob/master/Ausgew%C3%A4hlte_Plots/Einfluss_der_Wettbewerber_Distanz_auf_KPIs.png)

### 3. RandomForestRegressor Umsatzvorhersage
- Datenpreprozessieren und Transformieren
- besten Features mittels dreier Methoden finden
- R2, MAE und RMSE als Evaluationsmetriken
- bestes machninelles Lernmodell aus sklearn finden
    - Durchschnittsmethode, lineare Regresion, LASSO, RIDGE, KNN, SVM, RandomForestRegressor, MLP Regressor (deep-learning)
- Cross-Validation, Hyperparameter-Tuning
- Datengerüst für Zukunftsvorhersage imputieren

### 4. Filialbericht-Generator
- Generierung des Fililaberichts mit Daten und Grafiken durch Eingabe der Filialnummer

## Future Implications 
Regionale Strategien:  
    - Top-Filialen: Fokussierung auf die Optimierung und Erweiterung von d-basic und d-extended Filialen in Baden-Württemberg, Hessen, Rheinland-Pfalz und Sachsen-Anhalt.  
    - Schlechteste Filialen: Analyse und Verbesserung der a-basic, b-extra und c-basic Filialen in den betroffenen Regionen, insbesondere in Bayern und NRW.   
    
Promotionsmanagement:  
    - Saisonale Trends: Anpassung der Promotionsstrategien basierend auf saisonalen Umsatztrends

Kundensegmentierung:  
    - Typ b und d: Entwicklung gezielter Marketingkampagnen für Typ b (höchster Umsatz und Kunden pro Tag) und Typ d (höchster Umsatz pro Kunde), um deren Stärken weiter zu nutzen.  

**Zukünftige Features für die EDA:**  
Regionale Umsatzanalyse:  
    - Erweiterte Analyse der Umsatzdaten nach Regionen, um spezifische regionale Trends und Muster zu identifizieren.   

Kundenverhaltensanalyse:  
    - Erweiterte Analyse des Kundenverhaltens, um Einblicke in die Präferenzen und das Kaufverhalten verschiedener Kundensegmente zu gewinnen.  

Produktverkaufsanalsye:  
    - Erweiterte Analyse der gewinnbringenden Produkte


## Autor
- Samet Kurt - github: lygonian

