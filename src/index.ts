// Modules
import * as Components from './lib/components';
import * as Util from './lib/util';
import * as Table from './lib/tables';
import { readFileSync, statSync } from 'fs';
import { basename, extname } from 'path';

// Constants
const sizeInt = 4;
let verbosity = 0; // log individual key:value fields
const componentTable: ComponentDefinition[] = Components.builtin.concat(Components.dll);

const args: Arguments = {
    hidden: true,
    minify: false,
    quiet: false,
    verbose: 0
};

const convertFile = async (file: string, customArgs?: Arguments): Promise<any> => {
    (<any>Object).assign(args, customArgs);

    return Util.readPreset(file)
    .then( async (presetBlob: any) => {
        const presetName = (typeof args.name !== 'undefined' && args.name.trim().length > 0) ? args.name : basename(file, extname(file));
        const presetDate = args.noDate ? undefined : await Util.getISOTime(file);
        const presetObj = convertBlob(presetBlob, presetName, presetDate, args);
        const whitespace: number = (args.minify === true) ? 0 : 4;

        return JSON.stringify(presetObj, null, whitespace);
    })
    .catch( error => {
        Util.error(error);
    });
};

const convertFileSync = (file: string, customArgs?: Arguments): Object => {
    (<any>Object).assign(args, customArgs);

    let presetBlob, presetDate, presetName, presetObj;

    try {
        presetBlob = readFileSync(file);
        presetName = (typeof args.name !== 'undefined' && args.name.trim().length > 0) ? args.name : basename(file, extname(file));
        presetDate = args.noDate ? undefined : statSync(file).mtime.toISOString();
        presetObj = convertBlob(presetBlob, presetName, presetDate, args);
    } catch (error) {
        Util.error(error);
    }

    const whitespace: number = (args.minify === true) ? 0 : 4;

    return JSON.stringify(presetObj, null, whitespace);
};

const convertBlob = (data: Buffer|ArrayBuffer, presetName: string, presetDate?: string, customArgs?: Arguments): Object|void => {
    (<any>Object).assign(args, customArgs);

    verbosity = args.quiet ? -1 : args.verbose;

    Util.setVerbosity(verbosity);
    Util.setHiddenStrings(args.hidden);

    const preset = {
        'name': presetName,
    };
    if(presetDate) {
        preset['date'] = presetDate;
    }
    const blob8 = new Uint8Array(data);
    try {
        const clearFrame = decodePresetHeader(blob8.subarray(0, Util.presetHeaderLength));
        preset['clearFrame'] = clearFrame;
        const components = convertComponents(blob8.subarray(Util.presetHeaderLength));
        preset['components'] = components;
    } catch (e) {
        // TODO
        // if (verbosity < 0) Util.error(`Error in '${file}'`);
        if (verbosity >= 1) Util.error(e.stack);
        else Util.error(e);
        // if(e instanceof Util.ConvertException) {
        //     Util.error('Error: '+e.message);
        //     return null;
        // } else {
        //     throw e;
        // }
    }

    return preset;
};

const convertComponents = (blob: Uint8Array): Object => {
    let fp: number = 0;
    let components: any[] = [];
    let res;
    // read file as long as there are components left.
    // a component takes at least two int32s of space, if there are less bytes than that left,
    // ignore them. usually fp < blob.length should suffice but some rare presets have trailing
    // bytes. found in one preset's trailing colormap so far.
    while (fp <= blob.length - sizeInt * 2) {
        let code = Util.getUInt32(blob, fp);
        let i = getComponentIndex(code, blob, fp);
        let isDll: number = (code !== 0xfffffffe && code >= Util.builtinMax) ? 1 : 0;
        let size = getComponentSize(blob, fp + sizeInt + isDll * 32);
        // console.log("component size", size, "blob size", blob.length);
        if (i < 0) {
            res = { 'type': 'Unknown: (' + (-i) + ')' };
        } else {
            let offset = fp + sizeInt * 2 + isDll * 32;
            res = eval('decode_' + componentTable[i].func)(
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

const getComponentIndex = (code: number, blob: Uint8Array, offset: number): number => {
    if (code < Util.builtinMax || code === 0xfffffffe) {
        for (let i = 0; i < componentTable.length; i++) {
            if (code === componentTable[i].code) {
                if (verbosity >= 1) Util.dim(`Found component: ${componentTable[i].name} (${code})`);

                return i;
            }
        }
    } else {
        for (let i = Components.builtin.length; i < componentTable.length; i++) {
            if (componentTable[i].code instanceof Array &&
                Util.cmpBytes(blob, offset + sizeInt, <number[]>componentTable[i].code)) {
                if (verbosity >= 1) Util.dim(`Found component: ${componentTable[i].name}`);

                return i;
            }
        }
    }

    if (verbosity >= 1) Util.dim(`Found unknown component (code: ${code})`);

    return -code;
};

const getComponentSize = (blob: Uint8Array, offset: number) => {
    return Util.getUInt32(blob, offset);
};

const decodePresetHeader = (blob: Uint8Array): boolean => {
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
        throw new Util.ConvertException(
            'Invalid preset header.\n' +
            '  This does not seem to be an AVS preset file.\n' +
            '  If it does load with Winamp\'s AVS please send the file in so we can look at it.'
        );
    }

    return blob[Util.presetHeaderLength - 1] === 1; // 'Clear Every Frame'
};

//// component decode functions,
const decode_effectList = (blob: Uint8Array, offset: number, _: Object, name: string): Object => {
    let size: number = Util.getUInt32(blob, offset - sizeInt);
    let comp = {
        'type': Util.removeSpaces(name),
        'enabled': Util.getBit(blob, offset, 1)[0] !== 1,
        'clearFrame': Util.getBit(blob, offset, 0)[0] === 1,
        'input': Table['blendmodeIn'][blob[offset + 2]],
        'output': Table['blendmodeOut'][blob[offset + 3]],
    };
    let modebit: boolean = Util.getBit(blob, offset, 7)[0] === 1; // is true in all presets I know, probably only for truly ancient versions
    if (!modebit) {
        Util.error('EL modebit is off!! If you\'re seeing this, send this .avs file in please!');
    }
    let configSize: number = (modebit ? blob[offset + 4] : blob[offset]) + 1;
    if (configSize > 1) {
        comp['inAdjustBlend'] = Util.getUInt32(blob, offset + 5);
        comp['outAdjustBlend'] = Util.getUInt32(blob, offset + 9);
        comp['inBuffer'] = Util.getUInt32(blob, offset + 13);
        comp['outBuffer'] = Util.getUInt32(blob, offset + 17);
        comp['inBufferInvert'] = Util.getUInt32(blob, offset + 21) === 1;
        comp['outBufferInvert'] = Util.getUInt32(blob, offset + 25) === 1;
        comp['enableOnBeat'] = Util.getUInt32(blob, offset + 29) === 1;
        comp['enableOnBeatFor'] = Util.getUInt32(blob, offset + 33);
    }
    let effectList28plusHeader = [ // reads: hex(builtinMax) + 'AVS 2.8+ Effect List Config....'
        0x00, 0x40, 0x00, 0x00, 0x41, 0x56, 0x53, 0x20,
        0x32, 0x2E, 0x38, 0x2B, 0x20, 0x45, 0x66, 0x66,
        0x65, 0x63, 0x74, 0x20, 0x4C, 0x69, 0x73, 0x74,
        0x20, 0x43, 0x6F, 0x6E, 0x66, 0x69, 0x67, 0x00,
        0x00, 0x00, 0x00, 0x00
    ];
    let contentOffset = offset + configSize;
    if (Util.cmpBytes(blob, contentOffset, effectList28plusHeader)) {
        let codeOffset: number = offset + configSize + effectList28plusHeader.length;
        let codeSize: number = Util.getUInt32(blob, codeOffset);
        comp['code'] = Util.getCodeEIF(blob, codeOffset + sizeInt)[0];
        contentOffset = codeOffset + sizeInt + codeSize;
    }
    let content = convertComponents(blob.subarray(contentOffset, offset + size));
    comp['components'] = content;
    return comp;
};

// generic field decoding function that most components use.
const decode_generic = (blob: Uint8Array, offset: number, fields: Object, name: string, group: string, end: number): Object => {
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
        // console.log(`key: ${k}, field: ${f}`);
        if (k.match(/^null[_0-9]*$/)) {
            offset += f;
            // 'null_: 0' resets bitfield continuity to allow several consecutive bitfields
            lastWasABitField = false;
            continue;
        }
        let size = 0;
        let value: jsontypes;
        let result: [jsontypes, number];
        let num: boolean = typeof f === 'number';
        let other: boolean = typeof f === 'string';
        let array: boolean = f instanceof Array;
        if (num) {
            size = f;
            try {
                value = Util.getUInt(blob, offset, size);
            } catch (e) {
                throw new Util.ConvertException('Invalid field size: ' + f + '.');
            }
            lastWasABitField = false;
        } else if (other) {
            let func = 'get' + f;
            // console.log(`get: ${f}`);
            result = Util.callFunction(f, blob, offset);
            value = result[0];
            size = result[1];
            lastWasABitField = false;
        } else if (array && f.length >= 2) {
            if (f[0] === 'Bit') {
                if (lastWasABitField) {
                    offset -= 1; // compensate to stay in same bitfield
                }
                lastWasABitField = true;
            } else {
                lastWasABitField = false;
            }
            // console.log(`get: ${f[0]} ${f[1]} ${typeof f[1]}`);
            let tableName: string = Util.lowerInitial(f[0]);
            if (tableName in Table) {
                let tableKey: number = Util.getUInt(blob, offset, f[1]);
                value = Table[tableName][tableKey];
                size = f[1];
            } else {
                result = Util.callFunction(f[0], blob, offset, f[1]);
                size = result[1];
                value = result[0];
            }
            if (f[2]) { // further processing if wanted
                // console.log('get' + f[2]);
                tableName = Util.lowerInitial(f[2]);
                if (tableName in Table) {
                    value = Table[tableName][<number>value];
                } else {
                    value = Util.callFunction(f[2], value);
                }
            }
        }

        // save value or function result of value in field
        if (k !== 'new_version') { // but don't save new_version marker, if present
            comp[k] = value;
            if (verbosity >= 2) {
                Util.dim('- key: ' + k + '\n- val: ' + value);
                if (k === 'code') Util.printTable('- code', value);
                if (verbosity >= 3) Util.dim('- offset: ' + offset + '\n- size: ' + size);
                // console.log();
            }
        }
        offset += size;
    }

    return comp;
};

const decode_versioned_generic = (blob: Uint8Array, offset: number, fields: Object, name: string, group: string, end: number): Object => {
    let version: number = blob[offset];
    if (version === 1) {
        return decode_generic(blob, offset, fields, name, group, end);
    } else {
        let oldFields = {};
        for (let key in fields) {
            if (key === 'new_version') continue;
            if (key === 'code') oldFields[key] = fields['code'].replace(/Code([IFBP]+)/, '256Code$1');
            else oldFields[key] = fields[key];
        }
        if (verbosity >= 3) console.log('oldFields, code changed to:', oldFields['code']);
        return decode_generic(blob, offset, oldFields, name, group, end);
    }
};

const decode_movement = (blob: Uint8Array, offset: number, _: Object, name: string, group: string, end: number): Object => {
    let comp = {
        'type': name,
        'group': group,
    };
    // the special value 0 is because 'old versions of AVS barf' if the id is > 15, so
    // AVS writes out 0 in that case, and sets the actual id at the end of the save block.
    let effectIdOld = Util.getUInt32(blob, offset);
    let effect = [];
    let code;
    let hidden: string[];
    if (effectIdOld !== 0) {
        if (effectIdOld === 0x7fff) {
            let strAndSize: [string, number]|[string, number, string[]] = ['', 0];
            if (blob[offset + sizeInt] === 1) { // new-version marker
                strAndSize = Util.getSizeString(blob, offset + sizeInt + 1);
            } else {
                strAndSize = Util.getSizeString(blob, offset + sizeInt, 256);
            }
            offset += strAndSize[1];
            code = strAndSize[0];
            if (strAndSize.length > 2) {
                hidden = (<[string, number, string[]]>strAndSize)[2];
            }
        } else {
            if (effectIdOld > 15) {
                if (verbosity >= 0) {
                    Util.error(`Movement: Unknown effect id ${effectIdOld}. This is a known bug.`);
                    console.log('If you know an AVS version that will display this Movement as anything else but "None", then please send it in!');
                }
                effect = Table.movementEffect[0];
            } else {
                effect = Table.movementEffect[effectIdOld];
            }
        }
    } else {
        let effectIdNew: number = 0;
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
    if (effect && effect.length && effectIdOld !== 1 && effectIdOld !== 7) { // 'slight fuzzify' and 'blocky partial out' have no script representation.
        code = effect[1];
        comp['coordinates'] = effect[2]; // overwrite
    }
    comp['code'] = code;
    if (hidden) comp['_hidden'] = hidden;
    return comp;
};

const decode_avi = (blob: Uint8Array, offset: number): Object => {
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

const decode_simple = (blob: Uint8Array, offset: number): Object => {
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
    comp['audioChannel'] = Table.audioChannel[(effect >> 2) & 3];
    comp['positionY'] = Table.positionY[(effect >> 4) & 3];
    comp['colors'] = Util.getColorList(blob, offset + sizeInt)[0];
    return comp;
};

export {
    convertBlob,
    convertComponents,
    convertFile,
    convertFileSync
};
