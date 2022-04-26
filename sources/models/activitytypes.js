import url from "../server/urls";

const activityTypesCollection = new webix.DataCollection({
	url: url.urlActivityTypes,
	save: `rest->${url.urlActivityTypes}`,
	scheme: {
		$init: (data) => {
			data.value = data.Value;
		},
		$save: (data) => {
			data.Value = data.value;
		}
	}
});

export default activityTypesCollection;
