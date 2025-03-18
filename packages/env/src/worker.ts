import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { dbEnv } from "./db";
import { redisEnv, smtpEnv } from "./presets";

export const workerEnvSchema = z.object({});

export const workerRuntime = {};

export const workerEnv = () =>
  createEnv({
    server: workerEnvSchema.shape,
    runtimeEnv: workerRuntime,
    extends: [dbEnv(), smtpEnv(), redisEnv()],
  });
