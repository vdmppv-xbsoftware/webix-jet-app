import {JetView} from "webix-jet";

import ActivitiesTableView from "./activitiesTable";
import PopupEditor from "./popupEditor";

export default class ActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const activitiesHeader = {
			paddingX: 30,
			cols: [
				{ },
				{
					view: "button",
					type: "icon",
					icon: "wxi-plus-square",
					css: "webix_primary",
					label: _("Add activity"),
					gravity: 0.15,
					click: (() => this.popup.showPopupEditor())
				}
			]
		};

		return {
			rows: [activitiesHeader, ActivitiesTableView]
		};
	}

	init() {
		this.popup = this.ui(PopupEditor);
	}
}
