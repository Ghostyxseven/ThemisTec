// eslint.config.mjs
// ESLint v9 flat config — migrado de .eslintrc.json
// Mantém todas as regras do Harness Engineering (AI Harness)

import { dirname } from "path";
import { fileURLToPath } from "url";
import nextConfig from "eslint-config-next/core-web-vitals";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import("eslint").Linter.Config[]} */
const config = [
  // Ignorar pastas geradas e configs
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "eslint.config.mjs",
      "vitest.config.ts",
      "next.config.*",
    ],
  },

  // Configs base do Next.js (já inclui @typescript-eslint, react, react-hooks, jsx-a11y)
  ...nextConfig,

  // Configurar type-aware parsing para regras que precisam do projeto TypeScript
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      /* ═══ HARNESS: Regras de Qualidade ═══ */

      // Prevenir uso de 'any' — força tipagem rígida
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",

      // Forçar retorno de tipos em funções
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],

      // Forçar tratamento de erros em promises
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",

      // Código limpo
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Next.js — React não precisa ser importado manualmente
      "react/react-in-jsx-scope": "off",
    },
  },
];

export default config;
