import { Snippet } from './Snippet';
import { expect } from 'chai';
import { couldStartTrivia } from 'typescript';

describe('Snippet', function () {
    describe('when parse "var $1 = $0"', function () {
        const snippet = new Snippet(['var $1 = $0']);
        const { tokens, cursorSeq } = snippet.parseBody();
        it('should have 7 tokens', () => {
            expect(tokens.length).to.equal(7);
        });
        it('should have 2 cursors', () => {
            expect(cursorSeq.length).to.equal(2);
            expect(cursorSeq[0]).eq(1);
            expect(cursorSeq[1]).eq(0);
        });
    });
    describe('when parse "const $$ = require(\'$1\')$0"', () => {
        const snippet = new Snippet(['const $$0 = require(\'$1\')$0']);
        const { tokens, cursorSeq } = snippet.parseBody();
        it('should have 10 tokens', () => {
            expect(tokens.length).to.eq(10);
            const contents = tokens.map(t => t.content);
            expect(contents[0]).to.eq('const ');
            expect(contents[1]).to.eq('$');
            expect(contents[2]).to.eq('$');
            expect(contents[3]).to.eq('0 = require(\'');
            expect(contents[4]).to.eq('$');
            expect(contents[5]).to.eq('1');
            expect(contents[6]).to.eq('\')');
            expect(contents[7]).to.eq('$');
            expect(contents[8]).to.eq('0');
            expect(contents[9]).to.eq('\n');
        });
        it('should have 2 cursors', () => {
            expect(cursorSeq.length).to.eq(2);
            expect(cursorSeq[0]).eq(1);
            expect(cursorSeq[1]).eq(0);
        });
    });
});
