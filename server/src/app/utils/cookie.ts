import env from '../../config';

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

export const getCrossDomainCookieOptions = (maxAge: number): CookieOptions => {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge,
  };
};

export const cookieOptions = getCookieOptions();
export const accessTokenCookieOptions = getCookieOptions(60 * 60 * 24 * 7);
export const refreshTokenCookieOptions = getCookieOptions(60 * 60 * 24 * 30);