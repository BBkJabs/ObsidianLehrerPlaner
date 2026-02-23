import { App, PluginSettingTab, Setting } from 'obsidian';
import LehrerplanerPlugin from './main';

export class LehrerplanerSettingTab extends PluginSettingTab {
    plugin: LehrerplanerPlugin;

    constructor(app: App, plugin: LehrerplanerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Lehrerplaner Einstellungen' });

        new Setting(containerEl)
            .setName('Daten-Datei')
            .setDesc('Pfad zur JSON-Datei, in der alle Planungsdaten gespeichert werden.')
            .addText(text => text
                .setPlaceholder('lehrerplaner-data.json')
                .setValue(this.plugin.settings.dataFilePath)
                .onChange(async (value) => {
                    this.plugin.settings.dataFilePath = value;
                    await this.plugin.saveSettings();
                }));

        containerEl.createEl('h3', { text: 'Schuljahre' });
        
        const schuljahreContainer = containerEl.createDiv('schuljahre-container');
        this.renderSchuljahre(schuljahreContainer);

        new Setting(containerEl)
            .addButton(button => button
                .setButtonText('Neues Schuljahr hinzufügen')
                .onClick(async () => {
                    const neuesSchuljahr = {
                        id: this.generateId(),
                        name: 'Neues Schuljahr',
                        startDatum: new Date().toISOString().split('T')[0],
                        endDatum: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                        halbjahresWechsel: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]
                    };
                    this.plugin.data.schuljahre.push(neuesSchuljahr);
                    await this.plugin.storageService.saveData(this.plugin.data);
                    this.renderSchuljahre(schuljahreContainer);
                }));
    }

    private renderSchuljahre(container: HTMLElement) {
        container.empty();
        
        if (this.plugin.data.schuljahre.length === 0) {
            container.createEl('p', { text: 'Noch keine Schuljahre angelegt.' });
            return;
        }

        this.plugin.data.schuljahre.forEach((sj, index) => {
            const sjDiv = container.createDiv('schuljahr-item');
            sjDiv.style.border = '1px solid var(--background-modifier-border)';
            sjDiv.style.padding = '10px';
            sjDiv.style.marginBottom = '10px';
            sjDiv.style.borderRadius = '5px';

            new Setting(sjDiv)
                .setName('Name')
                .addText(text => text
                    .setValue(sj.name)
                    .onChange(async (value) => {
                        sj.name = value;
                        await this.plugin.storageService.saveData(this.plugin.data);
                    }));

            new Setting(sjDiv)
                .setName('Startdatum')
                .addText(text => text
                    .setValue(sj.startDatum)
                    .onChange(async (value) => {
                        sj.startDatum = value;
                        await this.plugin.storageService.saveData(this.plugin.data);
                    }));

            new Setting(sjDiv)
                .setName('Enddatum')
                .addText(text => text
                    .setValue(sj.endDatum)
                    .onChange(async (value) => {
                        sj.endDatum = value;
                        await this.plugin.storageService.saveData(this.plugin.data);
                    }));

            new Setting(sjDiv)
                .setName('Halbjahreswechsel')
                .addText(text => text
                    .setValue(sj.halbjahresWechsel)
                    .onChange(async (value) => {
                        sj.halbjahresWechsel = value;
                        await this.plugin.storageService.saveData(this.plugin.data);
                    }));

            new Setting(sjDiv)
                .addButton(button => button
                    .setButtonText('Löschen')
                    .setWarning()
                    .onClick(async () => {
                        this.plugin.data.schuljahre.splice(index, 1);
                        await this.plugin.storageService.saveData(this.plugin.data);
                        this.renderSchuljahre(container);
                    }));
        });
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 15);
    }
}