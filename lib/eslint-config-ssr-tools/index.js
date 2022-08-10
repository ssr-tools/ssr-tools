module.exports = {
  extends: [
    "react-app",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
  ],
  plugins: ["jsx-a11y", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
      },
    ],
    "@typescript-eslint/no-var-requires": "off",
    "no-unused-vars": "off",
    "import/no-cycle": "error",
    "import/no-default-export": "error",
    "import/no-self-import": "error",
    "import/no-unresolved": "off",
    "no-console": "error",
    "no-warning-comments": [
      "warn",
      { terms: ["todo", "fixme", "TODO", "FIXME"], location: "anywhere" },
    ],
    "max-len": [
      "error",
      {
        code: 80,
        tabWidth: 2,
        ignoreComments: false,
        ignoreTrailingComments: false,
        ignoreUrls: true,
        ignoreStrings: false,
        ignorePattern: "^import",
      },
    ],
    "prettier/prettier": "error",
    "react/display-name": "error",
    semi: ["error", "always"],
    "no-useless-concat": "off",
  },
  overrides: [
    {
      files: "*.js",
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
