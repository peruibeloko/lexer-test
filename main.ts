import { tokenize } from "./lexer.ts";

const src = Deno.readTextFileSync("./test_src.lox");
const tokens = tokenize(src);

for (const token of tokens) {
  console.log(`[${token.type.description}] ${token.lexeme}`);
}
