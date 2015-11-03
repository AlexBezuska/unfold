"use strict";

var mockFs = require("mock-fs");
var test = require("tape");
var readData = require("../../lib/plugins/read-data");

test("missing dataDirectory folder should not return error", function(t) {
	mockFs.restore();
	mockFs({});
	t.plan(2);
	readData.init({}, function(err, config) {
		t.notOk(err, "should not have an error");
		t.deepEqual(config.data, {}, "data should exist and be empty");
	});
});
test("nonexistant dataDirectory folder should return error", function(t) {
	mockFs.restore();
	mockFs({});
	t.plan(1);
	readData.init({ dataDirectory: "data" }, function(err) {
		t.ok(err, "should have an error");
	});
});
test("existing empty dataDirectory should make empty data object in config", function(t) {
	mockFs.restore();
	mockFs({ "data": {} });
	t.plan(2);
	readData.init({ dataDirectory: "data" }, function(err, config) {
		t.notOk(err, "should not have an error");
		t.deepEqual(config.data, {}, "data should exist and be empty");
	});
});
test("json file is parsed into data", function(t) {
	mockFs.restore();
	mockFs({ "data": { "hello.json": "\"world\"" } });
	t.plan(2);
	readData.init({ dataDirectory: "data" }, function(err, config) {
		t.notOk(err, "should not have an error");
		t.deepEqual(config.data, { "hello": "world" }, "json file should be read into key of file name");
	});
});
test("nested json file is parsed into nested data structure", function(t) {
	mockFs.restore();
	mockFs({ "data/a/b/hello.json": "\"world\"" });
	t.plan(2);
	readData.init({ dataDirectory: "data" }, function(err, config) {
		t.notOk(err, "should not have an error");
		t.deepEqual(config.data, { "a": { "b": { "hello": "world" } } }, "json file should be read into key of file name");
	});
});
