// Modules
import * as Util from './lib/util';
import config from './config';
import decode from './lib/decode';
import Log from './lib/log';

// Constants
let verbosity = 0; // log individual key:value fields


const defaultArgs: Arguments = {
    hidden: true,
    minify: false,
    quiet: false,
    verbose: 0
};

export function convertBlob(data: Buffer | ArrayBuffer, presetName: string, presetDate?: string, customArgs?: Arguments): unknown {
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
        const components = Util.convertComponents(blob8.subarray(config.presetHeaderLength));
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
