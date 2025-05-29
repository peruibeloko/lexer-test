import { RESERVED_WORDS, Token, TokenRegexes, TokenTypes } from './Token.ts';
import { UnexpectedCharacterError } from './UnexpectedCharacterError.ts';

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

  private emitError(line: number) {
    this.errors.push(new UnexpectedCharacterError(line));
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

      if (this.source === '') {
        break;
      }

      const { type, lexeme } = this.matchToken();

      if (type === TokenTypes.SLASH_SLASH) {
        this.consumeComment();
        continue;
      }

      if (type === TokenTypes.UNKNOWN) {
        this.emitError(this.line);
        this.advance(1);
        continue;
      }

      this.emitToken(type, lexeme);
      this.consume(lexeme);
    }

    this.emitToken(TokenTypes.EOF, '');
    return [this.tokens, this.errors] as [Token[], Error[]];
  }
}
