import { type NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/utils/auth";
import { errorHandler, ForbiddenError } from "../errors";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    return NextResponse.json({
      status: 200,
      message: "Profile fetched successfully",
      data: { ...session.user },
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

const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
});

export async function PATCH(request: NextRequest) {
  try {
    const { email: newEmail, name } = updateProfileSchema.parse(
      await request.json(),
    );
    const session = await getSession(request);
    const { user } = session;

    if (!user.verifiedEmail) {
      throw new ForbiddenError("Please verify your email address");
    }

    const userFromEmail = await prisma.user.findUnique({
      where: { email: newEmail, NOT: { id: user.id } },
    });
    if (userFromEmail) {
      throw new ForbiddenError("An account with this email already exists");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: newEmail,
        name,
        verifiedEmail: newEmail !== user.email ? false : user.verifiedEmail,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Profile updated successfully",
      data: { ...user },
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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);

    await prisma.$transaction([
      prisma.session.delete({ where: { id: session.id } }),
      prisma.user.delete({ where: { id: session.userId } }),
    ]);

    return NextResponse.json({
      status: 200,
      message: "Account deleted successfully",
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
