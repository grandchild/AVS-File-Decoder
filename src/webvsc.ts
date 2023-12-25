// Modules
import * as Util from './lib/util';
import config from './config';
import decode from './lib/decode';
import { Preset } from './schema/preset';

// Constants
let verbosity = 0; // log individual key:value fields

const defaultArgs: Webvsc.Arguments = {
	hidden: true,
	quiet: false,
	verbose: 0
};

export function convertPreset(data: Buffer | ArrayBuffer, presetName: string, presetDate: Date | undefined = undefined, customArgs: Webvsc.Arguments = {}): Preset {
	const args = {
		...defaultArgs,
		...customArgs
	};

	verbosity = args.quiet ? -1 : Number(args.verbose);

	Util.setVerbosity(verbosity);
	Util.setHiddenStrings(Boolean(args.hidden));

	const blob8 = new Uint8Array(data);

	return {
		name: presetName,
		date: args.noDate ? undefined : presetDate?.toISOString(),
		clearFrame: decode.presetHeader(blob8.subarray(0, config.presetHeaderLength)),
		components: Util.convertComponents(blob8.subarray(config.presetHeaderLength))
	};
}
