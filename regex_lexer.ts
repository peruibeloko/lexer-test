import { Token } from "./Token.ts";
import { TokenRegexes } from "./TokenRegex.ts";
import { RESERVED_WORDS, TokenTypes } from "./TokenTypes.ts";

export class RegexLexer {
  source: string;
  window: string;
  line: number;
  tokens: Token[];

  constructor(src: string) {
    this.source = src;
    this.window = src;
    this.line = 1;
    this.tokens = [];
  }

  private isDone() {
    return this.window === "";
  }

  private emit({ type, lexeme }: { type: symbol; lexeme: string }) {
    this.tokens.push(new Token(type, lexeme, this.line));
  }

  private advance(lexeme: string) {
    this.window = this.window.slice(lexeme.length);
  }

  private consumeNewlines() {
    while (this.window.match(/^\n/)) {
      this.line++;
      this.window = this.window.slice(1);
    }
  }

  private consumeWhitespace() {
    this.consumeNewlines();
    const match = this.window.match(/^[ \t]/)?.[0];
    if (match) {
      this.advance(match);
    }
  }

  consumeComment() {
    const comment = this.window.match(/^.*/)?.[0];
    if (comment) this.advance(comment);
    this.consumeNewlines();
  }

  private matchToken() {
    const token = { type: TokenTypes.UNKNOWN, lexeme: "" };

    for (const [maybe_type, regex] of TokenRegexes.entries()) {
      const maybe_lexeme = this.window.match(regex)?.[0];

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
      const token = this.matchToken();

      if (token.type === TokenTypes.SLASH_SLASH) {
        this.consumeComment();
        continue;
      }

      this.emit(token);
      this.advance(token.lexeme);
    }
    this.emit({ type: TokenTypes.EOF, lexeme: "" });
    return this.tokens;
  }
}
