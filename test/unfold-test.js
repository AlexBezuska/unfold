"use strict";

var fs = require("fs");
var mockFs = require("mock-fs");
var test = require("tape-catch");
var unfold = require("../lib/unfold");

function setup(t, fakeFs) {
	mockFs.restore();
	mockFs(fakeFs);
}

test("missing sourceDirectory folder should return error", function(t) {
	setup(t, {});
	t.plan(1);
	unfold({}, function(err) {
		t.ok(err, "should have an error");
	});
});
test("missing destinationDirectory folder should return error", function(t) {
	setup(t, {});
	t.plan(1);
	unfold({ sourceDirectory: "src" }, function(err) {
		t.ok(err, "should have an error");
	});
});
test("nonexistant sourceDirectory folder should return error", function(t) {
	setup(t, {});
	t.plan(1);
	unfold({ sourceDirectory: "src", destinationDirectory: "dest" }, function(err) {
		t.ok(err, "should have an error");
	});
});
test("text file should be copied to destination", function(t) {
	setup(t, { src: { "test.txt": "hello world" }, dest: {} });
	t.plan(3);
	unfold({ sourceDirectory: "src", destinationDirectory: "dest" }, function(err) {
		t.notOk(err, "should not have an error");
		fs.readFile("dest/test.txt", "utf8", function(err2, data) {
			t.notOk(err2, "should not have an error");
			t.equal(data, "hello world", "file should be copied to destination");
		});
	});
});
test("plugin can modify file data", function(t) {
	setup(t, {
		src: { "test.txt": "hello world" },
		dest: {},
		"plugins/yolo.js": "module.exports = function(file, callback) { file.data='yolo'; callback(undefined, file); };"
	});
	t.plan(3);
	unfold({
		sourceDirectory: "src",
		destinationDirectory: "dest",
		plugins: [
			"../plugins/yolo"
		]
	}, function(err) {
		t.notOk(err, "should not have an error");
		fs.readFile("dest/test.txt", "utf8", function(err2, data) {
			t.notOk(err2, "should not have an error");
			t.equal(data, "yolo", "file should have new data");
		});
	});
});
