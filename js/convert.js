var sizeInt = 4;
var presetHeaderLength = 25;

var componentTable =
		[
			// code, name, regexp
			{'name': "Effect List", 'code': 0xfffffffe, 'group': "",
				'func': "effectList"},
			{'name': "Comment",     'code': 0x15, 'group': "Misc",
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
		throw new ConvertException("Missing terminating zero at end of preset. (pedantic)");
	}
	return cJoin(json);
}

function getComponentIndex (blob, offset) {
	var code = getUInt32(blob, offset);
	for (var i = 0; i < componentTable.length; i++) {
		if(code === componentTable[i].code) {
			return i;
		}
	};
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

function decode_effectList (blob, offset, size) {
	var json = [];
	//var str = getString(blob, offset+sizeInt, getUInt32(blob));
	json.push(jsonKeyVal('type', 'EffectList'));
	json.push(jsonKeyVal('output', "ADDITIVE"));
	return cJoin(json);
}

function decode_comment (blob, offset, size) {
	var json = [];
	var str = getString(blob, offset+sizeInt, getUInt32(blob, offset));
	json.push(jsonKeyVal('type', 'comment'));
	json.push(jsonKeyVal('comment', str));
	return cJoin(json);
}

/**
 * blank decode function

function decode_ (blob, offset, size) {
	var json[];
	json.push(jsonKeyVal('type',''));
	return cJoin(json);
}

*/