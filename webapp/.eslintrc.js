module.exports = {
  extends: 'qb',
  parser: 'babel-eslint',
  plugins: ['simple-import-sort'],
  rules: {
    'id-length': ['off'],
    'id-blacklist': ['off'],
    'line-comment-position': ['off'],
    'no-inline-comments': ['off'],
    'no-magic-numbers': ['off'],
    'no-console': ['off'],
    'max-len': ['off'],

    'simple-import-sort/imports': ['warn', {
      groups: [
        ["^[^.]"], // node modules, global imports
        ["^\\."],  // local imports
        ["^"]      // any other imports (e.g. './styles')
      ]
    }],
    'simple-import-sort/exports': ['off']
  }
};
