import { createJWT, verifyJWT } from "@dkstore/utils/jwt";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { type SessionData, sessionExpires } from "@/lib/auth/session";
import { authRoutes, protectedRoutes } from "./lib/auth/routes";
import { getQueueDashboardURL } from "./utils/queue-dash-url";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const signUrl = new URL("/auth/sign-in", request.url);
  const redirectQuery = searchParams.get("redirect");
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

  let parsedSession: SessionData | null = null;
  if (sessionCookie) {
    try {
      parsedSession = await verifyJWT<SessionData>(sessionCookie.value);
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
    if (redirectQuery && redirectQuery.includes("queue-dashboard")) {
      if (searchParams.get("isNotAdmin") === "true") {
        (await cookies()).delete("session");
        signUrl.searchParams.set("redirect", redirectQuery);
        return NextResponse.redirect(signUrl);
      }
      return NextResponse.redirect(await getQueueDashboardURL());
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
