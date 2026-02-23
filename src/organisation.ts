import { Bildungsgang, Klasse, Kurs, Fach } from './models';

export class OrganisationsService {
    private bildungsgaenge: Bildungsgang[];
    private klassen: Klasse[];
    private kurse: Kurs[];
    private faecher: Fach[];

    constructor(bildungsgaenge: Bildungsgang[], klassen: Klasse[], kurse: Kurs[], faecher: Fach[]) {
        this.bildungsgaenge = bildungsgaenge;
        this.klassen = klassen;
        this.kurse = kurse;
        this.faecher = faecher;
    }

    getBildungsgang(id: string): Bildungsgang | undefined {
        return this.bildungsgaenge.find(b => b.id === id);
    }

    getKlasse(id: string): Klasse | undefined {
        return this.klassen.find(k => k.id === id);
    }

    getKurs(id: string): Kurs | undefined {
        return this.kurse.find(k => k.id === id);
    }

    getFach(id: string): Fach | undefined {
        return this.faecher.find(f => f.id === id);
    }

    getKlassenFuerBildungsgang(bildungsgangId: string): Klasse[] {
        return this.klassen.filter(k => k.bildungsgangId === bildungsgangId);
    }

    getKurseFuerBildungsgang(bildungsgangId: string): Kurs[] {
        return this.kurse.filter(k => k.bildungsgangId === bildungsgangId);
    }

    getKurseFuerFach(fachId: string): Kurs[] {
        return this.kurse.filter(k => k.fachId === fachId);
    }

    // Ermittelt die Stufenbezeichnung (u, m, o) basierend auf dem Jahrgang der Klasse und dem aktuellen Schuljahr
    ermittleStufenBezeichnung(klasse: Klasse, aktuellesSchuljahrStartJahr: number): 'u' | 'm' | 'o' {
        // Jahrgang ist z.B. 24 (für 2024)
        // Wenn aktuellesSchuljahrStartJahr 2024 ist, dann ist es das 1. Jahr (Unterstufe)
        // Wenn aktuellesSchuljahrStartJahr 2025 ist, dann ist es das 2. Jahr (Mittelstufe)
        // Wenn aktuellesSchuljahrStartJahr 2026 ist, dann ist es das 3. Jahr (Oberstufe)
        
        const differenz = aktuellesSchuljahrStartJahr - (2000 + klasse.jahrgang);
        
        if (differenz === 0) return 'u';
        if (differenz === 1) return 'm';
        return 'o'; // Für 2 oder mehr Jahre
    }

    // Findet den passenden Kurs für eine Klasse in einem bestimmten Fach und Schuljahr
    findeKursFuerKlasse(klasseId: string, fachId: string, aktuellesSchuljahrStartJahr: number): Kurs | undefined {
        const klasse = this.getKlasse(klasseId);
        if (!klasse) return undefined;

        const stufe = this.ermittleStufenBezeichnung(klasse, aktuellesSchuljahrStartJahr);
        
        return this.kurse.find(k => 
            k.bildungsgangId === klasse.bildungsgangId && 
            k.fachId === fachId && 
            k.stufenBezeichnung === stufe
        );
    }
}