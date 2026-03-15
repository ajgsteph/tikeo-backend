import { Request, Response } from 'express';
import { RegisterDataSchema } from '../dto/registerData.dto';
import { LoginDataSchema } from '../dto/loginData.dto';
import userService from '../../user/services/user.service';
import { RoleUserType } from '../../user/type';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { logger } from '../../shared/logger/logger.service';

const env = process.env;
const secureCookie = env.NODE_ENV === 'production';
//const sameSiteCookie = env.NODE_ENV === 'production' ? 'strict' : 'none';
const sameSiteCookie = env.NODE_ENV === 'production' ? 'none' : 'lax';

function generateAccessToken(userId: string) {
  if (!env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }

  return jwt.sign({ sub: userId }, env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1h' });
}

function generateRefreshToken(userId: string) {
  if (!env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }

  return jwt.sign({ sub: userId }, env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });
}

async function login(req: Request, res: Response) {
  try {
    const validationBodyResult = LoginDataSchema.safeParse(req.body);
    if (!validationBodyResult.success) {
      return res.status(400).json({ message: validationBodyResult.error });
    }
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const accessToken = generateAccessToken(user.id as string);
    const refreshToken = generateRefreshToken(user.id as string);
    await userService.updateUserById(user.id as string, { refreshToken });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: secureCookie,
      sameSite: sameSiteCookie,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    logger.error('Login error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function register(req: Request, res: Response) {
  try {
    const validationBodyResult = RegisterDataSchema.safeParse(req.body);
    if (!validationBodyResult.success) {
      return res.status(400).json({ message: validationBodyResult.error });
    }
    const { name, email, password, role, phone } = validationBodyResult.data;
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser({
      name: name,
      email: email,
      password: hashPassword,
      role: role as RoleUserType,
      phone,
    });
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await userService.updateUserById(user.id, { refreshToken });

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
  } catch (error) {
    logger.error('Registration error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function refreshToken(req: Request, res: Response) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token provided' });

  if (!env.REFRESH_TOKEN_SECRET || !env.ACCESS_TOKEN_SECRET) {
    return res
      .status(500)
      .json({ message: 'Internal server error: missing environment variables' });
  }

  try {
    const payload = jwt.verify(token, env.REFRESH_TOKEN_SECRET);
    const user = await userService.findUserById(payload.sub as string);
    if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

    const newAccessToken = generateAccessToken(user.id as string);

    return res.status(200).json({
      accessToken: newAccessToken,
      message: 'Access token refreshed successfully',
    });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
}

export { login, register, refreshToken };
