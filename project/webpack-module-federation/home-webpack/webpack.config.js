// 子应用 webpack 配置
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const deps = require('./package.json').dependencies;

module.exports = {
    // entry
    entry: './src/index.js',
    // output
    output: {
        publicPath: 'auto',
    },
    // mode
    mode: 'development',
    devServer: {
        port: 3001,
        static: {
            directory: path.join(__dirname, 'dist'),
        }
    },
    // module
    module: {
        rules: [
            // {
            //     test: /\.css$/,
            //     use: [MiniCssExtractPlugin.loader, 'css-loader'],
            // },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-react'],
                },
            }
        ],
    },
    plugins: [
        // new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new ModuleFederationPlugin({
            name: 'home',
            filename: 'remoteEntry.js',
            exposes: {
                './Button': './src/Button',
            },
            shared: {
                ...deps,
                react: {
                    // eager 表示是否在初始化时加载
                    eager: true,
                    // singleton 表示是否共享
                    singleton: true,
                    requiredVersion: deps.react,
                },
                'react-dom': {
                    eager: true,
                    singleton: true,
                    requiredVersion: deps['react-dom'],
                },
            },
        }),
    ],
};