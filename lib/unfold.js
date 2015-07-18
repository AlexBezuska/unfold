"use strict";

var async = require("async");
var ConfigurationError = require("./configuration-error");
var fs = require("fs");
var srcToDestPath = require("./src-to-dest-path");
var walk = require("fs-walk-breadth-first");

function readFile(file, callback) {
	fs.readFile(file.path, "utf8", function(err, data) {
		if (err) {
			callback(err);
			return;
		}
		file.data = data;
		callback(undefined, file);
	});
}

function convertToDestinationPath(config, file, callback) {
	file.path = srcToDestPath(config.sourceDirectory, config.destinationDirectory, file.path);
	callback(undefined, file);
}

function writeFile(file, callback) {
	fs.writeFile(file.path, file.data, "utf8", function(err) {
		if (err) {
			callback(err);
			return;
		}
		callback(undefined, file);
	});
}

function process(plugins, filename, stats, callback) {
	var file = {
		path: filename,
		stats: stats
	};
	var chain = async.seq.apply(this, plugins);
	chain(file, callback);
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
	var plugins = [
		readFile,
		convertToDestinationPath.bind(this, config),
		writeFile
	];
	walk(config.sourceDirectory, process.bind(this, plugins), callback);
}

module.exports = unfold;
