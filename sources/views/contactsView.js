import {JetView} from "webix-jet";

import contactsCollection from "../models/contacts";
import statusesCollection from "../models/statuses";

const CONTACTS_LIST_ID = "contacts_list";
const CONTACTS_FILTER_ID = "contacts_filter";

const dummyPictureUrl = "https://www.vippng.com/png/full/412-4125354_person-circle-comments-profile-icon-png-white-transparent.png";

export default class ContactsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const inputFilter = {
			view: "text",
			localId: CONTACTS_FILTER_ID,
			placeholder: _("type to find matching contacts"),
			on: {
				onTimedKeyPress: () => {
					const filterValue = this.$$(CONTACTS_FILTER_ID).getValue().toLowerCase();
					const dateCondition = filterValue[0];
					this.list.filter((obj) => {
						if (dateCondition === "=" || dateCondition === ">" || dateCondition === "<") {
							if (obj.Birthday && filterValue.length === 5) {
								const year = obj.Birthday.getFullYear();
								const slicedValue = +filterValue.slice(1);
								switch (dateCondition) {
									case "=":
										return year === slicedValue;
									case ">":
										return year > slicedValue;
									case "<":
										return year < slicedValue;
									default:
										return true;
								}
							}
						}

						if (obj.StatusID) {
							const status = statusesCollection.getItem(obj.StatusID);
							if (status && status.Value.toLowerCase().indexOf(filterValue) !== -1) {
								return true;
							}
						}

						const params = [obj.value, obj.Email, obj.Skype, obj.Job, obj.Company, obj.Address];
						return params.some(item => item.toLowerCase().indexOf(filterValue) !== -1);
					});

					this.list.select(this.list.getFirstId());
				}
			}
		};

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
			label: _("Add сontact"),
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
						inputFilter,
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
			this.list.unselectAll();
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
