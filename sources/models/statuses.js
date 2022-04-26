import url from "../server/urls";

const statusesCollection = new webix.DataCollection({
	url: url.urlStatuses,
	save: `rest->${url.urlStatuses}`
});

export default statusesCollection;
