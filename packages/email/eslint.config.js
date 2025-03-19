import { dkshs } from "@dkshs/eslint-config";

export default dkshs(
  { tailwindcss: true },
  {
    files: ["src/index.tsx", "src/emails/*.tsx"],
    rules: {
      "import/no-default-export": ["off"],
      "react-refresh/only-export-components": ["off"],
    },
  },
);
