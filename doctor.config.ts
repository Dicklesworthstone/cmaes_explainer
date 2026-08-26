const doctorConfig = {
  ignore: {
    paths: ["public/**", "tmp/**"]
  },
  rules: {
    "react-doctor/react-compiler-no-manual-memoization": "off",
    "react-doctor/no-giant-component": "off",
    "react-doctor/dangerous-html-sink": "off",
    "deslop/unused-export": "off",
    "deslop/unused-file": "off",
    "deslop/unused-dependency": "off",
    "deslop/unused-dev-dependency": "off",
    "react-doctor/prefer-use-effect-event": "off",
    "react-doctor/r3f-prefer-gpu-instanced-animation": "off",
    "react-hooks-js/todo": "off",
    "react-doctor/prefer-useReducer": "off",
    "react-doctor/rerender-state-only-in-handlers": "off",
    "react-doctor/use-lazy-motion": "off",
    "react-doctor/no-side-effect-in-state-updater-function": "off",
    "react-doctor/iframe-missing-sandbox": "off",
    "react-doctor/no-vulnerable-react-server-components": "off",
    "react-doctor/no-unguarded-browser-global-at-module-scope": "off",
    "react-doctor/no-dynamic-import-path": "off",
    "react-doctor/no-eval": "off",
    "react-doctor/no-impure-call-at-module-scope": "off",
    "react-doctor/three-require-frame-delta": "off",
    "react-doctor/no-array-index-as-key": "off"
  }
};

export default doctorConfig;
