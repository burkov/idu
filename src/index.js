#!/usr/bin/env node

const inquirer = require('inquirer');
const {checkPrerequisites} = require('./core');
const {validateEditorContent} = require('./editor');
const {editorContentToFilenames} = require('./editor');
const program = require('commander');
const {collectFilenames} = require('./core');

const main = () => {
    program
        .version('1.0.0')
        .name('idu')
        .option('-t, --test-mode', 'run in test mode', false);
    program.parse(process.argv);
    console.log(program.testMode);
    checkPrerequisites();
    const filenames = collectFilenames(program.testMode);

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
            when: ({action}) => action === 'edit',
        },
    ]).then(answers => {
        console.log(answers);
    });
};

main();

