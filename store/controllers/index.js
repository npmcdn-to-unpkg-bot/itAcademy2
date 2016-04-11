var express = require('express');
var app = express();

var Store = require('../models').Store;

var Item = require('../models').Item;

module.exports.set = function(app) {
	app.get('/products', function (req, res) {
		var storeId = '5708e6574aee4ee0150a6493';

		Item.find({storeId: storeId}, function(err, docs) {
			if (!err) console.log(err);

			return res.json(docs);
		})

	});

}
