import ApiError from '../exceptions/apiError.js';
import { AUTH_INVALID_TOKEN_ERROR_CODE, AUTH_NO_CREDENTIALS_ERROR_CODE } from '../exceptions/errorCodes.js';
import TokenService from '../services/token.service.js';

const authMiddleware = (req, res, next) => {
   // Bearer <toke>
   const accessToken = req.headers.authorization?.split(' ')[1];
   if (!accessToken) {
      return next(ApiError.Unauthorized(AUTH_NO_CREDENTIALS_ERROR_CODE));
   }
   if (!TokenService.validateAccessToken(accessToken)) {
      return next(ApiError.Unauthorized(AUTH_INVALID_TOKEN_ERROR_CODE));
   }
   next();
};

export default authMiddleware;
