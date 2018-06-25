import { Snippet } from './Snippet';

const insertLink = (cm: CodeMirror.Editor) => {
    const cursor = cm.getCursor();
    const tokens = cm.getLineTokens(cursor.line);
    const link = new Snippet(['($2)[$1]$0']);
    link.insertInto(cursor);
    console.log(tokens);
};

const wrapWithQuote = (cm: CodeMirror.Editor) => {
    console.log('wrap with quote');
};

const insertImgLink = (cm: CodeMirror.Editor) => {
    console.log('insert image link');
};

const registerKeymap = (cm: CodeMirror.Editor) => {
    cm.addKeyMap({
        'Ctrl-L': insertLink,
        'Ctrl-Q': wrapWithQuote,
        'Ctrl-P': insertImgLink
    });
};

export default registerKeymap;
