"use strict";

var async = require("async");
var ConfigurationError = require("./configuration-error");
var fs = require("fs");
var srcToDestPath = require("./src-to-dest-path");
var walk = require("fs-walk-breadth-first");

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

function convertToDestinationPath(config, file, callback) {
	file.path = srcToDestPath(config.sourceDirectory, config.destinationDirectory, file.path);
	callback(undefined, file);
}

function writeFile(config, file, callback) {
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

function ensureArray(itemOrArray) {
	return Array.isArray(itemOrArray) ? itemOrArray : [itemOrArray];
}

function flatten(list) {
	return [].concat.apply([], list);
}

function spread(plugin, files, callback) {
	async.map(ensureArray(files), plugin, function(err, data) {
		if (err) {
			callback(err);
			return;
		}
		callback(undefined, flatten(data));
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
	var userPlugins = (config.plugins || []).map(require);
	var processFuncs = userPlugins.map(function(plugin) {
		return plugin.process;
	});
	var plugins = [readFile].concat(processFuncs).concat([convertToDestinationPath, writeFile]);
	plugins = plugins.map(function(fn) {
		return spread.bind(this, fn.bind(this, config));
	});
	walk(config.sourceDirectory, process.bind(this, plugins), callback);
}

module.exports = unfold;
