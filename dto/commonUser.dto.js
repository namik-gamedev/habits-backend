export default class CommonUserDto {
   id;
   email;
   constructor(model) {
      this.id = model._id;
      this.email = model.email;
   }
}
