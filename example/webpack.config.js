module.exports = {
  entry: __dirname + '/app/index.js',
  output: {
    path: __dirname + '/package/staticresources',
    filename: 'ReactLightningBridge.resource',
    library: 'ReactLightningBridge',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      }
    ]
  }

};
