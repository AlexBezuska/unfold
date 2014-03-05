var rewire = require("rewire");
var fscloner = rewire("./fscloner");
var assert = require("assert");

var FS = require("fs-mock");

function mockFs(structure) {
	var fs = new FS(structure);
	fscloner.__set__("fs", fs);
	return fs;
}

describe("fscloner", function() {
	describe("clone", function() {
		describe("with nonexistant source folder", function() {
			it("should explode", function() {
				mockFs({})
				try {
					fscloner.clone("/src", "/dest", function(src, dest) {});
					throw new Error("should throw an exception");
				} catch(err) {
				}
			});
		});
		describe("with single file", function() {
			it("should call the copyFunc with the file", function(done) {
				mockFs({
					"src": {
						"a.txt": "hello world"
					}
				});
				fscloner.clone("/src", "/dest", function(src, dest) {
					assert.equal("/src/a.txt", src);
					assert.equal("/dest/a.txt", dest);
					done();
				});
			});
		});
	});
});
