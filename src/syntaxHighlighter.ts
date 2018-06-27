import * as CM from 'codemirror';
import 'codemirror/addon/runmode/runmode.js';

const highlighter = (str: string, lang: string) => {
    const CodeMirror = CM as any;
    const tempNode = document.createElement('div');
    const mode = CM.findModeByName(lang);
    console.log(mode);
    if (!mode) {
        return str;
    }
    console.log(CodeMirror.runMode);
    CodeMirror.runMode(str, lang, tempNode);
    console.log(tempNode.innerHTML);
    return tempNode.innerHTML;
};

export default highlighter;
