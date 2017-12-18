const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    'index-search': [
      path.join(__dirname, './search/index.js'),
      path.join(__dirname, './search/search.html'),
    ],
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },

      {
        test: [/\.html?$/],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
}
