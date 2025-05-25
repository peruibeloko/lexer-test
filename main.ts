import { Lexer } from './lexer.ts';

const src = Deno.readTextFileSync('./test/scanning/strings.lox');
const tokens = new Lexer(src).tokenize();

for (const token of tokens) {
  console.log(`[${token.type.description}] ${token.lexeme}`);
}
