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
    "deslop/unused-dev-dependency": "off"
  }
};

export default doctorConfig;
