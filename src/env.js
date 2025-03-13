import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    // Database (Prisma)
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string(),

    // SMTP
    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number(),
    SMTP_SECURE: z
      .string()
      .transform((v) => v === "true")
      .default("false"),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),
    DEFAULT_FROM_EMAIL: z.string().optional(),

    // these variables are used for the site's SEO
    SITE_NAME: z.string().default("DkStore"),
    SITE_LOCALE: z.string().default("en_US"),
    SITE_BASEURL: z.string().url().default("http://localhost:3000"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {},

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    // Database (Prisma)
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,

    // SMTP
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    DEFAULT_FROM_EMAIL: process.env.DEFAULT_FROM_EMAIL,

    // SEO
    SITE_NAME: process.env.SITE_NAME,
    SITE_LOCALE: process.env.SITE_LOCALE,
    SITE_BASEURL: process.env.SITE_BASEURL,

    // Client
    // ----------------------------
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
