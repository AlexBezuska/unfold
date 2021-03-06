"use strict";

var assert = require("assert");
var mockFs = require("mock-fs");
var config = require("./config");

describe("config", function() {
	afterEach(function() {
		mockFs.restore();
	});
	describe("load", function() {
		describe("with nonexistant file", function() {
			it("should return a failing promise", function(done) {
				mockFs({});
				config.load("/config.json").fail(function() {
					done();
				});
			});
		});
		describe("with an existing JSON file", function() {
			it("should return a parsed object", function(done) {
				mockFs({
					"/config.json": "{\"sourceDirectory\": \"/src\", \"destinationDirectory\": \"/dest\"}"
				});
				config.load("/config.json").done(function(cfg) {
					assert.ok(cfg);
					done();
				});
			});
			describe("when the file is not JSON", function() {
				it("should return a failing promise", function(done) {
					mockFs({
						"/config.json": "derp"
					});
					config.load("/config.json").fail(function() {
						done();
					});
				});
			});
			describe("when missing the sourceDirectory property", function() {
				it("should return a failing promise", function(done) {
					mockFs({
						"/config.json": "{\"destinationDirectory\": \"/src\"}"
					});
					config.load("/config.json").fail(function(reason) {
						assert.notEqual(-1, reason.message.indexOf("sourceDirectory"));
						done();
					});
				});
			});
			describe("when missing the destinationDirectory property", function() {
				it("should return a failing promise", function(done) {
					mockFs({
						"/config.json": "{\"sourceDirectory\": \"/src\"}"
					});
					config.load("/config.json").fail(function(reason) {
						assert.notEqual(-1, reason.message.indexOf("destinationDirectory"));
						done();
					});
				});
			});
			describe("with a valid dataDirectory", function() {
				describe("containing a JSON file", function() {
					it("should load the JSON file into the config data", function(done) {
						mockFs({
							"/config.json": JSON.stringify({
								"sourceDirectory": "/src",
								"destinationDirectory": "/dest",
								"dataDirectory": "/data"
							}),
							"/data": {
								"greetings.json": JSON.stringify(["hello world"])
							}
						});
						config.load("/config.json").done(function(cfg) {
							assert.equal(cfg.data.greetings[0], "hello world");
							done();
						});
					});
				});
				describe("containing a non-JSON file", function() {
					it("should ignore the file", function(done) {
						mockFs({
							"/config.json": JSON.stringify({
								"sourceDirectory": "/src",
								"destinationDirectory": "/dest",
								"dataDirectory": "/data"
							}),
							"/data": {
								"greetings.derp": ""
							}
						});
						config.load("/config.json").done(function(cfg) {
							assert.equal(cfg.data.greetings, undefined);
							done();
						});
					});
				});
			});
		});
	});
	describe("forSourceFile", function() {
		describe("with global data and no per-page data", function() {
			it("should return the global data", function() {
				var cfg = {
					data: {
						name: "world"
					}
				};
				var actual = config.forSourceFile("/src.txt", cfg);
				assert.equal(actual.name, "world");
			});
		});
		describe("with per-page data", function() {
			it("should override the global data", function() {
				var cfg = {
					pages: {
						"/src.txt": {
							name: "dude"
						}
					},
					data: {
						name: "world"
					}
				};
				var actual = config.forSourceFile("/src.txt", cfg);
				assert.equal(actual.name, "dude");
			});
			it("should not clobber a property that is not overridden", function() {
				var cfg = {
					pages: {
						"/src.txt": {
							other: "dude"
						}
					},
					data: {
						name: "world"
					}
				};
				var actual = config.forSourceFile("/src.txt", cfg);
				assert.equal(actual.name, "world");
			});
			it("should not modify the original data", function() {
				var cfg = {
					pages: {
						"/src.txt": {
							name: "dude"
						}
					},
					data: {
						name: "world"
					}
				};
				config.forSourceFile("/src.txt", cfg);
				assert.equal(cfg.data.name, "world");
			});
		});
	});
});
