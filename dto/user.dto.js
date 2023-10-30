export default class UserDto {
   id;
   email;
   activated;
   constructor(model) {
      this.id = model._id;
      this.email = model.email;
      this.activated = model.activated;
   }
}
