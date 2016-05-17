'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function(app) {
  // Store Routes
  var stores = require('../controllers/stores');
  app.post('/auth/stores', stores.create);
  app.get('/auth/stores/:userId', stores.show);

  // Check if storename is available
  // todo: probably should be a query on stores
  app.get('/auth/check_storename/:storename', stores.exists);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.del('/auth/session', session.logout);

  // Product Routes
  var products = require('../controllers/products');
  app.get('/api/products', products.all);
  app.post('/api/products', auth.ensureAuthenticated, products.create);
  app.get('/api/products/:productId', products.show);
  app.put('/api/products/:productId', auth.ensureAuthenticated, auth.product.hasAuthorization, products.update);
  app.del('/api/products/:productId', auth.ensureAuthenticated, auth.product.hasAuthorization, products.destroy);

  //Setting up the productId param
  app.param('productId', products.product);

  // Angular Routes
  app.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('store', JSON.stringify(req.user.user_info));
    }

    res.render('index.html');
  });

}