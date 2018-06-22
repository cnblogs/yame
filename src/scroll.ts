import { fromEvent } from 'rxjs';
import { takeUntil, map, distinctUntilChanged } from 'rxjs/operators';
import { LineScrolled } from './yame.service';
import Yame from './yame';

type CmChange = [CodeMirror.Editor, CodeMirror.EditorChange];
/**
* Find the first element that is visiable in container
*
* @param {Element} container
* @param {ArrayLike<Element>} items
* @returns
*/
const firstVisiable = (container: Element, items: ArrayLike<Element>, part = false) => {
    const containerBounding = container.getBoundingClientRect();
    const isItemInView = (item: Element) => {
        const itemBounding = item.getBoundingClientRect();
        if (part) {
            return itemBounding.bottom >= containerBounding.top
                && itemBounding.top <= containerBounding.bottom;
        } else {
            return itemBounding.top >= containerBounding.top
                && itemBounding.bottom <= containerBounding.bottom;
        }
    };
    return Array.from(items).find(isItemInView);
};

export const jumpInPreview = (yame: Yame) => (line: number) => {
    // 首先找到与该行号最接近的两个顶级元素
    const blocks = yame.ui.previewHost.children;
    let beginBlock: HTMLElement;
    let endBlock: HTMLElement;
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
    const scrollTarget = beginBlock.offsetTop + blockOffset - yame.ui.previewHost.offsetTop;
    // console.log({ line, beginNumber, endNumber, beginBlock });
    // 最后滚动过去
    yame.ui.previewHost.scroll(0, scrollTarget);
};

export const getDataLine = (el: Element) => {
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
export const InitScroll = (yame: Yame) => {
    const $editorScroll = fromEvent(yame.editor, 'scroll').pipe(
        takeUntil(yame.uiStore.unSub),
    );
    const $previewScroll = fromEvent(yame.ui.previewHost, 'scroll').pipe(
        takeUntil(yame.uiStore.unSub),
    );
    $editorScroll.subscribe(() => {
        // 编辑器滚动时，获取显示在第一行的代码的行号
        const linesWrapper = yame.ui.editorHost.querySelector('.CodeMirror-code');
        const firstLineDom = firstVisiable(yame.ui.editorHost, linesWrapper.children);
        if (!firstLineDom) {
            return;
        }
        const firstLine: HTMLDivElement = firstLineDom.querySelector('.CodeMirror-linenumber');
        const firstLineNumber = parseInt(firstLine.innerText, 10);

        yame.uiStore.send(new LineScrolled({ origin: 'src', line: firstLineNumber }));
    });

    $previewScroll.subscribe(() => {
        const firstBlock = firstVisiable(yame.ui.previewHost, yame.ui.previewHost.children, true);
        if (!firstBlock) {
            return;
        }
        const firstLine = getDataLine(firstBlock);
        let secondBlock = firstBlock;
        let secondLine = null;
        do {
            secondBlock = secondBlock.nextElementSibling;
            secondLine = getDataLine(secondBlock);
        } while (secondLine === null);
        let line = firstLine;
        const fisrtTop = firstBlock.getBoundingClientRect().top;
        const secondTop = secondBlock.getBoundingClientRect().top;
        const previewTop = yame.ui.previewHost.getBoundingClientRect().top;
        if (fisrtTop !== secondTop) {
            line = firstLine + (secondLine - firstLine) * ((previewTop - fisrtTop) / (secondTop - fisrtTop));
        }
        yame.uiStore.send(new LineScrolled({ origin: 'preview', line: Math.ceil(line) }));
    });

    // subscribe from store
    // 滚动源码时同步滚动预览
    yame.uiStore.model$.pipe(
        map(app => app.previewLine),
        distinctUntilChanged()
    ).subscribe(jumpInPreview(yame));
    yame.uiStore.model$.pipe(
        map(ui => ui.srcLine),
        distinctUntilChanged()
    ).subscribe(line => {
        const targetLineTop = yame.editor.heightAtLine(line - 1);
        const firstLineTop = yame.editor.heightAtLine(0);
        const scrollTop = targetLineTop - firstLineTop;
        yame.editor.scrollTo(0, scrollTop);
    });
};
