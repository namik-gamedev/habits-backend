import { Router } from 'express';
import UserController from '../../controllers/user.controller.js';
import { body } from 'express-validator';

const authRouter = Router();

const { registration, login, logout, activate, refresh } = UserController;

authRouter.post(
	'/registration',
	[body('email').isEmail(), body('password').isLength({ min: 8, max: 32 }), body('name').isLength({ min: 1, max: 50 })],
	registration,
);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/activate/:link', activate);
authRouter.get('/refresh', refresh);

export default authRouter;
