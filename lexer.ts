import { Token } from './Token.ts';
import { DOUBLE_SYMBOLS, RESERVED_WORDS, SINGLE_SYMBOLS, TokenTypes } from './TokenTypes.ts';

export class Lexer {
  source: string;
  start: number;
  current: number;
  line: number;
  tokens: Token[];

  constructor(src: string) {
    this.source = src;
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.tokens = [];
  }

  private isDone() {
    return this.current >= this.source.length;
  }

  private consume() {
    return this.source[this.current++];
  }

  private lexeme() {
    return this.source.slice(this.start, this.current);
  }

  private emit(type: symbol) {
    if (type === TokenTypes.EOF) this.tokens.push(new Token(type, '', this.line));
    else this.tokens.push(new Token(type, this.lexeme(), this.line));
  }

  private peek(n: number = 0) {
    if (this.isDone()) return '\0';
    return this.source[this.current + n];
  }

  private isNextChar(char: string) {
    if (this.isDone()) return false;
    if (this.source[this.current] !== char) return false;

    this.current++;
    return true;
  }

  private isEndOfLine() {
    return this.peek() === '\n' || this.isDone();
  }

  tokenize() {
    while (!this.isDone()) {
      this.start = this.current;
      const char = this.consume();

      if (char === '\n') {
        this.line++;
        continue;
      }

      if (/\s/.test(char)) {
        continue;
      }

      let type;

      type = SINGLE_SYMBOLS.get(char);
      if (type) {
        this.emit(type);
        continue;
      }

      type = DOUBLE_SYMBOLS.get(char);
      if (type) {
        if (this.isNextChar(type.secondChar)) {
          if (type.typeDouble === TokenTypes.SLASH_SLASH) {
            while (!this.isEndOfLine()) this.consume();
            continue;
          }

          this.emit(type.typeDouble);
          continue;
        }

        this.emit(type.typeSingle);
        continue;
      }

      if (char === '"') {
        while (this.peek() !== '"') {
          this.consume();
        }

        this.consume();
        this.emit(TokenTypes.STRING);
        continue;
      }

      if (/[a-z_]/i.test(char)) {
        while (/[a-z0-9_]/i.test(this.peek())) this.consume();

        const id = this.lexeme();
        const keywordType = RESERVED_WORDS.get(id);

        if (keywordType) {
          this.emit(keywordType);
          continue;
        }

        this.emit(TokenTypes.IDENTIFIER);
        continue;
      }

      if (/[1-9]/.test(char)) {
        while (/\d/.test(this.peek())) this.consume();

        if (this.peek() === '.' && /\d/.test(this.peek(1))) {
          this.consume();
          while (/\d/.test(this.peek())) this.consume();
        }

        this.emit(TokenTypes.NUMBER);
        continue;
      }

      this.emit(TokenTypes.UNKNOWN);
    }

    this.emit(TokenTypes.EOF);
    return this.tokens;
  }
}
