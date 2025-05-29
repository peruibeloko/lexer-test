export class UnexpectedCharacterError extends Error {
  line: number;

  constructor(line: number) {
    super(`[line ${line}] Error: Unexpected character.`);
    this.line = line;
  }
}

export class UnterminatedStringError extends Error {
  line: number;

  constructor(line: number) {
    super(`[line ${line}] Error: Unterminated string.`);
    this.line = line;
  }
}
