import {JetView} from "webix-jet";

import contactsCollection from "../models/contacts";
import statusesCollection from "../models/statuses";

const dummyPictureUrl = "https://www.vippng.com/png/full/412-4125354_person-circle-comments-profile-icon-png-white-transparent.png";
const CONTACTS_FORM_ID = "contacts_form";
const CONTACTS_FORM_HEADER_ID = "contacts_form_header";
const CONTACT_PHOTO_ID = "contacts_photo";
const CONTACT_SAVE_BTN_ID = "contact_save_btn";


export default class ContactsForm extends JetView {
	config() {
		const contactsFormHeader = {
			view: "label",
			localId: CONTACTS_FORM_HEADER_ID,
			padding: 30,
			margin: 10,
			label: "Add contact",
			css: "form-header"
		};

		const firstCol = {
			paddingX: 30,
			margin: 20,
			rows: [
				{
					view: "text",
					name: "FirstName",
					label: "First Name",
					required: true
				},
				{
					view: "text",
					name: "LastName",
					label: "Last Name",
					required: true
				},
				{
					view: "datepicker",
					name: "StartDate",
					label: "Joining Date",
					required: true
				},
				{
					view: "richselect",
					name: "StatusID",
					label: "Status",
					options: {
						body: {
							data: statusesCollection,
							template: "#Value#"
						}
					},
					required: true
				},
				{
					view: "text",
					name: "Job",
					label: "Job",
					required: true
				},
				{
					view: "text",
					name: "Company",
					label: "Company",
					required: true
				},
				{
					view: "text",
					name: "Website",
					label: "Website"
				},
				{
					view: "text",
					name: "Address",
					label: "Address"
				}
			]
		};

		const photoSection = {
			cols: [
				{
					localId: CONTACT_PHOTO_ID,
					width: 220,
					height: 220,
					borderless: true,
					template: obj => `<img src="${obj.Photo || dummyPictureUrl}" class="contact-photo">`
				},
				{
					rows: [
						{ },
						{
							view: "uploader",
							value: "Change photo",
							width: 200,
							autosend: false,
							multiple: false,
							css: "webix_primary",
							accept: "image/png, image/gif, image/jpg",
							on: {
								onBeforeFileAdd: obj => this.loadPhoto(obj)
							}
						},
						{
							view: "button",
							width: 200,
							value: "Delete photo",
							css: "webix_danger",
							click: () => {
								this.$$(CONTACT_PHOTO_ID).setValues({Photo: dummyPictureUrl});
							}
						}
					]
				}
			]
		};

		const secondCol = {
			paddingX: 30,
			margin: 20,
			minWidth: 450,
			rows: [
				{
					view: "text",
					name: "Email",
					label: "Email"
				},
				{
					view: "text",
					name: "Skype",
					label: "Skype"
				},
				{
					view: "text",
					name: "Phone",
					label: "Phone",
					required: true
				},
				{
					view: "datepicker",
					name: "Birthday",
					label: "Birthday",
					required: true
				},
				photoSection
			]
		};

		const contactsFormButtons = {
			view: "toolbar",
			margin: 15,
			paddingX: 45,
			borderless: true,
			elements: [
				{
					view: "button",
					value: "Cancel",
					width: 100,
					click: () => this.cancelForm()
				},
				{
					view: "button",
					localId: CONTACT_SAVE_BTN_ID,
					value: "Add",
					width: 100,
					css: "webix_primary",
					click: () => this.saveContact()
				}
			]
		};

		const contactsForm = {
			view: "form",
			localId: CONTACTS_FORM_ID,
			borderless: true,
			autoheight: true,
			margin: 20,
			rows: [
				contactsFormHeader,
				{
					paddingY: 30,
					borderless: true,
					cols: [
						firstCol,
						secondCol
					]
				},
				{ },
				{
					cols: [
						{ },
						contactsFormButtons
					]
				}
			],
			elementsConfig: {
				labelWidth: 150
			}
		};

		return {
			rows: [
				contactsForm
			]
		};
	}

	urlChange() {
		this.contactform = this.$$(CONTACTS_FORM_ID);
		this.contactform.clear();
		this.contactform.clearValidation();

		this.header = this.$$(CONTACTS_FORM_HEADER_ID);
		this.savebtn = this.$$(CONTACT_SAVE_BTN_ID);

		this.contactphoto = this.$$(CONTACT_PHOTO_ID);

		this.contactId = this.getParam("id");
		if (this.contactId) {
			const item = contactsCollection.getItem(this.contactId);
			this.contactform.setValues(item);
			this.contactphoto.setValues({Photo: item.Photo});
			this.header.config.label = "Edit contact";
			this.header.refresh();
			this.savebtn.setValue("Save");
		}
		else {
			this.header.config.label = "Add contact";
			this.header.refresh();
			this.savebtn.setValue("Add");
		}
	}

	cancelForm() {
		this.app.callEvent("onContactSelect", [this.contactId]);

		this.contactform.clear();
		this.contactform.clearValidation();
	}

	saveContact() {
		if (this.contactform.validate()) {
			const item = this.contactform.getValues();

			item.Photo = this.contactphoto.getValues().Photo;

			if (this.contactId) {
				contactsCollection.updateItem(item.id, item);
				this.app.callEvent("onContactSelect", [this.contactId]);
			}
			else {
				contactsCollection.waitSave(() => contactsCollection.add(item))
					.then((res) => {
						this.app.callEvent("onContactSelect", [res.id]);
					});
			}

			this.contactform.clear();
			this.contactform.clearValidation();
		}
	}

	loadPhoto(data) {
		const file = data.file;
		const reader = new FileReader();
		if (file) {
			reader.readAsDataURL(file);
		}

		reader.onload = () => {
			this.contactphoto.setValues({Photo: reader.result});
		};
	}
}
