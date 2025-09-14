// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import airbnbBase from "eslint-config-airbnb-base";

export default [
  {
    ignores: ["node_modules", "dist", "coverage"], // paths to ignore
  },
  js.configs.recommended,
  // airbnbBase,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.mocha
      },
    },
  },
];
