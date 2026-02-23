import { App, PluginSettingTab, Setting } from 'obsidian';
import LehrerplanerPlugin from './main';

export class LehrerplanerSettingTab extends PluginSettingTab {
    plugin: LehrerplanerPlugin;
    activeTab: string = 'Allgemein';

    constructor(app: App, plugin: LehrerplanerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Lehrerplaner Einstellungen' });

        // Tab Navigation
        const tabBar = containerEl.createDiv('lehrerplaner-tab-bar');
        tabBar.style.display = 'flex';
        tabBar.style.borderBottom = '1px solid var(--background-modifier-border)';
        tabBar.style.marginBottom = '20px';

        const tabs = ['Allgemein', 'Schuljahre', 'Ferien', 'Feiertage', 'Bildungsgänge'];

        tabs.forEach(tab => {
            const tabEl = tabBar.createDiv('lehrerplaner-tab');
            tabEl.setText(tab);
            tabEl.style.padding = '10px 20px';
            tabEl.style.cursor = 'pointer';
            tabEl.style.borderBottom = this.activeTab === tab ? '2px solid var(--interactive-accent)' : 'none';
            tabEl.style.color = this.activeTab === tab ? 'var(--text-normal)' : 'var(--text-muted)';
            tabEl.style.fontWeight = this.activeTab === tab ? 'bold' : 'normal';

            tabEl.addEventListener('click', () => {
                this.activeTab = tab;
                this.display(); // Re-render with new active tab
            });
        });

        const contentContainer = containerEl.createDiv('lehrerplaner-tab-content');

        if (this.activeTab === 'Allgemein') {
            new Setting(contentContainer)
                .setName('Daten-Datei')
                .setDesc('Pfad zur JSON-Datei, in der alle Planungsdaten gespeichert werden.')
                .addText(text => text
                    .setPlaceholder('lehrerplaner-data.json')
                    .setValue(this.plugin.settings.dataFilePath)
                    .onChange(async (value) => {
                        this.plugin.settings.dataFilePath = value;
                        await this.plugin.saveSettings();
                    }));
        } else if (this.activeTab === 'Schuljahre') {
            const schuljahreContainer = contentContainer.createDiv('schuljahre-container');
            this.renderSchuljahre(schuljahreContainer);

            new Setting(contentContainer)
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
        } else if (this.activeTab === 'Ferien') {
            const ferienContainer = contentContainer.createDiv('ferien-container');
            this.renderFerien(ferienContainer);

            new Setting(contentContainer)
                .addButton(button => button
                    .setButtonText('Neue Ferien hinzufügen')
                    .onClick(async () => {
                        const neueFerien = {
                            id: this.generateId(),
                            name: 'Neue Ferien',
                            startDatum: new Date().toISOString().split('T')[0],
                            endDatum: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0]
                        };
                        this.plugin.data.ferien.push(neueFerien);
                        await this.plugin.storageService.saveData(this.plugin.data);
                        this.renderFerien(ferienContainer);
                    }));
        } else if (this.activeTab === 'Feiertage') {
            const feiertageContainer = contentContainer.createDiv('feiertage-container');
            this.renderFeiertage(feiertageContainer);

            new Setting(contentContainer)
                .addButton(button => button
                    .setButtonText('Neuen Feiertag hinzufügen')
                    .onClick(async () => {
                        const neuerFeiertag = {
                            id: this.generateId(),
                            name: 'Neuer Feiertag',
                            datum: new Date().toISOString().split('T')[0]
                        };
                        this.plugin.data.feiertage.push(neuerFeiertag);
                        await this.plugin.storageService.saveData(this.plugin.data);
                        this.renderFeiertage(feiertageContainer);
                    }))
                .addButton(button => button
                    .setButtonText('Fixe NRW-Feiertage (aktuelles Jahr) hinzufügen')
                    .onClick(async () => {
                        const year = new Date().getFullYear();
                        const fixeFeiertage = [
                            { name: 'Neujahr', date: `${year}-01-01` },
                            { name: 'Tag der Arbeit', date: `${year}-05-01` },
                            { name: 'Tag der Deutschen Einheit', date: `${year}-10-03` },
                            { name: 'Allerheiligen', date: `${year}-11-01` },
                            { name: '1. Weihnachtstag', date: `${year}-12-25` },
                            { name: '2. Weihnachtstag', date: `${year}-12-26` }
                        ];
                        
                        let added = false;
                        for (const ft of fixeFeiertage) {
                            // Nur hinzufügen, wenn an diesem Datum noch kein Feiertag existiert
                            if (!this.plugin.data.feiertage.some(f => f.datum === ft.date)) {
                                this.plugin.data.feiertage.push({
                                    id: this.generateId(),
                                    name: ft.name,
                                    datum: ft.date
                                });
                                added = true;
                            }
                        }
                        
                        if (added) {
                            // Sortieren nach Datum
                            this.plugin.data.feiertage.sort((a, b) => a.datum.localeCompare(b.datum));
                            await this.plugin.storageService.saveData(this.plugin.data);
                            this.renderFeiertage(feiertageContainer);
                        }
                    }));
        } else if (this.activeTab === 'Bildungsgänge') {
            const bildungsgaengeContainer = contentContainer.createDiv('bildungsgaenge-container');
            this.renderBildungsgaenge(bildungsgaengeContainer);

            new Setting(contentContainer)
                .addButton(button => button
                    .setButtonText('Neuen Bildungsgang hinzufügen')
                    .onClick(async () => {
                        const neuerBildungsgang = {
                            id: this.generateId(),
                            langName: 'Neuer Bildungsgang',
                            kurzName: 'neu',
                            farbe: '#cccccc'
                        };
                        this.plugin.data.bildungsgaenge.push(neuerBildungsgang);
                        await this.plugin.storageService.saveData(this.plugin.data);
                        this.renderBildungsgaenge(bildungsgaengeContainer);
                    }));
        }
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
                .addText(text => {
                    text.inputEl.type = 'date';
                    return text
                        .setValue(sj.startDatum)
                        .onChange(async (value) => {
                            sj.startDatum = value;
                            await this.plugin.storageService.saveData(this.plugin.data);
                        });
                });

            new Setting(sjDiv)
                .setName('Enddatum')
                .addText(text => {
                    text.inputEl.type = 'date';
                    return text
                        .setValue(sj.endDatum)
                        .onChange(async (value) => {
                            sj.endDatum = value;
                            await this.plugin.storageService.saveData(this.plugin.data);
                        });
                });

            new Setting(sjDiv)
                .setName('Halbjahreswechsel')
                .addText(text => {
                    text.inputEl.type = 'date';
                    return text
                        .setValue(sj.halbjahresWechsel)
                        .onChange(async (value) => {
                            sj.halbjahresWechsel = value;
                            await this.plugin.storageService.saveData(this.plugin.data);
                        });
                });

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

    private renderFerien(container: HTMLElement) {
        container.empty();
        
        if (this.plugin.data.ferien.length === 0) {
            container.createEl('p', { text: 'Noch keine Ferien angelegt.' });
            return;
        }

        this.plugin.data.ferien.forEach((f, index) => {
            const fDiv = container.createDiv('ferien-item');
            fDiv.style.border = '1px solid var(--background-modifier-border)';
            fDiv.style.padding = '10px';
            fDiv.style.marginBottom = '10px';
            fDiv.style.borderRadius = '5px';

            new Setting(fDiv)
                .setName('Name')
                .addText(text => text
                    .setValue(f.name)
                    .onChange(async (value) => {
                        f.name = value;
                        await this.plugin.storageService.saveData(this.plugin.data);
                    }));

            new Setting(fDiv)
                .setName('Startdatum')
                .addText(text => {
                    text.inputEl.type = 'date';
                    return text
                        .setValue(f.startDatum)
                        .onChange(async (value) => {
                            f.startDatum = value;
                            await this.plugin.storageService.saveData(this.plugin.data);
                        });
                });

            new Setting(fDiv)
                .setName('Enddatum')
                .addText(text => {
                    text.inputEl.type = 'date';
                    return text
                        .setValue(f.endDatum)
                        .onChange(async (value) => {
                            f.endDatum = value;
                            await this.plugin.storageService.saveData(this.plugin.data);
                        });
                });

            new Setting(fDiv)
                .addButton(button => button
                    .setButtonText('Löschen')
                    .setWarning()
                    .onClick(async () => {
                        this.plugin.data.ferien.splice(index, 1);
                        await this.plugin.storageService.saveData(this.plugin.data);
                        this.renderFerien(container);
                    }));
        });
    }

    private renderFeiertage(container: HTMLElement) {
        container.empty();
        
        if (this.plugin.data.feiertage.length === 0) {
            container.createEl('p', { text: 'Noch keine Feiertage angelegt.' });
            return;
        }

        this.plugin.data.feiertage.forEach((f, index) => {
            const fDiv = container.createDiv('feiertage-item');
            fDiv.style.border = '1px solid var(--background-modifier-border)';
            fDiv.style.padding = '10px';
            fDiv.style.marginBottom = '10px';
            fDiv.style.borderRadius = '5px';

            new Setting(fDiv)
                .setName('Name')
                .addText(text => text
                    .setValue(f.name)
                    .onChange(async (value) => {
                        f.name = value;
                        await this.plugin.storageService.saveData(this.plugin.data);
                    }));

            new Setting(fDiv)
                .setName('Datum')
                .addText(text => {
                    text.inputEl.type = 'date';
                    return text
                        .setValue(f.datum)
                        .onChange(async (value) => {
                            f.datum = value;
                            await this.plugin.storageService.saveData(this.plugin.data);
                        });
                });

            new Setting(fDiv)
                .addButton(button => button
                    .setButtonText('Löschen')
                    .setWarning()
                    .onClick(async () => {
                        this.plugin.data.feiertage.splice(index, 1);
                        await this.plugin.storageService.saveData(this.plugin.data);
                        this.renderFeiertage(container);
                    }));
        });
    }

    private renderBildungsgaenge(container: HTMLElement) {
        container.empty();
        
        if (this.plugin.data.bildungsgaenge.length === 0) {
            container.createEl('p', { text: 'Noch keine Bildungsgänge angelegt.' });
            return;
        }

        this.plugin.data.bildungsgaenge.forEach((b, index) => {
            const bDiv = container.createDiv('bildungsgaenge-item');
            bDiv.style.border = '1px solid var(--background-modifier-border)';
            bDiv.style.padding = '10px';
            bDiv.style.marginBottom = '10px';
            bDiv.style.borderRadius = '5px';

            new Setting(bDiv)
                .setName('Langname')
                .addText(text => text
                    .setValue(b.langName)
                    .onChange(async (value) => {
                        b.langName = value;
                        await this.plugin.storageService.saveData(this.plugin.data);
                    }));

            new Setting(bDiv)
                .setName('Kurzname')
                .addText(text => text
                    .setValue(b.kurzName)
                    .onChange(async (value) => {
                        b.kurzName = value;
                        await this.plugin.storageService.saveData(this.plugin.data);
                    }));

            new Setting(bDiv)
                .setName('Farbe')
                .addText(text => {
                    text.inputEl.type = 'color';
                    text.inputEl.style.padding = '0';
                    text.inputEl.style.width = '50px';
                    text.inputEl.style.height = '30px';
                    text.inputEl.style.cursor = 'pointer';
                    return text
                        .setValue(b.farbe)
                        .onChange(async (value) => {
                            b.farbe = value;
                            await this.plugin.storageService.saveData(this.plugin.data);
                        });
                });

            new Setting(bDiv)
                .addButton(button => button
                    .setButtonText('Löschen')
                    .setWarning()
                    .onClick(async () => {
                        this.plugin.data.bildungsgaenge.splice(index, 1);
                        await this.plugin.storageService.saveData(this.plugin.data);
                        this.renderBildungsgaenge(container);
                    }));
        });
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 15);
    }
}