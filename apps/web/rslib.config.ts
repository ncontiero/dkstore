import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: {
      index: "./worker/index.ts",
    },
  },
  lib: [{ format: "esm", syntax: "es2022" }],
  plugins: [pluginReact()],
});
