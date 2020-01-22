#!/usr/bin/env node

const inquirer = require('inquirer');
const { exitIfPrerequisitesNotMet, collectFilenames } = require('./godu');
const { validateEditorContent, editorContentToFilenames } = require('./editor');
const { prettyPrintFilenames } = require('./core');
const program = require('commander');
const _ = require('lodash');

const main = () => {
    program
        .version('1.0.0')
        .name('idu')
        .option('-t, --test-mode', 'run in test mode', false)
        .arguments('<path>');

    program.parse(process.argv);
    exitIfPrerequisitesNotMet();
    const filenames = collectFilenames(program.testMode, program.path);
    if (_.isEmpty(filenames)) {
        console.log('Nothing to do, exiting.');
        process.exit(0);
    }
    prettyPrintFilenames(filenames);
    inquirer.prompt([
        {
            type: 'expand',
            message: 'These files will be removed. Sure?',
            name: 'action',
            default: 'edit',
            choices: [
                {
                    key: 'y',
                    name: 'Remove them',
                    value: 'remove',
                },
                {
                    key: 'e',
                    name: 'Edit list',
                    value: 'edit',
                },
                {
                    key: 'q',
                    name: 'Exit',
                    value: 'exit',
                },
            ],
        },
        {
            type: 'editor',
            name: 'editedLines',
            default: 'kek',
            validate: validateEditorContent,
            filter: editorContentToFilenames,
            message: 'Remove all lines from editor to cancel',
            when: ({ action }) => action === 'edit',
        },
    ]).then(answers => {
        console.log(answers);
    });
};

main();

