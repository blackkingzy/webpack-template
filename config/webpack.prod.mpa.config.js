const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin') //压缩在production环境是没有注释的
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin') //抽离css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') //压缩css
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const mpa_base = require('./webpack.base.mpa.config.js')

module.exports = merge(mpa_base, {
  mode: 'production', //打包环境 'none' | 'development' | 'production'
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin(),
    new miniCssExtractPlugin({
      filename: 'assets/css/index.css', //把样式抽离成独立的文件(相对于主output)
    }),
  ],
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
