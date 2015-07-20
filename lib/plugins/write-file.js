"use strict";

var fs = require("fs");

function writeFile(config, file, callback) {
	fs.writeFile(file.path, file.data, "utf8", function(err) {
		if (err) {
			callback(err);
			return;
		}
		callback(undefined, file);
	});
}

module.exports = {
	process: writeFile
};
