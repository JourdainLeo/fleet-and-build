import eslint from "@eslint/js";
import eslint_ts from "typescript-eslint";

export default [
    eslint.configs.recommended,
    ...eslint_ts.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "no-empty-pattern": "off",
            "no-undef": "off",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-this-alias": "off",
        },
    },
];