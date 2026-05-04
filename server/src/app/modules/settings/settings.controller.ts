import { Request, Response, NextFunction } from 'express';
import * as settingsService from './settings.service';
import ApiError from '../../utils/ApiError';
import { uploadVideoToCloudinary } from '../../middlewares/upload.middleware';

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

export const uploadHeroVideos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new ApiError(400, 'No videos uploaded');
    }

    const videoUrls: string[] = [];
    for (const file of req.files as Express.Multer.File[]) {
      const url = await uploadVideoToCloudinary(file.buffer);
      videoUrls.push(url);
    }

    const settings = await settingsService.getSettings();
    const existingVideos = settings.heroVideos || [];
    const updatedVideos = [...existingVideos, ...videoUrls].slice(0, 6);

    const result = await settingsService.updateSettings({ heroVideos: updatedVideos });
    
    res.json({
      success: true,
      message: 'Hero videos uploaded successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
