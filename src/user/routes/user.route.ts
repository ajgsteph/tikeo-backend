import { Router } from 'express';
import { me } from '../controllers/user.controller';
import passport from 'passport';

const userRouter = Router();

userRouter.get('/me', passport.authenticate('jwt', { session: false }), me);

export default userRouter;
