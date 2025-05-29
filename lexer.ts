import { RESERVED_WORDS, Token, TokenRegexes, TokenTypes } from './Token.ts';

export class Lexer {
  source: string;
  line: number;
  tokens: Token[];

  constructor(src: string) {
    this.source = src;
    this.line = 1;
    this.tokens = [];
  }

  private isDone() {
    return this.source === '';
  }

  private emit(type: symbol, lexeme: string) {
    this.tokens.push(new Token(type, lexeme, this.line));
  }

  private advance(lexeme: string) {
    this.source = this.source.slice(lexeme.length);
  }

  private consumeNewlines() {
    while (this.source.match(/^\n/)) {
      this.line++;
      this.source = this.source.slice(1);
    }
  }

  private consumeWhitespace() {
    this.consumeNewlines();
    const match = this.source.match(/^[ \t]+/)?.[0];
    if (match) {
      this.advance(match);
    }
  }

  consumeComment() {
    const comment = this.source.match(/^.*/)?.[0];
    if (comment) this.advance(comment);
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
      const { type, lexeme } = this.matchToken();

      if (type === TokenTypes.SLASH_SLASH) {
        this.consumeComment();
        continue;
      }

      this.emit(type, lexeme);
      this.advance(lexeme);
    }

    this.emit(TokenTypes.EOF, '');
    return this.tokens;
  }
}
