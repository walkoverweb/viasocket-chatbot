module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    jest: true,
    browser: true,
    amd: true,
    node: true,
    es2021: true,
  },
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "airbnb",
    "airbnb/hooks",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": 0,
    "dot-notation": 0,
    "no-console": ["error", { allow: ["error", "log"] }],
    "no-use-before-define": 0,
    "no-plusplus": 0, // needed
    "func-names": 0, // needed
    "no-param-reassign": 0,
    "object-shorthand": 0,
    camelcase: 0,
    "react/require-default-props": "off",
    "import/prefer-default-export": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "prettier/prettier": 0,
    "no-shadow": 0,
    "react/jsx-no-bind": 0,
    "no-nested-ternary": 0,
    // later
    "react/jsx-filename-extension": 0,
    "react/prop-types": 0,
    "react-hooks/exhaustive-deps": 0,
    "react/jsx-props-no-spreading": 0,
    "prefer-destructuring": 0,
    "@typescript-eslint/no-var-requires": 0,
    "no-bitwise": 0,
    "no-return-assign": 0,
    "one-var": 0,
    "no-underscore-dangle": 0,
    "no-unsafe-optional-chaining": 0,
    "import/no-cycle": 0,
    "react/no-array-index-key": 0,
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: false, // Allow dependencies to be installed for dev use
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
  },
};
