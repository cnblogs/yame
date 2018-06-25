interface ISnippetLexeme {
    type: 'var' | 'string' | '$';
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

export class Snippet {
    static varToken = /^\$$/;
    static numberToken = /^[0-9]$/;
    static otherToken = /^[^$]*$/;
    insertInto(cm: CodeMirror.Doc, pos: CodeMirror.Position) {
        const line = cm.getLineHandle(pos.line);
    }

    public parseBody() {
        const cursorSeq: number[] = [];
        const tokens: ISnippetLexeme[] = [];
        for (let i = 0; i < this.body.length; i++) {
            let state: 0 | 1 | 2 | 3 | 4 | 5 = 1;
            let begin = 0;
            for (let end = 0; end <= this.body[i].length; end++) {
                const str = this.body[i].substring(begin, end);
                if (state === 0) { // token accpeted, then start a new trun;
                    state = 1;
                }
                switch (state) {
                    case 1:
                        if (Snippet.varToken.test(str)) {
                            state = 2; // $
                            begin = end; // accpect the leading $ and expect $ or number;
                            tokens.push({
                                type: '$', content: '$',
                                position: {
                                    from: { line: i, ch: begin },
                                    to: { line: i, ch: end }
                                }
                            });
                        } else if (Snippet.otherToken.test(str)) {
                            state = 5; // other string
                        }
                        break;
                    case 2:
                        if (Snippet.varToken.test(str)) {
                            state = 3; // $$
                            begin = end;
                            tokens.push({
                                type: 'string', content: '$',
                                position: {
                                    from: { line: i, ch: begin },
                                    to: { line: i, ch: end }
                                }
                            });
                            state = 0; // accept
                        } else if (Snippet.numberToken.test(str)) {
                            state = 4; // $n
                            begin = end;
                            cursorSeq.push(parseInt(str, 10));
                            tokens.push({
                                type: 'var', content: str,
                                position: {
                                    from: { line: i, ch: begin },
                                    to: { line: i, ch: end }
                                }
                            });
                            state = 0; // accept
                        } else {
                            throw Error('Expected "$" or number');
                        }
                        break;
                    case 5:
                        if (Snippet.otherToken.test(str) === false) {
                            end--;
                            const tokenContent = this.body[i].substring(begin, end);
                            begin = end;
                            tokens.push({
                                type: 'string', content: tokenContent,
                                position: {
                                    from: { line: i, ch: begin },
                                    to: { line: i, ch: end }
                                }
                            });
                            state = 0;
                        }
                        break;
                }
            }
            if (state !== 0) { // parse complete
                throw Error('Invalid template');
            }
            tokens.push({
                type: 'string', content: '\n',
                position: {
                    from: { line: i, ch: this.body.length },
                    to: { line: i, ch: this.body.length }
                }
            });
        }
        return { tokens, cursorSeq };
    }

    constructor(public body: string[], public prefix?: string) {
    }
}
