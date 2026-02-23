import { ItemView, WorkspaceLeaf, Setting } from 'obsidian';
import LehrerplanerPlugin from './main';

export const VIEW_TYPE_LEHRERPLANER = 'lehrerplaner-view';

export class LehrerplanerView extends ItemView {
    plugin: LehrerplanerPlugin;
    activeTab: string = 'Übersicht';

    constructor(leaf: WorkspaceLeaf, plugin: LehrerplanerPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_LEHRERPLANER;
    }

    getDisplayText(): string {
        return 'Lehrerplaner';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        
        container.createEl('h2', { text: 'Lehrerplaner' });
        
        // Tab Navigation
        const tabBar = container.createDiv('lehrerplaner-view-tab-bar');
        tabBar.style.display = 'flex';
        tabBar.style.borderBottom = '1px solid var(--background-modifier-border)';
        tabBar.style.marginBottom = '20px';

        const tabs = ['Übersicht', 'Stammdaten (Klassen & Fächer)', 'Stundenplan', 'Unterrichtsplanung'];

        tabs.forEach(tab => {
            const tabEl = tabBar.createDiv('lehrerplaner-view-tab');
            tabEl.setText(tab);
            tabEl.style.padding = '10px 20px';
            tabEl.style.cursor = 'pointer';
            tabEl.style.borderBottom = this.activeTab === tab ? '2px solid var(--interactive-accent)' : 'none';
            tabEl.style.color = this.activeTab === tab ? 'var(--text-normal)' : 'var(--text-muted)';
            tabEl.style.fontWeight = this.activeTab === tab ? 'bold' : 'normal';

            tabEl.addEventListener('click', () => {
                this.activeTab = tab;
                this.onOpen(); // Re-render with new active tab
            });
        });

        const contentDiv = container.createDiv('lehrerplaner-content');
        
        if (this.activeTab === 'Übersicht') {
            this.renderUebersicht(contentDiv);
        } else if (this.activeTab === 'Stammdaten (Klassen & Fächer)') {
            this.renderStammdaten(contentDiv);
        } else if (this.activeTab === 'Stundenplan') {
            this.renderStundenplan(contentDiv);
        } else if (this.activeTab === 'Unterrichtsplanung') {
            this.renderUnterrichtsplanung(contentDiv);
        }
    }

    private renderUebersicht(container: HTMLElement) {
        const statsDiv = container.createDiv('lehrerplaner-stats');
        statsDiv.createEl('h3', { text: 'Statistiken' });
        statsDiv.createEl('p', { text: `Anzahl Schuljahre: ${this.plugin.data.schuljahre.length}` });
        statsDiv.createEl('p', { text: `Anzahl Ferien: ${this.plugin.data.ferien.length}` });
        statsDiv.createEl('p', { text: `Anzahl Feiertage: ${this.plugin.data.feiertage.length}` });
        statsDiv.createEl('p', { text: `Anzahl Bildungsgänge: ${this.plugin.data.bildungsgaenge.length}` });
        statsDiv.createEl('p', { text: `Anzahl Klassen: ${this.plugin.data.klassen.length}` });
        statsDiv.createEl('p', { text: `Anzahl Fächer: ${this.plugin.data.faecher.length}` });
        statsDiv.createEl('p', { text: `Anzahl Kurse: ${this.plugin.data.kurse.length}` });
        
        const actionDiv = container.createDiv('lehrerplaner-actions');
        actionDiv.style.marginTop = '20px';
        const btn = actionDiv.createEl('button', { text: 'Daten neu laden' });
        btn.addEventListener('click', async () => {
            this.plugin.data = await this.plugin.storageService.loadData();
            this.onOpen(); // View neu rendern
        });
    }

    private renderStammdaten(container: HTMLElement) {
        container.createEl('h3', { text: 'Klassen' });
        const klassenContainer = container.createDiv('klassen-container');
        
        if (this.plugin.data.klassen.length === 0) {
            klassenContainer.createEl('p', { text: 'Noch keine Klassen angelegt.' });
        } else {
            this.plugin.data.klassen.forEach((klasse, index) => {
                const kDiv = klassenContainer.createDiv('klasse-item');
                kDiv.style.border = '1px solid var(--background-modifier-border)';
                kDiv.style.padding = '10px';
                kDiv.style.marginBottom = '10px';
                kDiv.style.borderRadius = '5px';
                kDiv.style.display = 'flex';
                kDiv.style.flexDirection = 'column';
                kDiv.style.gap = '10px';

                const editDiv = kDiv.createDiv();
                editDiv.style.display = 'flex';
                editDiv.style.gap = '10px';
                editDiv.style.alignItems = 'center';
                editDiv.style.flexWrap = 'wrap';

                // Name Input
                const nameInput = editDiv.createEl('input', { type: 'text', value: klasse.name });
                nameInput.placeholder = 'Klassenname (z.B. 24-hbfi)';
                nameInput.addEventListener('change', async (e) => {
                    klasse.name = (e.target as HTMLInputElement).value;
                    await this.plugin.storageService.saveData(this.plugin.data);
                });

                // Jahrgang Input
                const jahrgangInput = editDiv.createEl('input', { type: 'number', value: klasse.jahrgang.toString() });
                jahrgangInput.style.width = '60px';
                jahrgangInput.addEventListener('change', async (e) => {
                    klasse.jahrgang = parseInt((e.target as HTMLInputElement).value);
                    await this.plugin.storageService.saveData(this.plugin.data);
                });

                // Bildungsgang Select
                const bgSelect = editDiv.createEl('select');
                this.plugin.data.bildungsgaenge.forEach(bg => {
                    const option = bgSelect.createEl('option', { value: bg.id, text: bg.kurzName });
                    if (bg.id === klasse.bildungsgangId) option.selected = true;
                });
                bgSelect.addEventListener('change', async (e) => {
                    klasse.bildungsgangId = (e.target as HTMLSelectElement).value;
                    await this.plugin.storageService.saveData(this.plugin.data);
                });

                const btn = editDiv.createEl('button', { text: 'Löschen' });
                btn.style.backgroundColor = 'var(--background-modifier-error)';
                btn.style.marginLeft = 'auto';
                btn.addEventListener('click', async () => {
                    this.plugin.data.klassen.splice(index, 1);
                    await this.plugin.storageService.saveData(this.plugin.data);
                    this.onOpen();
                });
            });
        }

        new Setting(container)
            .addButton(button => button
                .setButtonText('Neue Klasse hinzufügen')
                .onClick(async () => {
                    if (this.plugin.data.bildungsgaenge.length === 0) {
                        alert('Bitte lege zuerst einen Bildungsgang in den Einstellungen an.');
                        return;
                    }
                    const jahrgang = new Date().getFullYear() % 100;
                    const bg = this.plugin.data.bildungsgaenge[0];
                    const neueKlasse = {
                        id: Math.random().toString(36).substring(2, 15),
                        name: `${jahrgang}-${bg.kurzName}`,
                        jahrgang: jahrgang,
                        bildungsgangId: bg.id
                    };
                    this.plugin.data.klassen.push(neueKlasse);
                    await this.plugin.storageService.saveData(this.plugin.data);
                    this.onOpen();
                }));

        container.createEl('hr');
        container.createEl('h3', { text: 'Fächer' });
        const faecherContainer = container.createDiv('faecher-container');
        
        if (this.plugin.data.faecher.length === 0) {
            faecherContainer.createEl('p', { text: 'Noch keine Fächer angelegt.' });
        } else {
            this.plugin.data.faecher.forEach((fach, index) => {
                const fDiv = faecherContainer.createDiv('fach-item');
                fDiv.style.border = '1px solid var(--background-modifier-border)';
                fDiv.style.padding = '10px';
                fDiv.style.marginBottom = '10px';
                fDiv.style.borderRadius = '5px';
                fDiv.style.display = 'flex';
                fDiv.style.gap = '10px';
                fDiv.style.alignItems = 'center';

                const langNameInput = fDiv.createEl('input', { type: 'text', value: fach.langName });
                langNameInput.placeholder = 'Langname (z.B. Software)';
                langNameInput.addEventListener('change', async (e) => {
                    fach.langName = (e.target as HTMLInputElement).value;
                    await this.plugin.storageService.saveData(this.plugin.data);
                });

                const kurzNameInput = fDiv.createEl('input', { type: 'text', value: fach.kurzName });
                kurzNameInput.placeholder = 'Kurzname (z.B. sow)';
                kurzNameInput.style.width = '80px';
                kurzNameInput.addEventListener('change', async (e) => {
                    fach.kurzName = (e.target as HTMLInputElement).value;
                    await this.plugin.storageService.saveData(this.plugin.data);
                });

                const btn = fDiv.createEl('button', { text: 'Löschen' });
                btn.style.backgroundColor = 'var(--background-modifier-error)';
                btn.style.marginLeft = 'auto';
                btn.addEventListener('click', async () => {
                    this.plugin.data.faecher.splice(index, 1);
                    await this.plugin.storageService.saveData(this.plugin.data);
                    this.onOpen();
                });
            });
        }

        new Setting(container)
            .addButton(button => button
                .setButtonText('Neues Fach hinzufügen')
                .onClick(async () => {
                    const neuesFach = {
                        id: Math.random().toString(36).substring(2, 15),
                        langName: 'Neues Fach',
                        kurzName: 'neu'
                    };
                    this.plugin.data.faecher.push(neuesFach);
                    await this.plugin.storageService.saveData(this.plugin.data);
                    this.onOpen();
                }));
    }

    private renderStundenplan(container: HTMLElement) {
        container.createEl('h3', { text: 'Stundenplan' });
        container.createEl('p', { text: 'Hier wird in Kürze die Stundenplan-Verwaltung implementiert.' });
    }

    private renderUnterrichtsplanung(container: HTMLElement) {
        container.createEl('h3', { text: 'Unterrichtsplanung & Diff-View' });
        
        if (this.plugin.data.schuljahre.length === 0 || this.plugin.data.klassen.length === 0 || this.plugin.data.faecher.length === 0) {
            container.createEl('p', { text: 'Bitte lege zuerst Schuljahre, Klassen und Fächer an.' });
            return;
        }

        // Auswahlbereich für Schuljahr, Klasse und Fach
        const filterDiv = container.createDiv('lehrerplaner-filter');
        filterDiv.style.display = 'flex';
        filterDiv.style.gap = '10px';
        filterDiv.style.marginBottom = '20px';
        filterDiv.style.alignItems = 'center';

        // Schuljahr Dropdown
        const sjSelect = filterDiv.createEl('select');
        this.plugin.data.schuljahre.forEach(sj => {
            sjSelect.createEl('option', { value: sj.id, text: sj.name });
        });

        // Klasse Dropdown
        const klasseSelect = filterDiv.createEl('select');
        this.plugin.data.klassen.forEach(k => {
            klasseSelect.createEl('option', { value: k.id, text: k.name });
        });

        // Fach Dropdown
        const fachSelect = filterDiv.createEl('select');
        this.plugin.data.faecher.forEach(f => {
            fachSelect.createEl('option', { value: f.id, text: f.langName });
        });

        const loadBtn = filterDiv.createEl('button', { text: 'Laden' });
        
        const diffContainer = container.createDiv('lehrerplaner-diff-container');

        loadBtn.addEventListener('click', () => {
            this.renderDiffView(
                diffContainer, 
                sjSelect.value, 
                klasseSelect.value, 
                fachSelect.value
            );
        });
    }

    private renderDiffView(container: HTMLElement, schuljahrId: string, klasseId: string, fachId: string) {
        container.empty();
        
        const schuljahr = this.plugin.data.schuljahre.find(sj => sj.id === schuljahrId);
        const klasse = this.plugin.data.klassen.find(k => k.id === klasseId);
        const fach = this.plugin.data.faecher.find(f => f.id === fachId);

        if (!schuljahr || !klasse || !fach) return;

        container.createEl('h4', { text: `Planung für ${klasse.name} in ${fach.kurzName} (${schuljahr.name})` });

        // 1. Berechne mögliche Stunden (vereinfacht: 2 Stunden pro Schulwoche als Dummy-Annahme, 
        // da der echte Stundenplan noch nicht implementiert ist)
        // In einer echten Implementierung würde hier der KalenderService und UnterrichtsService genutzt werden
        const wochen = 40; // Ca. 40 Schulwochen pro Jahr
        const stundenProWoche = 2; // Dummy-Wert
        const moeglicheStunden = wochen * stundenProWoche;

        // 2. Finde den passenden Kurs (falls vorhanden)
        const kurs = this.plugin.data.kurse.find(k => k.bildungsgangId === klasse.bildungsgangId && k.fachId === fach.id);
        
        // 3. Berechne geplante Stunden aus Unterrichtseinheiten
        let geplanteStunden = 0;
        let einheiten: any[] = [];
        
        if (kurs) {
            einheiten = this.plugin.data.unterrichtseinheiten.filter(ue => ue.kursId === kurs.id);
            geplanteStunden = einheiten.reduce((sum, ue) => sum + ue.dauerInStunden, 0);
        }

        // Diff-Anzeige
        const diffDiv = container.createDiv('lehrerplaner-diff-stats');
        diffDiv.style.display = 'flex';
        diffDiv.style.gap = '20px';
        diffDiv.style.padding = '15px';
        diffDiv.style.backgroundColor = 'var(--background-secondary)';
        diffDiv.style.borderRadius = '8px';
        diffDiv.style.marginBottom = '20px';

        const diff = moeglicheStunden - geplanteStunden;
        const diffColor = diff < 0 ? 'var(--text-error)' : (diff > 0 ? 'var(--text-warning)' : 'var(--text-success)');

        diffDiv.createDiv().innerHTML = `<strong>Mögliche Stunden:</strong> <br><span style="font-size: 1.5em">${moeglicheStunden}</span>`;
        diffDiv.createDiv().innerHTML = `<strong>Geplante Stunden:</strong> <br><span style="font-size: 1.5em">${geplanteStunden}</span>`;
        diffDiv.createDiv().innerHTML = `<strong>Differenz:</strong> <br><span style="font-size: 1.5em; color: ${diffColor}">${diff > 0 ? '+' : ''}${diff}</span>`;

        // Liste der Unterrichtseinheiten
        container.createEl('h5', { text: 'Unterrichtseinheiten' });
        
        if (!kurs) {
            container.createEl('p', { text: 'Für diese Kombination aus Bildungsgang und Fach existiert noch kein Kurs. Bitte lege zuerst einen Kurs an.' });
            return;
        }

        if (einheiten.length === 0) {
            container.createEl('p', { text: 'Noch keine Unterrichtseinheiten für diesen Kurs geplant.' });
        } else {
            const list = container.createEl('ul');
            einheiten.sort((a, b) => a.reihenfolge - b.reihenfolge).forEach(ue => {
                const li = list.createEl('li');
                li.style.marginBottom = '10px';
                li.innerHTML = `<strong>${ue.titel}</strong> (${ue.dauerInStunden} Stunden)<br><small>${ue.beschreibung}</small>`;
            });
        }

        // Button zum Hinzufügen einer neuen Einheit
        const addBtn = container.createEl('button', { text: '+ Neue Unterrichtseinheit' });
        addBtn.style.marginTop = '10px';
        addBtn.addEventListener('click', async () => {
            const neueEinheit = {
                id: Math.random().toString(36).substring(2, 15),
                kursId: kurs.id,
                titel: 'Neue Einheit',
                beschreibung: 'Beschreibung hier einfügen...',
                dauerInStunden: 2,
                reihenfolge: einheiten.length + 1
            };
            this.plugin.data.unterrichtseinheiten.push(neueEinheit);
            await this.plugin.storageService.saveData(this.plugin.data);
            this.renderDiffView(container, schuljahrId, klasseId, fachId); // Neu rendern
        });
    }

    async onClose() {
        // Aufräumen, wenn die View geschlossen wird
    }
}