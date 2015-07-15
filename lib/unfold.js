"use strict";

var ConfigurationError = require("./configuration-error");
var walk = require("fs-walk-breadth-first");

// FIXME: OH NO! walk()'s iterator() should be async, but it's not!
function process(filename, stats) {
	console.log(filename, stats);
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
	walk(config.sourceDirectory, process, callback);
}

module.exports = unfold;
