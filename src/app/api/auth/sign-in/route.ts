import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { verifyPassHash } from "@/utils/password";
import { createJWT } from "@/utils/jwt";
import { sessionExpires, setAuthCookie } from "@/utils/auth";
import { BadRequestError, ForbiddenError, errorHandler } from "../../errors";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  remember_me: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const cookieToken = cookies().get("token")?.value;
    if (cookieToken) {
      throw new ForbiddenError("You are already logged in");
    }

    const body = await req.json();
    const data = signInSchema.parse(body);
    const { email, password, remember_me } = data;

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

    const expires = sessionExpires(remember_me);
    const session = await prisma.session.create({
      data: { userId: userFromEmail.id, expires, rememberMe: remember_me },
    });
    const token = await createJWT(session.id, remember_me ? "7d" : "1d");
    setAuthCookie(token, expires);

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
