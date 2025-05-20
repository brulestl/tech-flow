/** @type {import("eslint").Linter.Config} */
const config = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig.json",
        "ecmaVersion": 2022,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    // "ignorePatterns": ["*.css", "*.scss"],
    "plugins": [
        "@typescript-eslint",
        "react",
        "react-hooks",
        "import"
    ],
    "globals": {
        "React": "readonly",
        "Proxy": "readonly"
    },
    "settings": {
        "react": {
            "version": "detect",
        },
        "import/resolver": {
            "typescript": {
                "alwaysTryTypes": true,
                "project": "./tsconfig.json",
                "moduleDirectory": ["node_modules", "src"]
            },
            "node": {
                "extensions": [".js", ".jsx", ".ts", ".tsx"]
            }
        }
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:react-hooks/recommended"
    ],
    "rules": {
        "react/react-in-jsx-scope": "off",
        "no-duplicate-imports": "off",
        "import/no-duplicates": "off",
        "no-undef": "error",
        "no-unused-vars": "off",
        "import/no-unresolved": [
            "error",
            { "ignore": ["^geist/"] }
        ],
        "react/prop-types": "off",
        "@next/next/no-img-element": "off",
        "import/named": "error",
        "react/no-unescaped-entities": "off",
        "@typescript-eslint/no-unused-vars": ["warn", {
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_"
        }],
        "prefer-const": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "import/no-named-as-default-member": "error",
        "react/no-unknown-property": "off",
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/no-empty-object-type": "off",
        "import/default": "error",
        "import/namespace": "error",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    },
    "env": {
        "browser": true,
        "node": true,
        "es2022": true
    }
}
module.exports = config;
