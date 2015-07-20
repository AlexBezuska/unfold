"use strict";

var srcToDestPath = require("../src-to-dest-path");

function moveToDestinationPath(config, file, callback) {
	file.path = srcToDestPath(config.sourceDirectory, config.destinationDirectory, file.path);
	callback(undefined, file);
}

module.exports = {
	process: moveToDestinationPath
};
