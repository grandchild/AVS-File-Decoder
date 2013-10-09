function checkCompat () {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		compat = true;
	} else {
		compat = false;
	}
}

function loadDir (element, pattern) {
	var allfiles = element.files;
	var files = [];
	for (var i = 0; i < allfiles.length; i++) {
		if(pattern.test(allfiles[i].name)) {
			files.push(allfiles[i]);
		}
	};
	return files;
}

function loadFile (file, callback) {
	if(!file instanceof File) {
		log("Error: 'file' parameter is no file.");
		return false;
	}
	if(typeof callback !== "function") {
		log("Error: 'callback' parameter is no function.");
		return false;
	}
	
	log("Loading file "+file.name+"... ");
	var reader = new FileReader();
	reader.onloadend = function(e) {
		if (e.target.readyState == FileReader.DONE) {
			callback(e.target.result, file);
		}
	};
	
	reader.readAsArrayBuffer(file);
}