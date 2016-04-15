var express = require('express');
var app = express();

var Store = require('../models').Store;
var ItemSet = require('../models').ItemSet;
var Item = require('../models').Item;

var _ = require('underscore');
var Promise = require('bluebird');

module.exports.set = function(app) {

	app.get('/stores', function (req, res) {

		Store.find({}, function(err, docs) {
			if (err) console.log(err);

			return res.json(docs);
		})

	});

	// created itemsToSend in order to form and populate array of products for the store
	app.get('/store/:id', function (req, res) {
		var storeId = req.params.id;
		var storeItems = [];

		ItemSet.find({storeId: storeId})
		.then(function(data) {
			storeItems = data;
			var storeItemsIds = _.map(storeItems, function(storeItem) {
				return storeItem.itemId
			})
			return Item.find({'_id': {$in: storeItemsIds}})
		})
		.then(function(items) {
			var itemsToSend = []

			_.each(storeItems, function(storeItem) {
				storeItem = JSON.parse(JSON.stringify(storeItem));
				_.each(items, function(item) {
					item = JSON.parse(JSON.stringify(item));
					if (storeItem.itemId == item._id) {
						var itemToSend = {
							title: item.title,
							description: item.description,
							image: item.image,
							category: item.category,
							price: storeItem.price,
							count: storeItem.count
						};

						itemsToSend.push(itemToSend);
					};
				});
			});

			return res.json(itemsToSend);
		})
		.catch(function(err){
			return console.log(err);
		});

	});

};
