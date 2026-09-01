import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    
    // returns true if token is expired
    return exp < currentTime;
  } catch (error) {
    // treat malformed tokens as expired
    return true; 
  }
};