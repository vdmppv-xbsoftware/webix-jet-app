import url from "../server/urls";

const activitiesCollection = new webix.DataCollection({
	url: url.urlActivities,
	save: `rest->${url.urlActivities}`,
	scheme: {
		$init: (data) => {
			data.DueDate = webix.Date.strToDate("%Y-%m-%d %H:%i")(data.DueDate);
		}
	}
});

export default activitiesCollection;
