"use strict";

var fs = require("fs");
var mkdirp = require("mkdirp");

function makeDestinationDirectory(config, callback) {
	mkdirp(config.destinationDirectory, function(err) {
		if (err) {
			callback(err);
			return;
		}
		callback(undefined, config);
	});
}

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
	init: makeDestinationDirectory,
	process: writeFile
};
