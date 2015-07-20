"use strict";

module.exports = {
	process: function(config, file, callback) {
		file.data = "yolo";
		callback(undefined, file);
	}
};
