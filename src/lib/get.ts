import { ConvertException } from './util';
import config from '../config';
import Log from './log';

export default {
		Bit(blob: Uint8Array, offset: number, pos: number | number[]): [number, number] {
				if ((<number[]>pos).length) {
						if ((<number[]>pos).length !== 2) {
								throw new this.ConvertException(`Invalid Bitfield range ${pos}.`);
						}
						const mask = (2 << (pos[1] - pos[0])) - 1;
						return [(blob[offset] >> pos[0]) & mask, 1];
				} else {
						return [(blob[offset] >> (<number>pos)) & 1, 1];
				}
		},

		UInt(blob: Uint8Array, offset: number, size: number): number {
				if (!offset) {
						offset = 0;
				}
				if (offset > blob.length - size) {
						Log.warn(`WARNING: getUInt: offset overflow ${offset} > ${blob.length - size}`);
						return 0;
				}
				switch (size) {
						case 1:
								return blob[offset];
						case config.sizeInt:
								return this.UInt32(blob, offset);
						case config.sizeInt * 2:
								return this.UInt64(blob, offset);
						default:
								throw new ConvertException(`Invalid integer size '${size}', only 1, ${config.sizeInt} and ${config.sizeInt * 2} allowed.`);
				}
		},

		UInt32(blob: Uint8Array, offset = 0): number {
				if (offset > blob.length - config.sizeInt) {
						Log.warn(`WARNING: getUInt32: offset overflow ${offset} > ${blob.length - config.sizeInt}`);
						return 0;
				}
				const array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + config.sizeInt);
				try {
						return new Uint32Array(array, 0, 1)[0];
				} catch (e) {
						if (e instanceof RangeError) {
								Log.error(e.stack);
								throw new ConvertException(`Invalid offset ${offset} to getUInt32.\nIs this preset very old? Send it in, so we can look at it!`);
						} else {
								throw e;
						}
				}
		},

		Int32(blob: Uint8Array, offset = 0): [number, number] {
				if (offset > blob.length - config.sizeInt) {
						Log.warn(`WARNING: getInt32: offset overflow ${offset} > ${blob.length - config.sizeInt}`);
						return [0, config.sizeInt];
				}
				const array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + config.sizeInt);
				try {
						return [new Int32Array(array, 0, 1)[0], config.sizeInt];
				} catch (e) {
						if (e instanceof RangeError) {
								throw new ConvertException(`Invalid offset ${offset} to getInt32.\nIs this preset very old? Send it in, so we can look at it!`);
						} else {
								throw e;
						}
				}
		},

		UInt64(blob: Uint8Array, offset = 0): number {
				if (offset > blob.length - config.sizeInt * 2) {
						Log.warn(`WARNING: getUInt64: offset overflow ${offset} > ${blob.length - config.sizeInt * 2}`);
						return 0;
				}
				const array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + config.sizeInt * 2);
				try {
						const two32 = new Uint32Array(array, 0, 2);
						return two32[0] + two32[1] * 0x100000000;
				} catch (e) {
						if (e instanceof RangeError) {
								throw new ConvertException(`Invalid offset ${offset} to getUInt64.\nIs this preset very old? Send it in, so we can look at it!`);
						} else {
								throw e;
						}
				}
		},

		Float(blob: Uint8Array, offset = 0): [number, number] {
				const array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + config.sizeInt);
				try {
						return [new Float32Array(array, 0, 1)[0], 4];
				} catch (e) {
						if (e instanceof RangeError) {
								throw new ConvertException(`Invalid offset ${offset} to getFloat.\nIs this preset very old? Send it in, so we can look at it!`);
						} else {
								throw e;
						}
				}
		},

		Bool(blob: Uint8Array, offset: number, size: number): [boolean, number] {
				const val = size === 1 ? blob[offset] : this.UInt32(blob, offset);
				return [val !== 0, size];
		},

		Boolified(num: number): boolean {
				return num === 0 ? false : true;
		},

		SizeString(blob: Uint8Array, offset: number, size?: number): [string, number] | [string, number, string[]] {
				let add = 0;
				let result = '';
				let getHidden = false;
				if (!size) {
						size = this.UInt32(blob, offset);
						add = config.sizeInt;
				} else {
						getHidden = config.hiddenStrings;
				}
				const end = offset + size + add;
				let i = offset + add;
				let c = blob[i];
				while (c > 0 && i < end) {
						result += String.fromCharCode(c);
						c = blob[++i];
				}
				let hidden: string[] = [];
				if (getHidden) {
						hidden = this.HiddenStrings(blob, i, end);
				}
				if (hidden.length === 0) {
						return [result, size + add];
				} else {
						return [result, size + add, hidden];
				}
		},

		HiddenStrings(blob: Uint8Array, i: number, end: number): string[] {
				const nonPrintables: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 127, 129, 141, 143, 144, 157, 173];
				const hidden: string[] = [];
				while (i < end) {
						let c = blob[i];
						let s = '';
						while (nonPrintables.indexOf(c) < 0 && i < end) {
								s += String.fromCharCode(c);
								c = blob[++i];
						}
						i++;
						// mostly of interest might be (lost) code, and thus check for '=' to
						// weed out a lot of random uninteresting strings.
						// TODO: more sophisticated filter
						if (s.length > 4 && s.indexOf('=') >= 0) {
								hidden.push(s);
						}
				}
				return hidden;
		},

		NtString(blob: Uint8Array, offset: number): [string, number] {
				let result = '';
				let i = offset;
				let c = blob[i];
				while (c > 0) {
						result += String.fromCharCode(c);
						c = blob[++i];
				}
				return [result, i - offset + 1];
		},

		Map1(blob: Uint8Array, offset: number, map: unknown): [string, number] {
				return [this.Mapping(map, blob[offset]), 1];
		},

		Map4(blob: Uint8Array, offset: number, map: unknown): [string, number] {
				return [this.Mapping(map, this.UInt32(blob, offset)), config.sizeInt];
		},

		Map8(blob: Uint8Array, offset: number, map: unknown): [string, number] {
				return [this.Mapping(map, this.UInt64(blob, offset)), config.sizeInt * 2];
		},

		RadioButton(blob: Uint8Array, offset: number, map: unknown[]): [string, number] {
				let key = 0;
				for (let i = 0; i < map.length; i++) {
						const on: number = this.UInt32(blob, offset + config.sizeInt * i) !== 0 ? 1 : 0;
						if (on) {
								// in case of (erroneous) multiple selections, the last one selected wins
								key = on * (i + 1);
						}
				}

				return [this.Mapping(map, key), config.sizeInt * map.length];
		},

		Mapping(map: unknown, key: number): string {
				const value = map[key];
				if (value === undefined) {
						throw new ConvertException(`Map: A value for key '${key}' does not exist.`);
				} else {
						return value;
				}
		},

		// Point, Frame, Beat, Init code fields - reorder to I,F,B,P order.
		CodePFBI(blob: Uint8Array, offset: number): [Webvsc.CodeSection, number] {
				const map: [string, number][] = [
						['init', 3],
						['perFrame', 1],
						['onBeat', 2],
						['perPoint', 0]
				];
				return this.CodeSection(blob, offset, map);
		},

		// Frame, Beat, Init code fields - reorder to I,F,B order.
		CodeFBI(blob: Uint8Array, offset: number): [Webvsc.CodeSection, number] {
				const map: [string, number][] = [
						['init', 2],
						['perFrame', 1],
						['onBeat', 0]
				];
				return this.CodeSection(blob, offset, map);
		},

		CodeIFBP(blob: Uint8Array, offset: number): [Webvsc.CodeSection, number] {
				const map: [string, number][] = [
						['init', 0],
						['perFrame', 1],
						['onBeat', 2],
						['perPoint', 3]
				];
				return this.CodeSection(blob, offset, map);
		},

		CodeIFB(blob: Uint8Array, offset: number): [Webvsc.CodeSection, number] {
				const map: [string, number][] = [
						['init', 0],
						['perFrame', 1],
						['onBeat', 2]
				];
				return this.CodeSection(blob, offset, map);
		},

		// used by 2.8+ 'Effect List'
		CodeEIF(blob: Uint8Array, offset: number): [Webvsc.CodeSection, number] {
				const map: [string, number][] = [
						['init', 0],
						['perFrame', 1]
				];
				const code: [Webvsc.CodeSection, number] = this.CodeSection(blob, offset, map);
				return [
						{
								enabled: this.Bool(blob, offset, config.sizeInt)[0],
								init: code[0]['init'],
								perFrame: code[0]['perFrame']
						},
						code[1]
				];
		},

		// used only by 'Global Variables'
		NtCodeIFB(blob: Uint8Array, offset: number): [Webvsc.CodeSection, number] {
				const map: [string, number][] = [
						['init', 0],
						['perFrame', 1],
						['onBeat', 2]
				];
				return this.CodeSection(blob, offset, map, /*nullterminated*/ true);
		},

		// used only by 'Triangle'
		NtCodeIFBP(blob: Uint8Array, offset: number): [Webvsc.CodeSection, number] {
				const map: [string, number][] = [
						['init', 0],
						['perFrame', 1],
						['onBeat', 2],
						['perPoint', 3]
				];
				return this.CodeSection(blob, offset, map, /*nullterminated*/ true);
		},

		// the Legacy*-functions are used by ancient versions of 'Super Scope', 'Dynamic Movement', 'Dynamic Distance Modifier', 'Dynamic Shift'
		LegacyCodePFBI(blob: Uint8Array, offset: number): [Webvsc.CodeSection, number] {
				const map: [string, number][] = [
						['init', 3],
						['perFrame', 1],
						['onBeat', 2],
						['perPoint', 0]
				];
				return this.CodeSection(blob, offset, map, /*nullterminated*/ false, /*string max length*/ 256);
		},

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		LegacyCodeIFB(blob: Uint8Array, offset: number): [Webvsc.CodeSection, number] {
				const map: [string, number][] = [
						['init', 0],
						['perFrame', 1],
						['onBeat', 2]
				];
				return this.CodeSection(blob, offset, map, /*nullterminated*/ false, /*string max length*/ 256);
		},

		CodeSection(blob: Uint8Array, offset: number, map: [string, number][], nt = false, fixedSize?: number): [Webvsc.CodeSection, number] {
				const strings = new Array(map.length);
				let totalSize = 0;
				let strAndSize: [string, number] | [string, number, string[]];
				let hidden: string[] = [];
				for (let i = 0, p = offset; i < map.length; i++, p += strAndSize[1]) {
						strAndSize = nt ? this.NtString(blob, p) : this.SizeString(blob, p, fixedSize);
						totalSize += strAndSize[1];
						strings[i] = strAndSize[0];
						if (strAndSize.length > 2) {
								hidden = hidden.concat((<[string, number, string[]]>strAndSize)[2]);
						}
				}
				const code = {};
				for (let i = 0; i < strings.length; i++) {
						code[map[i][0]] = strings[map[i][1]];
				}
				if (hidden.length > 0) {
						code['_hidden'] = hidden;
				}
				return [<Webvsc.CodeSection>code, totalSize];
		},

		ColorList(blob: Uint8Array, offset: number): [string[], number] {
				const colors = [];
				let num = this.UInt32(blob, offset);
				const size = config.sizeInt + num * config.sizeInt;
				while (num > 0) {
						offset += config.sizeInt;
						colors.push(this.Color(blob, offset)[0]);
						num--;
				}

				return [colors, size];
		},

		ColorMaps(blob: Uint8Array, offset: number): [{ index: number; enabled: boolean; id?: number; fileName?: string; colors: { color: string; position: number }[] }[], number] {
				let mapOffset = offset + 480;
				const maps: ColorMap[] = [];
				const headerSize = 60; // 4B enabled, 4B num, 4B id, 48B filestring
				let mi = 0; // map index, might be != i when maps are skipped
				for (let i = 0; i < 8; i++) {
						const enabled = this.Bool(blob, offset + headerSize * i, config.sizeInt)[0];
						const num = this.UInt32(blob, offset + headerSize * i + config.sizeInt);
						const map = this.ColorMap(blob, mapOffset, num);
						// check if it's a disabled default {0: #000000, 255: #ffffff} map, and only save it if not.
						if (!enabled && map.length === 2 && map[0].color === '#000000' && map[0].position === 0 && map[1].color === '#ffffff' && map[1].position === 255) {
								// skip this map
						} else {
								maps[mi] = {
										index: i,
										enabled: enabled,
										colors: map
								};
								if (config.allFields) {
										const id = this.UInt32(blob, offset + headerSize * i + config.sizeInt * 2); // id of the map - not really needed.
										const mapFile = this.NtString(blob, offset + headerSize * i + config.sizeInt * 3)[0];
										maps[mi]['id'] = id;
										maps[mi]['fileName'] = mapFile;
								}
								mi++;
						}
						mapOffset += num * config.sizeInt * 3;
				}

				return [maps, mapOffset - offset];
		},

		ColorMap(blob: Uint8Array, offset: number, num: number): Array<{ color: string; position: number }> {
				const colorMap = [];
				for (let i = 0; i < num; i++) {
						const pos = this.UInt32(blob, offset);
						const color = this.Color(blob, offset + config.sizeInt)[0];
						offset += config.sizeInt * 3; // there's a 4byte id (presumably) following each color.
						colorMap[i] = { color: color, position: pos };
				}

				return colorMap;
		},

		Color(blob: Uint8Array, offset: number): [string, number] {
				// Colors in AVS are saved as (A)RGB (where A is always 0).
				// Maybe one should use an alpha channel right away and set
				// that to 0xff? For now, no 4th byte means full alpha.
				const color = this.UInt32(blob, offset).toString(16);
				let padding = '';
				for (let i = color.length; i < 6; i++) {
						padding += '0';
				}

				return ['#' + padding + color, config.sizeInt];
		},

		ConvoFilter(blob: Uint8Array, offset: number, dimensions: number[]): unknown {
				const size = dimensions[0] * dimensions[1];
				const data = new Array(size);
				for (let i = 0; i < size; i++, offset += config.sizeInt) {
						data[i] = this.Int32(blob, offset)[0];
				}

				const matrix = { width: dimensions[0], height: dimensions[1], data: data };

				return [matrix, size * config.sizeInt];
		},

		// 'Text' needs this
		SemiColSplit(str: string): unknown | string {
				const strings = str.split(';');
				if (strings.length === 1) {
						return strings[0];
				} else {
						return strings;
				}
		},

		BufferNum(code: number): unknown {
				if (code === 0) {
						return 'Current';
				}
				return code;
		}
};
