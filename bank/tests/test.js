var _ = require('underscore');
var should = require('should');
var supertest = require('supertest');
var app = require('../../bank');

console.log(app);

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

    it('should check /checkBalance', function(done) {
        supertest(app)
            .get('/checkBalance')
            .query({'login': 'test102',
            'password': 'test'})
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.length.should.be.above(0);
                done();
        })
    })
})