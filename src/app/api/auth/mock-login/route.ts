import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock user data for development
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password',
    name: 'Admin User',
    role: 'ADMIN',
  },
  {
    id: '2',
    email: 'teacher@example.com',
    password: 'password',
    name: 'Teacher User',
    role: 'TEACHER',
    teacherId: 'teacher-1',
  },
  {
    id: '3',
    email: 'user@example.com',
    password: 'password',
    name: 'Regular User',
    role: 'USER',
  },
];

// POST /api/auth/mock-login - Mock login for development
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find the user
    const user = mockUsers.find(u => u.email === body.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Verify the password (simple comparison for mock)
    if (user.password !== body.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Create a JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
        teacherId: user.teacherId || null
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
    
    // Return user data and token
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teacherId: user.teacherId || null
      },
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
