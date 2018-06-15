import * as React from 'jsx-dom';

import * as HyperMD from 'hypermd';
import * as CodeMirror from 'codemirror';
import 'codemirror/addon/lint/lint.js';
import './mdlint';
import * as mdit from 'markdown-it';
import { debounceTime, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';


import * as styleContent from './styles/style.less';
import * as cmScoped from './styles/codemirror-scoped.less';
import * as cmLint from './styles/lint.less';
import * as yameFont from './styles/yame-font.less';

window['CodeMirror'] = CodeMirror;

const md = mdit({
    html: true
});

class Yame extends HTMLElement {
    static TagName = 'ya-markdown';
    static WithPolyfill = true;
    hostEl: Yame;
    ui: {
        editorHost?: HTMLTextAreaElement,
        previewHost?: HTMLDivElement
    } = {};
    editor: CodeMirror.Editor;
    state = {
        enableHmd: true
    };

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
            this.ui.previewHost.innerHTML = result;
        });
    }

    toggleHmd() {
        if (this.state.enableHmd) {
            HyperMD.switchToNormal(this.editor);
        } else {
            HyperMD.switchToHyperMD(this.editor, '');
        }
        this.state.enableHmd = !this.state.enableHmd;
    }

    /**
     * Create component's DOM, will be called once on construction.
     *
     * @returns Components's DOM
     * @memberof Yame
     */
    render() {
        return <div class='ya-markdown host'>
            <div class='yame-container'>
                <style>{cmScoped}</style>
                <style>{styleContent}</style>
                {Yame.WithPolyfill ? null : <style>{cmLint}</style>}
                <div class='editor'>
                    <div className='toolbar'>
                        <div className='left'>
                            <span className='toggle-btn' onClick={() => this.toggleHmd()}>
                                <i className='icon-code'></i>
                            </span>
                        </div>
                        <div className='right'>
                            <span className='toggle-btn'>
                                <i className='icon-columns'></i>
                            </span>
                        </div>
                    </div>
                    <div class='editor-host'>
                        <textarea ref={r => this.ui.editorHost = r}></textarea>
                    </div>
                </div>
                <div ref={r => this.ui.previewHost = r} class='preview'></div></div>
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
        this.editor = HyperMD.fromTextArea(this.ui.editorHost, {
            lint: {
                disableMdRules: ['MD002', 'MD033', 'MD041', 'MD013']
            },
            mode: 'hypermd',
            gutters: ['CodeMirror-lint-markers'],
            hmdModeLoader: true,
        });
        this.editor.on('change', e => {
            this.$editorChanges.next(e.getValue());
        });
        this.applyRx();
        this.subscribe();
        // insert CodeMirror lint css to document
        document.head.appendChild(<style>{cmLint}</style>);
        document.head.appendChild(<style>{yameFont}</style>);
        setTimeout(() => {
            // after modified styles, editor should be refreshed
            this.editor.refresh();
        }, 0);
    }
}

window['YameInit'] = Yame.register;

export default Yame;
