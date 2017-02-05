var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3333',
    'webpack/hot/only-dev-server',
    './docs/src/index',
  ],
  output: {
    path: path.join(__dirname, 'docs/dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel', 'babel-loader'],
      include: [path.join(__dirname, 'src'), path.join(__dirname, 'docs/src')]
    }]
  },
};
