import { Router, Request, Response } from 'express';
import { auth } from '../../../lib/auth';
import { toNodeHandler } from 'better-auth/node';
import prisma from '../../../prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/google', (req: Request, res: Response) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.SERVER_URL}/api/v1/auth/callback/google&response_type=code&scope=openid email profile&access_type=offline&prompt=consent`;
  res.redirect(googleAuthUrl);
});

router.get('/callback/google', async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=no_code`);
  }
  
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.SERVER_URL}/api/v1/auth/callback/google`,
      }),
    });
    
    const tokenData = await tokenRes.json() as { access_token?: string };
    
    if (!tokenData.access_token) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=token_failed`);
    }
    
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    const userData = await userRes.json() as { email: string; name?: string; picture?: string };
    
    let user = await prisma.user.findFirst({
      where: { email: userData.email }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: userData.name || userData.email.split('@')[0],
          email: userData.email,
          image: userData.picture,
          role: 'USER',
        }
      });
    }
    
    const jwtToken = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );
    
    res.cookie('accessToken', jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=callback_failed`);
  }
});

router.all('/{path*}', toNodeHandler(auth));

export default router;