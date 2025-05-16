import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/api/auth/login' || 
    path === '/api/auth/register' || 
    path.startsWith('/login') || 
    path.startsWith('/register') || 
    path === '/' ||
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path.startsWith('/images') ||
    path.startsWith('/favicon');
  
  // Get the token from the request headers
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  // If the path is public, allow the request
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // If there's no token, redirect to login
  if (!token) {
    // For API routes, return a 401 Unauthorized response
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // For other routes, redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // If the token is valid, allow the request
    return NextResponse.next();
  } catch (error) {
    // If the token is invalid, return a 401 Unauthorized response for API routes
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // For other routes, redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Match all API routes except auth routes
    '/api/:path*',
    // Match all dashboard routes
    '/dashboard/:path*',
    // Match all student routes
    '/students/:path*',
    // Match all teacher routes
    '/teachers/:path*',
    // Match all course routes
    '/courses/:path*',
    // Match all schedule routes
    '/schedules/:path*',
    // Match all attendance routes
    '/attendances/:path*',
    // Match all grade routes
    '/grades/:path*',
  ],
};
