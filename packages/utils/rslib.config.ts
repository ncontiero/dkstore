import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: {
      index: "./src/**",
    },
  },
  output: {
    minify: process.env.NODE_ENV === "production",
  },
  lib: [
    {
      format: "esm",
      syntax: "es2022",
      dts: true,
      bundle: false,
    },
  ],
});
