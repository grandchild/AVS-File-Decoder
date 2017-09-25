// Modules
import * as Components from './components';
import * as Util from './util';
import * as Table from './tables';

// Dependencies
import { basename, extname } from 'path';
import { statSync } from 'fs';
import * as chalk from 'chalk';

// Constants
const sizeInt = 4;
let verbose = false; // log individual key:value fields
let debug = false; // log individual key:value fields
const componentTable = Components.builtin.concat(Components.dll);

const convertPreset = (presetFile: Object, file: string, args: Object): Object => {
    verbose = args.silent;
    debug = args.debug;

    let modifiedTime = statSync(file).mtime;
    let preset = {
        'name': basename(file, extname(file)),
        'date': modifiedTime.toISOString(),
        // 'author': '',
    };
    let blob8 = new Uint8Array(presetFile);
    try {
        let clearFrame = this.decodePresetHeader(blob8.subarray(0, Util.presetHeaderLength));
        preset['clearFrame'] = clearFrame;
        let components = this.convertComponents(blob8.subarray(Util.presetHeaderLength));
        preset['components'] = components;
    } catch (e) {
        // TODO
        if (args.silent === true) console.log(chalk.red(`Error in '${file}'`));
        console.log(chalk.red(e + '\n'));
        // if(e instanceof Util.ConvertException) {
        //     console.error('Error: '+e.message);
        //     return null;
        // } else {
            // throw e;
        // }
    }

    return preset;
};

const convertComponents = (blob: Object): Object => {
    let fp = 0;
    let components = [];
    let res;
    while (fp < blob.length) {
        let code = Util.getUInt32(blob, fp);
        let i = this.getComponentIndex(code, blob, fp);
        let isDll = code !== 0xfffffffe && code > Util.builtinMax;
        let size = this.getComponentSize(blob, fp + sizeInt + isDll * 32);
        if (i < 0) {
            res = { 'type': 'Unknown: (' + (-i) + ')' };
        } else {
            let offset = fp + sizeInt * 2 + isDll * 32;
            res = this['decode_' + componentTable[i].func](
                blob,
                offset,
                componentTable[i].fields,
                componentTable[i].name,
                componentTable[i].group,
                offset + size);
        }
        if (!res || typeof res !== 'object') { // should not happen, decode functions should throw their own.
            throw new Util.ConvertException('Unknown convert error');
        }
        components.push(res);
        fp += size + sizeInt * 2 + isDll * 32;
    }

    return components;
};

const getComponentIndex = (code: number, blob: Object, offset: number): number => {
    if (code < Util.builtinMax || code === 0xfffffffe) {
        for (let i = 0; i < componentTable.length; i++) {
            if (code === componentTable[i].code) {
                if (debug === true)  console.log(chalk.dim(`Found component: ${componentTable[i].name} (${code})`));

                return i;
            }
        }
    } else {
        for (let i = Components.builtin.length; i < componentTable.length; i++) {
            if (componentTable[i].code instanceof Array &&
                Util.cmpBytes(blob, offset + sizeInt, componentTable[i].code)) {
                if (debug === true) console.log(chalk.dim(`Found component: ${componentTable[i].name}`));

                return i;
            }
        }
    }

    if (debug === true) console.log(chalk.dim(`Found unknown component (code: ${code})`));

    return -code;
};

const getComponentSize = (blob: Object, offset: number) => {
    return Util.getUInt32(blob, offset);
};

const decodePresetHeader = (blob: Object): boolean => {
    let presetHeader0_1 = [ // reads: 'Nullsoft AVS Preset 0.1 \x1A'
        0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74,
        0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65,
        0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x31, 0x1A
    ];
    let presetHeader0_2 = [ // reads: 'Nullsoft AVS Preset 0.2 \x1A'
        0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74,
        0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65,
        0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x32, 0x1A,
    ];
    if (!Util.cmpBytes(blob, /*offset*/ 0, presetHeader0_2) &&
        !Util.cmpBytes(blob, /*offset*/ 0, presetHeader0_1)) { // 0.1 only if 0.2 failed because it's far rarer.
        throw new Util.ConvertException('Invalid preset header.');
    }

    return blob[Util.presetHeaderLength - 1] === 1; // 'Clear Every Frame'
};

//// component decode functions,
const decode_effectList = (blob: Object, offset: number): Object => {
    let size = Util.getUInt32(blob, offset - sizeInt);
    let comp = {
        'type': 'EffectList',
        'enabled': Util.getBit(blob, offset, 1)[0] !== 1,
        'clearFrame': Util.getBit(blob, offset, 0)[0] === 1,
        'input': Util.getBlendmodeIn(blob, offset + 2, 1)[0],
        'output': Util.getBlendmodeOut(blob, offset + 3, 1)[0],
        // ignore constant el config size of 36 bytes (9 x int32)
        'inAdjustBlend': Util.getUInt32(blob, offset + 5),
        'outAdjustBlend': Util.getUInt32(blob, offset + 9),
        'inBuffer': Util.getUInt32(blob, offset + 13),
        'outBuffer': Util.getUInt32(blob, offset + 17),
        'inBufferInvert': Util.getUInt32(blob, offset + 21) === 1,
        'outBufferInvert': Util.getUInt32(blob, offset + 25) === 1,
        'enableOnBeat': Util.getUInt32(blob, offset + 29) === 1,
        'onBeatFrames': Util.getUInt32(blob, offset + 33),
    };
    let effectList28plusHeader = [ // reads: .$..AVS 2.8+ Effect List Config....
        0x00, 0x40, 0x00, 0x00, 0x41, 0x56, 0x53, 0x20,
        0x32, 0x2E, 0x38, 0x2B, 0x20, 0x45, 0x66, 0x66,
        0x65, 0x63, 0x74, 0x20, 0x4C, 0x69, 0x73, 0x74,
        0x20, 0x43, 0x6F, 0x6E, 0x66, 0x69, 0x67, 0x00,
        0x00, 0x00, 0x00, 0x00
    ];
    let extOffset = offset + 37;
    let contSize = size - 37;
    let contOffset = extOffset;
    if (Util.cmpBytes(blob, extOffset, effectList28plusHeader)) {
        extOffset += effectList28plusHeader.length;
        let extSize = Util.getUInt32(blob, extOffset);
        contOffset += effectList28plusHeader.length + sizeInt + extSize;
        contSize = size - 37 - effectList28plusHeader.length - sizeInt - extSize;
        comp['code'] = {}
        comp['code']['enabled'] = Util.getUInt32(blob, extOffset + sizeInt) === 1;
        let initSize = Util.getUInt32(blob, extOffset + sizeInt * 2);
        comp['code']['init'] = Util.getSizeString(blob, extOffset + sizeInt * 2)[0];
        comp['code']['frame'] = Util.getSizeString(blob, extOffset + sizeInt * 3 + initSize)[0];
    } // else: old Effect List format, inside components just start
    let content = this.convertComponents(blob.subarray(contOffset, contOffset + contSize));
    comp['components'] = content;

    return comp;
};

// generic field decoding function that most components use.
const decode_generic = (blob: Object, offset: number, fields: Object, name: string, group: string, end: number): Object => {
    let comp = {
        'type': Util.removeSpaces(name),
        'group': group,
    };
    let keys = Object.keys(fields);
    let lastWasABitField = false;
    for (let i = 0; i < keys.length; i++) {
        if (offset >= end) {
            break;
        }
        let k = keys[i];
        let f = fields[k];
        if (k.match(/^null[_0-9]*$/)) {
            offset += f;
            // 'null_: 0' resets bitfield continuity to allow several consecutive bitfields
            lastWasABitField = false;
            continue;
        }
        let size = 0;
        let value, result;
        let num = typeof f === 'number';
        let other = typeof f === 'string';
        let array = f instanceof Array;
        if (num) {
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
                    throw new Util.ConvertException('Invalid field size: ' + f + '.');
            }
            lastWasABitField = false;
        } else if (other) {
            let func = 'get' + f;
            try {
                // console.log(chalk.yellow('get' + f))
                result = Util['get' + f](blob, offset);
            } catch (e) {
                if (e.message.search(/not a function/) >= 0) {
                    throw new Util.ConvertException(`Method '${f}' was not found. (correct capitalization?)`);
                } else {
                    throw e;
                }
            }
            value = result[0];
            size = result[1];
            lastWasABitField = false;
        } else if (f && f.length >= 2) {
            if (f[0] === 'Bit') {
                if (lastWasABitField) {
                    offset -= 1; // compensate to stay in same bitfield
                }
                lastWasABitField = true;
            } else {
                lastWasABitField = false;
            }
            try {
                // console.log(chalk.yellow('get' + f))
                result = Util['get' + f[0]](blob, offset, f[1]);
                value = result[0];
                if (f[2]) { // further processing if wanted
                    // console.log(chalk.yellow('get' + f[2]))
                    value = Util['get' + f[2]](value);
                }
            } catch (e) {
                if (e.message.search(/not a function/) >= 0) {
                    throw new Util.ConvertException(`Method '${f}' was not found. (correct capitalization?)`); } else {
                    throw e;
                }
            }
            size = result[1];
        }

        // save value or function result of value in field
        comp[k] = value;
        if (debug === true) console.log(chalk.dim('- key: ' + k + '\n- val: ' + value + '\n- offset: ' + offset + '\n'));
        offset += size;
    }

    return comp;
};

const decode_movement = (blob: Object, offset: number): Object => {
    let comp = {
        'type': 'Movement',
        'group': 'Trans',
    };
    // the special value 0 is because 'old versions of AVS barf' if the id is > 15, so
    // AVS writes out 0 in that case, and sets the actual id at the end of the save block.
    let effectIdOld = Util.getUInt32(blob, offset);
    let effect = [];
    let code;
    if (effectIdOld !== 0) {
        if (effectIdOld === 32767) {
            let strAndSize = Util.getSizeString(blob, offset + sizeInt + 1); // for some reason there is a single byte reading '0x01' before custom code.
            offset += strAndSize[1];
            code = strAndSize[0];
        } else {
            effect = Table.movementEffects[effectIdOld];
        }
    } else {
        let effectIdNew = Util.getUInt32(blob, offset + sizeInt * 6); // 1*sizeInt, because of oldId=0, and 5*sizeint because of the other settings.
        effect = Table.movementEffects[effectIdNew];
    }
    if (effect.length > 0) {
        comp['builtinEffect'] = effect[0];
    }
    comp['output'] = Util.getUInt32(blob, offset + sizeInt) ? '50/50' : 'Replace';
    comp['sourceMapped'] = Util.getBool(blob, offset + sizeInt * 2, sizeInt)[0];
    comp['coordinates'] = Util.getCoordinates(blob, offset + sizeInt * 3, sizeInt);
    comp['bilinear'] = Util.getBool(blob, offset + sizeInt * 4, sizeInt)[0];
    comp['wrap'] = Util.getBool(blob, offset + sizeInt * 5, sizeInt)[0];
    if (effect.length && effectIdOld !== 1 && effectIdOld !== 7) { // 'slight fuzzify' and 'blocky partial out' have no script representation.
        code = effect[1];
        comp['coordinates'] = effect[2]; // overwrite
    }
    comp['code'] = code;

    return comp;
};

const decode_avi = (blob: Object, offset: number): Object => {
    let comp = {
        'type': 'AVI',
        'group': 'Render',
        'enabled': Util.getBool(blob, offset, sizeInt)[0],
    };
    let strAndSize = Util.getNtString(blob, offset + sizeInt * 3);
    comp['file'] = strAndSize[0];
    comp['speed'] = Util.getUInt32(blob, offset + sizeInt * 5 + strAndSize[1]); // 0: fastest, 1000: slowest
    let beatAdd = Util.getUInt32(blob, offset + sizeInt * 3 + strAndSize[1]);
    if (beatAdd) {
        comp['output'] = '50/50';
    } else {
        comp['output'] = Util.getMap8(blob, offset + sizeInt, { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' });
    }
    comp['onBeatAdd'] = beatAdd;
    comp['persist'] = Util.getUInt32(blob, offset + sizeInt * 4 + strAndSize[1]); // 0-32

    return comp;
};

const decode_simple = (blob: Object, offset: number): Object => {
    let comp = {
        'type': 'Simple',
        'group': 'Render',
    };
    let effect = Util.getUInt32(blob, offset);
    if (effect & (1 << 6)) {
        comp['audioSource'] = (effect & 2) ? 'Waveform' : 'Spectrum';
        comp['renderType'] = 'Dots';
    } else {
        switch (effect & 3) {
            case 0: // solid analyzer
                comp['audioSource'] = 'Spectrum';
                comp['renderType'] = 'Solid';
                break;
            case 1: // line analyzer
                comp['audioSource'] = 'Spectrum';
                comp['renderType'] = 'Lines';
                break;
            case 2: // line scope
                comp['audioSource'] = 'Waveform';
                comp['renderType'] = 'Lines';
                break;
            case 3: // solid scope
                comp['audioSource'] = 'Waveform';
                comp['renderType'] = 'Solid';
                break;
        }
    }
    comp['audioChannel'] = Util.getAudioChannel((effect >> 2) & 3);
    comp['positionY'] = Util.getPositionY((effect >> 4) & 3);
    comp['colors'] = Util.getColorList(blob, offset + sizeInt)[0];

    return comp;
};

export {
    convertPreset,
    convertComponents,
    getComponentIndex,
    getComponentSize,
    decodePresetHeader,
    decode_effectList,
    decode_generic,
    decode_movement,
    decode_avi,
    decode_simple
};
