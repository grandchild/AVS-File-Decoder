import { basename, extname } from 'node:path';
import { convertPreset } from '../src/webvsc';
import { promises as fs, readFileSync, statSync } from 'node:fs';

const defaultArgs = {
		hidden: true,
		quiet: false,
		verbose: 0
};

export function convertFile(file, customArgs) {
		const args = {
				...defaultArgs,
				...customArgs
		};

		return fs.readFile(file)
				.then(async (presetBlob) => {
						const presetName = typeof args.name !== 'undefined' && args.name.trim().length > 0 ? args.name : basename(file, extname(file));
						const presetDate = args.noDate ? undefined : await getISOTime(file);
						const presetObj = convertPreset(presetBlob, presetName, presetDate, args);

						return JSON.stringify(presetObj, null, 0);
				})
				.catch((err) => {
						throw new Error(err.message);
				});
}

export function convertFileSync(file, customArgs) {
		const args = {
				...defaultArgs,
				...customArgs
		};

		try {
				const presetBlob = readFileSync(file);
				const presetName = typeof args.name !== 'undefined' && args.name.trim().length > 0 ? args.name : basename(file, extname(file));
				const presetDate = args.noDate ? undefined : statSync(file).mtime.toISOString();

				const presetObj = convertPreset(presetBlob, presetName, presetDate, args);

				return JSON.stringify(presetObj, null, 0);
		} catch (err) {
				throw new Error(err.message);
		}



}

async function getISOTime(file) {
		const time = await fs.stat(file);

		return time.mtime.toISOString();
}
