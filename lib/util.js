"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
// Constants
var sizeInt = 4;
var allFields = true;
var presetHeaderLength = 25;
exports.presetHeaderLength = presetHeaderLength;
var builtinMax = 16384;
exports.builtinMax = builtinMax;
var hiddenStrings = false;
var setHiddenStrings = function (value) { hiddenStrings = value; };
exports.setHiddenStrings = setHiddenStrings;
var verbosity = 0;
var setVerbosity = function (value) { verbosity = value; };
exports.setVerbosity = setVerbosity;
var ConvertException = /** @class */ (function () {
    function ConvertException(msg) {
        this.msg = msg;
        this.name = 'ConvertException';
        this.message = msg;
    }
    ConvertException.prototype.toString = function () {
        return this.name + " : " + this.message;
    };
    return ConvertException;
}());
exports.ConvertException = ConvertException;
var cmpBytes = function (arr, offset, test) {
    for (var i = 0; i < test.length; i++) {
        if (test[i] === null) {
            continue; // null means 'any value' - a letiable
        }
        if (arr[i + offset] !== test[i]) {
            return false;
        }
    }
    return true;
};
exports.cmpBytes = cmpBytes;
var printTable = function (name, table) {
    dim(name + ":");
    for (var key in table) {
        dim("\t" + key + ": " + (table[key] ? ('' + table[key]).replace(/\n/g, '\n\t\t') : 'undefined'));
    }
};
exports.printTable = printTable;
function callFunction(funcName, blobOrValue, offset, extra) {
    try {
        if (blobOrValue instanceof Uint8Array) {
            return eval('get' + funcName)(blobOrValue, offset, extra);
        }
        else {
            return eval('get' + funcName)(blobOrValue);
        }
    }
    catch (e) {
        if (e.message.search(/not a function|has no method/) >= 0) {
            throw new ConvertException("Method or table '" + ('get' + funcName) + "' was not found. Correct capitalization?");
        }
        else {
            throw e;
        }
    }
}
exports.callFunction = callFunction;
var getBit = function (blob, offset, pos) {
    if (pos.length) {
        if (pos.length !== 2)
            throw new _this.ConvertException("Invalid Bitfield range " + pos + ".");
        var mask = (2 << (pos[1] - pos[0])) - 1;
        return [(blob[offset] >> pos[0]) & mask, 1];
    }
    else {
        return [((blob[offset] >> pos) & 1), 1];
    }
};
exports.getBit = getBit;
var getUInt = function (blob, offset, size) {
    if (offset > blob.length - size) {
        if (verbosity >= 1)
            warn('WARNING: getUInt: offset overflow', offset, '>', blob.length - size);
        return 0;
    }
    switch (size) {
        case 1:
            return blob[offset];
        case sizeInt:
            return getUInt32(blob, offset);
        case sizeInt * 2:
            return getUInt64(blob, offset);
        default:
            throw new ConvertException("Invalid integer size '" + size + "', only 1, " + sizeInt + " and " + sizeInt * 2 + " allowed.");
    }
};
exports.getUInt = getUInt;
var getUInt32 = function (blob, offset) {
    if (!offset)
        offset = 0;
    if (offset > blob.length - sizeInt) {
        if (verbosity >= 1)
            warn('WARNING: getUInt32: offset overflow', offset, '>', blob.length - sizeInt);
        return 0;
    }
    var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
    try {
        return new Uint32Array(array, 0, 1)[0];
    }
    catch (e) {
        if (e instanceof RangeError) {
            error(e.stack);
            throw new ConvertException("Invalid offset " + offset + " to getUInt32.\nIs this preset very old? Send it in, so we can look at it!");
        }
        else {
            throw e;
        }
    }
};
exports.getUInt32 = getUInt32;
var getInt32 = function (blob, offset) {
    if (!offset)
        offset = 0;
    if (offset > blob.length - sizeInt) {
        if (verbosity >= 1)
            warn('WARNING: getInt32: offset overflow', offset, '>', blob.length - sizeInt);
        return [0, sizeInt];
    }
    var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
    try {
        return [new Int32Array(array, 0, 1)[0], sizeInt];
    }
    catch (e) {
        if (e instanceof RangeError) {
            throw new ConvertException("Invalid offset " + offset + " to getInt32.\nIs this preset very old? Send it in, so we can look at it!");
        }
        else {
            throw e;
        }
    }
};
exports.getInt32 = getInt32;
var getUInt64 = function (blob, offset) {
    if (!offset)
        offset = 0;
    if (offset > blob.length - sizeInt * 2) {
        if (verbosity >= 1)
            warn('WARNING: getUInt64: offset overflow', offset, '>', blob.length - sizeInt * 2);
        return 0;
    }
    var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt * 2);
    try {
        var two32 = new Uint32Array(array, 0, 2);
        return two32[0] + two32[1] * 0x100000000;
    }
    catch (e) {
        if (e instanceof RangeError) {
            throw new ConvertException("Invalid offset " + offset + " to getUInt64.\nIs this preset very old? Send it in, so we can look at it!");
        }
        else {
            throw e;
        }
    }
};
exports.getUInt64 = getUInt64;
var getFloat = function (blob, offset) {
    if (!offset)
        offset = 0;
    var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
    try {
        return [new Float32Array(array, 0, 1)[0], 4];
    }
    catch (e) {
        if (e instanceof RangeError) {
            throw new ConvertException("Invalid offset " + offset + " to getFloat.\nIs this preset very old? Send it in, so we can look at it!");
        }
        else {
            throw e;
        }
    }
};
exports.getFloat = getFloat;
var getBool = function (blob, offset, size) {
    var val = size === 1 ? blob[offset] : getUInt32(blob, offset);
    return [val !== 0, size];
};
exports.getBool = getBool;
var getBoolified = function (num) {
    return num === 0 ? false : true;
};
exports.getBoolified = getBoolified;
var getSizeString = function (blob, offset, size) {
    var add = 0;
    var result = '';
    var getHidden = false;
    if (!size) {
        size = getUInt32(blob, offset);
        add = sizeInt;
    }
    else {
        getHidden = hiddenStrings;
    }
    var end = offset + size + add;
    var i = offset + add;
    var c = blob[i];
    while (c > 0 && i < end) {
        result += String.fromCharCode(c);
        c = blob[++i];
    }
    var hidden = [];
    if (getHidden) {
        hidden = getHiddenStrings(blob, i, end);
    }
    if (hidden.length === 0) {
        return [result, size + add];
    }
    else {
        return [result, size + add, hidden];
    }
};
exports.getSizeString = getSizeString;
var getHiddenStrings = function (blob, i, end) {
    var nonPrintables = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
        127, 129, 141, 143, 144, 157, 173
    ];
    var hidden = [];
    while (i < end) {
        var c = blob[i];
        var s = '';
        while (nonPrintables.indexOf(c) < 0 && i < end) {
            s += String.fromCharCode(c);
            c = blob[++i];
        }
        i++;
        // mostly of interest might be (lost) code, and thus check for '=' to
        // weed out a lot of random uninteresting strings.
        // TODO: more sophisticated filter
        if (s.length > 4 && s.indexOf('=') >= 0) {
            hidden.push(s);
        }
    }
    return hidden;
};
var getNtString = function (blob, offset) {
    var result = '';
    var i = offset;
    var c = blob[i];
    while (c > 0) {
        result += String.fromCharCode(c);
        c = blob[++i];
    }
    return [result, i - offset + 1];
};
exports.getNtString = getNtString;
var removeSpaces = function (str) {
    return str.replace(/[ ]/g, '');
};
exports.removeSpaces = removeSpaces;
var lowerInitial = function (str) {
    return str[0].toLowerCase() + str.slice(1);
};
exports.lowerInitial = lowerInitial;
var getMap1 = function (blob, offset, map) {
    return [getMapping(map, blob[offset]), 1];
};
exports.getMap1 = getMap1;
var getMap4 = function (blob, offset, map) {
    return [getMapping(map, getUInt32(blob, offset)), sizeInt];
};
exports.getMap4 = getMap4;
var getMap8 = function (blob, offset, map) {
    return [getMapping(map, getUInt64(blob, offset)), sizeInt * 2];
};
exports.getMap8 = getMap8;
var getRadioButton = function (blob, offset, map) {
    var key = 0;
    for (var i = 0; i < map.length; i++) {
        var on = getUInt32(blob, offset + sizeInt * i) !== 0 ? 1 : 0;
        if (on) {
            key = on * (i + 1);
        }
    }
    return [getMapping(map, key), sizeInt * map.length];
};
exports.getRadioButton = getRadioButton;
var getMapping = function (map, key) {
    var value = map[key];
    if (value === undefined) {
        throw new ConvertException("Map: A value for key '" + key + "' does not exist.");
    }
    else {
        return value;
    }
};
exports.getMapping = getMapping;
// Point, Frame, Beat, Init code fields - reorder to I,F,B,P order.
var getCodePFBI = function (blob, offset) {
    var map = [
        ['init', 3],
        ['perFrame', 1],
        ['onBeat', 2],
        ['perPoint', 0],
    ];
    return getCodeSection(blob, offset, map);
};
exports.getCodePFBI = getCodePFBI;
// Frame, Beat, Init code fields - reorder to I,F,B order.
var getCodeFBI = function (blob, offset) {
    var map = [
        ['init', 2],
        ['perFrame', 1],
        ['onBeat', 0],
    ];
    return getCodeSection(blob, offset, map);
};
exports.getCodeFBI = getCodeFBI;
var getCodeIFBP = function (blob, offset) {
    var map = [
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
        ['perPoint', 3],
    ];
    return getCodeSection(blob, offset, map);
};
exports.getCodeIFBP = getCodeIFBP;
var getCodeIFB = function (blob, offset) {
    var map = [
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
    ];
    return getCodeSection(blob, offset, map);
};
exports.getCodeIFB = getCodeIFB;
// used by 2.8+ 'Effect List'
var getCodeEIF = function (blob, offset) {
    var map = [
        ['init', 0],
        ['perFrame', 1],
    ];
    var code = getCodeSection(blob, offset, map);
    return [{
            'enabled': getBool(blob, offset, sizeInt)[0],
            'init': code[0]['init'],
            'perFrame': code[0]['perFrame'],
        }, code[1]];
};
exports.getCodeEIF = getCodeEIF;
// used only by 'Global Variables'
var getNtCodeIFB = function (blob, offset) {
    var map = [
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
    ];
    return getCodeSection(blob, offset, map, /*nullterminated*/ true);
};
exports.getNtCodeIFB = getNtCodeIFB;
// used only by 'Triangle'
var getNtCodeIFBP = function (blob, offset) {
    var map = [
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
        ['perPoint', 3],
    ];
    return getCodeSection(blob, offset, map, /*nullterminated*/ true);
};
exports.getNtCodeIFBP = getNtCodeIFBP;
// the 256*-functions are used by ancient versions of 'Super Scope', 'Dynamic Movement', 'Dynamic Distance Modifier', 'Dynamic Shift'
var get256CodePFBI = function (blob, offset) {
    var map = [
        ['init', 3],
        ['perFrame', 1],
        ['onBeat', 2],
        ['perPoint', 0],
    ];
    return getCodeSection(blob, offset, map, /*nullterminated*/ false, /*string max length*/ 256);
};
exports.get256CodePFBI = get256CodePFBI;
var get256CodeIFB = function (blob, offset) {
    var map = [
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
    ];
    return getCodeSection(blob, offset, map, /*nullterminated*/ false, /*string max length*/ 256);
};
var getCodeSection = function (blob, offset, map, nt, fixedSize) {
    if (nt === void 0) { nt = false; }
    var strings = new Array(map.length);
    var totalSize = 0;
    var strAndSize;
    var hidden = [];
    for (var i = 0, p = offset; i < map.length; i++, p += strAndSize[1]) {
        strAndSize = nt ? getNtString(blob, p) : getSizeString(blob, p, fixedSize);
        totalSize += strAndSize[1];
        strings[i] = strAndSize[0];
        if (strAndSize.length > 2) {
            hidden = hidden.concat(strAndSize[2]);
        }
    }
    var code = {};
    for (var i = 0; i < strings.length; i++) {
        code[map[i][0]] = strings[map[i][1]];
    }
    if (hidden.length > 0) {
        code['_hidden'] = hidden;
    }
    return [code, totalSize];
};
exports.getCodeSection = getCodeSection;
var getColorList = function (blob, offset) {
    var colors = [];
    var num = getUInt32(blob, offset);
    var size = sizeInt + num * sizeInt;
    while (num > 0) {
        offset += sizeInt;
        colors.push(getColor(blob, offset)[0]);
        num--;
    }
    return [colors, size];
};
exports.getColorList = getColorList;
var getColorMaps = function (blob, offset) {
    var mapOffset = offset + 480;
    var maps = [];
    var headerSize = 60; // 4B enabled, 4B num, 4B id, 48B filestring
    var mi = 0; // map index, might be != i when maps are skipped
    for (var i = 0; i < 8; i++) {
        var enabled = getBool(blob, offset + headerSize * i, sizeInt)[0];
        var num = getUInt32(blob, offset + headerSize * i + sizeInt);
        var map = getColorMap(blob, mapOffset, num);
        // check if it's a disabled default {0: #000000, 255: #ffffff} map, and only save it if not.
        if (!enabled && map.length === 2 && map[0].color === '#000000' && map[0].position === 0 && map[1].color === '#ffffff' && map[1].position === 255) {
            // skip this map
        }
        else {
            maps[mi] = {
                'index': i,
                'enabled': enabled,
                'map': map,
            };
            if (allFields) {
                var id = getUInt32(blob, offset + headerSize * i + sizeInt * 2); // id of the map - not really needed.
                var mapFile = getNtString(blob, offset + headerSize * i + sizeInt * 3)[0];
                maps[mi]['id'] = id;
                maps[mi]['fileName'] = mapFile;
            }
            mi++;
        }
        mapOffset += num * sizeInt * 3;
    }
    return [maps, mapOffset - offset];
};
exports.getColorMaps = getColorMaps;
var getColorMap = function (blob, offset, num) {
    var colorMap = [];
    for (var i = 0; i < num; i++) {
        var pos = getUInt32(blob, offset);
        var color = getColor(blob, offset + sizeInt)[0];
        offset += sizeInt * 3; // there's a 4byte id (presumably) following each color.
        colorMap[i] = { 'color': color, 'position': pos };
    }
    return colorMap;
};
exports.getColorMap = getColorMap;
var getColor = function (blob, offset) {
    // Colors in AVS are saved as (A)RGB (where A is always 0).
    // Maybe one should use an alpha channel right away and set
    // that to 0xff? For now, no 4th byte means full alpha.
    var color = getUInt32(blob, offset).toString(16);
    var padding = '';
    for (var i = color.length; i < 6; i++) {
        padding += '0';
    }
    return ['#' + padding + color, sizeInt];
};
exports.getColor = getColor;
var getConvoFilter = function (blob, offset, dimensions) {
    var size = dimensions[0] * dimensions[1];
    var data = new Array(size);
    for (var i = 0; i < size; i++, offset += sizeInt) {
        data[i] = getInt32(blob, offset)[0];
    }
    var matrix = { 'width': dimensions[0], 'height': dimensions[1], 'data': data };
    return [matrix, size * sizeInt];
};
exports.getConvoFilter = getConvoFilter;
// 'Text' needs this
var getSemiColSplit = function (str) {
    var strings = str.split(';');
    if (strings.length === 1) {
        return strings[0];
    }
    else {
        return strings;
    }
};
exports.getSemiColSplit = getSemiColSplit;
var getBufferNum = function (code) {
    if (code === 0) {
        return 'Current';
    }
    return code;
};
exports.getBufferNum = getBufferNum;
var dim = function () {
    var message = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        message[_i] = arguments[_i];
    }
    console.log((isNode) ? chalk.dim(message) : message);
};
exports.dim = dim;
var error = function () {
    var message = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        message[_i] = arguments[_i];
    }
    console.error((isNode) ? chalk.red(message) : message);
};
exports.error = error;
var warn = function () {
    var message = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        message[_i] = arguments[_i];
    }
    console.warn((isNode) ? chalk.yellow(message) : message);
};
exports.warn = warn;
var isNode = new Function('try {return this===global;}catch(e){return false;}');
//# sourceMappingURL=util.js.map