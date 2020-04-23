module.exports = {
  "parserOptions": {
    "ecmaVersion": 9
  },
  "env": {
    "browser": true,
    "commonjs": true,
    "node": true,
    "jquery": true
  },
  "extends": "airbnb-base",
  "plugins": [ "import", "html" ],
  "rules": {
    // "off" or 0 - turn the rule off
    // "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
    // "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
    // "no-var": 0,
    "no-console": 0,
    "no-plusplus": 0,
    "vars-on-top": 0,
    "no-underscore-dangle": 0, // var _foo;
    "comma-dangle": 0,
    "func-names": 0, // setTimeout(function () {}, 0);
    "prefer-arrow-callback": 0, // setTimeout(function () {}, 0);
    "prefer-template": 0,
    "no-nested-ternary": 0,
    "max-classes-per-file": 0,
    "arrow-parens": ["error", "as-needed"], // a => {}
    "no-restricted-syntax": [0, "ForOfStatement"],
    "no-param-reassign": ["error", { "props": false }],
    "no-multiple-empty-lines": 0,
    "no-var": 0,
    "eol-last":0,
    "padded-blocks": 0,
    "space-in-parens": 0,
    "no-trailing-spaces": 0,
    "arrow-body-style": 0,
    "no-return-assign": 0,
    "linebreak-style" : 0,
    "import/extensions": ['warn', 'always']
  }
};