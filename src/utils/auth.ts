import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { UnauthorizedError } from "@/app/api/errors";
import { env } from "@/env";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "./jwt";

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

export async function getSession(
  request: NextRequest,
  includePassHash: boolean = false,
) {
  const cookieToken = request.cookies.get("token")?.value;
  const tokenFromHeader = request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");
  const token = cookieToken || tokenFromHeader;

  if (!token || token === "null") {
    throw new UnauthorizedError("Invalid token");
  }

  const { sub: sessionId } = await verifyJWT(token);
  if (!sessionId) {
    throw new UnauthorizedError("Invalid token");
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });
  if (!session || session.expires < new Date()) {
    throw new UnauthorizedError("Invalid or expired token");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    omit: { passwordHash: !includePassHash },
  });
  if (!user) {
    throw new UnauthorizedError("Invalid token");
  }

  return { ...session, user };
}
