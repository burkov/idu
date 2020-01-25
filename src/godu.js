const shell = require('shelljs');
const { splitLines, normalizeFilenames } = require('./core');
const { sampleFilenames } = require('./test');
const fs = require('fs');

const execGoduSilently = (args, fatal = true) => {
    const command = `$HOME/go/bin/godu ${args}`;
    const result = shell.exec(command, { silent: true, fatal });
    if (fatal && result.code !== 0) {
        // for some reason 'fatal' option to exec is not working, this helps keep expected behaviour
        console.log(`'${command}' unexpectedly exited with error code ${result.code}`);
        console.log(result.stderr);
        process.exit(1);
    }
    result.command = command;
    return result;
};

const exitIfPrerequisitesNotMet = () => {
    const { code, command } = execGoduSilently('-v', false);
    if (code !== 0) {
        console.log(`This program requires 'godu' to be installed ('${command}', exit code ${code}).`);
        process.exit(1);
    }
};

const collectFilenames = (testMode = true, path = '.') => {
    if (testMode) return normalizeFilenames(sampleFilenames);
    if (!fs.existsSync(path)) {
        console.log(`Given path '${path}' doesn't exist.`);
        process.exit(2);
    }
    const { stdout } = execGoduSilently(`-l 0 ${path}`);
    const lines = splitLines(stdout);
    return normalizeFilenames(lines);
};

module.exports = {
    exitIfPrerequisitesNotMet,
    collectFilenames,
};