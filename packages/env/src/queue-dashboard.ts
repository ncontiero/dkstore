import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { jwtEnv } from "./presets/jwt";
import { queueEnv } from "./queue";

export const queueDashboardEnvSchema = z.object({
  PORT: z.coerce.number().default(3002),
});

export const queueDashboardRuntime = {
  PORT: process.env.PORT,
};

export const queueDashboardEnv = () =>
  createEnv({
    server: queueDashboardEnvSchema.shape,
    runtimeEnv: queueDashboardRuntime,
    extends: [queueEnv(), jwtEnv()],
  });
