import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: ["./tsconfig.base.json", "./packages/*/tsconfig.json"],
      },
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Disable base rule and use TypeScript version
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",

      // General code quality
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",

      // Formatting (basic)
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
    },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "**/*.js", // Ignore JS files like migrate.js for now
    ],
  },
];
