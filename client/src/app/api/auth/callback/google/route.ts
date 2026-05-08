import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'luxespace-secret-key-change-in-production';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  
  if (error) {
    return NextResponse.redirect(`${url.origin}/login?error=${error}`);
  }
  
  if (!code) {
    return NextResponse.redirect(`${url.origin}/login?error=no_code`);
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${url.origin}/api/auth/callback/google`,
      }),
    });
    
    const tokens = await tokenResponse.json();
    
    if (!tokens.access_token) {
      return NextResponse.redirect(`${url.origin}/login?error=token_failed`);
    }
    
    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    
    const googleUser = await userResponse.json();
    
    // Create session token
    const user = {
      id: `google_${googleUser.id}`,
      email: googleUser.email,
      name: googleUser.name,
      avatar: googleUser.picture,
      role: 'USER',
    };
    
    const sessionToken = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    
    // Redirect to dashboard with success
    const response = NextResponse.redirect(`${url.origin}/dashboard`);
    
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    return response;
  } catch (err) {
    console.error('Google callback error:', err);
    return NextResponse.redirect(`${url.origin}/login?error=auth_failed`);
  }
}