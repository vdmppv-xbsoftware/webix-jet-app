import url from "../server/urls";

const contactsCollection = new webix.DataCollection({
	url: url.urlContacts,
	save: `rest->${url.urlContacts}`,
	scheme: {
		$init(data) {
			data.FullName = `${data.FirstName} ${data.LastName}`;
		}
	}
});

export default contactsCollection;
