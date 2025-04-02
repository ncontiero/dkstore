import { ncontiero } from "@ncontiero/eslint-config";

export default ncontiero(
  { tailwindcss: true },
  {
    files: ["src/index.tsx", "src/emails/*.tsx"],
    rules: {
      "import/no-default-export": ["off"],
      "react-refresh/only-export-components": ["off"],
    },
  },
);
