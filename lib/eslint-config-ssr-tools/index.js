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
    "prettier/prettier": "error",
    semi: ["error", "always"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-warning-comments": [
      "warn",
      { terms: ["todo", "fixme", "TODO", "FIXME"], location: "anywhere" },
    ],
    "import/no-default-export": "error",
    "import/no-unresolved": "off",
  },
};
