import { type NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createJWT, verifyJWT } from "@/utils/jwt";
import { UnauthorizedError, errorHandler } from "@/app/api/errors";
import { sessionExpires } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const cookieToken = request.cookies.get("token")?.value;
    const tokenFromHeader = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "");
    const sessionToken = cookieToken || tokenFromHeader;

    if (!sessionToken || sessionToken === "null") {
      throw new UnauthorizedError("Invalid token");
    }

    const { sub: sessionId } = await verifyJWT(sessionToken);
    if (!sessionId) {
      throw new UnauthorizedError("Invalid token");
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
      omit: { userId: true },
    });
    if (!session || session.expires < new Date()) {
      throw new UnauthorizedError("Invalid or expired session");
    }

    await prisma.session.update({
      where: { id: session.id },
      data: { expires: sessionExpires(true) },
    });
    const token = await createJWT(session.id, "7d");

    return NextResponse.json({
      status: 200,
      message: "Session retrieved successfully",
      data: { session, token },
      success: true,
    });
  } catch (error) {
    const err = errorHandler(error);
    cookies().delete("token");
    return NextResponse.json(
      { ...err, success: false },
      { status: err.status },
    );
  }
}
