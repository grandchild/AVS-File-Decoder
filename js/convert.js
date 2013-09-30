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
			var res = window["decode_"+componentTable[i].func](blob, fp+sizeInt*2, s);
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
	cmpBytes(blob, presetHeader); // can throw ConvertException
	return blob[presetHeaderLength-1]; // a.k.a. "Clear Every Frame"
}

/*
[(NOT Enabled)*2+ClearEveryFrame+128][(NOT Enabled)*2+ClearEveryFrame][InputBlend][OutputBlend]
[36,LongInt] - Size of object, in bytes.
[InputAdjustBlend,LongInt]
[OutputAdjustBlend,LongInt]
[InputBufferNumber-1,LongInt]
[OutputBufferNumber-1,LongInt]
[InputBufferInvert,LongInt]
[OutputBufferInvert,LongInt]
[EnableOnBeat,LongInt]
[OnBeatFrames,LongInt]
*/

function decode_effectList (blob, offset) {
	var json = [];
	
	json.push(jsonKeyVal('type', 'EffectList'));
	json.push(jsonKeyVal('output', "ADDITIVE"));
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
function decodBlendmode (byte) {
	// body...
}