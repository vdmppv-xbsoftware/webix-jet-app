import {JetView} from "webix-jet";

import contactsCollection from "../models/contacts";

const CONTACTS_LIST_ID = "contacts_list";

const dummyPictureUrl = "https://www.vippng.com/png/full/412-4125354_person-circle-comments-profile-icon-png-white-transparent.png";

export default class ContactsView extends JetView {
	config() {
		const contactsList = {
			view: "list",
			localId: CONTACTS_LIST_ID,
			select: true,
			width: 300,
			type: {
				height: "auto",
				css: "contacts-list-item",
				template: obj => `<img class='list-item-pic' src="${obj.Photo || dummyPictureUrl}"></img>
					<div class="contact-list-item-info">
						<span>${obj.FirstName} ${obj.LastName}</span> <br>
						<span>${obj.Company}</span>
					</div>`
			}
		};

		const addContactBtn = {
			width: 200,
			view: "button",
			type: "icon",
			icon: "webix_icon wxi-plus",
			label: "Add Contact",
			align: "center",
			css: "webix_primary",
			click: () => {
				this.show("contactsForm");
				this.list.unselectAll();
			}
		};

		return {
			cols: [
				{
					rows: [
						contactsList,
						addContactBtn
					]
				},
				{$subview: true}
			]
		};
	}

	init() {
		this.list = this.$$(CONTACTS_LIST_ID);
		this.list.sync(contactsCollection);
	}

	ready() {
		contactsCollection.waitData.then(() => {
			const selected = this.getParam("id") || contactsCollection.getFirstId();
			this.list.select(selected);
		});

		this.on(this.app, "onContactSelect", (id) => {
			if (id) this.list.select(id);
			else {
				const firstItem = this.list.getFirstId();
				if (firstItem) this.list.select(firstItem);
			}
		});

		this.on(this.list, "onAfterSelect", (id) => {
			this.show(`contactsInfo?id=${id}`);
		});
	}
}
