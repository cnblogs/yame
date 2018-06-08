import * as React from 'jsx-dom';
import styleContent from './style.less';

const test = <p>test</p>;

console.log(test);
console.log(styleContent);
class Yame extends HTMLElement {
    static TagName = 'yame';
    static init = () => {
        if (!window.customElements.get(Yame.TagName)) {
            const style = <style>{styleContent}</style>;
            window.customElements.define(Yame.TagName, Yame);
            document.head.appendChild(style);
        }
    }
}



export default Yame;
