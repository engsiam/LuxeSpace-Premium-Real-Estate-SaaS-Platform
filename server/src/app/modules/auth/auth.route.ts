import { Router, Request, Response } from 'express';
import prisma from '../../../prisma/client';
import jwt from 'jsonwebtoken';
import { getCrossDomainCookieOptions } from '../../utils/cookie';

const router = Router();

router.get('/google', (req: Request, res: Response) => {
  const serverUrl = process.env.SERVER_URL;
  const clientUrl = process.env.CLIENT_URL;
  
  if (!serverUrl || !clientUrl) {
    console.error('Missing SERVER_URL or CLIENT_URL env vars');
    return res.redirect(`${clientUrl}/login?error=server_config_missing`);
  }
  
  const redirectUri = `${serverUrl}/api/v1/auth/callback/google`;
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid email profile&access_type=offline&prompt=consent`;
  
  console.log('[Google Auth] Generated auth URL:', googleAuthUrl);
  console.log('[Google Auth] Redirect URI:', redirectUri);
  
  res.redirect(googleAuthUrl);
});

router.get('/callback/google', async (req: Request, res: Response) => {
  const serverUrl = process.env.SERVER_URL;
  const clientUrl = process.env.CLIENT_URL;
  const { code, error } = req.query;
  
  console.log('[Google Callback] Received callback with code:', code ? 'present' : 'missing');
  console.log('[Google Callback] Error:', error);
  
  if (error) {
    console.error('[Google Callback] Error from Google:', error);
    return res.redirect(`${clientUrl}/login?error=${error}`);
  }
  
  if (!code) {
    console.error('[Google Callback] No code received');
    return res.redirect(`${clientUrl}/login?error=no_code`);
  }
  
  try {
    const redirectUri = `${serverUrl}/api/v1/auth/callback/google`;
    console.log('[Google Callback] Exchanging code for token with redirect_uri:', redirectUri);
    
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });
    
    const tokenData = await tokenRes.json() as { access_token?: string; error?: string };
    
    if (!tokenData.access_token) {
      console.error('[Google Callback] Token exchange failed:', tokenData);
      return res.redirect(`${clientUrl}/login?error=token_failed`);
    }
    
    console.log('[Google Callback] Token exchanged successfully');
    
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    const userData = await userRes.json() as { email: string; name?: string; picture?: string };
    console.log('[Google Callback] Got user info:', userData.email);
    
    let user = await prisma.user.findFirst({
      where: { email: userData.email }
    });
    
    if (!user) {
      console.log('[Google Callback] Creating new user:', userData.email);
      user = await prisma.user.create({
        data: {
          name: userData.name || userData.email.split('@')[0],
          email: userData.email,
          image: userData.picture,
          role: 'USER',
        }
      });
    } else {
      console.log('[Google Callback] Found existing user:', user.id);
    }
    
    const jwtToken = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );
    
    console.log('[Google Callback] Setting JWT cookie, token length:', jwtToken.length);
    res.cookie('accessToken', jwtToken, getCrossDomainCookieOptions(60 * 60 * 24 * 7));
    
    console.log('[Google Callback] Redirecting to:', `${clientUrl}/dashboard/user`);
    res.redirect(`${clientUrl}/dashboard/user`);
  } catch (error) {
    console.error('[Google Callback] Error:', error);
    res.redirect(`${clientUrl}/login?error=callback_failed`);
  }
});

export default router;