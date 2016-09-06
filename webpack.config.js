const path = require('path');
const webpack = require('webpack');

var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');

var ENV = process.env.npm_lifecycle_event || 'develop';
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';


module.exports = function makeWebpackConfig() {

    var config = {};

    //type of source-map
    if (isProd) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-source-map';
    }

    // add debug messages
    config.debug = !isProd || !isTest;

    //Entry reference
    config.entry = {
        'app': './src/app/home',
    };

    //Output reference
    config.output = {
        path: root("/src/public/js"),
        filename: "[name].js"
    };

    //Resolve reference
    config.resolve = {
        root: root(),
        extensions: ['', '.js', '.json', '.css', '.scss', '.html'],
        alias: {
            'app': 'src/app',
        }
    };

    //Loaders
    config.module = {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: root("node_modules"),
                loaders: ["babel-loader", "eslint-loader"]
            }
        ],

        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                query: {
                    presets: ['es2015']
                }
            },

            {
                test: /\.scss$/,
                loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass')
            }
        ]
    };

    //Add vendor prefixes to css
    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    //Plugins
    config.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                ENV: JSON.stringify(ENV)
            }
        }),
        new DashboardPlugin(),
        new webpack.OldWatchingPlugin()
    ];

    if (!isTest) {
        config.plugins.push(
            new ExtractTextPlugin('css/[name].[hash].css', {disable: !isProd})
        );
    }

    config.devServer = {
        contentBase: './src/public',
        historyApiFallback: true,
        quiet: true,
        stats: 'minimal'
    };

    return config;
}();


// Helper functions
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}