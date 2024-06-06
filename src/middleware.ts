import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });
  const url = request.nextUrl;

  const isAuthPage =
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify");
  const isRootPage = url.pathname === "/";
  const isDashboardPage = url.pathname.startsWith("/dashboard");

  if(token) {
    if(isAuthPage || isRootPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    if(isDashboardPage) {
        return NextResponse.redirect( new URL('/sign-in',request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
