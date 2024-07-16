class Form {
	constructor({
		id = "",
		name = "",
		description = "",
		components = [],
		google_id = "",
		user_id = "",
	}) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.components = components;
		this.google_id = google_id;
		this.user_id = user_id;
	}
	toCreateFormModel() {
		return {
			name: this.name,
			description: this.description,
			components: this.components,
			user_id: this.user_id,
		};
	}
}

export default Form;
