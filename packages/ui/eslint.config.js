import { ncontiero } from "@ncontiero/eslint-config";

export default ncontiero(
  {},
  {
    files: ["src/components/**/*.tsx"],
    rules: {
      "react-refresh/only-export-components": ["off"],
    },
  },
);
