import {JetView} from "webix-jet";

import activitiesCollection from "../models/activities";
import activityTypesCollection from "../models/activitytypes";
import contactsCollection from "../models/contacts";
import PopupEditor from "./popupEditor";

const ACTIVITIES_DATATABLE_ID = "activities_datatable";

export default class ActivitiesView extends JetView {
	config() {
		const activitiesHeader = {
			paddingX: 30,
			cols: [
				{ },
				{
					view: "button",
					type: "icon",
					icon: "wxi-plus-square",
					css: "webix_primary",
					label: "Add activity",
					gravity: 0.15,
					click: (() => this.popup.showPopupEditor())
				}
			]
		};

		const activitiesDatatable = {
			view: "datatable",
			localId: ACTIVITIES_DATATABLE_ID,
			select: "row",
			columns: [
				{
					id: "State",
					header: "",
					width: 40,
					template: "{common.checkbox()}",
					checkValue: "Open",
					uncheckValue: "Close"
				},
				{
					id: "TypeID",
					header: ["Activity type", {content: "selectFilter"}],
					sort: "int",
					options: activityTypesCollection,
					fillspace: true
				},
				{
					id: "DueDate",
					header: ["Due date", {content: "datepickerFilter"}],
					sort: "date",
					fillspace: true,
					format: webix.Date.dateToStr("%d %F %Y")
				},
				{
					id: "Details",
					header: ["Details", {content: "textFilter"}],
					sort: "text",
					fillspace: true
				},
				{
					id: "ContactID",
					header: ["Contact", {content: "selectFilter"}],
					sort: "text",
					fillspace: true,
					options: contactsCollection
				},
				{
					header: "",
					width: 40,
					template: "{common.editIcon()}"
				},
				{
					header: "",
					width: 40,
					template: "{common.trashIcon()}"
				}
			],
			onClick: {
				"wxi-trash": (e, id) => {
					webix.confirm({text: "Are you sure you want to delete this activity? Deleting cannot be undone!"}).then(() => {
						activitiesCollection.remove(id);
					});
					return false;
				},
				"wxi-pencil": (e, id) => {
					this.popup.showPopupEditor(id);
				}
			}
		};

		return {
			rows: [activitiesHeader, activitiesDatatable]
		};
	}

	init() {
		this.$$(ACTIVITIES_DATATABLE_ID).sync(activitiesCollection);
		this.popup = this.ui(PopupEditor);
	}
}
