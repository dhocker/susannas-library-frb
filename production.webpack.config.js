var webpack = require('webpack');
var path = require("path");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

console.log("process.env.WEBPACK_DEVTOOL: " + process.env.WEBPACK_DEVTOOL)

/*
    Initial config: http://tylermcginnis.com/react-js-tutorial-1-5-utilizing-webpack-and-babel-to-build-a-react-js-app/
    Multiple entry points methods:
        https://webpack.github.io/docs/multiple-entry-points.html
        https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points
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
	devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings: false
            }
        })
	]
};