var sizeInt = 4;
var presetHeaderLength = 25;

var componentTable =
		[
			// code, name, regexp
			{'name': "Effect List",    'code': 0xfffffffe, 'group': "",
				'func': "effectList"},
			{'name': "Color Modifier", 'code': 0x2D, 'group': "Trans",
				'func': "colorModifier"},
			{'name': "Comment",        'code': 0x15, 'group': "Misc",
				'func': "comment"},
		];

function convertPreset (preset) {
	var json = [];
	//var blob32 = new Uint32Array(preset);
	var blob8 = new Uint8Array(preset);
	try {
		var clearFrame = decodePresetHeader(blob8.subarray(0, presetHeaderLength));
		json.push(jsonKeyValBool('clearFrame', clearFrame));
		var components = convertComponents(blob8.subarray(presetHeaderLength));
		json.push(jsonKeyArr('components', components));
	} catch (e) {
		if(e instanceof ConvertException) {
			log("Error: "+e.message);
			return null;
		} else {
			throw e;
		}
	}
	return cJoin(json);
}

function convertComponents (blob) {
	var fp = 0;
	var json = [];
	while(fp < blob.length) {
		var i = getComponentIndex(blob, fp);
		var s = getComponentSize(blob, fp+sizeInt);
		if(i<0) {
			var res = jsonKeyVal('type','Unknown: ('+(-i)+')');
		} else {
			var res = window["decode_"+componentTable[i].func](blob, fp+sizeInt*2);
		}
		if(!res || typeof res !== "string") { // should not happen, decode functions should throw their own.
			throw new ConvertException("Unknown convert error");
		}
		json.push(res);
		fp += s + sizeInt*2;
	}
	if(pedanticMode && blob[fp-1]!==0x00) {
		// no trailing zero in AVS > 2.? (2.8?)
		//throw new ConvertException("Missing terminating zero at end of preset. (pedantic)");
	}
	return cJoin(json);
}

function getComponentIndex (blob, offset) {
	var code = getUInt32(blob, offset);
	for (var i = 0; i < componentTable.length; i++) {
		if(code === componentTable[i].code) {
			log("Found component: "+componentTable[i].name);
			return i;
		}
	};
	log("Found unknown component (code:"+code+")");
	return -code;
	//throw new ConvertException("Unknown component type: '"+code+"'");
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
	var json = [];
	json.push(jsonKeyVal('type', 'EffectList'));
	//var bitField1 = getBitField(blob[offset]);
	// ignore bitField1, it contains the same information as bitField2
	var bitField2 = getBitField(blob[offset+1]);
	json.push(jsonKeyValBool('enabled', !bitField2[1]));
	json.push(jsonKeyValBool('clearFrame', bitField2[0]));
	json.push(jsonKeyVal('input', getBlendmodeIn(blob[offset+2])));
	json.push(jsonKeyVal('output',getBlendmodeOut(blob[offset+3])));
	//ignore constant el config size of 36 bytes (9 x int32)
	json.push(jsonKeyVal('inAdjustBlend', getUInt32(blob, offset+5)));
	json.push(jsonKeyVal('outAdjustBlend', getUInt32(blob, offset+9)));
	json.push(jsonKeyVal('inBuffer', getUInt32(blob, offset+13)));
	json.push(jsonKeyVal('outBuffer', getUInt32(blob, offset+17)));
	json.push(jsonKeyValBool('inBufferInvert', getUInt32(blob, offset+21)===1));
	json.push(jsonKeyValBool('outBufferInvert', getUInt32(blob, offset+25)===1));
	json.push(jsonKeyValBool('enableOnBeat', getUInt32(blob, offset+29)===1));
	json.push(jsonKeyVal('onBeatFrames', getUInt32(blob, offset+33)));
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
		
		json.push(jsonKeyValBool('codeEnable',getUInt32(blob, extOffset+sizeInt)===1));
		var codeJson = [];
		var initSize = getUInt32(blob, extOffset+sizeInt*2);
		codeJson.push(jsonKeyVal('init', getString(blob, extOffset+sizeInt*3, initSize)));
		var frameSize = getUInt32(blob, extOffset+sizeInt*3+initSize);
		codeJson.push(jsonKeyVal('frame', getString(blob, extOffset+sizeInt*4+initSize, frameSize)));
		json.push(jsonKeyObj('code', cJoin(codeJson)));
	} //else: old Effect List format, inside components just start
	var content = convertComponents(blob.subarray(contOffset, contSize));
	json.push(jsonKeyObj('components', content));
	return cJoin(json);
}

function decode_comment (blob, offset) {
	var json = [];
	var str = getString(blob, offset+sizeInt, getUInt32(blob, offset));
	json.push(jsonKeyVal('type', 'Comment'));
	json.push(jsonKeyVal('comment', str));
	return cJoin(json);
}

function decode_colorModifier (blob, offset) {
	var json = [];
	json.push(jsonKeyVal('type', 'ColorModifier'));
	json.push(jsonKeyVal('recomputeEveryFrame', blob[offset]));
	json.push(jsonKeyObj('code', decodeCodePFBI(blob, offset+1)));
	return cJoin(json);
}

/**
 * blank decode function

function decode_ (blob, offset) {
	var json = [];
	json.push(jsonKeyVal('type',''));
	return cJoin(json);
}

*/

//// decode helpers

// Pixel, Frame, Beat, Init code fields - json will be in I,F,B,P order.
function decodeCodePFBI (blob, offset) {
	var json = new Array(4);
	var map = [3, 1, 2, 0];
	var fields = ["perPoint", "onFrame", "onBeat", "init"];
	for (var i = 0, p = offset; i < 4; i++, p += size+sizeInt) {
		size = getUInt32(blob, p);
		json[map[i]] = jsonKeyVal(fields[i], getString(blob, p+sizeInt, size));
	};
	return cJoin(json);
}

// Blendmodes
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
			'3': 'EveryOtherPixel',
			'4': 'Dest-Src',
			'5': 'EveryOtherLine',
			'6': 'XOR',
			'7': 'Maximum',
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
