# Beschreibung
Es handelt sich um einen Unterrichtsinhalte-Planer für den Unterricht an einem Berufskolleg in NRW für eine Lehrkraft.

## Features

### Schuljahre, Schulwochen und Kalenderwochen
- Das Plugin arbeitet nicht mit Kalender-, sondern mit Schuljahren.
- Ein Schuljahr kann in jedem Kalenderjahr einen anderen Start- sowie Endtermin haben.
- Schuljahresbeginn und -ende können in einem eigenen Einstellungsbereich eingetragen werden. Dabei beginnt ein folgendes Schuljahr immer einen Tag nach dem Ende des vorangegangenen Schuljahres. 
- Schulwochen in einem Schuljahr, welche nicht komplett in den Ferien liegen, werden durchnummeriert. 
- Neben Schulwochen wird auch Gebrauch von Kalenderwochen gemacht.
- Ein Schuljahr wird immer in ein erstes und ein zweites Halbjahr unterteilt. Das Ende eines Schulhalbjahres kann ebenfalls im Einstellungsbereich für Schuljahre festgelegt werden. Standardmäßig haben das erste und zweite Schulhalbjahr ungefähr gleich viele Schulwochen. Ferienwochen werden dabei nicht mitgerechnet. Das erste Halbjahr kommt damit in der Regel auf ungefähr 20 Schulwochen (ohne Ferienwochen).

### Ferien- und Feiertage
- In einem eigenen Einstellungsbereich für Ferien können Ferienzeiten sowie Feiertage eingetragen werden. 
- Standardmäßig gibt es folgende Ferientage:
    - Osterferien
    - Pfingstferien
    - Sommerferien
    - Herbstferien
    - Weihnachtsferien
    - Bewegliche Ferientage
- Hinzu kommen die gesetzlichen Feiertage des Bundeslandes. Für NRW wären das:
    - Neujahrstag: Immer 1. Januar (liegt immer in den Weihnachtsferien)
    - Karfreitag (liegt immer in den Osterferien)
    - Ostermontag (liegt immer in den Osterferien)
    - Tag der Arbeit: Immer 1. Mai
    - Christi Himmelfahrt
    - Pfingstmontag
    - Fronleichnam
    - Tag der Deutschen Einheit: Immer 3. Oktober
    - Allerheiligen: Immer 1. November
    - 1. Weihnachtsfeiertag: Immer 25. Dezember (liegt immer in den Weihnachtsferien)
    - 2. Weihnachtsfeiertag: Immer 26. Dezember (liegt immer in den Weihnachtsferien)
- Für Tage in den Ferien oder an Feiertagen wird kein Unterricht geplant.

### Abteilungen
- Die Abteilung ist die höchste Organisationsstruktur. Diese soll im Plugin zunächst aber keine Verwendung finden. 

### Bildungsgänge
- Bildungsgänge sind die nächste Organisationsebene. Diese soll im Plugin verwendet werden.
- Jede Klasse gehört einem Bildungsgang an. Es gibt zum Beispiel die Bildungsgänge:
    - Höhere Berufsfachschule Metalltechnik (hbft)
    - Höhere Berufsfachschule für Informatik (hbfi)
    - IT-Berufe (it)
- Jeder Bildungsgang hat einen Langnamen (Höhere Berufsfachschule Metalltechnik) und einen Kurznamen (hbft). Es wird in der Regel der Kurzname verwendet.
- Jedem Bildungsgang kann in den Einstellungen eine spezifische Farbe zugewiesen werden. Alle Unterrichts-Kärtchen dieses Bildungsgangs werden dann in der Listenansicht mit dieser Farbe (z. B. als leicht transparenter Hintergrund) dargestellt, um eine schnelle visuelle Zuordnung zu ermöglichen.
- Jede Klasse ist, unabhängig vom Jahrgang, genau einem Bildungsgang zugeordnet. 
- Unterrichtsplanungen sind in der Regel bildungsgangspezifisch. 
- Man unterscheidet Vollzeitbildungsgänge und Teilzeitbildungsgänge. Klassen aus Vollzeitbildungsgängen haben in der Regel an 5 Tagen pro Woche Unterricht. Teilzeitbildungsgänge (duale Ausbildung) haben in der Regel ein bis zwei feste Schultage pro Woche. Diese können sich über die Jahrgänge sowie Schuljahre hinweg ändern.

### Kurse und Klassen
- Es kann in jedem Schuljahr eine oder mehrere Klassen/Klassen geben. 
- Es gibt auch unterschiedliche Jahrgänge (23, 24, 25, 26, ...). Dadurch lässt sich ermitteln, in welchem Schuljahr sich eine spezifische Klasse befindet. 
- Die Jahrgangsnummer gibt an, in welchem Jahr eine Klasse an der Schule gestartet ist.
- Klassen gehören auch einem sogenannten Bildungsgang an (hbfi, hbft, it, ...). 
- Alternativ können auch die Stufenbezeichnungen Unterstufe (u), Mittelstufe (m) und Oberstufe (o) für die spezifischen Jahrgänge verwendet werden. Dabei bedeutet Unterstufe das erste Schuljahr an der Schule, Mittelstufe ist bei dreijährigen Bildungsgängen das zweite Jahr, Oberstufe ist bei dreijährigen Bildungsgängen das dritte und bei zweijährigen Bildungsgängen das zweite Jahr.
- Eine Klasse wäre zum Beispiel "24-hbfi". Dieser Klasse sind ganz spezifische Schüler zugewiesen. 
- Ein Kurs wäre zum Beispiel "hbfiu". Diese wäre nicht schüler- oder Klassenspezifisch .
- Der Unterricht wird für verschiedene Jahrgangsstufen als auch für verschiedene Bildungsgänge unterschiedlich geplant. 
- Die Kombination aus Bildungsgang/Stufenbezeichnung/Fach ergibt einen eindeutigen Kurs.
- Unterricht wird immer für Kurse langfristig gespeichert. Dieser kann in jedem Schuljahr für den gleichen Kurs wiederverwendet werden.
- Unterricht wird im Planer immer für Kurse geplant. Dabei wird auf diese Planung, sofern vorhanden, als Ausgangsbasis ein für Bildungsgang/Stufenbezeichnung/Fach bereits geplantes Schuljahr gematcht.
- Es kann sogenannte Parallelklassen geben. Dies bedeutet, es gibt zwei oder mehr Klassen, welche sowohl zum gleichen Bildungsgang gehören als auch den gleichen Jahrgang haben. Diese bekommen grundsätzlich die gleiche Unterrichtsplanung als Ausgangsbasis, sofern vorhanden. Sie können im Jahr aber individuell (nur für dieses Jahr) unterschiedlich abgeändert werden.
- Schulklassen samt Fach bekommen eine Kurs zugewisen. Beispiel: Die Klasse 24-hbfi-sow (Jahrgang 24, Bldungsgang hbfi, Fach Software) bekommt den Kurs hbfim.sow zugewiesen.
- Eine Änderung am Kurs (hbfim-sow) wirkst sich auf alle folgenden Jahre aus. 
- Eine Önderung an der Klasse (24-hbfi-sow) wirkt sich nur auf das aktuelle Jahr aus. 
- Kurse bestehen aus vielen  Kurs-Unterrichtsstunden, die zu Unterrichtseinheiten zusammengefasst werden können.

### Fächer
- Es gibt unterschiedliche Fächer. Jedes Fach erhält neben einem Langnamen (Software) auch eine Abkürzung (sow). 
- Fächerbezeichnungen können in unterschiedlichen Bildungsgängen gleich sein. Dies bedeutet aber nicht, dass auch die Unterrichtsinhalte gleich sein müssen.  

### Stundentafel
- Eine Stundentafel gibt an, wieviele Stunden die Lahrkraft über die beiden Halbjahre verteilt in den einzelnen Klassen/Fächern im Schuljahr Unterricht gibt. 

### Stundenplan
- Es gibt einen Stundenplan, der angibt, in welchen Stunden die jeweiligen individuellen Klassen unterrichtet werden. 
- Es kann in sehr seltenen Ausnahmefällen passieren, dass zwei Klassen zur gleichen Zeit unterrichtet werden müssen.
- In den Einstellungen zur Schule kann festgelegt werden, an welchen Tagen der Woche Unterricht stattfinden kann. Dies ist standardmäßig montags bis freitags.
- In den Einstellungen zur Schule kann eingestellt werden, welche Unterrichtsstunden es an den Wochentagen grundsätzlich gibt. Standardmäßig ist das die erste bis achte Stunde. 
- Der erste Stundenplan in einem Schuljahr beginnt am ersten Tag des Schuljahres.
- Der letzte Stundenplan eines Schuljahres endet mit dem letzten Schultag im Schuljahr.
- Vollzeitbildungsgänge haben am letzten Schultag im Schulhalbjahr und am letzten Schultag des Schuljahres weniger Unterrichtsstunden. 
- Ein Stundenplan kann sich während eines Schuljahres beliebig oft ändern. 
- Am Schulhalbjahresende ändert sich der Stundenplan immer.
  
### Unterricht
- Die Planung und in den Folgejahren die Wiederverwendung der Planung von Unterrichtsinhalten für alle Jahrgänge aller Bildungsgänge in allen Fächern ist die Hauptaufgabe des Plugins.
- Die Lehrkraft soll eine übersichtliche Darstellung der geplanten Unterrichtsinhalte über die Schulwochen erhalten.
- Geplante Unterrichtsinhalte sollen in Folge-Schuljahren auf die Unterrichtsstunden passend gematcht werden. Ferien- sowie Feiertage und Unterrichtszeiten werden jeweils berücksichtigt. Dabei kann es vorkommen, dass die Anzahl der Unterrichtsstunden in einem Fach nicht über die Schuljahre hinweg gleich ist. 
- Geplante Unterrichtsinhalte sollen gegebenenfalls auch sowohl für das aktuelle Schuljahr als auch für Folgeschuljahre angepasst werden können; zum Beispiel, wenn sich in der Praxis zeigt, dass eine Planung nicht gut war. 
- Geplante Unterrichtsinhalte sollen auch individuell nur für das aktuelle Schuljahr angepasst werden können, ohne die Planung für die Folgeschuljahre zu verändern. 
- In der Übersicht der geplanten Unterrichtsinhalte für das aktuelle Schuljahr sollen individuelle Änderungen als auch die ursprüngliche Planung (Planung, welche in den Folgejahren übernommen wird) in verschiedenen Farben angezeigt werden. 
- Echten Parallelklassen werden in der Regel gleiche, geplante Unterrichtsinhalte zugewiesen. Davon gibt es aber Ausnahmen. Diese sollen von der Lehrkraft angegeben werden können. So gibt es zum Beispiel im Bildungsgang "it" die Klassen itm1, itm3, itm5.
- Es soll jeweils für jede Kombination aus Bildungsgang/Klasse/Jahrgangsstufe/Fach (z. B. hbfio-sow) eine Gesamtübersicht der Planung in einem eigenen Markdown-Dokument geben. Der Name und der Pfad der Planungsdatei können in den Einstellungen des Plugins festgelegt werden. Ist dies noch nicht geschehen, wird der Lehrer vor der Planung des ersten Unterrichtsinhaltes darauf hingewiesen. Der Inhalt der Datei wird vom Plugin automatisch gepflegt. Es stehen dort jeweils als eigene Unterkapitel die einzelnen Unterrichtseinheiten in der zeitlichen Abfolge sortiert. 

### Unterrichtseinheiten
- Eine Unterrichtseinheit ist eine zusammenhängender Stundenbock in der Schulwoche.

### Noten
(später)

### Listen-Ansicht
- Es gibt eine Listenansicht, die die geplanten Unterrichtsstunden chronologisch als Liste anzeigt.
- Vergangene Unterrichtsstunden werden dabei farblich etwas transparenter (heller, ...) dargestellt.
- Es kann nach Bildungsgang, Fach und Klasse gefiltert oder gruppiert werden.
- Per Drag-and-Drop kann die zeitliche Abfolge grundsätzlich verändert werden. 

### Unterrichts-Dialog
- Es gibt eine Möglichkeit, eine Unterrichtseinheit neu zu planen oder zu bearbeiten. Dazu öffnet sich ein Dialog, in welchem die Kerndaten eingetragen/verändert werden:
    - Bildungsgang/Klasse/Fach
    - Titel
    - Geplante Dauer in ganzen Schulstunden
    - Ziel
    - Link zu einer internen Markdown-Datei
- Wurden die Felder ausgefüllt und bestätigt, wird ein Kärtchen in der Liste der Unterrichtsinhalte hinzugefügt.

## Umsetzung

### Datenhaltung und Architektur
- **Speicherung:** Die Speicherung aller Daten (Schuljahre, Ferien, Stundenpläne, Kurse, Klassen) erfolgt primär in JSON-Dateien im Plugin-Ordner. Leistungsfähigere Alternativen (z. B. IndexedDB) sind möglich, sofern sie für Obsidian-Plugins geeignet sind.
- **Identifikation:** Alle Entitäten (Kurse, Klassen, Unterrichtseinheiten) erhalten eindeutige IDs (UUIDs), um Verknüpfungen robust zu gestalten.
- **UI-Integration:** Die Listenansicht benötigt viel Darstellungsfläche für eine gute Übersicht. Sie wird daher im Hauptfenster (Workspace Leaf) als eigener View gerendert (nicht in der Sidebar oder als Modal). Die Ansicht muss Drag & Drop, Filterung, Gruppierung, Mouse-Hover-Effekte sowie Klicks zum Bearbeiten, Hinzufügen und Öffnen von Links unterstützen.

### Das Kurs-Klassen-Modell (Vererbung & Abweichung)
- **Grundprinzip:** Ein "Kurs" (z. B. `hbfim.sow`) dient als Master-Vorlage. Eine "Klasse" (z. B. `24-hbfi-sow`) ist die konkrete Instanz dieses Kurses in einem spezifischen Schuljahr.
- **Entstehung von Kursen:** Aktuell existieren noch keine Kurse. Diese sollen aus den Planungen der ersten Klassen für das nächste Schuljahr erwachsen und erfahrungsgemäß jedes Jahr verfeinert werden.
- **Matching bei Neuanlage:** Beim Erstellen einer neuen Klasse samt Fach und Stundentafel für ein Schuljahr wird (ggf. über einen Dialog) ein passender Kurs auf die Klasse gematcht. Alle realen Unterrichtsstunden in dem Schuljahr erhalten die entsprechenden Inhalte aus dem Kurs.
- **Umgang mit Stunden-Diskrepanzen:** 
    - Sind am Ende des Schuljahres noch reale Unterrichtsstunden ungeplant (Kurs hat zu wenig Inhalt), werden diese farblich hervorgehoben. 
    - Hat der Kurs zu viele Stunden, sodass nicht alle Inhalte auf das Schuljahr gematcht werden können, wird dies ebenfalls farblich hervorgehoben (Inhalts-Überhang).
- **Parallelklassen:** Parallelklassen mit dem gleichen Fach bekommen den gleichen Kurs zugewiesen und gematcht. Sie können sich im Laufe des Schuljahres jedoch unterschiedlich entwickeln (leichte Inhaltsanpassungen, abweichender zeitlicher Ablauf).
- **Anpassungen zur Laufzeit (Das Kernproblem):** 
    - Anpassungen durch die Lehrkraft sind jederzeit möglich.
    - Es muss eine klare Unterscheidung (z. B. visuell durch Vererbungssymbole oder Farben) zwischen der ursprünglichen Kurs-Planung und der aktuellen Klassen-Anpassung geben.
    - Änderungen an der Klasse wirken sich *nur* auf das aktuelle Jahr aus.
    - Änderungen am Kurs wirken sich auf *alle folgenden Jahre* aus.
    - **Herausforderung:** Es wird eine UI/UX-Lösung benötigt, die eine ständige, parallele Darstellung von Kurs (Vorlage) und Klasse (Instanz) ermöglicht, sodass die Lehrkraft jederzeit entscheiden kann, ob sie nur die aktuelle Klasse anpasst oder den zugrundeliegenden Kurs optimiert.

### Stundenplan und Rhythmisierung
- **Gültigkeit:** Ein Stundenplan wird zunächst für den Anfang des Schuljahres erstellt und gilt bis zum Ende des Halbjahres. Zum Halbjahr gibt es zwingend einen neuen Stundenplan. Neue Stundenpläne beginnen IMMER an einem Montag.
- **Unterjährige Änderungen:** Wird ein neuer Stundenplan während eines Halbjahres aktiv, kann der Benutzer diesen eintragen. Bei einer Änderung des Stundenplans müssen die ursprünglich geplanten, in der Zukunft liegenden Stunden neu auf den neuen Stundenplan gematcht werden.
- **Stundentafel-Vorschau (2. Halbjahr):** Da zu Schuljahresbeginn die Stundentafel bekannt ist, ist auch bekannt, wie viele Stunden die Lehrkraft im zweiten Halbjahr in welcher Klasse unterrichten wird, selbst wenn der genaue Stundenplan für das zweite Halbjahr noch fehlt. Für das Matching von Kursen auf Klassen für das 2. Halbjahr wird daher anstelle eines konkreten Datums/Wochentags einfach die jeweilige Schulwoche als Platzhalter angegeben.
- **A/B-Wochen:** Das System muss A/B-Wochen (14-tägiger Rhythmus) im Stundenplan unterstützen. Es wird einmalig in den Einstellungen festgelegt, ob gerade oder ungerade Kalenderwochen (oder alternativ Schulwochen) als "A-Woche" gelten. 
    - **Feiertage/Ferien:** Da standardmäßig auf Kalenderwochen gematcht wird, sind Feiertage und Ferien für den A/B-Rhythmus irrelevant (der Rhythmus läuft im Hintergrund weiter). Stellt der Benutzer auf "Schulwochen" um, so würden nur ganzwöchige Ferien den Rhythmus beeinflussen.
    - Im Zweifel muss der Rhythmus jedoch für einzelne Wochen individuell anpassbar sein.

### Interaktion (Drag & Drop)
- Beim Drag & Drop in der Listenansicht soll sich die Reihenfolge der Unterrichtseinheiten und damit automatisch das zugewiesene Datum (basierend auf dem Stundenplan) anpassen. 
- Dabei sollte der Anwender gefragt werden (oder per Toggle entscheiden können), ob diese Reihenfolge-Änderung nur für die aktuelle Klasse oder auch für den zugrundeliegenden Kurs gelten soll.

### Umgang mit der Vergangenheit und Aufteilung
- **Vergangenheit ist fix:** Vergangene Unterrichtsstunden (Klassen-Instanzen) dürfen nicht mehr geändert werden, da sie bereits stattgefunden haben. Änderungen für die Zukunft können und sollten durch eine Kursänderung (oder Klassenänderung für die Zukunft) erfolgen.
- **Stundenplan-Änderung in laufender Einheit:** Wenn sich der Stundenplan ändert und eine mehrstündige Unterrichtseinheit genau auf der Grenze zwischen Vergangenheit (alter Plan) und Zukunft (neuer Plan) liegt, wird die Einheit vom Plugin zerrissen: Der bereits unterrichtete Teil bleibt fix in der Vergangenheit, der noch ausstehende Teil wird auf den neuen Stundenplan in der Zukunft gematcht.
- **Stunden-Splitting:** Wenn eine Kurseinheit laut Planung mehrere Stunden dauert (z. B. 3 Stunden), der Stundenplan an dem Tag aber weniger Unterrichtsstunden hergibt (z. B. nur 2 Stunden), wird die Einheit automatisch auf mehrere Tage aufgeteilt.

### Generierte Markdown-Dateien und Verlinkung
- **One-Way-Sync:** Die vom Plugin generierten Planungsdateien (Gesamtübersicht pro Kurs/Klasse) werden strikt "One-Way" vom Plugin erzeugt und aktualisiert. Die Lehrkraft sollte in diesen Dateien keine manuellen Änderungen vornehmen, da diese vom Plugin überschrieben würden.
- **Verlinkung von Inhalten (Ausgangs-Markdown):** Der "Link zu einer internen Markdown-Datei" im Unterrichts-Dialog verweist auf eine "Ausgangs-Markdown-Datei" zum jeweiligen Kurselement. In dieser Datei kann die Lehrkraft (unabhängig vom Plugin-Sync) weitere Angaben zum Kursinhalt treffen und Verlinkungen auf Arbeitsblätter, Tafelbilder etc. pflegen.
- **Automatische Erstellung & Autocomplete:** Bei der Eingabe des Links im Dialog bietet das Plugin (wie in Obsidian üblich) eine Autovervollständigung für bestehende Dateien an. Gibt die Lehrkraft einen Link zu einer noch nicht existierenden Datei ein, erstellt das Plugin diese Datei automatisch.

### UI-Konzept: Kurs und Klasse im Vergleich (Diff-View)
- **Parallele Ansicht:** Um den Unterschied zwischen Kurs (Vorlage) und Klasse (Instanz) optimal darzustellen, sollen in der UI beide Stränge nebeneinander (Split-View) angezeigt werden.
- **Synchrones Scrollen & Diff-View:** Beide Ansichten scrollen synchron. Wenn Kurs und Klasse voneinander abweichen (z. B. weil in der Klasse eine zusätzliche Einheit eingefügt wurde), verhält sich die Ansicht wie ein "Diff-View" (bekannt aus Git): Das Plugin fügt auf der Seite des Kurses visuelle Lücken (leere Platzhalter) ein, damit die inhaltlich gleichen Einheiten auf beiden Seiten wieder auf derselben Höhe (nebeneinander) stehen. So erkennt die Lehrkraft Abweichungen sofort.

