import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import { DataStorageService } from './storage';
import { LehrerplanerData } from './models';
import { LehrerplanerSettingTab } from './settings';
import { LehrerplanerView, VIEW_TYPE_LEHRERPLANER } from './view';

export interface LehrerplanerSettings {
	mySetting: string;
	dataFilePath: string;
}

const DEFAULT_SETTINGS: LehrerplanerSettings = {
	mySetting: 'default',
	dataFilePath: 'lehrerplaner-data.json'
}

export default class LehrerplanerPlugin extends Plugin {
	settings: LehrerplanerSettings;
	storageService: DataStorageService;
	data: LehrerplanerData;

	async onload() {
		await this.loadSettings();

		this.storageService = new DataStorageService(this.app, this.settings.dataFilePath);
		this.data = await this.storageService.loadData();

		// Registriere die View
		this.registerView(
			VIEW_TYPE_LEHRERPLANER,
			(leaf) => new LehrerplanerView(leaf, this)
		);

		// Füge einen Ribbon-Icon hinzu, um die View zu öffnen
		this.addRibbonIcon('calendar-with-checkmark', 'Lehrerplaner öffnen', () => {
			this.activateView();
		});

		// Füge einen Command hinzu, um die View zu öffnen
		this.addCommand({
			id: 'open-lehrerplaner-view',
			name: 'Lehrerplaner öffnen',
			callback: () => {
				this.activateView();
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new LehrerplanerSettingTab(this.app, this));
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_LEHRERPLANER);

		if (leaves.length > 0) {
			// View ist bereits offen, aktiviere sie
			leaf = leaves[0];
		} else {
			// View ist noch nicht offen, erstelle eine neue im rechten Sidebar
			leaf = workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({ type: VIEW_TYPE_LEHRERPLANER, active: true });
			}
		}

		// Fokussiere die View
		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}