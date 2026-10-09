import nextConfigs from "eslint-config-next";
import globals from "globals";

const config = [
  {
    ignores: [
      "node_modules",
      "dist",
      "public/wasm-demo",
      "public/wasm",
      "vendor",
      ".vercel",
      ".next",
      "ios/Engine",
      // Retained rollback bundles contain exported copies, not editable source.
      "ios/Engine.previous-*",
      "ios/EngineWeb/.next",
      "ios/EngineWeb/out",
      "ios/build",
    ],
  },
  ...nextConfigs,
  {
    name: "cmaes-overrides",
    rules: {
      "react-hooks/purity": "off",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];

export default config;
