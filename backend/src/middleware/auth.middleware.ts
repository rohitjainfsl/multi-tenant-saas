import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token.js';
import User from '../models/user.model.js';

// Extend Express Request to carry the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token: string | undefined = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authenticated. No token provided.' });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    // Verify user still exists in DB
    const userExists = await User.findById(decoded.id).select('_id role');
    if (!userExists) {
      res.status(401).json({ success: false, message: 'User no longer exists.' });
      return;
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};
