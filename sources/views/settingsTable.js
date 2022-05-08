import {JetView} from "webix-jet";

import SettingsPopup from "./settingsPopup";

const SETTINGS_DATATABLE_ID = "setting_datatable";

export default class SettingsTable extends JetView {
	constructor(app, collection, label, header) {
		super(app);
		this.collection = collection;
		this.label = label;
		this.header = header;
	}

	config() {
		const _ = this.app.getService("locale")._;

		const settingsDatatable = {
			view: "datatable",
			localId: SETTINGS_DATATABLE_ID,
			margin: 20,
			select: true,
			columns: [
				{
					id: "Icon",
					header: "",
					width: 40,
					template: "<span class='webix_icon mdi mdi-#Icon#'></span>"
				},
				{
					id: "Value",
					header: this.header,
					fillspace: true
				},
				{
					width: 40,
					template: "{common.editIcon()}"
				},
				{
					width: 40,
					template: "{common.trashIcon()}"
				}
			],
			onClick: {
				"wxi-trash": (e, id) => {
					webix.confirm({
						text: _("Are you sure you want to remove this item?"),
						cancel: _("Cancel")
					}).then(() => {
						this.collection.remove(id);
					});
					return false;
				},
				"wxi-pencil": (e, id) => {
					this.popup.showPopup(this.collection, id);
				}
			}
		};

		const addSettingsButton = {
			view: "button",
			type: "icon",
			icon: "webix_icon wxi-plus",
			label: _("Add new"),
			inputWidth: 300,
			align: "right",
			css: "webix_primary",
			click: () => this.popup.showPopup()
		};

		return {
			rows: [
				settingsDatatable,
				addSettingsButton
			]
		};
	}

	init() {
		this.datatable = this.$$(SETTINGS_DATATABLE_ID);
		this.datatable.sync(this.collection);
		this.popup = this.ui(new SettingsPopup(this.app, "", this.label, this.collection));
	}
}
