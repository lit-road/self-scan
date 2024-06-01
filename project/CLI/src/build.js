// Desc: Build the project
import webpack from 'webpack';
// ora 是一个命令行 loading 动画效果库
import ora from 'ora';
// chalk 是一个命令行输出的颜色库
import chalk from 'chalk';
// symbol 是一个命令行输出的图标库
import symbol from 'log-symbols';
import webpackConfig from './webpack.config.js';

const build = () => {
    webpack(webpackConfig, (err, stats) => {
        const spinner = ora('building for production...');
        spinner.start();
        if (err) {
            spinner.fail();
            console.log(symbol.error, chalk.red(err));
            process.exit(1);
        }
        spinner.succeed();
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');
        console.log(symbol.success, chalk.green('Build complete.\n'));
        console.log(chalk.yellow('Tip: built files are meant to be served over an HTTP server.\n'
            + 'Opening index.html over file:// won\'t work.\n'));
    });
};

module.exports = build;