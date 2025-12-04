import { Request, Response } from 'express';
import { User } from '../models/User';
import { comparePassword, hashPassword } from '../services/passwordService';
import { generateToken } from '../services/jwtservice';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    const token = generateToken(newUser._id.toString(), newUser.email);

    res.status(201).json({
      token,
      user: { id: newUser._id, email: newUser.email, name: newUser.name },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString(), user.email);

    res.status(200).json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  // In a stateless JWT setup, logout is primarily a client-side action.
  // This endpoint is for confirming the action.
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get user', details: error.message });
  }
};