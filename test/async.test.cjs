// Modules
const { convertFile } = require('../dist/node.cjs');

// Dependencies
const { promises: fs } = require('fs');
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
