import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createPassHash } from "@/utils/password";
import { createJWT } from "@/utils/jwt";
import { BadRequestError, errorHandler } from "../../errors";

const registerAccountSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get("token")?.value;
    if (cookieToken) {
      throw new BadRequestError("You are already logged in");
    }

    const body = await req.json();
    const data = registerAccountSchema.parse(body);
    const { name, email, password } = data;

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new BadRequestError("Email already exists");
    }

    const passwordHash = await createPassHash(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    const token = await createJWT(user.id);
    cookies().set("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
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
