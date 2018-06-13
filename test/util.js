// Modules
import * as Util from '../dist/lib/util';

// Dependencies
import { join } from 'path';
import { spawnSync } from 'child_process';
import { statSync, readFileSync } from 'fs';
import { test } from 'ava';

// Variables
const fixturesDir = join(__dirname, 'fixtures');

// Tests
test('Boolify: false', t => {
  const expected = false;
  const actual = Util.getBoolified(0);

  t.is(actual, expected);
});

test('Boolify: true', t => {
  const expected = true;
  const actual = Util.getBoolified(1);

  t.is(actual, expected);
});

test('Lowercase Initials', t => {
  const expected = 'camelCase';
  const actual = Util.lowerInitial("CamelCase");

  t.is(actual, expected);
});

test('Removes Spaces', t => {
  const expected = 'Thisisastringwithtwotrailingspaces';
  const actual = Util.removeSpaces("This is a string with two trailing spaces  ");

  t.is(actual, expected);
});

test('Split semicolons', t => {
  const expected = ['a', 'b', 'c'];
  const actual = Util.getSemiColSplit("a;b;c");

  t.deepEqual(actual, expected);
});

test('Get ISO time', async t => {
  const actual = await Util.getISOTime(__filename);
  const expected = statSync(__filename).mtime.toISOString();

  t.deepEqual(actual, expected);
});

test('Read preset', async t => {
  return Promise.resolve(Util.readPreset(`${fixturesDir}/superscope.avs`))
  .then(async actual => {
    const expected = readFileSync(`${fixturesDir}/superscope.avs`, 'utf-8');

    t.is(actual.toString(), expected.toString());
  })
  .catch();
});
