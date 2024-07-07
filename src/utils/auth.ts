import { cookies } from "next/headers";

export function isAuthenticated() {
  return !!cookies().get("token")?.value;
}

export function sessionExpires(rememberMe: boolean) {
  const oneDay = 1000 * 60 * 60 * 24;
  return rememberMe
    ? new Date(Date.now() + oneDay * 7)
    : new Date(Date.now() + oneDay);
}
