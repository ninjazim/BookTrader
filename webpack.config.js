var webpack = require('webpack');
var path = require('path');

var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
   template: __dirname + '/app/index.html',
   filename: 'index.html',
   inject: 'body'
});

var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'app');

var config = {
  entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.js$/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  },
  plugins: [HTMLWebpackPluginConfig],
};

module.exports = config;
