// import * as CodeMirror from 'codemirror';

interface ISnippetLexeme {
    type: 'var' | 'string';
    content: string;
    position: {
        from: IPosition;
        to: IPosition;
    };
}
interface IPosition {
    line: number;
    ch: number;
}
type SnippetParserState = 0 | 1 | 2 | 3 | 4 | 5;


export class Snippet {
    static varToken = /^\$$/;
    static numberToken = /^[0-9]$/;
    static otherToken = /^[^$]*$/;
    insertInto(pos: CodeMirror.Position) {
        const { tokens } = this.parseBody();
        // cursor movements
        let varCnt = 0;
        let chOffset = pos.ch;
        let lastLine = pos.line;
        const offsetPositions = [];
        console.log(tokens);
        for (const token of tokens) {
            if (token.content === '$') {
                varCnt++;
                continue;
            }
            if (token.type === 'var') {
                const line = pos.line + token.position.from.line;
                if (lastLine !== line) { // newline
                    chOffset = 0;
                    varCnt = 0;
                    lastLine = line;
                }
                const fromCh = chOffset + token.position.from.ch - varCnt;
                const toCh = chOffset + token.position.to.ch - varCnt + 1;
                const cursorPos = {
                    pos: {
                        from: { line, ch: fromCh },
                        to: { line, ch: toCh }
                    },
                    order: parseInt(token.content.substr(1), 10)
                };
                offsetPositions.push(cursorPos);
            }
        }
        offsetPositions.sort((a, b) => a.order - b.order);
        const text = tokens.map(t => t.content).join('');
        return { cursorSeq: offsetPositions, text };
    }

    public parseBody() {
        // check if a state is accetable, only a acceptable state can stop parsing
        const isAcceptable = (state: number) => {
            return [0, 3, 4, 5].indexOf(state) >= 0;
        };
        const tokens: ISnippetLexeme[] = [];
        for (let i = 0; i < this.body.length; i++) {
            let state: SnippetParserState = 1;
            let begin = 0;
            const template = this.body[i];
            for (let end = 0; end < template.length; end++) {
                if (state === 0) { // token accepted, then start a new trun;
                    state = 1;
                }
                switch (state) {
                    case 1: // start parsing
                        if (Snippet.varToken.test(template[end])) {
                            state = 2; // $
                            begin = end;
                        } else if (Snippet.otherToken.test(template[end])) {
                            state = 5; // other string
                            begin = end;
                        }
                        break;
                    case 2: // $
                        if (Snippet.varToken.test(template[end])) {
                            state = 3; // $$
                            tokens.push({
                                type: 'string', content: '$',
                                position: {
                                    from: { line: i, ch: begin },
                                    to: { line: i, ch: end }
                                }
                            });
                            begin = end;
                            state = 0; // accept
                        } else if (Snippet.numberToken.test(template[end])) {
                            state = 4; // $n
                            const str = template.substring(begin, end + 1);
                            tokens.push({
                                type: 'var', content: str,
                                position: {
                                    from: { line: i, ch: begin },
                                    to: { line: i, ch: end }
                                }
                            });
                            begin = end;
                            state = 0; // accept
                        } else {
                            throw Error('Expected "$" or number');
                        }
                        break;
                    case 5: // plain text
                        if (Snippet.otherToken.test(template[end]) === false || end === template.length - 1) {
                            if (begin === end) {
                                break; // ignore empty string
                            }
                            let str = template.substring(begin, end);
                            if (end !== this.body[i].length - 1) { // next token start
                                end--;
                            } else { // meet end of line
                                str = template.substring(begin, end + 1);
                            }
                            tokens.push({
                                type: 'string', content: str,
                                position: {
                                    from: { line: i, ch: begin },
                                    to: { line: i, ch: end }
                                }
                            });
                            begin = end;
                            state = 0;
                        }
                        break;
                }
            }
            if (isAcceptable(state) === false) { // parse complete
                throw Error('Invalid template');
            }
            if (i !== this.body.length - 1) {
                tokens.push({
                    type: 'string', content: '\n',
                    position: {
                        from: { line: i, ch: this.body.length },
                        to: { line: i, ch: this.body.length }
                    }
                });
            }
        }
        return { tokens };
    }

    constructor(public body: string[], public prefix?: string) {
    }
}
