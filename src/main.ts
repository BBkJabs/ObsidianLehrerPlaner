import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { DataStorageService } from './storage';
import { LehrerplanerData } from './models';
import { LehrerplanerSettingTab } from './settings';

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

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new LehrerplanerSettingTab(this.app, this));
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