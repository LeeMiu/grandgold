// eslint 自定义配置
// @Last Modified by: LeeMiu
// @Ps: 温馨提示，执行eslint 文件名 --fix 可以批量修复eslint报错
const path = require('path');

module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "airbnb",
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  "parserOptions": {
    "ecmaVersion": 7,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true,
        VariableDeclarator: 2
      }
    ],
    "linebreak-style": [
      "error",
      "windows"
    ],
    "semi": [
      "warn",
      "always"
    ],
    // "sort-imports": '2',
    "linebreak-style": "off",
    "no-mixed-spaces-and-tabs": "warn",
    "no-unused-vars": "warn",
    "no-useless-escape": "warn",
    "no-case-declarations": "warn",
    "react/prop-types": "warn",
    "react/no-string-refs": "warn",
    "react/no-unescaped-entities": "warn",
    "react/display-name": [0],
    "no-debugger": 0, // 程序中能出现 debugger
    "no-console": 0, // 程序中能出现 console
    "no-alert": 2, // 禁止使用 alert、prompt、confirm
    "indent": [2, 2], // 使用2个空格缩进
    "no-mixed-spaces-and-tabs": "error", // 不允许同时使用空格和缩进
    "linebreak-style": [0, "windows"], // 使用 windows 的换行风格
    "quotes": [2, "single"], // 使用 `'`
    "semi": [2, "always"], // 语句末尾使用 `;`
    "no-cond-assign": [2, "always"], // // 禁止在条件判断（if, while ）中不允许使用 `=`
    "no-constant-condition": 2, // 禁止在条件判断（if, while ）中使用常量表达式
    "no-dupe-args": 2, // 函数的参数名称不能重复
    "no-dupe-keys": 2, // 对象的属性名称不能重复
    "no-duplicate-case": 2, // switch 的 case 不能重复
    "no-func-assign": 2, // 禁止重复的函数声明
    "no-obj-calls": 2, // 不能调用内置的全局对象
    "no-regex-spaces": 2, //禁止在正则表达式字面量中使用多个空格
    "no-sparse-arrays": 2, //禁止稀疏数组
    "no-unexpected-multiline": 2, //禁止多行表达式
    "no-unreachable": 2, //不能有无法执行的代码
    "use-isnan": 2, //禁止比较时使用 NaN，只能用 isNaN()
    "valid-typeof": 2, //必须使用合法的 typeof 的值
    "eqeqeq": [2, "always"], //必须使用严格等于
    "no-caller": 2, // //禁止使用 arguments.caller 或 arguments.callee
    "no-eval": 2, //禁止使用eval
    "no-redeclare": 2, //禁止重复声明变量
    "no-undef": 2, //不能有未定义的变量
    "no-unused-vars": 2, //不能有声明后未被使用的变量或参数
    "no-use-before-define": 2, //未定义前不能使用
    "comma-dangle": [0, "never"], //对象字面量项尾不能有逗号
    "no-const-assign": 2, //禁止修改const声明的变量
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    // 禁用规则
    "react/jsx-props-no-spreading": 0,  // 允许展开 props
    "import/no-extraneous-dependencies": 0, // 允许导入未定义的模块
    "import/order": 0, // 允许import乱序
    "react/jsx-filename-extension": 0, // 允许在 js 文件中使用 jsx
    "react/forbid-prop-types": 0, // 取消 prop type 类型限制
    "jsx-a11y/click-events-have-key-events": 0, // 允许 OnClick 事件不同时绑定键盘事件
    "jsx-a11y/no-noninteractive-element-interactions": 0, // 允许为所有元素分配事件
    "react/no-array-index-key": 0, // 允许将数组的 index 设置为 key 值
    "prefer-promise-reject-errors": 0, // 允许 Promise reject 返回任何类型数据
    "react/destructuring-assignment": 0, // 允许使用非解构赋值方式
    "react/jsx-fragments": 0, // 允许使用任意方式的Fragment
    "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"], // 允许使用特定的语法
  },
  "parser": "babel-eslint",
  "settings": {
    // 支持绝对路径
    "import/resolver": {
      "node": {
        "paths": ['src'],
      },
      "alias": {
        "map": [
          ['@', path.resolve(__dirname, 'src')],
        ],
        "extensions": ['.js',]
      }
    },
    "react": {
      "version": "latest"
    }
  }
};
