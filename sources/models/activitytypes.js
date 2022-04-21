import url from "../server/urls";

const activityTypes = new webix.DataCollection({
	url: url.urlActivityTypes,
	save: `rest->${url.urlActivityTypes}`
});

export default activityTypes;
