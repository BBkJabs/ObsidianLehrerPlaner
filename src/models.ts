export interface Schuljahr {
    id: string;
    name: string; // z.B. "2025/2026"
    startDatum: string; // ISO-Format YYYY-MM-DD
    endDatum: string; // ISO-Format YYYY-MM-DD
    halbjahresWechsel: string; // ISO-Format YYYY-MM-DD
}

export interface Ferien {
    id: string;
    name: string; // z.B. "Sommerferien 2025"
    startDatum: string; // ISO-Format YYYY-MM-DD
    endDatum: string; // ISO-Format YYYY-MM-DD
}

export interface Feiertag {
    id: string;
    name: string;
    datum: string; // ISO-Format YYYY-MM-DD
}

export interface Bildungsgang {
    id: string;
    langName: string; // z.B. "Höhere Berufsfachschule für Informatik"
    kurzName: string; // z.B. "hbfi"
    farbe: string; // Hex-Code für UI
}

export interface Klasse {
    id: string;
    name: string; // z.B. "24-hbfi"
    jahrgang: number; // z.B. 24
    bildungsgangId: string;
}

export interface Fach {
    id: string;
    langName: string; // z.B. "Software"
    kurzName: string; // z.B. "sow"
}

export interface Kurs {
    id: string;
    bildungsgangId: string;
    stufenBezeichnung: 'u' | 'm' | 'o'; // Unterstufe, Mittelstufe, Oberstufe
    fachId: string;
    name: string; // z.B. "hbfiu-sow"
}

export interface Unterrichtseinheit {
    id: string;
    kursId: string;
    titel: string;
    beschreibung: string;
    dauerInStunden: number;
    reihenfolge: number;
    markdownDateiLink?: string; // Link zur Ausgangs-Markdown-Datei
}

export interface StundenplanEintrag {
    id: string;
    klasseId: string;
    fachId: string;
    wochentag: number; // 1 = Montag, 5 = Freitag
    stunde: number; // 1 bis 8
}

export interface Stundenplan {
    id: string;
    schuljahrId: string;
    gueltigAb: string; // ISO-Format YYYY-MM-DD
    gueltigBis?: string; // ISO-Format YYYY-MM-DD
    eintraege: StundenplanEintrag[];
}

export interface GeplanteEinheit {
    id: string;
    unterrichtseinheitId: string;
    klasseId: string;
    datum: string; // ISO-Format YYYY-MM-DD
    stunde: number;
    istIndividuellAngepasst: boolean;
}

export interface LehrerplanerData {
    schuljahre: Schuljahr[];
    ferien: Ferien[];
    feiertage: Feiertag[];
    bildungsgaenge: Bildungsgang[];
    klassen: Klasse[];
    faecher: Fach[];
    kurse: Kurs[];
    unterrichtseinheiten: Unterrichtseinheit[];
    stundenplaene: Stundenplan[];
    geplanteEinheiten: GeplanteEinheit[];
}

export const DEFAULT_DATA: LehrerplanerData = {
    schuljahre: [],
    ferien: [],
    feiertage: [],
    bildungsgaenge: [],
    klassen: [],
    faecher: [],
    kurse: [],
    unterrichtseinheiten: [],
    stundenplaene: [],
    geplanteEinheiten: []
};