import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';
import env from '../../config';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authGuard = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Unauthorized: No token provided');
      }

      const token = authHeader.split(' ')[1];
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
