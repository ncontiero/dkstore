import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { baseEnvSchema } from "./base";
import { dbEnv } from "./presets/db";
import { jwtEnv } from "./presets/jwt";
import { queueEnv } from "./queue";

export const nextjsEnvSchema = z.object({
  // Cryptography
  CIPHER_KEY: z.string().min(1),

  QUEUE_DASHBOARD_BASEURL: z.string().url(),
});
export const nextjsClientEnvSchema = z.object({
  // name for OTP secret generation
  NEXT_PUBLIC_SITE_NAME: baseEnvSchema.shape.SITE_NAME,
});

export const nextjsRuntime = {
  // Cryptography
  CIPHER_KEY: process.env.CIPHER_KEY,

  QUEUE_DASHBOARD_BASEURL: process.env.QUEUE_DASHBOARD_BASEURL,
  // name for OTP secret generation
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
};

export const nextjsEnv = () =>
  createEnv({
    server: nextjsEnvSchema.shape,
    runtimeEnv: nextjsRuntime,
    client: nextjsClientEnvSchema.shape,
    clientPrefix: "NEXT_PUBLIC_",
    extends: [queueEnv(), dbEnv(), jwtEnv()],
  });
