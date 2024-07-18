import type { NextRequest } from "next/server";

const authRoutes = ["/auth/"];
const privateRoutes: string[] = ["/settings"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;
  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuth = authRoutes.some((route) => pathname.startsWith(route));

  if (isPrivate && !token) {
    return Response.redirect(new URL("/auth/sign-in", request.url));
  }

  if (token && isAuth) {
    return Response.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
