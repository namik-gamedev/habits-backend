export default class ApiError extends Error {
   status;
   errors;
	code;

   constructor(status, code, errors = []) {
		super()
      this.status = status;
      this.errors = errors;
		this.code = code;
   }

   static Unauthorized(code) {
      return new ApiError(401, code);
   }
   static BadRequest(code, errors = []) {
      return new ApiError(400, code, errors);
   }
   static Conflict(code) {
      return new ApiError(409, code);
   }
}
