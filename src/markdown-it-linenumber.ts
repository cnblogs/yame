import { MarkdownIt } from 'markdown-it';

const mdLinenumber = (md: MarkdownIt, opts) => {
    md.core.ruler.push('add_linenumber', state => {
        const { tokens } = state;
        const topLevelTokens = tokens.filter(token => token.level === 0 && token.type.endsWith('_close') === false);
        topLevelTokens.forEach(token => {
            if (token.type === 'html_block') {
                const content = token.content.replace(/\n/g, `<input hidden data-line="${token.map[0] + 1}">`);
                token.content = content;
            } else {
                const lineNumber = token.map[0] + 1;
                token.attrPush(['data-line', lineNumber]);
            }
        });
    });
};

export default mdLinenumber;
