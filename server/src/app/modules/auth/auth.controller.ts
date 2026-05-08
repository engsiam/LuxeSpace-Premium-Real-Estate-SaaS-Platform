import { Request, Response } from 'express';
import prisma from '../../../prisma/client';
import bcrypt from 'bcrypt';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: (role as any) || 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });
    
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        password: true,
        isActive: true,
      },
    });
    
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const signOut = async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out' });
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No session' });
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(401).json({ error: 'No session' });
  }
};