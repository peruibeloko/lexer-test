import { Lexer } from './lexer.ts';

const src = Deno.readTextFileSync('./test/scanning/strings.lox');
const [tokens, errors] = new Lexer(src).tokenize();

for (const token of tokens) {
  console.log(token.toString());
}

for (const error of errors) {
  console.log(error.message);
}
