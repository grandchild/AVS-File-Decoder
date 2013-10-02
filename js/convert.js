var sizeInt = 4;
var presetHeaderLength = 25;
var builtinMax = 16384;

var builtinComponents = [
		//// built-in components
			{"name": "Effect List",
				"code": 0xfffffffe, "group": "", "func": "effectList"},
			{"name": "FadeOut",
				"code": 0x03, "group": "Trans", "func": "generic", "fields": {
					"speed": sizeInt,
					"color": ["Color", sizeInt], 
				}},
			{"name": "Buffer Save",
				"code": 0x12, "group": "Misc", "func": "generic", "fields": {
					"mode": ["BufferMode", sizeInt],
					"buffer": ["BufferNum", sizeInt],
					"blend": ["BlendmodeBuffer", sizeInt],
					"adjustBlend": sizeInt,
				}},
			{"name": "Comment",
				"code": 0x15, "group": "Misc", "func": "generic", "fields": {
					"text": "SizeString"
				}},
			{"name": "Super Scope",
				"code": 0x24, "group": "Render", "func": "generic", "fields": {
					"enabled": ["Bool", 1], // no UI for this in AVS -> always says: 0x01, setting this to zero manually will disable the SSC.
					"point": "SizeString",
					"frame": "SizeString",
					"beat": "SizeString",
					"init": "SizeString",
					"audioChannel": ["Bit", [0,1], "AudioChannel"],
					"audioRepresent": ["Bit", 2, "AudioRepresent"],
					null: 3, // padding, bitfield before is actually 32 bit
					"colors": "ColorList",
					"lineType": ["Bool", sizeInt, "LineType"],
				}},
			{"name": "Set Render Mode",
				"code": 0x28, "group": "Misc", "func": "generic", "fields": {
					'blend': ["BlendmodeRender", 1],
					'adjustBlend': 1,
					'lineSize': 1,
					'enabled': ["Bit", 7, "Boolified"],
				}},
			{"name": "Dynamic Movement",
				"code": 0x2B, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", 1], // same as in SSC, no UI
					"point": "SizeString",
					"frame": "SizeString",
					"beat": "SizeString",
					"init": "SizeString",
					"bilinear": ["Bool", sizeInt],
					"coordinates": ["Coordinates", sizeInt],
					"gridWidth": sizeInt,
					"gridHeight": sizeInt,
					"alpha": ["Bool", sizeInt],
					"wrap": ["Bool", sizeInt],
					"buffer": ["BufferNum", sizeInt],
					"alphaOnly": ["Bool", sizeInt],
			}},
			{"name": "Color Modifier",
				"code": 0x2D, "group": "Trans", "func": "generic", "fields": {
					"recomputeEveryFrame": ["Bool", 1],
					"point": "SizeString",
					"frame": "SizeString",
					"beat": "SizeString",
					"init": "SizeString",
				}},
		];
//// APEs
var dllComponents = [
			{"name": "AVS Trans Automation",
				"code": // Misc: AVSTrans Automation.......
					[0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x41, 0x56, 0x53, 0x54, 0x72, 0x61, 0x6E, 0x73, 0x20, 0x41, 0x75, 0x74, 0x6F, 0x6D, 0x61, 0x74, 0x69, 0x6F, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
				"group": "Misc", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"logging": ["Bool", sizeInt],
					"translateFirstLevel": ["Bool", sizeInt],
					"readCommentCodes": ["Bool", sizeInt],
					"code": "NtString",
				}},
			{"name": "Texer II",
				"code": // Acko.net: Texer II..............
					[0x41, 0x63, 0x6B, 0x6F, 0x2E, 0x6E, 0x65, 0x74, 0x3A, 0x20, 0x54, 0x65, 0x78, 0x65, 0x72, 0x20, 0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
				"group": "Render", "func": "texer2", "fields": {
					null: 1,
				}},
			{"name": "Color Map",
				"code": // Color Map.......................
					[0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x4D, 0x61, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
				"group": "Trans", "func": "colorMap", "fields": {
					
				}},
			{"name": "Framerate Limiter",
				"code": // VFX FRAMERATE LIMITER...........
					[0x56, 0x46, 0x58, 0x20, 0x46, 0x52, 0x41, 0x4D, 0x45, 0x52, 0x41, 0x54, 0x45, 0x20, 0x4C, 0x49, 0x4D, 0x49, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
				"group": "Misc", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"limit": sizeInt
				}},
			{"name": "Convolution Filter",
				"code": // Holden03: Convolution Filter....
					[0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x33, 0x3A, 0x20, 0x43, 0x6F, 0x6E, 0x76, 0x6F, 0x6C, 0x75, 0x74, 0x69, 0x6F, 0x6E, 0x20, 0x46, 0x69, 0x6C, 0x74, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00],
				"group": "Misc", "func": "generic", "fields": {
					
				}},
			/*
			{"name": "",
				"code":
					[],
				"group": "", "func": "generic", "fields": {
					
				}},
			*/
		];
var componentTable = builtinComponents.concat(dllComponents);

function convertPreset (presetFile) {
	var preset = {};
	//var blob32 = new Uint32Array(preset);
	var blob8 = new Uint8Array(presetFile);
	try {
		var clearFrame = decodePresetHeader(blob8.subarray(0, presetHeaderLength));
		preset['clearFrame'] = clearFrame;
		var components = convertComponents(blob8.subarray(presetHeaderLength));
		preset['components'] = components;
	} catch (e) {
		if(e instanceof ConvertException) {
			log("Error: "+e.message);
			return null;
		} else {
			throw e;
		}
	}
	return preset;
}

function convertComponents (blob) {
	var fp = 0;
	var components = [];
	while(fp < blob.length) {
		var code = getUInt32(blob, fp);
		var i = getComponentIndex(code, blob, fp);
		var isDll = code>builtinMax && code!==0xfffffffe;
		var size = getComponentSize(blob, fp+sizeInt+isDll*32);
		if(i<0) {
			var res = {'type': 'Unknown: ('+(-i)+')'};
		} else {
			var offset = fp+sizeInt*2+isDll*32;
			var res = window["decode_"+componentTable[i].func](
				blob,
				offset,
				componentTable[i].fields,
				componentTable[i].name,
				offset+size);
		}
		if(!res || typeof res !== "object") { // should not happen, decode functions should throw their own.
			throw new ConvertException("Unknown convert error");
		}
		components.push(res);
		fp += size + sizeInt*2 + isDll*32;
	}
	return components;
}

function getComponentIndex (code, blob, offset) {
	if(code<builtinMax || code===0xfffffffe) {
		for (var i = 0; i < componentTable.length; i++) {
			if(code === componentTable[i].code) {
				log("Found component: "+componentTable[i].name+" ("+code+")");
				return i;
			}
		};
	} else {
		for (var i = builtinComponents.length; i < componentTable.length; i++) {
			if(componentTable[i].code instanceof Array &&
					cmpBytes(blob, offset+sizeInt, componentTable[i].code)) {
				log("Found component: "+componentTable[i].name);
				return i;
			}
		};
	}
	log("Found unknown component (code: "+code+")");
	return -code;
}

function getComponentSize (blob, offset) {
	return getUInt32(blob, offset);
}

function decodePresetHeader(blob) {
	var presetHeader = [ // reads: "Nullsoft AVS Preset 0.2 \x1A"
			0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74,
			0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65,
			0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x32, 0x1A,];
	if(!cmpBytes(blob, /*offset*/0, presetHeader)) {
		throw new ConvertException("Invalid preset header.");
	}
	return blob[presetHeaderLength-1]; // "Clear Every Frame"
}

//// component decode functions

function decode_effectList (blob, offset) {
	var size = getUInt32(blob, offset-sizeInt);
	var comp = {
		'type': 'EffectList',
		'enabled': getBit(blob, offset, 1)[0]!==1,
		'clearFrame': getBit(blob, offset, 0)[0]===1,
		'input': getBlendmodeIn(blob, offset+2, 1)[0],
		'output': getBlendmodeOut(blob, offset+3, 1)[0],
		//ignore constant el config size of 36 bytes (9 x int32)
		'inAdjustBlend': getUInt32(blob, offset+5),
		'outAdjustBlend': getUInt32(blob, offset+9),
		'inBuffer': getUInt32(blob, offset+13),
		'outBuffer': getUInt32(blob, offset+17),
		'inBufferInvert': getUInt32(blob, offset+21)===1,
		'outBufferInvert': getUInt32(blob, offset+25)===1,
		'enableOnBeat': getUInt32(blob, offset+29)===1,
		'onBeatFrames': getUInt32(blob, offset+33),
	};
	var effectList28plusHeader = [ // reads: .$..AVS 2.8+ Effect List Config....
			0x00, 0x40, 0x00, 0x00, 0x41, 0x56, 0x53, 0x20,
			0x32, 0x2E, 0x38, 0x2B, 0x20, 0x45, 0x66, 0x66,
			0x65, 0x63, 0x74, 0x20, 0x4C, 0x69, 0x73, 0x74,
			0x20, 0x43, 0x6F, 0x6E, 0x66, 0x69, 0x67, 0x00,
			0x00, 0x00, 0x00, 0x00];
	var extOffset = offset+37;
	var contSize = size-37;
	var contOffset = extOffset;
	if(cmpBytes(blob, extOffset, effectList28plusHeader)) {
		extOffset += effectList28plusHeader.length;
		var extSize = getUInt32(blob, extOffset);
		contOffset += effectList28plusHeader.length+sizeInt+extSize;
		contSize = size-37-effectList28plusHeader.length-sizeInt-extSize;
		comp['codeEnabled'] = getUInt32(blob, extOffset+sizeInt)===1;
		var initSize = getUInt32(blob, extOffset+sizeInt*2);
		comp['init'] = getSizeString(blob, extOffset+sizeInt*2)[0];
		comp['frame'] = getSizeString(blob, extOffset+sizeInt*3+initSize)[0];
	} //else: old Effect List format, inside components just start
	var content = convertComponents(blob.subarray(contOffset, contOffset+contSize));
	comp['components'] = content;
	return comp;
}

function decode_generic (blob, offset, fields, name, end) {
	var comp = {
		'type': removeSpaces(name)
	};
	var keys = Object.keys(fields);
	var lastWasABitField = false;
	for(var i=0; i<keys.length; i++) {
		if(offset >= end) {
			break;
		}
		var k = keys[i];
		var f = fields[k];
		if(k==="null") {
			offset += f;
			// [null, 0] resets bitfield continuity to allow several consecutive bitfields
			lastWasABitField = false;
			continue;
		}
		var size = 0;
		var value, result;
		var number = typeof f === "number";
		var other = typeof f === "string";
		var array = f instanceof Array;
		if(number) {
			switch(f) {
				case 1:
					size = 1;
					value = blob[offset];
					break;
				case sizeInt:
					size = sizeInt;
					value = getUInt32(blob, offset);
					break;
				default:
					throw new ConvertException("Invalid field size: "+f+".");
			}
			lastWasABitField = false;
		} else if(other) {
			result = window["get"+f](blob, offset);
			value = result[0];
			size = result[1];
			lastWasABitField = false;
		} else if(f && f.length>=2) {
			if(f[0]==="Bit") {
				if(lastWasABitField) {
					offset -= 1; // compensate to stay in same bitfield
				}
				lastWasABitField = true;
			} else {
				lastWasABitField = false;
			}
			result = window["get"+f[0]](blob, offset, f[1]);
			value = result[0];
			if(f[2]) { // further processing if wanted
				value = window["get"+f[2]](value);
			}
			size = result[1];
		}
		
		// save value or function result of value in field
		comp[k] = value;
		offset += size;
	};
	return comp;
}

function decode_texer2 (blob, offset) {
	return {
		'type': 'Texer2',
	};
}

function decode_colorMap (blob, offset) {
	return {
		'type': 'ColorMap',
	};
}

/**
 * blank decode function

function decode_ (blob, offset) {
	return {
		'type': '',
	};
}

*/

//// decode helpers

// Pixel, Frame, Beat, Init code fields - reorder to I,F,B,P order.
function getCodePFBI (blob, offset) {
	var strings = new Array(4);
	var totalSize = 0;
	for (var i = 0, p = offset; i < 4; i++, p += size+sizeInt) {
		size = getUInt32(blob, p);
		totalSize += sizeInt+size;
		strings[i] = getSizeString(blob, p, true, size)[0];
	};
	var code = {};
	var map = [3, 1, 2, 0];
	var fields = ["init", "onFrame", "onBeat", "perPoint"]
	for (var i = 0; i < strings.length; i++) {
		code[fields[i]] = strings[map[i]];
	};
	return [code, totalSize];
}

function getColorList (blob, offset) {
	var colors = [];
	var num = getUInt32(blob, offset);
	var size = sizeInt+num*sizeInt;
	while(num>0) {
		offset += sizeInt;
		colors.push(getColor(blob, offset)[0]);
		num--;
	}
	return [colors, size];
}

function getColor (blob, offset) {
	// Colors in AVS are saved as (A)RGB (where A is always 0).
	// Maybe one should use an alpha channel right away and set
	// that to 0xff? For now, no 4th byte means full alpha.
	var color = getUInt32(blob, offset).toString(16);
	var padding = "";
	for (var i = color.length; i < 6; i++) {
		padding += "0";
	};
	return ["#"+padding+color, sizeInt];
}

// Blend modes
function getBlendmodeIn (blob, offset, size) {
	var blendmodes = {
			 '0': 'Ignore',
			 '1': 'Replace',
			 '2': '50/50',
			 '3': 'Maximum',
			 '4': 'Additive',
			 '5': 'Dest-Src',
			 '6': 'Src-Dest',
			 '7': 'EveryOtherLine',
			 '8': 'EveryOtherPixel',
			 '9': 'XOR',
			'10': 'Adjustable',
			'11': 'Multiply',
			'12': 'Buffer',
		};
	var code = size===1?blob[offset]:getUInt32(blob, offset);
	return [blendmodes[code], size];
}

function getBlendmodeOut (blob, offset, size) {
	var blendmodes = {
			 '0': 'Replace',
			 '1': 'Ignore',
			 '2': 'Maximum',
			 '3': '50/50',
			 '4': 'Dest-Src',
			 '5': 'Additive',
			 '6': 'EveryOtherLine',
			 '7': 'Src-Dest',
			 '8': 'XOR',
			 '9': 'EveryOtherPixel',
			'10': 'Multiply',
			'11': 'Adjustable',
			// don't ask me....
			'13': 'Buffer',
		};
	var code = size===1?blob[offset]:getUInt32(blob, offset);
	return [blendmodes[code], size];
}

function getBlendmodeBuffer (blob, offset, size) {
	var blendmodes = {
			 '0': 'Replace',
			 '1': '50/50',
			 '2': 'Additive',
			 '5': 'EveryOtherPixel',
			 '4': 'Dest-Src',
			 '5': 'EveryOtherLine',
			 '6': 'XOR',
			 '7': 'Maximum',
			 '8': 'Minimum',
			 '9': 'Src-Dest',
			'10': 'Multiply',
			'11': 'Adjustable',
		};
	var code = size===1?blob[offset]:getUInt32(blob, offset);
	return [blendmodes[code], size];
}

function getBlendmodeRender (blob, offset, size) {
	var blendmodes = {
			'0': 'Replace',
			'1': 'Additive',
			'2': 'Maximum',
			'3': '50/50',
			'4': 'Dest-Src',
			'5': 'Src-Dest',
			'6': 'Multiply',
			'7': 'Adjustable',
			'8': 'XOR',
		};
	var code = size===1?blob[offset]:getUInt32(blob, offset);
	return [blendmodes[code], size];
}

// Buffer modes
function getBufferMode (blob, offset, size) {
	var buffermodes = {
			'0': 'Save',
			'1': 'Restore',
			'2': 'AlternateSaveRestore',
			'3': 'AlternateRestoreSave',
		};
	var code = size===1?blob[offset]:getUInt32(blob, offset);
	return [buffermodes[code], size];
}

function getBufferNum (blob, offset, size) {
	var code = size===1 ? blob[offset] : getUInt32(blob, offset);
	if(code===0) return ["Current", size];
	else return [getUInt32(blob, offset), size];
}

function getCoordinates (blob, offset, size) {
	var code = size===1 ? blob[offset] : getUInt32(blob, offset);
	return [code?"Cartesian":"Polar", size];
}

function getLineType (code) {
	return code?"Lines":"Dots";
}

function getAudioChannel (code) {
	var channels = {
			'0': 'Left',
			'1': 'Right',
			'2': 'Center',
	}
	return channels[code];
}

function getAudioRepresent (code) {
	var representations = {
			'0': 'Waveform',
			'1': 'Spectrum',
	}
	return representations[code];
}
