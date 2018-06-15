import * as CodeMirror from 'codemirror';
import * as mdlint from 'markdownlint-no-fs';

CodeMirror.registerHelper('lint', 'markdown', function (text, options) {
    const lintOptions = { strings: [text] };
    let result: any[][];
    mdlint(lintOptions, (_, lintResult) => {
        result = lintResult;
    });
    const lints = result[0].map(r => {
        // console.log(r);
        const range = r.errorRange === null ? [0, 0] : r.errorRange;
        const from = CodeMirror.Pos(r.lineNumber - 1, range[0]);
        const to = CodeMirror.Pos(r.lineNumber - 1, range[1]);
        const message = `[${r.ruleNames[0]}] ${r.ruleNames[1]}\n${r.ruleDescription}`;
        const severity = 'error';
        return { from, to, message, severity };
    });
    console.log(lints);
    return lints;
});
