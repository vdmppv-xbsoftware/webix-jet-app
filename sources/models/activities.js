import url from "../server/urls";

const activitiesCollection = new webix.DataCollection({
	url: url.urlActivities,
	save: `rest->${url.urlActivities}`
});

export default activitiesCollection;
