import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { verifyPassHash } from "@/utils/password";
import { createJWT } from "@/utils/jwt";
import { BadRequestError, ForbiddenError, errorHandler } from "../../errors";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const cookieToken = cookies().get("token")?.value;
    if (cookieToken) {
      throw new ForbiddenError("You are already logged in");
    }

    const body = await req.json();
    const data = signInSchema.parse(body);
    const { email, password } = data;

    const userFromEmail = await prisma.user.findUnique({
      where: { email },
      omit: { passwordHash: false },
    });

    if (!userFromEmail) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordIsValid = await verifyPassHash(
      password,
      userFromEmail.passwordHash,
    );
    if (!passwordIsValid) {
      throw new BadRequestError("Invalid credentials");
    }

    const session = await prisma.session.create({
      data: { userId: userFromEmail.id },
    });
    const token = await createJWT(session.id);
    cookies().set("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return NextResponse.json({
      status: 200,
      message: "Logged in successfully",
      data: { token },
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
