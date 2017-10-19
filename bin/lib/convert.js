"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Modules
var Components = require("./components");
var Util = require("./util");
var Table = require("./tables");
// Dependencies
var path_1 = require("path");
var fs_1 = require("fs");
var chalk = require("chalk");
// Constants
var sizeInt = 4;
var verbosity = 0; // log individual key:value fields
var componentTable = Components.builtin.concat(Components.dll);
var convertPreset = function (presetFile, file, args) {
    verbosity = args.debug;
    verbosity = args.silent ? -1 : verbosity;
    Util.setHiddenStrings(args.hidden);
    var modifiedTime = fs_1.statSync(file).mtime;
    var preset = {
        'name': path_1.basename(file, path_1.extname(file)),
        'date': modifiedTime.toISOString(),
    };
    var blob8 = new Uint8Array(presetFile);
    try {
        var clearFrame = decodePresetHeader(blob8.subarray(0, Util.presetHeaderLength));
        preset['clearFrame'] = clearFrame;
        var components = convertComponents(blob8.subarray(Util.presetHeaderLength));
        preset['components'] = components;
    }
    catch (e) {
        // TODO
        if (verbosity < 0)
            console.log(chalk.red("Error in '" + file + "'"));
        if (verbosity >= 1)
            console.log(chalk.red(e.stack));
        else
            console.log(chalk.red(e + '\n'));
        // if(e instanceof Util.ConvertException) {
        //     console.error('Error: '+e.message);
        //     return null;
        // } else {
        //     throw e;
        // }
    }
    return preset;
};
exports.convertPreset = convertPreset;
var convertComponents = function (blob) {
    var fp = 0;
    var components = [];
    var res;
    // read file as long as there are compontents left.
    // a component takes at least two int32s of space, if there are less bytes than that left,
    // ignore them. usually fp < blob.length should suffice but some rare presets have trailing
    // bytes. found in one preset's trailing colormap so far.
    while (fp <= blob.length - sizeInt * 2) {
        var code = Util.getUInt32(blob, fp);
        var i = getComponentIndex(code, blob, fp);
        var isDll = (code !== 0xfffffffe && code >= Util.builtinMax) ? 1 : 0;
        var size = getComponentSize(blob, fp + sizeInt + isDll * 32);
        // console.log("component size", size, "blob size", blob.length);
        if (i < 0) {
            res = { 'type': 'Unknown: (' + (-i) + ')' };
        }
        else {
            var offset = fp + sizeInt * 2 + isDll * 32;
            res = eval('decode_' + componentTable[i].func)(blob, offset, componentTable[i].fields, componentTable[i].name, componentTable[i].group, offset + size);
        }
        if (!res || typeof res !== 'object') {
            throw new Util.ConvertException('Unknown convert error');
        }
        components.push(res);
        fp += size + sizeInt * 2 + isDll * 32;
    }
    return components;
};
var getComponentIndex = function (code, blob, offset) {
    if (code < Util.builtinMax || code === 0xfffffffe) {
        for (var i = 0; i < componentTable.length; i++) {
            if (code === componentTable[i].code) {
                if (verbosity >= 1)
                    console.log(chalk.dim("Found component: " + componentTable[i].name + " (" + code + ")"));
                return i;
            }
        }
    }
    else {
        for (var i = Components.builtin.length; i < componentTable.length; i++) {
            if (componentTable[i].code instanceof Array &&
                Util.cmpBytes(blob, offset + sizeInt, componentTable[i].code)) {
                if (verbosity >= 1)
                    console.log(chalk.dim("Found component: " + componentTable[i].name));
                return i;
            }
        }
    }
    if (verbosity >= 1)
        console.log(chalk.dim("Found unknown component (code: " + code + ")"));
    return -code;
};
var getComponentSize = function (blob, offset) {
    return Util.getUInt32(blob, offset);
};
var decodePresetHeader = function (blob) {
    var presetHeader0_1 = [
        0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74,
        0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65,
        0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x31, 0x1A
    ];
    var presetHeader0_2 = [
        0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74,
        0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65,
        0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x32, 0x1A,
    ];
    if (!Util.cmpBytes(blob, /*offset*/ 0, presetHeader0_2) &&
        !Util.cmpBytes(blob, /*offset*/ 0, presetHeader0_1)) {
        throw new Util.ConvertException('Invalid preset header.');
    }
    return blob[Util.presetHeaderLength - 1] === 1; // 'Clear Every Frame'
};
//// component decode functions,
var decode_effectList = function (blob, offset, _, name) {
    var size = Util.getUInt32(blob, offset - sizeInt);
    var comp = {
        'type': name,
        'enabled': Util.getBit(blob, offset, 1)[0] !== 1,
        'clearFrame': Util.getBit(blob, offset, 0)[0] === 1,
        'input': Table['blendmodeIn'][blob[offset + 2]],
        'output': Table['blendmodeOut'][blob[offset + 3]],
    };
    var modebit = Util.getBit(blob, offset, 7)[0] === 1; // is true in all presets I know, probably only for truly ancient versions
    if (!modebit) {
        console.log(chalk.red('EL modebit is off!! If you\'re seeing this, send this .avs file in please!'));
    }
    var configSize = (modebit ? blob[offset + 4] : blob[offset]) + 1;
    if (configSize > 1) {
        comp['inAdjustBlend'] = Util.getUInt32(blob, offset + 5);
        comp['outAdjustBlend'] = Util.getUInt32(blob, offset + 9);
        comp['inBuffer'] = Util.getUInt32(blob, offset + 13);
        comp['outBuffer'] = Util.getUInt32(blob, offset + 17);
        comp['inBufferInvert'] = Util.getUInt32(blob, offset + 21) === 1;
        comp['outBufferInvert'] = Util.getUInt32(blob, offset + 25) === 1;
        comp['enableOnBeat'] = Util.getUInt32(blob, offset + 29) === 1;
        comp['onBeatFrames'] = Util.getUInt32(blob, offset + 33);
    }
    var effectList28plusHeader = [
        0x00, 0x40, 0x00, 0x00, 0x41, 0x56, 0x53, 0x20,
        0x32, 0x2E, 0x38, 0x2B, 0x20, 0x45, 0x66, 0x66,
        0x65, 0x63, 0x74, 0x20, 0x4C, 0x69, 0x73, 0x74,
        0x20, 0x43, 0x6F, 0x6E, 0x66, 0x69, 0x67, 0x00,
        0x00, 0x00, 0x00, 0x00
    ];
    var contentOffset = offset + configSize;
    if (Util.cmpBytes(blob, contentOffset, effectList28plusHeader)) {
        var codeOffset = offset + configSize + effectList28plusHeader.length;
        var codeSize = Util.getUInt32(blob, codeOffset);
        comp['code'] = Util.getCodeEIF(blob, codeOffset + sizeInt)[0];
        contentOffset = codeOffset + sizeInt + codeSize;
    }
    var content = convertComponents(blob.subarray(contentOffset, offset + size));
    comp['components'] = content;
    return comp;
};
// generic field decoding function that most components use.
var decode_generic = function (blob, offset, fields, name, group, end) {
    var comp = {
        'type': Util.removeSpaces(name),
        'group': group,
    };
    var keys = Object.keys(fields);
    var lastWasABitField = false;
    for (var i = 0; i < keys.length; i++) {
        if (offset >= end) {
            break;
        }
        var k = keys[i];
        var f = fields[k];
        // console.log(chalk.yellow(`key: ${k}, field: ${f}`));
        if (k.match(/^null[_0-9]*$/)) {
            offset += f;
            // 'null_: 0' resets bitfield continuity to allow several consecutive bitfields
            lastWasABitField = false;
            continue;
        }
        var size = 0;
        var value = void 0;
        var result = void 0;
        var num = typeof f === 'number';
        var other = typeof f === 'string';
        var array = f instanceof Array;
        if (num) {
            size = f;
            try {
                value = Util.getUInt(blob, offset, size);
            }
            catch (e) {
                throw new Util.ConvertException('Invalid field size: ' + f + '.');
            }
            lastWasABitField = false;
        }
        else if (other) {
            var func = 'get' + f;
            // console.log(chalk.yellow(`get: ${f}`));
            result = Util.callFunction(f, blob, offset);
            value = result[0];
            size = result[1];
            lastWasABitField = false;
        }
        else if (array && f.length >= 2) {
            if (f[0] === 'Bit') {
                if (lastWasABitField) {
                    offset -= 1; // compensate to stay in same bitfield
                }
                lastWasABitField = true;
            }
            else {
                lastWasABitField = false;
            }
            // console.log(chalk.yellow(`get: ${f[0]} ${f[1]} ${typeof f[1]}`));
            var tableName = Util.lowerInitial(f[0]);
            if (tableName in Table) {
                var tableKey = Util.getUInt(blob, offset, f[1]);
                value = Table[tableName][tableKey];
                size = f[1];
            }
            else {
                result = Util.callFunction(f[0], blob, offset, f[1]);
                size = result[1];
                value = result[0];
            }
            if (f[2]) {
                // console.log(chalk.yellow('get' + f[2]));
                tableName = Util.lowerInitial(f[2]);
                if (tableName in Table) {
                    value = Table[tableName][value];
                }
                else {
                    value = Util.callFunction(f[2], value);
                }
            }
        }
        // save value or function result of value in field
        if (k !== 'new_version') {
            comp[k] = value;
            if (verbosity >= 2) {
                console.log(chalk.dim('- key: ' + k + '\n- val: ' + value));
                if (k == 'code')
                    Util.printTable('- code', value);
                if (verbosity >= 3)
                    console.log(chalk.dim('- offset: ' + offset + '\n- size: ' + size));
                console.log();
            }
        }
        offset += size;
    }
    return comp;
};
var decode_versioned_generic = function (blob, offset, fields, name, group, end) {
    var version = blob[offset];
    if (version === 1) {
        return decode_generic(blob, offset, fields, name, group, end);
    }
    else {
        var oldFields = {};
        for (var key in fields) {
            if (key == 'new_version')
                continue;
            if (key == 'code')
                oldFields[key] = fields['code'].replace(/Code([IFBP]+)/, '256Code$1');
            else
                oldFields[key] = fields[key];
        }
        if (verbosity >= 3)
            console.log('oldFields, code changed to:', oldFields['code']);
        return decode_generic(blob, offset, oldFields, name, group, end);
    }
};
var decode_movement = function (blob, offset, _, name, group, end) {
    var comp = {
        'type': name,
        'group': group,
    };
    // the special value 0 is because 'old versions of AVS barf' if the id is > 15, so
    // AVS writes out 0 in that case, and sets the actual id at the end of the save block.
    var effectIdOld = Util.getUInt32(blob, offset);
    var effect = [];
    var code;
    var hidden;
    if (effectIdOld !== 0) {
        if (effectIdOld === 0x7fff) {
            var strAndSize = ["", 0];
            if (blob[offset + sizeInt] === 1) {
                strAndSize = Util.getSizeString(blob, offset + sizeInt + 1);
            }
            else {
                strAndSize = Util.getSizeString(blob, offset + sizeInt, 256);
            }
            offset += strAndSize[1];
            code = strAndSize[0];
            if (strAndSize.length > 2) {
                hidden = strAndSize[2];
            }
        }
        else {
            if (effectIdOld > 15) {
                if (verbosity >= 0) {
                    console.log(chalk.red("Movement: Unknown effect id " + effectIdOld + ". This is a known bug."));
                    console.log(chalk.green('If you know an AVS version that will display this Movement as anything else but "None", then please send it in!'));
                }
                effect = Table.movementEffect[0];
            }
            else {
                effect = Table.movementEffect[effectIdOld];
            }
        }
    }
    else {
        var effectIdNew = 0;
        if (offset + sizeInt * 6 < end) {
            effectIdNew = Util.getUInt32(blob, offset + sizeInt * 6); // 1*sizeInt, because of oldId=0, and 5*sizeint because of the other settings.
        }
        effect = Table.movementEffect[effectIdNew];
    }
    if (effect && effect.length > 0) {
        comp['builtinEffect'] = effect[0];
    }
    comp['output'] = Util.getUInt32(blob, offset + sizeInt) ? '50/50' : 'Replace';
    comp['sourceMapped'] = Util.getBool(blob, offset + sizeInt * 2, sizeInt)[0];
    comp['coordinates'] = Table.coordinates[Util.getUInt32(blob, offset + sizeInt * 3)];
    comp['bilinear'] = Util.getBool(blob, offset + sizeInt * 4, sizeInt)[0];
    comp['wrap'] = Util.getBool(blob, offset + sizeInt * 5, sizeInt)[0];
    if (effect && effect.length && effectIdOld !== 1 && effectIdOld !== 7) {
        code = effect[1];
        comp['coordinates'] = effect[2]; // overwrite
    }
    comp['code'] = code;
    if (hidden)
        comp['_hidden'] = hidden;
    return comp;
};
var decode_avi = function (blob, offset) {
    var comp = {
        'type': 'AVI',
        'group': 'Render',
        'enabled': Util.getBool(blob, offset, sizeInt)[0],
    };
    var strAndSize = Util.getNtString(blob, offset + sizeInt * 3);
    comp['file'] = strAndSize[0];
    comp['speed'] = Util.getUInt32(blob, offset + sizeInt * 5 + strAndSize[1]); // 0: fastest, 1000: slowest
    var beatAdd = Util.getUInt32(blob, offset + sizeInt * 3 + strAndSize[1]);
    if (beatAdd) {
        comp['output'] = '50/50';
    }
    else {
        comp['output'] = Util.getMap8(blob, offset + sizeInt, { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' });
    }
    comp['onBeatAdd'] = beatAdd;
    comp['persist'] = Util.getUInt32(blob, offset + sizeInt * 4 + strAndSize[1]); // 0-32
    return comp;
};
var decode_simple = function (blob, offset) {
    var comp = {
        'type': 'Simple',
        'group': 'Render',
    };
    var effect = Util.getUInt32(blob, offset);
    if (effect & (1 << 6)) {
        comp['audioSource'] = (effect & 2) ? 'Waveform' : 'Spectrum';
        comp['renderType'] = 'Dots';
    }
    else {
        switch (effect & 3) {
            case 0:// solid analyzer
                comp['audioSource'] = 'Spectrum';
                comp['renderType'] = 'Solid';
                break;
            case 1:// line analyzer
                comp['audioSource'] = 'Spectrum';
                comp['renderType'] = 'Lines';
                break;
            case 2:// line scope
                comp['audioSource'] = 'Waveform';
                comp['renderType'] = 'Lines';
                break;
            case 3:// solid scope
                comp['audioSource'] = 'Waveform';
                comp['renderType'] = 'Solid';
                break;
        }
    }
    comp['audioChannel'] = Table.audioChannel[(effect >> 2) & 3];
    comp['positionY'] = Table.positionY[(effect >> 4) & 3];
    comp['colors'] = Util.getColorList(blob, offset + sizeInt)[0];
    return comp;
};
//# sourceMappingURL=convert.js.map