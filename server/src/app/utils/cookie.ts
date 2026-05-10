import env from '../../config';

// Cross-origin auth requires specific cookie settings:
// - httpOnly: prevents XSS attacks, browser-only access
// - secure: HTTPS only in production (required for cross-origin cookies)
// - sameSite: 'none' for cross-origin in production (Vercel↔Render)
// - sameSite: 'lax' for localhost (browsers allow localhost to work)

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge?: number;
}

export const getCookieOptions = (maxAge?: number): CookieOptions => {
  const isProduction = env.NODE_ENV === 'production';
  
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    ...(maxAge && { maxAge }),
  };
};

// Always use cross-domain settings for auth cookies between Vercel frontend and Render backend
export const getCrossDomainCookieOptions = (maxAge: number): CookieOptions => {
  const isProduction = env.NODE_ENV === 'production';
  
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge,
  };
};

export const cookieOptions = getCookieOptions();
export const accessTokenCookieOptions = getCookieOptions(60 * 60 * 24 * 7);
export const refreshTokenCookieOptions = getCookieOptions(60 * 60 * 24 * 30);
