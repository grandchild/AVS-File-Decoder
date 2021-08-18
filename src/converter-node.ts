// Modules
import { basename, extname } from 'path';
import { convertBlob } from './converter';
import { readFileSync, statSync } from 'fs';
import * as Util from './lib/util-node';
import Log from './lib/log';

const defaultArgs: Arguments = {
    hidden: true,
    minify: false,
    quiet: false,
    verbose: 0
};

function convertFile(file: string, customArgs?: Arguments): Promise<any> {
    const args = {
        ...defaultArgs,
        ...customArgs
    };

    return Util.readPreset(file)
        .then(async (presetBlob: any) => {
            const presetName = typeof args.name !== 'undefined' && args.name.trim().length > 0 ? args.name : basename(file, extname(file));
            const presetDate = args.noDate ? undefined : await Util.getISOTime(file);
            const presetObj = convertBlob(presetBlob, presetName, presetDate, args);
            const whitespace: number = args.minify === true ? 0 : 4;

            return JSON.stringify(presetObj, null, whitespace);
        })
        .catch((error) => {
            Log.error(error);
        });
}

function convertFileSync(file: string, customArgs?: Arguments): unknown {
    const args = {
        ...defaultArgs,
        ...customArgs
    };

    let presetBlob, presetDate, presetName, presetObj;

    try {
        presetBlob = readFileSync(file);
        presetName = typeof args.name !== 'undefined' && args.name.trim().length > 0 ? args.name : basename(file, extname(file));
        presetDate = args.noDate ? undefined : statSync(file).mtime.toISOString();
        presetObj = convertBlob(presetBlob, presetName, presetDate, args);
    } catch (error) {
        Log.error(error);
    }

    const whitespace: number = args.minify === true ? 0 : 4;

    return JSON.stringify(presetObj, null, whitespace);
}

export { convertFile, convertFileSync };
