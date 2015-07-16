"use strict";

var test = require("tape-catch");
var srcToDestPath = require("../lib/src-to-dest-path");

test("with src and dest folders should rewrite path", function(t) {
	t.plan(1);
	var dest = srcToDestPath("src", "dest", "src/test.txt");
	t.equal(dest, "dest/test.txt", "should rewrite src to dest path");
});

test("with src and dest folders should rewrite path", function(t) {
	t.plan(1);
	var dest = srcToDestPath("src", "dest", "src/a/test.txt");
	t.equal(dest, "dest/a/test.txt", "should rewrite src to dest path");
});
