import { Request, Response, NextFunction } from 'express';

const rates = new Map<string, { count: number; lastReset: number }>();

export const rateLimiter = (limit: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'anonymous';
    const now = Date.now();
    const userRate = rates.get(ip) || { count: 0, lastReset: now };

    if (now - userRate.lastReset > windowMs) {
      userRate.count = 1;
      userRate.lastReset = now;
    } else {
      userRate.count++;
    }

    rates.set(ip, userRate);

    if (userRate.count > limit) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    next();
  };
};
