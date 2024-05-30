// webpack config js
module.exports = {
    // entry - 入口文件
    // 一个：路径字符串
    // 多个：对象
    entry: {
        main: './src/index.js',
        sub: './src/index.js',
        app: {
            import: './src/index.js',
            // dependOn - 依赖模块,在main module加载之后
            dependOn: 'main',
            // 输出文件名 name - app
            filename: '[name].js',
            // library - 指定输出的模块类型
            library: {
                name: 'app',
                type: 'umd'
            },
            // 指定 运行时 chunk 的名字， 默认 false
            runtime: 'runtime',
            // 概念同 output.publicPath
            publicPath: '/assets/',
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        // filename 规则
        // [hash] - 编译的hash值
        // [chunkhash] - chunk的hash值
        // [name] - 模块名称
        // [id] - 模块id
        // [query] - 模块的query参数
        filename: 'bundle[hash].js',
        // publicPath - 用于指定资源的路径, 
        // 另一种配置方式 ：__webpack_public_path__ - 用于指定运行时的路径
        publicPath: '/',
    },
    // 模块解析
    resolve: {
        // alias - 模块别名
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
        // extensions - 自动解析的扩展
        extensions: ['.ts', '.js', '.json', '.jsx', '.css', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            // 支持vue
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            // 在 vue 中支持 TS
            {
                test: /\.ts$/,
                // loader 加载器
                use: 'ts-loader',
                exclude: /node_modules/
            },
            // 在 vue 中支持 jsx
            {
                test: /\.jsx$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        // html-webpack-plugin
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        // 定义环境变量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        // 热更新
        // https://webpack.js.org/plugins/hot-module-replacement-plugin/
        new webpack.HotModuleReplacementPlugin(),
        // webpack 4 之后，使用optimization.emitOnErrors
        // 我的理解是阻止编译错误
        new webpack.NoEmitOnErrorsPlugin(),
        // 命名模块
        new webpack.NamedModulesPlugin(),
        // 生成 css 文件
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        // 生成 manifest.json 文件
        new WebpackManifestPlugin(),
        // 清理 dist 文件夹
        new CleanWebpackPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        // 热更新
        hot: true
    },
    mode: 'development'
};