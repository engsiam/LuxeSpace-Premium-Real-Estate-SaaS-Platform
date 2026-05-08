const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/auth/callback/google`;
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL is not defined');
  }
  return `${appUrl}/api/auth/callback/google`;
};

export function getGoogleAuthUrl() {
  const scope = 'openid email profile';
  const redirectUri = getRedirectUri();
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
  return authUrl;
}

export async function exchangeCodeForTokens(code: string) {
  const response = await fetch('/api/auth/google/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  return response.json();
}

export async function getGoogleUserInfo(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.json();
}