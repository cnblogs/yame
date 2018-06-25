import { Snippet } from './Snippet';

/**
 * insert snippet into editor, and bind related event listener
 *
 * @param {CodeMirror.Editor} cm
 * @param {Snippet} snippet
 */
const insertSnippet = (cm: CodeMirror.Editor, snippet: Snippet) => {
    const cursor = cm.getCursor();
    const result = snippet.insertInto(cursor);
    cm.replaceRange(result.text, cursor);
    // transfrom position to textmarker
    const markers = result.cursorSeq.map(p => {
        return cm.markText(p.pos.from, p.pos.to, {
            className: 'yame-snippet-var',
            inclusiveRight: true,
            inclusiveLeft: true
        });
    });
    // select first template var
    const firstPostion = markers[0].find();
    setTimeout(() => {
        cm.setSelection(firstPostion.from, firstPostion.to);
    }, 0);
    let cnt = 0;
    const tabMap = {
        Tab: () => { // when tab pressed
            const marker = markers[cnt];
            if (cnt !== markers.length - 1) { // if it is not the last template var
                // select the next template var
                const nextMarker = markers[cnt + 1];
                const nextPos = nextMarker.find();
                if (nextPos) {
                    setTimeout(() => {
                        cm.setSelection(nextPos.from, nextPos.to);
                    }, 0);
                }
                cnt++;
            } else { // if it is the last template var
                // remove keymap and set cursor to it right side
                cm.removeKeyMap(tabMap);
                const pos = marker.find();
                setTimeout(() => {
                    cm.setCursor(pos.to);
                }, 0);
            }
            marker.clear();
        }
    };
    cm.addKeyMap(tabMap);
};

const insertLink = (cm: CodeMirror.Editor) => {
    const link = new Snippet(['[$2]($1)$3']);
    insertSnippet(cm, link);
};

const wrapWithQuote = (cm: CodeMirror.Editor) => {
    const quote = new Snippet(['> $1']);
    insertSnippet(cm, quote);
};

const insertImgLink = (cm: CodeMirror.Editor) => {
    const img = new Snippet(['![$2]($1)$3']);
    insertSnippet(cm, img);
};

const registerKeymap = (cm: CodeMirror.Editor) => {
    cm.addKeyMap({
        'Ctrl-L': insertLink,
        'Ctrl-Q': wrapWithQuote,
        'Ctrl-P': insertImgLink
    });
};

export default registerKeymap;
