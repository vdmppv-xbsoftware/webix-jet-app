import {JetView} from "webix-jet";

import SettingsPopup from "./settingsPopup";
import SettingsTable from "./settingsTable";

export default class SettingsView extends JetView {
	config() {
		const locale = this.app.getService("locale");
		const _ = locale._;

		const addStatusHeader = {
			cols: [
				{
					template: _("Statuses"),
					type: "header"
				},
				{
					width: 150,
					view: "button",
					css: "webix_primary",
					type: "icon",
					icon: "webix_icon wxi-plus",
					label: _("Add new"),
					align: "center",
					click: () => this.windowStatus.showWindow()
				}
			]
		};

		const addTypeHeader = {
			cols: [
				{
					template: _("Activity type"),
					type: "header"
				},
				{
					width: 150,
					view: "button",
					css: "webix_primary",
					type: "icon",
					icon: "webix_icon wxi-plus",
					label: _("Add new"),
					align: "center",
					click: () => this.windowActivityType.showWindow()
				}
			]
		};

		return {
			padding: 15,
			rows: [
				{
					cols: [
						{
							view: "segmented",
							value: locale.getLang(),
							options: [
								{id: "en", value: "en-US"},
								{id: "ru", value: "ru-RU"}
							],
							click() {
								webix.delay(() => locale.setLang((this.getValue())));
							}
						}
					]
				},
				{
					gravity: 0.1
				},
				{
					cols: [
						{
							rows: [addStatusHeader]
						},
						{
							gravity: 0.2
						},
						{
							rows: [addTypeHeader]
						}
					]
				},
				{}
			]
		};
	}

	init() {
		// this.statusPopup = this.ui(new SettingsPopup());
		// this.typePopup = this.ui(new SettingsPopup());
	}
}
