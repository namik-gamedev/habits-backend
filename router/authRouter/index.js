import { Router } from 'express';
import UserController from '../../controllers/user.controller';
import { body } from 'express-validator';

const authRouter = Router();

const { registration, login, logout, activate, refresh } = UserController;

authRouter.post('/registration', [body('email').isEmail(), body('password').isLength({ min: 8, max: 32 })], registration);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/activate/:link', activate);
authRouter.get('/refresh', refresh);

export default authRouter;