import {
  UnexpectedCharacterError,
  UnterminatedStringError,
} from './CompilerError.ts';
import {
  getRegex,
  RESERVED_WORDS,
  Token,
  TokenRegexes,
  TokenTypes,
} from './Token.ts';

export class Lexer {
  source: string;
  line: number;
  tokens: Token[];
  errors: Error[];

  constructor(src: string) {
    this.source = src;
    this.line = 1;
    this.tokens = [];
    this.errors = [];
  }

  private isDone() {
    return this.source === '';
  }

  private emitToken(type: symbol, lexeme: string) {
    this.tokens.push(new Token(type, lexeme, this.line));
  }

  private match(type: symbol) {
    const match = this.source.match(getRegex(type))?.[0];
    if (match) return match;
    return null;
  }

  private advance(n: number) {
    this.source = this.source.slice(n);
  }

  private consume(lexeme: string) {
    this.advance(lexeme.length);
  }

  private consumeNewlines() {
    while (this.source.match(/^\n/)) {
      this.line++;
      this.advance(1);
    }
  }

  private consumeWhitespace() {
    this.consumeNewlines();
    const match = this.source.match(/^[ \t]+/)?.[0];
    if (match) {
      this.consume(match);
    }
  }

  private consumeComment() {
    const comment = this.source.match(/^.*/)?.[0];
    if (comment) this.consume(comment);
    this.consumeNewlines();
  }

  private consumeString() {
    this.consume('"'); // opening quote

    let size = 0;

    while (this.source.charAt(size) !== '"' && size < this.source.length)
      size++;

    if (size === this.source.length) {
      this.errors.push(new UnterminatedStringError(this.line));
      this.advance(size);
      return;
    }

    if (size === 0) {
      this.consume('"'); // closing quote
      this.emitToken(TokenTypes.STRING, `""`);
      return;
    }

    this.emitToken(TokenTypes.STRING, `"${this.source.slice(0, size)}"`);
    this.advance(size);
    this.consume('"');
  }

  private matchToken() {
    const token = { type: TokenTypes.UNKNOWN, lexeme: '' };

    for (const [maybe_type, regex] of TokenRegexes.entries()) {
      const maybe_lexeme = this.source.match(regex)?.[0];

      if (maybe_lexeme === undefined) continue;

      // Maximum munch
      if (maybe_lexeme.length > token.lexeme.length) {
        token.type = maybe_type;
        token.lexeme = maybe_lexeme;
      }
    }

    if (token.type === TokenTypes.IDENTIFIER) {
      token.type = RESERVED_WORDS.get(token.lexeme) ?? token.type;
    }

    return token;
  }

  tokenize() {
    while (!this.isDone()) {
      this.consumeWhitespace();

      if (this.source === '') break;

      const { type, lexeme } = this.matchToken();

      switch (type) {
        case TokenTypes.SLASH_SLASH:
          this.consumeComment();
          continue;

        case TokenTypes.DOUBLE_QUOTE:
          this.consumeString();
          continue;

        case TokenTypes.UNKNOWN:
          this.errors.push(new UnexpectedCharacterError(this.line));
          this.advance(1);
          continue;

        default:
          this.emitToken(type, lexeme);
          this.consume(lexeme);
      }
    }

    this.emitToken(TokenTypes.EOF, '');
    return [this.tokens, this.errors] as [Token[], Error[]];
  }
}
