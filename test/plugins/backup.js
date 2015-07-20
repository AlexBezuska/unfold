"use strict";

module.exports = {
	process: function(config, file, callback) {
		file.path += ".bak";
		callback(undefined, file);
	}
};
