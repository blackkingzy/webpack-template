const webpack = require('webpack')
const { merge } = require('webpack-merge') //相同字段合并
const DashboardPlugin = require('webpack-dashboard/plugin')
const path = require('path')
const base = require('./webpack.base.config.js')

module.exports = merge(base, {
  mode: 'development', //打包环境 'none' | 'development' | 'production'
  devtool: 'inline-source-map', //此选项控制是否生成,以及如何生成 source map
  devServer: {
    //启动服务后，会发现dist⽬录没有了，这是因为devServer把打包后的模块不会放在dist⽬录下，⽽是放到内存中，从⽽提升速度
    contentBase: path.resolve(__dirname, '../public'),
    open: true, //第一次编译完成自动打开浏览器
    // hot: true, //热模块替换,此时Webpack可以实现css的热替换；但不能实现js、图片等的热替换，此二者需要自己手动通过代码来处理。
    //一些脚手架工具可能会自带热模块替换，那是因为你使用的是框架，使用框架开发时，我们项目中的每个文件就有了规律,那这样就可以有通用的替换办法.
    // hotOnly: true  //即便HMR不⽣效，浏览器也不⾃动刷新，就开启hotOnly
    port: 8081,
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new DashboardPlugin()],
})
