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
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": [
      "error",
      {
        args: "all",
      },
    ],
    "import/no-cycle": "error",
    "import/no-default-export": "error",
    "import/no-unresolved": "off",
    "import/no-self-import": "error",
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
        ignoreUrls: false,
        ignoreStrings: false,
      },
    ],
    "prettier/prettier": "error",
    semi: ["error", "always"],
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
