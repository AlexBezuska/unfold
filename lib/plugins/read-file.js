"use strict";

var fs = require("fs");

function readFile(config, file, callback) {
	fs.readFile(file.path, "utf8", function(err, data) {
		if (err) {
			callback(err);
			return;
		}
		file.data = data;
		callback(undefined, file);
	});
}

module.exports = {
	process: readFile
};
