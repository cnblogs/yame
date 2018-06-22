import * as CM from 'codemirror';
import 'codemirror/addon/runmode/runmode.js';

const highlighter = (str: string, lang: string) => {
    const CodeMirror = CM as any;
    const tempNode = document.createElement('div');
    const mode = CM.findModeByName(lang);
    if (!mode) {
        return str;
    }
    CodeMirror.runMode(str, lang, tempNode);
    return tempNode.innerHTML;
};

export default highlighter;
