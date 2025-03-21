import { jwtEnv } from "@dkstore/env/presets/jwt";
import { createEnv } from "@dkstore/env/t3";

export const env = createEnv({
  server: {},
  runtimeEnv: {},
  extends: [jwtEnv()],
});
