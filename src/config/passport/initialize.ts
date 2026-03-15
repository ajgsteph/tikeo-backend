import { Strategy, ExtractJwt, StrategyOptionsWithoutRequest } from 'passport-jwt';
import userService from '../../user/services/user.service';
import type { PassportStatic } from 'passport';

const opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
};

export const jwtStrategy = new Strategy(opts, (jwtPayload, done) => {
  userService
    .findUserById(jwtPayload.sub)
    .then((user) => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
    .catch((err) => done(err, false));
});

export function initializePassport(passport: PassportStatic): void {
  passport.use(jwtStrategy);
}
export default initializePassport;
