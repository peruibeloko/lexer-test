export class Token {
  type: symbol;
  line: number;
  lexeme: string;

  constructor(type: symbol, lexeme: string, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;
  }

  toString() {
    return `${this.line}:[${this.type.description}] ${this.lexeme}`;
  }
}
