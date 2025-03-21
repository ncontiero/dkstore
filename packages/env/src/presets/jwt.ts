import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const jwtEnvSchema = z.object({
  JWT_SECRET: z.string(),
});

export const jwtRuntime = {
  JWT_SECRET: process.env.JWT_SECRET,
};

export const jwtEnv = () =>
  createEnv({
    server: jwtEnvSchema.shape,
    runtimeEnv: jwtRuntime,
  });
