import * as React from 'jsx-dom';

import * as CodeMirror from 'codemirror';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/addon/lint/lint.js';
import './mdlint';
import * as mdit from 'markdown-it';
import { debounceTime, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';


import * as styleContent from './style.less';
import * as cmScoped from './codemirror-scoped.less';
import * as cmLint from './lint.less';

const md = mdit({
    html: true
});

class Yame extends HTMLElement {
    static TagName = 'ya-markdown';
    static WithPolyfill = true;
    hostEl: Yame;
    editorHost: HTMLDivElement;
    previewHost: HTMLDivElement;
    $editorChanges = new Subject<string>();
    preview$: Observable<string>;

    static checkPolyfill() {
        if (window.customElements && window.customElements.define.toString().indexOf('native') >= 0) {
            Yame.WithPolyfill = false;
        }
    }
    static register = () => {
        Yame.checkPolyfill();
        (window as any).WebComponents.waitFor(() => {
            if (!window.customElements.get(Yame.TagName)) {
                window.customElements.define(Yame.TagName, Yame);
            }
        });
    }

    constructor() {
        super();
        this.init();
    }

    bindAttr() {
    }

    applyRx() {
        this.preview$ = this.$editorChanges.pipe(
            debounceTime(200),
            map(code => {
                return md.render(code);
            })
        );
    }

    subscribe() {
        this.preview$.subscribe(result => {
            this.previewHost.innerHTML = result;
        });
    }

    render() {
        console.log(Yame.WithPolyfill);
        return <div class='ya-markdown host'>
            <div class='yame-container'>
                <style>{cmScoped}</style>
                <style>{styleContent}</style>
                {Yame.WithPolyfill ? null : <style>{cmLint}</style>}
                <div class='editor'>
                    <div class='editor-host' ref={r => this.editorHost = r}></div>
                </div>
                <div ref={r => this.previewHost = r} class='preview'></div></div>
        </div>;
    }

    init() {
        // attach shadow root
        this.attachShadow({ mode: 'open' });
        this.hostEl = this.shadowRoot.host as Yame;
        // render elements
        const elms = this.render();
        this.shadowRoot.appendChild(elms);
        // create editor
        const editor = CodeMirror(this.editorHost, {
            lineNumbers: true,
            mode: 'markdown',
            lint: true,
            gutters: ['CodeMirror-lint-markers'],
        });
        editor.on('change', e => {
            this.$editorChanges.next(e.getValue());
        });
        this.applyRx();
        this.subscribe();
        // insert CodeMirror lint css to document
        document.head.appendChild(<style>{cmLint}</style>);
        editor.refresh();
    }
}

window['YameInit'] = Yame.register;

export default Yame;
