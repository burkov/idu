const { splitLines } = require('./core');
const fs = require('fs');

const validateEditorContent = (content) => {
    const missing = splitLines(content).filter((l) => !fs.existsSync(l));
    if (missing.size === 0) return true;
    return `Some file(s) are missing: ${missing.join(',')}`;
};

const editorContentToFilenames = (content) => {
    return splitLines(content);
};

module.exports = {
    editorContentToFilenames,
    validateEditorContent,
};