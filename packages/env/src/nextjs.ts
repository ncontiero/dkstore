import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { dbEnv } from "./presets/db";
import { jwtEnv } from "./presets/jwt";
import { queueEnv } from "./queue";

export const nextjsEnvSchema = z.object({
  QUEUE_DASHBOARD_BASEURL: z.string().url(),
});

export const nextjsRuntime = {
  QUEUE_DASHBOARD_BASEURL: process.env.QUEUE_DASHBOARD_BASEURL,
};

export const nextjsEnv = () =>
  createEnv({
    server: nextjsEnvSchema.shape,
    runtimeEnv: nextjsRuntime,
    extends: [queueEnv(), dbEnv(), jwtEnv()],
  });
