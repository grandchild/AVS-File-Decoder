// Modules
import * as Util from '../lib/util';
import get from '../lib/get';
import { getISOTime, readPreset} from '../lib/util-node';

// Dependencies
import { join } from 'path';
import { statSync, readFileSync } from 'fs';
import test from 'ava';

// Variables
const fixturesDir = join(__dirname, 'fixtures');

// Tests
test('Boolify: false', t => {
  const expected = false;
  const actual = get.Boolified(0);

  t.is(actual, expected);
});

test('Boolify: true', t => {
  const expected = true;
  const actual = get.Boolified(1);

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
  const actual = get.SemiColSplit("a;b;c");

  t.deepEqual(actual, expected);
});

test('Buffer number: 0', async t => {
  const actual = get.BufferNum(0);
  const expected = 'Current';

  t.is(actual, expected);
});

test('Buffer number: not 0', async t => {
  const actual = get.BufferNum(1337);
  const expected = 1337;

  t.is(actual, expected);
});

test('Get ISO time', async t => {
  const actual = await getISOTime(__filename);
  const expected = statSync(__filename).mtime.toISOString();

  t.is(actual, expected);
});

test('Read preset', async t => {
  return Promise.resolve(readPreset(`${fixturesDir}/superscope.avs`))
  .then(async actual => {
    const expected = readFileSync(`${fixturesDir}/superscope.avs`, 'utf-8');

    t.is(actual.toString(), expected.toString());
  })
  .catch();
});
