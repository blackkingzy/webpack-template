const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

exports.setMpa = () => {
  const entry = {}
  const htmlWebpackPlugins = []

  const entryFiles = glob.sync(path.join(__dirname, '../src/mpa/*/index.js'))

  entryFiles.map((entryFile) => {
    const match = entryFile.match(/src\/(.*)\/index\.js$/)
    const pageName = match[1]
    entry[pageName] = entryFile

    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `../src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName], //选择你要在当前html注入的chunk模块(js文件)
      })
    )
  })
  return { entry, htmlWebpackPlugins }
}
