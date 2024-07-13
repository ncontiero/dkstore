import type { NextRequest } from "next/server";
import { api } from "./utils/api";

const authRoutes = ["/auth/"];
const privateRoutes: string[] = ["/settings"];

export async function middleware(request: NextRequest) {
  const signInURL = new URL("/auth/sign-in", request.url);
  const pathname = request.nextUrl.pathname;
  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuth = authRoutes.some((route) => pathname.startsWith(route));

  const { content } = await api.get<{ token: string }>("verifySession", {
    throwError: false,
  });

  if (isPrivate && !content?.data?.token) {
    request.cookies.delete("token");
    return Response.redirect(signInURL);
  } else if (!content?.data?.token) {
    request.cookies.delete("token");
    return;
  }

  if (content.data.token && isAuth) {
    return Response.redirect(new URL("/", request.url));
  }

  request.cookies.set("token", content.data.token);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
