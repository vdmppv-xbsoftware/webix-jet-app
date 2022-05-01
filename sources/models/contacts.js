import url from "../server/urls";

const dummyPictureUrl = "https://www.vippng.com/png/full/412-4125354_person-circle-comments-profile-icon-png-white-transparent.png";

const contactsCollection = new webix.DataCollection({
	url: url.urlContacts,
	save: `rest->${url.urlContacts}`,
	scheme: {
		$init(data) {
			data.value = `${data.FirstName} ${data.LastName}`;
			data.StartDate = webix.Date.strToDate("%Y-%m-%d %H:%i")(data.StartDate);
			data.Birthday = webix.Date.strToDate("%Y-%m-%d %H:%i")(data.Birthday);
			data.Photo = data.Photo ? data.Photo : dummyPictureUrl;
		},
		$save(data) {
			if (typeof data.StartDate === "object") {
				data.StartDate = webix.Date.dateToStr("%Y-%m-%d %H:%i")(data.StartDate);
			}
			if (typeof data.Birthday === "object") {
				data.Birthday = webix.Date.dateToStr("%Y-%m-%d %H:%i")(data.Birthday);
			}
			data.Photo = data.Photo ? data.Photo : dummyPictureUrl;
		}
	}
});

export default contactsCollection;
