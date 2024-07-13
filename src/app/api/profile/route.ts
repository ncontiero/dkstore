import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/utils/jwt";
import { UnauthorizedError, errorHandler } from "../errors";

export async function GET(request: NextRequest) {
  try {
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
      include: { user: true },
    });
    if (!session || session.expires < new Date()) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    return NextResponse.json({
      status: 200,
      message: "User fetched successfully",
      data: { ...session.user },
      success: true,
    });
  } catch (error) {
    const err = errorHandler(error);
    return NextResponse.json(
      { ...err, success: false },
      { status: err.status },
    );
  }
}
