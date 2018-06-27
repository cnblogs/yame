import { Snippet, insertSnippet } from './Snippet';
import * as CodeMirror from 'codemirror';

const insertLink = (cm: CodeMirror.Editor) => {
    const link = new Snippet(['[$2]($1)$0']);
    insertSnippet(cm, link);
};

const insertImgLink = (cm: CodeMirror.Editor) => {
    const img = new Snippet(['![$2]($1)$0']);
    insertSnippet(cm, img);
};


const expandTab = (cm: CodeMirror.Editor) => {
    const expansions: Snippet[] = [
        new Snippet(['[$2]($1)$0'], ';l'), // link
        new Snippet(['![$2]($1)$0'], ';p'), // images
        new Snippet(['```$1', '$0', '```'], ';cb'), // code block
        new Snippet(['* [x] $0'], ';x'), // task complete
        new Snippet(['* [ ] $0'], '; '), // task incomplete
    ];
    const cursor = cm.getCursor();
    const lineText = cm.getLine(cursor.line);
    const beforeCursorText = lineText.substring(0, cursor.ch);
    console.log(beforeCursorText);
    let handled = false;
    for (const snip of expansions) {
        if (beforeCursorText.endsWith(snip.prefix)) {
            // remove prefix
            const from = {
                line: cursor.line,
                ch: cursor.ch - snip.prefix.length
            };
            cm.replaceRange('', from, cursor);
            insertSnippet(cm, snip);
            handled = true;
            break;
        }
    }
    if (handled === false) {
        return CodeMirror.Pass;
    }
};

const registerKeymap = (cm: CodeMirror.Editor) => {
    cm.addKeyMap({
        'Ctrl-L': insertLink,
        'Ctrl-P': insertImgLink,
        Tab: expandTab
    });
};

export default registerKeymap;
