import nextConfigs from "eslint-config-next";
import globals from "globals";

const config = [
  {
    ignores: ["node_modules", "dist", "public/wasm-demo", "vendor"]
  },
  ...nextConfigs,
  {
    name: "cmaes-overrides",
    rules: {
      "react-hooks/purity": "off"
    },
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  }
];

export default config;
