"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
exports.refreshToken = refreshToken;
const registerData_dto_1 = require("../dto/registerData.dto");
const loginData_dto_1 = require("../dto/loginData.dto");
const user_service_1 = __importDefault(require("../../user/services/user.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const env = process.env;
const secureCookie = env.NODE_ENV === 'production';
const sameSiteCookie = env.NODE_ENV === 'production' ? 'strict' : 'none';
function generateAccessToken(userId) {
    if (!env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ sub: userId }, env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}
function generateRefreshToken(userId) {
    if (!env.REFRESH_TOKEN_SECRET) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ sub: userId }, env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
async function login(req, res) {
    try {
        const validationBodyResult = loginData_dto_1.LoginDataSchema.safeParse(req.body);
        if (!validationBodyResult.success) {
            return res.status(400).json({ message: validationBodyResult.error });
        }
        const { email, password } = req.body;
        const user = await user_service_1.default.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        await user_service_1.default.updateUserByEmail(user.email, { refreshToken });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: secureCookie,
            sameSite: sameSiteCookie,
        });
        return res.status(200).json({ accessToken });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
async function register(req, res) {
    try {
        const validationBodyResult = registerData_dto_1.RegisterDataSchema.safeParse(req.body);
        if (!validationBodyResult.success) {
            return res.status(400).json({ message: validationBodyResult.error });
        }
        const { name, email, password, role, phone } = validationBodyResult.data;
        const existingUser = await user_service_1.default.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        const accessToken = generateAccessToken(email);
        const refreshToken = generateRefreshToken(email);
        await user_service_1.default.createUser({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
            phone,
            refreshToken: refreshToken,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: secureCookie,
            sameSite: sameSiteCookie,
            path: '/refresh-token',
        });
        return res.status(201).json({
            message: 'User registered successfully',
            accessToken,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
async function refreshToken(req, res) {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.status(401).json({ message: 'No refresh token provided' });
    if (!env.REFRESH_TOKEN_SECRET || !env.ACCESS_TOKEN_SECRET) {
        return res
            .status(500)
            .json({ message: 'Internal server error: missing environment variables' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env.REFRESH_TOKEN_SECRET);
        const user = await user_service_1.default.findUserById(payload.sub);
        if (!user)
            return res.status(403).json({ message: 'Invalid refresh token' });
        const newAccessToken = generateAccessToken(user.id);
        return res.status(200).json({
            accessToken: newAccessToken,
            message: 'Access token refreshed successfully',
        });
    }
    catch (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
}
