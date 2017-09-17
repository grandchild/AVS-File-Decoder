'use strict';

// Dependencies
import * as program from 'commander';
import { argv }from 'process';
import { lstat, readFile, writeFileSync } from 'fs';
import glob from 'glob';
import { basename, dirname, join } from 'path';

// Modules
import { convertPreset } from './lib/convert';

program
    .version(require('../package.json').version)
    .usage('[options] <file(s)>')
    .option('-d, --debug', 'Prints in-depth information')
    .option('-m, --minify', 'Minify generated JSON')
    .option('-s, --silent', 'Prints errors only')
    .parse(argv);

if (program.args !== 'undefined' && program.args.length > 0) {
    program.args.forEach( (element, index) => {
        glob(element, (error, files) => {
            if (error) throw error;

            files.forEach( file => {
                fs.lstat(file, (error, stats) => {
                    if (error) return;

                    if (stats.isFile()) {
                        convertPreset(file, program);
                    }
                });
            });
        });
    });
}

if (program.args.length === 0) program.help();

const convertPreset = (file, args) => {
    fs.readFile(file, (error, data) => {
        if (args.silent !== true) console.log(`\nReading "${file}"`);

        let whitespace = program.minify ? true : null || 4;
        let presetObj = convertPreset(data, file, args);
        let presetJson = JSON.stringify(presetObj, null, whitespace);
        let baseName = path.basename(file, '.avs');
        let dirName = path.dirname(file);
        let outFile = path.join(dirName, baseName + '.webvs');

        if (args.silent !== true) console.log(`Writing "${outFile}"`);
        try {
            fs.writeFileSync(outFile, presetJson);
        } catch (e) {
            console.log(e);
        }
    });
};
