import UserDto from '../dto/user.dto.js';
import TokenService from '../services/token.service.js';

const userIdMiddleware = (req, _res, next) => {
	const accessToken = req.headers.authorization?.split(' ')[1];

	const userData = TokenService.validateAccessToken(accessToken);

	req.userId = userData.id;

	next();
};

export default userIdMiddleware;
