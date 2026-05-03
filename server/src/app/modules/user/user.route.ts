import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as userController from './user.controller';
import { registerSchema, loginSchema, updateUserSchema, adminUpdateUserSchema } from './user.validation';
import { validateRequest } from '../../middlewares/validate.middleware';
import { upload } from '../../middlewares/upload.middleware';

const router = Router();

// Auth routes
router.post('/register', validateRequest(registerSchema), userController.register);
router.post('/login', validateRequest(loginSchema), userController.login);
router.post('/google', userController.googleAuth);
router.post('/refresh-token', userController.refreshToken);

// User routes
router.get('/', authGuard('ADMIN'), userController.getUsers);
router.get('/me', authGuard(), userController.getMe);
router.patch('/me', authGuard(), validateRequest(updateUserSchema), userController.updateMe);
router.post('/avatar', authGuard(), upload.single('file'), userController.uploadAvatar);
router.patch('/:id', authGuard('ADMIN'), validateRequest(adminUpdateUserSchema), userController.updateUser);
router.delete('/:id', authGuard('ADMIN'), userController.deleteUser);

// Also export for auth routes
router.post('/auth/register', validateRequest(registerSchema), userController.register);
router.post('/auth/login', validateRequest(loginSchema), userController.login);
router.post('/auth/google', userController.googleAuth);

export default router;
