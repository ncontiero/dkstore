import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { dbEnv } from "./presets/db";
import { jwtEnv } from "./presets/jwt";
import { queueEnv } from "./queue";

export const nextjsEnvSchema = z.object({});

export const nextjsRuntime = {};

export const nextjsEnv = () =>
  createEnv({
    server: nextjsEnvSchema.shape,
    runtimeEnv: nextjsRuntime,
    extends: [queueEnv(), dbEnv(), jwtEnv()],
  });
