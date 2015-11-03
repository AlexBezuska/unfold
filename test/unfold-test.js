"use strict";

var fs = require("fs");
var mockFs = require("mock-fs");
var test = require("tape");
var unfold = require("../lib/unfold");

test("missing sourceDirectory folder should return error", function(t) {
	mockFs.restore();
	t.plan(1);
	unfold({
		plugins: ["../test/test-plugins/mock-fs"],
		fs: {}
	}, function(err) {
		t.ok(err, "should have an error");
	});
});
test("missing destinationDirectory folder should return error", function(t) {
	mockFs.restore();
	t.plan(1);
	unfold({
		sourceDirectory: "src",
		plugins: ["../test/test-plugins/mock-fs"],
		fs: {}
	}, function(err) {
		t.ok(err, "should have an error");
	});
});
test("nonexistant sourceDirectory folder should return error", function(t) {
	mockFs.restore();
	t.plan(1);
	unfold({
		sourceDirectory: "src",
		destinationDirectory: "dest",
		plugins: ["../test/test-plugins/mock-fs"],
		fs: {}
	}, function(err) {
		t.ok(err, "should have an error");
	});
});
test("text file should be copied to destination", function(t) {
	mockFs.restore();
	t.plan(3);
	unfold({
		sourceDirectory: "src",
		destinationDirectory: "dest",
		plugins: ["../test/test-plugins/mock-fs"],
		fs: { src: { "test.txt": "hello world" }, dest: {} }
	}, function(err) {
		t.notOk(err, "should not have an error");
		fs.readFile("dest/test.txt", "utf8", function(err2, data) {
			t.notOk(err2, "should not have an error");
			t.equal(data, "hello world", "file should be copied to destination");
		});
	});
});
test("nested text file should be copied to nested destination", function(t) {
	mockFs.restore();
	t.plan(3);
	unfold({
		sourceDirectory: "src",
		destinationDirectory: "dest",
		plugins: ["../test/test-plugins/mock-fs"],
		fs: { "src/folder/test.txt": "hello world" }
	}, function(err) {
		t.notOk(err, "should not have an error");
		fs.readFile("dest/folder/test.txt", "utf8", function(err2, data) {
			t.notOk(err2, "should not have an error");
			t.equal(data, "hello world", "file should be copied to destination");
		});
	});
});
test("plugin can modify file path", function(t) {
	mockFs.restore();
	t.plan(3);
	unfold({
		sourceDirectory: "src",
		destinationDirectory: "dest",
		plugins: [
			"../test/test-plugins/mock-fs",
			"../test/test-plugins/backup"
		],
		fs: {
			src: { "test.txt": "hello world" },
			dest: {}
		}
	}, function(err) {
		t.notOk(err, "should not have an error");
		fs.readFile("dest/test.txt.bak", "utf8", function(err2, data) {
			t.notOk(err2, "should not have an error");
			t.equal(data, "hello world", "file should have new path");
		});
	});
});
test("plugin can modify file data", function(t) {
	mockFs.restore();
	t.plan(3);
	unfold({
		sourceDirectory: "src",
		destinationDirectory: "dest",
		plugins: [
			"../test/test-plugins/mock-fs",
			"../test/test-plugins/yolo"
		],
		fs: {
			src: { "test.txt": "hello world" },
			dest: {}
		}
	}, function(err) {
		t.notOk(err, "should not have an error");
		fs.readFile("dest/test.txt", "utf8", function(err2, data) {
			t.notOk(err2, "should not have an error");
			t.equal(data, "yolo", "file should have new data");
		});
	});
});
test("plugin can make two files from one file", function(t) {
	mockFs.restore();
	t.plan(5);
	unfold({
		sourceDirectory: "src",
		destinationDirectory: "dest",
		plugins: [
			"../test/test-plugins/mock-fs",
			"../test/test-plugins/doubler"
		],
		fs: {
			src: { "test.txt": "hello world" },
			dest: {}
		}
	}, function(err) {
		t.notOk(err, "should not have an error");
		fs.readFile("dest/test.txt", "utf8", function(err2, data) {
			t.notOk(err2, "should not have an error");
			t.equal(data, "hello world", "file should have new path");
			fs.readFile("dest/test.txt.bak", "utf8", function(err3, data2) {
				t.notOk(err3, "should not have an error");
				t.equal(data2, "hello world", "file should have new path");
			});
		});
	});
});
