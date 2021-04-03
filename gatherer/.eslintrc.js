module.exports = {
  extends: 'qb',
  parser: 'babel-eslint',
  rules: {
    'id-length': ['off'],
    'max-len': ['off'],
    'id-blacklist': ['off'],
    'line-comment-position': ['off'],
    'no-inline-comments': ['off'],
    'no-magic-numbers': ['off'],
    'no-return-assign': ['off'],
    'camelcase': ['off'],
    'no-console': ['off'],
    'no-sync': ['off'],
    'no-confusing-arrow': ['off'],
    'newline-per-chained-call': ['off'],

    'simple-import-sort/imports': ['warn', {
      groups: [
        ["^[^.]"], // node modules, global imports
        ["^\\."],  // local imports
        ["^"]      // any other imports (e.g. './styles')
      ]
    }],
    'simple-import-sort/exports': ['off']
  },
  env: {
    node: true
  },
  plugins: ['simple-import-sort'],
  parserOptions: {
    sourceType: 'module',
    impliedStrict: true
  }
};
