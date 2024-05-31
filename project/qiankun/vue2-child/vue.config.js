const { defineConfig } = require('@vue/cli-service')
const { name } = require('./package')
const path = require('path')

module.exports = defineConfig({
    outputDir: path.join(__dirname, '.vue2-child'),
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    devServer: {
        port: 8091,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    transpileDependencies: true,
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    // 如果使用 less-loader@5，请移除 lessOptions 这一级，直接配置选项。
                    modifyVars: {
                        'ant-prefix': 'av2',
                    },
                    //
                    javascriptEnabled: true,
                },
            },
        },
    },
    configureWebpack: {
        output: {
            // 指定输出文件的名称
            library: `${name}-[name]`,
            libraryTarget: 'umd', // 把微应用打包成 umd 库格式
            chunkLoadingGlobal: `webpackJsonp_${name}`, // 指定全局变量的名称
        },
    },
})
