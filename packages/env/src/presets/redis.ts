import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const redisEnvSchema = z.object({
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_USER: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
});

export const redisRuntime = {
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_USER: process.env.REDIS_USER,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};

export const redisEnv = () =>
  createEnv({
    server: redisEnvSchema.shape,
    runtimeEnv: redisRuntime,
  });
