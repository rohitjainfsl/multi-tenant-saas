import type { Request, Response } from 'express';
import User from '../models/user.model.js';
import {
  setTokenCookies,
  clearTokenCookies,
  signAccessToken,
  verifyRefreshToken,
} from '../utils/token.js';

// ─── Register ────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body as {
      name: string;
      email: string;
      password: string;
      phone?: string;
    };

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const user = await User.create({ name, email, password, phone });

    setTokenCookies(res, user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[register]', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    // Explicitly select password (it is excluded by default via select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    setTokenCookies(res, user);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[login]', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ─── Logout ──────────────────────────────────────────────────────────────────
export const logout = (_req: Request, res: Response): void => {
  clearTokenCookies(res);
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// ─── Me (check auth) ─────────────────────────────────────────────────────────
export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[me]', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Refresh Token ───────────────────────────────────────────────────────────
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const token: string | undefined = req.cookies?.refreshToken;

    if (!token) {
      res.status(401).json({ success: false, message: 'No refresh token provided.' });
      return;
    }

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found.' });
      return;
    }

    // Issue a new access token only (keep the same refresh token)
    const newAccessToken = signAccessToken(user);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ success: true, message: 'Access token refreshed.' });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
  }
};
