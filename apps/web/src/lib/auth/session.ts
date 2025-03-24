import { createJWT, verifyJWT } from "@dkstore/utils/jwt";
import { cookies } from "next/headers";

export type SessionData = {
  user: { id: string };
  lastOtpVerifiedAt?: Date;
  expires: string;
};

export function sessionExpires() {
  const oneDay = 1000 * 60 * 60 * 24;
  return new Date(Date.now() + oneDay);
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await verifyJWT<SessionData>(session);
}

export async function setSession(userId: string) {
  const expires = sessionExpires();
  const session: SessionData = {
    user: { id: userId },
    lastOtpVerifiedAt: new Date(),
    expires: expires.toISOString(),
  };
  const encryptedSession = await createJWT(session);
  (await cookies()).set("session", encryptedSession, {
    expires,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}
