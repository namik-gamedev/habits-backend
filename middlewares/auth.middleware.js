import ApiError from '../exceptions/apiError.js';
import TokenService from '../services/token.service.js';

const authMiddleware = (req, res, next) => {
   // Bearer <toke>
   const accessToken = req.headers.authorization?.split(' ')[1];
   if (!accessToken) {
      return next(ApiError.CredentialsWereNotProvided());
   }
   if (!TokenService.validateAccessToken(accessToken)) {
      return next(ApiError.TokenIsInvalidOrExpired());
   }
   next();
};

export default authMiddleware;
