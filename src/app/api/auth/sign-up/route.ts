import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createPassHash } from "@/utils/password";
import { createJWT } from "@/utils/jwt";
import { sessionExpires } from "@/utils/auth";
import { BadRequestError, ForbiddenError, errorHandler } from "../../errors";

const signUpSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  remember_me: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get("token")?.value;
    if (cookieToken) {
      throw new ForbiddenError("You are already logged in");
    }

    const body = await req.json();
    const data = signUpSchema.parse(body);
    const { name, email, password, remember_me } = data;

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
      const expires = sessionExpires(remember_me);
      const session = await tx.session.create({
        data: { userId: user.id, expires },
      });

      const token = await createJWT(session.id);
      cookies().set("token", token, {
        path: "/",
        expires,
      });

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
