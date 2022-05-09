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

		const activitiesTable = new ActivitiesTableView(this.app);

		const activitiesTabbar = {
			view: "tabbar",
			borderless: false,
			options: [
				{id: "all", value: _("All")},
				{id: "overdue", value: _("Overdue")},
				{id: "completed", value: _("Completed")},
				{id: "today", value: _("Today")},
				{id: "tomorrow", value: _("Tomorrow")},
				{id: "this_week", value: _("This week")},
				{id: "this_month", value: _("This month")}
			],
			multiview: true,
			value: "all",
			on: {
				onAfterTabClick: (tab) => {
					activitiesTable.filterTableByAll(tab);
				}
			}
		};

		return {
			rows: [activitiesHeader, activitiesTabbar, activitiesTable]
		};
	}

	init() {
		this.popup = this.ui(PopupEditor);
	}
}
