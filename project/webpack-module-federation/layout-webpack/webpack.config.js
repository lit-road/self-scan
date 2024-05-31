// 模块联邦 demo
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
// vue
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const deps = require('./package.json').dependencies;

module.exports = (env = {}) => ({
    mode: 'development',
    // 禁止 module federation 缓存
    cache: false,
    devtool: 'source-map',
    optimization: {
        minimize: false
    },
    // entry: path.resolve(__dirname, './src/main.ts'),
    entry: path.resolve(__dirname, './src/bootstrap.js'),
    output: {
        publicPath: 'auto',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            "vue": "vue/dist/vue.esm-bundler.js"
        }
    },
    // https://webpack.js.org/configuration/experiments/
    experiments: {
        topLevelAwait: true,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-react'],
                },
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.png$/,
                use: {
                    loader: 'url-loader',
                    options: { limit: 8192 },
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    'css-loader',
                ],
            },
        ]
    },
    // webpack plugin 有顺序要求,MiniCssExtractPlugin 必须在 HtmlWebpackPlugin 之前
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new ModuleFederationPlugin({
            // name: 'app1',
            // library: { type: 'var', name: 'app1' },
            // filename: 'remoteEntry.js',
            // exposes: {
            //     './Button': './src/Button'
            // },
            // shared: ['react', 'react-dom']

            name: 'layout',
            remotes: {
                // 引用其他依赖
                home: 'home@http://192.168.48.135:3001/remoteEntry.js',
            },
            // shared ? 为共享依赖 ，本地环境构建
            // !这就叫玛德了。为使用的组件提供依赖。这谁受得了啊！！
            shared: {
                ...deps,
                react: {
                    // singleton ? 为 true 时, 只会加载一次, 否则会加载多次
                    singleton: true,
                    // requiredVersion ? 为依赖版本号
                    requiredVersion: deps.react,
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: deps['react-dom'],
                },
            }
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'),
            chunks: ['main'],
        }),
        new VueLoaderPlugin(),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname),
        },
        compress: true,
        port: 3000,
        hot: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
    },
});