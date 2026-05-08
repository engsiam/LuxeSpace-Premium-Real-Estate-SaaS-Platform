import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as userController from './user.controller';
import { registerSchema, loginSchema, updateUserSchema, adminUpdateUserSchema } from './user.validation';
import { validateRequest } from '../../middlewares/validate.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { getClientUrl, getServerUrl } from '../../../config';

const router = Router();

// Auth routes
router.post('/register', validateRequest(registerSchema), userController.register);
router.post('/login', validateRequest(loginSchema), userController.login);
router.post('/logout', userController.logout);
router.post('/google', userController.googleAuth);
router.get('/session', userController.getSession);

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

// Google OAuth - GET for redirect-based auth
router.get('/auth/google', (req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const serverUrl = getServerUrl();
  const clientUrl = getClientUrl();
  const redirectUri = `${serverUrl}/api/v1/users/auth/google/callback`;
  
  if (!googleClientId || googleClientId === 'your-google-client-id') {
    return res.redirect(`${clientUrl}/login?error=google_not_configured`);
  }
  
  const scope = 'openid email profile';
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline`;
  
  res.redirect(authUrl);
});

// Google OAuth callback
router.get('/auth/google/callback', userController.googleAuthCallback);

router.post('/auth/google', userController.googleAuth);

export default router;
