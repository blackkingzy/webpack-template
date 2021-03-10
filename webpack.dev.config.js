const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')

module.exports = {
  target: 'web', //这个很重要
  mode: 'development', //打包环境 'none' | 'development' | 'production'
  // devtool: "eval", //此选项控制是否生成,以及如何生成 source map
  devtool: 'source-map', //开发环境配置,这里是四个参数同时开启
  entry: { main: './src/index.js' }, //打包⼊⼝⽂件
  devServer: {
    //启动服务后，会发现dist⽬录没有了，这是因为devServer把打包后的模块不会放在dist⽬录下，⽽是放到内存中，从⽽提升速度
    contentBase: path.resolve(__dirname, 'dist'),
    open: true, //第一次编译完成自动打开浏览器
    // hot: true, //热模块替换,此时Webpack可以实现css的热替换；但不能实现js、图片等的热替换，此二者需要自己手动通过代码来处理。
    //一些脚手架工具可能会自带热模块替换，那是因为你使用的是框架，使用框架开发时，我们项目中的每个文件就有了规律,那这样就可以有通用的替换办法.
    // hotOnly: true  //即便HMR不⽣效，浏览器也不⾃动刷新，就开启hotOnly
    port: 8081,
  },
  output: {
    //指定输入资源的存放目录，位置
    //必须是绝对路径
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].chunk.js',
  }, //输出结构
  module: {
    //loader 处理webpack不⽀持的格式⽂件，模块
    rules: [
      //loader模块处理,loader是有执行顺序的,从右到左,从下到上
      {
        test: /\.css$/,
        use: [miniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      // {
      //     test: /\.less$/,
      //     use: ["style-loader", "css-loader", "less-loader"],
      // },
      //css-loader识别css模块并分析css模块之间的关系,并合成⼀个css
      //Style-loader会把css-loader⽣成的内容,以style挂载到⻚⾯的heade部分(通过js代码创建style标签动态挂载)
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
          // options额外的配置，⽐如资源名称
          options: {
            // placeholder 占位符 [name]⽼资源模块的名称
            // [ext]⽼资源模块的后缀
            // https://webpack.js.org/loaders/file-loader#placeholders
            name: '[name]_[hash].[ext]',
            outputPath: './assets/font',
            publicPath: '../font', //这里与url的生成有关系
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
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack template',
      filename: 'index.html',
      template: './index.html',
    }),
    new CleanWebpackPlugin(),
    //把样式抽离成独立的文件
    new miniCssExtractPlugin({
      filename: 'assets/css/index.css',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(), //这个插件是必须的！ 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块。
    new webpack.DefinePlugin({
      __VUE_PROD_DEVTOOLS__: true, //enable/disable devtools support in production, default: false,在这好像没什么用
    }),
    new ESLintPlugin(), //eslint options 默认exclude node_modules
    new webpack.DefinePlugin({
      // DefinePlugin 允许在 编译时 创建配置的全局常量，这在需要区分开发模式与生产模式进行不同的操作时，非常有用(注意是直接文本替换)
      'process.env.CURRENT_ENV': '"development"', //不能直接使用这个process.env.NODE_ENV,因为这时候还没有根据mode创建好该变量
    }),
  ],
  // webpack5 不再为node.js核心模块提供polyfill,如有需要,需手动导入
  // 如下所示,还需要将一下包全部install(axios中引用了node的包)
  // 但如果仅仅是前台用,顾不需要将这些垫片打进去
  // 通过这个resolve可以将一些不想要的垫片不打包进去,也可以通过resolve.alias设置为false
  // resolve:{
  //     fallback:{
  //         "http": require.resolve("stream-http"),
  //         "https": require.resolve("https-browserify"),
  //         "zlib": require.resolve("browserify-zlib"),
  //         "tty": require.resolve("tty-browserify"),
  //         "util": require.resolve("util/"),
  //         "stream": require.resolve("stream-browserify"),
  //         "assert": require.resolve("assert/"),
  //         "os": require.resolve("os-browserify/browser"),
  //     }
  // }
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
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: {
    //开发环境我建议不要optimization
    minimize: true,
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      minChunks: 1,
      cacheGroups: {
        zhangyues: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, //优先级,主要是当模块引入符合多个规则时,根据优先级进行代码分割
          reuseExistingChunk: true, //当一个模块已经存在于一个chunk中,直接重用,不会添加到新的chunk中
          name: 'zhangyue', //chunk名字
        },
      },
    },
  },
  performance: {
    //配置如何展示性能提示(开发环境下可以大一点)
    hints: 'warning',
    //入口起点的最大体积 整数类型（以字节为单位）
    maxEntrypointSize: 10000000, //10M
    //生成任何文件的最大体积整数类型（以字节为单位 ）
    maxAssetSize: 10000000, //10M
  },
}
