var express = require('express');
var app = express();

var Store = require('../models').Store;
var ItemSet = require('../models').ItemSet;
var Item = require('../models').Item;
var User = require('../models').User;

var _ = require('underscore');
var Promise = require('bluebird');

var passport = require('../libs/passport');

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
			});
			return Item.find({'_id': {$in: storeItemsIds}}).lean();
		})
		.then(function(items) {
			var result = _.map(storeItems, function(storeItem) {
			   	var item =  _.find(items, function(item) {
			     	return storeItem.itemId.toString() === item._id.toString()
			   	});
			  	return _.extend({}, storeItem, _.pick(item, 'title', 'description', 'image', 'category'));
			});

			return res.send(result);
		})
		.catch(function(err){
			return console.log(err);
		});
	});

	app.post('/add_user', function (req, res) {
		var user = {
			storeId: req.body.storeId,
			name: req.body.name,
			surname: req.body.surname,
			email: req.body.email,
			password: req.body.password,
			class: 'registered'
		};

		User.create(user, function(err, data) {
			if (err) {res.status(400).send({error: err.message})};

			console.log(data);
		});
	})

	app.all('*', function(req, res, next) {
		// Just send the index.html for other files to support HTML5Mode
		res.sendFile('index.html', { root:  __dirname + '/../public' });
	});
};
