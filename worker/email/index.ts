import { renderWelcomeEmail } from "@/emails/templates";
import { env } from "@/env";
import { sendMail } from "@/lib/nodemailer";
import { SEND_EMAIL_QUEUE_NAME } from "@/queue/email";
import { type SendEmailSchema, sendEmailSchema } from "@/queue/schemas";
import { createWorker } from "@/queue/utils";
import { logger } from "@/utils/logger";
import { emailVerification } from "./email-verification";

export const sendEmailWorker = createWorker<SendEmailSchema>(
  SEND_EMAIL_QUEUE_NAME,
  async ({ data }) => {
    const { fullName, email, isWelcomeEmail, isEmailVerification } =
      sendEmailSchema.parse(data);

    if (isWelcomeEmail) {
      await sendMail({
        to: email,
        subject: `Welcome to ${env.SITE_NAME}`,
        html: await renderWelcomeEmail({ fullName }),
      });

      logger.info(`Welcome email sent to ${email}`);
    }

    if (isEmailVerification) {
      await emailVerification({ fullName, email });
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
