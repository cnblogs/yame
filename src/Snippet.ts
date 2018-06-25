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
type SnippetParserState = 0 | 1 | 2 | 3 | 4 | 5;


export class Snippet {
    static varToken = /^\$$/;
    static numberToken = /^[0-9]$/;
    static otherToken = /^[^$]*$/;
    insertInto(cm: CodeMirror.Doc, pos: CodeMirror.Position) {
        const line = cm.getLineHandle(pos.line);
    }

    public parseBody() {
        // check if a state is accetable, only a acceptable state can stop parsing
        const isAcceptable = (state: number) => {
            return [0, 3, 4, 5].indexOf(state) >= 0;
        };
        const cursorSeq: number[] = [];
        const lexemes: ISnippetLexeme[] = [];
        for (let i = 0; i < this.body.length; i++) {
            let state: SnippetParserState = 1;
            let begin = 0;
            for (let end = 1; end <= this.body[i].length; end++) {
                const str = this.body[i].substring(begin, end);
                if (state === 0) { // token accepted, then start a new trun;
                    state = 1;
                }
                switch (state) {
                    case 1: // start parsing
                        if (Snippet.varToken.test(str)) {
                            state = 2; // $
                            begin = end; // accept the leading $ and expect '$' or number;
                            lexemes.push({
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
                    case 2: // $
                        if (Snippet.varToken.test(str)) {
                            state = 3; // $$
                            begin = end;
                            lexemes.push({
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
                            lexemes.push({
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
                    case 5: // plain text
                        if (Snippet.otherToken.test(str) === false || end === this.body[i].length) {
                            if (end !== this.body[i].length) {
                                end--;
                            }
                            if (begin === end) {
                                break; // ignore empty string
                            }
                            const tokenContent = this.body[i].substring(begin, end);
                            begin = end;
                            lexemes.push({
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
            if (isAcceptable(state) === false) { // parse complete
                throw Error('Invalid template');
            }
            if (i !== this.body.length - 1) {
                lexemes.push({
                    type: 'string', content: '\n',
                    position: {
                        from: { line: i, ch: this.body.length },
                        to: { line: i, ch: this.body.length }
                    }
                });
            }
        }
        return { lexemes, cursorSeq };
    }

    constructor(public body: string[], public prefix?: string) {
    }
}
