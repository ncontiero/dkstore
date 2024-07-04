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

    const { sub: userId } = await verifyJWT(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      omit: { passwordHash: true },
    });
    if (!user) {
      throw new UnauthorizedError("Invalid token");
    }

    return NextResponse.json({
      status: 200,
      message: "User fetched successfully",
      data: { ...user },
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
