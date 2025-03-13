import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { env } from "@/env";

export const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export async function createJWT<T extends JWTPayload>(
  payload: T,
  exp: string = "1d",
) {
  return await new SignJWT(payload)
    .setIssuedAt()
    .setExpirationTime(exp)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .sign(JWT_SECRET);
}

export async function verifyJWT<T extends JWTPayload>(token: string) {
  const { payload } = await jwtVerify<T>(token, JWT_SECRET, {
    algorithms: ["HS256"],
  });
  return payload;
}
