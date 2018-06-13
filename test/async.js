// Modules
import { convertFile } from '../dist';

// Dependencies
import { readFile } from 'fs';
import { join } from 'path';
import { test } from 'ava';
import { promisify } from 'util';

// Variables
const readFileAsync = promisify(readFile);
const fixturesDir = join(__dirname, 'fixtures');
const expectedDir = join(__dirname, 'expected');

// Converter Settings
const options = {
  minify: true,
  noDate: true
};

// Tests
test('Convert: comment.avs', async t => {
  const file = 'comment';
  const actual = await convertFile(`${fixturesDir}/${file}.avs`, options);
  const expected = (await readFileAsync(`${expectedDir}/${file}.webvs`, 'utf-8')).toString();

  t.is(expected, actual);
});

test('Convert: empty.avs', async t => {
  const file = 'empty';
  const actual = await convertFile(`${fixturesDir}/${file}.avs`, options);
  const expected = (await readFileAsync(`${expectedDir}/${file}.webvs`, 'utf-8')).toString();

  t.is(expected, actual);
});

test('Convert: invert.avs', async t => {
  const file = 'invert';
  const actual = await convertFile(`${fixturesDir}/${file}.avs`, options);
  const expected = (await readFileAsync(`${expectedDir}/${file}.webvs`, 'utf-8')).toString();

  t.is(expected, actual);
});

test('Convert: superscope.avs', async t => {
  const file = 'superscope';
  const actual = await convertFile(`${fixturesDir}/${file}.avs`, options);
  const expected = (await readFileAsync(`${expectedDir}/${file}.webvs`, 'utf-8')).toString();

  t.is(expected, actual);
});
