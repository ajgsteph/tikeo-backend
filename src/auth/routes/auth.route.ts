import { Router } from 'express';
import { login, register, refreshToken } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshToken);

export default authRouter;
