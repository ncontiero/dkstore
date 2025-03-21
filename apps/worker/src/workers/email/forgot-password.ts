import { prisma } from "@dkstore/db";
import { renderResetPasswordEmail } from "@dkstore/email/reset-password";
import { logger } from "@dkstore/utils/logger";
import { sendMail } from "@/lib/nodemailer";

interface ForgotPassword {
  fullName: string;
  email: string;
}

export async function forgotPassword({ fullName, email }: ForgotPassword) {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { email },
      include: { tokens: true },
    });

    if (!user) {
      const msg = `User not found with email ${email}!`;
      logger.error(msg);
      throw new Error(msg);
    }
    if (!user.isEmailVerified) {
      const msg = "Email is not verified";
      logger.error(msg);
      throw new Error(msg);
    }

    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    const existingToken = user.tokens.find(
      (token) => token.type === "RESET_PASSWORD",
    );
    const token = await tx.token.upsert({
      where: {
        id: existingToken?.id || "",
      },
      create: {
        user: { connect: { email } },
        type: "RESET_PASSWORD",
        expires: oneHourFromNow,
      },
      update: {
        expires: oneHourFromNow,
      },
    });

    await sendMail({
      html: await renderResetPasswordEmail({
        fullName,
        resetPasswordPath: `auth/password/${token.id}/reset`,
      }),
      subject: `Reset your password`,
      to: user.email,
    });

    logger.info(`Password reset email sent to ${user.email}!`);
  });
}
