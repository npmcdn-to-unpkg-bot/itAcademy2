var express = require('express');
var app = express();

var Store = require('../models').Store;
var ItemSet = require('../models').ItemSet;
var Item = require('../models').Item;

module.exports.set = function(app) {

	app.get('/stores', function (req, res) {

		Store.find({}, function(err, docs) {
			if (err) console.log(err);

			return res.json(docs);
		})

	});

	app.get('/products', function (req, res) {

		Item.find({storeId: storeId}, function(err, docs) {
			if (err) console.log(err);

			return res.json(docs);
		})

	});

}
