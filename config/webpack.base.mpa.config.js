const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')

const { dev, prod } = require(path.resolve(__dirname, '../.constant.js'))
const constant = process.env.NODE_ENV === 'production' ? prod : dev

const { setMpa } = require('./mpa.js')

const { entry, htmlWebpackPlugins } = setMpa()

module.exports = {
  target: 'web', //这个很重要
  entry, //打包⼊⼝⽂件
  output: {
    path: path.resolve(__dirname, '../dist'), //指定输入资源的存放目录,位置(必须是绝对路径)
    filename: '[name].[chunkhash].chunk.js', //输出结构
  },
  module: {
    //loader 处理webpack不⽀持的格式⽂件,模块。loader是有执行顺序的,从右到左,从下到上
    rules: [
      {
        test: /\.css$/,
        use: [miniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /.(png|jpe?g|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/images/',
            limit: 3 * 1024, //对小体积的资源图片进行管理，小图片转成base64,减少请求数量
          },
        },
      },
      {
        test: /\.(eot|woff2)$/,
        //use使⽤⼀个loader可以⽤对象，字符串，两个loader需要⽤数组
        use: {
          loader: 'file-loader', // 原理是把打包⼊⼝中识别出的资源模块，移动到输出⽬录，并且返回⼀个地址名称(动态的)
          options: {
            name: '[name]_[hash].[ext]', // placeholder 占位符 [name]⽼资源模块的名称 [ext]⽼资源模块的后缀
            outputPath: './assets/font', // 相对于webpack的output
            publicPath: '../font', //这里与url的生成有关系 (相对于生成后的css路径)!!!
          },
        },
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: {
          loader: 'vue-loader',
        },
      },
    ],
  },
  // externals: {
  //   //排除一些包
  // },
  plugins: [
    ...htmlWebpackPlugins,
    new VueLoaderPlugin(), //这个插件是必须的！ 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块。
    new ESLintPlugin(), //eslint options 默认exclude node_modules
    new webpack.DefinePlugin({
      // DefinePlugin 允许在 编译时 创建配置的全局常量，这在需要区分开发模式与生产模式进行不同的操作时，非常有用(注意是直接文本替换)
      ...constant,
      'process.env.CURRENT_ENV': '"development"', //不能直接使用这个process.env.NODE_ENV,因为这时候还没有根据mode创建好该变量
      __VUE_OPTIONS_API__: true, // enable/disable Options API support, default: true(以下俩个具体功能是啥不清楚,但为了去掉警告加上的)
      __VUE_PROD_DEVTOOLS__: true, // enable/disable devtools support in production, default: false
    }),
  ],
  // webpack5 不再为node.js核心模块提供polyfill,如有需要,需手动导入(因axios用到了node模块,但在web端不需要导入)
  resolve: {
    fallback: {
      http: false,
      https: false,
      zlib: false,
      tty: false,
      util: false,
      stream: false,
      assert: false,
      os: false,
    },
    alias: {
      '@': path.resolve(__dirname, '../src'),
      'vue-i18n': 'vue-i18n/index.js', // 解决警告
    },
  },
  performance: {
    hints: 'warning', //配置如何展示性能提示
    maxEntrypointSize:
      process.env.NODE_ENV === 'production' ? 1000000 : 10000000, //1M 入口起点的最大体积 整数类型（以字节为单位）
    maxAssetSize: process.env.NODE_ENV === 'production' ? 1000000 : 10000000, //1M 生成任何文件的最大体积整数类型（以字节为单位 ）
  },
}
