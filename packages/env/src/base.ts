import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const baseEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  SITE_NAME: z.string().default("DkStore"),
  SITE_LOCALE: z.string().default("en_US"),
  SITE_BASEURL: z.string().url().default("http://localhost:3000"),
});

export const baseEnvRuntime = {
  NODE_ENV: process.env.NODE_ENV,

  SITE_NAME: process.env.SITE_NAME,
  SITE_LOCALE: process.env.SITE_LOCALE,
  SITE_BASEURL: process.env.SITE_BASEURL,
};

export const baseEnv = () =>
  createEnv({
    server: baseEnvSchema.shape,
    runtimeEnv: baseEnvRuntime,
    skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
    /**
     * Makes it so that empty strings are treated as undefined.
     * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
  });
