import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { APP_ROUTES } from '@/app/config/routes';

type SupportedRole = 'ADMIN' | 'TECHNICIAN' | 'USER';

function getRouteByRole(role?: string | null) {
  if (role === 'ADMIN') {
    return APP_ROUTES.ADMIN.DASHBOARD;
  }

  if (role === 'TECHNICIAN') {
    return APP_ROUTES.TECHNICIAN.Home;
  }

  return APP_ROUTES.HOME;
}

function isSupportedRole(role?: string | null): role is SupportedRole {
  return role === 'ADMIN' || role === 'TECHNICIAN' || role === 'USER';
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const token = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  if (pathname.startsWith('/auth') && token && isSupportedRole(userRole)) {
    url.pathname = getRouteByRole(userRole);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/admin')) {
    if (!token || userRole !== 'ADMIN') {
      url.pathname = APP_ROUTES.Auth.LOGIN;
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith('/technician')) {
    if (!token || userRole !== 'TECHNICIAN') {
      url.pathname = APP_ROUTES.Auth.LOGIN;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/technician/:path*',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
  ],
};
