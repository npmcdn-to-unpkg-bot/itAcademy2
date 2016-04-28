var express = require('express');
var app = express();

var Store = require('../models').Store;
var ItemSet = require('../models').ItemSet;
var Item = require('../models').Item;
var User = require('../models').User;

var _ = require('underscore');
var Promise = require('bluebird');

module.exports.set = function(app) {
	require('./passport')(app);

	app.get('/api/stores', function (req, res) {

		Store.find({}, function(err, docs) {
			if (err) console.log(err);

			return res.json(docs);
		})

	});

	// created itemsToSend in order to form and populate array of products for the store
	app.get('/api/store/:id*', function (req, res) {
		var storeId = req.params.id;
		var category = req.query.category;
		var storeItems = [];

		ItemSet.find({storeId: storeId}).lean()
		.then(function(data) {
			storeItems = data;
			var storeItemsIds = _.map(storeItems, function(storeItem) {
				return storeItem.itemId
			});

			var filter = {'_id': {$in: storeItemsIds}};

			if (category) {
				_.extend(filter, {'category': category})
			}
			return Item.find(filter).lean();
		})
		.then(function(items) {
			var result = _.map(items, (item) => {
				var storeItem = _.find(storeItems, (storeItem) => {
					return storeItem.itemId.toString() === item._id.toString()
				});
				return _.extend(_.pick(item, 'title', 'description', 'image', 'category'), storeItem);
			})

			if (category) {
				return res.send(result);
			} else {
				var categories = _.uniq(_.map(result, (item) => {
					return item.category;
				}));

				return res.send([result, categories]);
			}
		})
		.catch(function(err){
			return console.log(err);
		});

	});

	app.all('*', function(req, res, next) {
		// Just send the index.html for other files to support HTML5Mode
		res.sendFile('index.html', { root:  __dirname + '/../public' });
	});
};

/* LOGIN - LOGOUT simple version
	app.post('/api/add_user', function (req, res) {
		var user = {
			storeId: req.body.storeId,
			name: req.body.name,
			surname: req.body.surname,
			email: req.body.email,
			password: req.body.password,
			class: 'registered'
		};

		User.create(user)
		.then(function(data) {
			var user = _.pick(data, 'name', 'surname', 'email', 'storeId', 'cart');

			return res.send(user);
		})
		.catch(function(err){
			return res.status(400).send({error: err.message})
		});

	});

	app.post('/api/login_user', function (req, res) {
		var user = {
			storeId: req.body.storeId,
			email: req.body.email,
			password: req.body.password
		};

		//console.log(user);

		User.findOne(user)
		.then(function(data) {
			var user = _.pick(data, 'name', 'surname', 'email', 'storeId', 'cart');

			return res.send(user);
		})
		.catch(function(err){
			return res.status(400).send({error: err.message})
		});

	});
	*/
