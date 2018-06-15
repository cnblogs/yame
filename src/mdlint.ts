import * as CodeMirror from 'codemirror';
import * as mdlint from 'markdownlint-no-fs';

CodeMirror.registerHelper('lint', 'markdown', function (text, options) {
    const rules = { default: true };
    for (const rule of options.disableMdRules) {
        rules[rule] = false;
    }
    const lintOptions = { strings: [text], config: rules };
    let result: any[][];
    mdlint(lintOptions, (_, lintResult) => {
        result = lintResult;
    });
    const problems = result[0].map(r => {
        const range = r.errorRange === null ? [0, 0] : r.errorRange;
        const from = CodeMirror.Pos(r.lineNumber - 1, range[0]);
        const to = CodeMirror.Pos(r.lineNumber - 1, range[1]);
        const message = `[${r.ruleNames[0]}] ${r.ruleNames[1]}\n${r.ruleDescription}`;
        const severity = 'error';
        return { from, to, message, severity };
    });
    return problems;
});
