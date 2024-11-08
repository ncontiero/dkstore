import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sessionExpires, setAuthCookie } from "@/utils/auth";
import { createJWT } from "@/utils/jwt";
import { verifyPassHash } from "@/utils/password";
import { BadRequestError, errorHandler, ForbiddenError } from "../../errors";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const cookieToken = (await cookies()).get("token")?.value;
    if (cookieToken) {
      throw new ForbiddenError("You are already logged in");
    }

    const body = await req.json();
    const data = signInSchema.parse(body);
    const { email, password, rememberMe } = data;

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

    const expires = sessionExpires(rememberMe);
    const session = await prisma.session.create({
      data: { userId: userFromEmail.id, expires, rememberMe },
    });
    const token = await createJWT(session.id, rememberMe ? "7d" : "1d");
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
