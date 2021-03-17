// Modules
import * as Log from './lib/log';
import * as Util from './lib/util-node';
import { convertBlob } from './browser';
import { readFileSync, statSync } from 'fs';
import { basename, extname } from 'path';

const defaultArgs: Arguments = {
    hidden: true,
    minify: false,
    quiet: false,
    verbose: 0
};

function convertFile(file: string, customArgs?: Arguments): Promise<string> {
    const args = {
        ...defaultArgs,
        ...customArgs
    };

    return Util.readPreset(file)
        .then(async (presetBlob: Buffer | ArrayBuffer) => {
            const presetName = (typeof args.name !== 'undefined' && args.name.trim().length > 0) ? args.name : basename(file, extname(file));
            const presetDate = args.noDate ? undefined : await Util.getISOTime(file);
            const presetObj = convertBlob(presetBlob, presetName, presetDate, args);
            const whitespace: number = (args.minify === true) ? 0 : 4;

            return JSON.stringify(presetObj, null, whitespace);
        })
        .catch(error => {
            Log.error(error);
        });
}

function convertFileSync(file: string, customArgs?: Arguments): string {
    const args = {
        ...defaultArgs,
        ...customArgs
    };

    let presetBlob, presetDate, presetName, presetObj;

    try {
        presetBlob = readFileSync(file);
        presetName = (typeof args.name !== 'undefined' && args.name.trim().length > 0) ? args.name : basename(file, extname(file));
        presetDate = args.noDate ? undefined : statSync(file).mtime.toISOString();
        presetObj = convertBlob(presetBlob, presetName, presetDate, args);
    } catch (error) {
        Log.error(error);
    }

    const whitespace: number = (args.minify === true) ? 0 : 4;

    return JSON.stringify(presetObj, null, whitespace);
}

export {
    convertFile,
    convertFileSync
};
