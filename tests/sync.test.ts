// Modules
import { convertFileSync } from './_helper';

// Dependencies
import { globbySync } from 'globby';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import fs from 'node:fs';
import path from 'node:path';

// Variables
const fixturesDir = path.join(process.cwd(), 'tests/fixtures');
const expectedDir = path.join(process.cwd(), 'tests/expected');

// Converter Settings
const options = {
  minify: true,
  noDate: true
};

const avsFiles = globbySync(['**/*.avs'], { cwd: fixturesDir });
const emptyFiles = [
    '(empty - Clear every  frame).avs',
    '(empty).avs'
];

avsFiles.map(avsFile => {
    const basename = path.basename(avsFile, '.avs');
    const dirname = path.dirname(avsFile);

    const absolutePath = {
        expected: path.join(expectedDir, dirname, `${basename}.webvs`),
        fixture: path.join(fixturesDir, avsFile)
    };

    test(`Converted: ${avsFile}`, () => {
        const actual = convertFileSync(absolutePath.fixture, options);
        const expected = fs.readFileSync(absolutePath.expected, 'utf-8').toString();

        assert.is(actual, expected);
    });

    if (!emptyFiles.includes(avsFile)) {
        test(`Not empty: ${avsFile}`, () => {
            const actual = JSON.parse(convertFileSync(absolutePath.fixture, options));

            assert.is.not(actual.components.length, 0);
        });
    }
});

test.run();
