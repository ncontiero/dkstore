import { totp } from "speakeasy";

export function isTotpValid(secret: string, code: string) {
  return totp.verify({
    secret,
    encoding: "base32",
    token: code,
    window: 1,
    step: 30,
  });
}
