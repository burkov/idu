const fs = require('fs');
const _ = require('lodash');
const { sampleFilenames } = require('./test');

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

const normalizeFilenames = (filenames) => {
    const existingPaths = _.filter(filenames, fs.existsSync);
    const isDirectory = (filename) => fs.statSync(filename).isDirectory();
    const [ dirs, files ] = _.partition(existingPaths, isDirectory);
    const isUnique = (filename) => _.find(dirs, dir => filename !== dir && _.startsWith(filename, dir)) === undefined;
    const uniqueFilenames = _.filter(files, isUnique).sort();
    const uniqueDirs = _.filter(dirs, isUnique).sort();
    return [ ...uniqueDirs, ...uniqueFilenames ];
};

// const rawLines = shell.exec('$HOME/go/bin/godu -l 0', { silent: true }).stdout;

// const files = normalizeFilenames(splitLines(rawLines));


const prettyPrintFilenames = (filenames) => {
    filenames.forEach((f) => console.log(f));
};

module.exports = {
    splitLines,
    joinLines,
    prettyPrintFilenames,
    normalizeFilenames,
};