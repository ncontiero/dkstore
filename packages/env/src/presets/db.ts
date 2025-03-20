import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const dbEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
});

export const dbRuntime = {
  DATABASE_URL: process.env.DATABASE_URL,
};

export const dbEnv = () =>
  createEnv({
    server: dbEnvSchema.shape,
    runtimeEnv: dbRuntime,
  });
