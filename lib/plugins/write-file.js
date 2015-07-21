"use strict";

var fs = require("fs");

function writeFile(config, file, callback) {
	var handleResult = function(err) {
		if (err) {
			callback(err);
			return;
		}
		callback(undefined, file);
	};
	if (file.stats.isDirectory()) {
		fs.mkdir(file.path, handleResult);
	} else {
		fs.writeFile(file.path, file.data, "utf8", handleResult);
	}
}

module.exports = {
	process: writeFile
};
