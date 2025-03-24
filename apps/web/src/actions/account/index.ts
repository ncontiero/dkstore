"use server";

import { prisma } from "@dkstore/db";
import { sendEmailQueue } from "@dkstore/queue/email";
import { comparePasswords, hashPassword } from "@dkstore/utils/password";
import { redirect } from "next/navigation";
import { sessionExpires, setSession } from "@/lib/auth/session";
import { authActionClient } from "@/lib/safe-action";
import { encrypt } from "@/utils/cryptography";
import { generateRecoveryCodes } from "@/utils/recoveryCodes";
import { isTotpValid } from "@/utils/totp";
import { signOutAction } from "../auth";
import {
  addOrEdit2FASchema,
  deleteUserSchema,
  generateRecoveryCodesSchema,
  updateUserEmailSchema,
  updateUserNameSchema,
  updateUserPasswordSchema,
  verify2FASchema,
} from "./schema";

export const refreshSessionAction = authActionClient.action(
  async ({ ctx: { session } }) => {
    if (session.expires < new Date()) {
      throw new Error("Session expired");
    }

    if (session.expires.getTime() - Date.now() < 1000 * 60 * 60) {
      const newExpires = sessionExpires();
      await prisma.session.update({
        where: { id: session.id },
        data: { expires: newExpires },
      });

      await setSession(session.id);
    }
  },
);

export const sendEmailVerificationAction = authActionClient.action(
  async ({ ctx: { session } }) => {
    const { user } = session;

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
  .action(async ({ clientInput: { name }, ctx: { session } }) => {
    const { user } = session;

    await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });
  });

export const sendEmailToChangeEmailAction = authActionClient.action(
  async ({ ctx: { session } }) => {
    const { user } = session;

    await sendEmailQueue.add("send-email-to-change-email", {
      fullName: user.name,
      email: user.email,
      isEmailChangeEmail: true,
    });
  },
);

export const updateUserEmailAction = authActionClient
  .schema(updateUserEmailSchema)
  .action(async ({ parsedInput: { email }, ctx: { session } }) => {
    const { user } = session;

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
      ctx: { session },
    }) => {
      const { user } = session;

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
  .action(async ({ clientInput: data, ctx: { session } }) => {
    const { user } = session;
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

export const generateRecoveryCodesAction = authActionClient
  .schema(generateRecoveryCodesSchema)
  .action(
    async ({ clientInput: { isToSendEmail = true }, ctx: { session } }) => {
      const { user } = session;
      const recoveryCodes = generateRecoveryCodes();

      await prisma.$transaction(async (tx) => {
        await tx.recoveryCode.deleteMany({
          where: { userId: user.id },
        });

        await tx.recoveryCode.createMany({
          data: recoveryCodes.map(({ encryptedCode, encryptedCodeIV }) => ({
            userId: user.id,
            code: encryptedCode,
            codeIV: encryptedCodeIV,
          })),
        });
      });

      if (isToSendEmail) {
        await sendEmailQueue.add("send-recovery-codes-email", {
          fullName: user.name,
          email: user.email,
          isRecoveryCodesGeneratedEmail: true,
        });
      }

      return recoveryCodes.map(({ rawCode }) => rawCode);
    },
  );

export const addOrEdit2FAAction = authActionClient
  .schema(addOrEdit2FASchema)
  .action(async ({ clientInput: { code, secret }, ctx: { session } }) => {
    const { user } = session;

    const encryptedSecret = encrypt(secret);
    if (!encryptedSecret) {
      throw new Error("Error encrypting secret. Please try again later");
    }
    const { encrypted, ivAndAuthTag } = encryptedSecret;

    const isValid = isTotpValid(encrypted, ivAndAuthTag, code);

    if (!isValid) {
      throw new Error("Invalid code");
    }

    const hasUserRecoveryCodes = await prisma.recoveryCode.findFirst({
      where: { userId: user.id },
    });

    let recoveryCodes: string[] = [];

    await prisma.$transaction(async (tx) => {
      recoveryCodes = hasUserRecoveryCodes
        ? []
        : (
            await generateRecoveryCodesAction({
              isToSendEmail: false,
            })
          )?.data || [];

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

    await prisma.session.update({
      where: { id: session.id },
      data: { lastOtpVerifiedAt: new Date() },
    });
    await setSession(session.id);

    return recoveryCodes;
  });

export const verify2FAAction = authActionClient
  .schema(verify2FASchema)
  .action(async ({ clientInput: { otpCode }, ctx: { session } }) => {
    const { user } = session;

    if (!user.twoFactorSecret || !user.twoFactorSecretIV) {
      throw new Error("2FA not enabled");
    }

    const isValid = isTotpValid(
      user.twoFactorSecret,
      user.twoFactorSecretIV,
      otpCode,
    );

    if (!isValid) {
      throw new Error("Invalid OTP code");
    }

    await prisma.session.update({
      where: { id: session.id },
      data: { lastOtpVerifiedAt: new Date() },
    });
    await setSession(session.id);
  });
