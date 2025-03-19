import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: {
      index: "./src/**/*.{ts,tsx}",
    },
  },
  output: {
    target: "web",
    copy: {
      patterns: [
        {
          from: "./src/globals.css",
          to: "./globals.css",
        },
        {
          from: "./tailwind.config.ts",
          to: "./tailwind.config.ts",
        },
      ],
    },
  },
  lib: [
    {
      format: "esm",
      syntax: "es2022",
      dts: true,
      bundle: false,
    },
  ],
  plugins: [pluginReact()],
});
