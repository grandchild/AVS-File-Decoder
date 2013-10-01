var compat = false;
var outputDir = "";

var pedanticMode = true; // check for terminating zeros (and possibly other unnecessary stuff in the future)

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
	var output = ('#output');
	var json = [
		jsonKeyVal('name',name.substr(0,name.length-4)),
		jsonKeyVal('author','-'),
		convertPreset(preset)];
	$(output).html("{\n"+cJoin(json)+"\n}");
	$(output).each(function(i, e) {hljs.highlightBlock(e)});
}