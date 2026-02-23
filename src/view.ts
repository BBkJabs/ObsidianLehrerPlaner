import { ItemView, WorkspaceLeaf } from 'obsidian';
import LehrerplanerPlugin from './main';

export const VIEW_TYPE_LEHRERPLANER = 'lehrerplaner-view';

export class LehrerplanerView extends ItemView {
    plugin: LehrerplanerPlugin;

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
        
        container.createEl('h2', { text: 'Unterrichtsplanung' });
        
        const contentDiv = container.createDiv('lehrerplaner-content');
        
        // Hier würde die komplexe UI für die Unterrichtsplanung hinkommen
        // Für den Anfang zeigen wir nur eine einfache Übersicht
        
        const statsDiv = contentDiv.createDiv('lehrerplaner-stats');
        statsDiv.createEl('p', { text: `Anzahl Schuljahre: ${this.plugin.data.schuljahre.length}` });
        statsDiv.createEl('p', { text: `Anzahl Ferien: ${this.plugin.data.ferien.length}` });
        statsDiv.createEl('p', { text: `Anzahl Feiertage: ${this.plugin.data.feiertage.length}` });
        statsDiv.createEl('p', { text: `Anzahl Bildungsgänge: ${this.plugin.data.bildungsgaenge.length}` });
        statsDiv.createEl('p', { text: `Anzahl Klassen: ${this.plugin.data.klassen.length}` });
        statsDiv.createEl('p', { text: `Anzahl Kurse: ${this.plugin.data.kurse.length}` });
        
        const actionDiv = contentDiv.createDiv('lehrerplaner-actions');
        const btn = actionDiv.createEl('button', { text: 'Daten neu laden' });
        btn.addEventListener('click', async () => {
            this.plugin.data = await this.plugin.storageService.loadData();
            this.onOpen(); // View neu rendern
        });
    }

    async onClose() {
        // Aufräumen, wenn die View geschlossen wird
    }
}