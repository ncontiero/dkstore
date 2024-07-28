import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createPassHash } from "@/utils/password";
import { createJWT } from "@/utils/jwt";
import { sessionExpires, setAuthCookie } from "@/utils/auth";
import { BadRequestError, errorHandler, ForbiddenError } from "../../errors";

const signUpSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  rememberMe: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get("token")?.value;
    if (cookieToken) {
      throw new ForbiddenError("You are already logged in");
    }

    const body = await req.json();
    const data = signUpSchema.parse(body);
    const { name, email, password, rememberMe } = data;

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new BadRequestError("Email already exists");
    }

    const passwordHash = await createPassHash(password);

    const { token } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });
      const expires = sessionExpires(rememberMe);
      const session = await tx.session.create({
        data: { userId: user.id, expires, rememberMe },
      });

      const token = await createJWT(session.id, rememberMe ? "7d" : "1d");
      setAuthCookie(token, expires);

      return { token };
    });

    return NextResponse.json(
      {
        status: 201,
        message: "Account created successfully.",
        data: { token },
        success: true,
      },
      { status: 201 },
    );
  } catch (error) {
    const err = errorHandler(error);
    return NextResponse.json(
      { ...err, success: false },
      { status: err.status },
    );
  }
}
