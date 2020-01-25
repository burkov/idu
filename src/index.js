#!/usr/bin/env node

const inquirer = require('inquirer');
const { exitIfPrerequisitesNotMet, collectFilenames } = require('./godu');
const { validateEditorContent, editorContentToFilenames } = require('./editor');
const { prettyPrintFilenames } = require('./core');
const program = require('commander');
const _ = require('lodash');
const { removeFiles } = require('./core');

const ACTION_REMOVE = 'remove';
const ACTION_EDIT = 'edit';
const ACTION_QUIT = 'quit';

const main = async () => {
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
    const answers = await inquirer.prompt([
        {
            type: 'expand',
            message: 'These files will be removed. Sure? (Yes/No/Edit/Help)',
            name: 'action',
            default: ACTION_EDIT,
            choices: [
                {
                    key: 'y',
                    name: 'Remove them',
                    value: ACTION_REMOVE,
                },
                {
                    key: 'n',
                    name: 'No, quit',
                    value: ACTION_QUIT,
                },
                {
                    key: 'e',
                    name: 'Edit list',
                    value: ACTION_EDIT,
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
            when: ({ action }) => action === ACTION_EDIT,
        },
    ]);
    switch (answers.action) {
        case ACTION_QUIT:
            process.exit(0);
            break;
        case ACTION_REMOVE:
            removeFiles(filenames);
            break;
        case ACTION_EDIT:
            console.log('Not implemented');
            break;
    }
};

main();