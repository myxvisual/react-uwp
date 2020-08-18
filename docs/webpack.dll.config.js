const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const ManifestPlugin = require('webpack-manifest-plugin')

const __DEV__ = process.env.NODE_ENV !== 'production'
const { outputPath, publicPath } = require('./config')

const excludeVendor = []
const includeVendor = [
  'react',
  'react-dom',
  'react-router'
]
const packageDependNames = Object.keys(JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8')).dependencies)
const vendor = __DEV__ ? (
  packageDependNames.filter(vendor => !excludeVendor.includes(vendor))
) : includeVendor

const library = `[name]${__DEV__ ? '_dev' : '_prod'}_lib`
module.exports = {
  entry: { vendor },
  output: {
    filename: `[name]${__DEV__ ? '.dev' : '.prod.[hash:5]'}.dll.js`,
    path: path.resolve(`./${outputPath}/${publicPath}`),
    library
  },
  plugins: [
    new ManifestPlugin({ fileName: 'webpack-dll-manifest.json' }),
    new webpack.DllPlugin({
      path: path.resolve(`./${outputPath}/${publicPath}/[name]-manifest${__DEV__ ? '.dev' : '.prod'}.json`),
      name: library,
      context: `./${outputPath}`
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) })
  ].concat(__DEV__ ? [] :[
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ])
}
