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

		ItemSet.find({storeId: storeId}).lean()
		.then(function(data) {
			storeItems = data;
			var storeItemsIds = _.map(storeItems, function(storeItem) {
				return storeItem.itemId
			})
			return Item.find({'_id': {$in: storeItemsIds}}).lean()
		})
		.then(function(items) {
			var result = _.map(storeItems, function(storeItem) {
				var item =  _.find(items, function(item) {
					return storeItem.itemId.toString() === item._id.toString()
				});
				return _.extend({}, storeItem, _.pick(item, 'title', 'description', 'category', 'image'));
			});

			return res.json(result);
		})
		.catch(function(err){
			return console.log(err);
		});

	});

};
