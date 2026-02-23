import { App, TFile } from 'obsidian';
import { GeplanteEinheit, Klasse, Kurs, Fach, Unterrichtseinheit } from './models';
import { UnterrichtsService } from './unterricht';
import { OrganisationsService } from './organisation';

export class MarkdownGeneratorService {
    private app: App;
    private unterrichtsService: UnterrichtsService;
    private organisationsService: OrganisationsService;

    constructor(
        app: App, 
        unterrichtsService: UnterrichtsService,
        organisationsService: OrganisationsService
    ) {
        this.app = app;
        this.unterrichtsService = unterrichtsService;
        this.organisationsService = organisationsService;
    }

    async generierePlanungsDatei(klasseId: string, fachId: string, zielPfad: string): Promise<void> {
        const klasse = this.organisationsService.getKlasse(klasseId);
        const fach = this.organisationsService.getFach(fachId);
        
        if (!klasse || !fach) {
            throw new Error('Klasse oder Fach nicht gefunden');
        }

        // In einer echten Implementierung müsste hier das aktuelle Schuljahr ermittelt werden
        const aktuellesSchuljahrStartJahr = new Date().getFullYear();
        const kurs = this.organisationsService.findeKursFuerKlasse(klasseId, fachId, aktuellesSchuljahrStartJahr);
        
        if (!kurs) {
            throw new Error('Kein passender Kurs gefunden');
        }

        const geplanteEinheiten = this.unterrichtsService.getGeplanteEinheitenFuerKlasse(klasseId);
        
        // Filtere nach Einheiten, die zu diesem Kurs gehören
        const relevanteEinheiten = geplanteEinheiten.filter(ge => {
            const ue = this.unterrichtsService.getUnterrichtseinheitenFuerKurs(kurs.id).find(u => u.id === ge.unterrichtseinheitId);
            return ue !== undefined;
        });

        // Sortiere nach Datum und Stunde
        relevanteEinheiten.sort((a, b) => {
            if (a.datum !== b.datum) {
                return a.datum.localeCompare(b.datum);
            }
            return a.stunde - b.stunde;
        });

        const markdownInhalt = this.erstelleMarkdownInhalt(klasse, fach, kurs, relevanteEinheiten);
        
        await this.speichereMarkdownDatei(zielPfad, markdownInhalt);
    }

    private erstelleMarkdownInhalt(
        klasse: Klasse, 
        fach: Fach, 
        kurs: Kurs, 
        geplanteEinheiten: GeplanteEinheit[]
    ): string {
        let inhalt = `# Unterrichtsplanung: ${klasse.name} - ${fach.langName}\n\n`;
        inhalt += `> **Hinweis:** Diese Datei wird automatisch vom Lehrerplaner-Plugin generiert. Manuelle Änderungen werden überschrieben!\n\n`;
        
        inhalt += `**Kurs:** ${kurs.name}\n`;
        inhalt += `**Stand:** ${new Date().toLocaleDateString('de-DE')}\n\n`;
        inhalt += `---\n\n`;

        if (geplanteEinheiten.length === 0) {
            inhalt += `*Noch keine Unterrichtseinheiten geplant.*\n`;
            return inhalt;
        }

        // Gruppiere nach Unterrichtseinheit
        let aktuelleUeId = '';
        
        for (const ge of geplanteEinheiten) {
            const ue = this.unterrichtsService.getUnterrichtseinheitenFuerKurs(kurs.id).find(u => u.id === ge.unterrichtseinheitId);
            
            if (!ue) continue;

            if (ue.id !== aktuelleUeId) {
                aktuelleUeId = ue.id;
                inhalt += `## ${ue.titel}\n\n`;
                
                if (ue.beschreibung) {
                    inhalt += `${ue.beschreibung}\n\n`;
                }
                
                if (ue.markdownDateiLink) {
                    inhalt += `**Material:** [[${ue.markdownDateiLink}]]\n\n`;
                }
                
                inhalt += `### Termine\n\n`;
            }

            const datumFormatiert = new Date(ge.datum).toLocaleDateString('de-DE');
            const anpassungHinweis = ge.istIndividuellAngepasst ? ' *(Individuell angepasst)*' : '';
            
            inhalt += `- ${datumFormatiert}, ${ge.stunde}. Stunde${anpassungHinweis}\n`;
        }

        return inhalt;
    }

    private async speichereMarkdownDatei(pfad: string, inhalt: string): Promise<void> {
        const file = this.app.vault.getAbstractFileByPath(pfad);
        
        if (file instanceof TFile) {
            await this.app.vault.modify(file, inhalt);
        } else {
            // Stelle sicher, dass der Ordner existiert
            const ordnerPfad = pfad.substring(0, pfad.lastIndexOf('/'));
            if (ordnerPfad && !this.app.vault.getAbstractFileByPath(ordnerPfad)) {
                await this.app.vault.createFolder(ordnerPfad);
            }
            
            await this.app.vault.create(pfad, inhalt);
        }
    }
}