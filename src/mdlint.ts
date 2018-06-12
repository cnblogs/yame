import * as CodeMirror from 'codemirror';
import * as mdlint from 'markdownlint-no-fs';

console.log(mdlint);
CodeMirror.registerHelper('lint', 'markdown', function (text, options) {
    const lintOptions = { strings: [text] };
    let result;
    mdlint(lintOptions, (_, lintResult) => {
        result = lintResult;
    });
    console.log(result);
});
