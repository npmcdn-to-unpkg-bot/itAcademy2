var _ = require('underscore');
var should = require('should');
var supertest = require('supertest');
var app = require('../../store');

var config = require('../config');

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

  it('should get list of available stores in JSON', function (done) {
    this.timeout(4000);

    supertest(app)
    .get('/api/stores')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);

      res.status.should.equal(200);
      res.body.length.should.be.above(0);
      done();
    })
  });

  it('should return Array with product categories for a given store', function (done) {
    this.timeout(4000);

    supertest(app)
    .get('/api/stores')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err)
      var storeId = res.body[1]._id;

      supertest(app)
      .get('/api/getStoreCategories')
      .query({storeId: storeId})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        _.isArray(res.body).should.be.true();
        done();
      })

    })
  });

  it('should return Array with products for given store', function (done) {
    this.timeout(4000);

    supertest(app)
    .get('/api/stores')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err)
      var storeId = res.body[1]._id;

      supertest(app)
      .get('/api/store/')
      .query({storeId: storeId})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        _.isArray(res.body.products).should.be.true();
        done();
      })

    })
  });

  it('should return Array with products for given store filtered by 1 Category', function (done) {
    this.timeout(6000);

    supertest(app)
    .get('/api/stores')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err)
      var storeId = res.body[1]._id;

      supertest(app)
      .get('/api/store/')
      .query({storeId: storeId})
      .query({category: 'parfumes'})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        res.body.products[0].category.should.equal('parfumes');
        done();
      })

    })
  });

  it('should return Array with products for given store filtered by Multiple categories', function (done) {
    this.timeout(6000);

    supertest(app)
    .get('/api/stores')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err)
      var storeId = res.body[1]._id;

      supertest(app)
      .get('/api/store/')
      .query({storeId: storeId})
      .query('category=shoes&category=parfumes&category=apparel')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        _.isUndefined(_.find(res.body.products, function (item) {return item.category === 'parfumes'})).should.be.false();
        _.isUndefined(_.find(res.body.products, function (item) {return item.category === 'shoes'})).should.be.false();
        _.isUndefined(_.find(res.body.products, function (item) {return item.category === 'apparel'})).should.be.false();
        done();
      })

    })
  });

  it('should return Array with products for given store sorted by NAME: descending', function (done) {
    this.timeout(6000);

    supertest(app)
    .get('/api/stores')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err)
      var storeId = res.body[1]._id;

      supertest(app)
      .get('/api/store/')
      .query({storeId: storeId})
      .query('sort=name_desc')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        (res.body.products[0].title.toLowerCase() > res.body.products[1].title.toLowerCase()).should.be.true();
        done();
      })

    })
  });

  it('should return Array with products for given store sorted by PRICE: ascending', function (done) {
    this.timeout(6000);

    supertest(app)
    .get('/api/stores')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err)
      var storeId = res.body[1]._id;

      supertest(app)
      .get('/api/store/')
      .query({storeId: storeId})
      .query('sort=price_asc')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        (res.body.products[0].price < res.body.products[1].price).should.be.true();
        done();
      })

    })
  });

  it('should return Array with products for given store according to user SEARCH', function (done) {
    this.timeout(6000);

    supertest(app)
    .get('/api/stores')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err)
      var storeId = res.body[1]._id;

      supertest(app)
      .get('/api/store/')
      .query({storeId: storeId})
      .query('search=parfumes')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        res.body.products[0].title.indexOf('parfumes').should.be.above(-1);
        done();
      })

    })
  });

  it('should return Empty Array for given store according to user SEARCH that do not match any product', function (done) {
    this.timeout(6000);

    supertest(app)
    .get('/api/stores')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err)
      var storeId = res.body[1]._id;

      supertest(app)
      .get('/api/store/')
      .query({storeId: storeId})
      .query('search=abracadabra')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        _.isEmpty(res.body.products).should.be.true();
        done();
      })

    })
  });

})
