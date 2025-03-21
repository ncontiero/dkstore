import { env } from "./env";

export const redirectUrl = new URL(
  "/auth/sign-in?redirect=/account/admin?redirect=queue-dashboard",
  env.SITE_BASEURL,
).toString();

export function getSession(cookies?: string) {
  return cookies
    ?.split(";")
    .find((cookie) => {
      return cookie.includes("session");
    })
    ?.split("=")[1];
}
