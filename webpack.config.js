var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var OfflinePlugin = require('offline-plugin');

module.exports = {
  context: __dirname + '/app',
  entry: './js/app.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + './dist'
  },
  devServer: {
  	contentBase: __dirname + '/app',
	},
	module: {
	  loaders: [
	    {
	      test: /\.js$/, //Check for all js files
	      exclude: /node_modules/,
	      use: [{
	        loader: 'babel-loader',
	        options: { presets: ['es2015'] }
	      }]
	    },
	    {
        test: /\.css$/,
        loader:  ExtractTextPlugin.extract({
          loader: 'css-loader?importLoaders=1',
        }),
      },
		  { 
        test: /\.json$/, //Check for all JSON files
        loader: "json-loader"
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'file-loader',
          {
            loader: 'image-webpack',
            query: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ]
      }
	  ]
	},
	plugins: [
    new ExtractTextPlugin({
      filename: 'bundle.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      template: __dirname + '/app/index.html',
      filename: __dirname + '/dist/index.html',
      minify: { collapseWhitespace: true }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    new CopyWebpackPlugin([
      {
        from: {
          glob:  __dirname + '/app/images/**/*',
          dot: true
        },
        to: __dirname + '/dist'
      },
      { from: __dirname + '/app/favicon.ico', to:  __dirname + '/dist/' },
      { from: __dirname + '/app/manifest.json', to:  __dirname + '/dist/' },
      { from: __dirname + '/app/robots.txt', to:  __dirname + '/dist/' }
    ]),
    new OfflinePlugin({
      relativePaths: false,
      AppCache: false,
      publicPath: '/',
      excludes: ['**/*.map'],
      externals: ['https://maps.googleapis.com/maps/api/js?sensor=true&libraries=places', 'images/touch/favicon.ico', 'images/touch/apple-touch-icon-180x180.png', 'images/touch/apple-touch-icon-144x144.png']
    })
  ],
	devtool: 'source-map'
}