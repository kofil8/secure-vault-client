import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const IPINFO_API_TOKEN = process.env.IPINFO_API_TOKEN;
const ALLOWED_NORDVPN_IP = process.env.ALLOWED_NORDVPN_IP;

const protectedRoutes = ["/dashboard", "/change-password", "/editor"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const hostname = request.headers.get("host") || "";
  const isLocalhost =
    hostname.startsWith("localhost") || hostname.startsWith("127.0.0.1");

  const token = request.cookies.get("accessToken")?.value;

  // ✅ Allow public access without IP check if not protected route
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));
  if (!isProtected) {
    return NextResponse.next();
  }

  // ✅ Redirect to /login if trying to access protected route without token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Skip VPN check for localhost
  if (isLocalhost) return NextResponse.next();

  // 🔍 Extract client IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIP = forwardedFor?.split(",")[0]?.trim() || "0.0.0.0";

  // 🧪 VPN/Proxy/Tor check using ipinfo.io
  try {
    const { data } = await axios.get(
      `https://ipinfo.io/${clientIP}?token=${IPINFO_API_TOKEN}`
    );

    const { vpn, proxy, tor } = data?.privacy || {};
    const isBlocked = vpn || proxy || tor;
    const isAllowedIP = clientIP === ALLOWED_NORDVPN_IP;

    console.log("🛡️ IP Check Report:", {
      clientIP,
      isAllowedIP,
      vpn,
      proxy,
      tor,
    });

    if (!isAllowedIP || isBlocked) {
      return new NextResponse("Access denied: Unauthorized IP", {
        status: 403,
      });
    }
  } catch (error) {
    console.error("🔴 VPN check failed:", error);
    return new NextResponse("Access denied: VPN check failed", {
      status: 403,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|fonts|api/public).*)"],
};
