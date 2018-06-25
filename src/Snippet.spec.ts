import { Snippet } from './Snippet';
import { expect } from 'chai';

describe('Snippet', function () {
    describe('when parse "var $1 = $0"', function () {
        const snippet = new Snippet(['var $1 = $0']);
        const { lexemes, cursorSeq } = snippet.parseBody();
        it('should have 6 tokens', () => {
            expect(lexemes.length).to.equal(6);
        });
        it('should have 2 cursors', () => {
            expect(cursorSeq.length).to.equal(2);
            expect(cursorSeq[0]).eq(1);
            expect(cursorSeq[1]).eq(0);
        });
    });
    describe('when parse "const $$ = require(\'$1\')$0"', () => {
        const snippet = new Snippet(['const $$0 = require(\'$1\')$0']);
        const { lexemes, cursorSeq } = snippet.parseBody();
        it('should have 9 tokens', () => {
            expect(lexemes.length).to.eq(9);
            const contents = lexemes.map(t => t.content);
            expect(contents[0]).to.eq('const ');
            expect(contents[1]).to.eq('$');
            expect(contents[2]).to.eq('$');
            expect(contents[3]).to.eq('0 = require(\'');
            expect(contents[4]).to.eq('$');
            expect(contents[5]).to.eq('1');
            expect(contents[6]).to.eq('\')');
            expect(contents[7]).to.eq('$');
            expect(contents[8]).to.eq('0');
        });
        it('should have 2 cursors', () => {
            expect(cursorSeq.length).to.eq(2);
            expect(cursorSeq[0]).eq(1);
            expect(cursorSeq[1]).eq(0);
        });
    });

    describe('parse "$1 test\\n[$2]($3)$0"', () => {
        const snippet = new Snippet(['$1 test', '[$2]($3)$0']);
        const { lexemes, cursorSeq } = snippet.parseBody();
        const contents = lexemes.map(t => t.content);
        it('should have 13 tokens', () => {
            expect(lexemes.length).to.eq(13);
            expect(contents[0]).to.eq('$');
            expect(contents[1]).to.eq('1');
            expect(contents[2]).to.eq(' test');
            expect(contents[3]).to.eq('\n');
            expect(contents[4]).to.eq('[');
            expect(contents[5]).to.eq('$');
            expect(contents[6]).to.eq('2');
            expect(contents[7]).to.eq('](');
            expect(contents[8]).to.eq('$');
            expect(contents[9]).to.eq('3');
            expect(contents[10]).to.eq(')');
            expect(contents[11]).to.eq('$');
            expect(contents[12]).to.eq('0');
        });

        it('should have 4 cursors', () => {
            expect(cursorSeq.length).to.eq(4);
        });
    });
});
