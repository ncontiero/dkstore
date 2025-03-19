import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { baseEnv } from "./base";
import { redisEnv } from "./presets";

export const queueEnvSchema = z.object({});

export const queueRuntime = {};

export const queueEnv = () =>
  createEnv({
    server: queueEnvSchema.shape,
    runtimeEnv: queueRuntime,
    extends: [baseEnv(), redisEnv()],
  });
