"use strict";

var mockFs = require("mock-fs");

/*
 * We need to mock the filesystem in the first plugin because iojs 2.2.x made a change
 * that breaks mock-fs's mocking behavior for the "require" method.
 * https://github.com/tschaub/mock-fs/issues/43
 * This lets the real require work against the filesystem, and the rest of the test operate against the mock filesystem.
 * It's a bit strange, but it works.
 */
module.exports = {
	init: function(config, callback) {
		mockFs(config.fs);
		callback(undefined, config);
	}
};
