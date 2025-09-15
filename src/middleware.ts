import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface JWTPayload {
    userId: number;
    username: string;
    role: string;
    iat: number;
    exp: number;
}

// Simple JWT decoder untuk Edge Runtime
function decodeJWT(token: string): JWTPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        const payload = JSON.parse(
            Buffer.from(parts[1], 'base64url').toString()
        );
        
        // Check if token is expired
        if (payload.exp && payload.exp < Date.now() / 1000) {
            console.log(`⏰ [MIDDLEWARE] Token expired at ${new Date(payload.exp * 1000)}`);
            return null;
        }
        
        console.log(`✅ [MIDDLEWARE] Token decoded successfully for user: ${payload.username}`);
        return payload;
    } catch (error) {
        console.error(`❌ [MIDDLEWARE] Token decode failed:`, error);
        return null;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Log setiap request yang masuk middleware
    console.log(`🔍 [MIDDLEWARE] ${request.method} ${pathname}`);
    
    const token = request.cookies.get('auth-token')?.value;
    const payload = token ? decodeJWT(token) : null;

    // Jika mengakses halaman admin dan sudah login, redirect ke dashboard
    if (pathname === '/admin') {
        if (payload) {
            console.log(`� [MIDDLEWARE] User already logged in, redirecting to dashboard`);
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        console.log(`👤 [MIDDLEWARE] No valid token, allowing access to admin login`);
        return NextResponse.next();
    }

    // Proteksi semua halaman dashboard
    if (pathname.startsWith('/dashboard')) {
        console.log(`🛡️  [MIDDLEWARE] Protecting dashboard route: ${pathname}`);
        
        if (!token) {
            console.log(`🚫 [MIDDLEWARE] No token found, redirecting to /admin`);
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        if (!payload) {
            console.log(`🚫 [MIDDLEWARE] Invalid token, redirecting to /admin`);
            const response = NextResponse.redirect(new URL('/admin', request.url));
            response.cookies.delete('auth-token');
            return response;
        }

        console.log(`✅ [MIDDLEWARE] Valid token for user: ${payload.username}`);
    }

    return NextResponse.next();
}

// Menggunakan matcher yang sederhana dan jelas
export const config = {
    matcher: [
        '/admin',
        '/dashboard',
        '/dashboard/(.*)',
    ],
};
