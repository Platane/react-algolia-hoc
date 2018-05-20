const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    'index-search-fancy': [
      path.join(__dirname, './search-fancy/index.js'),
      path.join(__dirname, './search-fancy/search-fancy.html'),
    ],
    'index-places-fancy': [
      path.join(__dirname, './places-fancy/index.js'),
      path.join(__dirname, './places-fancy/places-fancy.html'),
    ],
    'index-search-basic': [
      path.join(__dirname, './search-basic/index.js'),
      path.join(__dirname, './search-basic/search-basic.html'),
    ],
    'index-places-basic': [
      path.join(__dirname, './places-basic/index.js'),
      path.join(__dirname, './places-basic/places-basic.html'),
    ],
  },
  output: {
    path: path.join(__dirname, '../../../dist'),
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
