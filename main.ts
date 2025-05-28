import { Lexer } from './lexer.ts';
import { RegexLexer } from './regex_lexer.ts';

const src = Deno.readTextFileSync('./test/scanning/strings.lox');
const scannedTokens = new Lexer(src).tokenize();
const matchedTokens = new RegexLexer(src).tokenize();

for (const token of scannedTokens) {
  console.log(token.toString());
}

for (const token of matchedTokens) {
  console.log(token.toString());
}
