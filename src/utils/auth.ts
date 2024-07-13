import { cookies } from "next/headers";
import { env } from "@/env";

export function isAuthenticated() {
  return !!cookies().get("token")?.value;
}

export function sessionExpires(rememberMe: boolean = false) {
  const oneDay = 1000 * 60 * 60 * 24;
  return rememberMe
    ? new Date(Date.now() + oneDay * 7)
    : new Date(Date.now() + oneDay);
}

export function setAuthCookie(token: string, expires?: Date) {
  cookies().set("token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}
