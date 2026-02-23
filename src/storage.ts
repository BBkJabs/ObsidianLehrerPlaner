import { App, TFile } from 'obsidian';
import { LehrerplanerData, DEFAULT_DATA } from './models';

export class DataStorageService {
    private app: App;
    private dataFilePath: string;
    private data: LehrerplanerData;

    constructor(app: App, dataFilePath: string = 'lehrerplaner-data.json') {
        this.app = app;
        this.dataFilePath = dataFilePath;
        this.data = { ...DEFAULT_DATA };
    }

    async loadData(): Promise<LehrerplanerData> {
        const file = this.app.vault.getAbstractFileByPath(this.dataFilePath);
        
        if (file instanceof TFile) {
            try {
                const content = await this.app.vault.read(file);
                this.data = JSON.parse(content) as LehrerplanerData;
                return this.data;
            } catch (error) {
                console.error('Fehler beim Laden der Lehrerplaner-Daten:', error);
                return this.data;
            }
        } else {
            // Datei existiert noch nicht, erstelle sie mit Standarddaten
            await this.saveData(this.data);
            return this.data;
        }
    }

    async saveData(data: LehrerplanerData): Promise<void> {
        this.data = data;
        const content = JSON.stringify(this.data, null, 2);
        
        const file = this.app.vault.getAbstractFileByPath(this.dataFilePath);
        
        if (file instanceof TFile) {
            await this.app.vault.modify(file, content);
        } else {
            await this.app.vault.create(this.dataFilePath, content);
        }
    }

    getData(): LehrerplanerData {
        return this.data;
    }
}