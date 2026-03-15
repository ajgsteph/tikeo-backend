"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtStrategy = void 0;
exports.initializePassport = initializePassport;
const passport_jwt_1 = require("passport-jwt");
const user_service_1 = __importDefault(require("../../user/services/user.service"));
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};
exports.jwtStrategy = new passport_jwt_1.Strategy(opts, (jwtPayload, done) => {
    user_service_1.default
        .findUserById(jwtPayload.sub)
        .then((user) => {
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    })
        .catch((err) => done(err, false));
});
function initializePassport(passport) {
    passport.use(exports.jwtStrategy);
}
exports.default = initializePassport;
