import { Schuljahr, Ferien, Feiertag } from './models';

export class KalenderService {
    private schuljahre: Schuljahr[];
    private ferien: Ferien[];
    private feiertage: Feiertag[];

    constructor(schuljahre: Schuljahr[], ferien: Ferien[], feiertage: Feiertag[]) {
        this.schuljahre = schuljahre;
        this.ferien = ferien;
        this.feiertage = feiertage;
    }

    istFerientag(datum: Date): boolean {
        const datumStr = this.formatDate(datum);
        return this.ferien.some(f => datumStr >= f.startDatum && datumStr <= f.endDatum);
    }

    istFeiertag(datum: Date): boolean {
        const datumStr = this.formatDate(datum);
        return this.feiertage.some(f => f.datum === datumStr);
    }

    istSchultag(datum: Date): boolean {
        const wochentag = datum.getDay();
        // 0 = Sonntag, 6 = Samstag
        if (wochentag === 0 || wochentag === 6) {
            return false;
        }
        return !this.istFerientag(datum) && !this.istFeiertag(datum);
    }

    getSchuljahrFuerDatum(datum: Date): Schuljahr | undefined {
        const datumStr = this.formatDate(datum);
        return this.schuljahre.find(sj => datumStr >= sj.startDatum && datumStr <= sj.endDatum);
    }

    getSchulwoche(datum: Date, schuljahr: Schuljahr): number {
        if (datum < new Date(schuljahr.startDatum) || datum > new Date(schuljahr.endDatum)) {
            return -1; // Nicht in diesem Schuljahr
        }

        let wochenZaehler = 1;
        let aktuellesDatum = new Date(schuljahr.startDatum);
        
        // Gehe zum ersten Montag des Schuljahres oder starte direkt, wenn es ein Montag ist
        while (aktuellesDatum.getDay() !== 1 && aktuellesDatum <= datum) {
            aktuellesDatum.setDate(aktuellesDatum.getDate() + 1);
        }

        while (aktuellesDatum <= datum) {
            // Prüfe, ob die aktuelle Woche eine Ferienwoche ist (z.B. Montag bis Freitag komplett frei)
            let istFerienwoche = true;
            for (let i = 0; i < 5; i++) {
                const testDatum = new Date(aktuellesDatum);
                testDatum.setDate(testDatum.getDate() + i);
                if (this.istSchultag(testDatum)) {
                    istFerienwoche = false;
                    break;
                }
            }

            if (!istFerienwoche) {
                // Wenn das Zieldatum in dieser Woche liegt, gib die aktuelle Wochennummer zurück
                const endeDerWoche = new Date(aktuellesDatum);
                endeDerWoche.setDate(endeDerWoche.getDate() + 6); // Sonntag
                
                if (datum >= aktuellesDatum && datum <= endeDerWoche) {
                    return wochenZaehler;
                }
                wochenZaehler++;
            }

            // Gehe zur nächsten Woche
            aktuellesDatum.setDate(aktuellesDatum.getDate() + 7);
        }

        return wochenZaehler;
    }

    private formatDate(datum: Date): string {
        return datum.toISOString().split('T')[0];
    }
}