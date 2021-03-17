// Modules
import * as Components from './lib/components';
import * as Log from './lib/log';
import * as Table from './lib/tables';
import * as Util from './lib/util';

// Constants
const sizeInt = 4;
let verbosity = 0; // log individual key:value fields
const componentTable: ComponentDefinition[] = Components.builtin.concat(Components.dll);

const defaultArgs: Arguments = {
    hidden: true,
    minify: false,
    quiet: false,
    verbose: 0
};

function convertBlob(data: Buffer | ArrayBuffer, presetName: string, presetDate?: string, customArgs?: Arguments): unknown {
    const args = {
        ...defaultArgs,
        ...customArgs
    };

    verbosity = args.quiet ? -1 : args.verbose;

    Util.setVerbosity(verbosity);
    Util.setHiddenStrings(args.hidden);

    const preset = {
        'name': presetName,
    };
    if (presetDate) {
        preset['date'] = presetDate;
    }
    const blob8 = new Uint8Array(data);
    try {
        const clearFrame = decodePresetHeader(blob8.subarray(0, Util.presetHeaderLength));
        preset['clearFrame'] = clearFrame;
        const components = convertComponents(blob8.subarray(Util.presetHeaderLength));
        preset['components'] = components;
    } catch (e) {
        if (verbosity >= 1)
            {Log.error(e.stack);}
        else
            {Log.error(e);}
    }

    return preset;
}

function convertComponents(blob: Uint8Array): Component[] {
    let fp = 0;
    const components: Component[] = [];
    let res;
    // read file as long as there are components left.
    // a component takes at least two int32s of space, if there are less bytes than that left,
    // ignore them. usually fp < blob.length should suffice but some rare presets have trailing
    // bytes. found in one preset's trailing colormap so far.
    while (fp <= blob.length - sizeInt * 2) {
        const code = Util.getUInt32(blob, fp);
        const i = getComponentIndex(code, blob, fp);
        const isDll: number = (code !== 0xfffffffe && code >= Util.builtinMax) ? 1 : 0;
        const size = getComponentSize(blob, fp + sizeInt + isDll * 32);
        if (i < 0) {
            res = { 'type': 'Unknown: (' + (-i) + ')' };
        } else {
            const offset = fp + sizeInt * 2 + isDll * 32;
            switch(componentTable[i].func) {
                case 'avi':
                    res = decode_avi(blob, offset);
                    break;
                case 'effectList':
                    res = decode_effectList(blob, offset, componentTable[i].fields, componentTable[i].name);
                    break;
                case 'generic':
                    res = decode_generic(blob, offset, componentTable[i].fields, componentTable[i].name, componentTable[i].group, offset + size);
                    break;
                case 'movement':
                    res = decode_movement(blob, offset, componentTable[i].fields, componentTable[i].name, componentTable[i].group, offset + size);
                    break;
                case 'simple':
                    res = decode_simple(blob, offset);
                    break;
                case 'versioned_generic':
                    res = decode_versioned_generic(blob, offset, componentTable[i].fields, componentTable[i].name, componentTable[i].group, offset + size);
                    break;
            }
        }
        if (!res || typeof res !== 'object') { // should not happen, decode functions should throw their own.
            throw new Util.ConvertException('Unknown convert error');
        }
        components.push(res);
        fp += size + sizeInt * 2 + isDll * 32;
    }

    return components;
}

function getComponentIndex(code: number, blob: Uint8Array, offset: number): number {
    if (code < Util.builtinMax || code === 0xfffffffe) {
        for (let i = 0; i < componentTable.length; i++) {
            if (code === componentTable[i].code) {
                if (verbosity >= 1) {
                    Log.dim(`Found component: ${componentTable[i].name} (${code})`);
                }
                return i;
            }
        }
    } else {
        for (let i = Components.builtin.length; i < componentTable.length; i++) {
            if (componentTable[i].code instanceof Array &&
                Util.cmpBytes(blob, offset + sizeInt, <number[]>componentTable[i].code)) {
                if (verbosity >= 1) {
                    Log.dim(`Found component: ${componentTable[i].name}`);
                }
                return i;
            }
        }
    }

    if (verbosity >= 1)
        {Log.dim(`Found unknown component (code: ${code})`);}

    return -code;
}

function getComponentSize(blob: Uint8Array, offset: number) {
    return Util.getUInt32(blob, offset);
}

function decodePresetHeader(blob: Uint8Array): boolean {
    const presetHeader0_1 = [
        0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74,
        0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65,
        0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x31, 0x1A
    ];
    const presetHeader0_2 = [
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
}

//// component decode functions,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function decode_effectList(blob: Uint8Array, offset: number, _: ComponentField[], name: string): Component {
    const size: number = Util.getUInt32(blob, offset - sizeInt);
    const comp: Component = {
        'type': Util.removeSpaces(name),
        'enabled': Util.getBit(blob, offset, 1)[0] !== 1,
        'clearFrame': Util.getBit(blob, offset, 0)[0] === 1,
        'input': Table['blendmodeIn'][blob[offset + 2]],
        'output': Table['blendmodeOut'][blob[offset + 3]],
    };
    const modebit: boolean = Util.getBit(blob, offset, 7)[0] === 1; // is true in all presets I know, probably only for truly ancient versions
    if (!modebit) {
        Log.error('EL modebit is off!! If you\'re seeing this, send this .avs file in please!');
    }
    const configSize: number = (modebit ? blob[offset + 4] : blob[offset]) + 1;
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
    const effectList28plusHeader = [
        0x00, 0x40, 0x00, 0x00, 0x41, 0x56, 0x53, 0x20,
        0x32, 0x2E, 0x38, 0x2B, 0x20, 0x45, 0x66, 0x66,
        0x65, 0x63, 0x74, 0x20, 0x4C, 0x69, 0x73, 0x74,
        0x20, 0x43, 0x6F, 0x6E, 0x66, 0x69, 0x67, 0x00,
        0x00, 0x00, 0x00, 0x00
    ];
    let contentOffset = offset + configSize;
    if (Util.cmpBytes(blob, contentOffset, effectList28plusHeader)) {
        const codeOffset: number = offset + configSize + effectList28plusHeader.length;
        const codeSize: number = Util.getUInt32(blob, codeOffset);
        comp['code'] = Util.getCodeEIF(blob, codeOffset + sizeInt)[0];
        contentOffset = codeOffset + sizeInt + codeSize;
    }
    const content = convertComponents(blob.subarray(contentOffset, offset + size));
    comp['components'] = content;
    return comp;
}

// generic field decoding function that most components use.
function decode_generic(blob: Uint8Array, offset: number, fields: ComponentField[], name: string, group: string, end: number): Component {
    const cleanName = Util.removeSpaces(name);
    const comp: Component = {
        'type': cleanName,
        'group': group,
    };
    let lastWasABitField = false;
    for (const field of fields) {
        if (offset >= end) {
            break;
        }
        const fieldName = field.k;
        const f = field.v;
        if (fieldName === '_SKIP' && typeof f === 'number') {
            offset += f;
            // 'null_: 0' resets bitfield continuity to allow several consecutive bitfields
            lastWasABitField = false;
            continue;
        }
        let size = 0;
        let value: jsontypes;
        let result: [jsontypes, number];
        if (typeof f === 'number') {
            size = f;
            try {
                value = Util.getUInt(blob, offset, size);
            } catch (e) {
                throw new Util.ConvertException('Invalid field size: ' + f + '.');
            }
            lastWasABitField = false;
        } else if (typeof f === 'string') {
            result = Util.callFunction(f, blob, offset);
            value = result[0];
            size = result[1];
            lastWasABitField = false;
        } else if (f instanceof Array) {
            if (f[0] === 'Bit') {
                if (lastWasABitField) {
                    offset -= 1; // compensate to stay in same bitfield
                }
                lastWasABitField = true;
            } else {
                lastWasABitField = false;
            }
            let tableName: string = Util.lowerInitial(f[0]);
            if (tableName in Table) {
                if (typeof f[1] === 'number') {
                    const tableKey: number = Util.getUInt(blob, offset, f[1]);
                    value = Table[tableName][tableKey];
                    size = f[1];
                } else {
                    throw new Util.ConvertException(
                        `Invalid component definition for ${cleanName} field ${fieldName}.`
                        + ' (table field value second entry must be a single number)'
                    );
                }
            } else {
                result = Util.callFunction(f[0], blob, offset, f[1]);
                size = result[1];
                value = result[0];
            }
            if (f[2]) { // further processing if wanted
                tableName = Util.lowerInitial(f[2]);
                if (tableName in Table) {
                    value = Table[tableName][<number>value];
                } else {
                    value = Util.callFunction(f[2], value);
                }
            }
        }

        // save value or function result of value in field
        if (fieldName !== 'new_version') { // but don't save new_version marker, if present
            comp[fieldName] = value;
            if (verbosity >= 2) {
                Log.dim('- field name: ' + fieldName + '\n- val: ' + value);
                if (fieldName === 'code') {
                    Util.printTable('- code', value);
                }
                if (verbosity >= 3) {
                    Log.dim('- offset: ' + offset + '\n- size: ' + size);
                }
            }
        }
        offset += size;
    }

    return comp;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function decode_versioned_generic(blob: Uint8Array, offset: number, fields: ComponentField[], name: string, group: string, end: number): Component {
    const version: number = blob[offset];
    if (version === 1) {
        return decode_generic(blob, offset, fields, name, group, end);
    } else {
        const oldFields: ComponentField[] = [];
        let oldCodeFunc = '';
        for (const field of fields) {
            if (field.k === 'new_version') {
                continue;
            }
            if (field.k === 'code' && typeof field.v === 'string') {
                oldCodeFunc = field.v.replace(/Code([IFBP]+)/, '256Code$1');
                oldFields.push({k: 'code', v: oldCodeFunc});
            } else {
                oldFields.push(field);
            }
        }
        if (verbosity >= 3) {
            console.log('oldFields, code changed to:', oldFields['code']);
        }
        return decode_generic(blob, offset, oldFields, name, group, end);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function decode_movement(blob: Uint8Array, offset: number, _: ComponentField[], name: string, group: string, end: number): Component {
    const comp = {
        'type': name,
        'group': group,
    };
    // the special value 0 is because 'old versions of AVS barf' if the id is > 15, so
    // AVS writes out 0 in that case, and sets the actual id at the end of the save block.
    const effectIdOld = Util.getUInt32(blob, offset);
    let effect = [];
    let code;
    let hidden: string[];
    if (effectIdOld !== 0) {
        if (effectIdOld === 0x7fff) {
            let strAndSize: [string, number] | [string, number, string[]] = ['', 0];
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
                    Log.error(`Movement: Unknown effect id ${effectIdOld}. This is a known bug.`);
                    console.log('If you know an AVS version that will display this Movement as anything else but "None", then please send it in!');
                }
                effect = Table.movementEffect[0];
            } else {
                effect = Table.movementEffect[effectIdOld];
            }
        }
    } else {
        let effectIdNew = 0;
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
    if (hidden)
        {comp['_hidden'] = hidden;}
    return comp;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function decode_avi(blob: Uint8Array, offset: number): Component {
    const comp = {
        'type': 'AVI',
        'group': 'Render',
        'enabled': Util.getBool(blob, offset, sizeInt)[0],
    };
    const strAndSize = Util.getNtString(blob, offset + sizeInt * 3);
    comp['file'] = strAndSize[0];
    comp['speed'] = Util.getUInt32(blob, offset + sizeInt * 5 + strAndSize[1]); // 0: fastest, 1000: slowest
    const beatAdd = Util.getUInt32(blob, offset + sizeInt * 3 + strAndSize[1]);
    if (beatAdd) {
        comp['output'] = '50/50';
    } else {
        comp['output'] = Util.getMap8(blob, offset + sizeInt, { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' });
    }
    comp['onBeatAdd'] = beatAdd;
    comp['persist'] = Util.getUInt32(blob, offset + sizeInt * 4 + strAndSize[1]); // 0-32

    return comp;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function decode_simple(blob: Uint8Array, offset: number): Component {
    const comp = {
        'type': 'Simple',
        'group': 'Render',
    };
    const effect = Util.getUInt32(blob, offset);
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
}

export {
    convertBlob,
    convertComponents
};
