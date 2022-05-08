import {JetView} from "webix-jet";

import filesCollection from "../models/files";

const FILES_DATATABLE_ID = "files_datatable";

function sortBySize(a, b) {
	a = a.size;
	b = b.size;

	return a >= b ? 1 : -1;
}

export default class FilesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const filesDatatable = {
			view: "datatable",
			localId: FILES_DATATABLE_ID,
			scrollX: false,
			columns: [
				{
					id: "name",
					header: _("Name"),
					fillspace: true,
					sort: "text"
				},
				{
					id: "lastModifiedDate",
					header: _("Change date"),
					fillspace: true,
					sort: "date",
					format: webix.Date.dateToStr("%d %F %Y")
				},
				{
					id: "sizetext",
					header: _("Size"),
					fillspace: true,
					sort: sortBySize
				},
				{
					header: "",
					width: 40,
					template: "{common.trashIcon()}"
				}
			],
			onClick: {
				"wxi-trash": (e, id) => {
					webix.confirm({text: _("Delete file?")}).then(() => {
						filesCollection.remove(id);
						this.$$(FILES_DATATABLE_ID).filter("#ContactID", this.contactId);
					});
					return false;
				}
			}
		};

		const uploadButton = {
			view: "uploader",
			autosend: false,
			inputWidth: 200,
			align: "center",
			type: "icon",
			icon: "mdi mdi-cloud-upload",
			css: "webix_primary",
			label: _("Upload file"),
			on: {
				onBeforeFileAdd: (file) => {
					file.lastModifiedDate = file.file.lastModifiedDate;
				},
				onAfterFileAdd: (file) => {
					file.ContactID = this.contactId;
					filesCollection.add(file);
					this.$$(FILES_DATATABLE_ID).filter("#ContactID#", file.ContactID);
				}
			}
		};

		return {
			rows: [
				filesDatatable,
				uploadButton
			]
		};
	}

	init() {
		this.filesdatatable = this.$$(FILES_DATATABLE_ID);
		this.filesdatatable.sync(filesCollection);
	}

	urlChange() {
		this.contactId = this.getParam("id");
		this.filesdatatable.filter("#ContactID#", this.contactId);
	}
}
