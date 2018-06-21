import './mdlint';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/selection/active-line.js';

import * as CodeMirror from 'codemirror';
import * as HyperMD from 'hypermd';
import * as mdit from 'markdown-it';
import { debounceTime, map, distinct, takeUntil, filter, merge, distinctUntilChanged } from 'rxjs/operators';
import * as React from 'jsx-dom';

import * as cmScoped from './styles/codemirror-scoped.less';
import * as cmLint from './styles/lint.less';
import * as styleContent from './styles/style.less';
import * as yameFont from './styles/yame-font.less';
import { ToggleHmd, YameUIService, TogglePreview, YameAppService, UpdateSrc, LineScrolled } from './yame.service';
import mdLinenumber from './markdown-it-linenumber';
import { fromEvent } from 'rxjs';


window['CodeMirror'] = CodeMirror;

const md = mdit({
    html: true
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
    appStore = new YameAppService(true);

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
    }

    subscribe() {
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
        ).subscribe(html => {
            this.ui.previewHost.innerHTML = html;
        });
        // 滚动源码时同步滚动预览
        this.uiStore.model$.pipe(
            map(app => app.previewLine),
            distinctUntilChanged()
        ).subscribe(line => {
            // 首先找到与该行号最接近的两个顶级元素
            const blocks = this.ui.previewHost.children;
            let beginBlock: HTMLElement;
            let endBlock: HTMLElement;
            const getDataLine = (el: Element) => {
                let dataLine = el.getAttribute('data-line');
                if (dataLine === null) { // data-line attr not found on the element, then find on it's children
                    const inner = el.querySelector('[data-line]');
                    if (inner !== null) {
                        dataLine = inner.getAttribute('data-line');
                    }
                }
                if (dataLine === null) { // data-line attr not found on it's children, then find on it's sibling
                    const next = el.nextElementSibling;
                    if (next !== null) {
                        dataLine = next.getAttribute('data-line');
                    }
                }
                const lineNumber = parseInt(dataLine, 10);
                return lineNumber;
            };
            if (blocks.length === 0) {
                return;
            }

            for (let i = 0; i < blocks.length; i++) {
                const el = blocks.item(i);
                const lineNumber = getDataLine(el);
                if (lineNumber <= line) {
                    beginBlock = el as HTMLElement;
                    endBlock = beginBlock.nextElementSibling ? beginBlock.nextElementSibling as HTMLElement : beginBlock;
                } else {
                    break;
                }
            }
            if (beginBlock === undefined || endBlock === undefined) {
                return;
            }
            // 然后在这两个元素之间进行偏移，找到大概的位置，
            const beginNumber = getDataLine(beginBlock);
            const endNumber = getDataLine(endBlock);
            const lineOffsetDelta = endNumber === beginNumber ? 0 : (line - beginNumber) / (endNumber - beginNumber);
            const blockOffset = (endBlock.offsetTop - beginBlock.offsetTop) * lineOffsetDelta;
            const scrollTarget = beginBlock.offsetTop + blockOffset - this.ui.previewHost.offsetTop;
            // 最后滚动过去
            this.ui.previewHost.scroll(0, scrollTarget);
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
        type CmChange = [CodeMirror.Editor, CodeMirror.EditorChange];
        const editorChange$ = fromEvent<CmChange>(this.editor, 'change').pipe(
            debounceTime(200)
        );
        editorChange$.subscribe(([obj, event]) => {
            this.appStore.send(new UpdateSrc(obj.getValue()));
        });
        fromEvent(this.editor, 'scroll').pipe(
            takeUntil(this.uiStore.unSub),
            debounceTime(10),
            merge(editorChange$),
        ).subscribe(() => {
            // 编辑器滚动时，获取显示在第一行的代码的行号
            const linesWrapper = this.ui.editorHost.querySelector('.CodeMirror-code');
            const lineDOMs = Array.from(linesWrapper.children);
            const wrapperBounding = this.ui.editorHost.getBoundingClientRect();
            const isLineInView = ((line: HTMLElement) => {
                const lineBounding = line.getBoundingClientRect();
                return lineBounding.top >= wrapperBounding.top;
            });
            const firstLineDom = lineDOMs.find(isLineInView);
            if (firstLineDom === null) {
                return;
            }
            const firstLine: HTMLDivElement = firstLineDom.querySelector('.CodeMirror-linenumber');
            const firstLineNumber = parseInt(firstLine.innerText, 10);

            this.uiStore.send(new LineScrolled({ origin: 'src', line: firstLineNumber }));
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
