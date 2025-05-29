import { Lexer } from './lexer.ts';
import { walkSync } from '@std/fs';
import { assertEquals } from '@std/assert';

export function readAll(folder: string) {
  const out = [];
  for (const file of walkSync(folder, { includeDirs: false })) {
    out.push([file.name.split('.')[0], file.path]);
  }
  return out;
}

function getExpectedValues(file: string) {
  const CAPTURE_EXPECTED = /^\/\/ expect: (?<expected>.+)$/gm;
  return file
    .matchAll(CAPTURE_EXPECTED)
    .filter((m) => !!m.groups)
    .map((m) => m.groups!['expected'])
    .map((s) => s.split(' ').slice(0, 2))
    .toArray();
}

const files = readAll('./test/scanning');
const testData = new Map();

for (const [name, path] of files) {
  const contents = Deno.readTextFileSync(`./${path}`);
  const expected = getExpectedValues(contents);
  testData.set(name, [contents, expected]);
}

const testLogic = (t: Deno.TestContext) => {
  const [contents, expected] = testData.get(t.name);
  const [actual, errors] = new Lexer(contents).tokenize();

  assertEquals(
    expected,
    actual.map((t) => [t.type.description, t.lexeme])
  );
};

Deno.test('identifiers', testLogic);
Deno.test('keywords', testLogic);
Deno.test('numbers', testLogic);
Deno.test('punctuators', testLogic);
Deno.test('strings', testLogic);
Deno.test('whitespace', testLogic);
