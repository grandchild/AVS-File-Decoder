// Modules
const Table = require('./tables');

// Constants
const sizeInt = 4;
const allFields = true;

module.exports = {
    presetHeaderLength: 25,
    builtinMax: 16384,

    ConvertException(message) {
        this.message = message;
        this.name = "ConvertException";
    },

    cmpBytes(arr, offset, test) {
        for (var i = 0; i < test.length; i++) {
            if (test[i] === null) {
                continue; // null means 'any value' - a variable
            }
            if (arr[i + offset] !== test[i]) {
                return false;
            }
        }
        return true;
    },

    getBit(blob, offset, pos) {
        if (pos instanceof Array) {
            if (pos.length !== 2) new this.ConvertException("Wrong Bitfield range");
            var mask = (2 << (pos[1] - pos[0])) - 1;
            return [(blob[offset] >> pos[0]) & mask, 1];
        } else {
            return [((blob[offset] >> pos) & 1), 1];
        }
    },

    getUInt32(blob, offset) {
        if (!offset) offset = 0;
        var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
        return new Uint32Array(array, 0, 1)[0];
    },

    getInt32(blob, offset) {
        if (!offset) offset = 0;
        var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
        return [new Int32Array(array, 0, 1)[0], 4];
    },

    getUInt64(blob, offset) {
        if (!offset) offset = 0;
        var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt * 2);
        var two32 = new Uint32Array(array, 0, 2);
        return two32[0] + two32[1] * 0x100000000;
    },

    getFloat32(blob, offset) {
        if (!offset) offset = 0;
        var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + sizeInt);
        return [new Float32Array(array, 0, 1)[0], 4];
    },

    getBool(blob, offset, size) {
        var val = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [val !== 0, size];
    },

    getBoolified(num) {
        return num == 0 ? false : true;
    },

    getSizeString(blob, offset, size) {
        var add = 0;
        var result = "";
        if (!size) {
            size = this.getUInt32(blob, offset);
            add = sizeInt;
        }
        var end = offset + size + add;
        var i = offset + add;
        var c = blob[i];
        while (c > 0 && i < end) {
            result += String.fromCharCode(c);
            c = blob[++i];
        }
        return [result, size + add];
    },

    getNtString(blob, offset) {
        var result = "";
        var i = offset;
        var c = blob[i];
        while (c > 0) {
            result += String.fromCharCode(c);
            c = blob[++i];
        }
        return [result, i - offset + 1];
    },

    removeSpaces(str) {
        return str.replace(/[ ]/g, '');
    },

    getMap1(blob, offset, map) {
        return [this.getMapping(map, blob[offset]), 1];
    },

    getMap4(blob, offset, map) {
        return [this.getMapping(map, this.getUInt32(blob, offset)), sizeInt];
    },
    
    getMap8(blob, offset, map) {
        return [this.getMapping(map, this.getUInt64(blob, offset)), sizeInt * 2];
    },

    getRadioButton(blob, offset, map) {
        var key = 0;
        for (var i = 0; i < map.length; i++) {
            var on = this.getUInt32(blob, offset + sizeInt * i) !== 0;
            if (on) { // in case of (erroneous) multiple selections, the last one selected wins
                key = on * (i + 1);
            }
        };
        return [this.getMapping(map, key), sizeInt * map.length];
    },

    getMapping(map, key) {
        var value = map[key];
        if (value === undefined) {
            throw new this.ConvertException("Map: A value for key '" + key + "' does not exist.");
        } else {
            return value;
        }
    },

    // Point, Frame, Beat, Init code fields - reorder to I,F,B,P order.
    getCodePFBI(blob, offset) {
        var map = [ // this is the sort map, lines are 'need'-sorted with 'is'-index.
            ["init", 3],
            ["perFrame", 1],
            ["onBeat", 2],
            ["perPoint", 0],
        ];
        return this.getCodeSection(blob, offset, map);
    },

    // Frame, Beat, Init code fields - reorder to I,F,B order.
    getCodeFBI(blob, offset) {
        var map = [ // see PFBI
            ["init", 2],
            ["perFrame", 1],
            ["onBeat", 0],
        ];
        return this.getCodeSection(blob, offset, map);
    },

    getCodeIFBP(blob, offset) {
        var map = [ // in this case the mapping is pretty redundant. the fields are already in order.
            ["init", 0],
            ["perFrame", 1],
            ["onBeat", 2],
            ["perPoint", 3],
        ];
        return this.getCodeSection(blob, offset, map);
    },

    getCodeIFB(blob, offset) {
        var map = [ // see IFBP
            ["init", 0],
            ["perFrame", 1],
            ["onBeat", 2],
        ];
        return this.getCodeSection(blob, offset, map);
    },

    // used only by 'Global Variables'
    getNtCodeIFB(blob, offset) {
        var map = [
            ["init", 0],
            ["perFrame", 1],
            ["onBeat", 2],
        ];
        return this.getCodeSection(blob, offset, map, /*nullterminated*/ true);
    },

    // used only by 'Triangle'
    getNtCodeIFBP(blob, offset) {
        var map = [
            ["init", 0],
            ["perFrame", 1],
            ["onBeat", 2],
            ["perPoint", 3],
        ];
        return this.getCodeSection(blob, offset, map, /*nullterminated*/ true);
    },

    getCodeSection(blob, offset, map, nt) {
        var strings = new Array(map.length);
        var totalSize = 0;
        for (var i = 0, p = offset; i < map.length; i++, p += strAndSize[1]) {
            var strAndSize = nt ? this.getNtString(blob, p) : this.getSizeString(blob, p);
            totalSize += strAndSize[1];
            strings[i] = strAndSize[0];
        };
        var code = {};
        for (var i = 0; i < strings.length; i++) {
            code[map[i][0]] = strings[map[i][1]];
        };
        return [code, totalSize];
    },

    getColorList(blob, offset) {
        var colors = [];
        var num = this.getUInt32(blob, offset);
        var size = sizeInt + num * sizeInt;
        while (num > 0) {
            offset += sizeInt;
            colors.push(this.getColor(blob, offset)[0]);
            num--;
        }
        return [colors, size];
    },

    getColorMaps(blob, offset) {
        var mapOffset = offset + 480;
        var maps = [];
        var headerSize = 60; // 4B enabled, 4B num, 4B id, 48B filestring
        var mi = 0; // map index, might be != i when maps are skipped
        for (var i = 0; i < 8; i++) {
            var enabled = this.getBool(blob, offset + headerSize * i, sizeInt)[0];
            var num = this.getUInt32(blob, offset + headerSize * i + sizeInt);
            var map = this.getColorMap(blob, mapOffset, num);
            // check if it's a disabled default {0: #000000, 255: #ffffff} map, and only save it if not.
            if (!enabled && map.length === 2 && map[0].color === "#000000" && map[0].position === 0 && map[1].color === "#ffffff" && map[1].position === 255) {
                // skip this map
            } else {
                maps[mi] = {
                    "index": i,
                    "enabled": enabled,
                };
                if (allFields) {
                    var id = this.getUInt32(blob, offset + headerSize * i + sizeInt * 2) // id of the map - not really needed.
                    var mapFile = this.getNtString(blob, offset + headerSize * i + sizeInt * 3)[0];
                    maps[mi]["id"] = id;
                    maps[mi]["fileName"] = mapFile;
                }
                maps[mi]["map"] = map;
                mi++;
            }
            mapOffset += num * sizeInt * 3;
        };
        return [maps, mapOffset - offset];
    },

    getColorMap(blob, offset, num) {
        var colorMap = [];
        for (var i = 0; i < num; i++) {
            var pos = this.getUInt32(blob, offset);
            var color = this.getColor(blob, offset + sizeInt)[0];
            offset += sizeInt * 3; // there's a 4byte id (presumably) following each color.
            colorMap[i] = { "color": color, "position": pos };
        };
        return colorMap;
    },

    getColor(blob, offset) {
        // Colors in AVS are saved as (A)RGB (where A is always 0).
        // Maybe one should use an alpha channel right away and set
        // that to 0xff? For now, no 4th byte means full alpha.
        var color = this.getUInt32(blob, offset).toString(16);
        var padding = "";
        for (var i = color.length; i < 6; i++) {
            padding += "0";
        };
        return ["#" + padding + color, sizeInt];
    },

    getConvoFilter(blob, offset, dimensions) {
        if (!(dimensions instanceof Array) && dimensions.length !== 2) {
            throw new this.ConvertException("ConvoFilter: Size must be array with x and y dimensions in dwords.");
        }
        var size = dimensions[0] * dimensions[1];
        var data = new Array(size);
        for (var i = 0; i < size; i++, offset += sizeInt) {
            data[i] = this.getInt32(blob, offset)[0];
        };
        var matrix = { "width": dimensions[0], "height": dimensions[1], "data": data };
        return [matrix, size * sizeInt];
    },

    // 'Text' needs this
    getSemiColSplit(str) {
        var strings = str.split(';');
        if (strings.length === 1) {
            return strings[0];
        } else {
            return strings;
        }
    },

    getBlendmodeIn(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [Table.blendmodesIn[code], size];
    },

    getBlendmodeOut(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [Table.blendmodesOut[code], size];
    },

    getBlendmodeBuffer(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [Table.blendmodesBuffer[code], size];
    },

    getBlendmodeRender(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [Table.blendmodesRender[code], size];
    },

    getBlendmodePicture2(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [Table.blendmodesPicture2[code], size];
    },

    getBlendmodeColorMap(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [Table.blendmodesColorMap[code], size];
    },

    getBlendmodeTexer(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [Table.blendmodesTexer[code], size];
    },

    getKeyColorMap(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [Table.keysColorMap[code], size];
    },

    getCycleModeColorMap(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [Table.cycleModesColorMap[code], size];
    },

    // Buffer modes
    getBufferMode(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [Table.buffermodes[code], size];
    },

    getBufferNum(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        if (code === 0) return ["Current", size];
        else return [this.getUInt32(blob, offset), size];
    },

    getCoordinates(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [Table.coordinates[code], size];
    },

    getDrawMode(blob, offset, size) {
        var code = size === 1 ? blob[offset] : this.getUInt32(blob, offset);
        return [Table.drawModes[code], size];
    },

    getAudioChannel(code) {
        return Table.audioChannels[code];
    },

    getAudioSource(code) {
        return Table.audioSources[code];
    },

    getPositionX(code) {
        return Table.positionsX[code];
    },

    getPositionY(code) {
        return Table.positionsY[code];
    },

    getMultiFilterEffect(code) {
        return Table.multiFilterEffect[code];
    }
}
