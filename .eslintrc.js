const ENV = process.env.npm_lifecycle_event //dev||build
module.exports = {
  globals: {
    //一些不是在代码中直接导入的全局变量需要在这里注册
    // 'process.env': 'true',
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    //一个配置文件可以从基础配置中继承已启用的规则
    'airbnb-base', //air公司的规范,业界比较成熟的规范
    'eslint:recommended',
    'plugin:vue/essential', //对.vue文件的规范
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    parser: 'babel-eslint', //词法解析器使用babel-eslint，以更好的适配es6的新api
    ecmaVersion: 12, //启用ES12语法支持
    sourceType: 'module',
  },
  plugins: ['vue', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-unresolved': 'off',
    'no-unused-vars': ENV === 'build' ? 'error' : 'off',
    'no-console': 'off',
    quotes: ['error', 'single'],
  },
}
