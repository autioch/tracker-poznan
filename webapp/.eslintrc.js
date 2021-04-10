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
    'no-alert': ['off'],
    'no-undefined': ['off'],
    'no-unused-expressions': ['off'],
    'max-len': ['off'],

    'simple-import-sort/imports': ['warn'],
    'simple-import-sort/exports': ['off']
  }
};
