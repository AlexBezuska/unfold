"use strict";

var async = require("async");
var ConfigurationError = require("./configuration-error");
var walk = require("fs-walk-breadth-first");

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

function isFunction(plugin) {
	return typeof plugin === "function";
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

	var userPlugins = (config.plugins || []);
	var plugins = [].concat("./plugins/read-file", userPlugins, "./plugins/move-to-destination-path", "./plugins/write-file").map(require);

	var inits = plugins.map(function(plugin) {
		return plugin.init;
	}).filter(isFunction);
	async.seq.apply(this, inits)(config, function(err, newConfig) {
		if (err) {
			callback(err);
			return;
		}

		plugins = plugins.map(function(plugin) {
			return plugin.process;
		}).filter(isFunction).map(function(fn) {
			return spread.bind(this, fn.bind(this, newConfig));
		});
		walk(newConfig.sourceDirectory, process.bind(this, plugins), callback);
	});
}

module.exports = unfold;
