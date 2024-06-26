import { NextRequest, NextResponse } from 'next/server';
import { ROUTE_PATH } from './constants/routePath';
import { HttpStatusCode } from 'axios';

export async function middleware(request: NextRequest) {
  const requestCookies = request.cookies;

  const redirectLoginURL = `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTE_PATH.LOGIN(request.nextUrl.pathname)}`;
  const redirectHomeURL = `${process.env.NEXT_PUBLIC_SITE_URL}`;

  const verifiedToken = requestCookies?.get('verifiedToken')?.value;

  const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/verify`, {
    cache: 'no-store',
    headers: {
      Authorization: verifiedToken ? `Bearer ${verifiedToken}` : '',
      Cookie: requestCookies.toString(),
    },
  });

  const payload = await verifyResponse.json();

  if (payload.status === HttpStatusCode.Unauthorized) {
    return NextResponse.redirect(redirectLoginURL);
  }

  if (payload.status === HttpStatusCode.Forbidden) {
    return NextResponse.redirect(redirectHomeURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
