export default class ApiError extends Error {
   status;
   errors;

   constructor(status, message, errors = []) {
      super(message);
      this.status = status;
      this.errors = errors;
   }

   static CredentialsWereNotProvided() {
      return new ApiError(401, 'Authentication credentials were not provided');
   }
   static TokenIsInvalidOrExpired() {
      return new ApiError(401, 'Given token is invalid or expired');
   }
   static BadRequest(message, errors = []) {
      return new ApiError(400, message, errors);
   }
   static Conflict(message) {
      return new ApiError(409, message);
   }
}
