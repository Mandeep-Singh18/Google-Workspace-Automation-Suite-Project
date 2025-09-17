import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; // Import JwtPayload type

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === 'string' || !decoded.id) {
      throw new Error('Invalid token payload');
    }
    req.user = { id: decoded.id };
    
    next(); 
  } catch (err) {
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};