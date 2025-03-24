import { renderAccountDeletedEmail } from "@dkstore/email/deleted-account";
import { renderEmailChangedEmail } from "@dkstore/email/email-changed";
import { renderPasswordChangedEmail } from "@dkstore/email/password-changed";
import { renderRecoveryCodesGeneratedEmail } from "@dkstore/email/recovery-codes-generated";
import { renderTwoFactorAuthChangedEmail } from "@dkstore/email/two-factor-auth-changed";
import { renderWelcomeEmail } from "@dkstore/email/welcome";
import { SEND_EMAIL_QUEUE_NAME } from "@dkstore/queue/email";
import { type SendEmailSchema, sendEmailSchema } from "@dkstore/queue/schemas";
import { createWorker } from "@dkstore/queue/utils";
import { logger } from "@dkstore/utils/logger";
import { env } from "@/env";
import { sendMail } from "@/lib/nodemailer";
import { changeEmail } from "./change-email";
import { emailVerification } from "./email-verification";
import { forgotPassword } from "./forgot-password";

export const sendEmailWorker = createWorker<SendEmailSchema>(
  SEND_EMAIL_QUEUE_NAME,
  async ({ data }) => {
    const {
      fullName,
      email,
      isWelcomeEmail,
      isEmailVerification,
      isEmailChangeEmail,
      isEmailChangedEmail,
      isPasswordResetEmail,
      isPasswordChangeEmail,
      is2FAEmail,
      isRecoveryCodesGeneratedEmail,
      isDeleteAccountEmail,
    } = sendEmailSchema.parse(data);

    if (isWelcomeEmail) {
      await sendMail({
        to: email,
        subject: `Welcome to ${env.SITE_NAME}`,
        html: await renderWelcomeEmail({ fullName }),
      });

      logger.info(`Welcome email sent to ${email}`);
      return;
    }

    if (isEmailVerification) {
      await emailVerification({ fullName, email });
      return;
    }

    if (isEmailChangeEmail) {
      await changeEmail({ fullName, email });
      return;
    }

    if (isEmailChangedEmail) {
      await sendMail({
        to: email,
        subject: `Your email has been changed`,
        html: await renderEmailChangedEmail({
          fullName,
          newEmail: isEmailChangedEmail.newEmail,
        }),
      });

      logger.info(`Email changed email sent to ${email}`);
      return;
    }

    if (isPasswordChangeEmail) {
      await sendMail({
        to: email,
        subject: `Your password has been changed`,
        html: await renderPasswordChangedEmail({ fullName }),
      });

      logger.info(`Password changed email sent to ${email}`);
      return;
    }

    if (isPasswordResetEmail) {
      await forgotPassword({ fullName, email });
      return;
    }

    if (is2FAEmail) {
      await sendMail({
        to: email,
        subject: `Your two factor authentication has been ${is2FAEmail.action}`,
        html: await renderTwoFactorAuthChangedEmail({
          fullName,
          action: is2FAEmail.action,
        }),
      });

      logger.info(`Two factor authentication email sent to ${email}`);
      return;
    }

    if (isRecoveryCodesGeneratedEmail) {
      await sendMail({
        to: email,
        subject: `New 2FA Recovery Codes Generated`,
        html: await renderRecoveryCodesGeneratedEmail({ fullName }),
      });

      logger.info(`Recovery codes generated email sent to ${email}`);
      return;
    }

    if (isDeleteAccountEmail) {
      await sendMail({
        to: email,
        subject: `Your account has been deleted`,
        html: await renderAccountDeletedEmail({ fullName }),
      });

      logger.info(`Deleted account email sent to ${email}`);
      return;
    }
  },
);

sendEmailWorker.on("completed", (job) => {
  logger.info(`Completed job ${job.id} - ${job.name}`);
});
sendEmailWorker.on("failed", (job, err) => {
  logger.error(`Failed job ${job?.id} - ${job?.name} with ${err}`);
});
sendEmailWorker.on("error", (err) => {
  logger.error(`Error ${err}`);
});
