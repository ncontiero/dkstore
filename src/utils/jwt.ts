import { SignJWT, jwtVerify } from "jose";
import { env } from "@/env";

export const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export async function createJWT(subject: string) {
  return await new SignJWT()
    .setIssuedAt()
    .setExpirationTime("7d")
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(subject)
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload;
}
