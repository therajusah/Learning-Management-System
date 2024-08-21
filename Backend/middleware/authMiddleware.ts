import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { CustomRequest } from '../types/customRequest';
import AppError from '../utils/appError';

interface JwtPayload {
  id: string;
}

export const protect = async (req: CustomRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;
  

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    return next(new AppError('JWT secret is not defined in environment variables', 500));
  }

  try {

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (typeof decoded.id !== 'string') {
      return next(new AppError('Token is invalid', 401));
    }


    const currentUser = await User.findById(decoded.id).exec() as IUser | null;

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

   
    req.user = {
      id: currentUser._id.toString(), 
      email: currentUser.email,
      role: currentUser.role,
    };

    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again!', 401));
  }
};
 