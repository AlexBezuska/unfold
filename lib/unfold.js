"use strict";

var ConfigurationError = require("./configuration-error");

function unfold(config, callback) {
	if (!config.sourceDirectory) {
		callback(new ConfigurationError("The sourceDirectory is required and was not specified"));
	}
}

module.exports = unfold;
