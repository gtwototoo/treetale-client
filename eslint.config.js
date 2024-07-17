import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import parser from "svelte-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/*.cjs",
        "**/.DS_Store",
        "**/node_modules",
        "**/build",
        "**/.svelte-kit",
        "**/pnpm-lock.yaml",
    ],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:svelte/recommended",
    "plugin:perfectionist/recommended-natural",
    "prettier",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",

        parserOptions: {
            extraFileExtensions: [".svelte"],
        },
    },

    rules: {
        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "_",
        }],

        "svelte/no-at-html-tags": "off",
        "@typescript-eslint/adjacent-overload-signatures": "off",
        "no-undef": "off",
        "perfectionist/sort-svelte-attributes": "off",

        "perfectionist/sort-imports": ["error", {
            type: "natural",
            order: "asc",

            groups: [
                "type",
                "svelte",
                ["builtin", "external"],
                "aliases",
                "internal-type",
                "internal",
                ["parent-type", "sibling-type", "index-type"],
                ["parent", "sibling", "index"],
                "side-effect",
                "style",
                "object",
                "unknown",
            ],

            "custom-groups": {
                value: {
                    svelte: ["@sveltejs/kit", "svelte/*", "svelte"],
                },

                type: {
                    svelte: ["@sveltejs/kit", "svelte/*", "svelte"],
                },
            },

            "newlines-between": "always",
            "internal-pattern": ["$lib/**", "$page/**", "$UI"],
        }],
    },
}, {
    files: ["**/*.svelte"],

    languageOptions: {
        parser: parser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            parser: "@typescript-eslint/parser",
        },
    },
}];