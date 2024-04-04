import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookies = request.cookies;

  const token = cookies.get("token")?.value;

  console.log("TOKEN MIDDLEWARE", token);

  //   if (
  //     request.nextUrl.pathname.startsWith("/sign-in") ||
  //     request.nextUrl.pathname.startsWith("/sign-up")
  //   ) {
  //     if (token) return NextResponse.redirect(new URL("/", request.url));
  //     return NextResponse.next();
  //   }

  //   if (!token) {
  //     return NextResponse.redirect(new URL("/sign-in", request.url));
  //   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up"],
};
