// Modules
import * as Table from './tables';
import { CodeSection, ColorMap, jsontypes } from './types';

import * as chalk from 'chalk';

// Constants
const sizeInt: number = 4;
const allFields: boolean  = true;
const presetHeaderLength: number = 25;
const builtinMax: number = 16384;

let hiddenStrings: boolean = false;
const setHiddenStrings = (value: boolean): void => { hiddenStrings = value; };
let verbosity: number = 0;
const setVerbosity = (value: number): void => { verbosity = value; };


class ConvertException implements Error {
    name: string = 'ConvertException';
    message: string;

    constructor(public msg: string) {
        this.message = msg;
    }

    toString(): string {
        return `${this.name} : ${this.message}`;
    }
}

const cmpBytes = (arr: Uint8Array, offset: number, test: number[]): boolean => {
    for (let i = 0; i < test.length; i++) {
        if (test[i] === null) {
            continue; // null means 'any value' - a letiable
        }
        if (arr[i + offset] !== test[i]) {
            return false;
        }
    }

    return true;
};


const printTable = (name: string, table: any): void => {
    console.log(`${name}:`);
    for (let key in table) {
        console.log(`\t${key}: ${table[key] ? (''+table[key]).replace(/\n/g, '\n\t\t') : 'undefined'}`);
    }
};

function callFunction(funcName: string, blobOrValue: Uint8Array, offset?: number, extra?: any): [jsontypes, number];
function callFunction(funcName: string, blobOrValue: Uint8Array, offset?: number, extra?: void): [jsontypes, number];
function callFunction(funcName: string, blobOrValue: jsontypes, offset?: void, extra?: void): jsontypes;
function callFunction(funcName, blobOrValue, offset?, extra?): any {
    try {
        if (blobOrValue instanceof Uint8Array) {
            return eval('get' + funcName)(blobOrValue, offset, extra);
        } else {
            return eval('get' + funcName)(blobOrValue);
        }
    } catch (e) {
        if (e.message.search(/not a function|has no method/) >= 0) {
            throw new ConvertException(`Method or table '${'get' + funcName}' was not found. Correct capitalization?`);
        } else {
            throw e;
        }
    }
}

const getBit = (blob: Uint8Array, offset: number, pos: any): [number, number] => {
    if ((<number[]>pos).length) {
        if ((<number[]>pos).length !== 2) throw new this.ConvertException(`Invalid Bitfield range ${pos}.`);
        let mask = (2 << (pos[1] - pos[0])) - 1;
        return [(blob[offset] >> pos[0]) & mask, 1];
    } else {
        return [((blob[offset] >> <number>pos) & 1), 1];
    }
};

const getUInt = (blob: Uint8Array, offset: number, size: number): number => {
    if (offset > blob.length - size) {
        if (verbosity >= 1) console.log(chalk.green('WARNING: getUInt: offset overflow', offset, '>', blob.length - size));
        return 0;
    }
    switch (size) {
        case 1:
            return blob[offset];
        case sizeInt:
            return this.getUInt32(blob, offset);
        case sizeInt * 2:
            return this.getUInt64(blob, offset);
        default:
            throw new ConvertException(`Invalid integer size '${size}', only 1, ${sizeInt} and ${sizeInt * 2} allowed.`);
    }
};

const getUInt32 = (blob: Uint8Array, offset: number): number => {
    if (!offset) offset = 0;
    if (offset > blob.length - sizeInt) {
        if (verbosity >= 1) console.log(chalk.green('WARNING: getUInt32: offset overflow', offset, '>', blob.length - sizeInt));
        return 0;
    }
    let array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
    try {
        return new Uint32Array(array, 0, 1)[0];
    } catch (e) {
        if (e instanceof RangeError) {
            console.error(chalk.red(e.stack));
            throw new ConvertException(`Invalid offset ${offset} to getUInt32.\nIs this preset very old? Send it in, so we can look at it!`);
        } else {
            throw e;
        }
    }
};

const getInt32 = (blob: Uint8Array, offset: number): [number, number] => {
    if (!offset) offset = 0;
    if (offset > blob.length - sizeInt) {
        if (verbosity >= 1) console.log(chalk.green('WARNING: getInt32: offset overflow', offset, '>', blob.length - sizeInt));
        return [0, sizeInt];
    }
    let array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
    try {
        return [new Int32Array(array, 0, 1)[0], sizeInt];
    } catch (e) {
        if (e instanceof RangeError) {
            throw new ConvertException(`Invalid offset ${offset} to getInt32.\nIs this preset very old? Send it in, so we can look at it!`);
        } else {
            throw e;
        }
    }
};

const getUInt64 = (blob: Uint8Array, offset: number): number => {
    if (!offset) offset = 0;
    if (offset > blob.length - sizeInt * 2) {
        if (verbosity >= 1) console.log(chalk.green('WARNING: getUInt64: offset overflow', offset, '>', blob.length - sizeInt * 2));
        return 0;
    }
    let array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt * 2);
    try {
        let two32 = new Uint32Array(array, 0, 2);
        return two32[0] + two32[1] * 0x100000000;
    } catch (e) {
        if (e instanceof RangeError) {
            throw new ConvertException(`Invalid offset ${offset} to getUInt64.\nIs this preset very old? Send it in, so we can look at it!`);
        } else {
            throw e;
        }
    }
};

const getFloat = (blob: Uint8Array, offset: number): [number, number] => {
    if (!offset) offset = 0;
    let array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
    try {
        return [new Float32Array(array, 0, 1)[0], 4];
    } catch (e) {
        if (e instanceof RangeError) {
            throw new ConvertException(`Invalid offset ${offset} to getFloat.\nIs this preset very old? Send it in, so we can look at it!`);
        } else {
            throw e;
        }
    }
};

const getBool = (blob: Uint8Array, offset: number, size: number): [boolean, number] => {
    let val = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [val !== 0, size];
};

const getBoolified = (num: number): boolean => {
    return num === 0 ? false : true;
};

const getSizeString = (blob: Uint8Array, offset: number, size?: number): [string, number]|[string, number, string[]] => {
    let add = 0;
    let result = '';
    let getHidden: boolean = false;
    if (!size) {
        size = this.getUInt32(blob, offset);
        add = sizeInt;
    } else {
        getHidden = hiddenStrings;
    }
    let end = offset + size + add;
    let i = offset + add;
    let c = blob[i];
    while (c > 0 && i < end) {
        result += String.fromCharCode(c);
        c = blob[++i];
    }
    let hidden: string[] = [];
    if (getHidden) {
        hidden = getHiddenStrings(blob, i, end);
    }
    if (hidden.length === 0) {
        return [result, size + add];
    } else {
        return [result, size + add, hidden];
    }
};

const getHiddenStrings = (blob: Uint8Array, i: number, end: number): string[] => {
    let nonPrintables: number[] = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
        127, 129, 141, 143, 144, 157, 173];
    let hidden: string[] = [];
    while (i < end) {
        let c = blob[i];
        let s: string = '';
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

const getNtString = (blob: Uint8Array, offset: number): [string, number] => {
    let result: string = '';
    let i = offset;
    let c = blob[i];
    while (c > 0) {
        result += String.fromCharCode(c);
        c = blob[++i];
    }
    return [result, i - offset + 1];
};

const removeSpaces = (str: string): string => {
    return str.replace(/[ ]/g, '');
};

const lowerInitial = (str: string): string => {
    return str[0].toLowerCase() + str.slice(1);
};


const getMap1 = (blob: Uint8Array, offset: number, map: Object): [string, number] => {
    return [getMapping(map, blob[offset]), 1];
};

const getMap4 = (blob: Uint8Array, offset: number, map: Object): [string, number] => {
    return [getMapping(map, getUInt32(blob, offset)), sizeInt];
};

const getMap8 = (blob: Uint8Array, offset: number, map: Object): [string, number] => {
    return [getMapping(map, getUInt64(blob, offset)), sizeInt * 2];
};

const getRadioButton = (blob: Uint8Array, offset: number, map: any[]): [string, number] => {
    let key = 0;
    for (let i = 0; i < map.length; i++) {
        let on: number = getUInt32(blob, offset + sizeInt * i) !== 0 ? 1 : 0;
        if (on) { // in case of (erroneous) multiple selections, the last one selected wins
            key = on * (i + 1);
        }
    }

    return [getMapping(map, key), sizeInt * map.length];
};

const getMapping = (map: Object, key: number): string => {
    let value = map[key];
    if (value === undefined) {
        throw new ConvertException(`Map: A value for key '${key}' does not exist.`);
    } else {
        return value;
    }
};

// Point, Frame, Beat, Init code fields - reorder to I,F,B,P order.
const getCodePFBI = (blob: Uint8Array, offset: number): [CodeSection, number] => {
    let map: [string, number][] = [ // this is the sort map, lines are 'need'-sorted with 'is'-index.
        ['init', 3],
        ['perFrame', 1],
        ['onBeat', 2],
        ['perPoint', 0],
    ];
    return getCodeSection(blob, offset, map);
};

// Frame, Beat, Init code fields - reorder to I,F,B order.
const getCodeFBI = (blob: Uint8Array, offset: number): [CodeSection, number] => {
    let map: [string, number][] = [ // see PFBI
        ['init', 2],
        ['perFrame', 1],
        ['onBeat', 0],
    ];
    return getCodeSection(blob, offset, map);
};

const getCodeIFBP = (blob: Uint8Array, offset: number): [CodeSection, number] => {
    let map: [string, number][] = [ // in this case the mapping is pretty redundant. the fields are already in order.
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
        ['perPoint', 3],
    ];
    return getCodeSection(blob, offset, map);
};

const getCodeIFB = (blob: Uint8Array, offset: number): [CodeSection, number] => {
    let map: [string, number][] = [ // see IFBP
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
    ];
    return getCodeSection(blob, offset, map);
};

// used by 2.8+ 'Effect List'
const getCodeEIF = (blob: Uint8Array, offset: number): [CodeSection, number] => {
    let map: [string, number][] = [
        ['init', 0],
        ['perFrame', 1],
    ];
    let code: [CodeSection, number] = getCodeSection(blob, offset, map);
    return [{
        'enabled': getBool(blob, offset, sizeInt)[0],
        'init': code[0]['init'],
        'perFrame': code[0]['perFrame'],
    }, code[1]];
};

// used only by 'Global Variables'
const getNtCodeIFB = (blob: Uint8Array, offset: number): [CodeSection, number] => {
    let map: [string, number][] = [
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
    ];
    return getCodeSection(blob, offset, map, /*nullterminated*/ true);
};

// used only by 'Triangle'
const getNtCodeIFBP = (blob: Uint8Array, offset: number): [CodeSection, number] => {
    let map: [string, number][] = [
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
        ['perPoint', 3],
    ];
    return getCodeSection(blob, offset, map, /*nullterminated*/ true);
};

// the 256*-functions are used by ancient versions of 'Super Scope', 'Dynamic Movement', 'Dynamic Distance Modifier', 'Dynamic Shift'
const get256CodePFBI = (blob: Uint8Array, offset: number): [CodeSection, number] => {
    let map: [string, number][] = [
        ['init', 3],
        ['perFrame', 1],
        ['onBeat', 2],
        ['perPoint', 0],
    ];
    return getCodeSection(blob, offset, map, /*nullterminated*/false, /*string max length*/256);
};

const get256CodeIFB = (blob: Uint8Array, offset: number): [CodeSection, number] => {
    let map: [string, number][] = [
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
    ];
    return getCodeSection(blob, offset, map, /*nullterminated*/false, /*string max length*/256);
};

const getCodeSection = (blob: Uint8Array, offset: number, map: [string, number][], nt: boolean = false, fixedSize?: number): [CodeSection, number] => {
    let strings = new Array(map.length);
    let totalSize = 0;
    let strAndSize: [string, number]|[string, number, string[]];
    let hidden: string[] = [];
    for (let i = 0, p = offset; i < map.length; i++, p += strAndSize[1]) {
        strAndSize = nt ? getNtString(blob, p) : getSizeString(blob, p, fixedSize);
        totalSize += strAndSize[1];
        strings[i] = strAndSize[0];
        if (strAndSize.length > 2) {
            hidden = hidden.concat((<[string, number, string[]]>strAndSize)[2]);
        }
    }
    let code = {};
    for (let i = 0; i < strings.length; i++) {
        code[map[i][0]] = strings[map[i][1]];
    }
    if (hidden.length > 0) {
        code['_hidden'] = hidden;
    }
    return [<CodeSection>code, totalSize];
};

const getColorList = (blob: Uint8Array, offset: number): [string[], number] => {
    let colors = [];
    let num = getUInt32(blob, offset);
    let size = sizeInt + num * sizeInt;
    while (num > 0) {
        offset += sizeInt;
        colors.push(getColor(blob, offset)[0]);
        num--;
    }

    return [colors, size];
};

const getColorMaps = (blob: Uint8Array, offset: number): [{index: number, enabled: boolean, id?: number, fileName?: string, map: {color: string, position: number}[]}[], number] => {
    let mapOffset = offset + 480;
    let maps: ColorMap[] = [];
    let headerSize = 60; // 4B enabled, 4B num, 4B id, 48B filestring
    let mi = 0; // map index, might be != i when maps are skipped
    for (let i = 0; i < 8; i++) {
        let enabled = getBool(blob, offset + headerSize * i, sizeInt)[0];
        let num = getUInt32(blob, offset + headerSize * i + sizeInt);
        let map = getColorMap(blob, mapOffset, num);
        // check if it's a disabled default {0: #000000, 255: #ffffff} map, and only save it if not.
        if (!enabled && map.length === 2 && map[0].color === '#000000' && map[0].position === 0 && map[1].color === '#ffffff' && map[1].position === 255) {
            // skip this map
        } else {
            maps[mi] = {
                'index': i,
                'enabled': enabled,
                'map': map,
            };
            if (allFields) {
                let id = getUInt32(blob, offset + headerSize * i + sizeInt * 2); // id of the map - not really needed.
                let mapFile = getNtString(blob, offset + headerSize * i + sizeInt * 3)[0];
                maps[mi]['id'] = id;
                maps[mi]['fileName'] = mapFile;
            }
            mi++;
        }
        mapOffset += num * sizeInt * 3;
    }

    return [maps, mapOffset - offset];
};

const getColorMap = (blob: Uint8Array, offset: number, num: number): Array<{color: string, position: number}> => {
    let colorMap = [];
    for (let i = 0; i < num; i++) {
        let pos = getUInt32(blob, offset);
        let color = getColor(blob, offset + sizeInt)[0];
        offset += sizeInt * 3; // there's a 4byte id (presumably) following each color.
        colorMap[i] = { 'color': color, 'position': pos };
    }

    return colorMap;
};

const getColor = (blob: Uint8Array, offset: number): [string, number] => {
    // Colors in AVS are saved as (A)RGB (where A is always 0).
    // Maybe one should use an alpha channel right away and set
    // that to 0xff? For now, no 4th byte means full alpha.
    let color = getUInt32(blob, offset).toString(16);
    let padding = '';
    for (let i = color.length; i < 6; i++) {
        padding += '0';
    }

    return ['#' + padding + color, sizeInt];
};

const getConvoFilter = (blob: Uint8Array, offset: number, dimensions: number[]): Object => {
    let size = dimensions[0] * dimensions[1];
    let data = new Array(size);
    for (let i = 0; i < size; i++, offset += sizeInt) {
        data[i] = getInt32(blob, offset)[0];
    }
    let matrix = { 'width': dimensions[0], 'height': dimensions[1], 'data': data };

    return [matrix, size * sizeInt];
};

// 'Text' needs this
const getSemiColSplit = (str: string): Object|string => {
    let strings = str.split(';');
    if (strings.length === 1) {
        return strings[0];
    } else {
        return strings;
    }
};

const getBufferNum = (code: number): Object => {
    if (code === 0) {
        return 'Current';
    }
    return code;
};


export {
    builtinMax,
    callFunction,
    cmpBytes,
    ConvertException,
    get256CodePFBI,
    getBit,
    getBool,
    getBoolified,
    getBufferNum,
    getCodeEIF,
    getCodeFBI,
    getCodeIFB,
    getCodeIFBP,
    getCodePFBI,
    getCodeSection,
    getColor,
    getColorList,
    getColorMap,
    getColorMaps,
    getConvoFilter,
    getFloat,
    getInt32,
    getMap1,
    getMap4,
    getMap8,
    getMapping,
    getNtCodeIFB,
    getNtCodeIFBP,
    getNtString,
    getRadioButton,
    getSemiColSplit,
    getSizeString,
    getUInt,
    getUInt32,
    getUInt64,
    lowerInitial,
    presetHeaderLength,
    printTable,
    removeSpaces,
    setHiddenStrings,
    setVerbosity,
};
