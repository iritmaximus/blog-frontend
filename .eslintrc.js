// eslint-disable-next-line
module.exports = {
  "env": {
      "browser": true,
      "es2021": true,
      "jest": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
  },
  "rules": {
    "semi": [1, "always"],
    "quotes": [1, "double"],
    "react/prop-types": 1,
  }
};
