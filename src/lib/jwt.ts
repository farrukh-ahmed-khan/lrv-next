import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

const SECRET = JWT_SECRET as string;

const TOKEN_EXPIRES_IN = '1h';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'home owner' | 'home member' | 'board member' | 'admin';
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}
