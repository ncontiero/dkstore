import { baseEnv } from "@dkstore/env/base";
import { dbEnv } from "@dkstore/env/presets/db";
import { createEnv } from "@dkstore/env/t3";

export const env = createEnv({
  server: {},
  runtimeEnv: {},
  extends: [baseEnv(), dbEnv()],
});
