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

    // ⬇️ Add plugin's recommended config: runs Prettier as a rule AND turns off conflicting rules
    prettier.configs.recommended,

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
            // Let Prettier config be the single source → don't pass options here
            "prettier/prettier": "error",

            // Avoid stylistic conflicts—Prettier controls indentation/format.
            // Remove this unless you have a very specific reason:
            // "indent": ["error", 4],

            // Keeping max-len is fine if you want extra enforcement beyond Prettier:
            "max-len": [
                "error",
                {
                    code: 80,
                    tabWidth: 4,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true
                }
            ],
        },
    },
];
