import { type NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/utils/auth";
import { createPassHash, verifyPassHash } from "@/utils/password";
import { BadRequestError, errorHandler, ForbiddenError } from "../../errors";

const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6),
});

export async function PATCH(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = updatePasswordSchema.parse(
      await request.json(),
    );
    const session = await getSession(request, true);
    const { user } = session;

    if (!user.verifiedEmail) {
      throw new ForbiddenError("Please verify your email address");
    }

    const isPasswordValid = await verifyPassHash(
      currentPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestError("Current password is incorrect");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await createPassHash(newPassword) },
    });

    return NextResponse.json({
      status: 200,
      message: "Password updated successfully",
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
