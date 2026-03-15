"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const passport_1 = __importDefault(require("passport"));
const userRouter = (0, express_1.Router)();
userRouter.get('/me', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.me);
exports.default = userRouter;
