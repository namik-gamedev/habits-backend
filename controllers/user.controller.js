import { validationResult } from 'express-validator';
import User from '../models/user.model.js';
import UserService from '../services/user.service.js';
import ApiError from '../exceptions/apiError.js';
import CommonUserDto from '../dto/commonUser.dto.js';
import { VALIDATION_ERROR_CODE } from '../exceptions/errorCodes.js';

export default class UserController {
	static async registration(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest(VALIDATION_ERROR_CODE, errors.array()));
			}

			const { email, password, name } = req.body;
			const userData = await UserService.createUser(email, password, name);
			res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}
	static async login(req, res, next) {
		try {
			const { email, password } = req.body;
			const userData = await UserService.login(email, password);
			res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}
	static async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			await UserService.logout(refreshToken);
			res.clearCookie('refreshToken');
			return res.json();
		} catch (e) {
			next(e);
		}
	}
	static async activate(req, res, next) {
		try {
			const { link } = req.params;
			await UserService.activate(link);
			return res.redirect(process.env.CLIENT_URL);
		} catch (e) {
			next(e);
		}
	}
	static async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const userData = await UserService.refresh(refreshToken);
			res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}
	static async getAllUsers(_req, res, next) {
		try {
			const users = UserService.getAllUsers();
			res.json(cusers);
		} catch (e) {
			next(e);
		}
	}
	static async deleteAllUsers(_req, res, next) {
		try {
			const users = await User.deleteMany({});
			res.json([]);
		} catch (e) {
			next(e);
		}
	}
}
