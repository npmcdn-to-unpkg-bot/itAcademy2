'use strict';

var mongoose = require('mongoose'),
  Product = mongoose.model('Product');

/**
 * Find product by id
 */
exports.product = function(req, res, next, id) {
  Product.load(id, function(err, product) {
    if (err) return next(err);
    if (!product) return next(new Error('Failed to load product ' + id));
    req.product = product;
    next();
  });
};

/**
 * Create a product
 */
exports.create = function(req, res) {
  var product = new Product(req.body);
  product.creator = req.user;

  product.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(product);
    }
  });
};

/**
 * Update a product
 */
exports.update = function(req, res) {
  var product = req.product;
  product.title = req.body.title;
  product.content = req.body.content;
  product.price = req.body.price;
  product.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(product);
    }
  });
};

/**
 * Delete a product
 */
exports.destroy = function(req, res) {
  var product = req.product;

  product.remove(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(product);
    }
  });
};

/**
 * Show a product
 */
exports.show = function(req, res) {
  res.json(req.product);
};

/**
 * List of Products
 */
exports.all = function(req, res) {
  Product.find().sort('-created').populate('creator', 'storename').exec(function(err, products) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(products);
    }
  });
};
