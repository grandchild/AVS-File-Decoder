// Modules
import {convertFile, convertFileSync} from '../node';

// Dependencies
import test from 'ava';
import {readFile, readFileSync, statSync} from 'fs';
import {join} from 'path';
import {promisify} from 'util';

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
let testFiles = [
  'comment',
  'empty',
  'invert',
  'superscope',
  'buffersave',
  'dynamicmovement',
];

for (let testFile of testFiles) {

  test(`Convert: ${testFile}.avs`, t => {
    const actual = convertFileSync(`${fixturesDir}/${testFile}.avs`, options);
    const expected = readFileSync(`${expectedDir}/${testFile}.webvs`, 'utf-8').toString();

    t.is(expected, actual);
  });

  test(`Convert async: ${testFile}.avs`, async t => {
    const actual = await convertFile(`${fixturesDir}/${testFile}.avs`, options);
    const expected = (await readFileAsync(`${expectedDir}/${testFile}.webvs`, 'utf-8')).toString();

    t.is(expected, actual);
  });

}
