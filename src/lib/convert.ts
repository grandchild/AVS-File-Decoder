// Modules
const Components = require('./components');
const Util = require('./util');
const Table = require('./tables');

// Dependencies
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

// Constants
const sizeInt = 4;
let verbose = false; // log individual key:value fields
let debug = false; // log individual key:value fields
var componentTable = Components.builtin.concat(Components.dll);

module.exports = {

    convertPreset(presetFile, file, args) {
        verbose = args.silent;
        debug = args.debug;

        var modifiedTime = fs.statSync(file).mtime;
        var preset = {
            'name': path.basename(file, path.extname(file)),
            'date': modifiedTime.toISOString(),
            // 'author': '',
        };
        var blob8 = new Uint8Array(presetFile);
        try {
            var clearFrame = this.decodePresetHeader(blob8.subarray(0, Util.presetHeaderLength));
            preset['clearFrame'] = clearFrame;
            var components = this.convertComponents(blob8.subarray(Util.presetHeaderLength));
            preset['components'] = components;
        } catch (e) {
            // TODO
            if (args.silent === true) console.log(chalk.red(`Error in "${file}"`))
            console.log(chalk.red(e + '\n'))
            // if(e instanceof Util.ConvertException) {
            //     console.error("Error: "+e.message);
            //     return null;
            // } else {
                // throw e;
            // }
        }
        return preset;
    },

    convertComponents(blob, args) {
        var fp = 0;
        var components = [];
        while (fp < blob.length) {
            var code = Util.getUInt32(blob, fp);
            var i = this.getComponentIndex(code, blob, fp);
            var isDll = code !== 0xfffffffe && code > Util.builtinMax;
            var size = this.getComponentSize(blob, fp + sizeInt + isDll * 32);
            if (i < 0) {
                var res = { 'type': 'Unknown: (' + (-i) + ')' };
            } else {
                var offset = fp + sizeInt * 2 + isDll * 32;
                var res = this["decode_" + componentTable[i].func](
                    blob,
                    offset,
                    componentTable[i].fields,
                    componentTable[i].name,
                    offset + size);
            }
            if (!res || typeof res !== "object") { // should not happen, decode functions should throw their own.
                throw new Util.ConvertException("Unknown convert error");
            }
            components.push(res);
            fp += size + sizeInt * 2 + isDll * 32;
        }
        return components;
    },

    getComponentIndex(code, blob, offset) {
        if (code < Util.builtinMax || code === 0xfffffffe) {
            for (var i = 0; i < componentTable.length; i++) {
                if (code === componentTable[i].code) {
                    if (debug === true)  console.log(chalk.dim(`Found component: ${componentTable[i].name} (${code})`));
                    return i;
                }
            };
        } else {
            for (var i = Components.builtin.length; i < componentTable.length; i++) {
                if (componentTable[i].code instanceof Array &&
                    Util.cmpBytes(blob, offset + sizeInt, componentTable[i].code)) {
                    if (debug === true) console.log(chalk.dim(`Found component: ${componentTable[i].name}`));
                    return i;
                }
            };
        }

        if (debug === true) console.log(chalk.dim(`Found unknown component (code: ${code})`));
        return -code;
    },

    getComponentSize(blob, offset) {
        return Util.getUInt32(blob, offset);
    },

    decodePresetHeader(blob) {
        var presetHeader0_1 = [ // reads: "Nullsoft AVS Preset 0.1 \x1A"
            0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74,
            0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65,
            0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x31, 0x1A
        ];
        var presetHeader0_2 = [ // reads: "Nullsoft AVS Preset 0.2 \x1A"
            0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74,
            0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65,
            0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x32, 0x1A,
        ];
        if (!Util.cmpBytes(blob, /*offset*/ 0, presetHeader0_2) &&
            !Util.cmpBytes(blob, /*offset*/ 0, presetHeader0_1)) { // 0.1 only if 0.2 failed because it's far rarer.
            throw new Util.ConvertException("Invalid preset header.");
        }
        return blob[Util.presetHeaderLength - 1] === 1; // "Clear Every Frame"
    },

    //// component decode functions,
    decode_effectList(blob, offset) {
        var size = Util.getUInt32(blob, offset - sizeInt);
        var comp = {
            'type': 'EffectList',
            'enabled': Util.getBit(blob, offset, 1)[0] !== 1,
            'clearFrame': Util.getBit(blob, offset, 0)[0] === 1,
            'input': Util.getBlendmodeIn(blob, offset + 2, 1)[0],
            'output': Util.getBlendmodeOut(blob, offset + 3, 1)[0],
            //ignore constant el config size of 36 bytes (9 x int32)
            'inAdjustBlend': Util.getUInt32(blob, offset + 5),
            'outAdjustBlend': Util.getUInt32(blob, offset + 9),
            'inBuffer': Util.getUInt32(blob, offset + 13),
            'outBuffer': Util.getUInt32(blob, offset + 17),
            'inBufferInvert': Util.getUInt32(blob, offset + 21) === 1,
            'outBufferInvert': Util.getUInt32(blob, offset + 25) === 1,
            'enableOnBeat': Util.getUInt32(blob, offset + 29) === 1,
            'onBeatFrames': Util.getUInt32(blob, offset + 33),
        };
        var effectList28plusHeader = [ // reads: .$..AVS 2.8+ Effect List Config....
            0x00, 0x40, 0x00, 0x00, 0x41, 0x56, 0x53, 0x20,
            0x32, 0x2E, 0x38, 0x2B, 0x20, 0x45, 0x66, 0x66,
            0x65, 0x63, 0x74, 0x20, 0x4C, 0x69, 0x73, 0x74,
            0x20, 0x43, 0x6F, 0x6E, 0x66, 0x69, 0x67, 0x00,
            0x00, 0x00, 0x00, 0x00
        ];
        var extOffset = offset + 37;
        var contSize = size - 37;
        var contOffset = extOffset;
        if (Util.cmpBytes(blob, extOffset, effectList28plusHeader)) {
            extOffset += effectList28plusHeader.length;
            var extSize = Util.getUInt32(blob, extOffset);
            contOffset += effectList28plusHeader.length + sizeInt + extSize;
            contSize = size - 37 - effectList28plusHeader.length - sizeInt - extSize;
            comp['codeEnabled'] = Util.getUInt32(blob, extOffset + sizeInt) === 1;
            var initSize = Util.getUInt32(blob, extOffset + sizeInt * 2);
            comp['init'] = Util.getSizeString(blob, extOffset + sizeInt * 2)[0];
            comp['frame'] = Util.getSizeString(blob, extOffset + sizeInt * 3 + initSize)[0];
        } //else: old Effect List format, inside components just start
        var content = this.convertComponents(blob.subarray(contOffset, contOffset + contSize));
        comp['components'] = content;
        return comp;
    },

    // generic field decoding function that most components use.
    decode_generic(blob, offset, fields, name, end) {
        var comp = {
            'type': Util.removeSpaces(name)
        };
        var keys = Object.keys(fields);
        var lastWasABitField = false;
        for (var i = 0; i < keys.length; i++) {
            if (offset >= end) {
                break;
            }
            var k = keys[i];
            var f = fields[k];
            if (k.match(/^null[_0-9]*$/)) {
                offset += f;
                // 'null_: 0' resets bitfield continuity to allow several consecutive bitfields
                lastWasABitField = false;
                continue;
            }
            var size = 0;
            var value, result;
            var number = typeof f === "number";
            var other = typeof f === "string";
            var array = f instanceof Array;
            if (number) {
                switch (f) {
                    case 1:
                        size = 1;
                        value = blob[offset];
                        break;
                    case sizeInt:
                        size = sizeInt;
                        value = Util.getUInt32(blob, offset);
                        break;
                    default:
                        throw new Util.ConvertException("Invalid field size: " + f + ".");
                }
                lastWasABitField = false;
            } else if (other) {
                var func = "get" + f;
                try {
                    // console.log(chalk.yellow("get" + f))
                    result = Util["get" + f](blob, offset);
                } catch (e) {
                    if (e.message.search(/has no method'/) >= 0) {
                        throw new Util.ConvertException("Method '" + f + "' was not found. (correct capitalization?)");
                    } else {
                        throw e; }
                }
                value = result[0];
                size = result[1];
                lastWasABitField = false;
            } else if (f && f.length >= 2) {
                if (f[0] === "Bit") {
                    if (lastWasABitField) {
                        offset -= 1; // compensate to stay in same bitfield
                    }
                    lastWasABitField = true;
                } else {
                    lastWasABitField = false;
                }
                try {
                    // console.log(chalk.yellow("get" + f))
                    // if (f[0] === "MultiFilterEffect") console.log(chalk.green("get" + f[0] + `(${blob}, ${offset}, ${f[1]})`));
                    result = Util["get" + f[0]](blob, offset, f[1]);
                    value = result[0];
                    if (f[2]) { // further processing if wanted
                        // console.log(chalk.yellow("get" + f[2]))
                        value = Util["get" + f[2]](value);
                    }
                } catch (e) {
                    if (e.message.search(/has no method/) >= 0) {
                        throw new Util.ConvertException("Method '" + f + "' was not found. (correct capitalization?)"); } else {
                        throw e; }
                }
                size = result[1];
            }

            // save value or function result of value in field
            comp[k] = value;
            if (debug === true) console.log(chalk.dim("- key: " + k + "\n- val: " + value + "\n- offset: " + offset + "\n"));
            offset += size;
        };
        return comp;
    },

    decode_movement(blob, offset) {
        var comp = {
            'type': 'Movement',
        };
        // the special value 0 is because "old versions of AVS barf" if the id is > 15, so
        // AVS writes out 0 in that case, and sets the actual id at the end of the save block.
        var effectIdOld = Util.getUInt32(blob, offset);
        var effect = [];
        var code;
        if (effectIdOld !== 0) {
            if (effectIdOld === 32767) {
                var strAndSize = Util.getSizeString(blob, offset + sizeInt + 1) // for some reason there is a single byte reading '0x01' before custom code.
                offset += strAndSize[1];
                code = strAndSize[0];
            } else {
                effect = Table.movementEffects[effectIdOld];
            }
        } else {
            var effectIdNew = Util.getUInt32(blob, offset + sizeInt * 6); // 1*sizeInt, because of oldId=0, and 5*sizeint because of the other settings.
            effect = Table.movementEffects[effectIdNew];
        }
        if (effect.length > 0) {
            comp["builtinEffect"] = effect[0];
        }
        comp["output"] = Util.getUInt32(blob, offset + sizeInt) ? "50/50" : "Replace";
        comp["sourceMapped"] = Util.getBool(blob, offset + sizeInt * 2, sizeInt)[0];
        comp["coordinates"] = Util.getCoordinates(blob, offset + sizeInt * 3, sizeInt);
        comp["bilinear"] = Util.getBool(blob, offset + sizeInt * 4, sizeInt)[0];
        comp["wrap"] = Util.getBool(blob, offset + sizeInt * 5, sizeInt)[0];
        if (effect.length && effectIdOld !== 1 && effectIdOld !== 7) { // 'slight fuzzify' and 'blocky partial out' have no script representation.
            code = effect[1];
            comp["coordinates"] = effect[2] // overwrite
        }
        comp["code"] = code;
        return comp;
    },

    decode_avi(blob, offset) {
        var comp = {
            "type": "AVI",
            "enabled": Util.getBool(blob, offset, sizeInt)[0],
        };
        var strAndSize = Util.getNtString(blob, offset + sizeInt * 3);
        comp["file"] = Util.strAndSize[0];
        comp["speed"] = Util.getUInt32(blob, offset + sizeInt * 5 + strAndSize[1]); // 0: fastest, 1000: slowest
        var beatAdd = Util.getUInt32(blob, offset + sizeInt * 3 + strAndSize[1]);
        if (beatAdd) {
            comp["output"] = "50/50";
        } else {
            comp["output"] = getMap8(blob, offset + sizeInt, { 0: "Replace", 1: "Additive", 0x100000000: "50/50" });
        }
        comp["onBeatAdd"] = beatAdd;
        comp["persist"] = Util.getUInt32(blob, offset + sizeInt * 4 + strAndSize[1]); // 0-32
        return comp;
    },

    decode_simple(blob, offset) {
        var comp = {
            'type': 'Simple',
        };
        var effect = Util.getUInt32(blob, offset);
        if (effect & (1 << 6)) {
            comp["audioSource"] = (effect & 2) ? "Waveform" : "Spectrum";
            comp["renderType"] = "Dots";
        } else {
            switch (effect & 3) {
                case 0: // solid analyzer
                    comp["audioSource"] = "Spectrum";
                    comp["renderType"] = "Solid";
                    break;
                case 1: // line analyzer
                    comp["audioSource"] = "Spectrum";
                    comp["renderType"] = "Lines";
                    break;
                case 2: // line scope
                    comp["audioSource"] = "Waveform";
                    comp["renderType"] = "Lines";
                    break;
                case 3: // solid scope
                    comp["audioSource"] = "Waveform";
                    comp["renderType"] = "Solid";
                    break;
            }
        }
        comp["audioChannel"] = Util.getAudioChannel((effect >> 2) & 3);
        comp["positionY"] = Util.getPositionY((effect >> 4) & 3);
        comp["colors"] = Util.getColorList(blob, offset + sizeInt)[0];
        return comp;
    }
}
