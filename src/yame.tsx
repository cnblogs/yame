import * as React from 'jsx-dom';

import * as CodeMirror from 'codemirror';
import 'codemirror/mode/markdown/markdown.js';
import * as marked from 'marked';
import { debounceTime, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import * as styleContent from './style.less';
import * as cmScoped from './codemirror-scoped.less';

class Yame extends HTMLElement {
    static TagName = 'ya-markdown';
    hostEl: Yame;
    editorHost: HTMLDivElement;
    previewHost: HTMLDivElement;
    $editorChanges = new Subject<string>();
    preview$: Observable<string>;

    // input attributes
    hljs: boolean;

    static register = () => {
        if (!window.customElements.get(Yame.TagName)) {
            window.customElements.define(Yame.TagName, Yame);
        }
    }

    constructor() {
        super();
        this.init();
    }

    bindAttr() {
        const inputHljs = this.getAttribute('hljs');
        this.hljs = inputHljs === 'true';
    }

    applyRx() {
        this.preview$ = this.$editorChanges.pipe(
            debounceTime(200),
            map(code => {
                return marked(code);
            })
        );
    }

    subscribe() {
        this.preview$.subscribe(result => {
            this.previewHost.innerHTML = result;
        });
    }

    render() {
        return <div class='ya-markdown'>
            <div class='yame-container'>
                <style>{cmScoped}</style>
                <style>{styleContent}</style>
                <div class='editor'>
                    <div class='editor-host' ref={r => this.editorHost = r}></div>
                </div>
                <div ref={r => this.previewHost = r} class='preview'></div></div>
        </div>;
    }

    init() {
        // setup marked
        marked.setOptions({
            renderer: new marked.Renderer(),
            pedantic: false,
            gfm: true,
            tables: true,
            breaks: true,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });
        // attach shadow root
        this.attachShadow({ mode: 'open' });
        this.hostEl = this.shadowRoot.host as Yame;
        // render elements
        const elms = this.render();
        this.shadowRoot.appendChild(elms);
        // create editor
        const editor = CodeMirror(this.editorHost, {
            lineNumbers: true,
            mode: 'markdown'
        });
        editor.on('change', e => {
            this.$editorChanges.next(e.getValue());
        });
        this.applyRx();
        this.subscribe();
        // 在 Chrome 中，必须手动调用这个函数，使得编辑器能够正确渲染
        editor.refresh();
    }
}

window['YameInit'] = Yame.register;

export default Yame;
