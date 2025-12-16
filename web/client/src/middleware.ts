import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const maintenanceMode = (process.env.MAINTENANCE_MODE ?? '').toLowerCase() === 'true';

export function middleware(request: NextRequest) {
    if (!maintenanceMode) return NextResponse.next();

    const { pathname } = request.nextUrl;

    if (pathname === '/') return NextResponse.next();

    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
