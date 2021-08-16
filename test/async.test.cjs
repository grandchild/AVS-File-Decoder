// Modules
const { convertFile } = require('../dist/node.cjs');

// Dependencies
const { promises: fs } = require('fs');
const globby = require('globby');
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

(async () => {
    const avsFiles = await globby(['**/*.avs'], { cwd: fixturesDir });

    avsFiles.map(avsFile => {
        const basename = path.basename(avsFile, '.avs');
        const dirname = path.dirname(avsFile);

        const absolutePath = {
            expected: path.join(expectedDir, dirname, `${basename}.webvs`),
            fixture: path.join(fixturesDir, avsFile)
        };

        test(avsFile, async t => {
            const actual = await convertFile(absolutePath.fixture, options);
            const expected = (await fs.readFile(absolutePath.expected, 'utf-8')).toString();

            t.is(actual, expected);
        });
    });
})();
