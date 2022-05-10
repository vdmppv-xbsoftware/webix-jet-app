import {JetView} from "webix-jet";

import activitiesCollection from "../models/activities";
import activityTypesCollection from "../models/activitytypes";
import contactsCollection from "../models/contacts";

const POPUP_ID = "popup";
const POPUP_FORM_ID = "popup_form";
const SAVE_BUTTON_ID = "save_btn";
const CONTACT_FIELD_ID = "contact_field";

export default class PopupEditor extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "window",
			modal: true,
			localId: POPUP_ID,
			head: _("Activity"),
			position: "center",
			width: 700,
			height: 700,
			body: {
				view: "form",
				localId: POPUP_FORM_ID,
				rows: [
					{
						view: "textarea",
						name: "Details",
						label: _("Details"),
						height: 100
					},
					{
						view: "select",
						name: "TypeID",
						label: _("Type"),
						options: activityTypesCollection,
						invalidMessage: _("Type selection is required")
					},
					{
						view: "select",
						name: "ContactID",
						localId: CONTACT_FIELD_ID,
						label: _("Contact"),
						options: contactsCollection,
						invalidMessage: _("Contact name is required")
					},
					{
						margin: 20,
						cols: [
							{
								view: "datepicker",
								type: "date",
								name: "DueDate",
								label: _("Date"),
								format: webix.Date.dateToStr("%d %F %Y"),
								invalidMessage: _("Date selection is required")
							},
							{
								view: "datepicker",
								type: "time",
								name: "Time",
								label: _("Time"),
								invalidMessage: _("Time selection is required")
							}
						]
					},
					{
						view: "checkbox",
						name: "State",
						labelRight: _("Completed"),
						labelWidth: 0,
						checkValue: "Close",
						uncheckValue: "Open"
					},
					{
						cols: [
							{ },
							{
								view: "button",
								localId: SAVE_BUTTON_ID,
								value: "text",
								click: () => this.saveForm()
							},
							{
								view: "button",
								value: _("Cancel"),
								click: () => {
									if (this.form.isDirty()) {
										webix.confirm({
											text: _("Discard changes?"),
											cancel: _("Cancel")
										}).then(() => this.closeForm());
									}
									else {
										this.closeForm();
									}
								}
							}
						]
					}
				],
				rules: {
					TypeID: webix.rules.isNotEmpty,
					ContactID: webix.rules.isNotEmpty,
					DueDate: webix.rules.isNotEmpty,
					Time: webix.rules.isNotEmpty
				},
				elementsConfig: {
					labelWidth: 100
				}
			}
		};
	}

	init() {
		this.popup = this.getRoot();
		this.form = this.$$(POPUP_FORM_ID);
		this.popupsavebtn = this.$$(SAVE_BUTTON_ID);
	}

	showPopupEditor(id, contactId) {
		const _ = this.app.getService("locale")._;
		if (!id && contactId) {
			this.form.setValues({ContactID: contactId});
			this.$$(CONTACT_FIELD_ID).disable();
		}

		if (id) {
			const currentActivity = activitiesCollection.getItem(id);
			if (contactId) this.$$(CONTACT_FIELD_ID).disable();
			if (currentActivity.DueDate) {
				currentActivity.DueDate = new Date(currentActivity.DueDate);
				currentActivity.Time = webix.Date.strToDate("%H:%i")(currentActivity.DueDate);
			}

			this.form.setValues(currentActivity);
			this.popup.getHead().setHTML(_("Edit activity"));
			this.popupsavebtn.setValue(_("Save"));
		}
		else {
			this.popup.getHead().setHTML(_("Add activity"));
			this.popupsavebtn.setValue(_("Add"));
		}

		this.popup.show();
	}

	saveForm() {
		const _ = this.app.getService("locale")._;
		if (this.form.validate()) {
			const values = this.form.getValues();
			values.DueDate = this.dateToStr(values);
			if (values.id) {
				activitiesCollection.updateItem(values.id, values);
				webix.message({text: _("Activity was successfully saved")});
			}
			else {
				activitiesCollection.add(values);
				webix.message({text: _("Activity was successfully added")});
			}

			this.closeForm();
		}
	}

	closeForm() {
		this.form.clear();
		this.form.clearValidation();
		this.popup.hide();
	}

	dateToStr(value) {
		const currentTime = webix.Date.dateToStr("%H:%i")(value.Time);
		const currentDate = webix.Date.dateToStr("%Y-%m-%d")(value.DueDate);
		return `${currentDate} ${currentTime}`;
	}
}
