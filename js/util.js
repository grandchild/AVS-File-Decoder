var sizeInt = 4;
var presetHeaderLength = 25;
var builtinMax = 16384;

function log (message) {
	$('#log').prepend(message+"\n");
}

function ConvertException (message) {
	this.message = message;
	this.name = "ConvertException";
}

function cmpBytes (arr, offset, test) {
	for (var i = 0; i < test.length; i++) {
		if(test[i] === null){
			continue; // null means 'any value' - a variable
		}
		if(arr[i+offset] !== test[i]) {
			return false;
		}
	}
	return true;
}

function getBit (blob, offset, pos) {
	if(pos instanceof Array) {
		if(pos.length!==2) new ConvertException("Wrong Bitfield range");
		var mask = (2<<(pos[1]-pos[0]))-1;
		return [(blob[offset]>>pos[0])&mask, 1];
	} else {
		return [((blob[offset]>>pos)&1), 1];
	}
}

function getUInt32 (blob, offset) {
	if(!offset) offset = 0;
	var array = blob.buffer.slice(blob.byteOffset+offset, blob.byteOffset+offset+sizeInt);
	return new Uint32Array(array, 0, 1)[0];
}

function getInt32 (blob, offset) {
	if(!offset) offset = 0;
	var array = blob.buffer.slice(blob.byteOffset+offset, blob.byteOffset+offset+sizeInt);
	return new Int32Array(array, 0, 1)[0];
}

function getUInt64 (blob, offset) {
	if(!offset) offset = 0;
	var array = blob.buffer.slice(blob.byteOffset+offset, blob.byteOffset+offset+sizeInt*2);
	var two32 = new Uint32Array(array, 0, 2);
	return two32[0]+two32[1]*0x100000000;
}

function getFloat32 (blob, offset) {
	if(!offset) offset = 0;
	var array = blob.buffer.slice(blob.byteOffset+offset, blob.byteOffset+offset+sizeInt);
	return new Float32Array(array, 0, 1)[0];
}

function getBool (blob, offset, size) {
	var val = size===1?blob[offset]:getUInt32(blob, offset);
	return [val!==0, size];
}

function getBoolified (num) {
	return num==0?false:true;
}

function getSizeString (blob, offset, size) {
	var add = 0;
	var result = "";
	if(!size) {
		size = getUInt32(blob, offset);
		add = sizeInt;
	}
	var end = offset+size+add;
	var i = offset+add;
	var c = blob[i];
	while(c>0 && i<end) {
		result += String.fromCharCode(c);
		c = blob[++i];
	}
	return [result, size+add];
}

function getNtString (blob, offset) {
	var result = "";
	var i = offset;
	var c = blob[i];
	while(c>0) {
		result += String.fromCharCode(c);
		c = blob[++i];
	}
	return [result, i-offset];
}

function removeSpaces (str) {
	return str.replace(/[ ]/g, '');
}
