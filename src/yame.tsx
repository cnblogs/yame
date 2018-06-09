import * as React from 'jsx-dom';

import { CodeMirror } from './codemirror-import';
import styleContent from './style.less';

class Yame extends HTMLElement {
    static TagName = 'ya-markdown';
    hostEl: Yame;
    editorHost: HTMLTextAreaElement;

    static register = () => {
        if (!window.customElements.get(Yame.TagName)) {
            const style = <style>{styleContent}</style>;
            window.customElements.define(Yame.TagName, Yame);
            document.head.appendChild(style);
        }
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.hostEl = this.shadowRoot.host as Yame;
        this.init();
    }

    render() {
        return <div>
            <textarea ref={r => this.editorHost = r}></textarea>
        </div>;
    }

    init() {
        const elms = this.render();
        console.log(elms);
        this.shadowRoot.appendChild(elms);
        CodeMirror.fromTextArea(this.editorHost, {
            lineNumbers: true,
            mode: 'markdown'
        });
    }
}

window['YameInit'] = Yame.register;

export default Yame;
