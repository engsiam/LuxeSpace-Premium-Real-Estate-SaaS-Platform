import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'luxespace-jwt-secret-change-in-production';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => c.split('='))
  );
  
  const token = cookies.session_token;
  
  if (!token) {
    return NextResponse.json({ session: null });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ session: { user: decoded } });
  } catch {
    return NextResponse.json({ session: null });
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/auth', '');
  
  if (path === '/logout' || path === '/sign-out') {
    const response = NextResponse.json({ success: true });
    response.cookies.set('session_token', '', { maxAge: 0, path: '/' });
    return response;
  }
  
  try {
    const body = await request.json();
    
    if (path === '/login' || path === '/sign-in') {
      // Accept demo credentials
      const { email, password } = body;
      
      if (password === 'demo' || password === 'Admin@123' || password === 'User@123' || password === 'Agent@123') {
        const user = {
          id: 'user_' + Date.now(),
          email,
          name: email.split('@')[0],
          role: email.includes('admin') ? 'ADMIN' : email.includes('agent') ? 'AGENT' : 'USER',
        };
        
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
        const response = NextResponse.json({ session: { user } });
        
        response.cookies.set('session_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
        
        return response;
      }
      
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}