import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const POST = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/auth', '');
    
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (key !== 'host') headers.set(key, value);
    });

    const proxyReq = new Request(`${API_URL}/auth${path}`, {
      method: 'POST',
      headers,
      body: await request.text(),
      credentials: 'include',
    });

    const response = await fetch(proxyReq);
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Auth proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

const GET = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/auth', '');
    
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (key !== 'host') headers.set(key, value);
    });

    const proxyReq = new Request(`${API_URL}/auth${path}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const response = await fetch(proxyReq);
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Auth proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

export { POST, GET };