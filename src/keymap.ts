import { Snippet } from './Snippet';

const insertLink = (cm: CodeMirror.Editor) => {
    const cursor = cm.getCursor();
    const link = new Snippet(['[$2]($1)$3']);
    const result = link.insertInto(cursor);
    cm.replaceRange(result.text, cursor);
    const markers = result.cursorSeq.map(p => {
        console.log(p);
        return cm.markText(p.pos.from, p.pos.to, {
            className: 'yame-snippet-var',
            inclusiveRight: true,
            inclusiveLeft: true
        });
    });
    for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];

        const handler = () => {
            const pos = marker.find();
            marker.off('beforeCursorEnter', handler);
            cm.setSelection(pos.from, pos.to);
            setTimeout(() => {
                cm.setSelection(pos.to, pos.from);
            }, 0);
            const tabMap = {
                Tab: () => {
                    cm.removeKeyMap(tabMap);
                    marker.clear();
                    if (i !== markers.length - 1) {
                        cm.setCursor(markers[i + 1].find().from);
                    }
                }
            };
            cm.addKeyMap(tabMap);
        };
        marker.on('beforeCursorEnter', handler);
    }
    cm.setCursor(markers[0].find().from);
    console.log(markers);
    console.log(result);
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
