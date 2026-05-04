import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { promisify } from 'util';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pipeline = promisify(require('stream').pipeline);

const storage = multer.memoryStorage();

export const upload = multer({ storage });

export const uploadVideo = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export const uploadVideoToCloudinary = async (buffer: Buffer, options?: { folder?: string }): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const uploadStream = (cloudinary as any).uploader.upload_stream(
      {
        folder: options?.folder || 'luxespace/videos',
        resource_type: 'video',
      },
      (error: Error, result: { secure_url: string }) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};
