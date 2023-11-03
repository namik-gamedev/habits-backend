import jwt from 'jsonwebtoken';
import Token from '../models/token.model.js';

export default class TokenService {
	static generateTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
			expiresIn: '15m',
		});
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
			expiresIn: '20d',
		});
		return {
			accessToken,
			refreshToken,
		};
	}
	static validateAccessToken(accessToken) {
		try {
			const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
			return userData;
		} catch {
			return null;
		}
	}
	static validateRefreshToken(refreshToken) {
		try {
			const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
			return userData;
		} catch {
			return null;
		}
	}
	static async saveToken(userId, refreshToken) {
		const tokenData = await Token.findOne({ userId });
		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save();
		}
		const token = await Token.create({ userId, refreshToken });
		return token;
	}
	static async updateTokens(user) {
		const tokens = this.generateTokens(user);
		await this.saveToken(user.id, tokens.refreshToken);
		return tokens;
	}
	static async removeToken(refreshToken) {
		await Token.deleteOne({ refreshToken });
	}
	static async findToken(refreshToken) {
		const token = await Token.findOne({ refreshToken });
		return token;
	}
}
