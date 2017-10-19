// Modules
import * as Util from '../bin/lib/util';

// Dependencies
import { spawnSync } from 'child_process';
import { test } from 'ava';

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
  // Potential bug: why is "the" lowercase?
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
