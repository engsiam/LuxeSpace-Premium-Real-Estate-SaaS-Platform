import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import ApiError from '../utils/ApiError';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: unknown) {
      const err = error as { errors?: { message?: string }[] };
      next(new ApiError(400, err.errors?.[0]?.message || 'Validation failed'));
    }
  };
};
