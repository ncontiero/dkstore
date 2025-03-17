"use server";

import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { sendEmailQueue } from "@/queue/email";
import { comparePasswords } from "@/utils/password";
import {
  deleteUserSchema,
  updateUserEmailSchema,
  updateUserNameSchema,
} from "./schemas";

export const updateUserNameAction = authActionClient
  .schema(updateUserNameSchema)
  .action(async ({ clientInput: { name }, ctx: { user } }) => {
    await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });
  });

export const sendEmailToChangeEmailAction = authActionClient.action(
  async ({ ctx: { user } }) => {
    await sendEmailQueue.add("send-email-to-change-email", {
      fullName: user.name,
      email: user.email,
      isEmailChangeEmail: true,
    });
  },
);

export const updateUserEmailAction = authActionClient
  .schema(updateUserEmailSchema)
  .action(async ({ parsedInput: { email }, ctx: { user } }) => {
    if (email === user.email) {
      throw new Error("Emails are the same");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { email, isEmailVerified: false },
    });

    await sendEmailQueue.addBulk([
      {
        name: "send-email-verification",
        data: {
          fullName: user.name,
          email,
          isEmailVerification: true,
        },
      },
      {
        name: "send-email-changed-email",
        data: {
          fullName: user.name,
          email: user.email,
          isEmailChangedEmail: { newEmail: email },
        },
      },
    ]);

    redirect("/account/data");
  });

export const deleteUserAction = authActionClient
  .schema(deleteUserSchema)
  .action(async ({ clientInput: data, ctx: { user } }) => {
    const { confirmPassword, confirmEmail } = data;

    if (confirmEmail !== user.email) {
      throw new Error("Emails do not match");
    }

    const passwordIsValid = await comparePasswords(
      confirmPassword,
      user.passwordHash,
    );
    if (!passwordIsValid) {
      throw new Error("Passwords do not match");
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.delete({ where: { id: user.id } });
      await sendEmailQueue.add("send-delete-account-email", {
        fullName: user.name,
        email: user.email,
        isDeleteAccountEmail: true,
      });
    });

    await signOutAction({});
  });
