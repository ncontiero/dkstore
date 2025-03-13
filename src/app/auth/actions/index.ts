"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { renderWelcomeEmail } from "@/emails/templates";
import { env } from "@/env";
import { setSession } from "@/lib/auth/session";
import { sendMail } from "@/lib/nodemailer";
import { prisma } from "@/lib/prisma";
import { actionClient, authActionClient } from "@/lib/safe-action";
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
  // eslint-disable-next-line require-await
  async ({ ctx: { user } }) => {
    if (user.isEmailVerified) {
      throw new Error("Email already verified");
    }

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

    await sendEmailVerificationAction();
    await sendMail({
      to: email,
      subject: `Welcome to ${env.SITE_NAME}`,
      html: await renderWelcomeEmail({ fullName: name }),
    });

    redirect(redirectTo || "/");
  });

export const signOutAction = actionClient
  .schema(signOutSchema)
  .action(async ({ parsedInput: { redirectTo } }) => {
    (await cookies()).delete("session");
    redirect(`/auth/sign-in${redirectTo ? `?redirect=${redirectTo}` : ""}`);
  });
