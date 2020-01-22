const shell = require('shelljs');

const fs = require('fs');
const _ = require('lodash');

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

const splitLines = (s) => s.split('\n').slice(0, -1);

const removeDups = (fileNames) => {
    const existingFileNames = _.filter(fileNames, fs.existsSync);
    const statsToNames = _.map(existingFileNames, fileName => [fs.statSync(fileName), fileName]);
    const [statsToDirs, statsToFiles] = _.partition(statsToNames, ([stats]) => stats.isDirectory());

    const [, dirs] = _.unzip(statsToDirs);
    const [, files] = _.unzip(statsToFiles);

    const filteredFiles = _.filter(files, file => _.find(dirs, dir => _.startsWith(file, dir)) === undefined);

    return [...dirs, ...filteredFiles];
};

// const rawLines = shell.exec('$HOME/go/bin/godu -l 0', { silent: true }).stdout;

// const files = removeDups(splitLines(rawLines));

const checkPrerequisites = () => {

};

const collectFilenames = (testMode = true) => {
    console.log(`Running in test mode: ${testMode}`);
};

module.exports = {
    checkPrerequisites,
    collectFilenames,
};