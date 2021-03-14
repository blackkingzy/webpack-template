//注意字符串的写法,必须要单引号内要有双引号(DefinePlugin的要求) 务必成对存在
module.exports = {
  dev: { VUE_APP_BASE_API: '"/dev-api"' },
  prod: {
    VUE_APP_BASE_API: '""',
  },
}
