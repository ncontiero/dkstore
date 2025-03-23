"use server";

import { prisma } from "@dkstore/db";
import { sendEmailQueue } from "@dkstore/queue/email";
import { comparePasswords, hashPassword } from "@dkstore/utils/password";
import { redirect } from "next/navigation";
import { authActionClient } from "@/lib/safe-action";
import { decrypt, encrypt } from "@/utils/cryptography";
import { isTotpValid } from "@/utils/totp";
import { signOutAction } from "../auth";
import {
  addOrEdit2FASchema,
  deleteUserSchema,
  updateUserEmailSchema,
  updateUserNameSchema,
  updateUserPasswordSchema,
  verify2FASchema,
} from "./schema";

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

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { email, isEmailVerified: false },
      });
      await tx.token.deleteMany({
        where: { userId: user.id, type: "EMAIL_VERIFICATION" },
      });

      await sendEmailQueue.add("send-email-changed-email", {
        fullName: user.name,
        email: user.email,
        isEmailChangedEmail: { newEmail: email },
      });
    });

    await sendEmailVerificationAction();

    redirect("/account/data");
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
        throw new Error("Current password is incorrect");
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
    },
  );

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

export const addOrEdit2FAAction = authActionClient
  .schema(addOrEdit2FASchema)
  .action(async ({ clientInput: { code, secret }, ctx: { user } }) => {
    const isValid = isTotpValid(secret, code);

    if (!isValid) {
      throw new Error("Invalid code");
    }

    const encryptedSecret = encrypt(secret);
    if (!encryptedSecret) {
      throw new Error("Error encrypting secret. Please try again later");
    }
    const { encrypted, ivAndAuthTag } = encryptedSecret;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          is2FAEnabled: true,
          twoFactorSecret: encrypted,
          twoFactorSecretIV: ivAndAuthTag,
        },
      });

      await sendEmailQueue.add("send-2fa-email", {
        fullName: user.name,
        email: user.email,
        is2FAEmail: { action: user.is2FAEnabled ? "edited" : "added" },
      });
    });
  });

export const verify2FAAction = authActionClient
  .schema(verify2FASchema)

  // eslint-disable-next-line require-await
  .action(async ({ clientInput: { otpCode }, ctx: { user } }) => {
    if (!user.twoFactorSecret || !user.twoFactorSecretIV) {
      throw new Error("2FA not enabled");
    }

    const decryptedSecret = decrypt(
      Buffer.from(user.twoFactorSecret),
      Buffer.from(user.twoFactorSecretIV),
    );
    if (!decryptedSecret) {
      throw new Error("Error decrypting secret. Please try again later");
    }

    const isValid = isTotpValid(decryptedSecret, otpCode);

    if (!isValid) {
      throw new Error("Invalid OTP code");
    }
  });
