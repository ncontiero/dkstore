import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const smtpEnvSchema = z.object({
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_SECURE: z
    .string()
    .transform((v) => v === "true")
    .default("false"),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  DEFAULT_FROM_EMAIL: z.string().optional(),
});

export const smtpRuntime = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  DEFAULT_FROM_EMAIL: process.env.DEFAULT_FROM_EMAIL,
};

export const smtpEnv = () =>
  createEnv({
    server: smtpEnvSchema.shape,
    runtimeEnv: smtpRuntime,
  });
