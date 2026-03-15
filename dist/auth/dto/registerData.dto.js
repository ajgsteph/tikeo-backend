"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDataSchema = void 0;
const zod_1 = require("zod");
const constant_1 = require("../../utils/constant");
const RegisterDataSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(30),
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6).max(100),
    phone: zod_1.z.string(),
    role: zod_1.z.enum(constant_1.ROLES),
});
exports.RegisterDataSchema = RegisterDataSchema;
