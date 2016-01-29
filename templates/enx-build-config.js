/**
 * @file config enx-build
 * @author luwenlong
 */

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var mkdirp = require('mkdirp');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common', 'common.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var port = 3000;
var exclude = [
    '.gitignore',
    '*.swp',
    '*.swo',
    'node_modules'
];

module.exports = {
    devtool: 'eval',
    entry: {
        index: [
            'webpack-dev-server/client?http://127.0.0.1:' + port,
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
        filename: '[name].[hash].js',
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
        new ExtractTextPlugin('[name].[hash].css'),
        new HtmlWebpackPlugin({
            filename: 'entry/index.html',
            hash: true,
            template: 'tpl/index.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'entry/search.html',
            hash: true,
            template: 'tpl/search.html',
        })
    ],
    port: port,
    exclude: exclude
};

/**
 * 生成tpl配置模板 以便webpack利用该文件生成最终的html资源
 */
var hash = '{%=o.webpack.hash%}';

// TODO 清除tpl asset文件夹
// TODO 动态生成webpack html的配置部分
// TODO "rm -rf asset tpl && node lib/createTPL.js && webpack --config enx-build-config.js -p && rm -rf tpl"

scanHTML(__dirname);

/**
 * 生成模板资源
 *
 */
function createTPL(from, to, fileName) {
    mkdir('tpl', function () {
        var str = replaceTemplate(loadTemplate(from), fileName, fileName + '.' + hash);
        str = replaceTemplate(str, 'common', 'common.' + hash);
        str = replaceTemplate(str, '<script src="http://localhost:' + port + '/webpack-dev-server.js"></script>', '');
        createTemplate(str, to);
    });
}

/**
 * 扫描项目中的html资源
 *
 */
function scanHTML(destinationPath) {
    fs.readdir(destinationPath, function(err, files) {
        files = excludeFile(files);
        files.forEach(function (file, i) {
            fs.stat(path.join(destinationPath, file), function (err, stat) {
                if (stat.isDirectory()) {
                    scanHTML(path.join(destinationPath, file));
                }
                else if (stat.isFile()){
                    if (path.extname(file) === '.html') {
                        var fileName = path.basename(file, '.html');
                        var fromPath = path.join(destinationPath, file);
                        var toPath = path.join(destinationPath, '..', 'tpl', file);

                        createTPL(fromPath, toPath, fileName);
                    }
                }
            });
        });
    });
}

/**
 * 去除临时 备份等文件
 *
 */
function excludeFile(files) {
    files.forEach(function (file, i) {
        if (/^\.(.*)(swp|swo)$/.test(file)
            || /^(.*\.bak)$/.test(file)
            || exclude.indexOf(file) !== -1
        ) {
            files.splice(i, 1);
            return false;
        }
    });

    return files;
}

/**
 * 创建目标文件
 *
 */
function mkdir(destinationPath, fn) {
    mkdirp(destinationPath, 0755, function(err){
        if (err) throw err;
        console.log('   \033[36mcreate\033[0m : ' + destinationPath);
        fn && fn();
    });
}

/**
 * 替换模板字符串
 *
 */
function replaceTemplate(str, from, to) {
    return str.replace(new RegExp(from, 'ig'), to);
}

/**
 * 生成模板资源
 *
 */
function createTemplate(str, destinationPath) {
    fs.writeFileSync(destinationPath, str, {mode: 0666})
}

/**
 * 载入模板资源
 *
 */
function loadTemplate(name) {
    return fs.readFileSync(name, 'utf8');
}
