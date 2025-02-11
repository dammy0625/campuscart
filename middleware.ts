import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token && !request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/api/auth/unauthorized", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}

