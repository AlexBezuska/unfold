"use strict";

var path = require("path");

function srcToDestPath(src, dest, filename) {
	var srcParts = src.split(path.sep);
	var destParts = dest.split(path.sep);
	var filenameParts = filename.split(path.sep);
	return destParts.concat(filenameParts.slice(srcParts.length)).join(path.sep);
}

module.exports = srcToDestPath;
