import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { dbEnv } from "./presets/db";
import { jwtEnv } from "./presets/jwt";
import { queueEnv } from "./queue";

export const queueDashboardEnvSchema = z.object({
  DASHBOARD_BASEURL: z.string().url().default("http://localhost:3002"),
  PORT: z.coerce.number().default(3002),
});

export const queueDashboardRuntime = {
  DASHBOARD_BASEURL: process.env.DASHBOARD_BASEURL,
  PORT: process.env.PORT,
};

export const queueDashboardEnv = () =>
  createEnv({
    server: queueDashboardEnvSchema.shape,
    runtimeEnv: queueDashboardRuntime,
    extends: [queueEnv(), dbEnv(), jwtEnv()],
  });
