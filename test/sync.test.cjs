// Modules
const { convertFileSync } = require('../dist/node.cjs');

// Dependencies
const { readFileSync } = require('fs');
const path = require('path');
const test = require('ava');

// Variables
const fixturesDir = path.join(__dirname, 'fixtures');
const expectedDir = path.join(__dirname, 'expected');

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
