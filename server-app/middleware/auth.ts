import jwt, { JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';


export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Access denied: token missing' });
  }

  try {

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('❌ JWT_SECRET is missing in environment variables.');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

   
    (req as any).user = {
      id: decoded.id,
      email: decoded.username,
    };

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please log in again' });
    }
    res.status(403).json({ error: 'Invalid token' });
  }
}
