"use strict";

var fs = require("fs");
var path = require("path");
var walk = require("fs-walk-breadth-first");

function setData(obj, keyPath, data) {
	var parts = keyPath.split(path.sep);

	while (parts.length > 1) {
		var part = parts.shift();
		obj[part] = obj[part] || {};
		obj = obj[part];
	}
	obj[parts[0]] = data;
}

function removeParentFolderPath(parent, filename) {
	var parts = parent.split(path.sep).length;
	return filename.split(path.sep).slice(parts).join(path.sep);
}

function processData(data, folder, callback) {
	walk(folder, function(filename, stats, cb) {
		var ext = path.extname(filename);
		if (ext === ".json") {
			fs.readFile(filename, "utf8", function(err, json) {
				if (err) {
					cb(err);
					return;
				}
				var dataPath = removeParentFolderPath(folder, filename);
				dataPath = dataPath.substr(0, dataPath.length - ".json".length);
				setData(data, dataPath, JSON.parse(json));
				cb();
			});
		} else {
			cb();
		}
	}, function(err) {
		if (err) {
			callback(err);
			return;
		}
		callback(undefined);
	});
}

function readData(config, callback) {
	config.data = config.data || {};
	if (!config.dataDirectory) {
		callback(undefined, config);
		return;
	}
	processData(config.data, config.dataDirectory, function(err) {
		if (err) {
			callback(err);
			return;
		}
		callback(undefined, config);
	});
}

module.exports = {
	init: readData
};
