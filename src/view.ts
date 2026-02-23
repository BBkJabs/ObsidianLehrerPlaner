import { ItemView, WorkspaceLeaf, Setting } from 'obsidian';
import LehrerplanerPlugin from './main';
import { KalenderService } from './kalender';
import { UnterrichtsService } from './unterricht';

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

        container.createEl('hr');
        container.createEl('h3', { text: 'Kurse' });
        const kurseContainer = container.createDiv('kurse-container');
        
        if (this.plugin.data.kurse.length === 0) {
            kurseContainer.createEl('p', { text: 'Noch keine Kurse angelegt.' });
        } else {
            this.plugin.data.kurse.forEach((kurs, index) => {
                const kDiv = kurseContainer.createDiv('kurs-item');
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
                const nameInput = editDiv.createEl('input', { type: 'text', value: kurs.name });
                nameInput.placeholder = 'Kursname (z.B. hbfiu-sow)';
                nameInput.addEventListener('change', async (e) => {
                    kurs.name = (e.target as HTMLInputElement).value;
                    await this.plugin.storageService.saveData(this.plugin.data);
                });

                // Bildungsgang Select
                const bgSelect = editDiv.createEl('select');
                this.plugin.data.bildungsgaenge.forEach(bg => {
                    const option = bgSelect.createEl('option', { value: bg.id, text: bg.kurzName });
                    if (bg.id === kurs.bildungsgangId) option.selected = true;
                });
                bgSelect.addEventListener('change', async (e) => {
                    kurs.bildungsgangId = (e.target as HTMLSelectElement).value;
                    await this.plugin.storageService.saveData(this.plugin.data);
                });

                // Stufe Select
                const stufeSelect = editDiv.createEl('select');
                const stufen = [
                    { value: 'u', text: 'Unterstufe' },
                    { value: 'm', text: 'Mittelstufe' },
                    { value: 'o', text: 'Oberstufe' }
                ];
                stufen.forEach(s => {
                    const option = stufeSelect.createEl('option', { value: s.value, text: s.text });
                    if (s.value === kurs.stufenBezeichnung) option.selected = true;
                });
                stufeSelect.addEventListener('change', async (e) => {
                    kurs.stufenBezeichnung = (e.target as HTMLSelectElement).value as 'u' | 'm' | 'o';
                    await this.plugin.storageService.saveData(this.plugin.data);
                });

                // Fach Select
                const fachSelect = editDiv.createEl('select');
                this.plugin.data.faecher.forEach(f => {
                    const option = fachSelect.createEl('option', { value: f.id, text: f.kurzName });
                    if (f.id === kurs.fachId) option.selected = true;
                });
                fachSelect.addEventListener('change', async (e) => {
                    kurs.fachId = (e.target as HTMLSelectElement).value;
                    await this.plugin.storageService.saveData(this.plugin.data);
                });

                const btn = editDiv.createEl('button', { text: 'Löschen' });
                btn.style.backgroundColor = 'var(--background-modifier-error)';
                btn.style.marginLeft = 'auto';
                btn.addEventListener('click', async () => {
                    this.plugin.data.kurse.splice(index, 1);
                    await this.plugin.storageService.saveData(this.plugin.data);
                    this.onOpen();
                });
            });
        }

        new Setting(container)
            .addButton(button => button
                .setButtonText('Neuen Kurs hinzufügen')
                .onClick(async () => {
                    if (this.plugin.data.bildungsgaenge.length === 0 || this.plugin.data.faecher.length === 0) {
                        alert('Bitte lege zuerst mindestens einen Bildungsgang und ein Fach an.');
                        return;
                    }
                    const bg = this.plugin.data.bildungsgaenge[0];
                    const fach = this.plugin.data.faecher[0];
                    const neuerKurs = {
                        id: Math.random().toString(36).substring(2, 15),
                        bildungsgangId: bg.id,
                        stufenBezeichnung: 'u' as 'u' | 'm' | 'o',
                        fachId: fach.id,
                        name: `${bg.kurzName}u-${fach.kurzName}`
                    };
                    this.plugin.data.kurse.push(neuerKurs);
                    await this.plugin.storageService.saveData(this.plugin.data);
                    this.onOpen();
                }));
    }

    private renderStundenplan(container: HTMLElement) {
        container.createEl('h3', { text: 'Stundenplan' });
        
        if (this.plugin.data.schuljahre.length === 0) {
            container.createEl('p', { text: 'Bitte lege zuerst ein Schuljahr in den Einstellungen an.' });
            return;
        }

        // Schuljahr Auswahl
        const filterDiv = container.createDiv('stundenplan-filter');
        filterDiv.style.marginBottom = '20px';
        
        const sjSelect = filterDiv.createEl('select');
        this.plugin.data.schuljahre.forEach(sj => {
            sjSelect.createEl('option', { value: sj.id, text: sj.name });
        });

        const planContainer = container.createDiv('stundenplan-container');

        const renderPlan = () => {
            planContainer.empty();
            const schuljahrId = sjSelect.value;
            
            // Finde Stundenpläne für dieses Schuljahr
            const plaene = this.plugin.data.stundenplaene.filter(sp => sp.schuljahrId === schuljahrId);
            
            if (plaene.length === 0) {
                planContainer.createEl('p', { text: 'Noch kein Stundenplan für dieses Schuljahr angelegt.' });
            } else {
                plaene.forEach((plan, planIndex) => {
                    const pDiv = planContainer.createDiv('stundenplan-item');
                    pDiv.style.border = '1px solid var(--background-modifier-border)';
                    pDiv.style.padding = '15px';
                    pDiv.style.marginBottom = '20px';
                    pDiv.style.borderRadius = '5px';

                    const headerDiv = pDiv.createDiv();
                    headerDiv.style.display = 'flex';
                    headerDiv.style.justifyContent = 'space-between';
                    headerDiv.style.alignItems = 'center';
                    headerDiv.style.marginBottom = '15px';

                    const dateDiv = headerDiv.createDiv();
                    dateDiv.style.display = 'flex';
                    dateDiv.style.gap = '10px';
                    dateDiv.style.alignItems = 'center';

                    dateDiv.createEl('span', { text: 'Gültig ab:' });
                    const abInput = dateDiv.createEl('input', { type: 'date', value: plan.gueltigAb });
                    abInput.addEventListener('change', async (e) => {
                        plan.gueltigAb = (e.target as HTMLInputElement).value;
                        await this.plugin.storageService.saveData(this.plugin.data);
                    });

                    dateDiv.createEl('span', { text: 'Gültig bis (optional):' });
                    const bisInput = dateDiv.createEl('input', { type: 'date', value: plan.gueltigBis || '' });
                    bisInput.addEventListener('change', async (e) => {
                        plan.gueltigBis = (e.target as HTMLInputElement).value;
                        await this.plugin.storageService.saveData(this.plugin.data);
                    });

                    const delBtn = headerDiv.createEl('button', { text: 'Plan löschen' });
                    delBtn.style.backgroundColor = 'var(--background-modifier-error)';
                    delBtn.addEventListener('click', async () => {
                        const idx = this.plugin.data.stundenplaene.findIndex(p => p.id === plan.id);
                        if (idx > -1) {
                            this.plugin.data.stundenplaene.splice(idx, 1);
                            await this.plugin.storageService.saveData(this.plugin.data);
                            renderPlan();
                        }
                    });

                    // Tabelle für den Stundenplan
                    const table = pDiv.createEl('table');
                    table.style.width = '100%';
                    table.style.borderCollapse = 'collapse';
                    
                    const thead = table.createEl('thead');
                    const trHead = thead.createEl('tr');
                    trHead.createEl('th', { text: 'Stunde' }).style.border = '1px solid var(--background-modifier-border)';
                    const wochentage = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
                    wochentage.forEach(tag => {
                        trHead.createEl('th', { text: tag }).style.border = '1px solid var(--background-modifier-border)';
                    });

                    const tbody = table.createEl('tbody');
                    for (let stunde = 1; stunde <= 10; stunde++) {
                        const tr = tbody.createEl('tr');
                        tr.createEl('td', { text: `${stunde}.` }).style.border = '1px solid var(--background-modifier-border)';
                        tr.style.textAlign = 'center';

                        for (let tag = 1; tag <= 5; tag++) {
                            const td = tr.createEl('td');
                            td.style.border = '1px solid var(--background-modifier-border)';
                            td.style.padding = '5px';
                            td.style.verticalAlign = 'top';

                            // Finde Einträge für diese Zelle
                            const eintraege = plan.eintraege.filter(e => e.wochentag === tag && e.stunde === stunde);
                            
                            const cellDiv = td.createDiv();
                            cellDiv.style.display = 'flex';
                            cellDiv.style.flexDirection = 'column';
                            cellDiv.style.gap = '5px';

                            eintraege.forEach(eintrag => {
                                const eDiv = cellDiv.createDiv();
                                eDiv.style.backgroundColor = 'var(--background-secondary)';
                                eDiv.style.padding = '5px';
                                eDiv.style.borderRadius = '3px';
                                eDiv.style.fontSize = '0.9em';
                                eDiv.style.display = 'flex';
                                eDiv.style.justifyContent = 'space-between';
                                eDiv.style.alignItems = 'center';

                                const klasse = this.plugin.data.klassen.find(k => k.id === eintrag.klasseId);
                                const fach = this.plugin.data.faecher.find(f => f.id === eintrag.fachId);
                                
                                eDiv.createEl('span', { text: `${klasse ? klasse.name : '?'} - ${fach ? fach.kurzName : '?'}` });
                                
                                const delEintragBtn = eDiv.createEl('button', { text: 'x' });
                                delEintragBtn.style.padding = '0 5px';
                                delEintragBtn.style.backgroundColor = 'transparent';
                                delEintragBtn.style.color = 'var(--text-error)';
                                delEintragBtn.addEventListener('click', async () => {
                                    const eIdx = plan.eintraege.findIndex(e => e.id === eintrag.id);
                                    if (eIdx > -1) {
                                        plan.eintraege.splice(eIdx, 1);
                                        await this.plugin.storageService.saveData(this.plugin.data);
                                        renderPlan();
                                    }
                                });
                            });

                            // Button zum Hinzufügen eines Eintrags
                            const addEintragBtn = cellDiv.createEl('button', { text: '+' });
                            addEintragBtn.style.padding = '2px 5px';
                            addEintragBtn.style.marginTop = '5px';
                            addEintragBtn.addEventListener('click', () => {
                                // Einfacher Dialog zum Hinzufügen (in einer echten App besser als Modal)
                                const addDiv = cellDiv.createDiv();
                                addDiv.style.marginTop = '5px';
                                addDiv.style.display = 'flex';
                                addDiv.style.flexDirection = 'column';
                                addDiv.style.gap = '5px';
                                
                                const kSelect = addDiv.createEl('select');
                                this.plugin.data.klassen.forEach(k => kSelect.createEl('option', { value: k.id, text: k.name }));
                                
                                const fSelect = addDiv.createEl('select');
                                this.plugin.data.faecher.forEach(f => fSelect.createEl('option', { value: f.id, text: f.kurzName }));
                                
                                const saveBtn = addDiv.createEl('button', { text: 'Speichern' });
                                saveBtn.addEventListener('click', async () => {
                                    if (kSelect.value && fSelect.value) {
                                        plan.eintraege.push({
                                            id: Math.random().toString(36).substring(2, 15),
                                            klasseId: kSelect.value,
                                            fachId: fSelect.value,
                                            wochentag: tag,
                                            stunde: stunde
                                        });
                                        await this.plugin.storageService.saveData(this.plugin.data);
                                        renderPlan();
                                    }
                                });
                                
                                addEintragBtn.style.display = 'none';
                            });
                        }
                    }
                });
            }

            new Setting(planContainer)
                .addButton(button => button
                    .setButtonText('Neuen Stundenplan anlegen')
                    .onClick(async () => {
                        const sj = this.plugin.data.schuljahre.find(s => s.id === schuljahrId);
                        if (!sj) return;
                        
                        const neuerPlan = {
                            id: Math.random().toString(36).substring(2, 15),
                            schuljahrId: schuljahrId,
                            gueltigAb: sj.startDatum,
                            eintraege: []
                        };
                        this.plugin.data.stundenplaene.push(neuerPlan);
                        await this.plugin.storageService.saveData(this.plugin.data);
                        renderPlan();
                    }));
        };

        sjSelect.addEventListener('change', renderPlan);
        renderPlan(); // Initiales Rendern
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

        // 1. Berechne mögliche Stunden anhand des echten Stundenplans und Kalenders
        const kalenderService = new KalenderService(
            this.plugin.data.schuljahre,
            this.plugin.data.ferien,
            this.plugin.data.feiertage
        );
        
        const unterrichtsService = new UnterrichtsService(
            this.plugin.data.stundenplaene,
            this.plugin.data.unterrichtseinheiten,
            this.plugin.data.geplanteEinheiten,
            kalenderService
        );

        let moeglicheStunden = 0;
        const startDatum = new Date(schuljahr.startDatum);
        const endDatum = new Date(schuljahr.endDatum);
        
        // Iteriere über jeden Tag des Schuljahres
        for (let d = new Date(startDatum); d <= endDatum; d.setDate(d.getDate() + 1)) {
            // Überspringe Wochenenden, Ferien und Feiertage
            if (!kalenderService.istSchultag(d)) continue;
            
            // Hole die Stundenplaneinträge für diesen Tag, diese Klasse und dieses Fach
            const eintraege = unterrichtsService.getUnterrichtsstundenFuerKlasseUndFach(
                klasse.id,
                fach.id,
                d,
                schuljahr.id
            );
            
            moeglicheStunden += eintraege.length;
        }

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
            const list = container.createDiv('unterrichtseinheiten-liste');
            einheiten.sort((a, b) => a.reihenfolge - b.reihenfolge).forEach((ue, index) => {
                const ueDiv = list.createDiv('ue-item');
                ueDiv.style.border = '1px solid var(--background-modifier-border)';
                ueDiv.style.padding = '10px';
                ueDiv.style.marginBottom = '10px';
                ueDiv.style.borderRadius = '5px';
                ueDiv.style.display = 'flex';
                ueDiv.style.flexDirection = 'column';
                ueDiv.style.gap = '10px';

                const headerDiv = ueDiv.createDiv();
                headerDiv.style.display = 'flex';
                headerDiv.style.gap = '10px';
                headerDiv.style.alignItems = 'center';

                // Reihenfolge
                const orderInput = headerDiv.createEl('input', { type: 'number', value: ue.reihenfolge.toString() });
                orderInput.style.width = '50px';
                orderInput.title = 'Reihenfolge';
                orderInput.addEventListener('change', async (e) => {
                    ue.reihenfolge = parseInt((e.target as HTMLInputElement).value);
                    await this.plugin.storageService.saveData(this.plugin.data);
                    this.renderDiffView(container, schuljahrId, klasseId, fachId);
                });

                // Titel
                const titleInput = headerDiv.createEl('input', { type: 'text', value: ue.titel });
                titleInput.style.flexGrow = '1';
                titleInput.placeholder = 'Titel der Einheit';
                titleInput.addEventListener('change', async (e) => {
                    ue.titel = (e.target as HTMLInputElement).value;
                    await this.plugin.storageService.saveData(this.plugin.data);
                });

                // Dauer
                const dauerInput = headerDiv.createEl('input', { type: 'number', value: ue.dauerInStunden.toString() });
                dauerInput.style.width = '60px';
                dauerInput.title = 'Dauer in Stunden';
                dauerInput.addEventListener('change', async (e) => {
                    ue.dauerInStunden = parseInt((e.target as HTMLInputElement).value);
                    await this.plugin.storageService.saveData(this.plugin.data);
                    this.renderDiffView(container, schuljahrId, klasseId, fachId);
                });
                headerDiv.createEl('span', { text: 'Std.' });

                // Löschen Button
                const delBtn = headerDiv.createEl('button', { text: 'Löschen' });
                delBtn.style.backgroundColor = 'var(--background-modifier-error)';
                delBtn.addEventListener('click', async () => {
                    const ueIndex = this.plugin.data.unterrichtseinheiten.findIndex(u => u.id === ue.id);
                    if (ueIndex > -1) {
                        this.plugin.data.unterrichtseinheiten.splice(ueIndex, 1);
                        await this.plugin.storageService.saveData(this.plugin.data);
                        this.renderDiffView(container, schuljahrId, klasseId, fachId);
                    }
                });

                // Beschreibung
                const descInput = ueDiv.createEl('textarea');
                descInput.value = ue.beschreibung;
                descInput.placeholder = 'Beschreibung / Notizen zur Einheit...';
                descInput.style.width = '100%';
                descInput.style.minHeight = '60px';
                descInput.style.resize = 'vertical';
                descInput.addEventListener('change', async (e) => {
                    ue.beschreibung = (e.target as HTMLTextAreaElement).value;
                    await this.plugin.storageService.saveData(this.plugin.data);
                });
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