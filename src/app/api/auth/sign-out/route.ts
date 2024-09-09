import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/utils/jwt";
import { errorHandler, ForbiddenError } from "../../errors";

export async function GET(request: NextRequest) {
  try {
    const cookieToken = cookies().get("token")?.value;
    if (!cookieToken) {
      throw new ForbiddenError("You are not logged in");
    }

    try {
      const { sub: sessionId } = await verifyJWT(cookieToken);
      await prisma.session.delete({ where: { id: sessionId } });
    } catch {}
    cookies().delete("token");

    const redirectUrl = request.nextUrl.clone();
    const isToRedirect = redirectUrl.searchParams.get("redirect") === "true";
    redirectUrl.pathname = "/auth/sign-in";
    if (isToRedirect) {
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.json({ message: "Successfully logged out" });
  } catch (error) {
    const err = errorHandler(error);
    return NextResponse.json(
      { ...err, success: false },
      { status: err.status },
    );
  }
}
