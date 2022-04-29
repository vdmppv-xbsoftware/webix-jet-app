import {JetView} from "webix-jet";

import activitiesCollection from "../models/activities";
import activityTypesCollection from "../models/activitytypes";
import contactsCollection from "../models/contacts";
import PopupEditor from "./popupEditor";

const ACTIVITIES_DATATABLE_ID = "activities_datatable";

export default class ActivitiesTableView extends JetView {
	constructor(app, hide) {
		super(app);
		this.hideInfo = hide;
	}

	config() {
		const activitiesDatatable = {
			view: "datatable",
			localId: ACTIVITIES_DATATABLE_ID,
			select: "row",
			scrollX: false,
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
					sort: "text",
					options: activityTypesCollection,
					fillspace: true
				},
				{
					id: "DueDate",
					header: ["Due date", {content: "datepickerFilter", compare: this.compareDates}],
					sort: "date",
					fillspace: true,
					format: webix.Date.dateToStr("%d %F %Y")
				},
				{
					id: "Details",
					template: "#Details#",
					header: ["Details", {content: "textFilter"}],
					fillspace: true,
					sort: "string"
				},
				{
					id: "ContactID",
					fillspace: true,
					header: ["Contact", {content: "selectFilter"}],
					options: contactsCollection,
					sort: "text",
					hidden: this.hideInfo
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
				"wxi-pencil": (e, id) => this.popup.showPopupEditor(id, this.hideInfo)
			},
			on: {
				onAfterFilter: () => this.filterTableByContact(this.contactId)
			}
		};

		return activitiesDatatable;
	}

	init() {
		this.datatable = this.$$(ACTIVITIES_DATATABLE_ID);
		this.datatable.sync(activitiesCollection);

		this.contactId = this.getParam("id");
		this.filterTableByContact(this.contactId);

		this.on(activitiesCollection.data, "onStoreUpdated", () => {
			this.datatable.filterByAll();
		});

		this.popup = this.ui(PopupEditor);
	}

	urlChange() {
		webix.promise.all([
			activitiesCollection.waitData,
			activityTypesCollection.waitData,
			contactsCollection.waitData
		])
			.then(() => {
				this.contactId = this.getParam("id");
				this.datatable.filterByAll();
				this.filterTableByContact(this.contactId);
			});
	}

	compareDates(value, filter) {
		return webix.Date.equal(
			webix.Date.dayStart(value).getTime(),
			webix.Date.dayStart(filter).getTime()
		);
	}

	filterTableByContact(id) {
		if (id) {
			this.$$(ACTIVITIES_DATATABLE_ID).filter("#ContactID#", this.contactId, true);
		}
	}
}
