import {JetView} from "webix-jet";

import contactsCollection from "../models/contacts";

const CONTACTS_LIST_ID = "contacts_list";

export default class ContactsView extends JetView {
	config() {
		const contactsList = {
			view: "list",
			localId: CONTACTS_LIST_ID,
			select: true,
			width: 300,
			type: {
				height: 45,
				css: "contacts-list-item",
				template: `<span class="webix_icon wxi-user"></span> 
				<div class="contact-list-item-info">
				<span>#FirstName# #LastName#</span><br>
				<span>#Company#</span>
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
			click: () => this.show("contactsForm")
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

		this.on(this.app, "onContactSelect", (id) => {
			this.list.unselectAll();

			this.list.select(this.list.getFirstId());
			if (id) this.list.select(id);
		});
	}

	ready() {
		contactsCollection.waitData.then(() => {
			const selected = this.getParam("id") || contactsCollection.getFirstId();
			this.setParam("id", selected, true);
			this.on(this.list, "onAfterSelect", (id) => {
				this.show(`contactsInfo?id=${id}`);
			});

			this.list.select(selected);
		});
	}

	urlChange() {
		const url = this.getParam("id");
		if (!url) this.list.unselectAll();
	}
}
