module.exports = {
  entry: __dirname + '/app/index.js',
  output: {
    path: __dirname + '/package/staticresources',
    filename: 'ReactLightningRendererDemo.resource',
    library: 'ReactLightningRendererDemo',
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
