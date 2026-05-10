import env from '../../config';

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge?: number;
  domain?: string;
}

export const getCookieOptions = (maxAge?: number): CookieOptions => {
  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
  
  return {
    httpOnly: true,
    secure: !isDev,
    sameSite: isDev ? 'lax' : 'none',
    path: '/',
    ...(maxAge && { maxAge: maxAge * 1000 }),
  };
};

export const getCrossDomainCookieOptions = (maxAge: number): CookieOptions => {
  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
  
  return {
    httpOnly: true,
    secure: !isDev,
    sameSite: isDev ? 'lax' : 'none',
    path: '/',
    maxAge: maxAge * 1000,
  };
};

export const cookieOptions = getCookieOptions();
export const accessTokenCookieOptions = getCookieOptions(60 * 60 * 24 * 7);
export const refreshTokenCookieOptions = getCookieOptions(60 * 60 * 24 * 30);
