// Modules
import * as Components from './components';
import config from '../config';
import decode from './decode';
import get from './get';
import Log from './log';
import { PresetComponents } from 'src/schema/preset';

const componentTable: Webvsc.ComponentDefinition[] = Components.builtin.concat(Components.dll);

const setHiddenStrings = (value: boolean): void => {
		config.hiddenStrings = value;
};

let verbosity = 0;

const setVerbosity = (value: number): void => {
		verbosity = value;
};

class ConvertException extends Error {
		name = 'ConvertException';

		constructor(public message: string) {
				super(message);
				this.message = message;
		}

		toString(): string {
				return `${this.name} : ${this.message}`;
		}
}

function cmpBytes(arr: Uint8Array, offset: number, test: number[]): boolean {
		for (let i = 0; i < test.length; i++) {
				if (test[i] === null) {
						continue; // null means 'any value' - a letiable
				}
				if (arr[i + offset] !== test[i]) {
						return false;
				}
		}

		return true;
}

function printTable(name: string, table: Record<string, unknown>): void {
		Log.log(`${name}:`);
		for (const key in table) {
				Log.log(`\t${key}: ${table[key] ? ('' + table[key]).replace(/\n/g, '\n\t\t') : 'undefined'}`);
		}
}

function callFunction(funcName: string, blobOrValue: Webvsc.JSONPrimitive | Uint8Array, offset?: void | number, extra?: unknown | void): unknown {
		try {
				if (blobOrValue instanceof Uint8Array) {
						return get[funcName](blobOrValue, offset, extra);
				} else {
						return get[funcName](blobOrValue);
				}
		} catch (e) {
				if (e.message.search(/not a function|has no method/) >= 0) {
						throw new ConvertException(`Method or table '${'get' + funcName}' was not found. Correct capitalization?`);
				} else {
						throw e;
				}
		}
}

function removeSpaces(str: string): string {
		return str.replace(/[ ]/g, '');
}

function lowerInitial(str: string): string {
		return str[0].toLowerCase() + str.slice(1);
}



function convertComponents(blob: Uint8Array): PresetComponents[] {
		let fp = 0;
	const components: PresetComponents[] = [];
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
						throw new ConvertException('Unknown convert error');
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
						if (componentTable[i].code instanceof Array && cmpBytes(blob, offset + config.sizeInt, <number[]>componentTable[i].code)) {
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

export { callFunction, cmpBytes, convertComponents, ConvertException, lowerInitial, printTable, removeSpaces, setHiddenStrings, setVerbosity };
