#!/usr/bin/env node
"use strict";

var async = require("async");
var fs = require("fs");
var unfold = require("../lib/unfold");

function asyncJsonParse(json, callback) {
	try {
		callback(undefined, JSON.parse(json));
	} catch (e) {
		callback(e);
	}
}

function main(argv) {
	var args = argv.slice(2);
	if (args.length === 0) {
		console.error("Usage: unfold config [...]");
		return;
	}
	var run = async.seq(fs.readFile, asyncJsonParse, unfold);
	async.each(args, run, function(err) {
		if (err) {
			console.error(err);
			return;
		}
	});
}

main(process.argv);
