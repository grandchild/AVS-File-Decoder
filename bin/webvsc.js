'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
var program = require("commander");
var process_1 = require("process");
var graceful_fs_1 = require("graceful-fs");
var glob = require("glob");
var path_1 = require("path");
// Modules
var convert_1 = require("./lib/convert");
program
    .version(require('../package.json').version)
    .usage('[options] <file(s)>')
    .option('-d, --debug', 'Prints in-depth information', function (d, t) { return t + 1; }, 0)
    .option('-m, --minify', 'Minify generated JSON')
    .option('-s, --silent', 'Prints errors only')
    .option('-n, --no-hidden', 'Don\'t extract hidden strings from fixed-size strings')
    .parse(process_1.argv);
var convert = function (file, args) {
    graceful_fs_1.readFile(file, function (error, data) {
        if (args.silent !== true)
            console.log("\nReading \"" + file + "\"");
        var whitespace = (program.minify === true) ? 0 : 4;
        var presetObj = convert_1.convertPreset(data, file, args);
        var presetJson = JSON.stringify(presetObj, null, whitespace);
        var baseName = path_1.basename(file, '.avs');
        var dirName = path_1.dirname(file);
        var outFile = path_1.join(dirName, baseName + '.webvs');
        if (args.silent !== true)
            console.log("Writing \"" + outFile + "\"");
        try {
            graceful_fs_1.writeFileSync(outFile, presetJson);
        }
        catch (e) {
            console.error(e);
        }
    });
};
if (program.args !== 'undefined' && program.args.length > 0) {
    program.args.forEach(function (element, index) {
        glob(element, function (error, files) {
            if (error)
                throw error;
            files.forEach(function (file) {
                graceful_fs_1.lstat(file, function (error, stats) {
                    if (error)
                        return;
                    if (stats.isFile()) {
                        convert(file, program);
                    }
                });
            });
        });
    });
}
if (program.args.length === 0)
    program.help();
//# sourceMappingURL=webvsc.js.map