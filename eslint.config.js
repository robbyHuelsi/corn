import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";

export default [
    js.configs.recommended,
    prettierConfig,
    {
        files: ["src/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",
            globals: {
                ...globals.browser,
                jsyaml: "readonly",
                bootstrap: "readonly",
            },
        },
        rules: {
            "no-unused-vars": ["error", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
        },
    },
    {
        ignores: ["node_modules/"],
    },
];
