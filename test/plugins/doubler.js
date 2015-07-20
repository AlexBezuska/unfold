"use strict";

module.exports = {
	process: function(config, file, callback) {
		var file2 = {
			path: file.path + ".bak",
			stats: file.stats,
			data: file.data
		};
		callback(undefined, [file, file2]);
	}
};
