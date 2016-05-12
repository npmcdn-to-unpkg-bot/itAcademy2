var expect  = require("chai").expect;
var request = require("request");

describe ("Store Admin API", function() {
    describe("Home Page Test", function() {
        var url = "http://localhost:3003";

        it("returns status 200", function(done) {
            request(url, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });

    describe("Logout Test", function() {
        var url = "http://localhost:3003/store/logout";

        it("returns status 200", function(done) {
            request(url, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });
});
