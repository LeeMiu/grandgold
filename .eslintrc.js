// eslint 自定义配置
// @Last Modified by: LeeMiu
// @Ps: 温馨提示，执行eslint 文件名 --fix 可以批量修复eslint报错
module.exports = {
  root: false,
  env: {
    node: false
  },
  extends: [
    'plugin:vue/strongly-recommended',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    // 自定义配置，html括号结束之前不需要换行符
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'never',
      },
    ],
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    _: true,
  },
};
