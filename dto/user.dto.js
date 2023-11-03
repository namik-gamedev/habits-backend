export default class UserDto {
	id;
	email;
	name;
	activated;
	constructor(model) {
		this.id = model._id;
		this.email = model.email;
		this.name = model.name;
		this.activated = model.activated;
	}
}
