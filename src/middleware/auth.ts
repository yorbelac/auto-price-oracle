import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new Error();
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
}; 