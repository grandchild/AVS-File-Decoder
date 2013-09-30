function walkDirTree(folder, pattern) {
	walkDirFilter(folder.files, pattern);
	
	var subfolders = folder.SubFolders;
	walkDirFilter(subfolders, pattern);
	
	var en = new Enumerator(subfolders);
	while (! en.atEnd()) {
		var subfolder = en.item();
		walkDirTree(subfolder, folder.name + "/" + subfolder.name, pattern);
		en.moveNext();
	}
}

function walkDirFilter(items, pattern) {
	var e = new Enumerator(items);
	while (! e.atEnd()) {
		var item = e.item();
		if (item.name.match(pattern))
			// do sth here...
		e.moveNext();
	}
}

//walkDirTree(dir, '\\.avs$');
