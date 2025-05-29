import { Lexer } from './lexer.ts';

const src = Deno.readTextFileSync('./test/scanning/whitespace.lox');
const matchedTokens = new Lexer(src).tokenize();

for (const token of matchedTokens) {
  console.log(token.toString());
}
