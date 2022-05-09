import {JetView} from "webix-jet";

import icons from "../models/icons";

const SETTINGS_POPUP_ID = "settings_popup";
const SETTINGS_POPUP_FORM_ID = "settings_popup_form";
const SETTINGS_SAVE_BTN_ID = "settings_save_button";
const SETTINGS_POPUP_HEADER_ID = "settings_popup_header";

export default class SettingsPopup extends JetView {
	constructor(app, label, collection) {
		super(app);
		this.label = label;
		this.collection = collection;
	}

	config() {
		const _ = this.app.getService("locale")._;
		const window = {
			view: "window",
			modal: true,
			localId: SETTINGS_POPUP_ID,
			head: _("Add activity"),
			position: "center",
			width: 500,
			body: {
				view: "form",
				localId: SETTINGS_POPUP_FORM_ID,
				margin: 15,
				elements: [
					{
						view: "text",
						name: "Value",
						label: this.label,
						required: true,
						invalidMessage: _("Field should be filled")
					},
					{
						view: "richselect",
						name: "Icon",
						label: _("Icon"),
						inputWidth: 190,
						options: {
							template: obj => `<span class='${obj.icon}'></span>`,
							data: icons
						},
						required: true,
						invalidMessage: _("Icon should be selected")
					},
					{
						cols: [
							{
								view: "button",
								label: _("Cancel"),
								click: () => {
									if (this.settingsPopupForm.isDirty()) {
										webix.confirm({
											text: _("Discard changes?"),
											cancel: _("Cancel")
										}).then(() => this.closePopup());
									}
									else {
										this.closePopup();
									}
								}
							},
							{
								view: "button",
								localId: SETTINGS_SAVE_BTN_ID,
								css: "webix_primary",
								click: () => {
									this.savePopupData(this.collection);
								}
							}
						]
					}
				],
				elementsConfig: {
					labelWidth: 120
				}
			}
		};

		return window;
	}

	init() {
		this.settingsPopup = this.getRoot();
		this.settingsPopupForm = this.$$(SETTINGS_POPUP_FORM_ID);
		this.settingsPopupSaveButton = this.$$(SETTINGS_SAVE_BTN_ID);
		this.settingsPopupHeader = this.$$(SETTINGS_POPUP_HEADER_ID);
	}

	showPopup(collection, id) {
		const _ = this.app.getService("locale")._;

		if (id && collection.exists(id)) {
			this.settingsPopupForm.setValues(collection.getItem(id));
			const headerTemplate = [_("Edit"), this.label.toLowerCase()].join(" ");
			this.settingsPopupSaveButton.setValue(_("Save"));
			this.settingsPopup.getHead().setHTML(headerTemplate);
		}

		else {
			const headerTemplate = [_("Add"), this.label.toLowerCase()].join(" ");
			this.settingsPopupSaveButton.setValue(_("Add"));
			this.settingsPopup.getHead().setHTML(headerTemplate);
		}

		this.settingsPopup.show();
	}

	savePopupData(collection) {
		if (this.settingsPopupForm.validate()) {
			const item = this.settingsPopupForm.getValues();
			if (item.id) {
				collection.updateItem(item.id, item);
			}
			else {
				collection.add(item);
			}

			this.closePopup();
		}
	}

	closePopup() {
		this.settingsPopup.hide();
		this.settingsPopupForm.clear();
		this.settingsPopupForm.clearValidation();
	}
}
