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
                kDiv.style.justifyContent = 'space-between';
                kDiv.style.alignItems = 'center';

                const infoDiv = kDiv.createDiv();
                infoDiv.createEl('strong', { text: klasse.name });
                const bg = this.plugin.data.bildungsgaenge.find(b => b.id === klasse.bildungsgangId);
                infoDiv.createEl('span', { text: ` (Jahrgang: ${klasse.jahrgang}, Bildungsgang: ${bg ? bg.kurzName : 'Unbekannt'})` });

                const btn = kDiv.createEl('button', { text: 'Löschen' });
                btn.style.backgroundColor = 'var(--background-modifier-error)';
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
                    const neueKlasse = {
                        id: Math.random().toString(36).substring(2, 15),
                        name: 'Neue Klasse',
                        jahrgang: new Date().getFullYear() % 100,
                        bildungsgangId: this.plugin.data.bildungsgaenge[0].id
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
                fDiv.style.justifyContent = 'space-between';
                fDiv.style.alignItems = 'center';

                const infoDiv = fDiv.createDiv();
                infoDiv.createEl('strong', { text: fach.langName });
                infoDiv.createEl('span', { text: ` (${fach.kurzName})` });

                const btn = fDiv.createEl('button', { text: 'Löschen' });
                btn.style.backgroundColor = 'var(--background-modifier-error)';
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
        container.createEl('p', { text: 'Hier wird in Kürze die komplexe Ansicht zur Unterrichtsplanung (Geplante vs. Mögliche Stunden) implementiert.' });
    }

    async onClose() {
        // Aufräumen, wenn die View geschlossen wird
    }
}