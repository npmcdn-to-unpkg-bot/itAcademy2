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

	app.get('/store/:id', function (req, res) {
		var storeId = req.params.id;
		var storeItems = [];
		var storeItemsIds = [];

		ItemSet.find({storeId: storeId}).exec()
		.then(function(docs) {
			storeItems = docs;

			return storeItems;
		})
		.then(function(storeItems) {
			_.each(storeItems, function(storeItem) {
				storeItemsIds.push(storeItem.itemId);
			})
			return storeItemsIds;
		})
		.then(function(storeItemsIds) {
			return Item.find({'_id': {$in: storeItemsIds}}).exec()
		})
		.then(function(items) {
			console.log(items);
			console.log(storeItems);

			_.each(storeItems, function(storeItem) {
				_.each(items, function(item) {
					console.log(storeItem.itemId == item._id);
				});
			});

			return res.json(storeItems);
		})
		.catch(function(err){
			return console.log(err);
		});

	});
};

/*		ItemSet.find({storeId: storeId})
		.then(function(docs) {
			var storeItems = [];

				Promise.map(docs, function(doc) {
				var itemDoc = {};

				itemDoc.price = doc.price;
				itemDoc.count = doc.count;
			}
				return Item.findOne({'_id': doc.itemId})
					.then(function(doc){

						itemDoc.title = doc.title;
						itemDoc.description = doc.description;
						itemDoc.image = doc.image;
						itemDoc.category = doc.category;

						storeItems.push(itemDoc);
					})
					.catch(function(err){
						return console.log(err);
					});
			})
			.then(function() {
				return res.json(storeItems);
			})
			.catch(function(err){
				return console.log(err);
			})
		});
	});
*/
