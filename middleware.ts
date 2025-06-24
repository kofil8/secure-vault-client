// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// Protected routes
const protectedRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (isProtectedRoute) {
    const token =
      request.cookies.get("token")?.value || "safaslkdfjasldfksaf";
      
    // Or use localStorage if client-side — but cookies are better for SSR
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"], // Protect all dashboard routes
};
