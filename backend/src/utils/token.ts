import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import type { IUser } from '../models/user.model.js';

interface TokenPayload {
  id: string;
  role: string;
}

export const signAccessToken = (user: IUser): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? '1h';
  if (!secret) throw new Error('JWT_ACCESS_SECRET is not defined');

  return jwt.sign({ id: user.id, role: user.role } as TokenPayload, secret, {
    expiresIn,
  } as jwt.SignOptions);
};

export const signRefreshToken = (user: IUser): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');

  return jwt.sign({ id: user.id, role: user.role } as TokenPayload, secret, {
    expiresIn,
  } as jwt.SignOptions);
};

export const setTokenCookies = (res: Response, user: IUser): void => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const isProduction = process.env.NODE_ENV === 'production';

  // In production the frontend and backend are on different domains
  // (azurestaticapps.net vs azurewebsites.net), so we need:
  //   sameSite: 'none' — allows cross-origin cookie sending
  //   secure: true     — required by all browsers when sameSite is 'none'
  // In development both run on localhost so 'lax' is fine.
  const sameSite = (isProduction ? 'none' : 'lax') as 'none' | 'lax';

  // Access token cookie — 1 hour
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    maxAge: 60 * 60 * 1000, // 1 hour in ms
  });

  // Refresh token cookie — 7 days
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};

export const clearTokenCookies = (res: Response): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = (isProduction ? 'none' : 'lax') as 'none' | 'lax';
  const cookieOpts = { httpOnly: true, secure: isProduction, sameSite, maxAge: 0 };
  res.cookie('accessToken', '', cookieOpts);
  res.cookie('refreshToken', '', cookieOpts);
};


export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET is not defined');
  return jwt.verify(token, secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');
  return jwt.verify(token, secret) as TokenPayload;
};
