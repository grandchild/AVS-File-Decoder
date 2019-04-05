// Modules
import { convertFileSync } from '../node';

// Dependencies
import { readFileSync, statSync } from 'fs';
import { join } from 'path';
import test from 'ava';

// Variables
const fixturesDir = join(__dirname, 'fixtures');
const expectedDir = join(__dirname, 'expected');

// Converter Settings
const options = {
  minify: true,
  noDate: true
};

// Tests
test('Convert: comment.avs', t => {
  const file = 'comment';
  const actual = convertFileSync(`${fixturesDir}/${file}.avs`, options);
  const expected = readFileSync(`${expectedDir}/${file}.webvs`, 'utf-8').toString();

  t.is(expected, actual);
});

test('Convert: empty.avs', t => {
  const file = 'empty';
  const actual = convertFileSync(`${fixturesDir}/${file}.avs`, options);
  const expected = readFileSync(`${expectedDir}/${file}.webvs`, 'utf-8').toString();

  t.is(expected, actual);
});

test('Convert: invert.avs', t => {
  const file = 'invert';
  const actual = convertFileSync(`${fixturesDir}/${file}.avs`, options);
  const expected = readFileSync(`${expectedDir}/${file}.webvs`, 'utf-8').toString();

  t.is(expected, actual);
});

test('Convert: superscope.avs', t => {
  const file = 'superscope';
  const actual = convertFileSync(`${fixturesDir}/${file}.avs`, options);
  const expected = readFileSync(`${expectedDir}/${file}.webvs`, 'utf-8').toString();

  t.is(expected, actual);
});
