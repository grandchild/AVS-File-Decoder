// Modules
import { convertPreset } from '../dist';

// Dependencies
import { readFile, statSync } from 'fs';
import { join } from 'path';
import { test } from 'ava';
import { promisify } from 'util';

// Variables
const readFileAsync = promisify(readFile);
const fixturesDir = join(__dirname, 'fixtures');
const expectedDir = join(__dirname, 'expected');

// Converter Settings
const options = {
  minify: true
};

// Tests
test('Convert: comment.avs', async t => {
  const file = 'comment';
  const preset = await readFileAsync(`${fixturesDir}/${file}.avs`);

  const expected = await readFileAsync(`${expectedDir}/${file}.webvs`);
  const actual = convertPreset(preset, file,  '2000-03-03T00:00:00.000Z', options);

  t.is(expected.toString(), JSON.stringify(actual, null, 0));
});

test('Convert: empty.avs', async t => {
  const file = 'empty';
  const preset = await readFileAsync(`${fixturesDir}/${file}.avs`);

  const expected = await readFileAsync(`${expectedDir}/${file}.webvs`);
  const actual = convertPreset(preset, file, '2000-03-03T00:00:00.000Z', options);

  t.is(expected.toString(), JSON.stringify(actual, null, 0));
});

test('Convert: invert.avs', async t => {
  const file = 'invert';
  const preset = await readFileAsync(`${fixturesDir}/${file}.avs`);

  const expected = await readFileAsync(`${expectedDir}/${file}.webvs`);
  const actual = convertPreset(preset, file, '2000-03-03T00:00:00.000Z', options);

  t.is(expected.toString(), JSON.stringify(actual, null, 0));
});

test('Convert: superscope.avs', async t => {
  const file = 'superscope';
  const preset = await readFileAsync(`${fixturesDir}/${file}.avs`);

  const expected = await readFileAsync(`${expectedDir}/${file}.webvs`);
  const actual = convertPreset(preset, file, '2000-03-03T00:00:00.000Z', options);

  t.is(expected.toString(), JSON.stringify(actual, null, 0));
});
