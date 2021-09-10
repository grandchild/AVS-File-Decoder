// Modules
import { convertFileSync } from '../dist/node.mjs';

// Dependencies
import fs from 'node:fs';
import globby from 'globby';
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

// TODO: Use top-level await when Node 16 becomes LTS
(async () => {
    const avsFiles = await globby.sync(['**/*.avs'], { cwd: fixturesDir });
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

        test(`Converted: ${avsFile}`, t => {
            const actual = convertFileSync(absolutePath.fixture, options);
            const expected = fs.readFileSync(absolutePath.expected, 'utf-8').toString();

            t.is(actual, expected);
        });

        if (!emptyFiles.includes(avsFile)) {
            test(`Not empty: ${avsFile}`, t => {
                const actual = JSON.parse(convertFileSync(absolutePath.fixture, options));

                t.not(actual.components.length, 0);
            });
        }
    });
})();
