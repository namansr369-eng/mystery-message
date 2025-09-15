import { NextResponse, NextRequest } from "next/server";
import { auth } from "./auth";

export default auth(async function middleware(req) {
  const session = req.auth;
  const url = req.nextUrl;

  // List of public pages that should not redirect authenticated users
  const publicPages = ['/sign-in', '/sign-up', '/', '/verify'];

  // Case 1: If the user is authenticated and trying to access a public page, redirect to dashboard
  if (session && publicPages.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Case 2: If the user is NOT authenticated and trying to access a protected page, redirect to sign-in
  if (!session && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Case 3: Allow the request to continue if no redirects are needed
  return NextResponse.next();
});

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};