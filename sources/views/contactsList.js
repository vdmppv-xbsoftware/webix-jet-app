import {JetView} from "webix-jet";

import contactsCollection from "../models/contacts";

const CONTACTS_LIST_ID = "contacts_list";

export default class ContactsList extends JetView {
	config() {
		return {
			view: "list",
			localId: CONTACTS_LIST_ID,
			select: true,
			width: 300,
			type: {
				height: 45,
				css: "contacts-list-item",
				template: `<span class="webix_icon wxi-user"></span> 
        <div class="contact-list-item-info">
					<span>#value#</span><br>
					<span>#Company#</span>
				</div>`
			}
		};
	}

	init() {
		this.list = this.$$(CONTACTS_LIST_ID);
		this.list.sync(contactsCollection);
	}

	ready() {
		contactsCollection.waitData.then(() => {
			const selected = this.getParam("id") || contactsCollection.getFirstId();
			this.setParam("id", selected, true);
			this.on(this.list, "onAfterSelect", (id) => {
				this.show(`contactsView?id=${id}`);
			});

			this.list.select(selected);
		});
	}

	urlChange() {
		const url = this.getParam("id");
		if (!url) this.list.unselectAll();
	}
}
