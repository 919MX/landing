const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')

const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    historyApiFallback: true,
  },
})
