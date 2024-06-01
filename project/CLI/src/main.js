// commander is a popular library for building command-line interfaces in Node.js
import program from 'commander';
// fs is a Node.js module for interacting with the file system
import fs from 'fs';
// path is a Node.js module for working with file paths
import path from 'path';
// ora is a command-line loading animation library
import ora from 'ora';
// log-symbols is a library for adding symbols to log output
import symbol from 'log-symbols';
// chalk is a command-line color library
import chalk from 'chalk';

// Define the version and description of the CLI
program
    .version(require('../package.json').version, '-v, --version')
    .description('A CLI for creating Vue.js projects');

// Define the command for creating a new project
import create from './create';

const actions = {
    create: {
        description: 'Create new project',
        usages: [
            'project create <project-name>'
        ],
        alias: 'c',
        option: [
            {
                flags: '-f --force',
                description: 'Overwrite target directory if it exists'
            }
        ],
    }
};

Object.keys(actions).forEach(action => { 
    if(actions[action].option) {
        actions[action].option.forEach(option => {
            // Add option to command
            program.option(option.flags, option.description, obj.defaultValue);
            console.log(option.flags, option.description, obj.defaultValue, 'EEE');
        });
    }
    program.command(action)
        .command(action)
        .description(actions[action].description)
        .alias(actions[action].alias)
        .action(() => {
            actions[action](...process.argv.slice(3));
        });
});