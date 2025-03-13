import { type NextRequest, NextResponse } from "next/server";
import { sessionExpires } from "@/lib/auth/session";
import { createJWT, verifyJWT } from "@/utils/jwt";

const authRoutes = ["/auth/sign-in", "/auth/sign-up"];
const protectedRoutes = ["/settings"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signUrl = new URL("/auth/sign-in", request.url);
  const sessionCookie = request.cookies.get("session");

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !sessionCookie) {
    signUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signUrl);
  }

  const res = NextResponse.next();

  if (sessionCookie) {
    try {
      const parsedSession = await verifyJWT(sessionCookie.value);
      const expires = sessionExpires();

      res.cookies.set({
        name: "session",
        value: await createJWT({
          ...parsedSession,
          expires: expires.toISOString(),
        }),
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires,
      });
    } catch (error) {
      console.error("Error updating session:", error);
      res.cookies.delete("session");
      if (isProtectedRoute) {
        signUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(signUrl);
      }
    }
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
