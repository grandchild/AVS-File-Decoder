// Modules
import * as Components from './lib/components';
import * as Util from './lib/util';
import config from './config';
import decode from './lib/decode';
import get from './lib/get';
import Log from './lib/log';

// Constants
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

    verbosity = args.quiet ? -1 : Number(args.verbose);

    Util.setVerbosity(verbosity);
    Util.setHiddenStrings(Boolean(args.hidden));

    const preset = {
        name: presetName
    };
    if (presetDate) {
        preset['date'] = presetDate;
    }
    const blob8 = new Uint8Array(data);
    try {
        const clearFrame = decode.presetHeader(blob8.subarray(0, config.presetHeaderLength));
        preset['clearFrame'] = clearFrame;
        const components = convertComponents(blob8.subarray(config.presetHeaderLength));
        preset['components'] = components;
    } catch (e) {
        // TODO
        // if (verbosity < 0) Log.error(`Error in '${file}'`);
        if (verbosity >= 1) {
            Log.error(e.stack);
        } else {
            Log.error(e);
        }
        // if(e instanceof Util.ConvertException) {
        //     Log.error('Error: '+e.message);
        //     return null;
        // } else {
        //     throw e;
        // }
    }

    return preset;
}

function convertComponents(blob: Uint8Array): unknown {
    let fp = 0;
    const components: unknown[] = [];
    let res;
    // read file as long as there are components left.
    // a component takes at least two int32s of space, if there are less bytes than that left,
    // ignore them. usually fp < blob.length should suffice but some rare presets have trailing
    // bytes. found in one preset's trailing colormap so far.
    while (fp <= blob.length - config.sizeInt * 2) {
        const code = get.UInt32(blob, fp);
        const i = getComponentIndex(code, blob, fp);
        const isDll: number = code !== 0xfffffffe && code >= config.builtinMax ? 1 : 0;
        const size = getComponentSize(blob, fp + config.sizeInt + isDll * 32);
        // console.log("component size", size, "blob size", blob.length);
        if (i < 0) {
            res = { type: 'Unknown: (' + -i + ')' };
        } else {
            const offset = fp + config.sizeInt * 2 + isDll * 32;
            res = decode[componentTable[i].func](blob, offset, componentTable[i].fields, componentTable[i].name, componentTable[i].group, offset + size);
        }
        if (!res || typeof res !== 'object') {
            // should not happen, decode functions should throw their own.
            throw new Util.ConvertException('Unknown convert error');
        }
        components.push(res);
        fp += size + config.sizeInt * 2 + isDll * 32;
    }

    return components;
}

function getComponentIndex(code: number, blob: Uint8Array, offset: number): number {
    if (code < config.builtinMax || code === 0xfffffffe) {
        for (let i = 0; i < componentTable.length; i++) {
            if (code === componentTable[i].code) {
                if (verbosity >= 1) {
                    Log.log(`Found component: ${componentTable[i].name} (${code})`);
                }
                return i;
            }
        }
    } else {
        for (let i = Components.builtin.length; i < componentTable.length; i++) {
            if (componentTable[i].code instanceof Array && Util.cmpBytes(blob, offset + config.sizeInt, <number[]>componentTable[i].code)) {
                if (verbosity >= 1) {
                    Log.log(`Found component: ${componentTable[i].name}`);
                }
                return i;
            }
        }
    }

    if (verbosity >= 1) {
        Log.log(`Found unknown component (code: ${code})`);
    }

    return -code;
}

function getComponentSize(blob: Uint8Array, offset: number) {
    return get.UInt32(blob, offset);
}

export { convertBlob, convertComponents };
