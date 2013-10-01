var sizeInt = 4;
var presetHeaderLength = 25;
var builtinMax = 16384;

var componentTable =
		[
		//// built-in components
			{'name': "Effect List",
				'code': 0xfffffffe, 'group': "", 'func': "effectList"},
			{'name': "Buffer Save",
				'code': 0x12, 'group': "Misc", 'func': "bufferSave"},
			{'name': "Comment",
				'code': 0x15, 'group': "Misc", 'func': "comment"},
			{'name': "Set Render Mode",
				'code': 0x28, 'group': "Misc", 'func': "renderMode"},
			{'name': "Color Modifier",
				'code': 0x2D, 'group': "Trans", 'func': "colorModifier"},
		//// APEs
			{'name': "AVS Trans Automation",
				'code': // Misc: AVSTrans Automation.......
					[0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x41, 0x56, 0x53, 0x54, 0x72, 0x61, 0x6E, 0x73, 0x20, 0x41, 0x75, 0x74, 0x6F, 0x6D, 0x61, 0x74, 0x69, 0x6F, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
				'group': "Misc", 'func': "avsTrans"},
			{'name': "Texer II",
				'code': // Acko.net: Texer II..............
					[0x41, 0x63, 0x6B, 0x6F, 0x2E, 0x6E, 0x65, 0x74, 0x3A, 0x20, 0x54, 0x65, 0x78, 0x65, 0x72, 0x20, 0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
				'group': "Render", 'func': "texer2"},
			{'name': "Color Map",
				'code': // Color Map.......................
					[0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x4D, 0x61, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
				'group': "Trans", 'func': "colorMap"},
		];

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
			var res = window["decode_"+componentTable[i].func](blob, fp+sizeInt*2+isDll*32);
		}
		if(!res || typeof res !== "object") { // should not happen, decode functions should throw their own.
			throw new ConvertException("Unknown convert error");
		}
		components.push(res);
		fp += size + sizeInt*2 + isDll*32;
	}
	if(pedanticMode && blob[fp-1]!==0x00) {
		// no trailing zero in AVS > 2.? (2.8?)
		//throw new ConvertException("Missing terminating zero at end of preset. (pedantic)");
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
		for (var i = 0; i < componentTable.length; i++) {
			if(componentTable[i].code instanceof Array &&
					cmpBytes(blob, offset+sizeInt, componentTable[i].code)) {
				log("Found component: "+componentTable[i].name);
				return i;
			}
		};
	}
	log("Found unknown component (code:"+code+")");
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
	// ignore bitField1, it contains the same information as bitField2
	//var bitField1 = getBitField(blob[offset]);
	var bitField2 = getBitField(blob[offset+1]);
	var comp = {
		'type': 'EffectList',
		'enabled': !bitField2[1],
		'clearFrame': bitField2[0],
		'input': getBlendmodeIn(blob[offset+2]),
		'output': getBlendmodeOut(blob[offset+3]),
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
		var frameSize = getUInt32(blob, extOffset+sizeInt*3+initSize);
		comp['code'] = {
			'init': getString(blob, extOffset+sizeInt*3, initSize),
			'frame': getString(blob, extOffset+sizeInt*4+initSize, frameSize),
		};
	} //else: old Effect List format, inside components just start
	var content = convertComponents(blob.subarray(contOffset, contOffset+contSize));
	comp['components'] = content;
	return comp;
}

function decode_bufferSave (blob, offset) {
	return {
		'type': 'BufferSave',
		'mode': getBufferMode(blob[offset]),
		'buffer': blob[offset+sizeInt],
		'blend': getBlendmodeBuffer(blob[offset+sizeInt*2]),
		'adjustBlend': blob[offset+sizeInt*3],
	};
}

function decode_comment (blob, offset) {
	return {
		'type': 'Comment',
		'comment': getString(blob, offset+sizeInt, getUInt32(blob, offset)),
	};
}

function decode_colorModifier (blob, offset) {
	return {
		'type': 'ColorModifier',
		'recomputeEveryFrame': blob[offset],
		'code': decodeCodePFBI(blob, offset+1),
	};
}

function decode_renderMode (blob, offset) {
	return {
		'type': 'SetRenderMode',
		'enabled': blob[offset+3]>>7,
		'blend': getBlendmodeRender(blob[offset]),
		'adjustBlend': blob[offset+1],
		'lineSize': blob[offset+2],
	};
}

function decode_avsTrans (blob, offset) {
	var size = getUInt32(blob, offset-sizeInt);
	return {
		'type': 'AVS Trans Automation',
		'enabled': getUInt32(blob, offset)===1,
		'logging': getUInt32(blob, offset+sizeInt)===1,
		'translateFirstLevel': getUInt32(blob, offset+sizeInt*2)===1,
		'readCommentCodes': getUInt32(blob, offset+sizeInt*3)===1,
		'code': getString(blob, offset+sizeInt*4, size-sizeInt*4),
	};
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
function decodeCodePFBI (blob, offset) {
	var strings = new Array(4);
	for (var i = 0, p = offset; i < 4; i++, p += size+sizeInt) {
		size = getUInt32(blob, p);
		strings[i] = getString(blob, p+sizeInt, size);
	};
	var code = {};
	var map = [3, 1, 2, 0];
	var fields = ["init", "onFrame", "onBeat", "perPoint"]
	for (var i = 0; i < strings.length; i++) {
		code[fields[i]] = strings[map[i]];
	};
	return code;
}

// Blend modes
function getBlendmodeIn (code) {
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
	return blendmodes[code];
}

function getBlendmodeOut (code) {
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
	return blendmodes[code];
}

function getBlendmodeBuffer (code) {
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
	return blendmodes[code];
}

function getBlendmodeRender (code) {
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
	return blendmodes[code];
}

// Buffer modes
function getBufferMode (code) {
	var buffermodes = {
			'0': 'Save',
			'1': 'Restore',
			'2': 'AlternateSaveRestore',
			'3': 'AlternateRestoreSave',
		};
	return buffermodes[code];
}