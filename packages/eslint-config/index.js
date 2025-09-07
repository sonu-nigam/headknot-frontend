module.exports = {
    indent: ["error", 4],
    env: {
        node: true,
    },
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    plugins: ["@typescript-eslint"],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
    },
    rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "prettier/prettier": [
            "error",
            {
                tabWidth: 4,
                useTabs: false,
                endOfLine: "lf"
            }
        ],
    },
};
