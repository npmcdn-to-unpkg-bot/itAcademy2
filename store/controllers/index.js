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

		ItemSet.find({storeId: storeId})
		.then(function(docs) {
			var storeItems = [];

			Promise.map(docs, function(doc) {
				var itemDoc = {};

				itemDoc.price = doc.price;
				itemDoc.count = doc.count;

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
};
