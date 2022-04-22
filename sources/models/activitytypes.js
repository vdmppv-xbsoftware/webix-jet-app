import url from "../server/urls";

const activityTypesCollection = new webix.DataCollection({
	url: url.urlActivityTypes,
	save: `rest->${url.urlActivityTypes}`,
	scheme: {
		$init: (obj) => {
			obj.value = obj.Value;
		},
		$save: (obj) => {
			obj.Value = obj.value;
		}
	}
});

export default activityTypesCollection;
