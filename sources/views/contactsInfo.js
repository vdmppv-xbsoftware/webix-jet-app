import {JetView} from "webix-jet";

import activitiesCollection from "../models/activities";
import contactsCollection from "../models/contacts";
import filesCollection from "../models/files";
import statusesCollection from "../models/statuses";
import ActivitiesTableView from "./activitiesTable";
import FilesView from "./filesView";
import PopupEditor from "./popupEditor";

const CONTACTS_INFO_NAME_ID = "contacts_info_name";
const CONTACTS_INFO_ID = "contacts_info";

const dummyPictureUrl = "https://www.vippng.com/png/full/412-4125354_person-circle-comments-profile-icon-png-white-transparent.png";

export default class ContactsInfo extends JetView {
	config() {
		const contactInfoHeader = {
			view: "toolbar",
			padding: 15,
			cols: [
				{
					localId: CONTACTS_INFO_NAME_ID,
					template: obj => `${obj.FirstName || "Unknown"} ${obj.LastName || "Unknown"}`,
					borderless: true,
					css: "user-name"
				},
				{},
				{view: "button", gravity: 0.3, css: "webix_primary", type: "icon", icon: "wxi-trash", label: "Delete", click: () => this.deleteContact()},
				{view: "button", gravity: 0.3, css: "webix_primary", type: "icon", icon: "wxi-pencil", label: "Edit", click: () => this.show(`contactsForm?id=${this.contactId}`)}
			]
		};

		const contactInfoBody = {
			localId: CONTACTS_INFO_ID,
			template: obj => `
			<div class='contact-info'>
				<div class="contact-photo-status">
					<img src="${obj.Photo || dummyPictureUrl}" class="contact-photo">
					${obj.Status ? `<div class="align-center">Status: ${obj.Status} </div>` : ""}
				</div>
				<div class="info-column">
					${obj.Email ? `<span class='webix_icon mdi mdi-email'></span><span>${obj.Email}</span> <br><br>` : ""}
					${obj.Skype ? `<span class='webix_icon mdi mdi-skype'></span><span>${obj.Skype}</span> <br><br>` : ""} 
					${obj.Job ? `<span class='webix_icon mdi mdi-tag'></span><span>${obj.Job}</span> <br><br>` : ""}
					${obj.Company ? `<span class='webix_icon mdi mdi-briefcase'></span><span>${obj.Company}</span>` : ""} 
				</div>
				<div class="info-column">
				  ${obj.Birthday ? `<span class='webix_icon mdi mdi-calendar'></span><span>${webix.Date.dateToStr("%Y-%m-%d")(obj.Birthday)}</span> <br><br>` : ""}
				  ${obj.Address ? `<span class='webix_icon mdi mdi-map-marker'></span><span>${obj.Address}</span>` : ""} 
				</div>
			</div>`
		};

		const contactTableTabbar = {
			borderless: true,
			view: "tabbar",
			options: ["Activities", "Files"],
			multiview: true,
			value: "Activities"
		};

		const addActivityButton = {
			paddingX: 20,
			cols: [
				{ },
				{
					view: "button",
					type: "icon",
					icon: "wxi-plus-square",
					css: "webix_primary",
					label: "Add activity",
					gravity: 0.5,
					click: (() => this.popup.showPopupEditor(null, this.contactId))
				}
			]
		};

		const contactTableDetails = {
			cells: [
				{
					id: "Activities",
					rows: [
						{$subview: new ActivitiesTableView(this.app, true)},
						{
							cols: [
								{},
								addActivityButton
							]
						}
					]
				},
				{
					id: "Files",
					rows: [{$subview: FilesView}]
				}
			]
		};

		return {
			rows: [
				contactInfoHeader,
				contactInfoBody,
				contactTableTabbar,
				contactTableDetails
			]
		};
	}

	init() {
		this.popup = this.ui(PopupEditor);
		this.contactId = this.getParam("id");
	}

	urlChange() {
		webix.promise.all([
			contactsCollection.waitData,
			statusesCollection.waitData
		])
			.then(() => {
				this.contactId = this.getParam("id");
				if (this.contactId) {
					const contactItem = contactsCollection.getItem(this.contactId);
					const status = statusesCollection.getItem(contactItem.StatusID);
					contactItem.Status = status ? status.Value : "";

					this.$$(CONTACTS_INFO_NAME_ID).parse(contactItem);
					this.$$(CONTACTS_INFO_ID).parse(contactItem);
				}
			});
	}

	deleteContact() {
		webix.confirm({text: "Are you sure you want to delete this contact and all related files and activities"}).then(() => {
			activitiesCollection.data.each((activity) => {
				if (+activity.ContactID === +this.contactId) {
					activitiesCollection.remove(activity.id);
				}
			});

			filesCollection.data.each((file) => {
				if (+file.ContactID === +this.contactId) {
					filesCollection.remove(file.id);
				}
			});

			contactsCollection.remove(this.contactId);

			this.app.callEvent("onContactSelect");
		});
	}
}
