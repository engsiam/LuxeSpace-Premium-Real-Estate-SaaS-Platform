import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'luxespace-secret-key-change-in-production';

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
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => c.split('='))
  );
  
  const token = cookies.session_token;
  
  if (!token) {
    return NextResponse.json({ success: false });
  }
  
  try {
    jwt.verify(token, JWT_SECRET);
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('session_token', '', { maxAge: 0, path: '/' });
    return response;
  } catch {
    return NextResponse.json({ success: false });
  }
}