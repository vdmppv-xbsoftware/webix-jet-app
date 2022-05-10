import {JetView} from "webix-jet";

import activityTypesCollection from "../models/activitytypes";
import statusesCollection from "../models/statuses";
// import SettingsPopup from "./settingsPopup";
import SettingsTable from "./settingsTable";

export default class SettingsView extends JetView {
	config() {
		const locale = this.app.getService("locale");
		const _ = locale._;

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
								webix.delay(() => {
									const lang = this.getValue();
									locale.setLang(lang);
								});
							}
						}
					]
				},
				{
					gravity: 0.1
				},
				{
					margin: 20,
					cols: [
						{
							rows: [new SettingsTable(this.app, statusesCollection, _("Status"), _("Statuses"))]
						},
						{
							rows: [new SettingsTable(this.app, activityTypesCollection, _("Activity"), _("Activity type"))]
						}
					]
				},
				{}
			]
		};
	}
}
