import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadImageToCloudinary } from '../../middlewares/upload.middleware';

const router = Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const url = await uploadImageToCloudinary(req.file.buffer, { folder: 'luxespace/blogs' });
    
    res.json({ 
      success: true, 
      message: 'Image uploaded successfully',
      url: url 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload image',
      error: error.message 
    });
  }
});

export default router;