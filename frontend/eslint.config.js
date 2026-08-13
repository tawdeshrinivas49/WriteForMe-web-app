import js from "@eslint/js";
<<<<<<< HEAD
=======
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
<<<<<<< HEAD
  { ignores: ["dist"] },
=======
  { ignores: ["dist", ".output", ".vinxi"] },
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
<<<<<<< HEAD
=======
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message:
                "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.",
            },
          ],
        },
      ],
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
<<<<<<< HEAD
=======
  eslintPluginPrettier,
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
);
