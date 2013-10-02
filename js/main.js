var compat = false;
var outputDir = "";

var pedanticMode = false; // check for terminating zeros (and possibly other unnecessary stuff in the future)

/// needs:
// util.js
// files.js
// //dirwalk.js //--not really yet
// convert.js

$(document).ready(function () {
	checkCompat();
	log("File API check: "+(compat?"success":"fail")+".");
	
	var files = [];
	
	$("#preset").change(function(){
		files = loadDir(this, /\.avs$/);
		log("Found "+files.length+" files in directory.");
		for (var i = 0; i < files.length; i++) {
			loadFile(files[i], saveAvsAsJson);
		};
	});
});

function saveAvsAsJson (preset, name) {
	var json = {
			'name': name.substr(0,name.length-4),
			'author': '-',
			'components': convertPreset(preset)
		};
	var output = ('#output');
	$(output).html(JSON.stringify(json, null, '    '));
	$(output).each(function(i, e) {hljs.highlightBlock(e)});
}

// not used - it's filespace wasted, but parsing easier...
function jsonPrintSpecials (k, v) {
	// a 7x7 matrix in full json takes up an awful lot of space
	if(k==="convolutionMatrix") {
		// we know the matrix is 7x7
		return v.join(',');
	}
	return v;
}