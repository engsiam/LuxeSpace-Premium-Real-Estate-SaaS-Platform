import { Router, Request, Response } from 'express';
import { signUp, signIn, signOut, getSession } from './auth.controller';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
// Legacy aliases
router.post('/register', signUp);
router.post('/login', signIn);
router.post('/refresh-token', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Token refresh not needed with session auth' });
});
router.post('/google', (req: Request, res: Response) => {
  res.json({ success: false, message: 'Google OAuth not configured' });
});
router.post('/signout', signOut);
router.get('/session', getSession);

export default router;