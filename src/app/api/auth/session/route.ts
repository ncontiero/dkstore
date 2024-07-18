import { type NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { errorHandler } from "@/app/api/errors";
import { getSession } from "@/utils/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { user } = await getSession(request);

    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
      },
    });

    const includeUser =
      request.nextUrl.searchParams.get("includeUser") === "true";

    return NextResponse.json({
      status: 200,
      message: "Session retrieved successfully",
      data: { sessions, user: includeUser ? user : null },
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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);

    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });
    cookies().delete("token");

    return NextResponse.json({
      status: 200,
      message: "Session deleted successfully",
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
