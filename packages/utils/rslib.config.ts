import { defineConfig } from "@rslib/core";

export default defineConfig({
  output: {
    minify: process.env.NODE_ENV === "production",
  },
  lib: [
    {
      format: "esm",
      syntax: "es2022",
      dts: true,
    },
  ],
});
