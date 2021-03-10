const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')

module.exports = {
  target: 'web',
  mode: 'production', //打包环境 'none' | 'development' | 'production'
  devtool: 'eval', //此选项控制是否生成,以及如何生成 source map
  // devtool: "cheap-module-eval-source-map", //开发环境配置,这里是四个参数同时开启
  entry: {
    main: './src/index.js',
    axios: 'axios',
  }, //打包⼊⼝⽂件
  output: {
    //指定输入资源的存放目录，位置
    //必须是绝对路径
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].chunk.js', //输出结构
    publicPath: './',
  },
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
    new VueLoaderPlugin(),
    new ESLintPlugin(), //eslint options
    new webpack.DefinePlugin({
      'process.env.CURRENT_ENV': '"development"',
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
    minimize: true,
    minimizer: [new TerserWebpackPlugin()],
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
    //配置如何展示性能提示
    hints: 'warning',
    //入口起点的最大体积 整数类型（以字节为单位）
    maxEntrypointSize: 1000000, //1M
    //生成任何文件的最大体积整数类型（以字节为单位 ）
    maxAssetSize: 1000000, //1M
  },
}
