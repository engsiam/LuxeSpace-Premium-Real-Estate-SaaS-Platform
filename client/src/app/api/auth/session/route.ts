import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { BASE_URL } from '@/lib/config';

// Session check calls backend /users/session which reads cookies.accessToken
// Must use withCredentials to send cookies cross-origin (Vercel → Render)
export async function GET(request: NextRequest) {
  try {
    const response = await axios.get(`${BASE_URL}/users/session`, {
      withCredentials: true,
    });
    
    if (response.data.success && response.data.data.isAuthenticated) {
      return NextResponse.json({
        session: { user: response.data.data.user }
      });
    }
    
    return NextResponse.json({ session: null });
  } catch (error) {
    console.error('[Session] Backend session check failed:', error);
    return NextResponse.json({ session: null });
  }
}

// Logout clears cookies by calling backend
export async function POST(request: NextRequest) {
  try {
    await axios.post(
      `${BASE_URL}/users/logout`,
      {},
      { withCredentials: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Session] Logout failed:', error);
    return NextResponse.json({ success: false });
  }
}
