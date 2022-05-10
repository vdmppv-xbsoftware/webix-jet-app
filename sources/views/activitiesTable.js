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
		this.tabbarValue = "all";
	}

	config() {
		const _ = this.app.getService("locale")._;

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
					checkValue: "Close",
					uncheckValue: "Open"
				},
				{
					id: "TypeID",
					header: [_("Activity type"), {content: "selectFilter"}],
					sort: "text",
					options: activityTypesCollection,
					fillspace: true
				},
				{
					id: "DueDate",
					header: [_("Due date"), {content: "datepickerFilter", compare: this.compareDates}],
					sort: "date",
					fillspace: true,
					format: webix.Date.dateToStr("%d %F %Y")
				},
				{
					id: "Details",
					header: [_("Details"), {content: "textFilter"}],
					fillspace: true,
					sort: "string"
				},
				{
					id: "ContactID",
					fillspace: true,
					header: [_("Contact"), {content: "selectFilter"}],
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
					webix.confirm({text: _("Are you sure you want to delete this activity? Deleting cannot be undone!")}).then(() => {
						activitiesCollection.remove(id);
					});
					return false;
				},
				"wxi-pencil": (e, id) => this.popup.showPopupEditor(id, this.hideInfo)
			},
			on: {
				onAfterFilter: () => {
					this.filterTableByContact(this.contactId);
					this.filterTableByTabbar();
				}
			}
		};

		return activitiesDatatable;
	}

	init() {
		this.datatable = this.$$(ACTIVITIES_DATATABLE_ID);
		this.datatable.sync(activitiesCollection);

		this.contactId = this.getParam("id");

		this.on(activitiesCollection.data, "onStoreUpdated", () => {
			this.filterTableByContact(this.contactId);
			this.filterTableByTabbar(this.tabbarValue);
			this.datatable.filterByAll();
		});

		this.popup = this.ui(PopupEditor);

		this.on(this.app, "onFilterTableByTabbar", (tab) => {
			this.tabbarValue = tab;
			this.datatable.filterByAll();
		});
	}

	filterTableByTabbar() {
		const curDate = new Date();
		this.datatable.filter((obj) => {
			switch (this.tabbarValue) {
				case "overdue":
					return obj.DueDate < curDate && obj.State === "Open";
				case "completed":
					return obj.State === "Close";
				case "today":
					return this.compareDates(curDate, obj.DueDate);
				case "tomorrow":
					return webix.Date.equal(webix.Date.add(webix.Date.dayStart(curDate), 1, "day", true), webix.Date.dayStart(obj.DueDate));
				case "this_week":
				{
					const start = webix.Date.weekStart(curDate);
					return (start <= obj.DueDate && obj.DueDate <= webix.Date.add(start, 6, "day", true));
				}
				case "this_month":
					return this.checkMonth(curDate, obj.DueDate);
				case "all":
				default:
					return true;
			}
		}, null, true);
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

	checkMonth(value, filter) {
		return webix.Date.dateToStr("%Y.%m")(value) === webix.Date.dateToStr("%Y.%m")(filter);
	}

	filterTableByContact(id) {
		if (id) {
			this.datatable.filter("#ContactID#", this.contactId, true);
		}
	}
}
