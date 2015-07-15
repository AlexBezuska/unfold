"use strict";

var util = require("util");

function ConfigurationError(message) {
	Error.call(this);
	Error.captureStackTrace(this, this.constructor);

	this.name = this.constructor.name;
	this.message = message;
}

util.inherits(ConfigurationError, Error);

module.exports = ConfigurationError;
