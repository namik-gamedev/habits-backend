import { compare, hash } from 'bcrypt';
import User from '../models/user.model.js';
import { v4 } from 'uuid';
import MailService from './mail.service.js';
import TokenService from './token.service.js';
import UserDto from '../dto/user.dto.js';
import ApiError from '../exceptions/apiError.js';
import {
	AUTH_EMAIL_ALREADY_USED_ERROR_CODE,
	AUTH_INVALID_PASSWORD_ERROR_CODE,
	AUTH_INVALID_TOKEN_ERROR_CODE,
	AUTH_NO_CREDENTIALS_ERROR_CODE,
	AUTH_USER_NOT_FOUND_ERROR_CODE,
	AUTH_WRONG_ACTIAVTION_LINK_ERROR_CODE,
} from '../exceptions/errorCodes.js';
import CommonUserDto from '../dto/commonUser.dto.js';

export default class UserService {
	static async getAllUsers() {
		const users = await User.find();
		const commonUsers = users.map(user => new CommonUserDto(user));
		return commonUsers;
	}
	static async deleteAllUsers() {
		await User.deleteMany({});
	}
	static async createUser(email, password, name) {
		const candidate = await User.findOne({ email });
		if (candidate) {
			throw ApiError.Conflict(AUTH_EMAIL_ALREADY_USED_ERROR_CODE);
		}

		const passwordHash = await hash(password, 5);
		const activationLink = v4();

		const user = await User.create({ email, password: passwordHash, activationLink, name });
		await MailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`);

		const userDto = new UserDto(user);
		const tokens = await TokenService.updateTokens({ ...userDto });

		return {
			...tokens,
			user: userDto,
		};
	}
	static async activate(activationLink) {
		const user = await User.findOne({ activationLink });
		if (!user) {
			throw ApiError.BadRequest(AUTH_WRONG_ACTIAVTION_LINK_ERROR_CODE);
		}
		user.activated = true;
		await user.save();
	}
	static async login(email, password) {
		const user = await User.findOne({ email: email });
		if (!user) {
			throw ApiError.BadRequest(AUTH_USER_NOT_FOUND_ERROR_CODE);
		}
		const isPasswordValid = await compare(password, user.password);
		if (!isPasswordValid) {
			throw ApiError.BadRequest(AUTH_INVALID_PASSWORD_ERROR_CODE);
		}
		const userDto = new UserDto(user);
		const tokens = await TokenService.updateTokens({ ...userDto });

		return { ...tokens, user: userDto };
	}
	static async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.Unauthorized(AUTH_NO_CREDENTIALS_ERROR_CODE);
		}
		const userData = TokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = await TokenService.findToken(refreshToken);

		if (!userData || !tokenFromDb) {
			throw ApiError.Unauthorized(AUTH_INVALID_TOKEN_ERROR_CODE);
		}

		const user = await User.findById(userData.id);
		const userDto = new UserDto(user);
		const tokens = await TokenService.updateTokens({ ...userDto });

		return { ...tokens, user: userDto };
	}
	static async logout(refreshToken) {
		TokenService.removeToken(refreshToken);
	}
}
