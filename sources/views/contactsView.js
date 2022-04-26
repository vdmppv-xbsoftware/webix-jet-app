import {JetView} from "webix-jet";

import ContactsInfo from "./contactsInfo";
import ContactsList from "./contactsList";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [ContactsList, ContactsInfo]
		};
	}
}
