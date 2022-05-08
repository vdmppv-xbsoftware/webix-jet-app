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
		const _ = this.app.getService("locale")._;

		const contactsFormHeader = {
			view: "label",
			localId: CONTACTS_FORM_HEADER_ID,
			padding: 30,
			margin: 10,
			label: _("Add сontact"),
			css: "form-header"
		};

		const firstCol = {
			minWidth: 300,
			margin: 20,
			rows: [
				{
					view: "text",
					name: "FirstName",
					label: _("First Name"),
					required: true
				},
				{
					view: "text",
					name: "LastName",
					label: _("Last Name"),
					required: true
				},
				{
					view: "datepicker",
					name: "StartDate",
					label: _("Joining Date"),
					required: true
				},
				{
					view: "richselect",
					name: "StatusID",
					label: _("Status"),
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
					label: _("Job"),
					required: true
				},
				{
					view: "text",
					name: "Company",
					label: _("Company"),
					required: true
				},
				{
					view: "text",
					name: "Website",
					label: _("Website")
				},
				{
					view: "text",
					name: "Address",
					label: _("Address")
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
							value: _("Change photo"),
							width: 200,
							autosend: false,
							multiple: false,
							css: "webix_primary",
							accept: "image/png, image/gif, image/jpeg",
							on: {
								onBeforeFileAdd: obj => this.loadPhoto(obj)
							}
						},
						{
							view: "button",
							width: 200,
							value: _("Delete photo"),
							css: "webix_danger",
							click: () => {
								this.$$(CONTACT_PHOTO_ID).setValues({Photo: ""});
							}
						}
					]
				}
			]
		};

		const secondCol = {
			margin: 20,
			minWidth: 500,
			rows: [
				{
					view: "text",
					name: "Email",
					label: "Email",
					required: true
				},
				{
					view: "text",
					name: "Skype",
					label: "Skype"
				},
				{
					view: "text",
					name: "Phone",
					label: _("Phone"),
					required: true
				},
				{
					view: "datepicker",
					name: "Birthday",
					label: _("Birthday"),
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
					value: _("Cancel"),
					width: 100,
					click: () => this.cancelForm()
				},
				{
					view: "button",
					localId: CONTACT_SAVE_BTN_ID,
					value: _("Add"),
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
			margin: 30,
			rows: [
				contactsFormHeader,
				{
					paddingX: 40,
					margin: 20,
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
				labelWidth: 135
			},
			rules: {
				Phone: webix.rules.isNumber,
				Email: webix.rules.isEmail
			}
		};

		return {
			rows: [
				contactsForm
			]
		};
	}

	urlChange() {
		const _ = this.app.getService("locale")._;
		this.contactform = this.$$(CONTACTS_FORM_ID);

		this.header = this.$$(CONTACTS_FORM_HEADER_ID);
		this.savebtn = this.$$(CONTACT_SAVE_BTN_ID);

		this.contactphoto = this.$$(CONTACT_PHOTO_ID);

		this.contactId = this.getParam("id");
		if (this.contactId) {
			const item = contactsCollection.getItem(this.contactId);
			this.contactform.setValues(item);
			this.contactphoto.setValues({Photo: item.Photo});
			this.header.config.label = _("Edit contact");
			this.header.refresh();
			this.savebtn.setValue(_("Save"));
		}
		else {
			this.header.config.label = _("Add сontact");
			this.header.refresh();
			this.savebtn.setValue(_("Add"));
		}
	}

	cancelForm() {
		this.app.callEvent("onContactSelect", [this.contactId]);
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
