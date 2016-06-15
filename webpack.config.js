var webpack = require('webpack');
var path = require("path");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

/*
    From: http://tylermcginnis.com/react-js-tutorial-1-5-utilizing-webpack-and-babel-to-build-a-react-js-app/
*/

/*
// Webpack HTML Plugin setup
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/app/templates/index.html',
    filename: 'index.html',
    inject: 'body'
});
*/

/*
    Legend
    __dirname - the directory where this file (webpack.config.js) is located.
*/

/*
module.exports = {
    entry: [
        './app/js/index.js'
    ],
    module: {
        loaders: [
            {test: /\.js$/, include: __dirname + '/app', loader: "babel-loader"}
        ]
    },
    output: {
        filename: "index_bundler.js",
        path: __dirname + '/app/static/dist'
    },
    plugins: [HTMLWebpackPluginConfig]
};
*/

module.exports = {
    entry: [
        './app/static/js/main.jsx'
    ],
    module: {
        loaders: [
            {test: /\.jsx?$/, include: __dirname + '/app/static/js', loaders: ['react-hot', 'babel']},

            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            },
            {
                test: /\.(woff|woff2)$/,
                loader: "url?prefix=font/&limit=5000"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=image/svg+xml"
            },
            {
                test: /\.gif/,
                loader: "url-loader?limit=10000&mimetype=image/gif"
            },
            {
                test: /\.jpg/,
                loader: "url-loader?limit=10000&mimetype=image/jpg"
            },
            {
                test: /\.png/,
                loader: "url-loader?limit=10000&mimetype=image/png"
            }
        ]
    },
    output: {
        filename: "index_bundler.js",
        path: __dirname + '/app/static/dist',
        libraryTarget: 'var',
        library: 'EntryPoint'
    },
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
	plugins: [
		new webpack.NoErrorsPlugin()
	]
};