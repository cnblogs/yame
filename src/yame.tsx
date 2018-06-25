import './mdlint';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/selection/active-line.js';

import * as React from 'jsx-dom';
import * as CodeMirror from 'codemirror';
import * as HyperMD from 'hypermd';
import * as mdit from 'markdown-it';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

import mdLinenumber from './markdown-it-linenumber';
import * as cmScoped from './styles/codemirror-scoped.less';
import * as cmLint from './styles/lint.less';
import * as styleContent from './styles/style.less';
import * as yameFont from './styles/yame-font.less';
import { ToggleHmd, TogglePreview, UpdateSrc, YameAppService, YameUIService } from './yame.service';
import highlighter from './syntaxHighlighter';
import { jumpInPreview, InitScroll } from './scroll';
import registerKeymap from './keymap';

window['CodeMirror'] = CodeMirror;

const md = mdit({
    html: true,
    highlight: highlighter
}).use(mdLinenumber);

class Yame extends HTMLElement {
    static TagName = 'ya-markdown';
    static WithPolyfill = true;
    hostEl: Yame;
    ui: {
        editorHost?: HTMLDivElement,
        editorTextArea?: HTMLTextAreaElement,
        previewHost?: HTMLDivElement
    } = {};
    editor: CodeMirror.Editor;
    uiStore = new YameUIService(true);
    appStore = new YameAppService(false);

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
        // 同步滚动
        InitScroll(this);
    }

    subscribe() {
        // DOM 事件
        type CmChange = [CodeMirror.Editor, CodeMirror.EditorChange];
        const editorChange$ = fromEvent<CmChange>(this.editor, 'change').pipe(
            debounceTime(200)
        );
        editorChange$.subscribe(([obj, event]) => {
            this.appStore.send(new UpdateSrc(obj.getValue()));
        });

        // 应用事件
        // 切换 HMD
        this.uiStore.model$.pipe(
            map(ui => ui.enableHmd)
        ).subscribe(enabled => {
            if (enabled) {
                HyperMD.switchToHyperMD(this.editor, '');
            } else {
                HyperMD.switchToNormal(this.editor);
            }
        });
        // 切换预览
        this.uiStore.model$.pipe(
            map(ui => ui.enablePreview)
        ).subscribe(enabled => {
            this.ui.previewHost.style.display = enabled ? 'block' : 'none';
        });

        // 自动更新预览
        this.appStore.model$.pipe(
            map(app => app.src),
            filter(_ => this.uiStore.model.enablePreview === true),
            map(code => {
                return md.render(code);
            })
        ).subscribe((html) => {
            this.ui.previewHost.innerHTML = html;
            // 更新预览后可能需要更新预览的滚动位置
            jumpInPreview(this)(this.uiStore.model.previewLine);
        });
    }

    toggleHmd() {
        this.uiStore.send(new ToggleHmd({}));
    }
    toogglePreview() {
        this.uiStore.send(new TogglePreview({}));
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
                            <span className='toggle-btn' onClick={() => this.toogglePreview()}>
                                <i className='icon-columns'></i>
                            </span>
                        </div>
                    </div>
                    <div class='editor-host' ref={r => this.ui.editorHost = r}>
                        <textarea ref={r => this.ui.editorTextArea = r}></textarea>
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
        this.editor = HyperMD.fromTextArea(this.ui.editorTextArea, {
            lint: {
                disableMdRules: ['MD002', 'MD033', 'MD041', 'MD013', 'MD034', 'MD004']
            },
            mode: 'hypermd',
            gutters: ['CodeMirror-lint-markers'],
            hmdModeLoader: true,
            styleActiveLine: true,
            lineWrapping: true
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
        registerKeymap(this.editor);
    }
}

window['YameInit'] = Yame.register;

export default Yame;
