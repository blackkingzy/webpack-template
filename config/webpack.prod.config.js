const { merge } = require('webpack-merge') // 注意是合并
const TerserPlugin = require('terser-webpack-plugin') //压缩在production环境是没有注释的
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const path = require('path')
const base = require('./webpack.base.config.js')

module.exports = merge(base, {
  mode: 'production', //打包环境 'none' | 'development' | 'production'
  output: {
    path: path.resolve(__dirname, '../dist'), //指定输入资源的存放目录,位置(必须是绝对路径)
    filename: '[name].[chunkhash].chunk.js', //输出结构
  },
  plugins: [new CleanWebpackPlugin(), new BundleAnalyzerPlugin()],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        extractComments: false, //不将注释提取到单独的文件中(防止出现.LICENSE.txt)
      }),
    ],
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      minChunks: 1,
      cacheGroups: {
        third: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, //优先级,主要是当模块引入符合多个规则时,根据优先级进行代码分割
          reuseExistingChunk: true, //当一个模块已经存在于一个chunk中,直接重用,不会添加到新的chunk中
          name: 'third', //chunk名字
        },
      },
    },
  },
})
