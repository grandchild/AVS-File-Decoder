"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Modules
var fs_1 = require("fs");
var getISOTime = function (file) {
    return new Promise(function (resolve, reject) {
        fs_1.stat(file, function (err, time) {
            err ? reject(err) : resolve(time.mtime.toISOString());
        });
    });
};
exports.getISOTime = getISOTime;
var readPreset = function (file) {
    return new Promise(function (resolve, reject) {
        fs_1.readFile(file, function (err, data) {
            err ? reject(err) : resolve(data);
        });
    });
};
exports.readPreset = readPreset;
//# sourceMappingURL=util-node.js.map