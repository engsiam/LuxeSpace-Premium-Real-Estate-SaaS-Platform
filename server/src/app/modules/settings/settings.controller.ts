import { Request, Response, NextFunction } from 'express';
import * as settingsService from './settings.service';
import ApiError from '../../utils/ApiError';

export const getSettingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await settingsService.getSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await settingsService.updateSettings(req.body);
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
