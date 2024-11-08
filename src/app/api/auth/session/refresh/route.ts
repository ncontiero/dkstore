import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/app/api/errors";
import { prisma } from "@/lib/prisma";
import { getSession, sessionExpires, setAuthCookie } from "@/utils/auth";
import { createJWT } from "@/utils/jwt";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    const expires = session.rememberMe
      ? sessionExpires(true)
      : sessionExpires();
    await prisma.session.update({
      where: { id: session.id },
      data: { expires },
    });
    const token = await createJWT(session.id, session.rememberMe ? "7d" : "1d");
    setAuthCookie(token, expires);

    return NextResponse.json({
      status: 200,
      message: "Session renewed successfully",
      data: { session, token },
      success: true,
    });
  } catch (error) {
    const err = errorHandler(error);
    (await cookies()).delete("token");
    return NextResponse.json(
      { ...err, success: false },
      { status: err.status },
    );
  }
}
