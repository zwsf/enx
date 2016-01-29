/**
 * @file config enx-webserver
 * @author luwenlong
 */
var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common', 'common.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var port = 3000;

var config = {
    devtool: 'eval',
    entry: {
        index: [
            'webpack-dev-server/client?http://127.0.0.1:3000',
            'webpack/hot/only-dev-server',
            './src/index/main.js'
        ],
        search: [
            './src/search/main.js'
        ],
        common: ['react']
    },
    output: {
        path: path.join(__dirname, 'asset'),
        filename: '[name].js',
        chunkFilename: '[id].[chunkhash].js',
        publicPath: '/asset/', 
        library: '[name]',
        libraryTarget: 'amd'
    },
    module: {
        loaders: [
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader')
            },
            {
                test: /\.(js|jsx)?$/,
                loaders: ['react-hot', 'babel?stage=0&optional=runtime'],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192'
            },
            {
                test: /\.(eot|woff|ttf|svg)$/,
                loader: 'file-loader?limit=81920'
            },
        ]
    },
    resolve: {
        root: ['node_modules'],
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules'],
        alias: {}
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin('[name].css'),
    ]
};

new WebpackDevServer(
    webpack(config),
    {
        publicPath: config.output.publicPath,
        hot: true,
        historyApiFallback: true,
        stats: {colors: true}
    }
).listen(port, 'localhost', function (err) {
    if (err) {
        console.log(err);
    }

    return port;

    console.log('Listening at localhost: ' + port);
});
