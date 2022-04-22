import {JetView} from "webix-jet";

import contactsCollection from "../models/contacts";
import statusesCollection from "../models/statuses";

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
					template: obj => `${obj.value || "Unknown"}`,
					borderless: true,
					css: "user-name"
				},
				{},
				{view: "button", gravity: 0.3, css: "webix_primary", type: "icon", icon: "wxi-trash", label: "Delete"},
				{view: "button", gravity: 0.3, css: "webix_primary", type: "icon", icon: "wxi-pencil", label: "Edit"}
			]
		};

		const contactInfoBody = {
			localId: CONTACTS_INFO_ID,
			template: obj => `
			<div class='contact-info'>
				<div class="contact-photo-status">
					<img src="${obj.Photo || dummyPictureUrl}" class="contact-photo">
					<div class="align-center">Status: ${obj.Status || "Unknown"} </div>
				</div>
				<div class="info-column">
					<span class='webix_icon mdi mdi-email'></span><span>${obj.Email || "Unknown"}</span> <br><br>
					<span class='webix_icon mdi mdi-skype'></span><span>${obj.Skype || "Unknown"}</span> <br><br>
					<span class='webix_icon mdi mdi-tag'></span><span>${obj.Job || "Unknown"}</span> <br><br>
					<span class='webix_icon mdi mdi-briefcase'></span><span>${obj.Company || "Unknown"}</span> 
				</div>
				<div class="info-column">
				  <span class='webix_icon mdi mdi-calendar'></span><span>${obj.Birthday || "Unknown"}</span> <br><br>
				  <span class='webix_icon mdi mdi-map-marker'></span><span>${obj.Address || "Unknown"}</span> 
				</div>
			</div>`
		};

		return {
			rows: [contactInfoHeader, contactInfoBody]
		};
	}

	urlChange() {
		webix.promise.all([
			contactsCollection.waitData,
			statusesCollection.waitData
		])
			.then(() => {
				const contactId = this.getParam("id");
				if (contactId) {
					const contactItem = contactsCollection.getItem(contactId);
					contactItem.Status = statusesCollection.getItem(contactItem.StatusID).Value;

					this.$$(CONTACTS_INFO_NAME_ID).parse(contactItem);
					this.$$(CONTACTS_INFO_ID).parse(contactItem);
				}
			});
	}
}
