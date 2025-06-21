import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Paths that are accessible to non-authenticated users
  const publicPaths = ['/', '/login', '/register'];
  
  const isPublicPath = publicPaths.some((path) => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith('/api/') || 
    request.nextUrl.pathname.includes('/_next/')
  );
  
  if (!token && !isPublicPath) {
    // Redirect to login if trying to access a protected route without being authenticated
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    // Redirect to dashboard if trying to access login or register while authenticated
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 