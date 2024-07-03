import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { BadRequestError, errorHandler } from "../../errors";

export function GET(request: NextRequest) {
  try {
    const cookieToken = cookies().get("token")?.value;
    if (!cookieToken) {
      throw new BadRequestError("You are not logged in");
    }

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
