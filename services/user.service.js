import { compare, hash } from 'bcrypt';
import User from '../models/user.model.js';
import { v4 } from 'uuid';
import MailService from './mail.service.js';
import TokenService from './token.service.js';
import UserDto from '../dto/user.dto.js';
import ApiError from '../exceptions/apiError.js';

export default class UserService {
   static async createUser(email, password) {
      const candidate = await User.findOne({ email });
      if (candidate) {
         throw ApiError.Conflict('Email already in use');
      }

      const passwordHash = await hash(password, 5);
      const activationLink = v4();

      const user = await User.create({ email, password: passwordHash, activationLink });
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
         throw ApiError.BadRequest('Wrong activation link');
      }
      user.activated = true;
      await user.save();
   }
   static async login(email, password) {
      const user = await User.findOne({ email: email });
      if (!user) {
         throw ApiError.BadRequest('User with this email address was not found');
      }
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
         throw ApiError.BadRequest('Invalid password');
      }
      const userDto = new UserDto(user);
      const tokens = await TokenService.updateTokens({ ...userDto });

      return { ...tokens, user: userDto };
   }
   static async refresh(refreshToken) {
      if (!refreshToken) {
         throw ApiError.CredentialsWereNotProvided();
      }
      const userData = TokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await TokenService.findToken(refreshToken);

      if (!userData || !tokenFromDb) {
         throw ApiError.TokenIsInvalidOrExpired();
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
