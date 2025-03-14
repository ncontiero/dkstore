"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { setSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { actionClient, authActionClient } from "@/lib/safe-action";
import { sendEmailQueue } from "@/queue/email";
import { comparePasswords, hashPassword } from "@/utils/password";
import { signInSchema, signOutSchema, signUpSchema } from "./schema";

export const signInAction = actionClient
  .schema(signInSchema)
  .action(async ({ parsedInput: data }) => {
    const { email, password, redirectTo } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      omit: { passwordHash: false },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordIsValid = await comparePasswords(password, user.passwordHash);
    if (!passwordIsValid) {
      throw new Error("Invalid credentials");
    }

    await setSession(user.id);

    redirect(redirectTo || "/");
  });

export const sendEmailVerificationAction = authActionClient.action(
  async ({ ctx: { user } }) => {
    if (user.isEmailVerified) {
      throw new Error("Email already verified");
    }

    await sendEmailQueue.add("send-email-verification", {
      fullName: user.name,
      email: user.email,
      isEmailVerification: true,
    });

    return "Email verification link sent";
  },
);

export const signUpAction = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput: data }) => {
    const { name, email, password, redirectTo } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const passwordHash = await hashPassword(password);

    try {
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name,
            email,
            passwordHash,
          },
        });

        await setSession(user.id);
      });
    } catch {
      throw new Error(
        "An error occurred while creating your account. Please try again later",
      );
    }

    await sendEmailQueue.add("send-welcome-email", {
      fullName: name,
      email,
      isWelcomeEmail: true,
    });
    await sendEmailVerificationAction();

    redirect(redirectTo || "/");
  });

export const signOutAction = actionClient
  .schema(signOutSchema)
  .action(async ({ parsedInput: { redirectTo } }) => {
    (await cookies()).delete("session");
    redirect(`/auth/sign-in${redirectTo ? `?redirect=${redirectTo}` : ""}`);
  });
