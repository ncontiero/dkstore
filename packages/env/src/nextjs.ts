import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { dbEnv } from "./presets/db";
import { queueEnv } from "./queue";

export const nextjsEnvSchema = z.object({
  JWT_SECRET: z.string(),
});

export const nextjsRuntime = {
  JWT_SECRET: process.env.JWT_SECRET,
};

export const nextjsEnv = () =>
  createEnv({
    server: nextjsEnvSchema.shape,
    runtimeEnv: nextjsRuntime,
    extends: [queueEnv(), dbEnv()],
  });
