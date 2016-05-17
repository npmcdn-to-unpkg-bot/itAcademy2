var _ = require('underscore');
var should = require('should');
var supertest = require('supertest');
var app = require('../../bank');

describe('server is running', function() {
    it('should go to the index page at /', function (done) {
        supertest(app)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                done();
            })
    })
})