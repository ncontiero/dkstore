import type { NextRequest } from "next/server";

import { verifyJWT } from "@/utils/jwt";
import { prisma } from "@/lib/prisma";
import { UnauthorizedError } from "../errors";

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
  const user = await prisma.user.findUnique({
    where: { id: session?.userId },
    omit: { passwordHash: !includePassHash },
  });
  if (!session || !user || session.expires < new Date()) {
    throw new UnauthorizedError("Invalid or expired token");
  }

  return { ...session, user };
}
