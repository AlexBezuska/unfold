"use strict";

var async = require("async");
var ConfigurationError = require("./configuration-error");
var walk = require("fs-walk-breadth-first");

var readFile = require("./plugins/read-file");
var moveToDestinationPath = require("./plugins/move-to-destination-path");
var writeFile = require("./plugins/write-file");

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
	var plugins = [].concat(readFile, userPlugins, moveToDestinationPath, writeFile);
	plugins = plugins.map(function(plugin) {
		return plugin.process;
	}).map(function(fn) {
		return spread.bind(this, fn.bind(this, config));
	});
	walk(config.sourceDirectory, process.bind(this, plugins), callback);
}

module.exports = unfold;
