"use server";

import { signOutAction } from "@/app/auth/actions";
import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { sendEmailQueue } from "@/queue/email";
import { comparePasswords, hashPassword } from "@/utils/password";
import { updateUserPasswordSchema, updateUserSchema } from "./schema";

export const updateUserAction = authActionClient
  .schema(updateUserSchema)
  .action(async ({ parsedInput: { name, email }, ctx: { user } }) => {
    const isSameEmail = user.email === email;
    if (isSameEmail && name === user.name) {
      throw new Error("Nothing to update.");
    }

    if (!isSameEmail) {
      if (!user.isEmailVerified) {
        throw new Error("Please verify your email address first.");
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("Email already exists.");
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: name || user.name,
          email,
          isEmailVerified: isSameEmail ? user.isEmailVerified : false,
        },
      });

      if (!isSameEmail) {
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
      }
    });

    return `User updated successfully.${isSameEmail ? "" : " Verify your new email address."}`;
  });

export const updateUserPasswordAction = authActionClient
  .schema(updateUserPasswordSchema)
  .action(
    async ({
      parsedInput: { currentPassword, newPassword },
      ctx: { user },
    }) => {
      if (!user.isEmailVerified) {
        throw new Error("Please verify your email address first.");
      }

      const isPasswordValid = await comparePasswords(
        currentPassword,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new Error("Invalid password.");
      }

      const isSamePassword = await comparePasswords(
        newPassword,
        user.passwordHash,
      );
      if (isSamePassword) {
        throw new Error(
          "New password cannot be the same as the current password.",
        );
      }

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            passwordHash: await hashPassword(newPassword),
          },
        });

        await sendEmailQueue.add("send-password-change-email", {
          fullName: user.name,
          email: user.email,
          isPasswordChangeEmail: true,
        });
      });

      return "Password updated successfully.";
    },
  );

export const deleteUserAction = authActionClient.action(
  async ({ ctx: { user } }) => {
    await prisma.$transaction(async (tx) => {
      await tx.user.delete({
        where: {
          id: user.id,
        },
      });
      await sendEmailQueue.add("send-delete-account-email", {
        fullName: user.name,
        email: user.email,
        isDeleteAccountEmail: true,
      });
    });

    await signOutAction({ redirectTo: "/auth/sign-in" });
  },
);
