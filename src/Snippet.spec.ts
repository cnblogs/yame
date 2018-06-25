import { Snippet } from './Snippet';
import { expect } from 'chai';

describe('Snippet', function () {
    describe('when parse "var $1 = $0"', function () {
        const snippet = new Snippet(['var $1 = $0']);
        const { tokens } = snippet.parseBody();
        it('should have 4 tokens', () => {
            expect(tokens.length).to.equal(4);
        });
    });
    describe('when parse "const $$ = require(\'$1\')$0"', () => {
        const snippet = new Snippet(['const $$0 = require(\'$1\')$0']);
        const { tokens } = snippet.parseBody();
        it('should have 6 tokens', () => {
            expect(tokens.length).to.eq(6);
            const contents = tokens.map(t => t.content);
            expect(contents[0]).to.eq('const ');
            expect(contents[1]).to.eq('$');
            expect(contents[2]).to.eq('0 = require(\'');
            expect(contents[3]).to.eq('$1');
            expect(contents[4]).to.eq('\')');
            expect(contents[5]).to.eq('$0');
        });
    });

    describe('parse "$1 test\\n[$2]($3)$0"', () => {
        const snippet = new Snippet(['$1 test', '[$2]($3)$0']);
        const { tokens } = snippet.parseBody();
        const contents = tokens.map(t => t.content);
        it('should have 9 tokens', () => {
            expect(tokens.length).to.eq(9);
            expect(contents[0]).to.eq('$1');
            expect(contents[1]).to.eq(' test');
            expect(contents[2]).to.eq('\n');
            expect(contents[3]).to.eq('[');
            expect(contents[4]).to.eq('$2');
            expect(contents[5]).to.eq('](');
            expect(contents[6]).to.eq('$3');
            expect(contents[7]).to.eq(')');
            expect(contents[8]).to.eq('$0');
        });
    });
});
