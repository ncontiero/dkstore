import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { BadRequestError, errorHandler } from "../../errors";

export function GET() {
  try {
    const cookieToken = cookies().get("token")?.value;
    if (!cookieToken) {
      throw new BadRequestError("You are not logged in");
    }

    cookies().delete("token");
    return NextResponse.json({ message: "Successfully logged out" });
  } catch (error) {
    const err = errorHandler(error);
    return NextResponse.json(
      { ...err, success: false },
      { status: err.status },
    );
  }
}
