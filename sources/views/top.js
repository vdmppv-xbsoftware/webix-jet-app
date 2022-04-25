import {JetView, plugins} from "webix-jet";

const MENU_HEADER_ID = "header_menu";

export default class TopView extends JetView {
	config() {
		let header = {
			type: "header",
			view: "label",
			label: "App",
			localId: MENU_HEADER_ID,
			css: "webix_header app_header"
		};

		let menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value#",
			data: [
				{value: "Contacts", id: "contactsView", icon: "wxi-user"},
				{value: "Activities", id: "activitiesView", icon: "wxi-calendar"},
				{value: "Settings", id: "settingsView", icon: "mdi mdi-cogs"}
			],
			on: {
				onAfterSelect: () => {
					const value = this.$$("top:menu").getSelectedItem().value;
					this.$$(MENU_HEADER_ID).setValue(value);
				}
			}
		};

		let ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				header,
				{
					css: "webix_shadow_medium",
					cols: [
						menu,
						{$subview: true}
					]
				}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}
}
