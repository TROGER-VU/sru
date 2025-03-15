import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isPublicPath = path === '/login' || path === '/signup';

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/profile', request.nextUrl));
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    return NextResponse.next(); // Important: Continue the request if no redirect is needed
}

export const config = {
    matcher: ['/', '/profile', '/login', '/signup'],
};