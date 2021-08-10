// Modules
import { convertFile } from '../dist/node.mjs';

// Dependencies
import { promises as fs } from 'node:fs';
import path from 'node:path';
import test from 'ava';

// Variables
const __dirname = path.resolve(path.dirname(''));
const fixturesDir = path.join(__dirname, 'test/fixtures');
const expectedDir = path.join(__dirname, 'test/expected');

// Converter Settings
const options = {
  minify: true,
  noDate: true
};

// Tests
test('Convert: comment.avs', async t => {
  const file = 'comment';
  const actual = await convertFile(`${fixturesDir}/${file}.avs`, options);
  const expected = (await fs.readFile(`${expectedDir}/${file}.webvs`, 'utf-8')).toString();

  t.is(expected, actual);
});

test('Convert: empty.avs', async t => {
  const file = 'empty';
  const actual = await convertFile(`${fixturesDir}/${file}.avs`, options);
  const expected = (await fs.readFile(`${expectedDir}/${file}.webvs`, 'utf-8')).toString();

  t.is(expected, actual);
});

test('Convert: invert.avs', async t => {
  const file = 'invert';
  const actual = await convertFile(`${fixturesDir}/${file}.avs`, options);
  const expected = (await fs.readFile(`${expectedDir}/${file}.webvs`, 'utf-8')).toString();

  t.is(expected, actual);
});

test('Convert: superscope.avs', async t => {
  const file = 'superscope';
  const actual = await convertFile(`${fixturesDir}/${file}.avs`, options);
  const expected = (await fs.readFile(`${expectedDir}/${file}.webvs`, 'utf-8')).toString();

  t.is(expected, actual);
});
