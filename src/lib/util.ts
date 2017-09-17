// Modules
import * as Table from './tables';

// Constants
const sizeInt = 4;
const allFields = true;
const presetHeaderLength = 25;
const builtinMax = 16384;

const ConvertException = (message) => {
    this.message = message;
    this.name = 'ConvertException';
};

const cmpBytes = (arr, offset, test) => {
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

const getBit = (blob, offset, pos) => {
    if (pos instanceof Array) {
        if (pos.length !== 2) new this.ConvertException('Wrong Bitfield range');
        let mask = (2 << (pos[1] - pos[0])) - 1;
        return [(blob[offset] >> pos[0]) & mask, 1];
    } else {
        return [((blob[offset] >> pos) & 1), 1];
    }
};

const getUInt32 = (blob, offset) => {
    if (!offset) offset = 0;
    let array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
    return new Uint32Array(array, 0, 1)[0];
};

const getInt32 = (blob, offset) => {
    if (!offset) offset = 0;
    let array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
    return [new Int32Array(array, 0, 1)[0], 4];
};

const getUInt64 = (blob, offset) => {
    if (!offset) offset = 0;
    let array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt * 2);
    let two32 = new Uint32Array(array, 0, 2);
    return two32[0] + two32[1] * 0x100000000;
};

const getFloat32 = (blob, offset) => {
    if (!offset) offset = 0;
    let array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
    return [new Float32Array(array, 0, 1)[0], 4];
};

const getBool = (blob, offset, size) => {
    let val = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [val !== 0, size];
};

const getBoolified = (num) => {
    return num === 0 ? false : true;
};

const getSizeString = (blob, offset, size = null /* TODO: @grandchild*/) => {
    let add = 0;
    let result = '';
    if (!size) {
        size = this.getUInt32(blob, offset);
        add = sizeInt;
    }
    let end = offset + size + add;
    let i = offset + add;
    let c = blob[i];
    while (c > 0 && i < end) {
        result += String.fromCharCode(c);
        c = blob[++i];
    }
    return [result, size + add];
};

const getNtString = (blob, offset) => {
    let result = '';
    let i = offset;
    let c = blob[i];
    while (c > 0) {
        result += String.fromCharCode(c);
        c = blob[++i];
    }
    return [result, i - offset + 1];
};

const removeSpaces = (str) => {
    return str.replace(/[ ]/g, '');
};

const getMap1 = (blob, offset, map) => {
    return [this.getMapping(map, blob[offset]), 1];
};

const getMap4 = (blob, offset, map) => {
    return [this.getMapping(map, this.getUInt32(blob, offset)), sizeInt];
};

const getMap8 = (blob, offset, map) => {
    return [this.getMapping(map, this.getUInt64(blob, offset)), sizeInt * 2];
};

const getRadioButton = (blob, offset, map) => {
    let key = 0;
    for (let i = 0; i < map.length; i++) {
        let on = this.getUInt32(blob, offset + sizeInt * i) !== 0;
        if (on) { // in case of (erroneous) multiple selections, the last one selected wins
            key = on * (i + 1);
        }
    }
    return [this.getMapping(map, key), sizeInt * map.length];
};

const getMapping = (map, key) => {
    let value = map[key];
    if (value === undefined) {
        throw new this.ConvertException(`Map: A value for key '${key}' does not exist.`);
    } else {
        return value;
    }
};

// Point, Frame, Beat, Init code fields - reorder to I,F,B,P order.
const getCodePFBI = (blob, offset) => {
    let map = [ // this is the sort map, lines are 'need'-sorted with 'is'-index.
        ['init', 3],
        ['perFrame', 1],
        ['onBeat', 2],
        ['perPoint', 0],
    ];
    return this.getCodeSection(blob, offset, map);
};

// Frame, Beat, Init code fields - reorder to I,F,B order.
const getCodeFBI = (blob, offset) => {
    let map = [ // see PFBI
        ['init', 2],
        ['perFrame', 1],
        ['onBeat', 0],
    ];
    return this.getCodeSection(blob, offset, map);
};

const getCodeIFBP = (blob, offset) => {
    let map = [ // in this case the mapping is pretty redundant. the fields are already in order.
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
        ['perPoint', 3],
    ];
    return this.getCodeSection(blob, offset, map);
};

const getCodeIFB = (blob, offset) => {
    let map = [ // see IFBP
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
    ];
    return this.getCodeSection(blob, offset, map);
};

// used only by 'Global letiables'
const getNtCodeIFB = (blob, offset) => {
    let map = [
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
    ];
    return this.getCodeSection(blob, offset, map, /*nullterminated*/ true);
};

// used only by 'Triangle'
const getNtCodeIFBP = (blob, offset) => {
    let map = [
        ['init', 0],
        ['perFrame', 1],
        ['onBeat', 2],
        ['perPoint', 3],
    ];
    return this.getCodeSection(blob, offset, map, /*nullterminated*/ true);
};

const getCodeSection = (blob, offset, map, nt) => {
    let strings = new Array(map.length);
    let totalSize = 0;
    let strAndSize;
    for (let i = 0, p = offset; i < map.length; i++, p += strAndSize[1]) {
        strAndSize = nt ? this.getNtString(blob, p) : this.getSizeString(blob, p);
        totalSize += strAndSize[1];
        strings[i] = strAndSize[0];
    }
    let code = {};
    for (let i = 0; i < strings.length; i++) {
        code[map[i][0]] = strings[map[i][1]];
    }
    return [code, totalSize];
};

const getColorList = (blob, offset) => {
    let colors = [];
    let num = this.getUInt32(blob, offset);
    let size = sizeInt + num * sizeInt;
    while (num > 0) {
        offset += sizeInt;
        colors.push(this.getColor(blob, offset)[0]);
        num--;
    }
    return [colors, size];
};

const getColorMaps = (blob, offset) => {
    let mapOffset = offset + 480;
    let maps = [];
    let headerSize = 60; // 4B enabled, 4B num, 4B id, 48B filestring
    let mi = 0; // map index, might be != i when maps are skipped
    for (let i = 0; i < 8; i++) {
        let enabled = this.getBool(blob, offset + headerSize * i, sizeInt)[0];
        let num = this.getUInt32(blob, offset + headerSize * i + sizeInt);
        let map = this.getColorMap(blob, mapOffset, num);
        // check if it's a disabled default {0: #000000, 255: #ffffff} map, and only save it if not.
        if (!enabled && map.length === 2 && map[0].color === '#000000' && map[0].position === 0 && map[1].color === '#ffffff' && map[1].position === 255) {
            // skip this map
        } else {
            maps[mi] = {
                'index': i,
                'enabled': enabled,
            };
            if (allFields) {
                let id = this.getUInt32(blob, offset + headerSize * i + sizeInt * 2); // id of the map - not really needed.
                let mapFile = this.getNtString(blob, offset + headerSize * i + sizeInt * 3)[0];
                maps[mi]['id'] = id;
                maps[mi]['fileName'] = mapFile;
            }
            maps[mi]['map'] = map;
            mi++;
        }
        mapOffset += num * sizeInt * 3;
    }
    return [maps, mapOffset - offset];
};

const getColorMap = (blob, offset, num) => {
    let colorMap = [];
    for (let i = 0; i < num; i++) {
        let pos = this.getUInt32(blob, offset);
        let color = this.getColor(blob, offset + sizeInt)[0];
        offset += sizeInt * 3; // there's a 4byte id (presumably) following each color.
        colorMap[i] = { 'color': color, 'position': pos };
    }
    return colorMap;
};

const getColor = (blob, offset) => {
    // Colors in AVS are saved as (A)RGB (where A is always 0).
    // Maybe one should use an alpha channel right away and set
    // that to 0xff? For now, no 4th byte means full alpha.
    let color = this.getUInt32(blob, offset).toString(16);
    let padding = '';
    for (let i = color.length; i < 6; i++) {
        padding += '0';
    }
    return ['#' + padding + color, sizeInt];
};

const getConvoFilter = (blob, offset, dimensions) => {
    if (!(dimensions instanceof Array) && dimensions.length !== 2) {
        throw new this.ConvertException('ConvoFilter: Size must be array with x and y dimensions in dwords.');
    }
    let size = dimensions[0] * dimensions[1];
    let data = new Array(size);
    for (let i = 0; i < size; i++, offset += sizeInt) {
        data[i] = this.getInt32(blob, offset)[0];
    }
    let matrix = { 'width': dimensions[0], 'height': dimensions[1], 'data': data };
    return [matrix, size * sizeInt];
};

// 'Text' needs this
const getSemiColSplit = (str) => {
    let strings = str.split(';');
    if (strings.length === 1) {
        return strings[0];
    } else {
        return strings;
    }
};

const getBlendmodeIn = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [Table.blendmodesIn[code], size];
};

const getBlendmodeOut = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [Table.blendmodesOut[code], size];
};

const getBlendmodeBuffer = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [Table.blendmodesBuffer[code], size];
};

const getBlendmodeRender = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [Table.blendmodesRender[code], size];
};

const getBlendmodePicture2 = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [Table.blendmodesPicture2[code], size];
};

const getBlendmodeColorMap = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [Table.blendmodesColorMap[code], size];
};

const getBlendmodeTexer = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [Table.blendmodesTexer[code], size];
};

const getKeyColorMap = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [Table.keysColorMap[code], size];
};

const getCycleModeColorMap = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [Table.cycleModesColorMap[code], size];
};

// Buffer modes
const getBufferMode = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [Table.buffermodes[code], size];
};

const getBufferNum = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    if (code === 0) return ['Current', size];
    else return [this.getUInt32(blob, offset), size];
};

const getCoordinates = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [Table.coordinates[code], size];
};

const getDrawMode = (blob, offset, size) => {
    let code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
    return [Table.drawModes[code], size];
};

const getAudioChannel = (code) => {
    return Table.audioChannels[code];
};

const getAudioSource = (code) => {
    return Table.audioSources[code];
};

const getPositionX = (code) => {
    return Table.positionsX[code];
};

const getPositionY = (code) => {
    return Table.positionsY[code];
};

const getMultiFilterEffect = (code) => {
    return Table.multiFilterEffect[code];
};

export {
    builtinMax,
    cmpBytes,
    ConvertException,
    getAudioChannel,
    getAudioSource,
    getBit,
    getBlendmodeBuffer,
    getBlendmodeColorMap,
    getBlendmodeIn,
    getBlendmodeOut,
    getBlendmodePicture2,
    getBlendmodeRender,
    getBlendmodeTexer,
    getBool,
    getBoolified,
    getBufferMode,
    getBufferNum,
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
    getCoordinates,
    getCycleModeColorMap,
    getDrawMode,
    getFloat32,
    getInt32,
    getKeyColorMap,
    getMap1,
    getMap4,
    getMap8,
    getMapping,
    getMultiFilterEffect,
    getNtCodeIFB,
    getNtCodeIFBP,
    getNtString,
    getPositionX,
    getPositionY,
    getRadioButton,
    getSemiColSplit,
    getSizeString,
    getUInt32,
    getUInt64,
    presetHeaderLength,
    removeSpaces,
};
