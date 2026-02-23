import { Stundenplan, StundenplanEintrag, Unterrichtseinheit, GeplanteEinheit, Schuljahr } from './models';
import { KalenderService } from './kalender';

export class UnterrichtsService {
    private stundenplaene: Stundenplan[];
    private unterrichtseinheiten: Unterrichtseinheit[];
    private geplanteEinheiten: GeplanteEinheit[];
    private kalenderService: KalenderService;

    constructor(
        stundenplaene: Stundenplan[], 
        unterrichtseinheiten: Unterrichtseinheit[], 
        geplanteEinheiten: GeplanteEinheit[],
        kalenderService: KalenderService
    ) {
        this.stundenplaene = stundenplaene;
        this.unterrichtseinheiten = unterrichtseinheiten;
        this.geplanteEinheiten = geplanteEinheiten;
        this.kalenderService = kalenderService;
    }

    getStundenplanFuerDatum(datum: Date, schuljahrId: string): Stundenplan | undefined {
        const datumStr = this.formatDate(datum);
        
        // Finde alle Stundenpläne für das Schuljahr, die vor oder am Datum gültig sind
        const moeglichePlaene = this.stundenplaene.filter(sp => 
            sp.schuljahrId === schuljahrId && 
            sp.gueltigAb <= datumStr &&
            (!sp.gueltigBis || sp.gueltigBis >= datumStr)
        );

        // Sortiere absteigend nach gueltigAb und nimm den ersten (den aktuellsten)
        moeglichePlaene.sort((a, b) => b.gueltigAb.localeCompare(a.gueltigAb));
        
        return moeglichePlaene.length > 0 ? moeglichePlaene[0] : undefined;
    }

    getUnterrichtsstundenFuerKlasseUndFach(
        klasseId: string, 
        fachId: string, 
        datum: Date, 
        schuljahrId: string
    ): StundenplanEintrag[] {
        const stundenplan = this.getStundenplanFuerDatum(datum, schuljahrId);
        if (!stundenplan) return [];

        const wochentag = datum.getDay(); // 0 = Sonntag, 1 = Montag, ...
        
        return stundenplan.eintraege.filter(e => 
            e.klasseId === klasseId && 
            e.fachId === fachId && 
            e.wochentag === wochentag
        ).sort((a, b) => a.stunde - b.stunde);
    }

    getGeplanteEinheitenFuerKlasse(klasseId: string): GeplanteEinheit[] {
        return this.geplanteEinheiten.filter(ge => ge.klasseId === klasseId);
    }

    getUnterrichtseinheitenFuerKurs(kursId: string): Unterrichtseinheit[] {
        return this.unterrichtseinheiten
            .filter(ue => ue.kursId === kursId)
            .sort((a, b) => a.reihenfolge - b.reihenfolge);
    }

    // Plant eine Unterrichtseinheit für eine Klasse an einem bestimmten Datum
    planeEinheit(
        unterrichtseinheitId: string, 
        klasseId: string, 
        datum: Date, 
        stunde: number,
        istIndividuellAngepasst: boolean = false
    ): GeplanteEinheit {
        const neueEinheit: GeplanteEinheit = {
            id: this.generateId(),
            unterrichtseinheitId,
            klasseId,
            datum: this.formatDate(datum),
            stunde,
            istIndividuellAngepasst
        };

        this.geplanteEinheiten.push(neueEinheit);
        return neueEinheit;
    }

    // Automatisiertes Matching von Unterrichtseinheiten auf den Stundenplan
    // Dies ist eine vereinfachte Version der komplexen Logik, die im Feature-Dokument beschrieben ist
    automatischPlanen(
        kursId: string, 
        klasseId: string, 
        schuljahr: Schuljahr, 
        startDatum: Date
    ): GeplanteEinheit[] {
        const einheiten = this.getUnterrichtseinheitenFuerKurs(kursId);
        const geplante: GeplanteEinheit[] = [];
        
        let aktuellesDatum = new Date(startDatum);
        const endDatum = new Date(schuljahr.endDatum);
        
        let einheitIndex = 0;
        let verbleibendeStundenFuerAktuelleEinheit = einheiten.length > 0 ? einheiten[0].dauerInStunden : 0;

        while (aktuellesDatum <= endDatum && einheitIndex < einheiten.length) {
            // Überspringe Ferien, Feiertage und Wochenenden
            if (!this.kalenderService.istSchultag(aktuellesDatum)) {
                aktuellesDatum.setDate(aktuellesDatum.getDate() + 1);
                continue;
            }

            // Hole den Stundenplan für diesen Tag
            const stundenplan = this.getStundenplanFuerDatum(aktuellesDatum, schuljahr.id);
            
            if (stundenplan) {
                const wochentag = aktuellesDatum.getDay();
                
                // Finde alle Stunden für diese Klasse an diesem Tag (unabhängig vom Fach für diese vereinfachte Version)
                // In einer vollständigen Implementierung müsste hier das Fach des Kurses berücksichtigt werden
                const stundenHeute = stundenplan.eintraege
                    .filter(e => e.klasseId === klasseId && e.wochentag === wochentag)
                    .sort((a, b) => a.stunde - b.stunde);

                for (const stunde of stundenHeute) {
                    if (einheitIndex >= einheiten.length) break;

                    const aktuelleEinheit = einheiten[einheitIndex];
                    
                    // Plane die Stunde
                    const geplanteEinheit = this.planeEinheit(
                        aktuelleEinheit.id,
                        klasseId,
                        aktuellesDatum,
                        stunde.stunde
                    );
                    geplante.push(geplanteEinheit);

                    verbleibendeStundenFuerAktuelleEinheit--;

                    // Wenn die Einheit abgeschlossen ist, gehe zur nächsten
                    if (verbleibendeStundenFuerAktuelleEinheit <= 0) {
                        einheitIndex++;
                        if (einheitIndex < einheiten.length) {
                            verbleibendeStundenFuerAktuelleEinheit = einheiten[einheitIndex].dauerInStunden;
                        }
                    }
                }
            }

            aktuellesDatum.setDate(aktuellesDatum.getDate() + 1);
        }

        return geplante;
    }

    private formatDate(datum: Date): string {
        return datum.toISOString().split('T')[0];
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 15);
    }
}