"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../config/prisma/client"));
class UserService {
    async createUser(data) {
        return client_1.default.user.create({
            data,
        });
    }
    async findUserByEmail(email) {
        return client_1.default.user.findUnique({
            where: { email },
        });
    }
    async findUserById(id) {
        return client_1.default.user.findUnique({
            where: { id },
        });
    }
    async updateUserByEmail(email, data) {
        return client_1.default.user.update({
            where: { email },
            data,
        });
    }
}
const userService = new UserService();
exports.default = userService;
