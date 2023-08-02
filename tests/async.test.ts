// Modules
import { convertFile } from './_helper';

// Dependencies
import { globby } from 'globby';
import { promises as fs } from 'node:fs';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import path from 'node:path';

// Variables
const fixturesDir = path.join(process.cwd(), 'tests/fixtures');
const expectedDir = path.join(process.cwd(), 'tests/expected');

// Converter Settings
const options = {
  minify: true,
  noDate: true
};

(async () => {
    const avsFiles = await globby(['**/*.avs'], { cwd: fixturesDir });
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

        test(`Converted: ${avsFile}`, async () => {
            const actual = await convertFile(absolutePath.fixture, options);
            const expected = (await fs.readFile(absolutePath.expected, 'utf-8')).toString();

            assert.is(actual, expected);
        });

        if (!emptyFiles.includes(avsFile)) {
            test(`Not empty: ${avsFile}`, async () => {
                const actual = JSON.parse(await convertFile(absolutePath.fixture, options));

                assert.is.not(actual.components.length, 0);
            });
        }
    });

    test.run();
})();
