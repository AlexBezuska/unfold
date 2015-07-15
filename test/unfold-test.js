"use strict";

var unfold = require("../lib/unfold");
var mockFs = require("mock-fs");
var test = require("tape-catch");

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
