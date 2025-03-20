import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: {
      index: ["./src/**", "!src/generated/**"],
    },
  },
  output: {
    copy: {
      patterns: [
        {
          from: "./src/generated",
          to: "./generated",
        },
      ],
    },
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
