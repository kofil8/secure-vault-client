import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const IPINFO_API_TOKEN = process.env.IPINFO_API_TOKEN;
const ALLOWED_NORDVPN_IP = process.env.ALLOWED_NORDVPN_IP;

// Routes requiring auth check
const protectedRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ✅ Get real client IP safely
  const clientIP =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";

  try {
    // ✅ Lookup IP details from ipinfo.io
    const { data } = await axios.get(
      `https://ipinfo.io/${clientIP}?token=${IPINFO_API_TOKEN}`
    );

    const isVPN = data.privacy?.vpn === true;
    const isProxy = data.privacy?.proxy === true;
    const isTor = data.privacy?.tor === true;

    const isAllowedIP = clientIP === ALLOWED_NORDVPN_IP;

    // ❌ Block if not from your NordVPN IP or flagged as VPN/proxy
    if (!isAllowedIP || isVPN || isProxy || isTor) {
      return new NextResponse("Access denied: Unauthorized IP", {
        status: 403,
      });
    }
  } catch (error) {
    console.error("IP verification failed:", error);
    return new NextResponse("Access denied: IP check failed", { status: 403 });
  }

  // 🔐 Check cookie accessToken for protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get("accessToken")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|fonts|api/public).*)"], // Apply to all except public/static routes
};
