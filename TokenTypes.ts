export const TokenTypes = {
  // Single-character tokens.
  LEFT_PAREN: Symbol('LEFT_PAREN'),
  RIGHT_PAREN: Symbol('RIGHT_PAREN'),
  LEFT_BRACE: Symbol('LEFT_BRACE'),
  RIGHT_BRACE: Symbol('RIGHT_BRACE'),
  COMMA: Symbol('COMMA'),
  DOT: Symbol('DOT'),
  MINUS: Symbol('MINUS'),
  PLUS: Symbol('PLUS'),
  SEMICOLON: Symbol('SEMICOLON'),
  STAR: Symbol('STAR'),

  // One or two character tokens.
  SLASH: Symbol('SLASH'),
  SLASH_SLASH: Symbol('SLASH_SLASH'),
  BANG: Symbol('BANG'),
  BANG_EQUAL: Symbol('BANG_EQUAL'),
  EQUAL: Symbol('EQUAL'),
  EQUAL_EQUAL: Symbol('EQUAL_EQUAL'),
  GREATER: Symbol('GREATER'),
  GREATER_EQUAL: Symbol('GREATER_EQUAL'),
  LESS: Symbol('LESS'),
  LESS_EQUAL: Symbol('LESS_EQUAL'),

  // Literals.
  IDENTIFIER: Symbol('IDENTIFIER'),
  STRING: Symbol('STRING'),
  NUMBER: Symbol('NUMBER'),

  // Keywords.
  AND: Symbol('AND'),
  CLASS: Symbol('CLASS'),
  ELSE: Symbol('ELSE'),
  FALSE: Symbol('FALSE'),
  FUN: Symbol('FUN'),
  FOR: Symbol('FOR'),
  IF: Symbol('IF'),
  NIL: Symbol('NIL'),
  OR: Symbol('OR'),
  PRINT: Symbol('PRINT'),
  RETURN: Symbol('RETURN'),
  SUPER: Symbol('SUPER'),
  THIS: Symbol('THIS'),
  TRUE: Symbol('TRUE'),
  VAR: Symbol('VAR'),
  WHILE: Symbol('WHILE'),

  EOF: Symbol('EOF'),
  UNKNOWN: Symbol('UNKNOWN')
};

export const SINGLE_SYMBOLS = new Map([
  ['(', TokenTypes.LEFT_PAREN],
  [')', TokenTypes.RIGHT_PAREN],
  ['{', TokenTypes.LEFT_BRACE],
  ['}', TokenTypes.RIGHT_BRACE],
  [',', TokenTypes.COMMA],
  ['.', TokenTypes.DOT],
  ['-', TokenTypes.MINUS],
  ['+', TokenTypes.PLUS],
  [';', TokenTypes.SEMICOLON],
  ['*', TokenTypes.STAR]
]);

export const DOUBLE_SYMBOLS = new Map([
  [
    '/',
    {
      secondChar: '/',
      typeDouble: TokenTypes.SLASH_SLASH,
      typeSingle: TokenTypes.SLASH
    }
  ],
  [
    '!',
    {
      secondChar: '=',
      typeDouble: TokenTypes.BANG_EQUAL,
      typeSingle: TokenTypes.BANG
    }
  ],
  [
    '=',
    {
      secondChar: '=',
      typeDouble: TokenTypes.EQUAL_EQUAL,
      typeSingle: TokenTypes.EQUAL
    }
  ],
  [
    '>',
    {
      secondChar: '=',
      typeDouble: TokenTypes.GREATER_EQUAL,
      typeSingle: TokenTypes.GREATER
    }
  ],
  [
    '<',
    {
      secondChar: '=',
      typeDouble: TokenTypes.LESS_EQUAL,
      typeSingle: TokenTypes.LESS
    }
  ]
]);

export const RESERVED_WORDS = new Map([
  ['and', TokenTypes.AND],
  ['class', TokenTypes.CLASS],
  ['else', TokenTypes.ELSE],
  ['false', TokenTypes.FALSE],
  ['for', TokenTypes.FOR],
  ['fun', TokenTypes.FUN],
  ['if', TokenTypes.IF],
  ['nil', TokenTypes.NIL],
  ['or', TokenTypes.OR],
  ['print', TokenTypes.PRINT],
  ['return', TokenTypes.RETURN],
  ['super', TokenTypes.SUPER],
  ['this', TokenTypes.THIS],
  ['true', TokenTypes.TRUE],
  ['var', TokenTypes.VAR],
  ['while', TokenTypes.WHILE]
]);
