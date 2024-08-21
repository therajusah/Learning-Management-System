import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';
import User from '../models/user.model';
import cloudinary from '../config/cloudinary';
import { CustomRequest } from '../types/customRequest';

// Register a new user
export const register = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, password, avatar } = req.body;

    if (!fullName || !email || !password || !avatar) {
      return next(new AppError('All fields are required', 400));
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return next(new AppError('Email already in use', 400));
    }

  
    const uploadResult = await cloudinary.uploader.upload(avatar, {
      folder: 'avatars',
    });

    const user = new User({
      fullName,
      email,
      password,  
      avatar: {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
      },
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
    });

  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h', 
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token, 
    });

  } catch (error) {
    next(error);
  }
};

// Logout user
export const logout = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
export const getProfile = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    next(error);
  }
};
