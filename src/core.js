const fs = require('fs');
const _ = require('lodash');
const shell = require('shelljs');
const chalk = require('chalk');
const filesize = require('filesize');

const validateFileNames = (fileNames) => {
    debugger;
    if (_.isEmpty(fileNames)) return 'list is empty';
    const hasInvalidFilename = _.find(fileNames, fileName => {
        if (!fs.existsSync(fileName)) return true;
        const stats = fs.statSync(fileName);
        return !stats.isDirectory && !stats.isFile;
    }) !== undefined;
    if (hasInvalidFilename) return 'contains invalid filename';
    return true;
};

const splitLines = (content) => content.split('\n').slice(0, -1);

const joinLines = (lines) => lines.join('\n');

const splitDirsAndFiles = (filenames) => {
    const isDirectory = (filename) => fs.statSync(filename).isDirectory();
    return _.partition(filenames, isDirectory);
};

const normalizeFilenames = (filenames) => {
    const existingPaths = _.filter(filenames, fs.existsSync);
    const [ dirs, files ] = splitDirsAndFiles(existingPaths);
    const isUnique = (filename) => _.find(dirs, dir => filename !== dir && _.startsWith(filename, dir)) === undefined;
    const uniqueFilenames = _.filter(files, isUnique).sort();
    const uniqueDirs = _.filter(dirs, isUnique).sort();
    return [ ...uniqueDirs, ...uniqueFilenames ];
};

const prettyPrintFilenames = (filenames) => {
    const [ dirs, files ] = splitDirsAndFiles(filenames);
    dirs.forEach((name) => {
        const out = shell.exec(`du -sh ${name}`, { silent: true }).stdout;
        const size = out.substr(0, out.indexOf('\t')).padStart(10, ' ');
        console.log(chalk.green(`[dir ] [${size}] ${name}`));
    });
    files.forEach((name) => {
        const size = filesize(fs.statSync(name).size, { unix: true }).padStart(10, ' ');
        console.log(`[file] [${size}] ${name}`);
    });
};

const removeFiles = (filenames) => {
    filenames.forEach((f) => {
        console.log(`Removing '${f}'`);
        shell.rm('-rf', f);
    });
};

module.exports = {
    splitLines,
    joinLines,
    removeFiles,
    prettyPrintFilenames,
    normalizeFilenames,
};