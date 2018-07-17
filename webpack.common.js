/* eslint-disable global-require */
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  module: {
    noParse: /(mapbox-gl)\.js$/,
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
      },
    ],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      tools: path.resolve(__dirname, 'src/tools'),
      assets: path.resolve(__dirname, 'public/assets'),
    },
  },
}
