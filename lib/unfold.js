"use strict";

var ConfigurationError = require("./configuration-error");
var fs = require("fs");
var srcToDestPath = require("./src-to-dest-path");
var walk = require("fs-walk-breadth-first");

function process(config, filename, stats, callback) {
	var dest = srcToDestPath(config.sourceDirectory, config.destinationDirectory, filename);
	fs.readFile(filename, "utf8", function(err, data) {
		if (err) {
			callback(err);
			return;
		}
		fs.writeFile(dest, data, "utf8", function(err2) {
			if (err2) {
				callback(err2);
				return;
			}
			callback();
		});
	});
}

function unfold(config, callback) {
	if (!config.sourceDirectory) {
		callback(new ConfigurationError("The sourceDirectory is required and was not specified"));
		return;
	}
	if (!config.destinationDirectory) {
		callback(new ConfigurationError("The destinationDirectory is required and was not specified"));
		return;
	}
	walk(config.sourceDirectory, process.bind(undefined, config), callback);
}

module.exports = unfold;
