import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { dbEnv } from "./presets/db";
import { smtpEnv } from "./presets/smtp";
import { queueEnv } from "./queue";

export const workerEnvSchema = z.object({});

export const workerRuntime = {};

export const workerEnv = () =>
  createEnv({
    server: workerEnvSchema.shape,
    runtimeEnv: workerRuntime,
    extends: [queueEnv(), dbEnv(), smtpEnv()],
  });
