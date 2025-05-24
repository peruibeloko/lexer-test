import { Token } from "./Token.ts";
import {
  DOUBLE_SYMBOLS,
  RESERVED_WORDS,
  SINGLE_SYMBOLS,
  TokenTypes,
} from "./TokenTypes.ts";

let source = "";

let start = 0;
let current = 0;
let line = 1;
const tokens: Token[] = [];

const isDone = () => current >= source.length;
const consume = () => source[current++];
const lexeme = () => source.slice(start, current);

const emit = (type: symbol) => {
  if (type === TokenTypes.EOF) tokens.push(new Token(type, "", line));
  else tokens.push(new Token(type, lexeme(), line));
};

const peek = (n: number = 0) => {
  if (isDone()) return "\0";
  return source[current + n];
};

const isNextChar = (char: string) => {
  if (isDone()) return false;
  if (source[current] !== char) return false;

  current++;
  return true;
};

export function tokenize(fileContents: string) {
  source = fileContents;

  while (!isDone()) {
    start = current;

    const char = consume();

    if (char === "\n") {
      line++;
      continue;
    }

    if (/\s/.test(char)) {
      continue;
    }

    let type;

    type = SINGLE_SYMBOLS.get(char);
    if (type) {
      emit(type);
      continue;
    }

    type = DOUBLE_SYMBOLS.get(char);
    if (type) {
      if (isNextChar(type.secondChar)) {
        if (type.typeDouble === TokenTypes.SLASH_SLASH) {
          while (peek() !== "\n") consume();
          continue;
        }

        emit(type.typeDouble);
        continue;
      }

      emit(type.typeSingle);
      continue;
    }

    if (char === '"') {
      while (peek() !== '"') consume();
      emit(TokenTypes.STRING);
      continue;
    }

    if (/[a-z_]/i.test(char)) {
      while (/[a-z0-9_]/i.test(peek())) consume();

      const id = lexeme();
      const keywordType = RESERVED_WORDS.get(id);

      if (keywordType) {
        emit(keywordType);
        continue;
      }

      emit(TokenTypes.IDENTIFIER);
      continue;
    }

    if (/[1-9]/.test(char)) {
      while (/\d/.test(peek())) consume();

      if (peek() === "." && /\d/.test(peek(1))) {
        consume();
        while (/\d/.test(peek())) consume();
      }

      emit(TokenTypes.NUMBER);
      continue;
    }

    emit(TokenTypes.UNKNOWN);
  }

  emit(TokenTypes.EOF);
  return tokens;
}
