"use server";

import { prisma } from "@dkstore/db";
import { sendEmailQueue } from "@dkstore/queue/email";
import { comparePasswords, hashPassword } from "@dkstore/utils/password";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession, sessionExpires, setSession } from "@/lib/auth/session";
import { actionClient } from "@/lib/safe-action";
import { decrypt } from "@/utils/cryptography";
import { isTotpValid } from "@/utils/totp";
import { sendEmailVerificationAction } from "../account";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signOutSchema,
  signUpSchema,
} from "./schema";

export const signInAction = actionClient
  .schema(signInSchema)
  .action(async ({ parsedInput: data }) => {
    const { email, password, otpCode, recoveryCode, redirectTo } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      omit: { passwordHash: false },
      include: {
        recoveryCodes: true,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordIsValid = await comparePasswords(password, user.passwordHash);
    if (!passwordIsValid) {
      throw new Error("Invalid credentials");
    }

    if (user.is2FAEnabled && user.twoFactorSecret && user.twoFactorSecretIV) {
      if (recoveryCode) {
        if (user.recoveryCodes.length === 0) {
          throw new Error("You don't have any recovery codes.");
        }

        const dbRecoveryCode = user.recoveryCodes.find((code) => {
          const decryptedCode = decrypt(
            Buffer.from(code.code),
            Buffer.from(code.codeIV),
          );
          if (!decryptedCode) {
            throw new Error(
              "Error decrypting recovery code. Please try again later",
            );
          }

          const isValid = decryptedCode === recoveryCode;
          return isValid ? code : null;
        });

        if (!dbRecoveryCode) {
          throw new Error("Invalid recovery code");
        }

        await prisma.$transaction(async (tx) => {
          await tx.recoveryCode.delete({
            where: { id: dbRecoveryCode.id },
          });

          await tx.user.update({
            where: { id: user.id },
            data: {
              is2FAEnabled: false,
              twoFactorSecret: null,
              twoFactorSecretIV: null,
            },
          });

          const session = await prisma.session.create({
            data: {
              userId: user.id,
              expires: sessionExpires(),
            },
          });
          await setSession(session.id);
        });

        redirect(redirectTo || "/");
      }

      if (!otpCode) {
        return {
          twoFactor: true,
        };
      }

      const isValid = isTotpValid(
        user.twoFactorSecret,
        user.twoFactorSecretIV,
        otpCode,
      );

      if (!isValid) {
        throw new Error("Invalid OTP code");
      }
    }

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expires: sessionExpires(),
      },
    });
    await setSession(session.id);

    redirect(redirectTo || "/");
  });

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
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });

      await prisma.$transaction(async (tx) => {
        const session = await tx.session.create({
          data: {
            userId: user.id,
            expires: sessionExpires(),
          },
        });

        await setSession(session.id);
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
    const cookiesStore = await cookies();
    const session = await getSession();

    cookiesStore.delete("session");
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }

    redirect(`/auth/sign-in${redirectTo ? `?redirect=${redirectTo}` : ""}`);
  });

export const forgotPasswordAction = actionClient
  .schema(forgotPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }
    if (!user.isEmailVerified) {
      throw new Error("Please verify your email address first.");
    }

    await sendEmailQueue.add("send-password-reset-email", {
      fullName: user.name,
      email,
      isPasswordResetEmail: true,
    });
  });

export const resetPasswordAction = actionClient
  .schema(resetPasswordSchema)
  .action(async ({ parsedInput: { userId, password } }) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          passwordHash,
        },
      });
      await tx.token.deleteMany({
        where: { userId, type: "RESET_PASSWORD" },
      });

      await sendEmailQueue.add("send-password-change-email", {
        fullName: user.name,
        email: user.email,
        isPasswordChangeEmail: true,
      });
    });
  });
