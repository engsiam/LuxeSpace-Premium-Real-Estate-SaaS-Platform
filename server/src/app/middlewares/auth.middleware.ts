import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';
import env from '../../config';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const getToken = (req: Request): string | null => {
  // First check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  // Then check cookie
  const cookies = req.cookies;
  return cookies?.accessToken || null;
};

export const authGuard = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = getToken(req);
      
      if (!token) {
        throw new ApiError(401, 'Unauthorized: No token provided');
      }

      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string };

      if (roles.length && !roles.includes(decoded.role)) {
        throw new ApiError(403, 'Forbidden: Insufficient permissions');
      }

      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new ApiError(401, 'Unauthorized: Invalid token'));
      } else {
        next(error);
      }
    }
  };
};
