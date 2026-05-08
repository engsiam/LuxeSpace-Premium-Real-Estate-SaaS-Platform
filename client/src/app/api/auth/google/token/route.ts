import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'luxespace-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    const { code, user } = await request.json();
    
    // Create a session token with user data
    const sessionToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role || 'USER',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const response = NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role: user.role || 'USER' }
    });
    
    // Set cookie
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create session' }, { status: 500 });
  }
}