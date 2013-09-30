function log (message) {
	$('#log').append(message+"\n");
}

function ConvertException (message) {
	this.message = message;
	this.name = "ConvertException";
}

function jsonKeyVal (key, val) {
	return "'"+key+"': '"+val+"'";
}

function jsonKeyValBool (key, val) {
	return "'"+key+"': "+(val?"true":"false");
}

function jsonKeyArr (key, arr) {
	return "'"+key+"': [\n"+arr+"]";
}

function jsonKeyObj (key, obj) {
	return "'"+key+"': {\n"+obj+"}";
}

function cJoin (json) {
	return json.join(',\n')+"\n";
}

function cmpBytes (arr, test) {
	for (var i = 0; i < test.length; i++) {
		if(test[i] === null){
			continue; // null means 'any value'/a variable
		}
		if(arr[i] !== test[i]) {
			throw new ConvertException("Invalid preset header.");
		}
	}
}

function getUInt32 (buf, offset) {
	if(!offset) offset = 0;
	var array = buf.buffer.slice(buf.byteOffset+offset, buf.byteOffset+offset+4);
	return new Uint32Array(array, 0, 1)[0];
}

function getBitField (bits) {
	var length = 8;
	var field = new Array(length);
	for (var i = 0; i < length; i++) {
		field[i] = ((bits>>i)&1)===1;
	};
	return field;
}

// assumes 0-terminated string!
function getString (buf, offset, size) {
	var result = "";
	log("size: "+size);
	size += offset;
	log("size+offset: "+size);
	// we go to one less than 'size' because it counts terminating 0x00.
	for(var i=offset; i<size-1; i++) {
		result += String.fromCharCode(buf[i]);
	}
	if(pedanticMode && buf[size-1]!==0x00) {
		log("fp: "+buf.byteOffset+size-1);
		throw new ConvertException("Couldn't find terminating zero after string. (pedantic)")
	}
	return result;
}