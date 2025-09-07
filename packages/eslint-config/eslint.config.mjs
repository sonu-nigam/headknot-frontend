// Shared ESLint flat config (ESLint >= 9)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
    // ignore common build/cache dirs
    { ignores: ["**/dist/**", "**/build/**", "**/.turbo/**", "**/node_modules/**"] },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2020,
            sourceType: "module",
            globals: { ...globals.node }, // replaces env: { node: true }
        },
        plugins: { prettier },
        rules: {
            // your rules
            indent: ["error", 4],
            "@typescript-eslint/no-non-null-assertion": "off",
            "prettier/prettier": ["error", { tabWidth: 4, useTabs: false, endOfLine: "lf" }],
        },
    },
];
