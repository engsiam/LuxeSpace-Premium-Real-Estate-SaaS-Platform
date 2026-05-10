import { Router, Request, Response } from 'express';
import prisma from '../../../prisma/client';
import jwt from 'jsonwebtoken';
import { getCrossDomainCookieOptions } from '../../utils/cookie';

const router = Router();

router.get('/google', (req: Request, res: Response) => {
  const serverUrl = process.env.SERVER_URL;
  const clientUrl = process.env.CLIENT_URL;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  
  console.log('[Google Auth] SERVER_URL:', serverUrl);
  console.log('[Google Auth] CLIENT_URL:', clientUrl);
  console.log('[Google Auth] GOOGLE_CLIENT_ID exists:', !!googleClientId);
  
  if (!serverUrl || !clientUrl) {
    console.error('Missing SERVER_URL or CLIENT_URL env vars');
    return res.redirect(`${clientUrl}/login?error=server_config_missing`);
  }
  
  if (!googleClientId) {
    console.error('Missing GOOGLE_CLIENT_ID env var');
    return res.redirect(`${clientUrl}/login?error=google_not_configured`);
  }
  
  const redirectUri = `${serverUrl}/api/v1/auth/callback/google`;
  
  console.log('[Google Auth] Full redirect URI:', redirectUri);
  console.log('[Google Auth] Make sure this URI is added in Google Cloud Console -> Credentials');
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid email profile&access_type=offline&prompt=consent`;
  
  res.redirect(googleAuthUrl);
});

router.get('/callback/google', async (req: Request, res: Response) => {
  const serverUrl = process.env.SERVER_URL;
  const clientUrl = process.env.CLIENT_URL;
  const { code, error } = req.query;
  
  const expectedRedirectUri = `${serverUrl}/api/v1/auth/callback/google`;
  console.log('[Google Callback] Expected redirect_uri:', expectedRedirectUri);
  console.log('[Google Callback] Received code:', code ? 'YES' : 'NO');
  console.log('[Google Callback] Error from Google:', error);
  
  if (error) {
    console.error('[Google Callback] Google error:', error);
    return res.redirect(`${clientUrl}/login?error=${error}`);
  }
  
  if (!code) {
    console.error('[Google Callback] No authorization code received');
    return res.redirect(`${clientUrl}/login?error=no_code`);
  }
  
  try {
    const redirectUri = `${serverUrl}/api/v1/auth/callback/google`;
    
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
    
    const tokenData = await tokenRes.json() as { access_token?: string; error?: string; error_description?: string };
    
    console.log('[Google Callback] Token response status:', tokenRes.status);
    if (tokenData.error) {
      console.error('[Google Callback] Token error:', tokenData.error, tokenData.error_description);
    }
    
    if (!tokenData.access_token) {
      return res.redirect(`${clientUrl}/login?error=token_failed`);
    }
    
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    const userData = await userRes.json() as { email: string; name?: string; picture?: string };
    console.log('[Google Callback] User email:', userData.email);
    
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
    }
    
    const jwtToken = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );
    
    res.cookie('accessToken', jwtToken, getCrossDomainCookieOptions(60 * 60 * 24 * 7));
    
    console.log('[Google Callback] Success! Redirecting to dashboard');
    res.redirect(`${clientUrl}/dashboard/user`);
  } catch (error) {
    console.error('[Google Callback] Error:', error);
    res.redirect(`${clientUrl}/login?error=callback_failed`);
  }
});

export default router;